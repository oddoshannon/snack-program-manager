const operationsProgramAreas = ["Organization", "Financial", "Clinic", "Cooking", "School", "Community"];
const operationsProgramAreaLabels = Object.freeze({ Cooking: "Kitchen" });
const operationsCalculationModes = ["Automatic", "Manual", "Needs Definition", "Not Configured"];
const operationsDirections = ["Higher is better", "Lower is better", "No target status"];
const operationsReportingFrequencies = ["Ongoing", "Monthly", "Quarterly", "Semiannual", "Annual"];

const operationsExecutiveProgramConfig = Object.freeze([
  {
    area: "Clinic",
    label: "Clinic",
    subtitle: "Family Nutrition",
    metricKeys: ["clinic.children-enrolled", "clinic.appointments-delivered", "clinic.retention-rate"]
  },
  {
    area: "Cooking",
    label: "Kitchen",
    subtitle: "Kitchen Classes",
    metricKeys: ["cooking.participants-served", "cooking.classes-delivered", "cooking.attendance-rate"]
  },
  {
    area: "School",
    label: "School",
    subtitle: "School Classes",
    metricKeys: ["school.schools-reached", "school.students-reached", "school.knowledge-gain"]
  },
  {
    area: "Community",
    label: "Community",
    subtitle: "Outreach Events",
    metricKeys: ["community.families-reached", "community.events-completed", "community.referrals-generated"]
  }
]);

const operationsExecutiveSnapshotKeys = Object.freeze([
  "organization.children-served",
  "organization.program-engagements",
  "community.families-reached",
  "clinic.referrals-received"
]);

const operationsFinancialMixConfig = Object.freeze([
  { metricKey: "financial.grant-revenue", label: "Grants" },
  { metricKey: "financial.hrsn-revenue", label: "HRSN" },
  { metricKey: "financial.workbook-sales", label: "Workbook Sales" }
]);

const operationsFinancialMetricOrder = Object.freeze([
  "financial.total-revenue",
  "financial.grant-revenue",
  "financial.hrsn-revenue",
  "financial.workbook-sales",
  "financial.merchandise-sales",
  "financial.toolkit-sales"
]);

const operationsEvaluationFilters = Object.freeze([
  "All Questions",
  "Questionnaire",
  "Clinic Knowledge Assessment",
  "Measurement Gaps"
]);
const operationsEvaluationMappingStatuses = Object.freeze([
  "Mapped",
  "Scoring Needed",
  "Needs Review",
  "Draft"
]);
const operationsEvaluationRecordStatuses = Object.freeze([
  "Draft",
  "Active",
  "Retired"
]);

const hrsnCoveredPopulationOptions = Object.freeze([
  "Child Welfare",
  "Physical Health Need",
  "Behavioral Health Need",
  "Behavioral Health Facility",
  "Incarceration",
  "Unhoused",
  "Young Adult With Special Healthcare Needs",
  "Developmental Disability",
  "Interpersonal Violence",
  "Pregnant/Postpartum",
  "ED/Crisis Encounters"
]);

const hrsnDescriptionOptions = Object.freeze([
  "Engaging Members who may be eligible for HRSN Services - in person (office) meeting",
  "Identifying and verifying the Member's CCO enrollment",
  "Verifying the Member is Presumed HRSN Eligible through screening questionnaire & conversational questions"
]);

const hrsnOutcomeOptions = Object.freeze([
  "O&E Invoice",
  "NE Invoice",
  "HRSN Referral",
  "None"
]);

const healthQuestionnaireMappings = [
  ["CHQ-01", "Vegetables", "During the past 7 days, on how many days did [Child] eat vegetables?", "Include fresh, frozen, or canned vegetables.", ["clinic.guideline-improvement", "clinic.behavior-change"]],
  ["CHQ-02", "Vegetables", "On a day when [Child] ate vegetables, about how many times did they eat them?", "Count each meal or snack once.", ["clinic.guideline-improvement", "clinic.behavior-change"]],
  ["CHQ-03", "Fruit", "During the past 7 days, on how many days did [Child] eat fruit?", "Include fresh, frozen, canned, or dried fruit. Do not count fruit juice.", ["clinic.guideline-improvement", "clinic.behavior-change"]],
  ["CHQ-04", "Fruit", "On a day when [Child] ate fruit, about how many times did they eat it?", "Count each meal or snack once.", ["clinic.guideline-improvement", "clinic.behavior-change"]],
  ["CHQ-05", "Whole Grains", "During the past 7 days, on how many days did [Child] eat a whole-grain food?", "Examples include oatmeal, whole-grain cereal or bread, brown rice, quinoa, whole-grain pasta, or tortillas made with whole corn or whole wheat.", ["clinic.guideline-improvement", "clinic.behavior-change"]],
  ["CHQ-06", "Whole Grains", "Thinking about all the grain foods [Child] ate during the past 7 days, about how many were whole-grain foods?", "", ["clinic.guideline-improvement", "clinic.behavior-change"]],
  ["CHQ-07", "Drinks With Added Sugar", "During the past 7 days, on how many days did [Child] have a drink with added sugar?", "Examples include soda, fruit drinks, sports drinks, energy drinks, sweet tea, lemonade, or flavored milk such as chocolate or strawberry milk. Do not count plain milk or 100% fruit juice.", ["clinic.guideline-improvement", "clinic.behavior-change"]],
  ["CHQ-08", "Drinks With Added Sugar", "On a day when [Child] had a drink with added sugar, about how many times did they have one?", "", ["clinic.guideline-improvement", "clinic.behavior-change"]],
  ["CHQ-09", "Foods With Added Sugar", "During the past 7 days, on how many days did [Child] eat a food with added sugar?", "Examples include candy, cookies, cake, pastries, doughnuts, ice cream, sweetened yogurt, or sweetened cereal.", ["clinic.guideline-improvement", "clinic.behavior-change"]],
  ["CHQ-10", "Foods With Added Sugar", "On a day when [Child] ate a food with added sugar, about how many times did they eat one?", "", ["clinic.guideline-improvement", "clinic.behavior-change"]],
  ["CHQ-11", "Healthy Habits", "During the past 7 days, on how many days was [Child] physically active for a total of at least 60 minutes?", "Add together activities that made their heart beat faster or made them breathe harder.", ["clinic.behavior-change"]],
  ["CHQ-12", "Healthy Habits", "During the past 7 days, about how many hours per day did [Child] use screens for fun?", "Do not count time for school or homework.", ["clinic.behavior-change"]],
  ["CHQ-13", "Healthy Habits", "During the past 7 days, about how many hours of sleep did [Child] get on most nights?", "", ["clinic.behavior-change"]]
].map(([id, topic, question, helperText, metricKeys], index) => Object.freeze({
  id,
  instrumentId: "clinic-health-2026-1",
  instrument: "Nutrition & Healthy Habits Questionnaire",
  version: "2026.1",
  question,
  helperText,
  topic,
  respondentType: "Child or Caregiver",
  administrationPoint: "Enrollment / Graduation",
  responseType: "Single choice",
  logicModelOutcome: topic === "Healthy Habits"
    ? "Sustainable healthy habits and positive behavior change"
    : "Greater alignment with recommended dietary patterns",
  metricKeys,
  mappingStatus: "Mapped",
  recordStatus: "Active",
  required: true,
  sortOrder: index + 1,
  scoringRule: "Normalized to a 0-100 behavior-domain score; I don't know is missing data.",
  responseOptions: [],
  note: "Approved for the 2026.1 Nutrition & Healthy Habits Questionnaire."
}));

const knowledgeQuestionText = [
  "I know what nutrient dense foods are and can identify examples.",
  "I know how often to choose nutrient dense foods.",
  "I know how to make a meal or snack more nutrient dense.",
  "I know what \"sometimes\" foods are and can identify examples.",
  "I understand why nutrients can tell me more about a food than calories alone.",
  "I know the difference between natural sugar and added sugar and can identify examples of each.",
  "I know which type of sugar to choose most often.",
  "I know extra added sugar can affect my health.",
  "I know where to find added sugar on a nutrition label.",
  "I know the recommended daily limit for added sugar.",
  "I can name the five food groups.",
  "I can identify foods in each food group.",
  "I know the difference between whole grains and refined grains.",
  "I know how many different food groups to include in a meal.",
  "I know how many different food groups to include throughout the day.",
  "I know what carbohydrates, proteins, and fats are and what they do for my body.",
  "I know what fiber is and how it helps digestion.",
  "I can identify carbohydrates, protein, and fat in foods and meals.",
  "I know how to create a balanced snack with fiber, protein, and fat.",
  "I know what micronutrients, vitamins, and minerals are and what they do for my body.",
  "I know what \"eat the rainbow\" means and why it is helpful.",
  "I know what calcium and iron do for my body.",
  "I can identify foods that provide calcium and iron.",
  "I know what mindful eating is and how to practice it.",
  "I know how mindful eating can support my health.",
  "I can recognize hunger and fullness cues in my body.",
  "I know that choosing foods I enjoy can be part of mindful eating.",
  "I know it can take time for my brain to notice when my stomach is full.",
  "I know how much physical activity is recommended each day.",
  "I know the recommended limits of screen time for fun each day.",
  "I know how much sleep is recommended for my age.",
  "I know strategies that can help me be more physically active.",
  "I know strategies that can help me limit screen time for fun.",
  "I know habits that can help me sleep well."
];

function knowledgeTopic(index) {
  if (index < 5) return "Nutrient Density";
  if (index < 10) return "Sugar";
  if (index < 15) return "Food Groups";
  if (index < 19) return "Macronutrients";
  if (index < 23) return "Micronutrients";
  if (index < 28) return "Mindful Eating";
  return "Healthy Habits";
}

function knowledgeLessonNumber(index) {
  if (index < 5) return 1;
  if (index < 10) return 2;
  if (index < 15) return 3;
  if (index < 19) return 4;
  if (index < 23) return 5;
  if (index < 28) return 6;
  return 7;
}

const knowledgeTestMappings = knowledgeQuestionText.map((question, index) => Object.freeze({
  id: `CKA2-${String(index + 1).padStart(2, "0")}`,
  instrumentId: "clinic-knowledge-2026-2",
  instrument: "Clinic Knowledge Assessment",
  version: "2026.2",
  question,
  topic: `Lesson ${knowledgeLessonNumber(index)}: ${knowledgeTopic(index)}`,
  respondentType: "",
  administrationPoint: "Graduation",
  responseType: "Retrospective Before SNACK / Now Yes / No self-report",
  logicModelOutcome: "Increased nutrition knowledge and food literacy",
  metricKeys: ["clinic.knowledge-gain"],
  mappingStatus: "Mapped",
  recordStatus: "Active",
  required: true,
  sortOrder: index + 1,
  scoringRule: "Before SNACK and Now: Yes = 1; No = 0; lessons weighted equally",
  responseOptions: ["Yes", "No"],
  note: "Approved for the 2026.2 retrospective Clinic Knowledge Assessment."
}));

const operationsEvaluationQuestions = Object.freeze([
  ...healthQuestionnaireMappings,
  ...knowledgeTestMappings
]);

const operationsEvaluationMetricGaps = Object.freeze([
  { metricKey: "clinic.quality-of-life", programArea: "Clinic", need: "Select a child-appropriate quality-of-life instrument and scoring rule." },
  { metricKey: "clinic.participant-satisfaction", programArea: "Clinic", need: "Approve a participant or caregiver satisfaction question and positive-response threshold." },
  { metricKey: "school.knowledge-gain", programArea: "School", need: "Create the matched School pre/post knowledge assessment." },
  { metricKey: "school.knowledge-retention", programArea: "School", need: "Choose a School follow-up interval and retention rule." },
  { metricKey: "school.teacher-satisfaction", programArea: "School", need: "Approve the teacher satisfaction question and positive-response threshold." },
  { metricKey: "school.teacher-confidence", programArea: "School", need: "Create the teacher confidence pre/post measure." },
  { metricKey: "cooking.food-confidence", programArea: "Cooking", need: "Approve a Kitchen confidence scale and administration method." },
  { metricKey: "cooking.intent-at-home", programArea: "Cooking", need: "Add the intent-to-prepare-at-home question and positive-response rule." },
  { metricKey: "cooking.guideline-improvement", programArea: "Cooking", need: "Approve food-specific Kitchen questions and the future combined score." },
  { metricKey: "cooking.quality-of-life", programArea: "Cooking", need: "Select a quality-of-life instrument and scoring rule." },
  { metricKey: "cooking.satisfaction", programArea: "Cooking", need: "Approve the Kitchen satisfaction question and positive-response threshold." },
  { metricKey: "community.partner-satisfaction", programArea: "Community", need: "Approve a partner satisfaction survey and positive-response threshold." }
]);

function cleanText(value) {
  return String(value ?? "").trim();
}

function hrsnClaimStatus(claim = {}) {
  if (claim.approved) return "Approved";
  if (claim.submitted) return "Submitted";
  return "Draft";
}

function hrsnBillingSummary(claims = []) {
  return {
    totalCount: claims.length,
    draftCount: claims.filter((claim) => hrsnClaimStatus(claim) === "Draft").length,
    submittedCount: claims.filter((claim) => hrsnClaimStatus(claim) === "Submitted").length,
    approvedCount: claims.filter((claim) => hrsnClaimStatus(claim) === "Approved").length
  };
}

function hrsnClaimMatches(claim = {}, query = "") {
  const normalizedQuery = cleanText(query).toLowerCase();
  if (!normalizedQuery) return true;
  return [
    claim.name,
    claim.serviceDate,
    claim.invoiceNumber,
    ...(Array.isArray(claim.outcomes) ? claim.outcomes : [claim.outcome]),
    ...(Array.isArray(claim.descriptions) ? claim.descriptions : [claim.description]),
    hrsnClaimStatus(claim)
  ].some((value) => cleanText(value).toLowerCase().includes(normalizedQuery));
}

function hrsnClaimPayload(form) {
  const data = form instanceof FormData ? form : new FormData(form);
  return {
    submitted: data.has("submitted"),
    approved: data.has("approved"),
    approvalDate: cleanText(data.get("approvalDate")),
    clientId: cleanText(data.get("clientId")),
    name: cleanText(data.get("name")),
    dateOfBirth: cleanText(data.get("dateOfBirth")),
    medicaidId: cleanText(data.get("medicaidId")),
    address: cleanText(data.get("address")),
    serviceDate: cleanText(data.get("serviceDate")),
    durationMinutes: Number(data.get("durationMinutes")),
    amount: Number(data.get("amount")),
    coveredPopulations: [...new Set(data.getAll("coveredPopulations").map(cleanText).filter(Boolean))],
    foodSecurityScore: Number(data.get("foodSecurityScore")),
    descriptions: [...new Set(data.getAll("descriptions").map(cleanText).filter(Boolean))],
    outcomes: [...new Set(data.getAll("outcomes").map(cleanText).filter(Boolean))],
    invoiceNumber: cleanText(data.get("invoiceNumber")),
    notes: cleanText(data.get("notes"))
  };
}

function budgetCategoryPayload(form) {
  const data = form instanceof FormData ? form : new FormData(form);
  return {
    budgetYear: Number(data.get("budgetYear")),
    groupName: cleanText(data.get("groupName")),
    name: cleanText(data.get("name")),
    annualBudget: Number(data.get("annualBudget")),
    active: data.has("active"),
    sortOrder: Number(data.get("sortOrder") || 0),
    ynabCategoryId: cleanText(data.get("ynabCategoryId")),
    notes: cleanText(data.get("notes"))
  };
}

function budgetCategoriesForYear(categories = [], budgetYear = new Date().getFullYear()) {
  return categories
    .filter((category) => Number(category.budgetYear) === Number(budgetYear))
    .sort((first, second) => (
      Number(first.sortOrder || 0) - Number(second.sortOrder || 0)
      || cleanText(first.groupName).localeCompare(cleanText(second.groupName))
      || cleanText(first.name).localeCompare(cleanText(second.name))
    ));
}

function budgetCategoryGroups(categories = [], budgetYear = new Date().getFullYear()) {
  const groups = new Map();
  budgetCategoriesForYear(categories, budgetYear).forEach((category) => {
    if (!groups.has(category.groupName)) groups.set(category.groupName, []);
    groups.get(category.groupName).push(category);
  });
  return [...groups.entries()].map(([name, items]) => ({ name, items }));
}

function budgetSummary(categories = [], budgetYear = new Date().getFullYear()) {
  const yearCategories = budgetCategoriesForYear(categories, budgetYear);
  return {
    annualBudget: yearCategories.filter((category) => category.active).reduce((sum, category) => sum + Number(category.annualBudget || 0), 0),
    groupCount: new Set(yearCategories.map((category) => category.groupName)).size,
    activeCategoryCount: yearCategories.filter((category) => category.active).length,
    totalCategoryCount: yearCategories.length
  };
}

function budgetPlanningSummary(categories = [], budgetYear = new Date().getFullYear(), options = {}) {
  const yearCategories = budgetCategoriesForYear(categories, budgetYear).filter((category) => category.active);
  const annualBudget = yearCategories.reduce((sum, category) => sum + Number(category.annualBudget || 0), 0);
  const recordedActuals = yearCategories
    .map((category) => optionalNumber(category.actualSpending))
    .filter((value) => value !== null);
  const suppliedActual = optionalNumber(options.actualSpending);
  const actualSpending = suppliedActual !== null
    ? suppliedActual
    : recordedActuals.length
      ? recordedActuals.reduce((sum, value) => sum + value, 0)
      : null;
  const cashBalance = optionalNumber(options.cashBalance);
  const expectedInflows = optionalNumber(options.expectedInflows);
  const expectedOutflows = optionalNumber(options.expectedOutflows);
  const trailingAverageMonthlyExpenses = optionalNumber(options.trailingAverageMonthlyExpenses);
  const projectedCashBalance = [cashBalance, expectedInflows, expectedOutflows].every((value) => value !== null)
    ? cashBalance + expectedInflows - expectedOutflows
    : null;
  const monthsCashOnHand = cashBalance !== null && trailingAverageMonthlyExpenses > 0
    ? cashBalance / trailingAverageMonthlyExpenses
    : null;
  const programParticipants = options.programParticipants || {};
  const groupProgram = Object.freeze({
    Clinic: "Clinic",
    Kitchen: "Kitchen",
    School: "School",
    Events: "Community",
    Community: "Community"
  });
  const directActuals = { Clinic: 0, Kitchen: 0, School: 0, Community: 0 };
  const directActualAvailability = { Clinic: false, Kitchen: false, School: false, Community: false };
  yearCategories.forEach((category) => {
    const program = groupProgram[cleanText(category.groupName)];
    const actual = optionalNumber(category.actualSpending);
    if (!program || actual === null) return;
    directActuals[program] += actual;
    directActualAvailability[program] = true;
  });
  const costPerParticipant = Object.fromEntries(Object.keys(directActuals).map((program) => {
    const participantCount = optionalNumber(programParticipants[program]);
    const value = directActualAvailability[program] && participantCount > 0
      ? directActuals[program] / participantCount
      : null;
    return [program, value];
  }));

  return {
    annualBudget,
    actualSpending,
    remainingBudget: actualSpending === null ? null : annualBudget - actualSpending,
    budgetUsedPercent: actualSpending === null || annualBudget <= 0 ? null : (actualSpending / annualBudget) * 100,
    cashBalance,
    expectedInflows,
    expectedOutflows,
    projectedCashBalance,
    trailingAverageMonthlyExpenses,
    monthsCashOnHand,
    costPerParticipant
  };
}

function operationsEvaluationSummary(questions = operationsEvaluationQuestions, gaps = operationsEvaluationMetricGaps) {
  const instruments = new Set(questions.map((question) => question.instrument));
  return {
    questionCount: questions.length,
    instrumentCount: instruments.size,
    mappedCount: questions.filter((question) => question.metricKeys?.length).length,
    scoringNeededCount: questions.filter((question) => question.mappingStatus === "Scoring Needed").length,
    gapCount: gaps.length
  };
}

function operationsEvaluationQuestionsForFilter(
  questions = operationsEvaluationQuestions,
  filter = "All Questions",
  query = ""
) {
  const normalizedQuery = cleanText(query).toLowerCase();
  return questions.filter((question) => {
    const filterMatches = filter === "All Questions"
      || (filter === "Questionnaire" && question.instrument.includes("Questionnaire"))
      || question.instrument === filter;
    if (!filterMatches) return false;
    if (!normalizedQuery) return true;
    return [
      question.id,
      question.question,
      question.topic,
      question.instrument,
      question.logicModelOutcome,
      ...(question.metricKeys || [])
    ].some((value) => cleanText(value).toLowerCase().includes(normalizedQuery));
  });
}

function mergeOperationsEvaluationQuestions(defaultQuestions = [], savedQuestions = []) {
  const savedById = new Map(
    savedQuestions
      .filter((question) => cleanText(question.id))
      .map((question) => [cleanText(question.id), question])
  );
  const merged = defaultQuestions.map((question) => {
    const saved = savedById.get(question.id);
    if (!saved) return {
      ...question,
      instrumentId: cleanText(question.instrumentId),
      recordStatus: cleanText(question.recordStatus) || "Draft",
      required: question.required === true,
      sortOrder: optionalNumber(question.sortOrder),
      scoringRule: cleanText(question.scoringRule) || "Not Configured",
      responseOptions: Array.isArray(question.responseOptions) ? [...question.responseOptions] : [],
      metricKeys: [...(question.metricKeys || [])]
    };
    savedById.delete(question.id);
    return {
      ...question,
      ...saved,
      id: question.id,
      instrumentId: cleanText(saved.instrumentId || question.instrumentId),
      recordStatus: cleanText(saved.recordStatus || question.recordStatus) || "Draft",
      required: saved.required === true,
      sortOrder: optionalNumber(saved.sortOrder ?? question.sortOrder),
      scoringRule: cleanText(saved.scoringRule || question.scoringRule) || "Not Configured",
      responseOptions: Array.isArray(saved.responseOptions)
        ? [...saved.responseOptions]
        : Array.isArray(question.responseOptions) ? [...question.responseOptions] : [],
      metricKeys: Array.isArray(saved.metricKeys) ? [...saved.metricKeys] : [...(question.metricKeys || [])]
    };
  });

  return [
    ...merged,
    ...[...savedById.values()]
      .map((question) => ({
        ...question,
        id: cleanText(question.id),
        instrumentId: cleanText(question.instrumentId),
        recordStatus: cleanText(question.recordStatus) || "Draft",
        required: question.required === true,
        sortOrder: optionalNumber(question.sortOrder),
        scoringRule: cleanText(question.scoringRule) || "Not Configured",
        responseOptions: Array.isArray(question.responseOptions) ? [...question.responseOptions] : [],
        metricKeys: Array.isArray(question.metricKeys) ? [...question.metricKeys] : []
      }))
      .sort((first, second) => cleanText(first.instrument).localeCompare(cleanText(second.instrument)) || first.id.localeCompare(second.id))
  ];
}

function operationsEvaluationQuestionPayload(form) {
  const data = form instanceof FormData ? form : new FormData(form);
  return {
    id: cleanText(data.get("id")),
    instrumentId: cleanText(data.get("instrumentId")),
    instrument: cleanText(data.get("instrument")),
    version: cleanText(data.get("version")),
    question: cleanText(data.get("question")),
    topic: cleanText(data.get("topic")),
    respondentType: cleanText(data.get("respondentType")),
    administrationPoint: cleanText(data.get("administrationPoint")),
    responseType: cleanText(data.get("responseType")),
    logicModelOutcome: cleanText(data.get("logicModelOutcome")),
    metricKeys: [...new Set(data.getAll("metricKeys").map(cleanText).filter(Boolean))],
    mappingStatus: cleanText(data.get("mappingStatus")) || "Needs Review",
    recordStatus: cleanText(data.get("recordStatus")) || "Draft",
    required: data.has("required"),
    sortOrder: optionalNumber(data.get("sortOrder")),
    scoringRule: cleanText(data.get("scoringRule")) || "Not Configured",
    responseOptions: [...new Set(cleanText(data.get("responseOptions")).split("\n").map(cleanText).filter(Boolean))],
    note: cleanText(data.get("note"))
  };
}

function operationsEvaluationInstrumentPayload(form) {
  const data = form instanceof FormData ? form : new FormData(form);
  return {
    id: cleanText(data.get("id")),
    name: cleanText(data.get("name")),
    version: cleanText(data.get("version")),
    effectiveDate: cleanText(data.get("effectiveDate")),
    programArea: cleanText(data.get("programArea")),
    status: cleanText(data.get("status")) || "Draft",
    description: cleanText(data.get("description")),
    administrationPoints: [...new Set(cleanText(data.get("administrationPoints")).split(",").map(cleanText).filter(Boolean))],
    languages: [...new Set(cleanText(data.get("languages")).split(",").map(cleanText).filter(Boolean))],
    notes: cleanText(data.get("notes"))
  };
}

function optionalNumber(value) {
  const text = cleanText(value);
  if (!text) return null;
  const number = Number(text);
  return Number.isFinite(number) ? number : null;
}

function formatOperationsValue(metric, value = metric?.currentValue) {
  if (value === null || value === undefined || value === "") return "-";
  const number = Number(value);
  if (!Number.isFinite(number)) return cleanText(value) || "-";
  if (metric?.unit === "Dollars") {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(number);
  }
  if (metric?.unit === "Percentage") return `${number.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
  if (metric?.unit === "Days") return `${number.toLocaleString("en-US", { maximumFractionDigits: 1 })} days`;
  if (["Average", "Score"].includes(metric?.unit)) return number.toLocaleString("en-US", { maximumFractionDigits: 1 });
  return number.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function operationsPeriodLabel(startDate, endDate) {
  const options = { month: "short", day: "numeric", year: "numeric" };
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Reporting period";
  if (startDate === endDate) return start.toLocaleDateString("en-US", options);
  return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
}

function operationsDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function operationsCurrentQuarterPeriod(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  const quarterStartMonth = Math.floor(safeDate.getMonth() / 3) * 3;
  return {
    startDate: operationsDateKey(new Date(safeDate.getFullYear(), quarterStartMonth, 1)),
    endDate: operationsDateKey(new Date(safeDate.getFullYear(), quarterStartMonth + 3, 0))
  };
}

function operationsDateParts(value) {
  const match = cleanText(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return { year, month, day, timestamp };
}

function operationsIsCalendarQuarter(startDate, endDate) {
  const start = operationsDateParts(startDate);
  const end = operationsDateParts(endDate);
  if (!start || !end || start.year !== end.year || start.day !== 1 || (start.month - 1) % 3 !== 0) return false;
  const expectedEnd = new Date(Date.UTC(start.year, start.month + 2, 0));
  return end.month === expectedEnd.getUTCMonth() + 1 && end.day === expectedEnd.getUTCDate();
}

function operationsTargetProgress(metric = {}, startDate, endDate, value = metric.currentValue) {
  if (["Needs Definition", "Not Configured"].includes(metric.calculationMode)) return null;
  if (metric.performanceDirection === "No target status") return null;
  if (value === null || value === undefined || value === "") return null;
  const currentValue = Number(value);
  const annualTargetValue = Number(metric.annualTargetValue);
  const annualTargetYear = Number(metric.annualTargetYear);
  const start = operationsDateParts(startDate);
  const end = operationsDateParts(endDate);
  if (!Number.isFinite(currentValue) || !Number.isFinite(annualTargetValue) || annualTargetValue <= 0 || !start || !end) return null;
  if (start.year !== annualTargetYear || end.year !== annualTargetYear || start.timestamp > end.timestamp) return null;

  const fixedThreshold = ["Percentage", "Days", "Average", "Score"].includes(metric.unit);
  const isQuarter = operationsIsCalendarQuarter(startDate, endDate);
  let targetValue = annualTargetValue;
  if (!fixedThreshold) {
    const daysInPeriod = Math.floor((end.timestamp - start.timestamp) / 86400000) + 1;
    const daysInYear = (Date.UTC(start.year + 1, 0, 1) - Date.UTC(start.year, 0, 1)) / 86400000;
    const periodShare = isQuarter ? 0.25 : daysInPeriod / daysInYear;
    targetValue = annualTargetValue * periodShare;
    targetValue = metric.unit === "Count" ? Math.ceil(targetValue) : Math.round(targetValue * 100) / 100;
  }
  if (!Number.isFinite(targetValue) || targetValue <= 0) return null;

  const rawPercent = metric.performanceDirection === "Lower is better"
    ? currentValue <= targetValue ? 100 : (targetValue / currentValue) * 100
    : (currentValue / targetValue) * 100;
  const percent = Math.max(0, Math.min(999, Math.round(rawPercent)));
  return {
    targetValue,
    percent,
    visualPercent: Math.min(100, percent),
    label: isQuarter ? "Quarter Target" : "Period Target"
  };
}

function operationsSummary(metrics = [], dataQuality = []) {
  const coreMetrics = operationsCoreMetrics(metrics);
  const automatic = coreMetrics.filter((metric) => metric.calculationMode === "Automatic" && metric.currentValue !== null).length;
  const needsDefinition = coreMetrics.filter((metric) => ["Needs Definition", "Not Configured"].includes(metric.calculationMode)).length;
  const missingManual = coreMetrics.filter((metric) => metric.calculationMode === "Manual" && metric.currentValue === null).length;
  const qualityIssues = dataQuality.reduce((sum, item) => sum + Number(item.issueCount || 0), 0);
  return [
    [String(automatic), "Live Measures"],
    [String(needsDefinition), "Needs Definition"],
    [String(missingManual), "Manual Values Due"],
    [String(qualityIssues), "Data Issues"]
  ];
}

function operationsCoreMetrics(metrics = []) {
  return metrics.filter((metric) => metric.trackingTier !== "Future");
}

function operationsProgramAreaLabel(area = "") {
  return operationsProgramAreaLabels[area] || area;
}

function operationsMetricsForArea(metrics = [], area = "Organization") {
  const areaMetrics = metrics.filter((metric) => metric.programArea === area);
  if (area !== "Financial") return areaMetrics;
  const priority = new Map(operationsFinancialMetricOrder.map((metricKey, index) => [metricKey, index]));
  return areaMetrics
    .map((metric, index) => ({ metric, index }))
    .sort((first, second) => (
      (priority.get(first.metric.metricKey) ?? operationsFinancialMetricOrder.length + first.index)
      - (priority.get(second.metric.metricKey) ?? operationsFinancialMetricOrder.length + second.index)
    ))
    .map(({ metric }) => metric);
}

function operationsMetricMatches(metric, query = "") {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [
    metric.name,
    metric.programArea,
    metric.category,
    metric.definition,
    metric.logicModelOutcome,
    metric.calculationNotes,
    metric.dataSource,
    metric.collectionMethod,
    metric.calculationMode,
    metric.responsibleStaffMember
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function operationsDashboardData(metrics = [], dataQuality = []) {
  const coreMetrics = operationsCoreMetrics(metrics);
  const dashboardMetrics = coreMetrics.filter((metric) => metric.dashboard);
  const byArea = operationsProgramAreas.map((area) => ({
    area,
    metrics: dashboardMetrics.filter((metric) => metric.programArea === area)
  })).filter((group) => group.metrics.length);
  const unresolved = coreMetrics.filter((metric) => ["Needs Definition", "Not Configured"].includes(metric.calculationMode));
  const manualDue = coreMetrics.filter((metric) => metric.calculationMode === "Manual" && metric.currentValue === null);
  return {
    byArea,
    unresolved,
    manualDue,
    qualityNeedsAttention: dataQuality.filter((item) => item.issueCount > 0)
  };
}

function operationsProgramReadiness(metrics = []) {
  const needsDefinition = metrics.filter((metric) => metric?.calculationMode === "Needs Definition").length;
  if (needsDefinition) {
    return {
      label: needsDefinition === 1 ? "Needs Definition" : `${needsDefinition} to Define`,
      state: "Needs Definition"
    };
  }
  if (metrics.some((metric) => metric?.calculationMode === "Not Configured")) {
    return { label: "Not Configured", state: "Not Configured" };
  }
  if (metrics.some((metric) => metric?.calculationMode === "Manual" && metric?.currentValue === null)) {
    return { label: "Manual Value", state: "Manual" };
  }
  if (metrics.some((metric) => metric?.targetStatus === "Below Target")) {
    return { label: "Below Target", state: "Below Target" };
  }
  return { label: "Automatic", state: "Automatic" };
}

function operationsExecutiveDashboardData(metrics = [], dataQuality = []) {
  const coreMetrics = operationsCoreMetrics(metrics);
  const metricByKey = new Map(coreMetrics.map((metric) => [metric.metricKey, metric]));
  const snapshotMetrics = operationsExecutiveSnapshotKeys
    .map((metricKey) => metricByKey.get(metricKey))
    .filter(Boolean);
  const programRows = operationsExecutiveProgramConfig.map((config) => {
    const rowMetrics = config.metricKeys.map((metricKey) => metricByKey.get(metricKey)).filter(Boolean);
    return {
      ...config,
      metrics: rowMetrics,
      readiness: operationsProgramReadiness(rowMetrics)
    };
  });
  const financialTotal = metricByKey.get("financial.total-revenue") || null;
  const financialMix = operationsFinancialMixConfig.map((config) => {
    const metric = metricByKey.get(config.metricKey) || null;
    const value = Number(metric?.ytdValue ?? metric?.currentValue ?? 0);
    return { ...config, metric, value: Number.isFinite(value) ? value : 0 };
  });
  const totalRevenueValue = Number(financialTotal?.ytdValue ?? financialTotal?.currentValue ?? 0);
  const namedRevenueValue = financialMix.reduce((sum, item) => sum + item.value, 0);
  financialMix.push({
    metricKey: "financial.total-revenue",
    label: "Other",
    metric: financialTotal,
    value: Math.max(0, (Number.isFinite(totalRevenueValue) ? totalRevenueValue : 0) - namedRevenueValue)
  });
  const financialMixTotal = financialMix.reduce((sum, item) => sum + item.value, 0);
  financialMix.forEach((item) => {
    item.percent = financialMixTotal ? Math.round((item.value / financialMixTotal) * 1000) / 10 : 0;
  });
  const dashboardMetrics = coreMetrics.filter((metric) => metric.dashboard);
  const dashboardReadyCount = dashboardMetrics.filter((metric) => metric.currentValue !== null && metric.currentValue !== undefined).length;
  const definitionReadyCount = coreMetrics.filter((metric) => !["Needs Definition", "Not Configured"].includes(metric.calculationMode)).length;
  const qualityByArea = new Map(dataQuality.map((item) => [item.area, item]));
  const totalQualityIssues = dataQuality.reduce((sum, item) => sum + Number(item.issueCount || 0), 0);
  const unresolved = coreMetrics.filter((metric) => ["Needs Definition", "Not Configured"].includes(metric.calculationMode));
  const manualDue = coreMetrics.filter((metric) => metric.calculationMode === "Manual" && metric.currentValue === null);
  return {
    snapshotMetrics,
    programRows,
    financial: {
      total: financialTotal,
      mix: financialMix,
      mixTotal: financialMixTotal,
      grantValueMissing: metricByKey.get("financial.grant-revenue")?.ytdValue === null
        || metricByKey.get("financial.grant-revenue")?.ytdValue === undefined
    },
    dashboardMetricCount: dashboardMetrics.length,
    dashboardReadyCount,
    dashboardReadinessPercent: dashboardMetrics.length ? Math.round((dashboardReadyCount / dashboardMetrics.length) * 100) : 0,
    definitionReadyCount,
    definitionCount: coreMetrics.length,
    definitionReadinessPercent: coreMetrics.length ? Math.round((definitionReadyCount / coreMetrics.length) * 100) : 0,
    unresolved,
    manualDue,
    totalQualityIssues,
    referralFollowUp: qualityByArea.get("Referral Follow-Up") || null
  };
}

function operationsMetricDefinitionPayload(form) {
  const data = form instanceof FormData ? form : new FormData(form);
  return {
    name: cleanText(data.get("name")),
    programArea: cleanText(data.get("programArea")),
    category: cleanText(data.get("category")),
    definition: cleanText(data.get("definition")),
    logicModelOutcome: cleanText(data.get("logicModelOutcome")),
    calculationNotes: cleanText(data.get("calculationNotes")),
    unit: cleanText(data.get("unit")),
    calculationMode: cleanText(data.get("calculationMode")),
    sourceKey: cleanText(data.get("sourceKey")),
    dataSource: cleanText(data.get("dataSource")),
    collectionMethod: cleanText(data.get("collectionMethod")),
    collectionFrequency: cleanText(data.get("collectionFrequency")),
    performanceDirection: cleanText(data.get("performanceDirection")),
    baselineYear: optionalNumber(data.get("baselineYear")),
    baselineValue: optionalNumber(data.get("baselineValue")),
    annualTargetYear: optionalNumber(data.get("annualTargetYear")),
    annualTargetValue: optionalNumber(data.get("annualTargetValue")),
    threeYearTargetYear: optionalNumber(data.get("threeYearTargetYear")),
    threeYearTargetValue: optionalNumber(data.get("threeYearTargetValue")),
    reportingFrequency: cleanText(data.get("reportingFrequency")),
    responsibleStaffMember: cleanText(data.get("responsibleStaffMember")),
    notes: cleanText(data.get("notes")),
    dashboard: data.get("dashboard") === "on",
    active: true
  };
}

function operationsMeasurementPayload(form, metricKey) {
  const data = form instanceof FormData ? form : new FormData(form);
  const measurementDate = cleanText(data.get("measurementDate"));
  return {
    metricKey,
    periodStart: measurementDate || cleanText(data.get("periodStart")),
    periodEnd: measurementDate || cleanText(data.get("periodEnd")),
    value: optionalNumber(data.get("value")),
    note: cleanText(data.get("note"))
  };
}

function operationsMetricTrend(metric) {
  if (metric.currentValue === null || metric.previousValue === null) return { label: "No comparison", direction: "none" };
  const change = Number(metric.currentValue) - Number(metric.previousValue);
  if (!change) return { label: "No change", direction: "flat" };
  const improving = metric.performanceDirection === "Lower is better" ? change < 0 : change > 0;
  const formatted = formatOperationsValue({ ...metric, unit: metric.unit === "Dollars" ? "Dollars" : metric.unit }, Math.abs(change));
  return {
    label: `${change > 0 ? "+" : "-"}${formatted} from prior period`,
    direction: improving ? "good" : "review"
  };
}

function operationsTargetHistory(metric = {}) {
  return Array.isArray(metric.targetHistory)
    ? [...metric.targetHistory].sort((first, second) => cleanText(second.changedAt).localeCompare(cleanText(first.changedAt)))
    : [];
}

export {
  budgetCategoriesForYear,
  budgetCategoryGroups,
  budgetCategoryPayload,
  budgetPlanningSummary,
  budgetSummary,
  formatOperationsValue,
  hrsnBillingSummary,
  hrsnClaimMatches,
  hrsnClaimPayload,
  hrsnClaimStatus,
  hrsnCoveredPopulationOptions,
  hrsnDescriptionOptions,
  hrsnOutcomeOptions,
  operationsCalculationModes,
  operationsCoreMetrics,
  operationsCurrentQuarterPeriod,
  operationsDashboardData,
  operationsDirections,
  operationsEvaluationFilters,
  operationsEvaluationMappingStatuses,
  operationsEvaluationRecordStatuses,
  operationsEvaluationMetricGaps,
  operationsEvaluationInstrumentPayload,
  operationsEvaluationQuestionPayload,
  operationsEvaluationQuestions,
  operationsEvaluationQuestionsForFilter,
  operationsEvaluationSummary,
  operationsExecutiveDashboardData,
  operationsMetricDefinitionPayload,
  operationsMetricMatches,
  operationsMetricsForArea,
  operationsMetricTrend,
  operationsMeasurementPayload,
  operationsPeriodLabel,
  operationsProgramAreaLabel,
  operationsProgramAreas,
  operationsReportingFrequencies,
  operationsSummary,
  operationsTargetProgress,
  operationsTargetHistory,
  mergeOperationsEvaluationQuestions
};
