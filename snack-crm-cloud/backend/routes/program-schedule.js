import express from "express";
import {
  appointmentTimeMinutes,
  cleanProgramRegistrationPayload,
  cleanProgramSessionPayload,
  cleanString,
  fetchAllDocuments,
  loadSchedulingSettings,
  normalizeProgram,
  normalizeProgramRegistrationStatus,
  parseDateOnly,
  programRegistrations,
  programRegistrationStatusForCapacity,
  programSessions,
  requireAuth,
  toProgramRegistration,
  toProgramSession
} from "../lib/core.js";

const router = express.Router();

function matchingKitchenClassType(settings, classTypeId) {
  return settings.kitchenClassTypes.find((classType) => classType.id === classTypeId) || null;
}

function sessionPayloadWithDefaults(body, settings) {
  const payload = cleanProgramSessionPayload(body);

  if (payload.program !== "Kitchen") {
    return payload;
  }

  const classType = matchingKitchenClassType(settings, payload.classTypeId);
  return {
    ...payload,
    title: payload.title || classType?.label || "Cooking Class",
    classTypeLabel: payload.classTypeLabel || classType?.label || payload.title,
    location: payload.location || settings.kitchen.location,
    durationMinutes: Number(body.durationMinutes) > 0
      ? payload.durationMinutes
      : classType?.durationMinutes || 120,
    capacity: Number(body.capacity) > 0
      ? payload.capacity
      : classType?.capacity || settings.kitchen.defaultCapacity
  };
}

function sessionValidationError(payload) {
  if (!payload.program) return "Choose Kitchen or School.";
  if (!payload.title) return "Session title is required.";
  if (!parseDateOnly(payload.sessionDate)) return "Session date is required.";
  if (appointmentTimeMinutes(payload.startTime) === null) return "Session start time is required.";
  if (!payload.durationMinutes) return "Session duration is required.";
  return "";
}

router.get("/api/program-sessions", requireAuth, async (request, response, next) => {
  try {
    const program = normalizeProgram(request.query.program);
    const documents = await fetchAllDocuments(programSessions.orderBy("sessionDate", "asc"));
    const sessions = documents.map(toProgramSession).filter((session) => !program || session.program === program);

    response.json({ sessions });
  } catch (error) {
    next(error);
  }
});

router.post("/api/program-sessions", requireAuth, async (request, response, next) => {
  try {
    const settings = await loadSchedulingSettings();
    const payload = sessionPayloadWithDefaults(request.body, settings);
    const error = sessionValidationError(payload);

    if (error) {
      response.status(400).json({ error });
      return;
    }

    const now = new Date().toISOString();
    const docRef = await programSessions.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });

    response.status(201).json({ session: toProgramSession(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/program-sessions/:sessionId", requireAuth, async (request, response, next) => {
  try {
    const docRef = programSessions.doc(cleanString(request.params.sessionId));
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({ error: "Program session was not found." });
      return;
    }

    const settings = await loadSchedulingSettings();
    const payload = sessionPayloadWithDefaults({ ...snapshot.data(), ...request.body }, settings);
    const error = sessionValidationError(payload);

    if (error) {
      response.status(400).json({ error });
      return;
    }

    await docRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });

    response.json({ session: toProgramSession(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/program-sessions/:sessionId", requireAuth, async (request, response, next) => {
  try {
    const sessionId = cleanString(request.params.sessionId);
    const docRef = programSessions.doc(sessionId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({ error: "Program session was not found." });
      return;
    }

    const registrations = await fetchAllDocuments(programRegistrations.where("sessionId", "==", sessionId));
    if (registrations.length) {
      response.status(409).json({
        error: "Cancel this session or remove its registrations before deleting it."
      });
      return;
    }

    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/api/program-registrations", requireAuth, async (request, response, next) => {
  try {
    const sessionId = cleanString(request.query.sessionId);
    const program = normalizeProgram(request.query.program);
    const documents = await fetchAllDocuments(programRegistrations.orderBy("createdAt", "asc"));
    const registrations = documents.map(toProgramRegistration).filter((registration) => {
      if (sessionId && registration.sessionId !== sessionId) return false;
      if (program && registration.program !== program) return false;
      return true;
    });

    response.json({ registrations });
  } catch (error) {
    next(error);
  }
});

router.post("/api/program-registrations", requireAuth, async (request, response, next) => {
  try {
    const sessionId = cleanString(request.body?.sessionId);
    const sessionSnapshot = await programSessions.doc(sessionId).get();

    if (!sessionSnapshot.exists) {
      response.status(404).json({ error: "Choose an existing program session." });
      return;
    }

    const session = toProgramSession(sessionSnapshot);
    const payload = cleanProgramRegistrationPayload({ ...request.body, sessionId, program: session.program });

    if (session.program === "Kitchen" && !payload.caregiverName) {
      response.status(400).json({ error: "Caregiver name is required for a cooking class registration." });
      return;
    }
    if (session.program === "Kitchen" && !payload.clientIds.length && !payload.clientNames.length) {
      response.status(400).json({ error: "Add at least one child to the cooking class registration." });
      return;
    }

    const registrationDocuments = await fetchAllDocuments(programRegistrations.where("sessionId", "==", sessionId));
    const registrations = registrationDocuments.map(toProgramRegistration);
    const duplicateClient = payload.clientIds.find((clientId) => registrations.some((registration) =>
      registration.status !== "Canceled" && registration.clientIds.includes(clientId)
    ));

    if (duplicateClient) {
      response.status(409).json({ error: "One or more selected children are already registered for this session." });
      return;
    }

    const settings = await loadSchedulingSettings();
    const status = cleanString(request.body?.status)
      ? normalizeProgramRegistrationStatus(request.body.status)
      : programRegistrationStatusForCapacity(
          session,
          registrations,
          payload.attendeeCount,
          settings.kitchen.waitlistEnabled
        );
    const now = new Date().toISOString();
    const docRef = await programRegistrations.add({
      ...payload,
      status,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });

    response.status(201).json({ registration: toProgramRegistration(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/program-registrations/:registrationId", requireAuth, async (request, response, next) => {
  try {
    const docRef = programRegistrations.doc(cleanString(request.params.registrationId));
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({ error: "Program registration was not found." });
      return;
    }

    const payload = cleanProgramRegistrationPayload({ ...snapshot.data(), ...request.body });
    await docRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });

    response.json({ registration: toProgramRegistration(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/program-registrations/:registrationId", requireAuth, async (request, response, next) => {
  try {
    const docRef = programRegistrations.doc(cleanString(request.params.registrationId));
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      response.status(404).json({ error: "Program registration was not found." });
      return;
    }

    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
