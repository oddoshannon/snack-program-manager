import {
  populateEnrollmentAppointmentNote,
  populateNutritionEducationAppointmentNote
} from "./appointment-note-templates.js";

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
      appointmentNote: populateNutritionEducationAppointmentNote({
        caregiver: "caregiver",
        caregiverName: "Morgan Taylor",
        weeksSinceLastAppointment: "2",
        previousGoal: "Add a fruit or vegetable to the after-school snack three days each week.",
        rememberedGoal: "Y",
        accomplishedGoal: "Partially",
        goalBarriersOrSupport: "Busy activity nights made the routine harder. Caregiver offered to keep ready-to-eat produce available.",
        otherUpdatesOrWins: "Client reported eating breakfast before school more consistently.",
        lesson: "Mindful Eating",
        discussion: "hunger and fullness cues, the hunger scale, and choosing foods that satisfy tastebuds",
        practice: "a mindful bite and identifying mindful vs. mindless eating habits in the workbook",
        additionalDetails: "Client identified a comfortable stopping point on the hunger and fullness scale but requested another example.",
        newGoal: "Use the hunger scale at one meal each day.",
        nextLesson: "Healthy Habits",
        progressSummary: "that produce was added on two days and that advance preparation would help",
        nextAppointmentWeeks: "2",
        signature: "Cynthia Esparza, DCN, CPT | Nutrition Coordinator"
      }),
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
      id: "demo-ready-enrollment",
      clients: ["Taylor M."],
      appointmentDate: dateOffset(0),
      appointmentTime: "13:00",
      appointmentType: "Enrollment",
      lesson: "Enrollment",
      staffMember: "Cynthia Esparza",
      appointmentNote: populateEnrollmentAppointmentNote({
        caregiver: "caregiver",
        caregiverName: "Jamie Morgan",
        interestReason: "the family wants practical ideas for balanced meals and would like the client to feel more confident trying new foods",
        currentHealthyActivities: "Walks the family dog most evenings and participates in school recess daily.",
        healthGoals: "Build balanced snacks, increase confidence trying vegetables, and establish a consistent breakfast routine.",
        foodPreferences: "Likes strawberries, apples, chicken, rice, yogurt, and cucumbers. Dislikes cooked carrots and very spicy foods.",
        additionalDetails: "Caregiver prefers appointment reminders by text and requested simple activities that can include younger siblings.",
        newGoal: "Eat breakfast before school three days this week and mark each day on the tracker",
        nextLesson: "Nutrient Density",
        nextAppointmentWeeks: "2",
        signature: "Cynthia Esparza, DCN, CPT | Nutrition Coordinator"
      }),
      participantGoals: [{ client: "Taylor M.", goal: "Eat breakfast before school three days this week.", goalResult: "New goal established" }],
      status: clinicalReviewStatuses.ready,
      reviewedAt: "",
      reviewedByName: "",
      reviewedByTitle: "",
      referralUpdateLabel: "",
      clarifications: [],
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
      appointmentNote: populateNutritionEducationAppointmentNote({
        caregiver: "caregiver",
        caregiverName: "Alex Parker",
        weeksSinceLastAppointment: "2",
        previousGoal: "Drink water with dinner four days each week.",
        rememberedGoal: "Y",
        accomplishedGoal: "Y",
        goalBarriersOrSupport: "Caregiver kept a filled water bottle available at the table.",
        otherUpdatesOrWins: "Client tried sparkling water and found one flavor they enjoy.",
        lesson: "Sugar",
        discussion: "natural and added sugar, how sugar provides energy, and daily added sugar guidelines for kids",
        practice: "estimating sugar in common drinks and reading total and added sugar on Nutrition Facts labels",
        additionalDetails: "Client independently located added sugar on two practice labels.",
        newGoal: "Complete the veggie tracker four days this week",
        nextLesson: "Food Groups",
        progressSummary: "that the water goal was completed and having a water bottle nearby was helpful",
        nextAppointmentWeeks: "2",
        signature: "Cynthia Esparza, DCN, CPT | Nutrition Coordinator"
      }),
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
      clients: ["Jordan C."],
      appointmentDate: dateOffset(2),
      appointmentTime: "16:00",
      appointmentType: "Nutrition Education",
      lesson: "Food Groups",
      staffMember: "Shannon Oddo",
      appointmentNote: populateNutritionEducationAppointmentNote({
        caregiver: "caregiver",
        caregiverName: "Robin Carter",
        weeksSinceLastAppointment: "3",
        previousGoal: "Complete the veggie tracker four days in one week.",
        rememberedGoal: "Y",
        accomplishedGoal: "Partially",
        goalBarriersOrSupport: "Client completed three days. Caregiver plans to post the tracker on the refrigerator as a reminder.",
        otherUpdatesOrWins: "Client helped select vegetables at the grocery store.",
        lesson: "Food Groups",
        discussion: "the five food groups, key nutrients, whole and refined grains, and how many food groups to include at meals",
        practice: "building a balanced meal with at least three food groups and planning a day of meals in the workbook",
        additionalDetails: "Client accurately categorized all practice foods after one prompt.",
        newGoal: "Add a fruit or vegetable to the after-school snack four days this week",
        nextLesson: "Macronutrients",
        progressSummary: "that the tracker was completed on three days and moving it to a visible location may help",
        nextAppointmentWeeks: "2",
        signature: "Shannon Oddo, MScN | Executive Director"
      }),
      participantGoals: [{ client: "Jordan C.", goal: "Add a fruit or vegetable to the after-school snack four days this week.", goalResult: "New goal established" }],
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
      appointmentNote: populateNutritionEducationAppointmentNote({
        caregiver: "caregiver",
        caregiverName: "Sam Nelson",
        weeksSinceLastAppointment: "2",
        previousGoal: "Help prepare one balanced snack during the weekend.",
        rememberedGoal: "Y",
        accomplishedGoal: "Y",
        goalBarriersOrSupport: "Caregiver invited the client to choose ingredients and prepare the snack together.",
        otherUpdatesOrWins: "Client prepared yogurt with berries and granola for the family.",
        lesson: "Nutrient Density",
        discussion: "nutrient density, nutrient-dense foods, sometimes foods, and why calories alone do not describe a food’s nutritional value",
        practice: "making a meal more nutrient-dense and scoring foods for nutrient density in the workbook",
        additionalDetails: "Client explained one way to improve the nutrient density of a familiar breakfast.",
        newGoal: "Choose one nutrient-dense snack after school three days this week",
        nextLesson: "Sugar",
        progressSummary: "that preparing the snack with caregiver support made the goal enjoyable and manageable",
        nextAppointmentWeeks: "2",
        signature: "Cynthia Esparza, DCN, CPT | Nutrition Coordinator"
      }),
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
      appointmentNote: populateNutritionEducationAppointmentNote({
        caregiver: "caregiver",
        caregiverName: "Drew Lopez",
        weeksSinceLastAppointment: "2",
        previousGoal: "Turn off screens 30 minutes before bedtime on school nights.",
        rememberedGoal: "Y",
        accomplishedGoal: "Y",
        goalBarriersOrSupport: "Caregiver set a shared household reminder and charged devices outside the bedroom.",
        otherUpdatesOrWins: "Client reported falling asleep more easily on the nights the routine was used.",
        lesson: "Healthy Habits",
        discussion: "physical activity, screen time, sleep, positivity, and practical strategies for building healthy routines",
        practice: "designing a bedtime routine and identifying healthy swaps for screen time in the workbook",
        additionalDetails: "Client selected an affirmation to place near the bedtime routine chart.",
        newGoal: "Continue the screen-free bedtime routine on four school nights each week",
        nextLesson: "Program Graduation",
        progressSummary: "that the household reminder and charging devices outside the bedroom supported the previous goal",
        nextAppointmentWeeks: "2",
        signature: "Shannon Oddo, MScN | Executive Director"
      }),
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
