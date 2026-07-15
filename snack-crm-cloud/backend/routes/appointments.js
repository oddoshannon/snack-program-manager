import express from "express";
import {
  allowedAppointmentPrepKeys,
  appointmentFitsSchedulingWindow,
  appointments,
  cleanAppointmentPrepChecklist,
  cleanAppointmentPayload,
  cleanString,
  clients,
  completeRescheduleTasksForAppointment,
  fetchAllDocuments,
  findAppointmentConflict,
  firestore,
  formatAppointmentTimeValue,
  loadSchedulingSettings,
  normalizedLookupKey,
  requireAuth,
  resolveAppointmentImportClients,
  schedulingWindowError,
  toAppointment,
  toClient
} from "../lib/core.js";

const router = express.Router();

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
    const created = await docRef.get();
    const completedRescheduleTasks = await completeRescheduleTasksForAppointment(payload, request.user.email, now);

    response.status(201).json({
      appointment: toAppointment(created),
      completedRescheduleTasks
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

    const now = new Date().toISOString();
    const settings = await loadSchedulingSettings();

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
    const updated = await docRef.get();
    const completedRescheduleTasks = await completeRescheduleTasksForAppointment(payload, request.user.email, now);

    response.json({
      appointment: toAppointment(updated),
      completedRescheduleTasks
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

    await docRef.delete();

    response.json({
      ok: true
    });
  } catch (error) {
    next(error);
  }
});

export default router;
