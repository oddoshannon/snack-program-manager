const clinicalReviewStatuses = Object.freeze({
  ready: "Ready for Review",
  clarification: "Clarification Requested",
  reviewed: "Reviewed"
});

function cleanText(value) {
  return String(value ?? "").trim();
}

function clinicalReviewStatusOrder(status = "") {
  if (status === clinicalReviewStatuses.clarification) return 0;
  if (status === clinicalReviewStatuses.ready) return 1;
  if (status === clinicalReviewStatuses.reviewed) return 2;
  return 3;
}

function clinicalReviewQueue(reviews = []) {
  return [...reviews].sort((first, second) =>
    clinicalReviewStatusOrder(first.status) - clinicalReviewStatusOrder(second.status)
    || cleanText(second.appointmentDate).localeCompare(cleanText(first.appointmentDate))
    || cleanText(second.appointmentTime).localeCompare(cleanText(first.appointmentTime)));
}

function clinicalReviewCounts(reviews = []) {
  return {
    ready: reviews.filter((item) => item.status === clinicalReviewStatuses.ready).length,
    clarification: reviews.filter((item) => item.status === clinicalReviewStatuses.clarification).length,
    reviewed: reviews.filter((item) => item.status === clinicalReviewStatuses.reviewed).length
  };
}

function clinicalReviewLatestClarification(review = {}) {
  const clarifications = Array.isArray(review.clarifications) ? review.clarifications : [];
  return clarifications.at(-1) || null;
}

function clinicalReviewActionState(review = {}, role = {}) {
  const clarificationOpen = review.status === clinicalReviewStatuses.clarification;
  const reviewed = review.status === clinicalReviewStatuses.reviewed;
  return {
    requestVisible: Boolean(role.reviewer),
    requestDisabled: clarificationOpen,
    requestLabel: clarificationOpen ? clinicalReviewStatuses.clarification : "Request Clarification",
    reviewVisible: Boolean(role.reviewer),
    reviewDisabled: clarificationOpen || reviewed,
    reviewLabel: reviewed ? clinicalReviewStatuses.reviewed : "Mark Reviewed",
    responseVisible: Boolean(review.canRespond && clarificationOpen)
  };
}

export {
  clinicalReviewActionState,
  clinicalReviewCounts,
  clinicalReviewLatestClarification,
  clinicalReviewQueue,
  clinicalReviewStatuses
};
