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

function clinicalReviewDisplayRole(role = {}, advisorPreview = false) {
  if (!advisorPreview || !role.administrator) return { ...role, preview: false };
  return { ...role, reviewer: true, preview: true };
}

function clinicalReviewDemoRecords(referenceDate = new Date().toISOString().slice(0, 10)) {
  const dateOffset = (daysAgo) => {
    const [year, month, day] = cleanText(referenceDate).split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day - daysAgo));
    return date.toISOString().slice(0, 10);
  };
  return [
    {
      id: "demo-clarification",
      clients: ["Eli T."],
      appointmentDate: dateOffset(1),
      appointmentTime: "15:30",
      appointmentType: "Nutrition Education",
      lesson: "Mindful Eating",
      staffMember: "Cynthia Esparza",
      appointmentNote: "Practiced identifying hunger and fullness cues using the hunger scale. The family discussed one routine that may help make mealtimes feel calmer.",
      participantGoals: [{ client: "Eli T.", goal: "Use the hunger scale at one meal each day.", goalResult: "New goal established" }],
      status: clinicalReviewStatuses.clarification,
      reviewedAt: "",
      reviewedByName: "",
      reviewedByTitle: "",
      referralUpdateLabel: "",
      clarifications: [{
        id: "demo-question",
        question: "Which hunger-scale range did the family choose to practice?",
        requestedAt: `${dateOffset(1)}T17:00:00.000Z`,
        requestedByName: "William Koenig",
        assignedTo: "Shannon Oddo",
        answer: "",
        answeredAt: ""
      }],
      canRespond: false
    },
    {
      id: "demo-ready-sugar",
      clients: ["Maya P."],
      appointmentDate: dateOffset(0),
      appointmentTime: "14:30",
      appointmentType: "Nutrition Education",
      lesson: "Sugar",
      staffMember: "Cynthia Esparza",
      appointmentNote: "Reviewed added sugar on common drink labels and compared serving sizes. Client correctly identified two lower-sugar alternatives and selected one to try this week.",
      participantGoals: [{ client: "Maya P.", goal: "Complete the veggie tracker four days this week.", goalResult: "New goal established" }],
      status: clinicalReviewStatuses.ready,
      reviewedAt: "",
      reviewedByName: "",
      reviewedByTitle: "",
      referralUpdateLabel: "",
      clarifications: [],
      canRespond: false
    },
    {
      id: "demo-ready-food-groups",
      clients: ["Jordan C.", "Riley C."],
      appointmentDate: dateOffset(2),
      appointmentTime: "16:00",
      appointmentType: "Sibling Nutrition Education",
      lesson: "Food Groups",
      staffMember: "Shannon Oddo",
      appointmentNote: "Used a meal-building activity to identify the five food groups. Both siblings participated and each built a balanced snack using at least three groups.",
      participantGoals: [
        { client: "Jordan C.", goal: "Add a fruit or vegetable to the after-school snack.", goalResult: "New goal established" },
        { client: "Riley C.", goal: "Help choose one balanced family snack.", goalResult: "New goal established" }
      ],
      status: clinicalReviewStatuses.ready,
      reviewedAt: "",
      reviewedByName: "",
      reviewedByTitle: "",
      referralUpdateLabel: "",
      clarifications: [],
      canRespond: false
    },
    {
      id: "demo-ready-answered",
      clients: ["Avery N."],
      appointmentDate: dateOffset(3),
      appointmentTime: "13:30",
      appointmentType: "Nutrition Education",
      lesson: "Nutrient Density",
      staffMember: "Cynthia Esparza",
      appointmentNote: "Compared foods that provide different nutrients and practiced describing what foods do for the body. Client remained engaged throughout the sorting activity.",
      participantGoals: [{ client: "Avery N.", goal: "Choose one nutrient-dense snack after school.", goalResult: "New goal established" }],
      status: clinicalReviewStatuses.ready,
      reviewedAt: "",
      reviewedByName: "",
      reviewedByTitle: "",
      referralUpdateLabel: "",
      clarifications: [{
        id: "demo-answered-question",
        question: "Was the snack goal selected by the client or caregiver?",
        requestedAt: `${dateOffset(3)}T16:00:00.000Z`,
        requestedByName: "William Koenig",
        assignedTo: "Cynthia Esparza",
        answer: "The client selected the goal and the caregiver agreed to support it.",
        answeredAt: `${dateOffset(2)}T16:00:00.000Z`,
        answeredByName: "Cynthia Esparza"
      }],
      canRespond: false
    },
    {
      id: "demo-reviewed",
      clients: ["Sofia L."],
      appointmentDate: dateOffset(4),
      appointmentTime: "15:00",
      appointmentType: "Nutrition Education",
      lesson: "Healthy Habits",
      staffMember: "Shannon Oddo",
      appointmentNote: "Reviewed progress across the program and identified routines the family plans to continue. Client described increased confidence choosing balanced snacks.",
      participantGoals: [{ client: "Sofia L.", goal: "Continue preparing one balanced snack each weekend.", goalResult: "Goal met" }],
      status: clinicalReviewStatuses.reviewed,
      reviewedAt: `${dateOffset(3)}T18:00:00.000Z`,
      reviewedByName: "William Koenig",
      reviewedByTitle: "Clinical Physician Advisor",
      referralUpdateLabel: "Reviewed by Clinical Physician Advisor",
      clarifications: [],
      canRespond: false
    }
  ];
}

export {
  clinicalReviewActionState,
  clinicalReviewCounts,
  clinicalReviewDemoRecords,
  clinicalReviewDisplayRole,
  clinicalReviewLatestClarification,
  clinicalReviewQueue,
  clinicalReviewStatuses
};
