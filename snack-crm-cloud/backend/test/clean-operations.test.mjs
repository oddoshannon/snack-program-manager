import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
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
  operationsCoreMetrics,
  operationsCurrentQuarterPeriod,
  operationsDashboardData,
  operationsEvaluationMetricGaps,
  operationsEvaluationInstrumentPayload,
  operationsEvaluationQuestionPayload,
  operationsEvaluationQuestions,
  operationsEvaluationQuestionsForFilter,
  operationsEvaluationSummary,
  operationsEvaluationRecordStatuses,
  operationsExecutiveDashboardData,
  operationsMetricDefinitionPayload,
  operationsMetricMatches,
  operationsMetricsForArea,
  operationsMetricTrend,
  operationsMeasurementPayload,
  operationsPeriodLabel,
  operationsProgramAreaLabel,
  operationsProgramAreas,
  operationsSummary,
  operationsTargetProgress,
  mergeOperationsEvaluationQuestions
} from "../../frontend/public/modules/operations.js";
import {
  cleanBudgetCategoryPayload,
  cleanHrsnClaimPayload,
  cleanPerformanceEvaluationInstrumentPayload,
  cleanPerformanceEvaluationQuestionPayload,
  cleanPerformanceEvaluationResponsePayload,
  cleanPerformanceMeasurementPayload,
  cleanPerformanceMetricPayload
} from "../lib/core.js";
import {
  clinicCaregiverFeedbackInstrument,
  clinicCaregiverFeedbackQuestionDefinitions,
  clinicChildFeedbackInstrument,
  clinicChildFeedbackQuestionDefinitions,
  clinicEnrollmentInstrument,
  clinicEnrollmentQuestionDefinitions,
  clinicEvaluationResponseValidationError,
  clinicFeedbackSummaryForPeriod,
  clinicHealthChangeForPeriod,
  clinicHealthInstrument,
  clinicHealthQuestionDefinitions,
  clinicHealthResponseScore,
  clinicKnowledgeGainForPeriod,
  clinicKnowledgeInstrument,
  clinicKnowledgeQuestionDefinitions,
  clinicKnowledgeResponseScore,
  clinicKnowledgeResponseValidationError,
  clinicHrsnScreenerInstrument,
  clinicHrsnScreenerQuestionDefinitions,
  legacyClinicCaregiverFeedbackInstrument,
  legacyClinicCaregiverFeedbackQuestionDefinitions,
  legacyClinicChildFeedbackInstrument,
  legacyClinicChildFeedbackQuestionDefinitions,
  legacyClinicHrsnScreenerInstrument,
  legacyClinicKnowledgeInstrument,
  legacyClinicKnowledgeQuestionDefinitions,
  mergeClinicEvaluationInstruments,
  mergeClinicEvaluationQuestions
} from "../lib/clinic-evaluation.js";
import {
  applyOperationsRevenueValues,
  defaultOperationsPeriod,
  defaultOperationsMetricDefinitions,
  duplicateEvaluationResponse,
  mergeOperationsMetricDefinitions,
  operationsAutomaticValues,
  operationsDataQuality,
  operationsMetricResults,
  operationsAnnualPacingStatus,
  performanceMeasurementId,
  operationsTargetStatus,
  previousOperationsPeriod,
  validDateRange
} from "../routes/operations.js";
import {
  budgetCategoryValidationError,
  cleanHrsnBulkApprovalIds,
  hrsnApprovalDateForSave,
  hrsnClaimValidationError
} from "../routes/fundraising.js";
import {
  controlledCountingQaData,
  controlledCountingQaExpected,
  controlledCountingQaPeriod
} from "../scripts/lib/controlled-counting-qa-fixtures.mjs";

const operationsHtml = await readFile(new URL("../../frontend/public/operations.html", import.meta.url), "utf8");
const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
const cleanCss = await readFile(new URL("../../frontend/public/clean.css", import.meta.url), "utf8");
const clientFormSource = await readFile(new URL("../../frontend/public/client-form.js", import.meta.url), "utf8");
const clientFormCss = await readFile(new URL("../../frontend/public/client-form.css", import.meta.url), "utf8");
const routeSource = await readFile(new URL("../routes/operations.js", import.meta.url), "utf8");
const fundraisingRouteSource = await readFile(new URL("../routes/fundraising.js", import.meta.url), "utf8");
const serverSource = await readFile(new URL("../server.js", import.meta.url), "utf8");

const sourceData = {
  appointments: [
    { id: "appointment-1", appointmentDate: "2026-07-02", appointmentType: "Enrollment", status: "Completed", clientIds: ["client-1"] },
    { id: "appointment-2", appointmentDate: "2026-07-03", appointmentType: "Nutrition Education", lesson: "1", status: "Completed", clientIds: ["client-2"] },
    { id: "appointment-3", appointmentDate: "2026-07-04", status: "No Show", clientIds: ["client-3"] },
    { id: "appointment-prior", appointmentDate: "2026-06-15", status: "Completed", clientIds: ["client-1"] }
  ],
  referrals: [
    { id: "referral-1", referralDate: "2026-07-01", firstContactDate: "2026-07-03", firstAppointmentDate: "2026-07-10" },
    { id: "referral-2", referralDate: "2026-07-05", firstContactDate: "2026-07-09", firstAppointmentDate: "2026-07-20" }
  ],
  clients: [
    { id: "client-1", graduationDate: "2026-07-20", ycco: true, preferredLanguage: "English" },
    { id: "client-2", graduationDate: "", ycco: false, hrsn: false, preferredLanguage: "English" }
  ],
  programSessions: [
    { id: "school-1", program: "School", status: "Completed", sessionDate: "2026-07-08", schoolName: "Memorial Elementary", participantCount: 25 },
    { id: "kitchen-1", program: "Kitchen", status: "Completed", sessionDate: "2026-07-11" },
    { id: "kitchen-2", program: "Kitchen", status: "Completed", sessionDate: "2026-07-18" }
  ],
  programRegistrations: [
    { id: "registration-1", sessionId: "kitchen-1", status: "Attended", clientIds: ["client-1", "client-2"], attendeeCount: 2 },
    { id: "registration-2", sessionId: "kitchen-2", status: "Attended", clientIds: ["client-1"], attendeeCount: 1 },
    { id: "registration-3", sessionId: "kitchen-2", status: "Absent", clientIds: ["client-3"], attendeeCount: 1 }
  ],
  outreachEvents: [
    { id: "event-1", status: "Completed", eventDate: "2026-07-12", interactionsCount: 90, participantListCount: 130, referralsCount: 5 }
  ],
  earnedIncome: [
    { id: "income-1", name: "HRSN reimbursement", serviceType: "HRSN", paymentDate: "2026-07-15", amountReceived: 125 },
    { id: "income-prior", paymentDate: "2026-06-15", amountReceived: 75 }
  ],
  hrsnClaims: [
    { id: "claim-1", approved: true, approvalDate: "2026-07-15", amount: 125 },
    { id: "claim-submitted", submitted: true, approved: false, approvalDate: "", amount: 200 }
  ],
  fundraisingGifts: [
    { id: "gift-prior", donorId: "donor-1", giftDate: "2026-06-20", amount: 50, giftType: "Individual Gift" },
    { id: "gift-1", donorId: "donor-1", giftDate: "2026-07-05", amount: 100, giftType: "Individual Gift", recurring: true, recurringFrequency: "Monthly" },
    { id: "gift-2", donorId: "donor-2", giftDate: "2026-07-10", amount: 50, giftType: "Individual Gift" },
    { id: "gift-3", donorId: "donor-3", giftDate: "2026-07-15", amount: 1000, giftType: "Sponsorship" },
    { id: "gift-4", donorId: "donor-4", giftDate: "2026-07-20", amount: 250, giftType: "Fundraising Event" }
  ]
};

test("clean Operations exposes the approved performance work areas", () => {
  assert.match(operationsHtml, /SNACK_MODULE_ID = "operations"/);
  assert.ok(operationsHtml.indexOf("app-config.js") < operationsHtml.indexOf("clean.js"));
  assert.match(cleanSource, /subpages: \["Dashboard", "Performance", "Evaluation", "Reports"\]/);
  assert.match(cleanSource, /\["Measures", "Data Quality"\]/);
  assert.match(cleanSource, /function renderOperationsDashboard\(\)/);
  assert.match(cleanSource, /function renderOperationsPerformance\(\)/);
  assert.match(cleanSource, /function renderOperationsEvaluation\(\)/);
  assert.match(cleanSource, /function renderOperationsDataQuality\(\)/);
  assert.match(cleanSource, /function renderOperationsReports\(\)/);
  assert.match(cleanSource, /function renderOperationsHrsnBilling\(\)/);
  assert.match(cleanSource, /function renderOperationsBudget\(\)/);
  assert.match(cleanSource, /data-operations-definition-form/);
  assert.match(cleanSource, /data-operations-measurement-form/);
  assert.match(cleanCss, /\.operations-dashboard-grid/);
  assert.match(cleanCss, /\.operations-executive-grid/);
  assert.match(cleanCss, /\.operations-program-pulse/);
  assert.match(cleanSource, /operationsExecutiveDashboardData\(operationsMetrics, operationsDataQualityItems\)/);
  assert.match(cleanCss, /\.operations-performance-workspace/);
  assert.match(cleanCss, /\.operations-evaluation-surface/);
  assert.match(cleanCss, /\.operations-quality-surface/);
  assert.match(cleanCss, /\.operations-record-layout/);
  assert.match(cleanCss, /\.operations-budget-table/);
});

test("Operations metric handoffs update the full Performance page state", () => {
  assert.match(
    cleanSource,
    /function setOperationsProgramArea\(area, metricKey = ""\)[\s\S]*?operationsSubpage = "Performance";[\s\S]*?renderModulePage\("operations"\);[\s\S]*?refreshOperationsAccountControl\(\);/
  );
});

test("clean staff pick lists share an inset dropdown indicator", () => {
  assert.match(cleanCss, /select:not\(\[multiple\]\)\s*\{[\s\S]*?padding-right: 38px;[\s\S]*?background-position: right 14px center;/);
  assert.match(cleanCss, /\.crm-status-control select\s*\{[\s\S]*?background-image: none;/);
});

test("Operations backend is protected and reads complete collections", () => {
  assert.match(serverSource, /operationsRoutes/);
  assert.match(routeSource, /router\.get\("\/api\/operations", requireAuth/);
  assert.match(routeSource, /router\.patch\("\/api\/operations\/metrics\/:metricKey", requireAuth/);
  assert.match(routeSource, /router\.put\("\/api\/operations\/evaluation-questions\/:questionId", requireAuth/);
  assert.match(routeSource, /router\.post\("\/api\/operations\/measurements", requireAuth/);
  assert.match(routeSource, /router\.put\("\/api\/operations\/measurements\/:measurementId", requireAuth/);
  assert.match(routeSource, /router\.delete\("\/api\/operations\/measurements\/:measurementId", requireAuth/);
  assert.match(routeSource, /fetchAllDocuments\(appointments\)/);
  assert.match(routeSource, /fetchAllDocuments\(fundraisingGifts\)/);
  assert.match(routeSource, /fetchAllDocuments\(hrsnClaims\)/);
  assert.match(routeSource, /fetchAllDocuments\(performanceMetrics\)/);
  assert.match(routeSource, /fetchAllDocuments\(performanceEvaluationQuestions\)/);
  assert.doesNotMatch(routeSource, /\.limit\(/);
});

test("Finances owns the protected HRSN Billing and Budget record actions", () => {
  assert.match(fundraisingRouteSource, /router\.get\("\/api\/hrsn-claims", requireAuth/);
  assert.match(fundraisingRouteSource, /router\.post\("\/api\/hrsn-claims", requireAuth/);
  assert.match(fundraisingRouteSource, /router\.put\("\/api\/hrsn-claims\/:claimId", requireAuth/);
  assert.match(fundraisingRouteSource, /router\.patch\("\/api\/hrsn-claims\/bulk-approval", requireAuth/);
  assert.match(fundraisingRouteSource, /router\.delete\("\/api\/hrsn-claims\/:claimId", requireAuth/);
  assert.match(fundraisingRouteSource, /router\.get\("\/api\/budget-categories", requireAuth/);
  assert.match(fundraisingRouteSource, /router\.post\("\/api\/budget-categories", requireAuth/);
  assert.match(fundraisingRouteSource, /router\.put\("\/api\/budget-categories\/:categoryId", requireAuth/);
  assert.match(fundraisingRouteSource, /router\.delete\("\/api\/budget-categories\/:categoryId", requireAuth/);
  assert.match(fundraisingRouteSource, /fetchAllDocuments\(hrsnClaims\)/);
  assert.match(fundraisingRouteSource, /fetchAllDocuments\(budgetCategories\)/);
  assert.doesNotMatch(fundraisingRouteSource, /\.limit\(/);
});

test("HRSN bulk approval accepts a deduplicated bounded selection", () => {
  assert.deepEqual(cleanHrsnBulkApprovalIds({ claimIds: [" claim-1 ", "claim-2", "claim-1", ""] }), ["claim-1", "claim-2"]);
  assert.equal(cleanHrsnBulkApprovalIds({ claimIds: Array.from({ length: 205 }, (_, index) => `claim-${index}`) }).length, 200);
  assert.deepEqual(cleanHrsnBulkApprovalIds({ claimIds: "claim-1" }), []);
  assert.match(fundraisingRouteSource, /submitted: true,[\s\S]*?approved: true/);
  assert.match(cleanSource, /data-operations-hrsn-select-all/);
  assert.match(cleanSource, /data-operations-hrsn-bulk-select/);
  assert.match(cleanSource, /data-operations-hrsn-bulk-approve/);
});

test("HRSN Billing preserves the approved spreadsheet fields and status rules", () => {
  const form = new FormData();
  form.set("submitted", "on");
  form.set("approved", "on");
  form.set("approvalDate", "2026-07-29");
  form.set("clientId", "client-1");
  form.set("name", "QA Child");
  form.set("dateOfBirth", "2015-05-14");
  form.set("medicaidId", "QA-MED-1000");
  form.set("address", "100 QA Street, McMinnville, OR 97128");
  form.set("serviceDate", "2026-07-28");
  form.set("durationMinutes", "45");
  form.set("amount", "112.50");
  form.append("coveredPopulations", hrsnCoveredPopulationOptions[0]);
  form.append("coveredPopulations", hrsnCoveredPopulationOptions[2]);
  form.set("foodSecurityScore", "4");
  form.append("descriptions", hrsnDescriptionOptions[0]);
  form.append("descriptions", hrsnDescriptionOptions[1]);
  form.append("outcomes", hrsnOutcomeOptions[0]);
  form.append("outcomes", hrsnOutcomeOptions[2]);
  form.set("invoiceNumber", "QA-INVOICE-1000");

  const frontendPayload = hrsnClaimPayload(form);
  const payload = cleanHrsnClaimPayload(frontendPayload);
  assert.equal(hrsnClaimValidationError(payload), "");
  assert.equal(payload.durationMinutes, 45);
  assert.equal(payload.amount, 112.5);
  assert.equal(payload.approvalDate, "2026-07-29");
  assert.deepEqual(payload.coveredPopulations, [hrsnCoveredPopulationOptions[0], hrsnCoveredPopulationOptions[2]]);
  assert.deepEqual(payload.descriptions, [hrsnDescriptionOptions[0], hrsnDescriptionOptions[1]]);
  assert.deepEqual(payload.outcomes, [hrsnOutcomeOptions[0], hrsnOutcomeOptions[2]]);
  assert.equal(hrsnClaimStatus(payload), "Approved");
  assert.equal(hrsnClaimMatches(payload, "invoice-1000"), true);
  assert.deepEqual(hrsnBillingSummary([payload, { submitted: true }, {}]), {
    totalCount: 3,
    draftCount: 1,
    submittedCount: 1,
    approvedCount: 1
  });

  assert.match(hrsnClaimValidationError({ ...payload, durationMinutes: 20 }), /15-minute increments/);
  assert.match(hrsnClaimValidationError({ ...payload, submitted: false, approved: true }), /must also be marked Submitted/);
  assert.match(hrsnClaimValidationError({ ...payload, outcomes: ["None", hrsnOutcomeOptions[0]] }), /cannot be combined/);
  assert.equal(hrsnClaimValidationError({ ...payload, amount: 0 }), "");
  assert.equal(hrsnApprovalDateForSave({ approved: true }, {}, new Date("2026-07-29T18:00:00Z")), "2026-07-29");
  assert.equal(hrsnApprovalDateForSave({ approved: true }, { approvalDate: "2026-07-15" }), "2026-07-15");
  assert.equal(hrsnApprovalDateForSave({ approved: false, approvalDate: "2026-07-15" }), "");
  assert.match(cleanSource, /operations-record-checks is-readonly/);
  assert.match(cleanSource, /renderHrsnMultiPicker\(\{ label: "Description", name: "descriptions"/);
  assert.match(cleanSource, /renderHrsnMultiPicker\(\{ label: "Outcome", name: "outcomes"/);
});

test("Budget categories remain editable records grouped by year", () => {
  const form = new FormData();
  form.set("budgetYear", "2026");
  form.set("groupName", "Kitchen");
  form.set("name", "Groceries");
  form.set("annualBudget", "4800.25");
  form.set("active", "on");
  form.set("sortOrder", "20");
  const payload = cleanBudgetCategoryPayload(budgetCategoryPayload(form));
  assert.equal(budgetCategoryValidationError(payload), "");
  assert.equal(payload.annualBudget, 4800.25);
  assert.equal(payload.active, true);

  const categories = [
    { id: "b", budgetYear: 2026, groupName: "Kitchen", name: "Supplies", annualBudget: 1000, active: false, sortOrder: 30 },
    { id: "a", ...payload },
    { id: "c", budgetYear: 2025, groupName: "Kitchen", name: "Prior", annualBudget: 500, active: true, sortOrder: 10 }
  ];
  assert.deepEqual(budgetCategoryGroups(categories, 2026).map((group) => group.name), ["Kitchen"]);
  assert.deepEqual(budgetSummary(categories, 2026), {
    annualBudget: 4800.25,
    groupCount: 1,
    activeCategoryCount: 1,
    totalCategoryCount: 2
  });
  assert.deepEqual(budgetPlanningSummary([
    { budgetYear: 2026, groupName: "Clinic", annualBudget: 1000, actualSpending: 250, active: true, sortOrder: 1 }
  ], 2026, {
    cashBalance: 30000,
    expectedInflows: 5000,
    expectedOutflows: 8000,
    trailingAverageMonthlyExpenses: 10000,
    programParticipants: { Clinic: 50 }
  }), {
    annualBudget: 1000,
    actualSpending: 250,
    remainingBudget: 750,
    budgetUsedPercent: 25,
    cashBalance: 30000,
    expectedInflows: 5000,
    expectedOutflows: 8000,
    projectedCashBalance: 27000,
    trailingAverageMonthlyExpenses: 10000,
    monthsCashOnHand: 3,
    costPerParticipant: { Clinic: 5, Kitchen: null, School: null, Community: null }
  });
  assert.match(budgetCategoryValidationError({ ...payload, groupName: "" }), /Category Group/);
});

test("Operations forms capture values before disabling controls", () => {
  const hrsnSave = cleanSource.slice(
    cleanSource.indexOf("async function saveOperationsHrsnClaim"),
    cleanSource.indexOf("async function deleteOperationsHrsnClaim")
  );
  const budgetSave = cleanSource.slice(
    cleanSource.indexOf("async function saveOperationsBudgetCategory"),
    cleanSource.indexOf("async function deleteOperationsBudgetCategory")
  );

  assert.ok(hrsnSave.indexOf("const payload = hrsnClaimPayload(form)") < hrsnSave.indexOf("control.disabled = true"));
  assert.ok(budgetSave.indexOf("const payload = budgetCategoryPayload(form)") < budgetSave.indexOf("control.disabled = true"));
  assert.match(cleanSource, /Dollar Amount<\/dt><dd>\$\{escapeHtml\(formatGrantMoney\(claim\.amount, "\$0"\)\)\}/);
  assert.match(cleanSource, /Annual Plan<\/dt><dd>\$\{escapeHtml\(formatGrantMoney\(category\.annualBudget, "\$0"\)\)\}/);
});

test("automatic Operations measures use only their documented source records", () => {
  const values = operationsAutomaticValues(sourceData, "2026-07-01", "2026-07-31");

  assert.equal(values.organizationEstimatedChildrenServed, 27);
  assert.equal(values.organizationProgramEngagements, 30);
  assert.equal(values.organizationPriorityPopulationParticipation, 50);
  assert.equal(values.clinicChildrenEnrolled, 1);
  assert.equal(values.clinicAppointmentsDelivered, 2);
  assert.equal(values.clinicReferralsReceived, 2);
  assert.equal(values.clinicReferralContactDays, 3);
  assert.equal(values.clinicReferralAppointmentDays, 12);
  assert.equal(values.clinicNoShowRate, 33.3);
  assert.equal(values.clinicGraduates, 1);
  assert.equal(values.clinicGraduationRate, 100);
  assert.equal(values.schoolSchoolsReached, 1);
  assert.equal(values.schoolClassesDelivered, 1);
  assert.equal(values.schoolStudentsReached, 25);
  assert.equal(values.cookingClassesDelivered, 2);
  assert.equal(values.cookingParticipantsServed, 2);
  assert.equal(values.cookingTotalAttendance, 3);
  assert.equal(values.cookingAttendanceRate, 75);
  assert.equal(values.cookingAverageAttendance, 1.5);
  assert.equal(values.cookingRepeatParticipation, 50);
  assert.equal(values.communityEventsCompleted, 1);
  assert.equal(values.communityFamiliesReached, 90);
  assert.equal(values.communityEventParticipants, 130);
  assert.equal(values.communityReferralsGenerated, 5);
  assert.equal(values.financialSponsorshipRevenue, 1000);
  assert.equal(values.financialEventRevenue, 250);
  assert.equal(values.financialGiftRevenue, 1400);
  assert.equal(values.financialIndividualGiving, 150);
  assert.equal(values.financialNewDonors, 3);
  assert.equal(values.financialRepeatDonors, 1);
  assert.equal(values.financialMonthlyDonors, 1);
  assert.equal(values.financialAverageGiftSize, 75);
  assert.equal(values.financialHrsnRevenue, 125);
  assert.equal(values.financialOtherEarnedIncome, 0);
  assert.equal(values.financialEarnedIncomeReceived, 125);
});

test("sibling Clinic visits count one appointment, two engagements, and one goal result per child", () => {
  const values = operationsAutomaticValues({
    appointments: [{
      id: "sibling-visit",
      appointmentDate: "2026-07-10",
      appointmentType: "Nutrition Education",
      status: "Completed",
      clientIds: ["child-1", "child-2"],
      clientNames: ["QA Child One", "QA Child Two"],
      participantGoals: [
        { clientId: "child-1", goal: "Try fruit", goalResult: "Achieved" },
        { clientId: "child-2", goal: "Drink water", goalResult: "Not Achieved" }
      ]
    }],
    clients: [],
    referrals: [],
    programSessions: [],
    programRegistrations: [],
    outreachEvents: [],
    earnedIncome: [],
    fundraisingGifts: [],
    hrsnClaims: []
  }, "2026-07-01", "2026-07-31");

  assert.equal(values.clinicAppointmentsDelivered, 1);
  assert.equal(values.organizationProgramEngagements, 2);
  assert.equal(values.organizationEstimatedChildrenServed, 2);
  assert.equal(values.clinicGoalAchievement, 50);
  assert.equal(values.clinicGoalPartlyAchieved, 0);
});

test("controlled counting QA fixtures reconcile every approved baseline total", () => {
  const data = controlledCountingQaData();
  const automaticValues = operationsAutomaticValues(
    data,
    controlledCountingQaPeriod.startDate,
    controlledCountingQaPeriod.endDate
  );
  const reconciledValues = applyOperationsRevenueValues(
    automaticValues,
    data.performanceMeasurements,
    defaultOperationsMetricDefinitions,
    controlledCountingQaPeriod.startDate,
    controlledCountingQaPeriod.endDate
  );

  Object.entries(controlledCountingQaExpected.operations).forEach(([key, expectedValue]) => {
    assert.equal(reconciledValues[key], expectedValue, key);
  });
});

test("Operations activates approved definitions while preserving unresolved instrument gaps", () => {
  const childrenServed = defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "organization.children-served");
  const retention = defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "clinic.retention-rate");
  const goalAchievement = defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "clinic.goal-achievement");
  const knowledgeGain = defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "clinic.knowledge-gain");
  const behaviorChange = defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "clinic.behavior-change");
  const knowledge = defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "clinic.knowledge-retention");
  const activePartners = defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "organization.active-partners");

  assert.equal(childrenServed.calculationMode, "Automatic");
  assert.equal(childrenServed.name, "Total Children Served");
  assert.match(childrenServed.notes, /School participants are counted from the aggregate Participant Count/i);
  assert.equal(retention.calculationMode, "Automatic");
  assert.equal(goalAchievement.calculationMode, "Automatic");
  assert.equal(goalAchievement.sourceKey, "clinicGoalAchievement");
  assert.match(goalAchievement.calculationNotes, /Not Assessed is excluded/i);
  assert.match(goalAchievement.definition, /Siblings receive separate results/i);
  const hrsnRevenue = defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "financial.hrsn-revenue");
  assert.equal(hrsnRevenue.dataSource, "HRSN Billing");
  assert.match(hrsnRevenue.collectionMethod, /Approval Date/);
  assert.equal(knowledgeGain.calculationMode, "Automatic");
  assert.equal(knowledgeGain.sourceKey, "clinicKnowledgeGain");
  assert.equal(knowledgeGain.dataSource, "Clinic Knowledge Assessment");
  assert.match(knowledgeGain.definition, /retrospective Before SNACK and Now/i);
  assert.match(knowledgeGain.definition, /self-reported/i);
  assert.match(knowledgeGain.calculationNotes, /Yes is scored as 1 and No as 0/i);
  assert.equal(knowledgeGain.unit, "Percentage");
  assert.equal(behaviorChange.calculationMode, "Automatic");
  assert.equal(behaviorChange.sourceKey, "clinicBehaviorChange");
  assert.match(behaviorChange.calculationNotes, /declines remain visible/i);
  assert.equal(activePartners.calculationMode, "Not Configured");
  assert.equal(knowledge.calculationMode, "Not Configured");
});

test("approved Clinic enrollment, retention, and calendar-year graduation rules use linked appointments", () => {
  const values = operationsAutomaticValues({
    appointments: [
      { id: "enroll-1", appointmentDate: "2026-01-10", appointmentType: "Enrollment", status: "Completed", clientIds: ["client-1"] },
      { id: "lesson-1", appointmentDate: "2026-03-20", appointmentType: "Nutrition Education", lesson: "1", status: "Completed", goalResult: "Achieved", clientIds: ["client-1"] },
      { id: "final-1", appointmentDate: "2026-07-20", appointmentType: "Nutrition Education", lesson: "7", status: "Completed", goalResult: "Partly Achieved", clientIds: ["client-1"] },
      { id: "enroll-2", appointmentDate: "2026-07-25", appointmentType: "Enrollment", status: "Completed", clientIds: ["client-2"] }
    ],
    clients: [],
    referrals: [],
    programSessions: [],
    programRegistrations: [],
    outreachEvents: [],
    earnedIncome: [],
    fundraisingGifts: []
  }, "2026-01-01", "2026-09-30");

  assert.equal(values.clinicChildrenEnrolled, 2);
  assert.equal(values.clinicRetentionRate, 50);
  assert.equal(values.clinicGraduates, 1);
  assert.equal(values.clinicGraduationRate, 50);
  assert.equal(values.clinicGoalAchievement, 50);
  assert.equal(values.clinicGoalPartlyAchieved, 50);
});

test("Operations includes the approved core measures without inventing missing targets", () => {
  const requiredKeys = [
    "organization.priority-population-participation",
    "organization.programs-meeting-outcome-targets",
    "clinic.knowledge-gain",
    "clinic.guideline-improvement",
    "clinic.quality-of-life",
    "clinic.participant-satisfaction",
    "school.students-completing",
    "school.knowledge-retention",
    "school.teacher-confidence",
    "school.survey-completion-rate",
    "cooking.total-attendance",
    "cooking.guideline-improvement",
    "community.active-referral-partners",
    "community.partner-retention-rate",
    "financial.grant-concentration",
    "financial.budget-variance",
    "financial.operating-reserves-months",
    "financial.sponsorship-revenue",
    "financial.event-revenue",
    "financial.new-donors",
    "financial.repeat-donors",
    "financial.monthly-donors",
    "financial.average-gift-size"
  ];
  const definitionsByKey = new Map(defaultOperationsMetricDefinitions.map((metric) => [metric.metricKey, metric]));

  requiredKeys.forEach((key) => assert.ok(definitionsByKey.has(key), `${key} should be defined`));
  assert.equal(definitionsByKey.get("clinic.quality-of-life").calculationMode, "Not Configured");
  assert.equal(definitionsByKey.get("clinic.quality-of-life").annualTargetValue, null);
  assert.equal(definitionsByKey.get("school.knowledge-retention").annualTargetValue, null);
  assert.equal(definitionsByKey.get("cooking.participants-served").threeYearTargetValue, null);
  assert.equal(definitionsByKey.get("clinic.retention-rate").category, "Operational KPI");
  assert.equal(definitionsByKey.get("cooking.repeat-participation").category, "Operational KPI");
  assert.equal(definitionsByKey.get("financial.new-donors").calculationMode, "Automatic");
  assert.equal(definitionsByKey.get("financial.new-donors").sourceKey, "financialNewDonors");
  [
    "financial.sponsorship-revenue",
    "financial.event-revenue",
    "financial.repeat-donors",
    "financial.monthly-donors",
    "financial.average-gift-size"
  ].forEach((key) => assert.equal(definitionsByKey.get(key).calculationMode, "Automatic"));
  assert.equal(definitionsByKey.get("school.students-completing").trackingTier, "Future");
  assert.equal(definitionsByKey.get("school.lessons-as-planned").trackingTier, "Future");
  assert.equal(definitionsByKey.get("clinic.knowledge-gain").trackingTier, "Core");
  assert.equal(definitionsByKey.get("financial.total-revenue").trackingTier, "Core");
  assert.deepEqual(operationsProgramAreas, ["Organization", "Financial", "Clinic", "Cooking", "School", "Community"]);
  assert.equal(operationsProgramAreaLabel("Cooking"), "Kitchen");
  assert.equal(operationsProgramAreaLabel("Clinic"), "Clinic");
});

test("current questionnaire items have traceable KPI mappings and visible unresolved instrument gaps", () => {
  const summary = operationsEvaluationSummary();
  const foodQuestions = operationsEvaluationQuestionsForFilter(
    operationsEvaluationQuestions,
    "Questionnaire",
    "vegetables"
  );

  assert.equal(summary.instrumentCount, 2);
  assert.equal(summary.questionCount, 47);
  assert.equal(summary.mappedCount, 47);
  assert.equal(summary.gapCount, operationsEvaluationMetricGaps.length);
  assert.equal(foodQuestions.length, 2);
  assert.ok(foodQuestions.every((question) => question.metricKeys.includes("clinic.guideline-improvement")));
  assert.ok(operationsEvaluationQuestions.every((question) => question.logicModelOutcome && question.administrationPoint));
  assert.ok(operationsEvaluationQuestions
    .filter((question) => question.instrument === "Clinic Knowledge Assessment")
    .every((question) => question.responseType.includes("Retrospective Before SNACK / Now") && question.mappingStatus === "Mapped"));
  assert.ok(operationsEvaluationMetricGaps.some((gap) => gap.metricKey === "clinic.quality-of-life"));
  assert.equal(operationsEvaluationMetricGaps.some((gap) => gap.metricKey === "clinic.knowledge-gain"), false);
  assert.equal(operationsEvaluationMetricGaps.some((gap) => gap.metricKey === "clinic.behavior-change"), false);
  assert.equal(operationsEvaluationMetricGaps.some((gap) => gap.metricKey === "clinic.goal-achievement"), false);
  assert.ok(operationsEvaluationMetricGaps.some((gap) => gap.metricKey === "community.partner-satisfaction"));
});

test("controlled retrospective knowledge scoring gives each lesson equal weight", () => {
  const answers = clinicKnowledgeQuestionDefinitions.map((question) => {
    const lessonNumber = Number(question.topic.match(/Lesson (\d+)/)?.[1] || 0);
    return {
      questionId: question.id,
      beforeValue: lessonNumber === 1 ? "Yes" : "No",
      nowValue: lessonNumber <= 5 ? "Yes" : "No"
    };
  });
  const result = clinicKnowledgeResponseScore({
    instrumentId: clinicKnowledgeInstrument.id,
    answers
  });

  assert.equal(clinicKnowledgeQuestionDefinitions.length, 34);
  assert.equal(result.beforeScore, 14.3);
  assert.equal(result.nowScore, 71.4);
  assert.equal(result.gain, 57.1);
  assert.equal(result.lessonScores.length, 7);
  assert.equal(result.complete, true);
});

test("Clinic Knowledge Assessment requires every approved item before completion", () => {
  const incomplete = {
    instrumentId: clinicKnowledgeInstrument.id,
    administrationPoint: "Graduation",
    status: "Complete",
    answers: clinicKnowledgeQuestionDefinitions.slice(0, -1).map((question) => ({
      questionId: question.id,
      beforeValue: "No",
      nowValue: "Yes"
    }))
  };

  assert.match(
    clinicKnowledgeResponseValidationError(incomplete, clinicKnowledgeInstrument, clinicKnowledgeQuestionDefinitions),
    /34 questions.*1 remaining/i
  );
  assert.equal(clinicKnowledgeResponseScore(incomplete).score, null);
  assert.equal(clinicKnowledgeResponseValidationError({ ...incomplete, status: "Draft" }), "");
});

test("Clinic Knowledge Gain uses one completed retrospective Graduation result per child", () => {
  const retrospectiveAnswers = clinicKnowledgeQuestionDefinitions.map((question) => {
    const lessonNumber = Number(question.topic.match(/Lesson (\d+)/)?.[1] || 0);
    return {
      questionId: question.id,
      beforeValue: lessonNumber === 1 ? "Yes" : "No",
      nowValue: lessonNumber <= 5 ? "Yes" : "No"
    };
  });
  const responses = [
    { id: "a-graduation", clientId: "child-a", instrumentId: clinicKnowledgeInstrument.id, administrationPoint: "Graduation", responseDate: "2026-07-20", status: "Complete", answers: retrospectiveAnswers },
    { id: "b-draft", clientId: "child-b", instrumentId: clinicKnowledgeInstrument.id, administrationPoint: "Graduation", responseDate: "2026-07-20", status: "Draft", answers: retrospectiveAnswers },
    { id: "c-prior", clientId: "child-c", instrumentId: clinicKnowledgeInstrument.id, administrationPoint: "Graduation", responseDate: "2026-06-20", status: "Complete", answers: retrospectiveAnswers }
  ];
  const result = clinicKnowledgeGainForPeriod(
    responses,
    clinicKnowledgeQuestionDefinitions,
    "2026-07-01",
    "2026-09-30"
  );
  const automaticValues = operationsAutomaticValues({
    appointments: [],
    clients: [],
    referrals: [],
    programSessions: [],
    programRegistrations: [],
    outreachEvents: [],
    earnedIncome: [],
    fundraisingGifts: [],
    hrsnClaims: [],
    evaluationResponses: responses,
    evaluationQuestions: clinicKnowledgeQuestionDefinitions
  }, "2026-07-01", "2026-09-30");

  assert.deepEqual(result, { value: 57.1, matchedChildCount: 1 });
  assert.equal(automaticValues.clinicKnowledgeGain, 57.1);
});

test("legacy knowledge responses retain their original prospective scoring", () => {
  const enrollmentAnswers = legacyClinicKnowledgeQuestionDefinitions.map((question) => ({
    questionId: question.id,
    value: "No"
  }));
  const graduationAnswers = legacyClinicKnowledgeQuestionDefinitions.map((question) => ({
    questionId: question.id,
    value: question.topic.startsWith("Lesson 1:") ? "Yes" : "No"
  }));
  const result = clinicKnowledgeGainForPeriod([
    { id: "legacy-enrollment", clientId: "legacy-child", instrumentId: legacyClinicKnowledgeInstrument.id, administrationPoint: "Enrollment", responseDate: "2026-01-10", status: "Complete", answers: enrollmentAnswers },
    { id: "legacy-graduation", clientId: "legacy-child", instrumentId: legacyClinicKnowledgeInstrument.id, administrationPoint: "Graduation", responseDate: "2026-07-10", status: "Complete", answers: graduationAnswers }
  ], [...legacyClinicKnowledgeQuestionDefinitions, ...clinicKnowledgeQuestionDefinitions], "2026-07-01", "2026-09-30");
  const mergedInstruments = mergeClinicEvaluationInstruments([{ ...legacyClinicKnowledgeInstrument, status: "Active" }]);
  const mergedQuestions = mergeClinicEvaluationQuestions([{ ...legacyClinicKnowledgeQuestionDefinitions[0], recordStatus: "Active" }]);

  assert.deepEqual(result, { value: 14.3, matchedChildCount: 1 });
  assert.equal(mergedInstruments.find((item) => item.id === legacyClinicKnowledgeInstrument.id).status, "Retired");
  assert.equal(mergedQuestions.find((item) => item.id === legacyClinicKnowledgeQuestionDefinitions[0].id).recordStatus, "Retired");
});

function healthAnswers(values = {}) {
  const defaults = {
    "CHQ-01": "3", "CHQ-02": "1", "CHQ-03": "3", "CHQ-04": "1",
    "CHQ-05": "3", "CHQ-06": "About half", "CHQ-07": "3", "CHQ-08": "1",
    "CHQ-09": "3", "CHQ-10": "1", "CHQ-11": "3", "CHQ-12": "3 hours",
    "CHQ-13": "8 hours"
  };
  return clinicHealthQuestionDefinitions.map((question) => ({
    questionId: question.id,
    value: Object.hasOwn(values, question.id) ? values[question.id] : defaults[question.id]
  })).filter((answer) => answer.value !== null);
}

test("Nutrition and Healthy Habits Questionnaire retains all approved questions in order", () => {
  assert.deepEqual(
    clinicHealthQuestionDefinitions.map((question) => question.id),
    [
      "CHQ-01", "CHQ-02", "CHQ-03", "CHQ-04", "CHQ-05", "CHQ-06", "CHQ-07",
      "CHQ-08", "CHQ-09", "CHQ-10", "CHQ-11", "CHQ-12", "CHQ-13"
    ]
  );
  assert.deepEqual(clinicHealthInstrument.languages, ["English", "Spanish"]);
  assert.equal(clinicHealthInstrument.nameEs, "Cuestionario de Nutrición y Hábitos Saludables");
  assert.equal(clinicHealthQuestionDefinitions.every((question) => question.questionEs), true);
  assert.equal(clinicHealthQuestionDefinitions.every((question) => (
    question.responseOptionsEs.length === question.responseOptions.length
  )), true);
});

test("active native clinic forms preserve enrollment and HRSN profile prefills", () => {
  assert.equal(clinicEnrollmentInstrument.formType, "Enrollment");
  assert.equal(clinicHrsnScreenerInstrument.formType, "HRSN Screener");
  assert.equal(clinicEnrollmentInstrument.status, "Active");
  assert.equal(clinicHrsnScreenerInstrument.status, "Active");
  assert.ok(clinicEnrollmentQuestionDefinitions.length >= 25);
  assert.ok(clinicHrsnScreenerQuestionDefinitions.length >= 25);

  const enrollmentYccoId = clinicEnrollmentQuestionDefinitions.find((question) => question.prefillKey === "yccoId");
  const hrsnName = clinicHrsnScreenerQuestionDefinitions.find((question) => question.prefillKey === "clientName");
  const hrsnBirthdate = clinicHrsnScreenerQuestionDefinitions.find((question) => question.prefillKey === "dateOfBirth");
  assert.equal(enrollmentYccoId.profileField, "yccoId");
  assert.equal(hrsnName.question, "Participant name");
  assert.equal(hrsnBirthdate.responseType, "Date");
  assert.equal(clinicHrsnScreenerInstrument.version, "2026.2");
  assert.equal(legacyClinicHrsnScreenerInstrument.status, "Retired");
  assert.equal(clinicHrsnScreenerQuestionDefinitions.some((question) => question.prefillKey === "providerPhone"), false);
  assert.equal(
    clinicHrsnScreenerInstrument.instructions,
    "SNACK does not charge for its nutrition services, but we do have the opportunity to get reimbursed by YCCO for certain clients. This does not affect your ability to participate in the program."
  );
});

test("active feedback forms use the approved 1-4 scale without changing older records", () => {
  assert.deepEqual(clinicChildFeedbackQuestionDefinitions[0].responseOptions, ["1", "2", "3", "4"]);
  assert.deepEqual(clinicCaregiverFeedbackQuestionDefinitions[0].responseOptions, ["1", "2", "3", "4"]);
  assert.equal(clinicChildFeedbackQuestionDefinitions[0].helperText, "");
  assert.equal(clinicCaregiverFeedbackQuestionDefinitions[0].helperText, "");
  assert.match(clinicChildFeedbackInstrument.instructions, /1 = Not at all, 2 = A little, 3 = Mostly, and 4 = Completely/);
  assert.match(clinicCaregiverFeedbackInstrument.instructions, /1 = Not at all, 2 = A little, 3 = Mostly, and 4 = Completely/);
  assert.deepEqual(legacyClinicChildFeedbackQuestionDefinitions[0].responseOptions, ["0", "1", "2", "3", "4", "5"]);
  assert.deepEqual(legacyClinicCaregiverFeedbackQuestionDefinitions[0].responseOptions, ["0", "1", "2", "3", "4", "5"]);
  assert.equal(legacyClinicChildFeedbackInstrument.status, "Retired");
  assert.equal(legacyClinicCaregiverFeedbackInstrument.status, "Retired");
});

test("client, staff, and print form views share the approved compact form rules", () => {
  assert.match(clientFormSource, /kind === "hrsn" \? "" : `<div><span>Program Point/);
  assert.match(clientFormSource, /data-form-kind="\$\{escapeHtml\(kind\)\}"/);
  assert.match(clientFormSource, /For the following, please report whether the statement is often true/);
  assert.match(clientFormSource, /function useSpanishTranslations\(\) \{\s*return mode !== "staff" && isSpanish\(\);\s*\}/);
  assert.match(clientFormSource, /useSpanishTranslations\(\) && question\.responseOptionsEs/);
  assert.match(clientFormSource, /function renderHealthStep[\s\S]*localizedQuestion\(question\)/);
  assert.match(clientFormCss, /\[data-form-kind="child-feedback"\][\s\S]*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
  assert.match(clientFormCss, /\[data-form-kind="hrsn"\][\s\S]*\.client-form-options\.is-agreement/);
  assert.match(clientFormCss, /\.client-form-option \{[\s\S]*overflow-wrap: anywhere;[\s\S]*white-space: normal;/);
  assert.match(clientFormCss, /\.client-form-paper-question\.is-long-answer \{[\s\S]*grid-template-columns: 1fr;/);
  assert.match(clientFormCss, /data-form-kind="enrollment"[\s\S]*break-before: page/);
});

test("child and caregiver feedback use one transparent satisfaction rule", () => {
  const childSatisfaction = clinicChildFeedbackQuestionDefinitions.find((question) => (
    question.metricKeys.includes("clinic.participant-satisfaction")
  ));
  const caregiverSatisfaction = clinicCaregiverFeedbackQuestionDefinitions.find((question) => (
    question.metricKeys.includes("clinic.participant-satisfaction")
  ));
  const responses = [
    {
      instrumentId: clinicChildFeedbackInstrument.id,
      responseDate: "2026-07-20",
      status: "Complete",
      answers: [{ questionId: childSatisfaction.id, value: "4" }]
    },
    {
      instrumentId: clinicCaregiverFeedbackInstrument.id,
      responseDate: "2026-07-21",
      status: "Complete",
      answers: [{ questionId: caregiverSatisfaction.id, value: "2" }]
    }
  ];

  assert.deepEqual(
    clinicFeedbackSummaryForPeriod(responses, [
      ...clinicChildFeedbackQuestionDefinitions,
      ...clinicCaregiverFeedbackQuestionDefinitions
    ], "2026-07-01", "2026-09-30"),
    { participantSatisfactionValue: 50, respondentCount: 2 }
  );
});

test("Questionnaire scoring preserves missing answers and age-based healthy-habit rules", () => {
  const response = {
    instrumentId: clinicHealthInstrument.id,
    administrationPoint: "Enrollment",
    responseDate: "2026-07-01",
    clientBirthdate: "2015-05-14",
    status: "Complete",
    answers: healthAnswers({ "CHQ-03": "I don't know", "CHQ-04": "2" })
  };
  const result = clinicHealthResponseScore(response);

  assert.equal(result.domainScores.fruit, null);
  assert.equal(result.domainScores.sleep, 75);
  assert.equal(result.foodComplete, false);
  assert.equal(result.availableDomainCount, 6);
  assert.equal(result.behaviorComparable, true);
  assert.equal(result.complete, true);
  assert.equal(result.questionCount, 13);
  assert.equal(result.answeredCount, 13);
  assert.equal(clinicEvaluationResponseValidationError(response, clinicHealthInstrument, clinicHealthQuestionDefinitions), "");

  const missingFollowUp = {
    ...response,
    answers: healthAnswers({ "CHQ-03": "I don't know", "CHQ-04": null })
  };
  const missingResult = clinicHealthResponseScore(missingFollowUp);
  assert.equal(missingResult.complete, false);
  assert.deepEqual(missingResult.unansweredQuestionIds, ["CHQ-04"]);
  assert.match(
    clinicEvaluationResponseValidationError(missingFollowUp, clinicHealthInstrument, clinicHealthQuestionDefinitions),
    /Answer all 13 questions.*1 remaining/
  );
});

test("Questionnaire change requires all food domains and five comparable behavior domains", () => {
  const enrollment = {
    id: "health-enrollment",
    clientId: "health-child",
    instrumentId: clinicHealthInstrument.id,
    administrationPoint: "Enrollment",
    responseDate: "2026-01-10",
    clientBirthdate: "2015-05-14",
    status: "Complete",
    answers: healthAnswers({ "CHQ-03": "I don't know", "CHQ-04": "2" })
  };
  const graduation = {
    id: "health-graduation",
    clientId: "health-child",
    instrumentId: clinicHealthInstrument.id,
    administrationPoint: "Graduation",
    responseDate: "2026-07-20",
    clientBirthdate: "2015-05-14",
    status: "Complete",
    answers: healthAnswers({
      "CHQ-01": "I don't know", "CHQ-02": "2", "CHQ-05": "4", "CHQ-06": "More than half",
      "CHQ-07": "2", "CHQ-08": "1", "CHQ-09": "2", "CHQ-10": "1",
      "CHQ-11": "4", "CHQ-12": "2 hours", "CHQ-13": "9 hours"
    })
  };
  const result = clinicHealthChangeForPeriod(
    [enrollment, graduation],
    clinicHealthQuestionDefinitions,
    [{ id: "health-child", dateOfBirth: "2015-05-14" }],
    "2026-07-01",
    "2026-09-30"
  );

  assert.deepEqual(result, {
    behaviorChangeValue: 100,
    behaviorEligibleCount: 1,
    behaviorImprovedCount: 1,
    guidelineImprovementValue: null,
    guidelineMatchedChildCount: 0
  });
});

test("evaluation responses reject a duplicate assessment point for the same child and version", () => {
  const responses = [
    { id: "existing-graduation", clientId: "child-1", instrumentId: clinicKnowledgeInstrument.id, administrationPoint: "Graduation" }
  ];
  const payload = {
    clientId: "child-1",
    instrumentId: clinicKnowledgeInstrument.id,
    administrationPoint: "Graduation"
  };

  assert.equal(duplicateEvaluationResponse(responses, payload)?.id, "existing-graduation");
  assert.equal(duplicateEvaluationResponse(responses, payload, "existing-graduation"), null);
  assert.equal(duplicateEvaluationResponse(responses, { ...payload, clientId: "child-2" }), null);
});

test("questionnaire edits merge with defaults and preserve newly added items", () => {
  const merged = mergeOperationsEvaluationQuestions(operationsEvaluationQuestions, [
    {
      id: "CHQ-01",
      instrument: "Nutrition & Healthy Habits Questionnaire",
      question: "How many days this week did you eat vegetables?",
      metricKeys: ["clinic.behavior-change"],
      mappingStatus: "Mapped"
    },
    {
      id: "CC-01",
      instrument: "Cooking Class Survey",
      question: "I feel confident preparing this recipe.",
      metricKeys: ["cooking.food-confidence"],
      mappingStatus: "Draft"
    }
  ]);

  assert.equal(merged.length, operationsEvaluationQuestions.length + 1);
  assert.equal(merged.find((question) => question.id === "CHQ-01").question, "How many days this week did you eat vegetables?");
  assert.deepEqual(merged.find((question) => question.id === "CHQ-01").metricKeys, ["clinic.behavior-change"]);
  assert.equal(merged.find((question) => question.id === "CC-01").instrument, "Cooking Class Survey");
});

test("metric definitions merge saved edits while retaining defaults and target history", () => {
  const currentVersion = defaultOperationsMetricDefinitions[0].definitionVersion;
  const merged = mergeOperationsMetricDefinitions([
    {
      metricKey: "clinic.appointments-delivered",
      definitionVersion: currentVersion,
      name: "Appointments Completed",
      annualTargetValue: 450,
      targetHistory: [{ changedAt: "2026-07-01", annualTargetValue: 400 }]
    },
    {
      metricKey: "custom.partnerships",
      name: "Active Partnerships",
      programArea: "Community",
      category: "Partnership KPI",
      calculationMode: "Manual",
      active: true
    }
  ]);
  const appointments = merged.find((metric) => metric.metricKey === "clinic.appointments-delivered");
  const custom = merged.find((metric) => metric.metricKey === "custom.partnerships");

  assert.equal(appointments.name, "Appointments Completed");
  assert.equal(appointments.annualTargetValue, 450);
  assert.equal(appointments.sourceKey, "clinicAppointmentsDelivered");
  assert.match(appointments.collectionMethod, /Calculated from Appointments/i);
  assert.equal(appointments.collectionFrequency, "Ongoing");
  assert.equal(appointments.targetHistory.length, 1);
  assert.equal(custom.name, "Active Partnerships");
});

test("approved metric definition upgrades replace stale rules without losing targets", () => {
  const merged = mergeOperationsMetricDefinitions([
    {
      metricKey: "organization.children-served",
      name: "Total Children Served",
      calculationMode: "Needs Definition",
      annualTargetYear: 2026,
      annualTargetValue: 500,
      targetHistory: [{ changedAt: "2026-07-01", annualTargetValue: 400 }]
    },
    {
      metricKey: "organization.revenue-diversification",
      name: "Revenue Diversification",
      programArea: "Organization",
      calculationMode: "Needs Definition",
      active: true
    }
  ]);
  const childrenServed = merged.find((metric) => metric.metricKey === "organization.children-served");

  assert.equal(childrenServed.name, "Total Children Served");
  assert.equal(childrenServed.calculationMode, "Automatic");
  assert.equal(childrenServed.annualTargetValue, 500);
  assert.equal(childrenServed.targetHistory.length, 1);
  assert.equal(merged.some((metric) => metric.metricKey === "organization.revenue-diversification"), false);
});

test("manual source values feed automatic revenue totals and previous periods", () => {
  const currentPeriod = { startDate: "2026-07-01", endDate: "2026-07-31" };
  const previousPeriod = previousOperationsPeriod(currentPeriod.startDate, currentPeriod.endDate);
  const definitions = [
    defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "clinic.appointments-delivered"),
    defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "financial.grant-revenue"),
    defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === "financial.total-revenue")
  ];
  const measurements = [
    { id: "current-1", metricKey: "financial.grant-revenue", periodStart: currentPeriod.startDate, periodEnd: currentPeriod.endDate, value: 600 },
    { id: "current-2", metricKey: "financial.grant-revenue", periodStart: "2026-07-20", periodEnd: "2026-07-20", value: 400 },
    { id: "previous", metricKey: "financial.grant-revenue", periodStart: "2026-06-15", periodEnd: "2026-06-15", value: 750 }
  ];
  const currentValues = applyOperationsRevenueValues({
    clinicAppointmentsDelivered: 12,
    financialGiftRevenue: 400,
    financialHrsnRevenue: 100,
    financialOtherEarnedIncome: 50
  }, measurements, definitions, currentPeriod.startDate, currentPeriod.endDate);
  const previousValues = applyOperationsRevenueValues({
    clinicAppointmentsDelivered: 10,
    financialGiftRevenue: 200,
    financialHrsnRevenue: 100,
    financialOtherEarnedIncome: 0
  }, measurements, definitions, previousPeriod.startDate, previousPeriod.endDate);
  const results = operationsMetricResults(
    definitions,
    measurements,
    currentValues,
    previousValues,
    currentPeriod.startDate,
    currentPeriod.endDate,
    previousPeriod
  );

  assert.deepEqual(previousPeriod, { startDate: "2026-05-31", endDate: "2026-06-30" });
  assert.equal(results[0].currentValue, 12);
  assert.equal(results[0].previousValue, 10);
  assert.equal(results[1].currentValue, 1000);
  assert.equal(results[1].previousValue, 750);
  assert.equal(results[2].currentValue, 1550);
  assert.equal(results[2].previousValue, 1050);
});

test("Operations logged values use stable date-based identifiers", () => {
  assert.equal(
    performanceMeasurementId({
      metricKey: "financial.grant-revenue",
      periodStart: "2026-07-27",
      periodEnd: "2026-07-27"
    }),
    "financial.grant-revenue--2026-07-27--2026-07-27"
  );
});

test("annual pacing distinguishes ahead, on-target, and behind progress", () => {
  const metric = {
    calculationMode: "Automatic",
    annualTargetYear: 2026,
    annualTargetValue: 1000,
    performanceDirection: "Higher is better",
    unit: "Dollars"
  };

  assert.equal(operationsAnnualPacingStatus(metric, 600, "2026-06-30"), "Ahead of Target");
  assert.equal(operationsAnnualPacingStatus(metric, 480, "2026-06-30"), "On Target");
  assert.equal(operationsAnnualPacingStatus(metric, 400, "2026-06-30"), "Behind Target");
});

test("active-quarter results use the current pacing date instead of the future quarter end", () => {
  const definition = {
    metricKey: "financial.total-revenue",
    name: "Total Revenue",
    calculationMode: "Automatic",
    sourceKey: "financialTotalRevenue",
    annualTargetYear: 2026,
    annualTargetValue: 1000,
    performanceDirection: "Higher is better",
    unit: "Dollars"
  };
  const results = operationsMetricResults(
    [definition],
    [],
    { financialTotalRevenue: 600 },
    { financialTotalRevenue: 0 },
    "2026-07-01",
    "2026-09-30",
    { startDate: "2026-04-01", endDate: "2026-06-30" },
    { financialTotalRevenue: 600 },
    "2026-01-01",
    "2026-07-27"
  );

  assert.equal(results[0].annualPacingDate, "2026-07-27");
  assert.equal(results[0].annualPacingStatus, "Ahead of Target");
});

test("target status respects measure direction and avoids misleading partial-year totals", () => {
  const lowerIsBetter = {
    calculationMode: "Automatic",
    annualTargetYear: 2026,
    annualTargetValue: 15,
    performanceDirection: "Lower is better",
    unit: "Percentage"
  };
  const annualCount = {
    calculationMode: "Automatic",
    annualTargetYear: 2026,
    annualTargetValue: 400,
    performanceDirection: "Higher is better",
    unit: "Count"
  };

  assert.equal(operationsTargetStatus(lowerIsBetter, 10, "2026-01-01", "2026-07-31"), "On Track");
  assert.equal(operationsTargetStatus(lowerIsBetter, 20, "2026-01-01", "2026-07-31"), "Below Target");
  assert.equal(operationsTargetStatus(annualCount, 250, "2026-01-01", "2026-07-31"), "In Progress");
  assert.equal(operationsTargetStatus(annualCount, 450, "2026-01-01", "2026-12-31"), "On Track");
  assert.equal(operationsTargetStatus({ ...annualCount, calculationMode: "Needs Definition" }, null, "2026-01-01", "2026-12-31"), "Needs Definition");
});

test("Operations defaults to the current calendar quarter", () => {
  const date = new Date(2026, 6, 27, 12, 0, 0);
  assert.deepEqual(operationsCurrentQuarterPeriod(date), {
    startDate: "2026-07-01",
    endDate: "2026-09-30"
  });
  assert.deepEqual(defaultOperationsPeriod(date), {
    startDate: "2026-07-01",
    endDate: "2026-09-30"
  });
  assert.deepEqual(previousOperationsPeriod("2026-07-01", "2026-09-30"), {
    startDate: "2026-04-01",
    endDate: "2026-06-30"
  });
});

test("quarterly target progress uses annual pacing without changing rate thresholds", () => {
  const quarter = { startDate: "2026-07-01", endDate: "2026-09-30" };
  const countProgress = operationsTargetProgress({
    calculationMode: "Automatic",
    currentValue: 50,
    annualTargetYear: 2026,
    annualTargetValue: 400,
    performanceDirection: "Higher is better",
    unit: "Count"
  }, quarter.startDate, quarter.endDate);
  const rateProgress = operationsTargetProgress({
    calculationMode: "Automatic",
    currentValue: 40,
    annualTargetYear: 2026,
    annualTargetValue: 50,
    performanceDirection: "Higher is better",
    unit: "Percentage"
  }, quarter.startDate, quarter.endDate);
  const lowerProgress = operationsTargetProgress({
    calculationMode: "Automatic",
    currentValue: 20,
    annualTargetYear: 2026,
    annualTargetValue: 15,
    performanceDirection: "Lower is better",
    unit: "Percentage"
  }, quarter.startDate, quarter.endDate);

  assert.deepEqual(countProgress, { targetValue: 100, percent: 50, visualPercent: 50, label: "Quarter Target" });
  assert.deepEqual(rateProgress, { targetValue: 50, percent: 80, visualPercent: 80, label: "Quarter Target" });
  assert.deepEqual(lowerProgress, { targetValue: 15, percent: 75, visualPercent: 75, label: "Quarter Target" });
  assert.equal(operationsTargetProgress({
    calculationMode: "Manual",
    currentValue: null,
    annualTargetYear: 2026,
    annualTargetValue: 100,
    performanceDirection: "Higher is better",
    unit: "Dollars"
  }, quarter.startDate, quarter.endDate), null);
});

test("data quality reports missing source fields and intentionally unresolved measures", () => {
  const quality = operationsDataQuality({
    appointments: [{ appointmentDate: "2026-07-01", status: "Completed", clientIds: [] }],
    referrals: [{ createdAt: "2026-07-01", referralDate: "", firstContactDate: "", firstAppointmentDate: "" }],
    programSessions: [{ id: "school", program: "School", status: "Completed", sessionDate: "2026-07-02", schoolName: "", participantCount: null }],
    programRegistrations: [],
    earnedIncome: [{ periodEnd: "2026-07-31", paymentDate: "", amountReceived: null }],
    hrsnClaims: [{ approved: true, serviceDate: "2026-07-15", approvalDate: "", amount: 100 }]
  }, [
    { calculationMode: "Needs Definition", currentValue: null },
    { calculationMode: "Manual", currentValue: null },
    { calculationMode: "Needs Definition", currentValue: null, trackingTier: "Future" }
  ], "2026-07-01", "2026-07-31");

  assert.equal(quality.find((item) => item.area === "Clinic Referrals").issueCount, 1);
  assert.equal(quality.find((item) => item.area === "Referral Follow-Up").issueCount, 1);
  assert.equal(quality.find((item) => item.area === "Clinic Appointments").issueCount, 1);
  assert.equal(quality.find((item) => item.area === "Clinic Goal Results").issueCount, 1);
  assert.equal(quality.find((item) => item.area === "School Classes").issueCount, 1);
  assert.equal(quality.find((item) => item.area === "Earned Income").issueCount, 1);
  assert.equal(quality.find((item) => item.area === "HRSN Billing").issueCount, 1);
  assert.equal(quality.find((item) => item.area === "Metric Definitions").issueCount, 1);
  assert.equal(quality.find((item) => item.area === "Manual Values").issueCount, 1);
});

test("Operations payload cleaners constrain editable performance records", () => {
  const cleanedMetric = cleanPerformanceMetricPayload({
    definitionVersion: "2026072701",
    name: " Retention Rate ",
    programArea: " Clinic ",
    logicModelOutcome: " Better access ",
    calculationNotes: " Divide completed by eligible ",
    calculationMode: "Invented",
    collectionMethod: " Appointment records ",
    collectionFrequency: "Ongoing",
    performanceDirection: "Lower is better",
    reportingFrequency: "Monthly",
    annualTargetValue: "50",
    dashboard: true,
    trackingTier: "Future"
  });
  const cleanedMeasurement = cleanPerformanceMeasurementPayload({
    metricKey: " financial.total-revenue ",
    periodStart: "2026-01-01",
    periodEnd: "2026-07-31",
    value: "1250.50",
    note: " Accounting report "
  });
  const cleanedQuestion = cleanPerformanceEvaluationQuestionPayload({
    instrumentId: " health-questionnaire-v2 ",
    instrument: " Health Questionnaire ",
    question: " Updated question? ",
    metricKeys: [" clinic.behavior-change ", "clinic.behavior-change", ""],
    mappingStatus: "",
    recordStatus: "Active",
    required: "yes",
    sortOrder: "12",
    scoringRule: " Improvement from Enrollment to Graduation ",
    responseOptions: [" Never ", "Sometimes", "Never"],
    note: " Draft wording "
  });
  const cleanedInstrument = cleanPerformanceEvaluationInstrumentPayload({
    name: " Clinic Questionnaire ",
    version: " 2026 Draft 2 ",
    effectiveDate: "2026-07-29",
    programArea: " Clinic ",
    status: "Unapproved",
    administrationPoints: [" Enrollment ", "Graduation", "Enrollment"],
    languages: "English, Spanish",
    notes: " Content decisions pending "
  });
  const cleanedResponse = cleanPerformanceEvaluationResponsePayload({
    instrumentId: " clinic-questionnaire-v2 ",
    clientId: " client-1 ",
    appointmentId: " appointment-1 ",
    administrationPoint: " Enrollment ",
    responseDate: "2026-07-01",
    status: "Complete",
    answers: [
      { questionId: " Q1 ", value: " Yes " },
      { questionId: "Q2", value: [" One ", "Two", "One"] },
      { questionId: "", value: "ignored" }
    ]
  });

  assert.equal(cleanedMetric.name, "Retention Rate");
  assert.equal(cleanedMetric.definitionVersion, 2026072701);
  assert.equal(cleanedMetric.programArea, "Clinic");
  assert.equal(cleanedMetric.logicModelOutcome, "Better access");
  assert.equal(cleanedMetric.calculationNotes, "Divide completed by eligible");
  assert.equal(cleanedMetric.calculationMode, "Needs Definition");
  assert.equal(cleanedMetric.collectionMethod, "Appointment records");
  assert.equal(cleanedMetric.collectionFrequency, "Ongoing");
  assert.equal(cleanedMetric.annualTargetValue, 50);
  assert.equal(cleanedMetric.dashboard, true);
  assert.equal(cleanedMetric.trackingTier, "Future");
  assert.deepEqual(cleanedMeasurement, {
    metricKey: "financial.total-revenue",
    periodStart: "2026-01-01",
    periodEnd: "2026-07-31",
    value: 1250.5,
    note: "Accounting report"
  });
  assert.equal(cleanedQuestion.instrument, "Health Questionnaire");
  assert.equal(cleanedQuestion.instrumentId, "health-questionnaire-v2");
  assert.equal(cleanedQuestion.question, "Updated question?");
  assert.deepEqual(cleanedQuestion.metricKeys, ["clinic.behavior-change"]);
  assert.equal(cleanedQuestion.mappingStatus, "Needs Review");
  assert.equal(cleanedQuestion.recordStatus, "Active");
  assert.equal(cleanedQuestion.required, true);
  assert.equal(cleanedQuestion.sortOrder, 12);
  assert.equal(cleanedQuestion.scoringRule, "Improvement from Enrollment to Graduation");
  assert.deepEqual(cleanedQuestion.responseOptions, ["Never", "Sometimes"]);
  assert.equal(cleanedInstrument.status, "Draft");
  assert.equal(cleanedInstrument.effectiveDate, "2026-07-29");
  assert.deepEqual(cleanedInstrument.administrationPoints, ["Enrollment", "Graduation"]);
  assert.deepEqual(cleanedInstrument.languages, ["English", "Spanish"]);
  assert.equal(cleanedResponse.status, "Complete");
  assert.equal(cleanedResponse.clientId, "client-1");
  assert.deepEqual(cleanedResponse.answers, [
    { questionId: "Q1", value: "Yes" },
    { questionId: "Q2", value: ["One", "Two"] }
  ]);
});

test("Operations frontend formats, filters, summarizes, and prepares form payloads", () => {
  const metrics = [
    { metricKey: "one", name: "Appointments", programArea: "Clinic", category: "Output", calculationMode: "Automatic", currentValue: 12, previousValue: 10, unit: "Count", dashboard: true, performanceDirection: "Higher is better" },
    { metricKey: "two", name: "Retention", programArea: "Clinic", category: "Outcome", calculationMode: "Needs Definition", currentValue: null, previousValue: null, unit: "Percentage", dashboard: true },
    { metricKey: "three", name: "Revenue", programArea: "Financial", category: "Financial KPI", calculationMode: "Manual", currentValue: null, previousValue: null, unit: "Dollars", dashboard: true }
  ];
  const definitionData = new FormData();
  definitionData.set("name", "Appointments Delivered");
  definitionData.set("programArea", "Clinic");
  definitionData.set("category", "Output");
  definitionData.set("definition", "Completed appointments.");
  definitionData.set("logicModelOutcome", "Program reach");
  definitionData.set("calculationNotes", "Count completed records.");
  definitionData.set("unit", "Count");
  definitionData.set("calculationMode", "Automatic");
  definitionData.set("sourceKey", "clinicAppointmentsDelivered");
  definitionData.set("dataSource", "Appointments");
  definitionData.set("collectionMethod", "Automatic appointment count");
  definitionData.set("collectionFrequency", "Ongoing");
  definitionData.set("performanceDirection", "Higher is better");
  definitionData.set("reportingFrequency", "Monthly");
  definitionData.set("dashboard", "on");
  const measurementData = new FormData();
  measurementData.set("measurementDate", "2026-07-15");
  measurementData.set("value", "500");
  measurementData.set("note", "Accounting report");
  const questionData = new FormData();
  questionData.set("id", "FF-01");
  questionData.set("instrument", "Health Questionnaire");
  questionData.set("instrumentId", "health-questionnaire-draft");
  questionData.set("question", "How often do you eat vegetables?");
  questionData.set("mappingStatus", "Mapped");
  questionData.set("recordStatus", "Draft");
  questionData.set("required", "on");
  questionData.set("sortOrder", "20");
  questionData.set("scoringRule", "Not Configured");
  questionData.set("responseOptions", "Never\nSometimes\nOften");
  questionData.append("metricKeys", "clinic.behavior-change");
  questionData.append("metricKeys", "clinic.guideline-improvement");
  const instrumentData = new FormData();
  instrumentData.set("id", "health-questionnaire-draft");
  instrumentData.set("name", "Health Questionnaire");
  instrumentData.set("version", "Draft 2");
  instrumentData.set("effectiveDate", "2026-07-29");
  instrumentData.set("programArea", "Clinic");
  instrumentData.set("status", "Draft");
  instrumentData.set("administrationPoints", "Enrollment, Graduation");
  instrumentData.set("languages", "English, Spanish");

  assert.equal(formatOperationsValue({ unit: "Dollars" }, 1250), "$1,250");
  assert.equal(formatOperationsValue({ unit: "Percentage" }, 33.3), "33.3%");
  assert.equal(operationsPeriodLabel("2026-07-01", "2026-07-31"), "Jul 1, 2026 - Jul 31, 2026");
  assert.equal(operationsMetricMatches(metrics[0], "clinic output"), false);
  assert.equal(operationsMetricMatches(metrics[0], "appointments"), true);
  assert.deepEqual(operationsSummary(metrics, [{ issueCount: 2 }]), [
    ["1", "Live Measures"],
    ["1", "Needs Definition"],
    ["1", "Manual Values Due"],
    ["2", "Data Issues"]
  ]);
  assert.equal(operationsDashboardData(metrics, []).byArea.length, 2);
  assert.deepEqual(operationsMetricTrend(metrics[0]), { label: "+2 from prior period", direction: "good" });
  assert.equal(operationsMetricDefinitionPayload(definitionData).dashboard, true);
  assert.equal(operationsMetricDefinitionPayload(definitionData).logicModelOutcome, "Program reach");
  assert.equal(operationsMetricDefinitionPayload(definitionData).collectionFrequency, "Ongoing");
  assert.equal(operationsMetricDefinitionPayload(definitionData).annualTargetValue, null);
  assert.deepEqual(operationsMeasurementPayload(measurementData, "financial.total-revenue"), {
    metricKey: "financial.total-revenue",
    periodStart: "2026-07-15",
    periodEnd: "2026-07-15",
    value: 500,
    note: "Accounting report"
  });
  assert.deepEqual(operationsEvaluationQuestionPayload(questionData).metricKeys, [
    "clinic.behavior-change",
    "clinic.guideline-improvement"
  ]);
  assert.equal(operationsEvaluationQuestionPayload(questionData).instrumentId, "health-questionnaire-draft");
  assert.equal(operationsEvaluationQuestionPayload(questionData).required, true);
  assert.deepEqual(operationsEvaluationQuestionPayload(questionData).responseOptions, ["Never", "Sometimes", "Often"]);
  assert.deepEqual(operationsEvaluationRecordStatuses, ["Draft", "Active", "Retired"]);
  assert.deepEqual(operationsEvaluationInstrumentPayload(instrumentData), {
    id: "health-questionnaire-draft",
    name: "Health Questionnaire",
    version: "Draft 2",
    effectiveDate: "2026-07-29",
    programArea: "Clinic",
    status: "Draft",
    description: "",
    administrationPoints: ["Enrollment", "Graduation"],
    languages: ["English", "Spanish"],
    notes: ""
  });
  const measurementEditorSource = cleanSource.slice(
    cleanSource.indexOf("function renderOperationsMeasurementEditor"),
    cleanSource.indexOf("function renderOperationsPerformance")
  );
  assert.match(measurementEditorSource, /name="measurementDate"/);
  assert.doesNotMatch(measurementEditorSource, /<span>Period Start<\/span>/);
  assert.equal(operationsCoreMetrics([...metrics, { metricKey: "future", trackingTier: "Future" }]).length, metrics.length);
  assert.deepEqual(
    operationsMetricsForArea(defaultOperationsMetricDefinitions, "Financial").slice(0, 6).map((metric) => metric.metricKey),
    [
      "financial.total-revenue",
      "financial.grant-revenue",
      "financial.hrsn-revenue",
      "financial.workbook-sales",
      "financial.merchandise-sales",
      "financial.toolkit-sales"
    ]
  );
});

test("Operations exposes an editable, readable questionnaire workspace", () => {
  assert.match(cleanSource, /data-operations-evaluation-question-form/);
  assert.match(cleanSource, /data-operations-new-question/);
  assert.match(cleanSource, /data-operations-edit-question/);
  assert.match(cleanSource, /Save Question/);
  assert.match(cleanSource, /Measurement Gaps/);
  assert.match(cleanSource, /Instrument Versions/);
  assert.match(cleanSource, /data-operations-evaluation-instrument-form/);
  assert.match(cleanSource, /Draft content does not calculate performance results/);
  assert.match(routeSource, /\/api\/evaluation-responses/);
  assert.match(routeSource, /\/api\/evaluation-instruments\/:instrumentId\/questions/);
  assert.match(routeSource, /already has a \$\{payload\.administrationPoint\} response for this instrument version/);
  assert.match(routeSource, /router\.delete\("\/api\/evaluation-responses\/:responseId"/);
  assert.match(cleanCss, /\.operations-metric-rows strong\s*\{[\s\S]*?font-size: 13\.5px;/);
  assert.match(cleanCss, /\.operations-metric-rows small\s*\{[\s\S]*?font-size: 12px;/);
  assert.match(cleanCss, /\.operations-evaluation-question > strong,[\s\S]*?font-size: 13\.5px;/);
});

test("Operations executive dashboard keeps the approved program comparison and action queue compact", () => {
  const metrics = [
    { metricKey: "organization.children-served", name: "Total Children Served", programArea: "Organization", calculationMode: "Automatic", currentValue: 27, dashboard: true },
    { metricKey: "organization.program-engagements", name: "Program Engagements", programArea: "Organization", calculationMode: "Automatic", currentValue: 30, dashboard: true },
    { metricKey: "clinic.children-enrolled", name: "Children Enrolled", programArea: "Clinic", calculationMode: "Automatic", currentValue: 2, dashboard: true },
    { metricKey: "clinic.appointments-delivered", name: "Appointments Delivered", programArea: "Clinic", calculationMode: "Automatic", currentValue: 12, dashboard: true },
    { metricKey: "clinic.retention-rate", name: "Retention Rate", programArea: "Clinic", calculationMode: "Automatic", currentValue: 50, dashboard: true },
    { metricKey: "clinic.referrals-received", name: "Referrals Received", programArea: "Clinic", calculationMode: "Automatic", currentValue: 5, dashboard: true },
    { metricKey: "school.schools-reached", name: "Schools Reached", programArea: "School", calculationMode: "Automatic", currentValue: 1, dashboard: true },
    { metricKey: "school.students-reached", name: "Students Reached", programArea: "School", calculationMode: "Automatic", currentValue: 25, dashboard: true },
    { metricKey: "school.knowledge-gain", name: "School Knowledge Gain", programArea: "School", calculationMode: "Not Configured", currentValue: null, dashboard: false },
    { metricKey: "financial.total-revenue", name: "Total Revenue", programArea: "Financial", calculationMode: "Automatic", currentValue: 1675, ytdValue: 1675, dashboard: true },
    { metricKey: "financial.grant-revenue", name: "Grant Revenue", programArea: "Financial", calculationMode: "Manual", currentValue: 1000, ytdValue: 1000, dashboard: false },
    { metricKey: "financial.gift-revenue", name: "Gift Revenue", programArea: "Financial", calculationMode: "Automatic", currentValue: 400, ytdValue: 400, dashboard: false },
    { metricKey: "financial.hrsn-revenue", name: "HRSN Revenue", programArea: "Financial", calculationMode: "Automatic", currentValue: 125, ytdValue: 125, dashboard: true },
    { metricKey: "financial.workbook-sales", name: "Workbook Sales", programArea: "Financial", calculationMode: "Automatic", currentValue: 50, ytdValue: 50, dashboard: false },
    { metricKey: "financial.other-earned-income", name: "Other Earned Income", programArea: "Financial", calculationMode: "Automatic", currentValue: 150, ytdValue: 150, dashboard: false },
    { metricKey: "community.families-reached", name: "Families Reached", programArea: "Community", calculationMode: "Automatic", currentValue: 90, dashboard: true }
  ];
  const dashboard = operationsExecutiveDashboardData(metrics, [
    { area: "Referral Follow-Up", issueCount: 1 },
    { area: "Metric Definitions", issueCount: 4 },
    { area: "Manual Values", issueCount: 2 }
  ]);

  assert.deepEqual(dashboard.snapshotMetrics.map((metric) => metric.metricKey), [
    "organization.children-served",
    "organization.program-engagements",
    "community.families-reached",
    "clinic.referrals-received"
  ]);
  assert.deepEqual(dashboard.programRows.map((row) => row.area), ["Clinic", "Cooking", "School", "Community"]);
  assert.deepEqual(dashboard.programRows.map((row) => [row.label, row.subtitle]), [
    ["Clinic", "Family Nutrition"],
    ["Kitchen", "Kitchen Classes"],
    ["School", "School Classes"],
    ["Community", "Outreach Events"]
  ]);
  assert.equal(dashboard.programRows.find((row) => row.area === "Clinic").readiness.state, "Automatic");
  assert.equal(dashboard.programRows.find((row) => row.area === "School").readiness.state, "Not Configured");
  assert.equal(dashboard.financial.total.metricKey, "financial.total-revenue");
  assert.equal(dashboard.financial.mix.find((source) => source.metricKey === "financial.hrsn-revenue").percent, 7.5);
  assert.deepEqual(dashboard.financial.mix.map((source) => [source.label, source.value]), [
    ["Grants", 1000],
    ["HRSN", 125],
    ["Workbook Sales", 50],
    ["Other", 500]
  ]);
  assert.equal(dashboard.financial.grantValueMissing, false);
  assert.equal(dashboard.dashboardMetricCount, 11);
  assert.equal(dashboard.dashboardReadyCount, 11);
  assert.equal(dashboard.referralFollowUp.issueCount, 1);
  assert.equal(dashboard.totalQualityIssues, 7);
  assert.doesNotMatch(cleanSource, /The numbers leadership needs first/);
  assert.match(cleanSource, /operations-target-progress/);
  assert.match(cleanCss, /\.operations-target-progress-track/);
  assert.match(cleanSource, /Financial Performance/);
  assert.doesNotMatch(cleanSource, /data-operations-log-value/);
  assert.match(cleanSource, /<summary>Activity<\/summary>/);
  const metricDetailStart = cleanSource.indexOf("function renderOperationsMetricDetail");
  const metricDetailEnd = cleanSource.indexOf("\nfunction renderOperationsOptionList", metricDetailStart);
  const metricDetailSource = cleanSource.slice(metricDetailStart, metricDetailEnd);
  assert.doesNotMatch(metricDetailSource, /data-operations-edit-measurement/);
  assert.doesNotMatch(metricDetailSource, /data-operations-delete-measurement/);
  assert.match(routeSource, /Fundraising Financial Activity/);
  assert.doesNotMatch(cleanSource, /<summary>Historical Values<\/summary>/);
  assert.match(cleanSource, /data-operations-toggle-future/);
  assert.match(cleanSource, /<details class="operations-detail-disclosure">/);
});

test("Operations date range validation rejects malformed and reversed periods", () => {
  assert.equal(validDateRange("2026-01-01", "2026-12-31"), true);
  assert.equal(validDateRange("2026-12-31", "2026-01-01"), false);
  assert.equal(validDateRange("July 1", "2026-12-31"), false);
});
