const nutritionEducationObjectives = Object.freeze({
  "Nutrient Density": Object.freeze([
    "Define nutrient density; identify nutrient-dense foods.",
    "Define and identify “sometimes” foods.",
    "Discuss why nutrient density is more important than calories alone.",
    "Practice making a meal more nutrient-dense using the workbook activity.",
    "Practice scoring foods for nutrient density using the workbook activity."
  ]),
  Sugar: Object.freeze([
    "Define natural sugar and added sugar; identify examples of each.",
    "Explain how sugar gives the body energy and how different types of sugar impact health.",
    "Identify where to find total sugar and added sugar on the Nutrition Facts label.",
    "Discuss daily added sugar guidelines for kids.",
    "Practice estimating sugar content in common drinks and reading labels to check guesses using the workbook activity.",
    "Practice categorizing common foods as natural sugar or added sugar foods using the workbook activity."
  ]),
  "Food Groups": Object.freeze([
    "Identify the five main food groups: vegetables, fruits, grains, protein foods, and dairy/fortified non-dairy alternatives.",
    "Describe key nutrients provided by each food group.",
    "Identify the difference between whole and refined grains.",
    "Define the number of food groups to eat at every meal and every day.",
    "Practice creating a balanced meal with at least three food groups using the workbook activity.",
    "Practice planning either a full day or a full week of meals using the workbook activity."
  ]),
  Macronutrients: Object.freeze([
    "Define carbohydrates, protein, and fat; explain their roles in the body.",
    "Describe the importance of fiber and its benefits for digestion, fullness, and energy.",
    "Identify macronutrients in foods and meals.",
    "Practice creating balanced snacks that include fiber, protein, and fat using the workbook activity.",
    "Practice identifying macronutrients in breakfast foods using the workbook activity.",
    "Optional: Reinforce concepts through the Macronutrient BINGO activity."
  ]),
  Micronutrients: Object.freeze([
    "Define micronutrients, vitamins, and minerals; explain their roles in the body broadly.",
    "Highlight the “Eat the Rainbow” concept: a variety of colors provides a variety of nutrients.",
    "Discuss the importance of water/hydration and the concept of “eating your water.”",
    "Define calcium and iron; explain their roles in the body; identify foods that are rich in calcium and iron.",
    "Identify fruits and vegetables by color and associated nutrients.",
    "Practice creating a meal with at least three different colors of fruits and vegetables using the workbook activity.",
    "Practice identifying micronutrient vocabulary using the workbook activity."
  ]),
  "Mindful Eating": Object.freeze([
    "Define mindful eating; discuss how to eat mindfully.",
    "Explain the benefits of mindful eating and how it can impact health.",
    "Identify hunger and fullness cues.",
    "Explain how the hunger and fullness scale can help clients notice body cues before, during, and after eating.",
    "Discuss choosing foods that satisfy tastebuds and the time it takes for the brain to recognize fullness.",
    "Practice having a mindful bite using the workbook activity.",
    "Practice identifying mindful vs. mindless eating habits using the workbook activity."
  ]),
  "Healthy Habits": Object.freeze([
    "Describe healthy lifestyle habits including physical activity, screen time, sleep, and positivity.",
    "Identify recommended guidelines for physical activity, screen time, sleep, and daily positivity practices.",
    "Identify strategies for increasing physical activity, limiting screen time, improving sleep, and practicing positivity.",
    "Practice creating a DIY circuit using the workbook activity.",
    "Practice finding healthy swaps for screen time using the workbook activity.",
    "Practice designing a bedtime routine or creating an affirmation poster using a workbook activity."
  ])
});

function cleanText(value) {
  return String(value ?? "").trim();
}

function populatedLine(value, fallback = "Not recorded") {
  return cleanText(value) || fallback;
}

function objectiveLines(lesson) {
  return (nutritionEducationObjectives[cleanText(lesson)] || [])
    .map((objective) => `• ${objective}`);
}

function populateEnrollmentAppointmentNote(values = {}) {
  const newGoal = populatedLine(values.newGoal);
  const nextAppointmentWeeks = populatedLine(values.nextAppointmentWeeks);
  return [
    "SNACK Enrollment",
    "",
    `Client had an appointment with ${populatedLine(values.caregiver)}, ${populatedLine(values.caregiverName)}, to enroll in the SNACK Program. Client is interested in the program because ${populatedLine(values.interestReason)}. Client was given an overview of SNACK’s services that are available, as well as the nutrition ed topics and the incentives they can earn.`,
    "",
    "Current Healthy Activities:",
    populatedLine(values.currentHealthyActivities),
    "",
    "Health Goals:",
    populatedLine(values.healthGoals),
    "",
    "Food Likes/Dislikes:",
    populatedLine(values.foodPreferences),
    "",
    "Additional Details:",
    populatedLine(values.additionalDetails, "None reported."),
    "",
    "New Goal:",
    newGoal,
    "",
    "Next Lesson:",
    populatedLine(values.nextLesson),
    "",
    `SUMMARY: Client was given an overview of the nutrition education program including lesson topics and incentives. We reviewed the client's personal health goals and discussed the client's food preferences. Client completed a goal setting activity that included how to track their goal at home. Client set a goal of ${newGoal}. Client scheduled their next appointment in ${nextAppointmentWeeks} weeks.`,
    "",
    "Signature:",
    populatedLine(values.signature)
  ].join("\n");
}

function populateNutritionEducationAppointmentNote(values = {}) {
  const lesson = populatedLine(values.lesson);
  const newGoal = populatedLine(values.newGoal);
  const nextAppointmentWeeks = populatedLine(values.nextAppointmentWeeks);
  const objectives = objectiveLines(lesson);
  return [
    "SNACK Nutrition Education",
    "",
    `Client had an appointment with ${populatedLine(values.caregiver)}, ${populatedLine(values.caregiverName)}, for a SNACK Program nutrition education lesson. Their last appointment was ${populatedLine(values.weeksSinceLastAppointment)} weeks ago.`,
    "",
    "Previous Goal:",
    populatedLine(values.previousGoal),
    "",
    "Client remembered goal:",
    populatedLine(values.rememberedGoal),
    "",
    "Client accomplished goal:",
    populatedLine(values.accomplishedGoal),
    "",
    "Goal barriers or support:",
    populatedLine(values.goalBarriersOrSupport),
    "",
    "Other updates or wins:",
    populatedLine(values.otherUpdatesOrWins),
    "",
    `Today’s nutrition ed topic was ${lesson} - we discussed ${populatedLine(values.discussion)} and practiced ${populatedLine(values.practice)}. Lesson objectives included:`,
    "",
    "Lesson Objectives",
    ...(objectives.length ? objectives : ["• No lesson objectives recorded."]),
    "",
    "Additional Details:",
    populatedLine(values.additionalDetails, "None reported."),
    "",
    "New Goal:",
    newGoal,
    "",
    "Next Lesson:",
    populatedLine(values.nextLesson),
    "",
    `SUMMARY: We reviewed the client's previous goal and checked in about goal progress. Client shared ${populatedLine(values.progressSummary)}. We discussed the nutrition ed topic ${lesson}, including ${populatedLine(values.discussion)} and practicing ${populatedLine(values.practice)}. Client completed a goal setting activity that included how to track their goal at home. Client set a goal of ${newGoal}. Client scheduled their next appointment in ${nextAppointmentWeeks} weeks.`,
    "",
    "Signature:",
    populatedLine(values.signature)
  ].join("\n");
}

export {
  nutritionEducationObjectives,
  populateEnrollmentAppointmentNote,
  populateNutritionEducationAppointmentNote
};
