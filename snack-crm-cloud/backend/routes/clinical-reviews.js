import crypto from "node:crypto";
import express from "express";
import {
  clinicalAppointmentClientLabels,
  clinicalClientLabel,
  clinicalContentVersion,
  clinicalReviewStatuses,
  clinicalReviewSummary,
  defaultClinicalReviewSettings,
  normalizeClinicalReviewSettings,
  normalizedClarifications,
  userMatchesAssignment
} from "../lib/clinical-review.js";
import {
  adminSettings,
  appointments,
  cleanString,
  fetchAllDocuments,
  firestore,
  normalizeStaffEmail,
  requireAuth,
  staffUsers,
  tasks,
  todayDateString,
  toAppointment
} from "../lib/core.js";

const router = express.Router();
const clinicalReviewSettingsDocument = "clinicalReview";
const clinicalAdvisorAccessLevelId = "ClinicalAdvisor";

async function loadClinicalReviewSettings() {
  const snapshot = await adminSettings.doc(clinicalReviewSettingsDocument).get();
  return normalizeClinicalReviewSettings(snapshot.exists ? snapshot.data() : {});
}

function isClinicalAdvisor(user = {}) {
  return cleanString(user.accessLevelId || user.role).toLowerCase()
    === clinicalAdvisorAccessLevelId.toLowerCase();
}

function isAdmin(user = {}) {
  return Array.isArray(user.modules) && user.modules.includes("admin");
}

function currentClarification(appointment = {}) {
  return normalizedClarifications(appointment.clinicalReview || {}).findLast((item) => !item.answeredAt) || null;
}

function serializeClinicalReview(appointment = {}, settings = defaultClinicalReviewSettings, user = {}) {
  const labels = clinicalAppointmentClientLabels(appointment);
  const review = appointment.clinicalReview || {};
  const clarifications = normalizedClarifications(review);
  const activeClarification = clarifications.findLast((item) => !item.answeredAt) || null;
  const summary = clinicalReviewSummary(appointment, settings);
  const participantGoals = Array.isArray(appointment.participantGoals) && appointment.participantGoals.length
    ? appointment.participantGoals.map((item, index) => ({
      client: labels[index] || clinicalClientLabel(item?.clientName),
      goal: cleanString(item?.goal),
      goalResult: cleanString(item?.goalResult)
    }))
    : [{
      client: labels[0] || "Client",
      goal: cleanString(appointment.goal),
      goalResult: cleanString(appointment.goalResult)
    }];
  return {
    id: appointment.id,
    clients: labels.length ? labels : ["Client"],
    appointmentDate: cleanString(appointment.appointmentDate),
    appointmentTime: cleanString(appointment.appointmentTime),
    appointmentType: cleanString(appointment.appointmentType),
    lesson: cleanString(appointment.lesson),
    staffMember: cleanString(appointment.staffMember),
    appointmentNote: cleanString(appointment.appointmentNote),
    participantGoals,
    status: summary.status,
    reviewedAt: summary.reviewedAt,
    reviewedByName: summary.reviewedByName,
    reviewedByTitle: summary.reviewedByTitle,
    referralUpdateLabel: summary.referralUpdateLabel,
    clarifications,
    canReview: isClinicalAdvisor(user),
    canRequestClarification: isClinicalAdvisor(user),
    canRespond: Boolean(activeClarification && (isAdmin(user) || userMatchesAssignment(user, activeClarification)))
  };
}

async function clinicalClarificationAssignee(appointment = {}, settings = defaultClinicalReviewSettings) {
  if (settings.clarificationRouting === "appointment-staff" && cleanString(appointment.staffMember)) {
    const staffDocuments = await fetchAllDocuments(staffUsers);
    const staff = staffDocuments.map((document) => ({ id: document.id, ...document.data() }))
      .find((item) => cleanString(item.displayName).toLowerCase() === cleanString(appointment.staffMember).toLowerCase());
    return {
      name: cleanString(appointment.staffMember),
      email: normalizeStaffEmail(staff?.email || staff?.id),
      routing: "appointment-staff"
    };
  }
  const directorSnapshot = await staffUsers.doc(settings.directorEmail).get();
  return {
    name: cleanString(directorSnapshot.data()?.displayName) || settings.directorName,
    email: settings.directorEmail,
    routing: "director"
  };
}

async function completedClinicalAppointments() {
  const documents = await fetchAllDocuments(appointments.orderBy("appointmentDate", "desc"));
  return documents.map((document) => ({
    ...toAppointment(document),
    clinicalReview: document.data()?.clinicalReview || {}
  })).filter((appointment) => appointment.status === "Completed" && cleanString(appointment.appointmentNote));
}

router.get("/api/clinical-reviews", requireAuth, async (request, response, next) => {
  try {
    const [settings, completed] = await Promise.all([
      loadClinicalReviewSettings(),
      completedClinicalAppointments()
    ]);
    response.json({
      reviews: completed.map((appointment) => serializeClinicalReview(appointment, settings, request.user)),
      settings,
      role: {
        accessLevelId: request.user.accessLevelId,
        accessLevelName: request.user.accessLevelName,
        reviewer: isClinicalAdvisor(request.user),
        administrator: isAdmin(request.user)
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/clinical-clarifications/assigned", requireAuth, async (request, response, next) => {
  try {
    const [settings, completed] = await Promise.all([
      loadClinicalReviewSettings(),
      completedClinicalAppointments()
    ]);
    const assigned = completed.filter((appointment) => {
      const clarification = currentClarification(appointment);
      return clarification && userMatchesAssignment(request.user, clarification);
    });
    response.json({
      reviews: assigned.map((appointment) => serializeClinicalReview(appointment, settings, request.user)),
      settings,
      role: {
        accessLevelId: request.user.accessLevelId,
        accessLevelName: request.user.accessLevelName,
        reviewer: false,
        administrator: isAdmin(request.user)
      }
    });
  } catch (error) {
    next(error);
  }
});

router.put("/api/clinical-reviews/settings", requireAuth, async (request, response, next) => {
  try {
    if (!isAdmin(request.user)) {
      response.status(403).json({ error: "Admin access is required to change clinical review settings." });
      return;
    }
    const current = await loadClinicalReviewSettings();
    const settings = normalizeClinicalReviewSettings({ ...current, ...request.body });
    const now = new Date().toISOString();
    await adminSettings.doc(clinicalReviewSettingsDocument).set({
      ...settings,
      updatedAt: now,
      updatedBy: request.user.email
    }, { merge: true });
    response.json({ settings });
  } catch (error) {
    next(error);
  }
});

router.post("/api/clinical-reviews/:appointmentId/clarification", requireAuth, async (request, response, next) => {
  try {
    if (!isClinicalAdvisor(request.user)) {
      response.status(403).json({ error: "Only the Clinical Physician Advisor can request clarification." });
      return;
    }
    const appointmentId = cleanString(request.params.appointmentId);
    const question = cleanString(request.body?.question);
    if (!question) {
      response.status(400).json({ error: "Enter the clarification question." });
      return;
    }
    const appointmentRef = appointments.doc(appointmentId);
    const appointmentSnapshot = await appointmentRef.get();
    if (!appointmentSnapshot.exists) {
      response.status(404).json({ error: "Appointment was not found." });
      return;
    }
    const appointment = { ...toAppointment(appointmentSnapshot), clinicalReview: appointmentSnapshot.data()?.clinicalReview || {} };
    if (appointment.status !== "Completed" || !cleanString(appointment.appointmentNote)) {
      response.status(409).json({ error: "Only completed appointment notes can be reviewed." });
      return;
    }
    if (currentClarification(appointment)) {
      response.status(409).json({ error: "Clarification has already been requested for this note." });
      return;
    }
    const settings = await loadClinicalReviewSettings();
    const assignee = await clinicalClarificationAssignee(appointment, settings);
    const now = new Date().toISOString();
    const taskRef = tasks.doc();
    const clarification = {
      id: crypto.randomUUID(),
      question,
      requestedAt: now,
      requestedByEmail: request.user.email,
      requestedByName: request.user.displayName || request.user.accessLevelName,
      assignedTo: assignee.name,
      assignedToEmail: assignee.email,
      routing: assignee.routing,
      taskId: taskRef.id,
      answer: "",
      answeredAt: "",
      answeredByEmail: "",
      answeredByName: ""
    };
    const priorClarifications = normalizedClarifications(appointment.clinicalReview || {});
    const batch = firestore.batch();
    batch.update(appointmentRef, {
      clinicalReview: {
        ...(appointment.clinicalReview || {}),
        status: clinicalReviewStatuses.clarification,
        contentVersion: clinicalContentVersion(appointment),
        clarifications: [...priorClarifications, clarification],
        updatedAt: now,
        updatedBy: request.user.email
      }
    });
    batch.set(taskRef, {
      title: `Answer clinical review question for ${clinicalAppointmentClientLabels(appointment).join(" + ") || "Client"}`,
      type: "Task",
      status: "Open",
      priority: "Normal",
      dueDate: todayDateString(),
      dueTime: "",
      assignedTo: assignee.name,
      clientId: appointment.clientIds?.[0] || appointment.clientId || "",
      clientName: clinicalAppointmentClientLabels(appointment)[0] || "Client",
      appointmentId,
      referralId: "",
      outreachEventId: "",
      outreachEventName: "",
      source: "Clinical Review",
      notes: question,
      completedAt: "",
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    await batch.commit();
    const updated = await appointmentRef.get();
    response.status(201).json({
      review: serializeClinicalReview({ ...toAppointment(updated), clinicalReview: updated.data()?.clinicalReview || {} }, settings, request.user)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/clinical-clarifications/:appointmentId/response", requireAuth, async (request, response, next) => {
  try {
    const appointmentId = cleanString(request.params.appointmentId);
    const answer = cleanString(request.body?.answer);
    if (!answer) {
      response.status(400).json({ error: "Enter an answer before returning this note for review." });
      return;
    }
    const appointmentRef = appointments.doc(appointmentId);
    const settings = await loadClinicalReviewSettings();
    await firestore.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(appointmentRef);
      if (!snapshot.exists) {
        const error = new Error("Appointment was not found.");
        error.statusCode = 404;
        throw error;
      }
      const appointment = { ...toAppointment(snapshot), clinicalReview: snapshot.data()?.clinicalReview || {} };
      const clarifications = normalizedClarifications(appointment.clinicalReview || {});
      const clarificationIndex = clarifications.findLastIndex((item) => !item.answeredAt);
      const clarification = clarificationIndex >= 0 ? clarifications[clarificationIndex] : null;
      if (!clarification) {
        const error = new Error("There is no open clarification request for this note.");
        error.statusCode = 409;
        throw error;
      }
      if (!isAdmin(request.user) && !userMatchesAssignment(request.user, clarification)) {
        const error = new Error("This clarification request is assigned to someone else.");
        error.statusCode = 403;
        throw error;
      }
      const now = new Date().toISOString();
      clarifications[clarificationIndex] = {
        ...clarification,
        answer,
        answeredAt: now,
        answeredByEmail: request.user.email,
        answeredByName: request.user.displayName || request.user.email
      };
      transaction.update(appointmentRef, {
        clinicalReview: {
          ...(appointment.clinicalReview || {}),
          status: clinicalReviewStatuses.ready,
          contentVersion: clinicalContentVersion(appointment),
          clarifications,
          updatedAt: now,
          updatedBy: request.user.email
        }
      });
      if (clarification.taskId) {
        transaction.set(tasks.doc(clarification.taskId), {
          status: "Done",
          completedAt: now,
          updatedAt: now,
          updatedBy: request.user.email
        }, { merge: true });
      }
    });
    const updated = await appointmentRef.get();
    response.json({
      review: serializeClinicalReview({ ...toAppointment(updated), clinicalReview: updated.data()?.clinicalReview || {} }, settings, request.user)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/clinical-reviews/:appointmentId/review", requireAuth, async (request, response, next) => {
  try {
    if (!isClinicalAdvisor(request.user)) {
      response.status(403).json({ error: "Only the Clinical Physician Advisor can record this review." });
      return;
    }
    const appointmentRef = appointments.doc(cleanString(request.params.appointmentId));
    const settings = await loadClinicalReviewSettings();
    await firestore.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(appointmentRef);
      if (!snapshot.exists) {
        const error = new Error("Appointment was not found.");
        error.statusCode = 404;
        throw error;
      }
      const appointment = { ...toAppointment(snapshot), clinicalReview: snapshot.data()?.clinicalReview || {} };
      if (currentClarification(appointment)) {
        const error = new Error("The clarification request must be answered before this note can be reviewed.");
        error.statusCode = 409;
        throw error;
      }
      const now = new Date().toISOString();
      transaction.update(appointmentRef, {
        clinicalReview: {
          ...(appointment.clinicalReview || {}),
          status: clinicalReviewStatuses.reviewed,
          contentVersion: clinicalContentVersion(appointment),
          reviewedAt: now,
          reviewedByEmail: request.user.email,
          reviewedByName: request.user.displayName || request.user.accessLevelName,
          reviewedByTitle: request.user.accessLevelName || settings.roleTitle,
          updatedAt: now,
          updatedBy: request.user.email
        }
      });
    });
    const updated = await appointmentRef.get();
    response.json({
      review: serializeClinicalReview({ ...toAppointment(updated), clinicalReview: updated.data()?.clinicalReview || {} }, settings, request.user)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
