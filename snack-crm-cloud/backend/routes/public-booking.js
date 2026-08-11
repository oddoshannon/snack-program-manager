import express from "express";
import { FieldValue } from "@google-cloud/firestore";
import {
  previewPublicBookingConfirmationDelivery,
  publicBookingConfirmationDeliverySummary
} from "../lib/public-booking-confirmation.js";
import {
  addDaysToDateString,
  appointmentBlocksSchedule,
  appointmentFitsSchedulingWindow,
  appointments,
  cleanPublicBookingPayload,
  cleanPublicClassRegistrationPayload,
  cleanString,
  clients,
  createPublicManageToken,
  existingPublicManageClientRefs,
  fetchAllDocuments,
  findAppointmentConflict,
  firestore,
  formatAppointmentTimeValue,
  isPublicBookableDate,
  isPublicBookingDateInRange,
  loadPublicManagedAppointment,
  loadSchedulingSettings,
  normalizedLookupKey,
  normalizeAppointmentTimeValue,
  parseDateOnly,
  persistClinicAppointmentCalendarSync,
  publicAppointmentCanManage,
  publicAppointmentDraft,
  publicAvailabilityDefaultDays,
  publicAvailabilityMaxDays,
  publicBookingRateLimit,
  publicBookingServiceFromAppointment,
  publicBookingServiceFromId,
  publicManageTokenFromRequest,
  publicManageTokenHash,
  publicSlotValuesForDate,
  programRegistrations,
  programRegistrationStatusForCapacity,
  programSessions,
  publicKitchenSessionAvailability,
  schedulingWindowEndLabel,
  schedulingWindowError,
  serializePublicManagedBooking,
  tasks,
  toAppointment,
  toClient,
  toProgramRegistration,
  toProgramSession,
  todayDateString,
  validatePublicBookingPayload,
  validatePublicClassRegistrationPayload
} from "../lib/core.js";

const router = express.Router();

function normalizedPublicPhone(value) {
  return cleanString(value).replace(/\D/g, "").slice(-10);
}

function publicClientMatchReview(existingClients = [], child = {}, family = {}, excludedIds = new Set()) {
  const firstName = normalizedLookupKey(child.firstName);
  const lastName = normalizedLookupKey(child.lastName);
  const dateOfBirth = cleanString(child.dateOfBirth);
  const phone = normalizedPublicPhone(family.phone);
  const email = normalizedLookupKey(family.email);
  const sameNameMatches = existingClients.filter(({ client }) => (
    !excludedIds.has(client.id)
      && normalizedLookupKey(client.firstName) === firstName
      && normalizedLookupKey(client.lastName) === lastName
  ));
  const matches = sameNameMatches.filter(({ client }) => {
    if (excludedIds.has(client.id)
      || normalizedLookupKey(client.firstName) !== firstName
      || normalizedLookupKey(client.lastName) !== lastName) return false;
    if (dateOfBirth) return cleanString(client.dateOfBirth) === dateOfBirth;
    return Boolean(
      (phone && normalizedPublicPhone(client.phone) === phone)
      || (email && normalizedLookupKey(client.email) === email)
    );
  });
  if (matches.length === 1) {
    return {
      match: matches[0],
      possibleMatches: [],
      reviewRequired: false,
      reviewReason: ""
    };
  }
  return {
    match: null,
    possibleMatches: sameNameMatches,
    reviewRequired: true,
    reviewReason: sameNameMatches.length
      ? "One or more CRM clients have the same name, but the birthdate or caregiver contact did not identify exactly one safe match."
      : "No existing CRM client had the same child name."
  };
}

function findPublicClientMatch(existingClients = [], child = {}, family = {}, excludedIds = new Set()) {
  return publicClientMatchReview(existingClients, child, family, excludedIds).match;
}

function resolvePublicClientRecords(documents, children, family) {
  const existingClients = documents.map((doc) => ({ doc, client: toClient(doc) }));
  const usedIds = new Set();
  return children.map((child) => {
    const review = publicClientMatchReview(existingClients, child, family, usedIds);
    if (review.match) {
      usedIds.add(review.match.client.id);
      return {
        ...review.match,
        possibleMatchIds: [],
        reviewRequired: false,
        reviewReason: ""
      };
    }
    return {
      doc: null,
      client: null,
      possibleMatchIds: review.possibleMatches.map(({ client }) => client.id),
      reviewRequired: true,
      reviewReason: review.reviewReason
    };
  });
}

function publicClientFillUpdates(existing, child, family, now, siblingIds, extra = {}) {
  const updates = { updatedAt: now };
  const fill = (field, value) => {
    if (!cleanString(existing?.[field]) && cleanString(value)) updates[field] = value;
  };
  fill("parentName", family.parentName);
  fill("dateOfBirth", child.dateOfBirth);
  fill("gender", child.gender);
  fill("phone", family.phone);
  fill("email", family.email);
  fill("preferredLanguage", family.preferredLanguage);
  fill("preferredContactMethod", family.preferredContactMethod);
  fill("addressStreet", family.address);
  fill("yccoId", family.yccoId);
  if (family.yccoMember === true && existing?.ycco !== true) updates.ycco = true;
  if (family.serviceEmailConsent === true && existing?.serviceEmailConsent !== true) updates.serviceEmailConsent = true;
  if (family.serviceTextConsent === true && existing?.serviceTextConsent !== true) updates.serviceTextConsent = true;
  if (family.marketingConsent === true && existing?.marketingConsent !== true) updates.marketingConsent = true;
  if (family.serviceEmailConsent || family.serviceTextConsent || family.marketingConsent) {
    fill("consentSource", "Public booking form");
    fill("consentDate", now.slice(0, 10));
  }
  Object.entries(extra).forEach(([field, value]) => fill(field, value));
  if (siblingIds.length) updates.siblingIds = FieldValue.arrayUnion(...siblingIds);
  return updates;
}

function publicKitchenClassSummary(session, registrations, settings) {
  const availability = publicKitchenSessionAvailability(session, registrations, settings);

  if (!availability) {
    return null;
  }

  return {
    id: session.id,
    title: session.title || session.classTypeLabel || "Cooking Class",
    classTypeId: session.classTypeId,
    classTypeLabel: session.classTypeLabel || session.title || "Cooking Class",
    sessionDate: session.sessionDate,
    startTime: session.startTime,
    startTimeLabel: formatAppointmentTimeValue(session.startTime),
    durationMinutes: session.durationMinutes,
    capacity: availability.capacity,
    registeredSeats: availability.registeredSeats,
    spacesRemaining: availability.spacesRemaining,
    isFull: availability.isFull,
    waitlistEnabled: availability.waitlistEnabled,
    canRegister: availability.canRegister,
    nextStatus: availability.nextStatus,
    location: session.location || settings.kitchen.location || "Location to be confirmed"
  };
}

async function publicKitchenClassList(settings) {
  const [sessionDocuments, registrationDocuments] = await Promise.all([
    fetchAllDocuments(programSessions.orderBy("sessionDate", "asc")),
    fetchAllDocuments(programRegistrations)
  ]);
  const registrationsBySession = new Map();

  for (const document of registrationDocuments) {
    const registration = toProgramRegistration(document);
    const registrations = registrationsBySession.get(registration.sessionId) || [];
    registrations.push(registration);
    registrationsBySession.set(registration.sessionId, registrations);
  }

  return sessionDocuments
    .map(toProgramSession)
    .map((session) => publicKitchenClassSummary(session, registrationsBySession.get(session.id) || [], settings))
    .filter(Boolean);
}

router.get("/api/public/booking-options", async (_request, response, next) => {
  try {
    const settings = await loadSchedulingSettings();

    response.json({
      services: settings.clinicServices.filter((service) => service.active && service.publiclyBookable),
      scheduling: {
        startTime: formatAppointmentTimeValue(settings.bookableStartTime),
        endTime: schedulingWindowEndLabel(settings),
        weekdays: settings.weekdays,
        clinicLocation: settings.clinicLocation
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/public/classes", async (_request, response, next) => {
  try {
    const settings = await loadSchedulingSettings();
    response.json({ classes: await publicKitchenClassList(settings) });
  } catch (error) {
    next(error);
  }
});

router.get("/api/public/classes/:sessionId", async (request, response, next) => {
  try {
    const sessionId = cleanString(request.params.sessionId);
    const [settings, sessionSnapshot, registrationDocuments] = await Promise.all([
      loadSchedulingSettings(),
      programSessions.doc(sessionId).get(),
      fetchAllDocuments(programRegistrations.where("sessionId", "==", sessionId))
    ]);
    const session = sessionSnapshot.exists ? toProgramSession(sessionSnapshot) : null;
    const registrations = registrationDocuments.map(toProgramRegistration);
    const publicClass = session ? publicKitchenClassSummary(session, registrations, settings) : null;

    if (!publicClass) {
      response.status(404).json({ error: "That cooking class is no longer available for online registration." });
      return;
    }

    response.json({ class: publicClass });
  } catch (error) {
    next(error);
  }
});

router.get("/api/public/availability", async (request, response, next) => {
  try {
    const settings = await loadSchedulingSettings();
    const service = publicBookingServiceFromId(request.query.serviceId, settings.clinicServices);
    const requestedStart = cleanString(request.query.startDate || request.query.start) || todayDateString();
    const startDate = parseDateOnly(requestedStart) ? requestedStart : todayDateString();
    const requestedDays = Number(request.query.days);
    const days = Number.isInteger(requestedDays)
      ? Math.min(Math.max(requestedDays, 1), publicAvailabilityMaxDays)
      : publicAvailabilityDefaultDays;
    const endDate = addDaysToDateString(startDate, days - 1);
    const documents = await fetchAllDocuments(appointments
      .where("appointmentDate", ">=", startDate)
      .where("appointmentDate", "<=", endDate));
    const existingAppointmentsByDate = new Map();

    for (const doc of documents) {
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
    const settings = await loadSchedulingSettings();
    const payload = cleanPublicBookingPayload(request.body, settings.clinicServices);
    const now = new Date().toISOString();
    const today = todayDateString();
    const clientNames = payload.children.map((child) => child.childName || `${child.firstName} ${child.lastName}`.trim()).filter(Boolean);
    const clientName = clientNames[0] || "";

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

    const existingClientDocuments = await fetchAllDocuments(clients);
    const resolvedClients = resolvePublicClientRecords(existingClientDocuments, payload.children, payload);
    const clientRefs = resolvedClients.map((match) => match.doc?.ref || clients.doc());
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
      emailOptOut: false,
      textOptOut: !payload.serviceTextConsent,
      serviceEmailConsent: payload.serviceEmailConsent,
      serviceTextConsent: payload.serviceTextConsent,
      marketingConsent: payload.marketingConsent,
      consentSource: "Public booking form",
      consentDate: today,
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
      publicReviewRequired: resolvedClients[index].reviewRequired,
      publicReviewReason: resolvedClients[index].reviewReason,
      publicPossibleMatchIds: resolvedClients[index].possibleMatchIds,
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
      location: settings.clinicLocation,
      notes: publicNotes,
      createdVia: "Public booking",
      publicManageTokenHash: manageTokenHash,
      publicManageTokenCreatedAt: now,
      serviceEmailConsent: payload.serviceEmailConsent,
      serviceTextConsent: payload.serviceTextConsent,
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const newProfiles = resolvedClients.filter((match) => !match.client);
    const possibleDuplicate = newProfiles.some((match) => match.possibleMatchIds.length);
    const taskRecord = {
      title: newProfiles.length
        ? `${possibleDuplicate ? "Possible duplicate client" : "Review new public client record"}: ${taskClientName}`
        : `Review public booking for ${taskClientName}`,
      type: "Task",
      status: "Open",
      priority: newProfiles.length ? "High" : "Normal",
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
        `${resolvedClients.filter((match) => match.client).length} existing client profile(s) matched; ${newProfiles.length} new profile(s) created.`,
        possibleDuplicate
          ? "Open the new client profile, compare the listed possible matches, and keep or merge the record after review."
          : newProfiles.length
            ? "Open the new client profile and confirm it is a new person."
            : "Review family details, forms, and appointment prep."
      ].filter(Boolean).join(" "),
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const batch = firestore.batch();

    clientRefs.forEach((clientRef, index) => {
      const existing = resolvedClients[index].client;
      const siblingIds = clientRefs.map((ref) => ref.id).filter((id) => id !== clientRef.id);
      if (existing) {
        const updates = publicClientFillUpdates(existing, payload.children[index], payload, now, siblingIds, {
          firstAppointmentDate: payload.appointmentDate
        });
        updates.status = "Scheduled";
        batch.update(clientRef, updates);
      } else {
        batch.set(clientRef, clientRecords[index]);
      }
    });
    batch.set(appointmentRef, appointmentRecord);
    batch.set(taskRef, taskRecord);
    await batch.commit();
    await persistClinicAppointmentCalendarSync(
      appointmentRef,
      { id: appointmentRef.id, ...appointmentRecord },
      "public-booking"
    );

    const confirmationDelivery = previewPublicBookingConfirmationDelivery({
      appointmentId: appointmentRef.id,
      manageToken: publicManageToken,
      caregiverName: payload.parentName,
      clientNames,
      serviceLabel: payload.service.label,
      appointmentDate: payload.appointmentDate,
      appointmentTimeLabel: formatAppointmentTimeValue(payload.appointmentTime),
      location: settings.clinicLocation,
      preferredLanguage: payload.preferredLanguage,
      email: payload.serviceEmailConsent ? payload.email : "",
      phone: payload.serviceTextConsent ? payload.phone : ""
    });

    response.status(201).json({
      booking: {
        clientName: clientNames.length > 1 ? clientNames.join(", ") : clientName,
        clientNames,
        serviceLabel: payload.service.label,
        appointmentDate: payload.appointmentDate,
        appointmentTime: payload.appointmentTime,
        appointmentTimeLabel: formatAppointmentTimeValue(payload.appointmentTime),
        durationMinutes: payload.service.durationMinutes,
        location: settings.clinicLocation,
        appointmentId: appointmentRef.id,
        manageToken: publicManageToken
      },
      confirmationDelivery: publicBookingConfirmationDeliverySummary(confirmationDelivery)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/public/class-registrations", publicBookingRateLimit, async (request, response, next) => {
  try {
    const sessionId = cleanString(request.body?.sessionId);
    const [settings, sessionSnapshot, registrationDocuments] = await Promise.all([
      loadSchedulingSettings(),
      programSessions.doc(sessionId).get(),
      fetchAllDocuments(programRegistrations.where("sessionId", "==", sessionId))
    ]);

    if (!sessionSnapshot.exists) {
      response.status(404).json({ error: "Choose an available cooking class." });
      return;
    }

    const session = toProgramSession(sessionSnapshot);
    const registrations = registrationDocuments.map(toProgramRegistration);
    const payload = cleanPublicClassRegistrationPayload(request.body);

    if (!validatePublicClassRegistrationPayload(payload, response, session, settings)) {
      return;
    }

    const availability = publicKitchenSessionAvailability(session, registrations, settings);
    const attendeeCount = payload.children.length;

    if (!availability || (!availability.waitlistEnabled && availability.spacesRemaining < attendeeCount)) {
      response.status(409).json({ error: "This cooking class is full. Please choose another class." });
      return;
    }

    const status = programRegistrationStatusForCapacity(
      session,
      registrations,
      attendeeCount,
      availability.waitlistEnabled
    );
    const now = new Date().toISOString();
    const today = todayDateString();
    const clientNames = payload.children.map((child) => child.childName).filter(Boolean);
    const existingClientDocuments = await fetchAllDocuments(clients);
    const resolvedClients = resolvePublicClientRecords(existingClientDocuments, payload.children, payload);
    const clientRefs = resolvedClients.map((match) => match.doc?.ref || clients.doc());
    const registrationRef = programRegistrations.doc();
    const taskRef = tasks.doc();
    const publicNotes = [
      `Registered through the public booking page for ${session.title}.`,
      clientNames.length > 1 ? `Children: ${clientNames.join(", ")}.` : "",
      payload.foodRestrictions ? `Food restrictions: ${payload.foodRestrictions}` : "",
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
      emailOptOut: false,
      textOptOut: !payload.serviceTextConsent,
      serviceEmailConsent: payload.serviceEmailConsent,
      serviceTextConsent: payload.serviceTextConsent,
      marketingConsent: payload.marketingConsent,
      consentSource: "Public booking form",
      consentDate: today,
      ycco: payload.yccoMember,
      yccoId: payload.yccoId,
      foodRestrictions: payload.foodRestrictions,
      referralType: "Self Referral",
      referralSource: "Public cooking class registration",
      referralDate: today,
      status: "Active",
      notes: publicNotes,
      siblingIds: clientRefs.map((ref, siblingIndex) => siblingIndex === index ? "" : ref.id).filter(Boolean),
      programRegistrationId: registrationRef.id,
      createdVia: "Public cooking class registration",
      publicReviewRequired: resolvedClients[index].reviewRequired,
      publicReviewReason: resolvedClients[index].reviewReason,
      publicPossibleMatchIds: resolvedClients[index].possibleMatchIds,
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    }));
    const registrationRecord = {
      sessionId: session.id,
      program: "Kitchen",
      caregiverName: payload.parentName,
      clientIds: clientRefs.map((ref) => ref.id),
      clientNames,
      attendeeCount,
      phone: payload.phone,
      email: payload.email,
      address: payload.address,
      preferredLanguage: payload.preferredLanguage,
      preferredContactMethod: payload.preferredContactMethod,
      yccoMember: payload.yccoMember,
      yccoId: payload.yccoId,
      consentReminders: payload.consentReminders,
      serviceEmailConsent: payload.serviceEmailConsent,
      serviceTextConsent: payload.serviceTextConsent,
      marketingConsent: payload.marketingConsent,
      foodRestrictions: payload.foodRestrictions,
      status,
      notes: payload.notes,
      createdVia: "Public cooking class registration",
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const newProfiles = resolvedClients.filter((match) => !match.client);
    const possibleDuplicate = newProfiles.some((match) => match.possibleMatchIds.length);
    const taskRecord = {
      title: newProfiles.length
        ? `${possibleDuplicate ? "Possible duplicate client" : "Review new public client record"}: ${clientNames.join(", ")}`
        : `Review cooking class registration for ${clientNames.join(", ")}`,
      type: "Task",
      status: "Open",
      priority: newProfiles.length ? "High" : "Normal",
      dueDate: today,
      dueTime: "",
      assignedTo: "",
      clientId: clientRefs[0]?.id || "",
      clientName: clientNames.join(", "),
      appointmentId: "",
      referralId: "",
      source: "Public Booking",
      notes: [
        `${status} for ${session.title} on ${session.sessionDate} at ${formatAppointmentTimeValue(session.startTime)}.`,
        `${resolvedClients.filter((match) => match.client).length} existing client profile(s) matched; ${newProfiles.length} new profile(s) created.`,
        possibleDuplicate
          ? "Open the new client profile, compare the listed possible matches, and keep or merge the record after review."
          : newProfiles.length
            ? "Open the new client profile and confirm it is a new person."
            : "Review family details and food restrictions."
      ].join(" "),
      createdAt: now,
      updatedAt: now,
      createdBy: "public-booking"
    };
    const batch = firestore.batch();

    clientRefs.forEach((clientRef, index) => {
      const existing = resolvedClients[index].client;
      const siblingIds = clientRefs.map((ref) => ref.id).filter((id) => id !== clientRef.id);
      if (existing) {
        batch.update(clientRef, publicClientFillUpdates(existing, payload.children[index], payload, now, siblingIds, {
          foodRestrictions: payload.foodRestrictions
        }));
      } else {
        batch.set(clientRef, clientRecords[index]);
      }
    });
    batch.set(registrationRef, registrationRecord);
    batch.set(taskRef, taskRecord);
    await batch.commit();

    response.status(201).json({
      registration: {
        id: registrationRef.id,
        status,
        clientNames,
        attendeeCount,
        sessionId: session.id
      },
      class: publicKitchenClassSummary(session, [...registrations, registrationRecord], settings)
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
    await persistClinicAppointmentCalendarSync(
      appointments.doc(appointment.id),
      { ...appointment, status: "Canceled" },
      "public-booking"
    );

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
    const service = publicBookingServiceFromAppointment(appointment, settings.clinicServices);
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
    await persistClinicAppointmentCalendarSync(
      appointments.doc(appointment.id),
      rescheduledAppointment,
      "public-booking"
    );

    response.json({
      booking: serializePublicManagedBooking(rescheduledAppointment)
    });
  } catch (error) {
    next(error);
  }
});

export {
  findPublicClientMatch,
  publicClientMatchReview,
  normalizedPublicPhone
};

export default router;
