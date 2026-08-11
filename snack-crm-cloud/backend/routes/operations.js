import express from "express";
import {
  appointments,
  cleanOptionalNumber,
  cleanPerformanceEvaluationInstrumentPayload,
  cleanPerformanceEvaluationQuestionPayload,
  cleanPerformanceEvaluationResponsePayload,
  cleanPerformanceMeasurementPayload,
  cleanPerformanceMetricPayload,
  cleanString,
  clients,
  earnedIncome,
  fetchAllDocuments,
  firestore,
  fundraisingGifts,
  hrsnClaims,
  outreachEvents,
  performanceMeasurements,
  performanceMetrics,
  performanceEvaluationInstruments,
  performanceEvaluationQuestions,
  performanceEvaluationResponses,
  programRegistrations,
  programSessions,
  referrals,
  requireAuth,
  tasks,
  toAppointment,
  toClient,
  toEarnedIncome,
  toFundraisingGift,
  toHrsnClaim,
  toOutreachEvent,
  toPerformanceMeasurement,
  toPerformanceMetric,
  toPerformanceEvaluationInstrument,
  toPerformanceEvaluationQuestion,
  toPerformanceEvaluationResponse,
  toProgramRegistration,
  toProgramSession,
  toReferral
} from "../lib/core.js";
import {
  clinicEvaluationResponseScore,
  clinicEvaluationResponseValidationError,
  clinicFeedbackSummaryForPeriod,
  clinicHealthChangeForPeriod,
  clinicHealthQuestionDefinitions,
  clinicKnowledgeGainForPeriod,
  clinicKnowledgeQuestionDefinitions,
  mergeClinicEvaluationInstruments,
  mergeClinicEvaluationQuestions
} from "../lib/clinic-evaluation.js";
import { weeklyPerformanceEmailPreview } from "../lib/weekly-performance-email.js";

const router = express.Router();

async function completeEnrollmentFormTasks(payload = {}, instrument = {}, userEmail = "") {
  if (payload.status !== "Complete"
    || payload.administrationPoint !== "Enrollment"
    || cleanString(instrument.formType).toLowerCase() !== "enrollment") return 0;
  const taskDocuments = await fetchAllDocuments(tasks.where("clientId", "==", payload.clientId));
  const now = new Date().toISOString();
  const matching = taskDocuments.filter((document) => {
    const task = document.data();
    return !["Done", "Canceled"].includes(task.status || "Open")
      && task.source === "Workflow Automation"
      && String(task.title || "").startsWith("Complete Program Enrollment for ");
  });
  if (!matching.length) return 0;
  const batch = firestore.batch();
  matching.forEach((document) => batch.update(document.ref, {
    status: "Done",
    completedAt: now,
    updatedAt: now,
    updatedBy: userEmail
  }));
  await batch.commit();
  return matching.length;
}

const operationsProgramAreas = ["Organization", "Financial", "Clinic", "Cooking", "School", "Community"];
const operationsDefinitionVersion = 2026072903;
const retiredOperationsMetricKeys = new Set([
  "organization.revenue-diversification"
]);
const futureOperationsMetricKeys = new Set([
  "organization.programs-meeting-outcome-targets",
  "clinic.knowledge-retention",
  "clinic.quality-of-life",
  "school.students-completing",
  "school.knowledge-retention",
  "school.teacher-confidence",
  "school.completion-rate",
  "school.survey-completion-rate",
  "school.lessons-as-planned",
  "school.teacher-implementation-rate",
  "cooking.total-attendance",
  "cooking.average-attendance",
  "cooking.repeat-participation",
  "cooking.guideline-improvement",
  "cooking.quality-of-life",
  "community.active-referral-partners",
  "community.active-community-partners",
  "community.referrals-by-partner",
  "community.referral-partner-activity-rate",
  "community.partner-retention-rate",
  "community.partner-satisfaction",
  "financial.grant-concentration",
  "financial.budget-variance",
  "financial.operating-reserves-months",
  "financial.earned-income-received"
]);

function defaultMetric(definition) {
  const category = definition.category || "Output";
  const calculationMode = definition.calculationMode || "Needs Definition";
  const dataSource = definition.dataSource || "";
  const reportingFrequency = definition.reportingFrequency || "Quarterly";
  const defaultCollectionMethod = calculationMode === "Automatic"
    ? `Calculated from ${dataSource || "SNACK Program Manager records"}.`
    : calculationMode === "Manual"
      ? `Entered from ${dataSource || "the approved source records"} for each reporting period.`
      : "Collection method requires approval before this measure can be activated.";
  const defaultCalculationNotes = calculationMode === "Automatic"
    ? "Uses source records inside the selected reporting period that meet the metric definition."
    : calculationMode === "Manual"
      ? "Uses the approved reporting-period value entered from the named source."
      : calculationMode === "Not Configured"
        ? "No calculation is active until the instrument and scoring rule are approved."
        : "The final calculation rule requires approval before this metric can be activated.";
  const defaultLogicModelOutcome = category === "Output"
    ? "Program reach and participation"
    : category === "Financial KPI"
      ? "Financial sustainability"
      : category === "Partnership KPI"
        ? "Community partnership strength"
        : category === "Operational KPI"
          ? "Effective and accessible program delivery"
          : "Participant knowledge, confidence, and behavior";
  return Object.freeze({
    definitionVersion: operationsDefinitionVersion,
    metricKey: definition.metricKey,
    name: definition.name,
    programArea: definition.programArea,
    category,
    definition: definition.definition || "Definition needs review.",
    logicModelOutcome: definition.logicModelOutcome || defaultLogicModelOutcome,
    calculationNotes: definition.calculationNotes || defaultCalculationNotes,
    unit: definition.unit || "Count",
    calculationMode,
    sourceKey: definition.sourceKey || "",
    dataSource,
    collectionMethod: definition.collectionMethod || defaultCollectionMethod,
    collectionFrequency: definition.collectionFrequency || (calculationMode === "Automatic" ? "Ongoing" : reportingFrequency),
    performanceDirection: definition.performanceDirection || "Higher is better",
    baselineYear: definition.baselineYear ?? null,
    baselineValue: definition.baselineValue ?? null,
    annualTargetYear: definition.annualTargetYear ?? 2026,
    annualTargetValue: definition.annualTargetValue ?? null,
    threeYearTargetYear: definition.threeYearTargetYear ?? 2028,
    threeYearTargetValue: definition.threeYearTargetValue ?? null,
    reportingFrequency,
    responsibleStaffMember: definition.responsibleStaffMember || "Executive Director",
    notes: definition.notes || "",
    dashboard: definition.dashboard === true,
    active: definition.active !== false,
    trackingTier: definition.trackingTier || (futureOperationsMetricKeys.has(definition.metricKey) ? "Future" : "Core"),
    targetHistory: []
  });
}

const defaultOperationsMetricDefinitions = Object.freeze([
  defaultMetric({
    metricKey: "organization.children-served",
    name: "Total Children Served",
    programArea: "Organization",
    category: "Output",
    definition: "Children served across Clinic, School, and Kitchen programs during the reporting period. Linked Clinic and Kitchen participants are deduplicated, and each reported School participant is counted as unique.",
    calculationMode: "Automatic",
    sourceKey: "organizationEstimatedChildrenServed",
    dataSource: "CRM, School Schedule, and Kitchen Schedule",
    notes: "School participants are counted from the aggregate Participant Count because student-level identifiers are not collected.",
    dashboard: true
  }),
  defaultMetric({
    metricKey: "organization.program-engagements",
    name: "Program Engagements",
    programArea: "Organization",
    category: "Output",
    definition: "Individual child participations in completed Clinic appointments, attended Kitchen registrations, and completed School classes. A shared sibling Clinic appointment is one appointment delivered and one engagement per child.",
    calculationMode: "Automatic",
    sourceKey: "organizationProgramEngagements",
    dataSource: "Appointments and Program Schedules",
    dashboard: true
  }),
  defaultMetric({
    metricKey: "organization.priority-population-participation",
    name: "Participants From Priority Populations",
    programArea: "Organization",
    category: "Equity KPI",
    definition: "Percentage of identifiable Clinic and Kitchen participants served during the reporting period who are YCCO members, receive HRSN services, or prefer Spanish.",
    logicModelOutcome: "Equitable access for low-income, Medicaid-covered, Spanish-preferring, and historically underserved participants",
    calculationNotes: "Each participant is counted once in the denominator and once in the numerator even when they meet more than one priority-population category.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "organizationPriorityPopulationParticipation",
    dataSource: "CRM Clients and Program Registrations",
    collectionMethod: "Collected from participant demographics and program registration records.",
    collectionFrequency: "Ongoing"
  }),
  defaultMetric({
    metricKey: "organization.programs-meeting-outcome-targets",
    name: "Programs Meeting Outcome Targets",
    programArea: "Organization",
    category: "Outcome",
    definition: "Percentage of Clinic, School, and Kitchen programs meeting their active annual outcome targets.",
    logicModelOutcome: "Organization-wide program impact",
    calculationNotes: "Do not calculate until each direct-service program has at least one active outcome target.",
    unit: "Percentage",
    calculationMode: "Not Configured",
    dataSource: "Active program outcome measures",
    collectionMethod: "Calculated from approved annual outcome targets once all three programs are configured.",
    reportingFrequency: "Annual"
  }),
  defaultMetric({
    metricKey: "organization.active-partners",
    name: "Active Community and Referral Partners",
    programArea: "Organization",
    category: "Partnership KPI",
    definition: "Unique organizations completing at least one approved partnership activity during the reporting period.",
    logicModelOutcome: "Stronger referral pathways and community partnerships",
    calculationNotes: "Qualifying activities include a referral, hosted program, event support, active planning, outreach sharing, or an active collaborative project.",
    calculationMode: "Not Configured",
    dataSource: "Referral Network, Referrals, and Outreach",
    collectionMethod: "Combined from organization profiles and dated qualifying activities.",
    collectionFrequency: "Ongoing"
  }),
  defaultMetric({
    metricKey: "clinic.children-enrolled",
    name: "Children Enrolled",
    programArea: "Clinic",
    category: "Output",
    definition: "Unduplicated children with a completed Enrollment appointment during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "clinicChildrenEnrolled",
    dataSource: "Appointments",
    collectionMethod: "Calculated from completed appointments categorized as Enrollment.",
    collectionFrequency: "Ongoing",
    baselineYear: 2025,
    baselineValue: 88,
    annualTargetValue: 90,
    threeYearTargetValue: 185,
    dashboard: true
  }),
  defaultMetric({
    metricKey: "clinic.appointments-delivered",
    name: "Appointments Delivered",
    programArea: "Clinic",
    category: "Output",
    definition: "Clinic appointment records marked Completed during the reporting period. A combined sibling appointment counts as one delivered appointment.",
    calculationMode: "Automatic",
    sourceKey: "clinicAppointmentsDelivered",
    dataSource: "Appointments",
    baselineYear: 2025,
    baselineValue: 244,
    annualTargetValue: 400,
    threeYearTargetValue: 700,
    dashboard: true
  }),
  defaultMetric({
    metricKey: "clinic.referrals-received",
    name: "Referrals Received",
    programArea: "Clinic",
    category: "Output",
    definition: "Referral records with a Referral Date inside the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "clinicReferralsReceived",
    dataSource: "CRM Referrals",
    dashboard: true
  }),
  defaultMetric({
    metricKey: "clinic.referral-contact-days",
    name: "Referral to Contact Time",
    programArea: "Clinic",
    category: "Operational KPI",
    definition: "Average calendar days from Referral Date to First Contact for referrals with both dates recorded.",
    unit: "Days",
    calculationMode: "Automatic",
    sourceKey: "clinicReferralContactDays",
    dataSource: "CRM Referrals",
    performanceDirection: "Lower is better",
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "clinic.referral-appointment-days",
    name: "Referral to Appointment Time",
    programArea: "Clinic",
    category: "Operational KPI",
    definition: "Average calendar days from Referral Date to First Appointment for referrals with both dates recorded.",
    unit: "Days",
    calculationMode: "Automatic",
    sourceKey: "clinicReferralAppointmentDays",
    dataSource: "CRM Referrals",
    performanceDirection: "Lower is better",
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "clinic.no-show-rate",
    name: "No-Show Rate",
    programArea: "Clinic",
    category: "Operational KPI",
    definition: "No-show appointments divided by completed plus no-show appointments during the reporting period.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "clinicNoShowRate",
    dataSource: "Appointments",
    performanceDirection: "Lower is better",
    baselineYear: 2025,
    baselineValue: 18,
    annualTargetValue: 15,
    threeYearTargetValue: 10,
    dashboard: true
  }),
  defaultMetric({
    metricKey: "clinic.retention-rate",
    name: "Retention Rate",
    programArea: "Clinic",
    category: "Operational KPI",
    definition: "Percentage of children with a completed Enrollment appointment and at least 60 days of follow-up opportunity who later completed at least one Nutrition Education appointment.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "clinicRetentionRate",
    dataSource: "CRM Clients and Appointments",
    calculationNotes: "The denominator includes unique children enrolled in the reporting period at least 60 days before the period end. The numerator includes those children with a later completed Nutrition Education appointment by the period end.",
    collectionMethod: "Calculated from linked completed Enrollment and Nutrition Education appointments.",
    collectionFrequency: "Ongoing",
    baselineYear: 2025,
    baselineValue: 32,
    annualTargetValue: 50,
    threeYearTargetValue: 70,
    dashboard: true
  }),
  defaultMetric({
    metricKey: "clinic.graduates",
    name: "Program Graduates",
    programArea: "Clinic",
    category: "Output",
    definition: "Unduplicated children whose final Healthy Habits appointment was completed during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "clinicGraduates",
    dataSource: "Appointments and CRM Clients",
    collectionMethod: "Completing the final Healthy Habits appointment records the child's Graduation Date and counts the graduation once.",
    collectionFrequency: "Ongoing"
  }),
  defaultMetric({
    metricKey: "clinic.graduation-rate",
    name: "Graduation Rate",
    programArea: "Clinic",
    category: "Operational KPI",
    definition: "Children graduating during the calendar year divided by children enrolled during the same calendar year.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "clinicGraduationRate",
    dataSource: "Appointments and CRM Clients",
    calculationNotes: "The live value uses January 1 through the selected period end. A graduation is recorded once when the final Healthy Habits appointment is marked Completed.",
    collectionMethod: "Calculated from unique children with completed Enrollment and final Healthy Habits appointments in the same calendar year.",
    collectionFrequency: "Ongoing",
    reportingFrequency: "Annual"
  }),
  defaultMetric({
    metricKey: "clinic.goal-achievement",
    name: "Goal Achievement",
    programArea: "Clinic",
    category: "Outcome",
    definition: "Child-level Clinic goals marked Achieved divided by all assessed child goals on completed appointments. Siblings receive separate results even when they chose the same goal.",
    logicModelOutcome: "Participants set and achieve weekly nutrition or wellness goals",
    calculationNotes: "The denominator includes Achieved, Partly Achieved, and Not Achieved results. Not Assessed is excluded.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "clinicGoalAchievement",
    dataSource: "Appointment participant goal results",
    collectionMethod: "Staff record Goal Result in appointment Wrap Up when completing the appointment.",
    collectionFrequency: "Ongoing",
    baselineYear: 2025,
    baselineValue: 84
  }),
  defaultMetric({
    metricKey: "clinic.knowledge-gain",
    name: "Self-Reported Nutrition Knowledge Gain",
    programArea: "Clinic",
    category: "Outcome",
    definition: "Average change between each child's retrospective Before SNACK and Now self-reported nutrition knowledge scores at Graduation.",
    logicModelOutcome: "Increased nutrition knowledge and food literacy",
    calculationNotes: "Yes is scored as 1 and No as 0 in both columns. Each of the seven lessons receives equal weight. Now minus Before SNACK is calculated for each completed child assessment, then averaged across children.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "clinicKnowledgeGain",
    dataSource: "Clinic Knowledge Assessment",
    collectionMethod: "Complete the active retrospective Clinic Knowledge Assessment once at Graduation. Legacy matched Enrollment and Graduation records retain their original calculation.",
    collectionFrequency: "Ongoing"
  }),
  defaultMetric({
    metricKey: "clinic.knowledge-retention",
    name: "Knowledge Retention",
    programArea: "Clinic",
    category: "Outcome",
    definition: "Percentage of post-program nutrition knowledge retained at an approved later follow-up assessment.",
    logicModelOutcome: "Sustained nutrition knowledge and food literacy",
    calculationNotes: "The follow-up interval and retention formula require approval before activation.",
    unit: "Percentage",
    calculationMode: "Not Configured",
    dataSource: "Future mapped evaluation tools",
    baselineYear: 2025,
    baselineValue: 95
  }),
  defaultMetric({
    metricKey: "clinic.behavior-change",
    name: "Behavior Change",
    programArea: "Clinic",
    category: "Outcome",
    definition: "Percentage of evaluated participants with at least one approved nutrition- or health-related behavior that improves from Enrollment to Graduation.",
    logicModelOutcome: "Sustainable healthy habits and positive behavior change",
    calculationNotes: "A child is eligible when at least five of seven behavior domains have comparable Enrollment and Graduation scores. At least one improved domain qualifies the child; declines remain visible in detailed reporting.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "clinicBehaviorChange",
    dataSource: "Health Questionnaire",
    collectionMethod: "Match the same Health Questionnaire version by CRM client ID at Enrollment and Graduation. I don't know is treated as missing data, never zero."
  }),
  defaultMetric({
    metricKey: "clinic.guideline-improvement",
    name: "Improvement in Selected Guideline-Aligned Food Behaviors",
    programArea: "Clinic",
    category: "Outcome",
    definition: "Average change in the equally weighted Vegetables, Whole Fruit, Whole Grains, and Added Sugar behavior-domain score from Enrollment to Graduation.",
    logicModelOutcome: "Greater alignment with recommended dietary patterns",
    calculationNotes: "Each food domain is normalized to 0-100. Added-sugar drinks and foods are combined into one domain. All four food domains must be comparable; I don't know is missing data, never zero.",
    unit: "Score",
    calculationMode: "Automatic",
    sourceKey: "clinicGuidelineImprovement",
    dataSource: "Health Questionnaire",
    collectionMethod: "Match the same Health Questionnaire version by CRM client ID at Enrollment and Graduation and average each child's Graduation-minus-Enrollment food score."
  }),
  defaultMetric({
    metricKey: "clinic.quality-of-life",
    name: "Quality-of-Life Improvement",
    programArea: "Clinic",
    category: "Outcome",
    definition: "Change in participant quality of life using a future approved measure.",
    logicModelOutcome: "Improved child and family health and well-being",
    calculationNotes: "The instrument and scoring method have not been selected.",
    unit: "Score",
    calculationMode: "Not Configured",
    dataSource: "Future quality-of-life instrument",
    collectionMethod: "No collection method is active."
  }),
  defaultMetric({
    metricKey: "clinic.participant-satisfaction",
    name: "Participant Satisfaction",
    programArea: "Clinic",
    category: "Outcome",
    definition: "Percentage of child and caregiver feedback respondents rating their satisfaction 4 or 5 on the active 0-to-5 question.",
    logicModelOutcome: "Positive, family-centered program experience",
    calculationNotes: "Each completed Child Feedback and Caregiver Feedback form contributes one satisfaction rating. Ratings of 4 or 5 are positive.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "clinicParticipantSatisfaction",
    dataSource: "Child and Caregiver Feedback",
    collectionMethod: "Calculate the percentage of completed feedback forms in the reporting period with a satisfaction rating of 4 or 5."
  }),
  defaultMetric({
    metricKey: "school.schools-reached",
    name: "Schools Reached",
    programArea: "School",
    category: "Output",
    definition: "Unique School names represented by completed School classes during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "schoolSchoolsReached",
    dataSource: "School Schedule",
    baselineYear: 2025,
    baselineValue: 1,
    annualTargetValue: 1,
    threeYearTargetValue: 2,
    dashboard: true
  }),
  defaultMetric({
    metricKey: "school.classes-delivered",
    name: "School Classes Delivered",
    programArea: "School",
    category: "Output",
    definition: "School classes marked Completed during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "schoolClassesDelivered",
    dataSource: "School Schedule"
  }),
  defaultMetric({
    metricKey: "school.classrooms-reached",
    name: "Classrooms Reached",
    programArea: "School",
    category: "Output",
    definition: "Unique classrooms reached during the reporting period.",
    calculationMode: "Needs Definition",
    dataSource: "School Schedule",
    notes: "The current School schedule does not yet store a stable classroom identifier."
  }),
  defaultMetric({
    metricKey: "school.students-reached",
    name: "Students Reached",
    programArea: "School",
    category: "Output",
    definition: "Sum of Participant Count on completed School classes during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "schoolStudentsReached",
    dataSource: "School Schedule",
    baselineYear: 2025,
    baselineValue: 125,
    annualTargetValue: 125,
    threeYearTargetValue: 250,
    dashboard: true
  }),
  defaultMetric({
    metricKey: "school.students-completing",
    name: "Students Completing the Program",
    programArea: "School",
    category: "Output",
    definition: "Students meeting the approved School program completion requirement during the reporting period.",
    logicModelOutcome: "Students complete the intended nutrition education sequence",
    calculationNotes: "The completion requirement and student-level identifier must be approved before calculation.",
    calculationMode: "Needs Definition",
    dataSource: "School Schedule and future student participation records",
    collectionMethod: "Recorded from student-level attendance or approved aggregate completion records."
  }),
  defaultMetric({
    metricKey: "school.knowledge-gain",
    name: "School Knowledge Gain",
    programArea: "School",
    category: "Outcome",
    definition: "Change on the approved School knowledge measure between assessment points.",
    unit: "Score",
    calculationMode: "Not Configured",
    dataSource: "Future mapped evaluation tools"
  }),
  defaultMetric({
    metricKey: "school.knowledge-retention",
    name: "Student Nutrition Knowledge Retention",
    programArea: "School",
    category: "Outcome",
    definition: "Knowledge demonstrated at an approved follow-up assessment after School program delivery.",
    logicModelOutcome: "Sustained student nutrition knowledge",
    calculationNotes: "Do not activate until a follow-up assessment and retention formula are approved.",
    unit: "Score",
    calculationMode: "Not Configured",
    dataSource: "Future School follow-up assessment",
    collectionMethod: "Matched post-program and follow-up student assessments."
  }),
  defaultMetric({
    metricKey: "school.teacher-satisfaction",
    name: "Teacher Satisfaction",
    programArea: "School",
    category: "Outcome",
    definition: "Teacher satisfaction result using the approved survey measure.",
    unit: "Score",
    calculationMode: "Not Configured",
    dataSource: "Future mapped evaluation tools"
  }),
  defaultMetric({
    metricKey: "school.teacher-confidence",
    name: "Teacher Confidence",
    programArea: "School",
    category: "Outcome",
    definition: "Change in teacher confidence supporting or implementing nutrition education using the active teacher survey.",
    logicModelOutcome: "Educators are more confident supporting nutrition education",
    calculationNotes: "The teacher survey and scoring rule require approval.",
    unit: "Score",
    calculationMode: "Not Configured",
    dataSource: "Future teacher survey",
    collectionMethod: "Matched teacher pre-program and post-program responses."
  }),
  defaultMetric({
    metricKey: "school.completion-rate",
    name: "Student Completion Rate",
    programArea: "School",
    category: "Operational KPI",
    definition: "Students completing the program divided by students enrolled in the applicable cohort.",
    logicModelOutcome: "Consistent delivery and student participation",
    calculationNotes: "The cohort and completion rules require approval.",
    unit: "Percentage",
    calculationMode: "Needs Definition",
    dataSource: "School participation records",
    collectionMethod: "Calculated from approved cohort enrollment and completion records."
  }),
  defaultMetric({
    metricKey: "school.survey-completion-rate",
    name: "Survey Completion Rate",
    programArea: "School",
    category: "Operational KPI",
    definition: "Students with usable matched pre/post survey data divided by students expected to complete both surveys.",
    logicModelOutcome: "Reliable School program evaluation data",
    calculationNotes: "Requires a matched survey identifier and an approved expected-participant denominator.",
    unit: "Percentage",
    calculationMode: "Not Configured",
    dataSource: "Future School assessments",
    collectionMethod: "Matched pre-program and post-program student assessments."
  }),
  defaultMetric({
    metricKey: "school.lessons-as-planned",
    name: "Lessons Delivered as Planned",
    programArea: "School",
    category: "Operational KPI",
    definition: "Lessons delivered divided by lessons scheduled in the approved School program plan.",
    logicModelOutcome: "School curriculum is delivered as intended",
    calculationNotes: "The approved lesson plan and expected lesson count must be stored before calculation.",
    unit: "Percentage",
    calculationMode: "Needs Definition",
    dataSource: "School Schedule and approved program plan",
    collectionMethod: "Compared from scheduled and completed School classes."
  }),
  defaultMetric({
    metricKey: "school.teacher-implementation-rate",
    name: "Teacher Implementation Rate",
    programArea: "School",
    category: "Operational KPI",
    definition: "Trained teachers who independently implement the curriculum divided by teachers expected to implement it.",
    logicModelOutcome: "Sustained teacher-led nutrition education",
    calculationNotes: "Teacher training and independent implementation are not yet recorded in a structured workflow.",
    unit: "Percentage",
    calculationMode: "Not Configured",
    dataSource: "Future teacher training and implementation records",
    collectionMethod: "Teacher training roster and implementation confirmation."
  }),
  defaultMetric({
    metricKey: "cooking.classes-delivered",
    name: "Kitchen Classes Delivered",
    programArea: "Cooking",
    category: "Output",
    definition: "Kitchen classes marked Completed during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "cookingClassesDelivered",
    dataSource: "Kitchen Schedule",
    baselineYear: 2025,
    baselineValue: 10,
    annualTargetValue: 11,
    dashboard: true
  }),
  defaultMetric({
    metricKey: "cooking.participants-served",
    name: "Kitchen Participants Served",
    programArea: "Cooking",
    category: "Output",
    definition: "Unduplicated children marked Attended in completed Kitchen classes during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "cookingParticipantsServed",
    dataSource: "Kitchen Registrations",
    baselineYear: 2025,
    baselineValue: 32,
    annualTargetValue: 120,
    dashboard: true
  }),
  defaultMetric({
    metricKey: "cooking.total-attendance",
    name: "Total Kitchen Attendance",
    programArea: "Cooking",
    category: "Output",
    definition: "Total participant attendances across completed Kitchen classes. A repeat participant counts once for each class attended.",
    calculationMode: "Automatic",
    sourceKey: "cookingTotalAttendance",
    dataSource: "Kitchen Registrations"
  }),
  defaultMetric({
    metricKey: "cooking.attendance-rate",
    name: "Kitchen Attendance Rate",
    programArea: "Cooking",
    category: "Operational KPI",
    definition: "Attended children divided by attended plus absent children for completed Kitchen classes.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "cookingAttendanceRate",
    dataSource: "Kitchen Registrations"
  }),
  defaultMetric({
    metricKey: "cooking.average-attendance",
    name: "Average Class Attendance",
    programArea: "Cooking",
    category: "Operational KPI",
    definition: "Attended children divided by completed Kitchen classes during the reporting period.",
    unit: "Average",
    calculationMode: "Automatic",
    sourceKey: "cookingAverageAttendance",
    dataSource: "Kitchen Schedule and Registrations"
  }),
  defaultMetric({
    metricKey: "cooking.repeat-participation",
    name: "Repeat Participation",
    programArea: "Cooking",
    category: "Operational KPI",
    definition: "Percentage of identifiable Kitchen participants who attended more than one completed class during the reporting period.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "cookingRepeatParticipation",
    dataSource: "Kitchen Registrations"
  }),
  defaultMetric({
    metricKey: "cooking.satisfaction",
    name: "Kitchen Class Satisfaction",
    programArea: "Cooking",
    category: "Outcome",
    definition: "Participant satisfaction result using the approved Kitchen survey measure.",
    unit: "Score",
    calculationMode: "Not Configured",
    dataSource: "Future mapped evaluation tools"
  }),
  defaultMetric({
    metricKey: "cooking.food-confidence",
    name: "Confidence Preparing Healthy Foods",
    programArea: "Cooking",
    category: "Outcome",
    definition: "Change in confidence preparing healthy foods using the approved Kitchen survey measure.",
    unit: "Score",
    calculationMode: "Not Configured",
    dataSource: "Future mapped evaluation tools"
  }),
  defaultMetric({
    metricKey: "cooking.intent-at-home",
    name: "Intent to Prepare Recipes at Home",
    programArea: "Cooking",
    category: "Outcome",
    definition: "Percentage of participants who intend to prepare a class recipe at home.",
    unit: "Percentage",
    calculationMode: "Not Configured",
    dataSource: "Future mapped evaluation tools"
  }),
  defaultMetric({
    metricKey: "cooking.guideline-improvement",
    name: "Improvement Toward Recommended Dietary Guidelines",
    programArea: "Cooking",
    category: "Outcome",
    definition: "A summary indicator based on improvement in one or more approved food-specific measures.",
    logicModelOutcome: "Greater alignment with recommended dietary patterns",
    calculationNotes: "The food-specific questions and composite scoring formula for Kitchen classes have not been approved.",
    unit: "Score",
    calculationMode: "Not Configured",
    dataSource: "Future Kitchen participant survey",
    collectionMethod: "Approved pre/post or retrospective pre/post Kitchen survey."
  }),
  defaultMetric({
    metricKey: "cooking.quality-of-life",
    name: "Quality-of-Life Improvement",
    programArea: "Cooking",
    category: "Outcome",
    definition: "Change in participant quality of life using a future approved measure.",
    logicModelOutcome: "Improved participant health and well-being",
    calculationNotes: "The instrument and scoring method have not been selected.",
    unit: "Score",
    calculationMode: "Not Configured",
    dataSource: "Future quality-of-life instrument",
    collectionMethod: "No collection method is active."
  }),
  defaultMetric({
    metricKey: "community.events-completed",
    name: "Outreach Events Completed",
    programArea: "Community",
    category: "Output",
    definition: "Outreach events marked Completed during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "communityEventsCompleted",
    dataSource: "Outreach Events"
  }),
  defaultMetric({
    metricKey: "community.families-reached",
    name: "Families Reached",
    programArea: "Community",
    category: "Output",
    definition: "Sum of Families Interacted With on completed Outreach events during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "communityFamiliesReached",
    dataSource: "Outreach Events",
    dashboard: true
  }),
  defaultMetric({
    metricKey: "community.event-participants",
    name: "Event Participants",
    programArea: "Community",
    category: "Output",
    definition: "Sum of Participants on completed Outreach events during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "communityEventParticipants",
    dataSource: "Outreach Events"
  }),
  defaultMetric({
    metricKey: "community.referrals-generated",
    name: "Referrals Generated",
    programArea: "Community",
    category: "Output",
    definition: "Sum of Referrals on completed Outreach events during the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "communityReferralsGenerated",
    dataSource: "Outreach Events"
  }),
  defaultMetric({
    metricKey: "community.active-referral-partners",
    name: "Active Referral Partners",
    programArea: "Community",
    category: "Output",
    definition: "Unique organizations that made at least one referral during the reporting period.",
    logicModelOutcome: "Strong and active referral pathways",
    calculationNotes: "Referral records must link to a stable organization profile before this can be calculated reliably.",
    calculationMode: "Needs Definition",
    dataSource: "CRM Referrals and Referral Network",
    collectionMethod: "Unique referring organizations from dated referral records.",
    collectionFrequency: "Ongoing"
  }),
  defaultMetric({
    metricKey: "community.active-community-partners",
    name: "Active Community Partners",
    programArea: "Community",
    category: "Output",
    definition: "Unique organizations completing at least one approved qualifying partnership activity during the reporting period.",
    logicModelOutcome: "Strong community partnerships",
    calculationNotes: "Qualifying activity types and organization links must be stored consistently before calculation.",
    calculationMode: "Needs Definition",
    dataSource: "Referral Network and Outreach",
    collectionMethod: "Unique organizations linked to qualifying dated activities.",
    collectionFrequency: "Ongoing"
  }),
  defaultMetric({
    metricKey: "community.referrals-by-partner",
    name: "Referrals by Partner",
    programArea: "Community",
    category: "Partnership KPI",
    definition: "Number of referrals attributed to each referral-source organization during the reporting period.",
    logicModelOutcome: "Partners connect families to SNACK services",
    calculationNotes: "This is a partner-level breakdown rather than one organization-wide scalar value.",
    calculationMode: "Needs Definition",
    dataSource: "CRM Referrals and Referral Network",
    collectionMethod: "Grouped count of referrals linked to each referring organization.",
    collectionFrequency: "Ongoing"
  }),
  defaultMetric({
    metricKey: "community.referral-partner-activity-rate",
    name: "Referral Partners Making a Referral",
    programArea: "Community",
    category: "Partnership KPI",
    definition: "Active referring partners divided by all organizations designated as current referral partners.",
    logicModelOutcome: "Active and productive referral partnerships",
    calculationNotes: "Requires a stable current-partner designation and organization-level referral links.",
    unit: "Percentage",
    calculationMode: "Needs Definition",
    dataSource: "CRM Referrals and Referral Network",
    collectionMethod: "Compared from current referral-partner profiles and dated referrals."
  }),
  defaultMetric({
    metricKey: "community.partner-retention-rate",
    name: "Partner Retention Rate",
    programArea: "Community",
    category: "Partnership KPI",
    definition: "Partners active in both the current and prior comparable periods divided by partners active in the prior period.",
    logicModelOutcome: "Sustained community and referral partnerships",
    calculationNotes: "Requires approved qualifying activities and stable organization identifiers.",
    unit: "Percentage",
    calculationMode: "Needs Definition",
    dataSource: "Referral Network, Referrals, and Outreach",
    collectionMethod: "Compared from organization-level qualifying activities in consecutive periods."
  }),
  defaultMetric({
    metricKey: "community.partner-satisfaction",
    name: "Partner Satisfaction",
    programArea: "Community",
    category: "Partnership KPI",
    definition: "Percentage of responding partners providing a positive satisfaction rating.",
    logicModelOutcome: "Positive and mutually beneficial partnerships",
    calculationNotes: "The partner survey and positive-response threshold have not been approved.",
    unit: "Percentage",
    calculationMode: "Not Configured",
    dataSource: "Future partner survey",
    collectionMethod: "Partner feedback collected at the approved interval.",
    reportingFrequency: "Annual"
  }),
  defaultMetric({
    metricKey: "financial.total-revenue",
    name: "Total Revenue",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Total recognized grant, gift, HRSN, and other earned income revenue for the reporting period.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialTotalRevenue",
    dataSource: "Fundraising Financial Activity, Gifts, and HRSN Billing",
    calculationNotes: "Adds dated Grant Revenue, monetary gifts, approved HRSN billing amounts, and Other Earned Income for the same reporting period.",
    collectionMethod: "Calculated from dated revenue transactions and approved billing records in Finances.",
    collectionFrequency: "Ongoing",
    baselineYear: 2025,
    baselineValue: 88381,
    annualTargetValue: 97900,
    threeYearTargetValue: 130000,
    dashboard: true,
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "financial.grant-revenue",
    name: "Grant Revenue",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Grant payments received during the reporting period.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialGrantRevenue",
    dataSource: "Fundraising Financial Activity",
    collectionMethod: "Calculated from dated Financial Activity entries categorized as Grant Revenue.",
    collectionFrequency: "Ongoing",
    baselineYear: 2025,
    baselineValue: 85000,
    annualTargetValue: 90000,
    threeYearTargetValue: 110000,
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "financial.hrsn-revenue",
    name: "HRSN Revenue",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Approved HRSN billing amount recognized during the reporting period. Approval temporarily serves as the payment-recognition event until received-payment data is available from accounting.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialHrsnRevenue",
    dataSource: "HRSN Billing",
    collectionMethod: "Calculated from HRSN billing records by Approval Date. Draft and Submitted-only records are excluded.",
    collectionFrequency: "Ongoing",
    baselineYear: 2025,
    baselineValue: 0,
    annualTargetValue: 1000,
    threeYearTargetValue: 5000,
    dashboard: true,
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "financial.gift-revenue",
    name: "Gift Revenue",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Total monetary gifts received during the reporting period, excluding in-kind gifts.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialGiftRevenue",
    dataSource: "Fundraising Gifts",
    collectionMethod: "Calculated from dated monetary gift transactions; in-kind gifts are excluded.",
    collectionFrequency: "Ongoing",
    dashboard: true,
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "financial.other-earned-income",
    name: "Other Earned Income",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Earned income received during the reporting period other than HRSN reimbursements.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialOtherEarnedIncome",
    dataSource: "Fundraising Financial Activity",
    collectionMethod: "Calculated from dated Financial Activity entries categorized as product sales or Other Income.",
    collectionFrequency: "Ongoing",
    dashboard: true,
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "financial.individual-giving",
    name: "Individual Giving",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Recognized individual donation revenue for the reporting period.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialIndividualGiving",
    dataSource: "Fundraising Gifts",
    collectionMethod: "Calculated from gift transactions categorized as Individual Gift.",
    collectionFrequency: "Ongoing",
    baselineYear: 2025,
    baselineValue: 3200,
    annualTargetValue: 4500,
    threeYearTargetValue: 8000,
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "financial.sponsorship-revenue",
    name: "Sponsorship Revenue",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Recognized sponsorship revenue for the reporting period.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialSponsorshipRevenue",
    dataSource: "Fundraising Gifts",
    collectionMethod: "Calculated from gift transactions categorized as Sponsorship.",
    collectionFrequency: "Ongoing",
    reportingFrequency: "Quarterly"
  }),
  defaultMetric({
    metricKey: "financial.event-revenue",
    name: "Event Revenue",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Recognized fundraising event revenue for the reporting period.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialEventRevenue",
    dataSource: "Fundraising Gifts",
    collectionMethod: "Calculated from gift transactions categorized as Fundraising Event.",
    collectionFrequency: "Ongoing",
    reportingFrequency: "Quarterly"
  }),
  defaultMetric({
    metricKey: "financial.new-donors",
    name: "New Donors",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Unique donors whose earliest recorded gift transaction falls within the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "financialNewDonors",
    dataSource: "Fundraising Gifts",
    collectionMethod: "Calculated from each donor's earliest recorded gift transaction.",
    collectionFrequency: "Ongoing",
    reportingFrequency: "Quarterly"
  }),
  defaultMetric({
    metricKey: "financial.repeat-donors",
    name: "Repeat Donors",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Unique donors who made at least one gift during the reporting period and had also made a gift before the reporting period.",
    calculationMode: "Automatic",
    sourceKey: "financialRepeatDonors",
    dataSource: "Fundraising Gifts",
    collectionMethod: "Calculated from linked donor gift transactions before and during the reporting period.",
    collectionFrequency: "Ongoing",
    reportingFrequency: "Quarterly"
  }),
  defaultMetric({
    metricKey: "financial.monthly-donors",
    name: "Monthly Donors",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Unique donors with at least one gift during the reporting period marked as a monthly recurring gift.",
    calculationMode: "Automatic",
    sourceKey: "financialMonthlyDonors",
    dataSource: "Fundraising Gifts",
    collectionMethod: "Calculated from linked gift transactions marked Recurring with a Monthly frequency.",
    collectionFrequency: "Ongoing",
    reportingFrequency: "Quarterly"
  }),
  defaultMetric({
    metricKey: "financial.average-gift-size",
    name: "Average Gift Size",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Individual gift revenue divided by the number of individual gift transactions received during the reporting period.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialAverageGiftSize",
    dataSource: "Fundraising Gifts",
    collectionMethod: "Calculated from Individual Gift transactions recorded during the reporting period.",
    collectionFrequency: "Ongoing",
    reportingFrequency: "Quarterly"
  }),
  defaultMetric({
    metricKey: "financial.workbook-sales",
    name: "Workbook Sales",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Recognized workbook sales revenue for the reporting period.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialWorkbookSales",
    dataSource: "Fundraising Financial Activity",
    collectionMethod: "Calculated from dated Financial Activity entries categorized as Workbook Sale.",
    collectionFrequency: "Ongoing",
    baselineYear: 2025,
    baselineValue: 181,
    annualTargetValue: 600,
    threeYearTargetValue: 2000,
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "financial.toolkit-sales",
    name: "Toolkit Sales",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Recognized toolkit sales revenue for the reporting period.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialToolkitSales",
    dataSource: "Fundraising Financial Activity",
    collectionMethod: "Calculated from dated Financial Activity entries categorized as Toolkit Sale.",
    collectionFrequency: "Ongoing",
    baselineYear: 2025,
    baselineValue: 0,
    annualTargetValue: 1000,
    threeYearTargetValue: 3000,
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "financial.merchandise-sales",
    name: "Merchandise Sales",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Recognized merchandise sales revenue for the reporting period.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialMerchandiseSales",
    dataSource: "Fundraising Financial Activity",
    collectionMethod: "Calculated from dated Financial Activity entries categorized as Merchandise Sale.",
    collectionFrequency: "Ongoing",
    baselineYear: 2025,
    baselineValue: 0,
    annualTargetValue: 800,
    threeYearTargetValue: 2000,
    reportingFrequency: "Monthly"
  }),
  defaultMetric({
    metricKey: "financial.grant-concentration",
    name: "Grant Concentration",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Percentage of total recognized revenue derived from grants during the reporting period.",
    logicModelOutcome: "A diversified and sustainable revenue base",
    calculationNotes: "Grant Revenue divided by Total Revenue for the same reporting period. Revenue Mix on the Dashboard shows all source percentages together.",
    unit: "Percentage",
    calculationMode: "Automatic",
    sourceKey: "financialGrantConcentration",
    dataSource: "Grant Revenue and Total Revenue",
    collectionMethod: "Calculated from dated Grant Revenue and automatically combined Total Revenue values.",
    reportingFrequency: "Quarterly",
    performanceDirection: "Lower is better"
  }),
  defaultMetric({
    metricKey: "financial.budget-variance",
    name: "Budget-to-Actual Variance",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Difference between budgeted and actual revenue and expenses for the reporting period.",
    logicModelOutcome: "Responsible financial management",
    calculationNotes: "The approved budget source, sign convention, and acceptable variance range have not been configured.",
    unit: "Dollars",
    calculationMode: "Not Configured",
    dataSource: "Budget and accounting records",
    collectionMethod: "Compared from approved budget and actual accounting reports.",
    reportingFrequency: "Monthly",
    performanceDirection: "No target status"
  }),
  defaultMetric({
    metricKey: "financial.operating-reserves-months",
    name: "Months of Operating Reserves",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Available unrestricted operating reserves divided by average monthly operating expenses.",
    logicModelOutcome: "Stable organizational operating capacity",
    calculationNotes: "The unrestricted-reserve and operating-expense account rules must be approved before activation.",
    unit: "Average",
    calculationMode: "Not Configured",
    dataSource: "Accounting records",
    collectionMethod: "Calculated from approved balance-sheet reserves and average monthly operating expenses.",
    reportingFrequency: "Quarterly"
  }),
  defaultMetric({
    metricKey: "financial.earned-income-received",
    name: "All Earned Income",
    programArea: "Financial",
    category: "Financial KPI",
    definition: "Approved HRSN billing amounts and other earned income recognized during the reporting period.",
    unit: "Dollars",
    calculationMode: "Automatic",
    sourceKey: "financialEarnedIncomeReceived",
    dataSource: "HRSN Billing and Fundraising Financial Activity",
    reportingFrequency: "Monthly"
  })
]);

function dateOnly(value) {
  const match = cleanString(value).match(/^\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : "";
}

function validDateRange(startDate, endDate) {
  return /^\d{4}-\d{2}-\d{2}$/.test(startDate)
    && /^\d{4}-\d{2}-\d{2}$/.test(endDate)
    && startDate <= endDate;
}

function performanceMeasurementId(payload = {}) {
  return `${cleanString(payload.metricKey)}--${cleanString(payload.periodStart)}--${cleanString(payload.periodEnd)}`;
}

function inDateRange(value, startDate, endDate) {
  const date = dateOnly(value);
  return Boolean(date && date >= startDate && date <= endDate);
}

function dateDistanceDays(startDate, endDate) {
  if (!validDateRange(startDate, endDate)) return null;
  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  return Math.round((end - start) / 86400000);
}

function previousOperationsPeriod(startDate, endDate) {
  if (validDateRange(startDate, endDate)) {
    const start = new Date(`${startDate}T00:00:00Z`);
    const startMonth = start.getUTCMonth();
    const expectedQuarterEnd = new Date(Date.UTC(start.getUTCFullYear(), startMonth + 3, 0)).toISOString().slice(0, 10);
    if (start.getUTCDate() === 1 && startMonth % 3 === 0 && endDate === expectedQuarterEnd) {
      return {
        startDate: new Date(Date.UTC(start.getUTCFullYear(), startMonth - 3, 1)).toISOString().slice(0, 10),
        endDate: new Date(Date.UTC(start.getUTCFullYear(), startMonth, 0)).toISOString().slice(0, 10)
      };
    }
  }
  const days = dateDistanceDays(startDate, endDate);
  if (days === null) return { startDate, endDate };
  const previousEnd = new Date(`${startDate}T00:00:00Z`);
  previousEnd.setUTCDate(previousEnd.getUTCDate() - 1);
  const previousStart = new Date(previousEnd);
  previousStart.setUTCDate(previousStart.getUTCDate() - days);
  return {
    startDate: previousStart.toISOString().slice(0, 10),
    endDate: previousEnd.toISOString().slice(0, 10)
  };
}

function normalizedStatus(value) {
  return cleanString(value).toLowerCase().replace(/[\s-]+/g, "");
}

function numericValue(value) {
  return cleanOptionalNumber(value) ?? 0;
}

function average(values) {
  const usable = values.filter((value) => Number.isFinite(value));
  if (!usable.length) return null;
  return Math.round((usable.reduce((sum, value) => sum + value, 0) / usable.length) * 10) / 10;
}

function registrationParticipantKeys(registration) {
  const clientIds = Array.isArray(registration.clientIds) ? registration.clientIds.filter(Boolean) : [];
  if (clientIds.length) return clientIds.map((id) => `client:${id}`);
  const names = Array.isArray(registration.clientNames) ? registration.clientNames.filter(Boolean) : [];
  if (names.length) return names.map((name) => `name:${cleanString(name).toLowerCase()}`);
  const seats = Math.max(1, Number(registration.attendeeCount) || 1);
  return Array.from({ length: seats }, (_value, index) => `unknown:${registration.id}:${index}`);
}

function appointmentParticipantKeys(appointment) {
  const clientIds = Array.isArray(appointment.clientIds) ? appointment.clientIds.filter(Boolean) : [];
  if (clientIds.length) return clientIds.map((id) => `client:${id}`);
  const names = Array.isArray(appointment.clientNames) ? appointment.clientNames.filter(Boolean) : [];
  if (names.length) return names.map((name) => `name:${cleanString(name).toLowerCase()}`);
  const clientName = cleanString(appointment.clientName);
  return clientName ? [`name:${clientName.toLowerCase()}`] : [`unknown:${appointment.id}`];
}

function appointmentGoalResults(appointment) {
  const participantResults = (Array.isArray(appointment.participantGoals) ? appointment.participantGoals : [])
    .map((entry) => normalizedStatus(entry.goalResult))
    .filter((result) => ["achieved", "partlyachieved", "notachieved"].includes(result));
  if (participantResults.length) return participantResults;

  const legacyResult = normalizedStatus(appointment.goalResult);
  return ["achieved", "partlyachieved", "notachieved"].includes(legacyResult) ? [legacyResult] : [];
}

function appointmentHasParticipantGoalCoverage(appointment) {
  const participantKeys = appointmentParticipantKeys(appointment);
  const participantGoals = Array.isArray(appointment.participantGoals) ? appointment.participantGoals : [];
  const allowedResults = new Set(["achieved", "partlyachieved", "notachieved", "notassessed"]);
  if (participantKeys.length === 1 && !participantGoals.length) {
    return allowedResults.has(normalizedStatus(appointment.goalResult));
  }
  const resultKeys = new Set(participantGoals
    .filter((entry) => allowedResults.has(normalizedStatus(entry.goalResult)))
    .map((entry) => cleanString(entry.clientId)
      ? `client:${cleanString(entry.clientId)}`
      : `name:${cleanString(entry.clientName).toLowerCase()}`));
  return participantKeys.every((key) => resultKeys.has(key));
}

function normalizedSearchText(...values) {
  return values
    .map(cleanString)
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isEnrollmentAppointment(appointment) {
  const value = normalizedSearchText(
    appointment.appointmentType,
    appointment.publicBookingServiceLabel
  );
  return /\benrollment\b|\binscripcion\b/.test(value);
}

function isNutritionEducationAppointment(appointment) {
  const value = normalizedSearchText(
    appointment.appointmentType,
    appointment.publicBookingServiceLabel
  );
  return /nutrition education|educacion nutricional/.test(value) || Boolean(cleanString(appointment.lesson));
}

function isFinalHealthyHabitsAppointment(appointment) {
  if (!isNutritionEducationAppointment(appointment)) return false;
  const lesson = normalizedSearchText(appointment.lesson);
  return lesson === "7" || lesson.includes("healthy habits");
}

function earnedIncomeActivityType(item) {
  const explicit = cleanString(item.activityType);
  if (explicit) return explicit;
  const value = normalizedSearchText(item.name, item.source, item.serviceType, item.useOfFunds, item.payerName);
  if (value.includes("grant")) return "Grant Revenue";
  if (value.includes("hrsn") || value.includes("health-related social needs") || value.includes("health related social needs")) {
    return "HRSN Revenue";
  }
  if (value.includes("workbook")) return "Workbook Sale";
  if (value.includes("toolkit")) return "Toolkit Sale";
  if (value.includes("merch")) return "Merchandise Sale";
  return "Other Income";
}

function earnedIncomeHasType(item, activityType) {
  return normalizedStatus(earnedIncomeActivityType(item)) === normalizedStatus(activityType);
}

function fundraisingGiftDonorKey(gift) {
  const donorId = cleanString(gift.donorId);
  if (donorId) return `donor:${donorId}`;
  const donorName = cleanString(gift.donorName).toLowerCase();
  return donorName ? `name:${donorName}` : "";
}

function operationsAutomaticValues(data, startDate, endDate) {
  const allAppointments = data.appointments || [];
  const clinicKnowledgeGain = clinicKnowledgeGainForPeriod(
    data.evaluationResponses || [],
    data.evaluationQuestions || clinicKnowledgeQuestionDefinitions,
    startDate,
    endDate
  );
  const clinicHealthChange = clinicHealthChangeForPeriod(
    data.evaluationResponses || [],
    data.evaluationQuestions || clinicHealthQuestionDefinitions,
    data.clients || [],
    startDate,
    endDate
  );
  const clinicFeedbackSummary = clinicFeedbackSummaryForPeriod(
    data.evaluationResponses || [],
    data.evaluationQuestions || [],
    startDate,
    endDate
  );
  const appointmentRecords = (data.appointments || []).filter((item) => inDateRange(item.appointmentDate, startDate, endDate));
  const completedAppointments = appointmentRecords.filter((item) => normalizedStatus(item.status) === "completed");
  const completedEnrollmentAppointments = completedAppointments.filter(isEnrollmentAppointment);
  const assessedGoalResults = completedAppointments.flatMap(appointmentGoalResults);
  const achievedGoalResults = assessedGoalResults.filter((result) => result === "achieved");
  const partlyAchievedGoalResults = assessedGoalResults.filter((result) => result === "partlyachieved");
  const noShowAppointments = appointmentRecords.filter((item) => normalizedStatus(item.status) === "noshow");
  const noShowDenominator = completedAppointments.length + noShowAppointments.length;
  const referralRecords = (data.referrals || []).filter((item) => inDateRange(item.referralDate, startDate, endDate));
  const referralContactDays = referralRecords.map((item) => dateDistanceDays(item.referralDate, item.firstContactDate));
  const referralAppointmentDays = referralRecords.map((item) => dateDistanceDays(item.referralDate, item.firstAppointmentDate));
  const graduateKeys = new Set();
  completedAppointments.filter(isFinalHealthyHabitsAppointment).forEach((appointment) => {
    appointmentParticipantKeys(appointment).forEach((key) => graduateKeys.add(key));
  });
  (data.clients || []).filter((item) => inDateRange(item.graduationDate, startDate, endDate)).forEach((client) => {
    graduateKeys.add(`client:${client.id}`);
  });
  const sessionRecords = (data.programSessions || []).filter((item) => inDateRange(item.sessionDate, startDate, endDate));
  const completedSchoolSessions = sessionRecords.filter((item) => item.program === "School" && normalizedStatus(item.status) === "completed");
  const completedKitchenSessions = sessionRecords.filter((item) => item.program === "Kitchen" && normalizedStatus(item.status) === "completed");
  const completedKitchenIds = new Set(completedKitchenSessions.map((item) => item.id));
  const kitchenRegistrations = (data.programRegistrations || []).filter((item) => completedKitchenIds.has(item.sessionId));
  const attendedRegistrations = kitchenRegistrations.filter((item) => normalizedStatus(item.status) === "attended");
  const absentRegistrations = kitchenRegistrations.filter((item) => normalizedStatus(item.status) === "absent");
  const attendedSeats = attendedRegistrations.reduce((sum, item) => sum + Math.max(1, Number(item.attendeeCount) || registrationParticipantKeys(item).length), 0);
  const absentSeats = absentRegistrations.reduce((sum, item) => sum + Math.max(1, Number(item.attendeeCount) || registrationParticipantKeys(item).length), 0);
  const participantAttendance = new Map();
  attendedRegistrations.forEach((registration) => {
    registrationParticipantKeys(registration).forEach((key) => participantAttendance.set(key, (participantAttendance.get(key) || 0) + 1));
  });
  const knownParticipants = participantAttendance.size;
  const repeatParticipants = [...participantAttendance.values()].filter((count) => count > 1).length;
  const completedOutreachEvents = (data.outreachEvents || []).filter((item) => (
    normalizedStatus(item.status) === "completed" && inDateRange(item.eventDate, startDate, endDate)
  ));
  const paidEarnedIncome = (data.earnedIncome || []).filter((item) => inDateRange(item.paymentDate, startDate, endDate));
  const approvedHrsnClaims = (data.hrsnClaims || []).filter((item) => (
    item.approved === true && inDateRange(item.approvalDate, startDate, endDate)
  ));
  const giftRecords = (data.fundraisingGifts || []).filter((item) => dateOnly(item.giftDate));
  const periodGifts = giftRecords.filter((item) => inDateRange(item.giftDate, startDate, endDate));
  const earliestGiftByDonor = new Map();
  giftRecords.forEach((gift) => {
    const donorKey = fundraisingGiftDonorKey(gift);
    const giftDate = dateOnly(gift.giftDate);
    if (!donorKey || !giftDate) return;
    const current = earliestGiftByDonor.get(donorKey);
    if (!current || giftDate < current) earliestGiftByDonor.set(donorKey, giftDate);
  });
  const periodDonors = new Set(periodGifts.map(fundraisingGiftDonorKey).filter(Boolean));
  const priorDonors = new Set(giftRecords
    .filter((gift) => dateOnly(gift.giftDate) < startDate)
    .map(fundraisingGiftDonorKey)
    .filter(Boolean));
  const monthlyDonors = new Set(periodGifts
    .filter((gift) => gift.recurring === true && normalizedStatus(gift.recurringFrequency) === "monthly")
    .map(fundraisingGiftDonorKey)
    .filter(Boolean));
  const individualGiftAmounts = periodGifts
    .filter((gift) => ["individual", "individualgift"].includes(normalizedStatus(gift.giftType)))
    .map((gift) => cleanOptionalNumber(gift.amount))
    .filter((amount) => amount !== null);
  const monetaryGifts = periodGifts.filter((gift) => !normalizedStatus(gift.giftType).includes("inkind"));
  const giftRevenue = monetaryGifts.reduce((sum, gift) => sum + numericValue(gift.amount), 0);
  const individualGiving = individualGiftAmounts.reduce((sum, amount) => sum + amount, 0);
  const sponsorshipRevenue = periodGifts
    .filter((gift) => normalizedStatus(gift.giftType).includes("sponsor"))
    .reduce((sum, gift) => sum + numericValue(gift.amount), 0);
  const eventRevenue = periodGifts
    .filter((gift) => normalizedStatus(gift.giftType).includes("event"))
    .reduce((sum, gift) => sum + numericValue(gift.amount), 0);
  const schoolStudentsReached = completedSchoolSessions.reduce((sum, item) => sum + numericValue(item.participantCount), 0);
  const directParticipantKeys = new Set();
  completedAppointments.forEach((appointment) => {
    appointmentParticipantKeys(appointment).forEach((key) => directParticipantKeys.add(key));
  });
  attendedRegistrations.forEach((registration) => {
    registrationParticipantKeys(registration).forEach((key) => directParticipantKeys.add(key));
  });
  const knownDirectClientIds = new Set([...directParticipantKeys]
    .filter((key) => key.startsWith("client:"))
    .map((key) => key.slice(7)));
  const clientsById = new Map((data.clients || []).map((client) => [client.id, client]));
  const priorityParticipantCount = [...knownDirectClientIds].filter((clientId) => {
    const client = clientsById.get(clientId);
    return client && (client.ycco === true || client.hrsn === true || normalizedSearchText(client.preferredLanguage).includes("spanish"));
  }).length;
  const enrollmentKeys = new Set();
  completedEnrollmentAppointments.forEach((appointment) => {
    appointmentParticipantKeys(appointment).forEach((key) => enrollmentKeys.add(key));
  });
  const eligibleRetentionEnrollments = new Map();
  completedEnrollmentAppointments.forEach((appointment) => {
    if (dateDistanceDays(appointment.appointmentDate, endDate) < 60) return;
    appointmentParticipantKeys(appointment).forEach((key) => {
      const existingDate = eligibleRetentionEnrollments.get(key);
      if (!existingDate || appointment.appointmentDate < existingDate) {
        eligibleRetentionEnrollments.set(key, appointment.appointmentDate);
      }
    });
  });
  const retainedParticipants = new Set();
  allAppointments
    .filter((appointment) => normalizedStatus(appointment.status) === "completed" && isNutritionEducationAppointment(appointment))
    .forEach((appointment) => {
      appointmentParticipantKeys(appointment).forEach((key) => {
        const enrollmentDate = eligibleRetentionEnrollments.get(key);
        if (enrollmentDate && appointment.appointmentDate > enrollmentDate && appointment.appointmentDate <= endDate) {
          retainedParticipants.add(key);
        }
      });
    });
  const selectedYear = endDate.slice(0, 4);
  const yearStartDate = `${selectedYear}-01-01`;
  const calendarYearEnrollments = new Set();
  const calendarYearGraduates = new Set();
  allAppointments
    .filter((appointment) => normalizedStatus(appointment.status) === "completed" && inDateRange(appointment.appointmentDate, yearStartDate, endDate))
    .forEach((appointment) => {
      if (isEnrollmentAppointment(appointment)) {
        appointmentParticipantKeys(appointment).forEach((key) => calendarYearEnrollments.add(key));
      }
      if (isFinalHealthyHabitsAppointment(appointment)) {
        appointmentParticipantKeys(appointment).forEach((key) => calendarYearGraduates.add(key));
      }
    });
  (data.clients || []).filter((client) => inDateRange(client.graduationDate, yearStartDate, endDate)).forEach((client) => {
    calendarYearGraduates.add(`client:${client.id}`);
  });
  const grantEarnedIncome = paidEarnedIncome.filter((item) => earnedIncomeHasType(item, "Grant Revenue"));
  const otherEarnedIncome = paidEarnedIncome.filter((item) => (
    !earnedIncomeHasType(item, "Grant Revenue") && !earnedIncomeHasType(item, "HRSN Revenue")
  ));
  const grantRevenue = grantEarnedIncome.reduce((sum, item) => sum + numericValue(item.amountReceived), 0);
  const hrsnRevenue = approvedHrsnClaims.reduce((sum, item) => sum + numericValue(item.amount), 0);
  const otherEarnedIncomeRevenue = otherEarnedIncome.reduce((sum, item) => sum + numericValue(item.amountReceived), 0);
  const clinicProgramEngagements = completedAppointments.reduce((sum, appointment) => (
    sum + appointmentParticipantKeys(appointment).length
  ), 0);

  return {
    organizationEstimatedChildrenServed: directParticipantKeys.size + schoolStudentsReached,
    organizationProgramEngagements: clinicProgramEngagements + attendedSeats + schoolStudentsReached,
    organizationPriorityPopulationParticipation: knownDirectClientIds.size
      ? Math.round((priorityParticipantCount / knownDirectClientIds.size) * 1000) / 10
      : null,
    clinicChildrenEnrolled: enrollmentKeys.size,
    clinicAppointmentsDelivered: completedAppointments.length,
    clinicReferralsReceived: referralRecords.length,
    clinicReferralContactDays: average(referralContactDays),
    clinicReferralAppointmentDays: average(referralAppointmentDays),
    clinicNoShowRate: noShowDenominator ? Math.round((noShowAppointments.length / noShowDenominator) * 1000) / 10 : null,
    clinicRetentionRate: eligibleRetentionEnrollments.size
      ? Math.round((retainedParticipants.size / eligibleRetentionEnrollments.size) * 1000) / 10
      : null,
    clinicGraduates: graduateKeys.size,
    clinicGraduationRate: calendarYearEnrollments.size
      ? Math.round((calendarYearGraduates.size / calendarYearEnrollments.size) * 1000) / 10
      : null,
    clinicGoalAchievement: assessedGoalResults.length
      ? Math.round((achievedGoalResults.length / assessedGoalResults.length) * 1000) / 10
      : null,
    clinicGoalPartlyAchieved: assessedGoalResults.length
      ? Math.round((partlyAchievedGoalResults.length / assessedGoalResults.length) * 1000) / 10
      : null,
    clinicKnowledgeGain: clinicKnowledgeGain.value,
    clinicBehaviorChange: clinicHealthChange.behaviorChangeValue,
    clinicGuidelineImprovement: clinicHealthChange.guidelineImprovementValue,
    clinicParticipantSatisfaction: clinicFeedbackSummary.participantSatisfactionValue,
    schoolSchoolsReached: new Set(completedSchoolSessions.map((item) => cleanString(item.schoolName).toLowerCase()).filter(Boolean)).size,
    schoolClassesDelivered: completedSchoolSessions.length,
    schoolStudentsReached,
    cookingClassesDelivered: completedKitchenSessions.length,
    cookingParticipantsServed: knownParticipants,
    cookingTotalAttendance: attendedSeats,
    cookingAttendanceRate: attendedSeats + absentSeats ? Math.round((attendedSeats / (attendedSeats + absentSeats)) * 1000) / 10 : null,
    cookingAverageAttendance: completedKitchenSessions.length ? Math.round((attendedSeats / completedKitchenSessions.length) * 10) / 10 : null,
    cookingRepeatParticipation: knownParticipants ? Math.round((repeatParticipants / knownParticipants) * 1000) / 10 : null,
    communityEventsCompleted: completedOutreachEvents.length,
    communityFamiliesReached: completedOutreachEvents.reduce((sum, item) => sum + numericValue(item.interactionsCount), 0),
    communityEventParticipants: completedOutreachEvents.reduce((sum, item) => sum + numericValue(item.participantListCount), 0),
    communityReferralsGenerated: completedOutreachEvents.reduce((sum, item) => sum + numericValue(item.referralsCount), 0),
    financialGiftRevenue: Math.round(giftRevenue * 100) / 100,
    financialIndividualGiving: Math.round(individualGiving * 100) / 100,
    financialSponsorshipRevenue: Math.round(sponsorshipRevenue * 100) / 100,
    financialEventRevenue: Math.round(eventRevenue * 100) / 100,
    financialNewDonors: [...earliestGiftByDonor.values()].filter((giftDate) => inDateRange(giftDate, startDate, endDate)).length,
    financialRepeatDonors: [...periodDonors].filter((donorKey) => priorDonors.has(donorKey)).length,
    financialMonthlyDonors: monthlyDonors.size,
    financialAverageGiftSize: individualGiftAmounts.length
      ? Math.round((individualGiftAmounts.reduce((sum, amount) => sum + amount, 0) / individualGiftAmounts.length) * 100) / 100
      : null,
    financialGrantRevenue: Math.round(grantRevenue * 100) / 100,
    financialHrsnRevenue: Math.round(hrsnRevenue * 100) / 100,
    financialOtherEarnedIncome: Math.round(otherEarnedIncomeRevenue * 100) / 100,
    financialWorkbookSales: Math.round(paidEarnedIncome
      .filter((item) => earnedIncomeHasType(item, "Workbook Sale"))
      .reduce((sum, item) => sum + numericValue(item.amountReceived), 0) * 100) / 100,
    financialToolkitSales: Math.round(paidEarnedIncome
      .filter((item) => earnedIncomeHasType(item, "Toolkit Sale"))
      .reduce((sum, item) => sum + numericValue(item.amountReceived), 0) * 100) / 100,
    financialMerchandiseSales: Math.round(paidEarnedIncome
      .filter((item) => earnedIncomeHasType(item, "Merchandise Sale"))
      .reduce((sum, item) => sum + numericValue(item.amountReceived), 0) * 100) / 100,
    financialEarnedIncomeReceived: Math.round((hrsnRevenue + otherEarnedIncomeRevenue) * 100) / 100
  };
}

function mergeOperationsMetricDefinitions(savedMetrics = []) {
  const savedByKey = new Map(savedMetrics.map((item) => [item.metricKey || item.id, item]));
  const defaults = defaultOperationsMetricDefinitions.map((definition) => {
    const saved = savedByKey.get(definition.metricKey);
    if (!saved) return { ...definition };
    const savedVersion = Number(saved.definitionVersion || 0);
    if (savedVersion < definition.definitionVersion) {
      const migrated = {
        ...definition,
        baselineYear: saved.baselineYear,
        baselineValue: saved.baselineValue,
        annualTargetYear: saved.annualTargetYear ?? definition.annualTargetYear,
        annualTargetValue: saved.annualTargetValue,
        threeYearTargetYear: saved.threeYearTargetYear ?? definition.threeYearTargetYear,
        threeYearTargetValue: saved.threeYearTargetValue,
        responsibleStaffMember: cleanString(saved.responsibleStaffMember) || definition.responsibleStaffMember,
        targetHistory: Array.isArray(saved.targetHistory) ? saved.targetHistory : []
      };
      return migrated;
    }
    const merged = {
      ...definition,
      ...saved,
      metricKey: definition.metricKey,
      definitionVersion: definition.definitionVersion,
      targetHistory: Array.isArray(saved.targetHistory) ? saved.targetHistory : []
    };
    ["logicModelOutcome", "calculationNotes", "collectionMethod", "collectionFrequency"].forEach((key) => {
      if (!cleanString(saved[key])) merged[key] = definition[key];
    });
    return merged;
  });
  const defaultKeys = new Set(defaults.map((item) => item.metricKey));
  const custom = savedMetrics.filter((item) => {
    const metricKey = item.metricKey || item.id;
    return !defaultKeys.has(metricKey) && !retiredOperationsMetricKeys.has(metricKey);
  });
  return [...defaults, ...custom].filter((item) => item.active !== false);
}

function measurementForPeriod(measurements, metricKey, startDate, endDate) {
  return measurements
    .filter((item) => item.metricKey === metricKey && item.periodStart === startDate && item.periodEnd === endDate)
    .sort((first, second) => cleanString(second.updatedAt || second.createdAt).localeCompare(cleanString(first.updatedAt || first.createdAt)))[0] || null;
}

function measurementValueForRange(measurements, metric, startDate, endDate) {
  const insideRange = measurements.filter((item) => (
    item.metricKey === metric.metricKey
    && item.periodStart >= startDate
    && item.periodEnd <= endDate
  ));
  if (!insideRange.length) return null;
  if (["Count", "Dollars"].includes(metric.unit)) {
    return Math.round(insideRange.reduce((sum, item) => sum + numericValue(item.value), 0) * 100) / 100;
  }
  const exact = measurementForPeriod(measurements, metric.metricKey, startDate, endDate);
  if (exact) return exact.value;
  return insideRange
    .sort((first, second) => cleanString(second.periodEnd).localeCompare(cleanString(first.periodEnd)))[0]?.value ?? null;
}

function applyOperationsRevenueValues(values, measurements, definitions, startDate, endDate) {
  const result = { ...values };
  const grantMetric = definitions.find((metric) => metric.metricKey === "financial.grant-revenue");
  const legacyGrantRevenue = grantMetric ? measurementValueForRange(measurements, grantMetric, startDate, endDate) : null;
  const knownGrantRevenue = numericValue(result.financialGrantRevenue) + numericValue(legacyGrantRevenue);
  const totalRevenue = knownGrantRevenue
    + numericValue(result.financialGiftRevenue)
    + numericValue(result.financialHrsnRevenue)
    + numericValue(result.financialOtherEarnedIncome);
  result.financialGrantRevenue = Math.round(knownGrantRevenue * 100) / 100;
  result.financialTotalRevenue = Math.round(totalRevenue * 100) / 100;
  result.financialGrantConcentration = totalRevenue <= 0
    ? null
    : Math.round((knownGrantRevenue / totalRevenue) * 1000) / 10;
  return result;
}

function operationsAnnualPacingStatus(metric, value, endDate) {
  if (["Needs Definition", "Not Configured"].includes(metric.calculationMode)) return metric.calculationMode;
  if (value === null || value === undefined) return "No Data";
  if (metric.annualTargetValue === null || metric.annualTargetValue === undefined || metric.performanceDirection === "No target status") {
    return "No Target";
  }
  const targetYear = Number(metric.annualTargetYear);
  if (Number(endDate.slice(0, 4)) !== targetYear) return "Outside Target Year";
  const fixedThreshold = ["Percentage", "Days", "Average", "Score"].includes(metric.unit);
  const yearStart = `${targetYear}-01-01`;
  const yearEnd = `${targetYear}-12-31`;
  const elapsedDays = dateDistanceDays(yearStart, endDate) + 1;
  const yearDays = dateDistanceDays(yearStart, yearEnd) + 1;
  const pacingTarget = fixedThreshold ? Number(metric.annualTargetValue) : Number(metric.annualTargetValue) * (elapsedDays / yearDays);
  if (!Number.isFinite(pacingTarget) || pacingTarget <= 0) return "No Target";
  const ratio = metric.performanceDirection === "Lower is better"
    ? pacingTarget / Number(value)
    : Number(value) / pacingTarget;
  if (ratio >= 1.05) return "Ahead of Target";
  if (ratio >= 0.9) return "On Target";
  return "Behind Target";
}

function operationsTargetStatus(metric, value, startDate, endDate) {
  if (metric.calculationMode === "Needs Definition" || metric.calculationMode === "Not Configured") return metric.calculationMode;
  if (value === null || value === undefined) return "No Data";
  if (metric.annualTargetValue === null || metric.annualTargetValue === undefined || metric.performanceDirection === "No target status") {
    return "No Target";
  }
  const targetYear = Number(metric.annualTargetYear);
  if (Number(startDate.slice(0, 4)) !== targetYear || Number(endDate.slice(0, 4)) !== targetYear) return "Outside Target Year";
  const comparable = ["Percentage", "Days", "Average", "Score"].includes(metric.unit)
    || (startDate === `${targetYear}-01-01` && endDate === `${targetYear}-12-31`);
  if (!comparable) return "In Progress";
  const meetsTarget = metric.performanceDirection === "Lower is better"
    ? value <= metric.annualTargetValue
    : value >= metric.annualTargetValue;
  return meetsTarget ? "On Track" : "Below Target";
}

function operationsMetricResults(
  definitions,
  measurements,
  automaticValues,
  previousValues,
  startDate,
  endDate,
  previousPeriod,
  ytdValues = automaticValues,
  ytdStartDate = `${endDate.slice(0, 4)}-01-01`,
  annualPacingDate = endDate
) {
  return definitions.map((metric) => {
    const manual = measurementForPeriod(measurements, metric.metricKey, startDate, endDate);
    const currentValue = metric.calculationMode === "Automatic"
      ? automaticValues[metric.sourceKey] ?? null
      : metric.calculationMode === "Manual"
        ? measurementValueForRange(measurements, metric, startDate, endDate)
        : null;
    const previousValue = metric.calculationMode === "Automatic"
      ? previousValues[metric.sourceKey] ?? null
      : metric.calculationMode === "Manual"
        ? measurementValueForRange(measurements, metric, previousPeriod.startDate, previousPeriod.endDate)
        : null;
    const ytdValue = metric.calculationMode === "Automatic"
      ? ytdValues[metric.sourceKey] ?? null
      : metric.calculationMode === "Manual"
        ? measurementValueForRange(measurements, metric, ytdStartDate, endDate)
        : null;
    return {
      ...metric,
      currentValue,
      previousValue,
      ytdValue,
      ytdStartDate,
      annualPacingDate,
      measurementId: manual?.id || "",
      measurementNote: manual?.note || "",
      targetStatus: operationsTargetStatus(metric, currentValue, startDate, endDate),
      annualPacingStatus: operationsAnnualPacingStatus(metric, ytdValue, annualPacingDate)
    };
  });
}

function operationsCurrentDateKey(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

function operationsDataQuality(data, metrics, startDate, endDate) {
  const coreMetrics = metrics.filter((item) => item.trackingTier !== "Future");
  const referralRecords = (data.referrals || []).filter((item) => inDateRange(item.referralDate || item.createdAt, startDate, endDate));
  const appointmentRecords = (data.appointments || []).filter((item) => inDateRange(item.appointmentDate, startDate, endDate));
  const completedClinicAppointments = appointmentRecords.filter((item) => normalizedStatus(item.status) === "completed");
  const completedSchoolSessions = (data.programSessions || []).filter((item) => item.program === "School" && normalizedStatus(item.status) === "completed" && inDateRange(item.sessionDate, startDate, endDate));
  const completedKitchenIds = new Set((data.programSessions || [])
    .filter((item) => item.program === "Kitchen" && normalizedStatus(item.status) === "completed" && inDateRange(item.sessionDate, startDate, endDate))
    .map((item) => item.id));
  const kitchenRegistrations = (data.programRegistrations || []).filter((item) => completedKitchenIds.has(item.sessionId));
  const paidRecords = (data.earnedIncome || []).filter((item) => inDateRange(item.paymentDate || item.periodEnd, startDate, endDate));
  const approvedHrsnRecords = (data.hrsnClaims || []).filter((item) => (
    item.approved === true
    && (inDateRange(item.approvalDate, startDate, endDate) || (!dateOnly(item.approvalDate) && inDateRange(item.serviceDate, startDate, endDate)))
  ));
  const issues = [
    {
      area: "Clinic Referrals",
      issueCount: referralRecords.filter((item) => !dateOnly(item.referralDate)).length,
      recordCount: referralRecords.length,
      detail: "Referral Date is required for referral volume and wait-time measures."
    },
    {
      area: "Referral Follow-Up",
      issueCount: referralRecords.filter((item) => !dateOnly(item.firstContactDate) || !dateOnly(item.firstAppointmentDate)).length,
      recordCount: referralRecords.length,
      detail: "First Contact and First Appointment dates support referral timing measures."
    },
    {
      area: "Clinic Appointments",
      issueCount: appointmentRecords.filter((item) => normalizedStatus(item.status) !== "blocked" && !(item.clientIds?.length || item.clientId)).length,
      recordCount: appointmentRecords.length,
      detail: "Non-block appointments should link to at least one CRM client."
    },
    {
      area: "Clinic Goal Results",
      issueCount: completedClinicAppointments.filter((item) => !appointmentHasParticipantGoalCoverage(item)).length,
      recordCount: completedClinicAppointments.length,
      detail: "Completed Clinic appointments need one Goal Result per child."
    },
    {
      area: "School Classes",
      issueCount: completedSchoolSessions.filter((item) => !cleanString(item.schoolName) || cleanOptionalNumber(item.participantCount) === null).length,
      recordCount: completedSchoolSessions.length,
      detail: "Completed School classes need a School and Participant Count."
    },
    {
      area: "Cooking Attendance",
      issueCount: kitchenRegistrations.filter((item) => !registrationParticipantKeys(item).some((key) => !key.startsWith("unknown:"))).length,
      recordCount: kitchenRegistrations.length,
      detail: "A linked child or child name is needed for unduplicated participation."
    },
    {
      area: "Earned Income",
      issueCount: paidRecords.filter((item) => !dateOnly(item.paymentDate) || cleanOptionalNumber(item.amountReceived) === null).length,
      recordCount: paidRecords.length,
      detail: "Payment Date and Amount Received are required for received income."
    },
    {
      area: "HRSN Billing",
      issueCount: approvedHrsnRecords.filter((item) => !dateOnly(item.approvalDate) || cleanOptionalNumber(item.amount) === null).length,
      recordCount: approvedHrsnRecords.length,
      detail: "Approved HRSN billing records need an Approval Date and Dollar Amount."
    },
    {
      area: "Metric Definitions",
      issueCount: coreMetrics.filter((item) => ["Needs Definition", "Not Configured"].includes(item.calculationMode)).length,
      recordCount: coreMetrics.length,
      detail: "Core measures waiting for an approved definition or collection method."
    },
    {
      area: "Manual Values",
      issueCount: coreMetrics.filter((item) => item.calculationMode === "Manual" && item.currentValue === null).length,
      recordCount: coreMetrics.filter((item) => item.calculationMode === "Manual").length,
      detail: "Core manual measures need a dated value inside the selected reporting period."
    }
  ];
  return issues.map((item) => ({
    ...item,
    status: item.issueCount === 0 ? "Ready" : item.recordCount && item.issueCount < item.recordCount ? "Review" : "Needs Attention"
  }));
}

function defaultOperationsPeriod(now = new Date()) {
  const year = now.getFullYear();
  const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
  const dateKey = (date) => [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
  return {
    startDate: dateKey(new Date(year, quarterStartMonth, 1)),
    endDate: dateKey(new Date(year, quarterStartMonth + 3, 0))
  };
}

async function loadEvaluationDefinitions() {
  const [instrumentDocuments, questionDocuments] = await Promise.all([
    fetchAllDocuments(performanceEvaluationInstruments),
    fetchAllDocuments(performanceEvaluationQuestions)
  ]);
  return {
    instruments: mergeClinicEvaluationInstruments(instrumentDocuments.map(toPerformanceEvaluationInstrument)),
    questions: mergeClinicEvaluationQuestions(questionDocuments.map(toPerformanceEvaluationQuestion))
  };
}

function evaluationResponseWithScore(item, questions = []) {
  const result = clinicEvaluationResponseScore(item, questions);
  if (!result) return item;
  return {
    ...item,
    ...result
  };
}

function evaluationResponseValidationError(payload, instrument, questions = []) {
  if (!instrument) return "Choose an existing evaluation instrument version.";
  if (!instrument.administrationPoints.includes(payload.administrationPoint)) {
    return "Choose an administration point supported by this instrument.";
  }
  const clinicValidationError = clinicEvaluationResponseValidationError(payload, instrument, questions);
  if (clinicEvaluationResponseScore(payload, questions)) return clinicValidationError;
  if (payload.status !== "Complete") return "";
  const answersByQuestion = new Map((payload.answers || []).map((answer) => [answer.questionId, answer.value]));
  const requiredQuestions = questions.filter((question) => (
    question.instrumentId === instrument.id
    && question.recordStatus === "Active"
    && question.required
  ));
  const missingCount = requiredQuestions.filter((question) => {
    const answer = answersByQuestion.get(question.id);
    return answer === undefined
      || answer === null
      || answer === ""
      || (Array.isArray(answer) && answer.length === 0);
  }).length;
  return missingCount ? `Answer all required questions before completing this assessment (${missingCount} remaining).` : "";
}

function duplicateEvaluationResponse(responses = [], payload = {}, excludedResponseId = "") {
  return responses.find((item) => (
    item.id !== excludedResponseId
    && item.instrumentId === payload.instrumentId
    && item.clientId === payload.clientId
    && item.administrationPoint === payload.administrationPoint
  )) || null;
}

function enrollmentProfileUpdates(payload = {}, instrument = {}, questions = []) {
  if (payload.status !== "Complete" || instrument.formType !== "Enrollment") return {};
  const allowedFields = new Set([
    "dateOfBirth",
    "email",
    "gender",
    "parentName",
    "phone",
    "preferredContactMethod",
    "preferredLanguage",
    "referralSource",
    "ycco",
    "yccoId"
  ]);
  const answersByQuestion = new Map((payload.answers || []).map((answer) => [answer.questionId, answer.value]));
  const updates = {};
  questions
    .filter((question) => question.instrumentId === instrument.id && allowedFields.has(question.profileField))
    .forEach((question) => {
      const value = answersByQuestion.get(question.id);
      if (value === undefined || value === null || value === "" || Array.isArray(value)) return;
      if (question.profileField === "ycco") {
        if (value === "Yes") updates.ycco = true;
        if (value === "No") updates.ycco = false;
        return;
      }
      updates[question.profileField] = value;
    });
  return updates;
}

async function syncEnrollmentProfile(payload, instrument, questions, userEmail) {
  const updates = enrollmentProfileUpdates(payload, instrument, questions);
  if (!Object.keys(updates).length) return;
  await clients.doc(payload.clientId).set({
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedBy: userEmail
  }, { merge: true });
}

async function loadOperationsSourceData() {
  const [
    appointmentDocuments,
    clientDocuments,
    referralDocuments,
    outreachEventDocuments,
    sessionDocuments,
    registrationDocuments,
    earnedIncomeDocuments,
    fundraisingGiftDocuments,
    hrsnClaimDocuments
  ] = await Promise.all([
    fetchAllDocuments(appointments),
    fetchAllDocuments(clients),
    fetchAllDocuments(referrals),
    fetchAllDocuments(outreachEvents),
    fetchAllDocuments(programSessions),
    fetchAllDocuments(programRegistrations),
    fetchAllDocuments(earnedIncome),
    fetchAllDocuments(fundraisingGifts),
    fetchAllDocuments(hrsnClaims)
  ]);
  return {
    appointments: appointmentDocuments.map(toAppointment),
    clients: clientDocuments.map(toClient),
    referrals: referralDocuments.map(toReferral),
    outreachEvents: outreachEventDocuments.map(toOutreachEvent),
    programSessions: sessionDocuments.map(toProgramSession),
    programRegistrations: registrationDocuments.map(toProgramRegistration),
    earnedIncome: earnedIncomeDocuments.map(toEarnedIncome),
    fundraisingGifts: fundraisingGiftDocuments.map(toFundraisingGift),
    hrsnClaims: hrsnClaimDocuments.map(toHrsnClaim)
  };
}

async function operationsReport(startDate, endDate) {
  const [
    sourceData,
    metricDocuments,
    measurementDocuments,
    evaluationQuestionDocuments,
    evaluationInstrumentDocuments,
    evaluationResponseDocuments
  ] = await Promise.all([
    loadOperationsSourceData(),
    fetchAllDocuments(performanceMetrics),
    fetchAllDocuments(performanceMeasurements),
    fetchAllDocuments(performanceEvaluationQuestions),
    fetchAllDocuments(performanceEvaluationInstruments),
    fetchAllDocuments(performanceEvaluationResponses)
  ]);
  const savedMetrics = metricDocuments.map(toPerformanceMetric);
  const measurements = measurementDocuments.map(toPerformanceMeasurement);
  const definitions = mergeOperationsMetricDefinitions(savedMetrics);
  const evaluationQuestions = mergeClinicEvaluationQuestions(
    evaluationQuestionDocuments.map(toPerformanceEvaluationQuestion)
  );
  const evaluationInstruments = mergeClinicEvaluationInstruments(
    evaluationInstrumentDocuments.map(toPerformanceEvaluationInstrument)
  );
  const evaluationResponses = evaluationResponseDocuments
    .map(toPerformanceEvaluationResponse)
    .map((item) => evaluationResponseWithScore(item, evaluationQuestions));
  const calculationSourceData = {
    ...sourceData,
    evaluationQuestions,
    evaluationResponses
  };
  const previousPeriod = previousOperationsPeriod(startDate, endDate);
  const ytdStartDate = `${endDate.slice(0, 4)}-01-01`;
  const annualPacingDate = [endDate, operationsCurrentDateKey()].sort()[0];
  const automaticValues = applyOperationsRevenueValues(
    operationsAutomaticValues(calculationSourceData, startDate, endDate),
    measurements,
    definitions,
    startDate,
    endDate
  );
  const previousValues = applyOperationsRevenueValues(
    operationsAutomaticValues(calculationSourceData, previousPeriod.startDate, previousPeriod.endDate),
    measurements,
    definitions,
    previousPeriod.startDate,
    previousPeriod.endDate
  );
  const ytdValues = applyOperationsRevenueValues(
    operationsAutomaticValues(calculationSourceData, ytdStartDate, endDate),
    measurements,
    definitions,
    ytdStartDate,
    endDate
  );
  const metrics = operationsMetricResults(
    definitions,
    measurements,
    automaticValues,
    previousValues,
    startDate,
    endDate,
    previousPeriod,
    ytdValues,
    ytdStartDate,
    annualPacingDate
  );
  return {
    programAreas: operationsProgramAreas,
    period: { startDate, endDate },
    previousPeriod,
    metrics,
    measurements,
    evaluationQuestions,
    evaluationInstruments,
    evaluationResponses,
    dataQuality: operationsDataQuality(sourceData, metrics, startDate, endDate)
  };
}

router.get("/api/operations", requireAuth, async (request, response, next) => {
  try {
    const fallback = defaultOperationsPeriod();
    const startDate = cleanString(request.query.startDate) || fallback.startDate;
    const endDate = cleanString(request.query.endDate) || fallback.endDate;
    if (!validDateRange(startDate, endDate)) {
      response.status(400).json({ error: "Choose a valid Operations reporting period." });
      return;
    }

    response.json(await operationsReport(startDate, endDate));
  } catch (error) {
    next(error);
  }
});

router.get("/api/operations/weekly-email-preview", requireAuth, async (request, response, next) => {
  try {
    const fallback = defaultOperationsPeriod();
    const startDate = cleanString(request.query.startDate) || fallback.startDate;
    const endDate = cleanString(request.query.endDate) || fallback.endDate;
    if (!validDateRange(startDate, endDate)) {
      response.status(400).json({ error: "Choose a valid Operations reporting period." });
      return;
    }
    const report = await operationsReport(startDate, endDate);
    response.json({ preview: weeklyPerformanceEmailPreview(report) });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/operations/metrics/:metricKey", requireAuth, async (request, response, next) => {
  try {
    const metricKey = cleanString(request.params.metricKey);
    const payload = cleanPerformanceMetricPayload(request.body);
    if (!metricKey || !payload.name || !operationsProgramAreas.includes(payload.programArea)) {
      response.status(400).json({ error: "Metric name and program area are required." });
      return;
    }

    const docRef = performanceMetrics.doc(metricKey);
    const snapshot = await docRef.get();
    const existing = snapshot.exists ? toPerformanceMetric(snapshot) : null;
    const defaultDefinition = defaultOperationsMetricDefinitions.find((metric) => metric.metricKey === metricKey);
    const now = new Date().toISOString();
    const targetChanged = existing && [
      "baselineYear",
      "baselineValue",
      "annualTargetYear",
      "annualTargetValue",
      "threeYearTargetYear",
      "threeYearTargetValue"
    ].some((key) => existing[key] !== payload[key]);
    const targetHistory = Array.isArray(existing?.targetHistory) ? [...existing.targetHistory] : [];
    if (targetChanged) {
      targetHistory.push({
        changedAt: now,
        changedBy: request.user.email,
        baselineYear: existing.baselineYear,
        baselineValue: existing.baselineValue,
        annualTargetYear: existing.annualTargetYear,
        annualTargetValue: existing.annualTargetValue,
        threeYearTargetYear: existing.threeYearTargetYear,
        threeYearTargetValue: existing.threeYearTargetValue
      });
    }

    await docRef.set({
      ...payload,
      definitionVersion: defaultDefinition?.definitionVersion ?? payload.definitionVersion ?? null,
      trackingTier: defaultDefinition?.trackingTier || existing?.trackingTier || payload.trackingTier || "Core",
      targetHistory,
      createdAt: existing?.createdAt || now,
      createdBy: existing?.createdBy || request.user.email,
      updatedAt: now,
      updatedBy: request.user.email
    });
    response.json({ metric: toPerformanceMetric(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.put("/api/operations/evaluation-questions/:questionId", requireAuth, async (request, response, next) => {
  try {
    const questionId = cleanString(request.params.questionId);
    const payload = cleanPerformanceEvaluationQuestionPayload(request.body);
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(questionId)) {
      response.status(400).json({ error: "Question ID may use letters, numbers, periods, dashes, and underscores." });
      return;
    }
    if (!payload.instrument || !payload.question) {
      response.status(400).json({ error: "Instrument and question text are required." });
      return;
    }

    const docRef = performanceEvaluationQuestions.doc(questionId);
    const snapshot = await docRef.get();
    const existing = snapshot.exists ? toPerformanceEvaluationQuestion(snapshot) : null;
    const now = new Date().toISOString();
    await docRef.set({
      ...payload,
      createdAt: existing?.createdAt || now,
      createdBy: existing?.createdBy || request.user.email,
      updatedAt: now,
      updatedBy: request.user.email
    });
    response.status(snapshot.exists ? 200 : 201).json({
      question: toPerformanceEvaluationQuestion(await docRef.get())
    });
  } catch (error) {
    next(error);
  }
});

router.put("/api/operations/evaluation-instruments/:instrumentId", requireAuth, async (request, response, next) => {
  try {
    const instrumentId = cleanString(request.params.instrumentId);
    const payload = cleanPerformanceEvaluationInstrumentPayload(request.body);
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(instrumentId)) {
      response.status(400).json({ error: "Instrument ID may use letters, numbers, periods, dashes, and underscores." });
      return;
    }
    if (!payload.name || !payload.version || !operationsProgramAreas.includes(payload.programArea)) {
      response.status(400).json({ error: "Instrument name, version, and program area are required." });
      return;
    }

    const docRef = performanceEvaluationInstruments.doc(instrumentId);
    const snapshot = await docRef.get();
    const existing = snapshot.exists ? toPerformanceEvaluationInstrument(snapshot) : null;
    const now = new Date().toISOString();
    await docRef.set({
      ...payload,
      createdAt: existing?.createdAt || now,
      createdBy: existing?.createdBy || request.user.email,
      updatedAt: now,
      updatedBy: request.user.email
    });
    response.status(snapshot.exists ? 200 : 201).json({
      instrument: toPerformanceEvaluationInstrument(await docRef.get())
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/evaluation-packets/:packetType/:clientId", requireAuth, async (request, response, next) => {
  try {
    const packetType = cleanString(request.params.packetType).toLowerCase();
    const clientId = cleanString(request.params.clientId);
    if (!new Set(["enrollment", "graduation"]).has(packetType) || !clientId) {
      response.status(400).json({ error: "A valid packet type and client are required." });
      return;
    }

    const [clientSnapshot, definitions, responseDocuments] = await Promise.all([
      clients.doc(clientId).get(),
      loadEvaluationDefinitions(),
      fetchAllDocuments(performanceEvaluationResponses.where("clientId", "==", clientId))
    ]);
    if (!clientSnapshot.exists) {
      response.status(404).json({ error: "The selected client could not be found." });
      return;
    }

    const instruments = definitions.instruments
      .filter((instrument) => instrument.status === "Active")
      .sort((first, second) => first.name.localeCompare(second.name) || first.version.localeCompare(second.version));
    const instrumentIds = new Set(instruments.map((instrument) => instrument.id));
    const questions = definitions.questions
      .filter((question) => instrumentIds.has(question.instrumentId))
      .sort((first, second) => Number(first.sortOrder || 0) - Number(second.sortOrder || 0));
    const responses = responseDocuments
      .map(toPerformanceEvaluationResponse)
      .map((item) => evaluationResponseWithScore(item, definitions.questions))
      .sort((first, second) => second.responseDate.localeCompare(first.responseDate));

    response.json({
      packetType,
      client: toClient(clientSnapshot),
      instruments,
      questions,
      responses
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/evaluation-instruments", requireAuth, async (request, response, next) => {
  try {
    const requestedStatus = cleanString(request.query.status) || "Active";
    const includeQuestions = cleanString(request.query.includeQuestions).toLowerCase() === "true";
    const definitions = await loadEvaluationDefinitions();
    const instruments = definitions.instruments
      .filter((instrument) => requestedStatus === "All" || instrument.status === requestedStatus)
      .sort((first, second) => first.name.localeCompare(second.name) || first.version.localeCompare(second.version));
    const instrumentIds = new Set(instruments.map((instrument) => instrument.id));
    response.json({
      instruments,
      ...(includeQuestions ? {
        questions: definitions.questions
          .filter((question) => instrumentIds.has(question.instrumentId))
          .sort((first, second) => Number(first.sortOrder || 0) - Number(second.sortOrder || 0))
      } : {})
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/evaluation-instruments/:instrumentId/questions", requireAuth, async (request, response, next) => {
  try {
    const instrumentId = cleanString(request.params.instrumentId);
    const definitions = await loadEvaluationDefinitions();
    const instrument = definitions.instruments.find((item) => item.id === instrumentId);
    if (!instrument) {
      response.status(404).json({ error: "Evaluation instrument was not found." });
      return;
    }
    const questions = definitions.questions
      .filter((question) => question.instrumentId === instrumentId)
      .sort((first, second) => Number(first.sortOrder || 0) - Number(second.sortOrder || 0));
    response.json({ instrument, questions });
  } catch (error) {
    next(error);
  }
});

router.get("/api/evaluation-responses", requireAuth, async (request, response, next) => {
  try {
    const filters = {
      clientId: cleanString(request.query.clientId),
      appointmentId: cleanString(request.query.appointmentId),
      instrumentId: cleanString(request.query.instrumentId)
    };
    const [documents, definitions] = await Promise.all([
      fetchAllDocuments(performanceEvaluationResponses),
      loadEvaluationDefinitions()
    ]);
    const responses = documents
      .map(toPerformanceEvaluationResponse)
      .filter((item) => Object.entries(filters).every(([key, value]) => !value || item[key] === value))
      .map((item) => evaluationResponseWithScore(item, definitions.questions))
      .sort((first, second) => second.responseDate.localeCompare(first.responseDate));
    response.json({ responses });
  } catch (error) {
    next(error);
  }
});

router.post("/api/evaluation-responses", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanPerformanceEvaluationResponsePayload(request.body);
    if (!payload.instrumentId || !payload.clientId || !payload.administrationPoint || !/^\d{4}-\d{2}-\d{2}$/.test(payload.responseDate)) {
      response.status(400).json({ error: "Instrument, client, administration point, and response date are required." });
      return;
    }
    const [definitions, responseDocuments] = await Promise.all([
      loadEvaluationDefinitions(),
      fetchAllDocuments(performanceEvaluationResponses)
    ]);
    const instrument = definitions.instruments.find((item) => item.id === payload.instrumentId);
    const validationError = evaluationResponseValidationError(payload, instrument, definitions.questions);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    const duplicate = duplicateEvaluationResponse(
      responseDocuments.map(toPerformanceEvaluationResponse),
      payload
    );
    if (duplicate) {
      response.status(409).json({ error: `This child already has a ${payload.administrationPoint} response for this instrument version.` });
      return;
    }
    const now = new Date().toISOString();
    const docRef = performanceEvaluationResponses.doc();
    await docRef.set({
      ...payload,
      instrumentName: instrument.name,
      instrumentVersion: instrument.version,
      instrumentEffectiveDate: instrument.effectiveDate,
      programArea: instrument.programArea,
      createdAt: now,
      createdBy: request.user.email,
      updatedAt: now,
      updatedBy: request.user.email
    });
    await syncEnrollmentProfile(payload, instrument, definitions.questions, request.user.email);
    await completeEnrollmentFormTasks(payload, instrument, request.user.email);
    response.status(201).json({
      response: evaluationResponseWithScore(
        toPerformanceEvaluationResponse(await docRef.get()),
        definitions.questions
      )
    });
  } catch (error) {
    next(error);
  }
});

router.put("/api/evaluation-responses/:responseId", requireAuth, async (request, response, next) => {
  try {
    const responseId = cleanString(request.params.responseId);
    const payload = cleanPerformanceEvaluationResponsePayload(request.body);
    if (!responseId || !payload.instrumentId || !payload.clientId || !payload.administrationPoint || !/^\d{4}-\d{2}-\d{2}$/.test(payload.responseDate)) {
      response.status(400).json({ error: "Instrument, client, administration point, and response date are required." });
      return;
    }
    const docRef = performanceEvaluationResponses.doc(responseId);
    const [snapshot, definitions, responseDocuments] = await Promise.all([
      docRef.get(),
      loadEvaluationDefinitions(),
      fetchAllDocuments(performanceEvaluationResponses)
    ]);
    if (!snapshot.exists) {
      response.status(404).json({ error: "Evaluation response was not found." });
      return;
    }
    const instrument = definitions.instruments.find((item) => item.id === payload.instrumentId);
    const validationError = evaluationResponseValidationError(payload, instrument, definitions.questions);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    const duplicate = duplicateEvaluationResponse(
      responseDocuments.map(toPerformanceEvaluationResponse),
      payload,
      responseId
    );
    if (duplicate) {
      response.status(409).json({ error: `This child already has a ${payload.administrationPoint} response for this instrument version.` });
      return;
    }
    const existing = toPerformanceEvaluationResponse(snapshot);
    const now = new Date().toISOString();
    await docRef.set({
      ...payload,
      instrumentName: instrument.name,
      instrumentVersion: instrument.version,
      instrumentEffectiveDate: instrument.effectiveDate,
      programArea: instrument.programArea,
      createdAt: existing.createdAt || now,
      createdBy: existing.createdBy || request.user.email,
      updatedAt: now,
      updatedBy: request.user.email
    });
    await syncEnrollmentProfile(payload, instrument, definitions.questions, request.user.email);
    await completeEnrollmentFormTasks(payload, instrument, request.user.email);
    response.json({
      response: evaluationResponseWithScore(
        toPerformanceEvaluationResponse(await docRef.get()),
        definitions.questions
      )
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/evaluation-responses/:responseId", requireAuth, async (request, response, next) => {
  try {
    const responseId = cleanString(request.params.responseId);
    const docRef = performanceEvaluationResponses.doc(responseId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Evaluation response was not found." });
      return;
    }
    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/api/operations/measurements", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanPerformanceMeasurementPayload(request.body);
    if (!payload.metricKey || !validDateRange(payload.periodStart, payload.periodEnd) || payload.value === null) {
      response.status(400).json({ error: "Metric, date, and value are required." });
      return;
    }
    const measurementId = performanceMeasurementId(payload);
    const docRef = performanceMeasurements.doc(measurementId);
    const snapshot = await docRef.get();
    const now = new Date().toISOString();
    await docRef.set({
      ...payload,
      createdAt: snapshot.data()?.createdAt || now,
      createdBy: snapshot.data()?.createdBy || request.user.email,
      updatedAt: now,
      updatedBy: request.user.email
    });
    response.status(snapshot.exists ? 200 : 201).json({ measurement: toPerformanceMeasurement(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.put("/api/operations/measurements/:measurementId", requireAuth, async (request, response, next) => {
  try {
    const measurementId = cleanString(request.params.measurementId);
    const payload = cleanPerformanceMeasurementPayload(request.body);
    if (!payload.metricKey || !validDateRange(payload.periodStart, payload.periodEnd) || payload.value === null) {
      response.status(400).json({ error: "Metric, date, and value are required." });
      return;
    }
    const docRef = performanceMeasurements.doc(measurementId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Performance value was not found." });
      return;
    }
    const nextMeasurementId = performanceMeasurementId(payload);
    const nextDocRef = performanceMeasurements.doc(nextMeasurementId);
    if (nextMeasurementId !== measurementId && (await nextDocRef.get()).exists) {
      response.status(409).json({ error: "A value is already logged for that measure and date." });
      return;
    }
    const existing = toPerformanceMeasurement(snapshot);
    const now = new Date().toISOString();
    const nextRecord = {
      ...payload,
      createdAt: existing.createdAt || now,
      createdBy: existing.createdBy || request.user.email,
      updatedAt: now,
      updatedBy: request.user.email
    };
    if (nextMeasurementId === measurementId) {
      await docRef.set(nextRecord);
    } else {
      const batch = firestore.batch();
      batch.set(nextDocRef, nextRecord);
      batch.delete(docRef);
      await batch.commit();
    }
    response.json({ measurement: toPerformanceMeasurement(await nextDocRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/operations/measurements/:measurementId", requireAuth, async (request, response, next) => {
  try {
    const measurementId = cleanString(request.params.measurementId);
    const docRef = performanceMeasurements.doc(measurementId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Performance value was not found." });
      return;
    }
    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

export {
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
  operationsProgramAreas,
  operationsTargetStatus,
  previousOperationsPeriod,
  validDateRange
};

export default router;
