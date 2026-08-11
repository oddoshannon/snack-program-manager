const requiredFixtureCoverage = Object.freeze([
  { collectionName: "clients", field: "status", values: ["Scheduled", "Active", "Needs Reschedule", "Waiting on Family", "Graduated"] },
  { collectionName: "referrals", field: "status", values: ["New", "Texted", "Scheduled", "Closed / No Further Outreach"] },
  { collectionName: "appointments", field: "status", values: ["Scheduled", "Completed", "No-show", "Canceled", "Blocked"] },
  { collectionName: "tasks", field: "status", values: ["Open", "Done"] },
  { collectionName: "programRegistrations", field: "status", values: ["Registered", "Waitlisted", "Attended", "Absent"] },
  { collectionName: "outreachContacts", field: "status", values: ["New", "Referral Created"] },
  { collectionName: "grants", field: "status", values: ["Planning", "Awarded"] },
  { collectionName: "marketingCampaigns", field: "status", values: ["Draft", "Scheduled", "Complete"] }
]);

const fullSystemFixtureCollectionNames = Object.freeze([
  "referrals",
  "clients",
  "appointments",
  "tasks",
  "activityLogs",
  "referralNetwork",
  "programSessions",
  "programRegistrations",
  "outreachEvents",
  "outreachContacts",
  "grants",
  "grantQuestions",
  "fundraisingDonors",
  "fundraisingCampaigns",
  "fundraisingGifts",
  "earnedIncome",
  "marketingCampaigns",
  "marketingSubscribers",
  "hrsnClaims",
  "budgetCategories",
  "performanceEvaluationQuestions",
  "performanceEvaluationInstruments",
  "performanceEvaluationResponses",
  "staffUsers",
  "adminSettings"
]);

function fullSystemFixtureCoverage(records = []) {
  const missing = [];
  requiredFixtureCoverage.forEach(({ collectionName, field, values }) => {
    const available = new Set(records
      .filter(([recordCollection]) => recordCollection === collectionName)
      .map(([, , data]) => data?.[field]));
    values.forEach((value) => {
      if (!available.has(value)) missing.push(`${collectionName}.${field}=${value}`);
    });
  });
  [
    "performanceEvaluationQuestions",
    "performanceEvaluationInstruments"
  ].forEach((collectionName) => {
    if (!records.some(([recordCollection]) => recordCollection === collectionName)) {
      missing.push(`${collectionName}=fixture required`);
    }
  });
  const knowledgeResponse = records.find(([recordCollection, , data]) => (
    recordCollection === "performanceEvaluationResponses"
      && data?.instrumentId === "clinic-knowledge-2026-2"
      && data?.administrationPoint === "Graduation"
      && data?.status === "Complete"
  ));
  const knowledgeAnswers = knowledgeResponse?.[2]?.answers;
  const completeRetrospectiveAnswers = Array.isArray(knowledgeAnswers)
    && knowledgeAnswers.length === 34
    && knowledgeAnswers.every((answer) => (
      ["Yes", "No"].includes(answer?.beforeValue)
        && ["Yes", "No"].includes(answer?.nowValue)
    ));
  if (!completeRetrospectiveAnswers) {
    missing.push("performanceEvaluationResponses=current retrospective Graduation fixture required");
  }
  return { ready: missing.length === 0, missing };
}

function assertFullSystemFixtureCoverage(records = []) {
  const coverage = fullSystemFixtureCoverage(records);
  if (!coverage.ready) {
    throw new Error(`Full-system fixtures are incomplete: ${coverage.missing.join(", ")}`);
  }
  return coverage;
}

export {
  assertFullSystemFixtureCoverage,
  fullSystemFixtureCollectionNames,
  fullSystemFixtureCoverage,
  requiredFixtureCoverage
};
