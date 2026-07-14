import express from "express";
import {
  addDaysToDateString,
  appointmentBlocksSchedule,
  appointmentFitsSchedulingWindow,
  appointments,
  cleanPublicBookingPayload,
  cleanString,
  clients,
  createPublicManageToken,
  existingPublicManageClientRefs,
  findAppointmentConflict,
  firestore,
  formatAppointmentTimeValue,
  isPublicBookableDate,
  isPublicBookingDateInRange,
  loadPublicManagedAppointment,
  loadSchedulingSettings,
  normalizeAppointmentTimeValue,
  parseDateOnly,
  publicAppointmentCanManage,
  publicAppointmentDraft,
  publicAvailabilityDefaultDays,
  publicAvailabilityMaxDays,
  publicBookingRateLimit,
  publicBookingServiceFromAppointment,
  publicBookingServiceFromId,
  publicBookingServices,
  publicManageTokenFromRequest,
  publicManageTokenHash,
  publicSlotValuesForDate,
  schedulingWindowEndLabel,
  schedulingWindowError,
  serializePublicManagedBooking,
  tasks,
  toAppointment,
  todayDateString,
  validatePublicBookingPayload
} from "../lib/core.js";

const router = express.Router();

router.get("/api/public/booking-options", async (_request, response, next) => {
  try {
    const settings = await loadSchedulingSettings();

    response.json({
      services: publicBookingServices,
      scheduling: {
        startTime: formatAppointmentTimeValue(settings.bookableStartTime),
        endTime: schedulingWindowEndLabel(settings),
        weekdays: settings.weekdays
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/public/availability", async (request, response, next) => {
  try {
    const service = publicBookingServiceFromId(request.query.serviceId);
    const requestedStart = cleanString(request.query.startDate || request.query.start) || todayDateString();
    const startDate = parseDateOnly(requestedStart) ? requestedStart : todayDateString();
    const requestedDays = Number(request.query.days);
    const days = Number.isInteger(requestedDays)
      ? Math.min(Math.max(requestedDays, 1), publicAvailabilityMaxDays)
      : publicAvailabilityDefaultDays;
    const settings = await loadSchedulingSettings();
    const endDate = addDaysToDateString(startDate, days - 1);
    const snapshot = await appointments
      .where("appointmentDate", ">=", startDate)
      .where("appointmentDate", "<=", endDate)
      .get();
    const existingAppointmentsByDate = new Map();

    for (const doc of snapshot.docs) {
      const appointment = toAppointment(doc);

      if (!appointmentBlocksSchedule(appointment)) {
        continue;
      }

      const dateAppointments = existingAppointmentsByDate.get(appointment.appointmentDate) || [];
      dateAppointments.push(appointment);
      existingAppointmentsByDate.set(appointment.appointmentDate, dateAppointments);
    }

    const dates = [];

    for (let offset = 0; offset < days; offset += 1) {
      const date = addDaysToDateString(startDate, offset);

      if (!date || !isPublicBookableDate(date, settings) || !isPublicBookingDateInRange(date)) {
        continue;
      }

      dates.push({
        date,
        slots: publicSlotValuesForDate(date, service, existingAppointmentsByDate.get(date) || [], settings)
      });
    }

    response.json({
      service,
      dates
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/public/bookings", publicBookingRateLimit, async (request, response, next) => {
  try {
    const payload = cleanPublicBookingPayload(request.body);
    const now = new Date().toISOString();
    const today = todayDateString();
    const clientNames = payload.children.map((child) => child.childName || `${child.firstName} ${child.lastName}`.trim()).filter(Boolean);
    const clientName = clientNames[0] || "";

    const settings = await loadSchedulingSettings();

    if (!validatePublicBookingPayload(payload, response, settings)) {
      return;
    }

    const appointmentDraft = publicAppointmentDraft({
      service: payload.service,
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      clientName
    });

    if (!appointmentFitsSchedulingWindow(appointmentDraft, settings)) {
      response.status(400).json({
        error: schedulingWindowError(appointmentDraft, settings)
      });
      return;
    }

    const conflict = await findAppointmentConflict(appointmentDraft);

    if (conflict) {
      response.status(409).json({
        error: "That time was just booked. Please choose another open time."
      });
      return;
    }

    const clientRefs = payload.children.map(() => clients.doc());
    const appointmentRef = appointments.doc();
    const taskRef = tasks.doc();
    const publicManageToken = createPublicManageToken();
    const manageTokenHash = publicManageTokenHash(publicManageToken);
    const publicNotes = [
      "Booked through the public SNACK booking page.",
      clientNames.length > 1 ? `Children: ${clientNames.join(", ")}.` : "",
      `YCCO member: ${payload.yccoMember ? "Yes" : "No"}.`,
      payload.yccoMember && payload.yccoId ? `YCCO ID: ${payload.yccoId}.` : "",
      payload.notes ? `Family notes: ${payload.notes}` : ""
    ].filter(Boolean).join(" ");
    const clientRecords = payload.children.map((child, index) => ({
      firstName: child.firstName,
      lastName: child.lastName,
      parentName: payload.parentName,
      dateOfBirth: child.dateOfBirth,
      gender: child.gender,
      phone: payload.phone,
      email: payload.email,
      preferredLanguage: payload.preferredLanguage,
      preferredContactMethod: payload.preferredContactMethod,
      addressStreet: payload.address,
      emailOptOut: !payload.consentReminders,
      textOptOut: !payload.consentReminders,
      ycco: payload.yccoMember,
      yccoId: payload.yccoId,
      referralType: "Self Referral",
      referralSource: "Public booking",
      referralDate: today,
      firstAppointmentDate: payload.appointmentDate,
      status: "Scheduled",
      notes: publicNotes,
      siblingIds: clientRefs.map((ref, siblingIndex) => siblingIndex === index ? "" : ref.id).filter(Boolean),
      publicBookingServiceId: payload.service.id,
      publicBookingServiceLabel: payload.service.label,
      createdVia: "Public booking",
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    }));
    const taskClientName = clientNames.length > 1 ? clientNames.join(", ") : clientName;
    const appointmentRecord = {
      clientId: clientRefs[0].id,
      clientIds: clientRefs.map((ref) => ref.id),
      clientName,
      clientNames,
      appointmentDate: payload.appointmentDate,
      appointmentTime: payload.appointmentTime,
      appointmentType: payload.service.appointmentType,
      durationMinutes: payload.service.durationMinutes,
      publicBookingServiceId: payload.service.id,
      publicBookingServiceLabel: payload.service.label,
      status: "Scheduled",
      lesson: "",
      goal: "",
      staffMember: payload.service.staffMember || "Cynthia Esparza",
      notes: publicNotes,
      createdVia: "Public booking",
      publicManageTokenHash: manageTokenHash,
      publicManageTokenCreatedAt: now,
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const taskRecord = {
      title: `Review public booking for ${taskClientName}`,
      type: "Task",
      status: "Open",
      priority: "Normal",
      dueDate: today,
      dueTime: "",
      assignedTo: "",
      clientId: clientRefs[0].id,
      clientName: taskClientName,
      appointmentId: appointmentRef.id,
      referralId: "",
      source: "Public Booking",
      notes: [
        `Booked ${payload.service.label} for ${payload.appointmentDate} at ${formatAppointmentTimeValue(payload.appointmentTime)}.`,
        clientNames.length > 1 ? `Multiple children: ${clientNames.join(", ")}.` : "",
        "Review for duplicate records, sibling needs, forms, and appointment prep."
      ].filter(Boolean).join(" "),
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const batch = firestore.batch();

    clientRefs.forEach((clientRef, index) => {
      batch.set(clientRef, clientRecords[index]);
    });
    batch.set(appointmentRef, appointmentRecord);
    batch.set(taskRef, taskRecord);
    await batch.commit();

    response.status(201).json({
      booking: {
        clientName: clientNames.length > 1 ? clientNames.join(", ") : clientName,
        clientNames,
        serviceLabel: payload.service.label,
        appointmentDate: payload.appointmentDate,
        appointmentTime: payload.appointmentTime,
        appointmentTimeLabel: formatAppointmentTimeValue(payload.appointmentTime),
        durationMinutes: payload.service.durationMinutes,
        appointmentId: appointmentRef.id,
        manageToken: publicManageToken
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/public/bookings/:appointmentId", async (request, response, next) => {
  try {
    const appointment = await loadPublicManagedAppointment(request.params.appointmentId, publicManageTokenFromRequest(request));

    if (!appointment) {
      response.status(404).json({
        error: "We could not find that appointment. Please call or text (971) 202-0232."
      });
      return;
    }

    response.json({
      booking: serializePublicManagedBooking(appointment)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/public/bookings/:appointmentId/cancel", publicBookingRateLimit, async (request, response, next) => {
  try {
    const appointment = await loadPublicManagedAppointment(request.params.appointmentId, publicManageTokenFromRequest(request));

    if (!appointment) {
      response.status(404).json({
        error: "We could not find that appointment. Please call or text (971) 202-0232."
      });
      return;
    }

    if (!publicAppointmentCanManage(appointment)) {
      response.status(400).json({
        error: "This appointment can no longer be changed online. Please call or text (971) 202-0232."
      });
      return;
    }

    const now = new Date().toISOString();
    const today = todayDateString();
    const clientNames = Array.isArray(appointment.clientNames) && appointment.clientNames.length
      ? appointment.clientNames.filter(Boolean)
      : [appointment.clientName].filter(Boolean);
    const displayName = clientNames.length > 1 ? clientNames.join(", ") : clientNames[0] || "Public booking";
    const clientRefsToUpdate = await existingPublicManageClientRefs(appointment);
    const batch = firestore.batch();

    batch.update(appointments.doc(appointment.id), {
      status: "Canceled",
      publicCanceledAt: now,
      updatedAt: now,
      updatedBy: "public-booking"
    });

    for (const clientRef of clientRefsToUpdate) {
      batch.update(clientRef, {
        status: "Needs Reschedule",
        updatedAt: now,
        updatedBy: "public-booking"
      });
    }

    batch.set(tasks.doc(), {
      title: `Review public cancellation for ${displayName}`,
      type: "Task",
      status: "Open",
      priority: "Normal",
      dueDate: today,
      dueTime: "",
      assignedTo: "",
      clientId: appointment.clientId || appointment.clientIds?.[0] || "",
      clientName: displayName,
      appointmentId: appointment.id,
      referralId: "",
      source: "Public Booking",
      notes: `Family canceled ${appointment.publicBookingServiceLabel || appointment.appointmentType || "appointment"} for ${appointment.appointmentDate} at ${formatAppointmentTimeValue(appointment.appointmentTime)}.`,
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    });

    await batch.commit();

    response.json({
      booking: serializePublicManagedBooking({ ...appointment, status: "Canceled" })
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/public/bookings/:appointmentId/reschedule", publicBookingRateLimit, async (request, response, next) => {
  try {
    const appointment = await loadPublicManagedAppointment(request.params.appointmentId, publicManageTokenFromRequest(request));

    if (!appointment) {
      response.status(404).json({
        error: "We could not find that appointment. Please call or text (971) 202-0232."
      });
      return;
    }

    if (!publicAppointmentCanManage(appointment)) {
      response.status(400).json({
        error: "This appointment can no longer be changed online. Please call or text (971) 202-0232."
      });
      return;
    }

    const appointmentDate = cleanString(request.body?.appointmentDate);
    const appointmentTime = normalizeAppointmentTimeValue(request.body?.appointmentTime);
    const settings = await loadSchedulingSettings();
    const service = publicBookingServiceFromAppointment(appointment);
    const rescheduledAppointment = {
      ...appointment,
      appointmentDate,
      appointmentTime,
      durationMinutes: service.durationMinutes,
      status: "Scheduled"
    };

    if (!parseDateOnly(appointmentDate) || !appointmentTime) {
      response.status(400).json({
        error: "Choose an appointment date and time."
      });
      return;
    }

    if (appointment.appointmentDate === appointmentDate && normalizeAppointmentTimeValue(appointment.appointmentTime) === appointmentTime) {
      response.status(400).json({
        error: "Choose a new appointment time."
      });
      return;
    }

    if (!isPublicBookableDate(appointmentDate, settings) || !isPublicBookingDateInRange(appointmentDate)) {
      response.status(400).json({
        error: "Choose an available appointment date."
      });
      return;
    }

    if (!appointmentFitsSchedulingWindow(rescheduledAppointment, settings)) {
      response.status(400).json({
        error: schedulingWindowError(rescheduledAppointment, settings)
      });
      return;
    }

    const conflict = await findAppointmentConflict(rescheduledAppointment, appointment.id);

    if (conflict) {
      response.status(409).json({
        error: "That time was just booked. Please choose another open time."
      });
      return;
    }

    const now = new Date().toISOString();
    const today = todayDateString();
    const clientNames = Array.isArray(appointment.clientNames) && appointment.clientNames.length
      ? appointment.clientNames.filter(Boolean)
      : [appointment.clientName].filter(Boolean);
    const displayName = clientNames.length > 1 ? clientNames.join(", ") : clientNames[0] || "Public booking";
    const clientRefsToUpdate = await existingPublicManageClientRefs(appointment);
    const batch = firestore.batch();

    batch.update(appointments.doc(appointment.id), {
      appointmentDate,
      appointmentTime,
      durationMinutes: service.durationMinutes,
      status: "Scheduled",
      publicRescheduledAt: now,
      updatedAt: now,
      updatedBy: "public-booking"
    });

    for (const clientRef of clientRefsToUpdate) {
      batch.update(clientRef, {
        status: "Scheduled",
        firstAppointmentDate: appointmentDate,
        updatedAt: now,
        updatedBy: "public-booking"
      });
    }

    batch.set(tasks.doc(), {
      title: `Review public reschedule for ${displayName}`,
      type: "Task",
      status: "Open",
      priority: "Normal",
      dueDate: today,
      dueTime: "",
      assignedTo: "",
      clientId: appointment.clientId || appointment.clientIds?.[0] || "",
      clientName: displayName,
      appointmentId: appointment.id,
      referralId: "",
      source: "Public Booking",
      notes: `Family rescheduled ${appointment.publicBookingServiceLabel || appointment.appointmentType || "appointment"} from ${appointment.appointmentDate} at ${formatAppointmentTimeValue(appointment.appointmentTime)} to ${appointmentDate} at ${formatAppointmentTimeValue(appointmentTime)}.`,
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    });

    await batch.commit();

    response.json({
      booking: serializePublicManagedBooking(rescheduledAppointment)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
