import express from "express";
import {
  allowedClientStatuses,
  allowedAppointmentPrepKeys,
  appointmentFitsSchedulingWindow,
  appointments,
  cleanAppointmentPrepChecklist,
  cleanAppointmentPayload,
  cleanString,
  clients,
  completeOutcomeTasksForAppointment,
  completeRescheduleTasksForAppointment,
  createGeneratedTaskIfMissing,
  fetchAllDocuments,
  findAppointmentConflict,
  firestore,
  formatAppointmentTimeValue,
  loadSchedulingSettings,
  normalizedLookupKey,
  persistClinicAppointmentCalendarSync,
  performanceEvaluationResponses,
  requireAuth,
  resolveAppointmentImportClients,
  schedulingWindowError,
  serializeSchedulingSettings,
  todayDateString,
  toAppointment,
  toClient,
  toScheduleClient
} from "../lib/core.js";

const router = express.Router();

function appointmentCompletionValidationError(payload = {}) {
  if (!cleanString(payload.appointmentNote)) {
    return "Add an appointment note before completing the appointment.";
  }

  const clientIds = Array.isArray(payload.clientIds) ? payload.clientIds.filter(Boolean) : [];
  const clientNames = Array.isArray(payload.clientNames) ? payload.clientNames.filter(Boolean) : [];
  const participants = clientIds.length
    ? clientIds.map((clientId, index) => ({
      clientId,
      clientName: clientNames[index] || `Child ${index + 1}`
    }))
    : clientNames.map((clientName) => ({ clientId: "", clientName }));
  const participantGoals = Array.isArray(payload.participantGoals) ? payload.participantGoals : [];

  if (participants.length === 1 && !participantGoals.length && payload.goalResult) {
    return "";
  }

  for (const participant of participants) {
    const result = participantGoals.find((entry) => (
      participant.clientId
        ? entry.clientId === participant.clientId
        : cleanString(entry.clientName).toLowerCase() === participant.clientName.toLowerCase()
    ));
    if (!result?.goalResult) {
      return `Choose a Goal Result for ${participant.clientName}.`;
    }
  }

  return "";
}

router.get("/api/schedule/clients", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(clients);
    response.json({ clients: documents.map(toScheduleClient) });
  } catch (error) {
    next(error);
  }
});

router.get("/api/schedule/settings", requireAuth, async (_request, response, next) => {
  try {
    response.json({
      schedulingSettings: serializeSchedulingSettings(await loadSchedulingSettings())
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/schedule/clients/:clientId/outcome", requireAuth, async (request, response, next) => {
  try {
    const clientId = cleanString(request.params.clientId);
    const status = cleanString(request.body.status);
    if (!clientId) {
      response.status(400).json({ error: "Client ID is required." });
      return;
    }
    if (!allowedClientStatuses.has(status)) {
      response.status(400).json({ error: "Client status is not valid." });
      return;
    }

    const docRef = clients.doc(clientId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Client was not found." });
      return;
    }

    const now = new Date().toISOString();
    const client = toClient(snapshot);
    const clientName = `${client.firstName || ""} ${client.lastName || ""}`.trim() || "client";
    const updates = {
      status,
      updatedAt: now,
      updatedBy: request.user.email
    };
    for (const field of ["mostRecentAppointmentDate", "graduationDate", "currentLesson"]) {
      if (Object.hasOwn(request.body, field)) {
        updates[field] = cleanString(request.body[field]);
      }
    }
    await docRef.update(updates);

    let workflowTask = null;
    let workflowTaskCreated = false;
    const workflowReason = cleanString(request.body.workflowReason);
    if (status === "Needs Reschedule" && ["Completed", "No-show", "Canceled"].includes(workflowReason)) {
      const isNoShow = workflowReason === "No-show";
      const result = await createGeneratedTaskIfMissing({
        title: isNoShow ? `Call ${clientName} to reschedule` : `Schedule next appointment for ${clientName}`,
        type: isNoShow ? "Call" : "Task",
        status: "Open",
        priority: "Normal",
        dueDate: todayDateString(),
        assignedTo: cleanString(request.body.staffMember),
        clientId,
        clientName,
        appointmentId: cleanString(request.body.appointmentId),
        source: "Workflow Automation",
        notes: `${workflowReason} appointment${cleanString(request.body.appointmentDate) ? ` on ${cleanString(request.body.appointmentDate)}` : ""}; another appointment is needed.`
      }, request.user.email, now);
      workflowTask = result.task;
      workflowTaskCreated = result.created;
    }

    if (workflowReason === "Completed" && cleanString(request.body.appointmentType) === "Enrollment") {
      const responseDocuments = await fetchAllDocuments(performanceEvaluationResponses.where("clientId", "==", clientId));
      const enrollmentComplete = responseDocuments.some((document) => {
        const record = document.data();
        return record.status === "Complete"
          && record.administrationPoint === "Enrollment"
          && (record.instrumentName === "Program Enrollment" || String(record.instrumentId || "").startsWith("clinic-enrollment-"));
      });
      if (!enrollmentComplete) {
        const result = await createGeneratedTaskIfMissing({
          title: `Complete Program Enrollment for ${clientName}`,
          type: "Form",
          status: "Open",
          priority: "High",
          dueDate: todayDateString(),
          assignedTo: cleanString(request.body.staffMember),
          clientId,
          clientName,
          appointmentId: cleanString(request.body.appointmentId),
          source: "Workflow Automation",
          notes: "The Enrollment appointment was completed, but the Program Enrollment form is not complete."
        }, request.user.email, now);
        workflowTask = result.task;
        workflowTaskCreated = result.created;
      }
    }

    response.json({
      client: toScheduleClient(await docRef.get()),
      workflowTask,
      workflowTaskCreated
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/appointments", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(appointments.orderBy("appointmentDate", "desc"));

    response.json({
      appointments: documents.map(toAppointment)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/appointments", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanAppointmentPayload(request.body);
    const now = new Date().toISOString();

    if ((!payload.clientIds.length && !payload.clientNames.length) || !payload.appointmentDate || !payload.appointmentTime) {
      response.status(400).json({
        error: "Client or referral name, appointment date, and appointment time are required."
      });
      return;
    }

    if (payload.status === "Completed") {
      const completionError = appointmentCompletionValidationError(payload);
      if (completionError) {
        response.status(400).json({ error: completionError });
        return;
      }
    }

    if (!payload.clientNames.length) {
      const clientNames = [];
      for (const clientId of payload.clientIds) {
        const clientSnapshot = await clients.doc(clientId).get();
        if (clientSnapshot.exists) {
          const client = toClient(clientSnapshot);
          clientNames.push(`${client.firstName || ""} ${client.lastName || ""}`.trim());
        }
      }
      payload.clientNames = clientNames;
      payload.clientName = clientNames[0] || "";
    }

    const settings = await loadSchedulingSettings();
    payload.location = payload.location || settings.clinicLocation;

    if (!appointmentFitsSchedulingWindow(payload, settings)) {
      response.status(400).json({
        error: schedulingWindowError(payload, settings)
      });
      return;
    }

    const conflict = await findAppointmentConflict(payload);

    if (conflict) {
      response.status(409).json({
        error: `That time overlaps ${conflict.clientName || "another appointment"} at ${formatAppointmentTimeValue(conflict.appointmentTime)}. Choose a different time or add the client to that appointment.`
      });
      return;
    }

    const docRef = await appointments.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    let created = await docRef.get();
    const calendarSync = await persistClinicAppointmentCalendarSync(
      docRef,
      toAppointment(created),
      request.user.email
    );
    if (!["inactive", "paused"].includes(calendarSync.state)) created = await docRef.get();
    const completedRescheduleTasks = await completeRescheduleTasksForAppointment(payload, request.user.email, now);

    response.status(201).json({
      appointment: toAppointment(created),
      completedRescheduleTasks,
      calendarSync
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/appointments/import", requireAuth, async (request, response, next) => {
  try {
    const appointmentRows = Array.isArray(request.body.appointments) ? request.body.appointments : [];

    if (!appointmentRows.length) {
      response.status(400).json({
        error: "No appointments were provided for import."
      });
      return;
    }

    if (appointmentRows.length > 450) {
      response.status(400).json({
        error: "Import is limited to 450 appointments at a time."
      });
      return;
    }

    const clientDocuments = await fetchAllDocuments(clients);
    const clientsByName = new Map();

    clientDocuments.forEach((doc) => {
      const client = toClient(doc);
      const key = normalizedLookupKey(`${client.firstName || ""} ${client.lastName || ""}`);
      if (key && !clientsByName.has(key)) {
        clientsByName.set(key, client);
      }
    });

    const now = new Date().toISOString();
    const batch = firestore.batch();
    const skipped = [];
    const settings = await loadSchedulingSettings();
    let importedCount = 0;

    for (const [index, row] of appointmentRows.entries()) {
      const payload = cleanAppointmentPayload(row);
      const rowNumber = Number(row.rowNumber) || index + 1;

      const clientError = await resolveAppointmentImportClients(payload, clientsByName, { allowNameOnly: true });

      if (clientError || !payload.appointmentDate || !payload.appointmentTime) {
        skipped.push({
          rowNumber,
          reason: clientError || "Appointment date and time are required."
        });
        continue;
      }

      if (!appointmentFitsSchedulingWindow(payload, settings)) {
        skipped.push({
          rowNumber,
          reason: schedulingWindowError(payload, settings)
        });
        continue;
      }

      const conflict = await findAppointmentConflict(payload);

      if (conflict) {
        skipped.push({
          rowNumber,
          reason: `Overlaps ${conflict.clientName || "another appointment"} at ${formatAppointmentTimeValue(conflict.appointmentTime)}.`
        });
        continue;
      }

      const docRef = appointments.doc();
      batch.set(docRef, {
        ...payload,
        importedFrom: cleanString(row.importSource) || "Appointments CSV",
        importedAt: now,
        createdAt: now,
        updatedAt: now,
        createdBy: request.user.email
      });
      importedCount += 1;
    }

    if (importedCount) {
      await batch.commit();
    }

    response.status(201).json({
      importedCount,
      skipped
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/appointments/:appointmentId", requireAuth, async (request, response, next) => {
  try {
    const appointmentId = cleanString(request.params.appointmentId);

    if (!appointmentId) {
      response.status(400).json({
        error: "Appointment ID is required."
      });
      return;
    }

    const docRef = appointments.doc(appointmentId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Appointment was not found."
      });
      return;
    }

    const payload = cleanAppointmentPayload(request.body);

    if ((!payload.clientIds.length && !payload.clientNames.length) || !payload.appointmentDate || !payload.appointmentTime) {
      response.status(400).json({
        error: "Client or referral name, appointment date, and appointment time are required."
      });
      return;
    }

    const wasCompleted = cleanString(snapshot.data()?.status).toLowerCase() === "completed";
    if (!wasCompleted && payload.status === "Completed") {
      const completionError = appointmentCompletionValidationError(payload);
      if (completionError) {
        response.status(400).json({ error: completionError });
        return;
      }
    }

    const now = new Date().toISOString();
    const settings = await loadSchedulingSettings();
    payload.location = payload.location || settings.clinicLocation;

    if (!appointmentFitsSchedulingWindow(payload, settings)) {
      response.status(400).json({
        error: schedulingWindowError(payload, settings)
      });
      return;
    }

    const conflict = await findAppointmentConflict(payload, appointmentId);

    if (conflict) {
      response.status(409).json({
        error: `That time overlaps ${conflict.clientName || "another appointment"} at ${formatAppointmentTimeValue(conflict.appointmentTime)}. Choose a different time or add the client to that appointment.`
      });
      return;
    }

    await docRef.update({
      ...payload,
      updatedAt: now,
      updatedBy: request.user.email
    });
    let updated = await docRef.get();
    const calendarSync = await persistClinicAppointmentCalendarSync(
      docRef,
      toAppointment(updated),
      request.user.email
    );
    if (!["inactive", "paused"].includes(calendarSync.state)) updated = await docRef.get();
    const completedRescheduleTasks = await completeRescheduleTasksForAppointment(payload, request.user.email, now);
    const completedOutcomeTasks = await completeOutcomeTasksForAppointment({
      ...payload,
      id: appointmentId
    }, request.user.email, now);

    response.json({
      appointment: toAppointment(updated),
      completedRescheduleTasks,
      completedOutcomeTasks,
      calendarSync
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/appointments/:appointmentId/prep", requireAuth, async (request, response, next) => {
  try {
    const appointmentId = cleanString(request.params.appointmentId);
    const key = cleanString(request.body?.key);

    if (!appointmentId) {
      response.status(400).json({ error: "Appointment ID is required." });
      return;
    }

    if (!allowedAppointmentPrepKeys.has(key) || typeof request.body?.checked !== "boolean") {
      response.status(400).json({ error: "A valid prep item and checked state are required." });
      return;
    }

    const docRef = appointments.doc(appointmentId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({ error: "Appointment was not found." });
      return;
    }

    const prepChecklist = {
      ...cleanAppointmentPrepChecklist(snapshot.data().prepChecklist),
      [key]: request.body.checked
    };

    await docRef.update({
      prepChecklist,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });

    response.json({ prepChecklist });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/appointments/:appointmentId", requireAuth, async (request, response, next) => {
  try {
    const appointmentId = cleanString(request.params.appointmentId);

    if (!appointmentId) {
      response.status(400).json({
        error: "Appointment ID is required."
      });
      return;
    }

    const docRef = appointments.doc(appointmentId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({
        error: "Appointment was not found."
      });
      return;
    }

    const calendarSync = await persistClinicAppointmentCalendarSync(
      docRef,
      { ...toAppointment(snapshot), status: "Canceled" },
      request.user.email
    );
    await docRef.delete();

    response.json({
      ok: true,
      calendarSync
    });
  } catch (error) {
    next(error);
  }
});

export { appointmentCompletionValidationError };

export default router;
