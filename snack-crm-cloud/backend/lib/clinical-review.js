import crypto from "node:crypto";

const clinicalReviewStatuses = Object.freeze({
  ready: "Ready for Review",
  clarification: "Clarification Requested",
  reviewed: "Reviewed"
});

const defaultClinicalReviewSettings = Object.freeze({
  roleTitle: "Clinical Physician Advisor",
  clarificationRouting: "director",
  directorEmail: "director@snackprogram.org",
  directorName: "Shannon Oddo"
});

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizedEmail(value) {
  return cleanText(value).toLowerCase();
}

function clinicalClientLabel(value = "") {
  const parts = cleanText(value).split(/\s+/).filter(Boolean);
  if (!parts.length) return "Client";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts.at(-1).charAt(0).toUpperCase()}.`;
}

function clinicalAppointmentClientLabels(appointment = {}) {
  const names = Array.isArray(appointment.clientNames) && appointment.clientNames.length
    ? appointment.clientNames
    : appointment.clientName
      ? [appointment.clientName]
      : [];
  return names.map(clinicalClientLabel).filter(Boolean);
}

function clinicalContentVersion(appointment = {}) {
  const participantGoals = Array.isArray(appointment.participantGoals)
    ? appointment.participantGoals.map((item) => ({
      clientId: cleanText(item?.clientId),
      clientName: cleanText(item?.clientName),
      goal: cleanText(item?.goal),
      goalResult: cleanText(item?.goalResult)
    }))
    : [];
  return crypto.createHash("sha256").update(JSON.stringify({
    appointmentNote: cleanText(appointment.appointmentNote),
    lesson: cleanText(appointment.lesson),
    goal: cleanText(appointment.goal),
    goalResult: cleanText(appointment.goalResult),
    participantGoals
  })).digest("hex");
}

function normalizedClarifications(review = {}) {
  return (Array.isArray(review.clarifications) ? review.clarifications : [])
    .filter((item) => cleanText(item?.question))
    .map((item) => ({
      id: cleanText(item.id),
      question: cleanText(item.question),
      requestedAt: cleanText(item.requestedAt),
      requestedByEmail: normalizedEmail(item.requestedByEmail),
      requestedByName: cleanText(item.requestedByName),
      assignedTo: cleanText(item.assignedTo),
      assignedToEmail: normalizedEmail(item.assignedToEmail),
      routing: cleanText(item.routing),
      taskId: cleanText(item.taskId),
      answer: cleanText(item.answer),
      answeredAt: cleanText(item.answeredAt),
      answeredByEmail: normalizedEmail(item.answeredByEmail),
      answeredByName: cleanText(item.answeredByName)
    }));
}

function clinicalReviewStatus(appointment = {}) {
  const review = appointment.clinicalReview || {};
  const clarifications = normalizedClarifications(review);
  if (clarifications.some((item) => !item.answeredAt)) return clinicalReviewStatuses.clarification;
  if (cleanText(review.reviewedAt)
    && cleanText(review.contentVersion) === clinicalContentVersion(appointment)) {
    return clinicalReviewStatuses.reviewed;
  }
  return clinicalReviewStatuses.ready;
}

function clinicalReviewSummary(appointment = {}, settings = defaultClinicalReviewSettings) {
  const review = appointment.clinicalReview || {};
  const status = clinicalReviewStatus(appointment);
  const reviewedByTitle = cleanText(review.reviewedByTitle) || cleanText(settings.roleTitle);
  return {
    status,
    reviewedAt: status === clinicalReviewStatuses.reviewed ? cleanText(review.reviewedAt) : "",
    reviewedByName: status === clinicalReviewStatuses.reviewed ? cleanText(review.reviewedByName) : "",
    reviewedByTitle: status === clinicalReviewStatuses.reviewed ? reviewedByTitle : "",
    referralUpdateLabel: status === clinicalReviewStatuses.reviewed
      ? `Reviewed by ${reviewedByTitle}`
      : ""
  };
}

function normalizeClinicalReviewSettings(value = {}) {
  const routing = cleanText(value.clarificationRouting).toLowerCase();
  return {
    roleTitle: cleanText(value.roleTitle) || defaultClinicalReviewSettings.roleTitle,
    clarificationRouting: routing === "appointment-staff" ? "appointment-staff" : "director",
    directorEmail: normalizedEmail(value.directorEmail) || defaultClinicalReviewSettings.directorEmail,
    directorName: cleanText(value.directorName) || defaultClinicalReviewSettings.directorName
  };
}

function userMatchesAssignment(user = {}, clarification = {}) {
  const email = normalizedEmail(user.email);
  const name = cleanText(user.displayName).toLowerCase();
  return Boolean(
    (email && email === normalizedEmail(clarification.assignedToEmail))
    || (name && name === cleanText(clarification.assignedTo).toLowerCase())
  );
}

export {
  clinicalAppointmentClientLabels,
  clinicalClientLabel,
  clinicalContentVersion,
  clinicalReviewStatuses,
  clinicalReviewStatus,
  clinicalReviewSummary,
  defaultClinicalReviewSettings,
  normalizeClinicalReviewSettings,
  normalizedClarifications,
  userMatchesAssignment
};
