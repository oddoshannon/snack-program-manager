const activeKnowledgeInstrumentId = "clinic-knowledge-2026-2";
const legacyKnowledgeInstrumentId = "clinic-knowledge-2026-1";
const activeHealthInstrumentId = "clinic-health-2026-1";

const clinicLessonColors = Object.freeze({
  "Lesson 1": "#e23a4d",
  "Lesson 2": "#d27354",
  "Lesson 3": "#f4c753",
  "Lesson 4": "#078b4d",
  "Lesson 5": "#039cbb",
  "Lesson 6": "#004aad",
  "Lesson 7": "#7a33c2"
});

function cleanText(value) {
  return String(value ?? "").trim();
}

function roundedPercent(value) {
  return Math.round(value * 10) / 10;
}

function normalizedAnswer(value) {
  const normalized = cleanText(value).toLowerCase();
  if (normalized === "yes" || normalized === "1" || normalized === "true") return 1;
  if (normalized === "no" || normalized === "0" || normalized === "false") return 0;
  return null;
}

function clinicInstrumentKind(instrument = {}) {
  if (instrument.id === activeHealthInstrumentId || instrument.name === "Nutrition & Healthy Habits Questionnaire") return "health";
  if (instrument.id === activeKnowledgeInstrumentId) return "knowledge-retrospective";
  if (instrument.id === legacyKnowledgeInstrumentId || instrument.name === "Clinic Knowledge Assessment") return "knowledge-legacy";
  const formType = cleanText(instrument.formType).toLowerCase();
  if (formType === "enrollment") return "enrollment";
  if (formType === "hrsn screener") return "hrsn";
  if (formType === "child feedback") return "child-feedback";
  if (formType === "caregiver feedback") return "caregiver-feedback";
  return "other";
}

function clinicInstrumentForFormType(instruments = [], formType = "") {
  const normalized = cleanText(formType).toLowerCase();
  return instruments.find((instrument) => (
    instrument.status === "Active"
    && cleanText(instrument.formType).toLowerCase() === normalized
  )) || null;
}

function clinicKnowledgeInstrumentFor(instruments = []) {
  return instruments.find((instrument) => instrument.id === activeKnowledgeInstrumentId && instrument.status === "Active")
    || instruments.find((instrument) => (
      instrument.name === "Clinic Knowledge Assessment"
      && instrument.status === "Active"
      && instrument.administrationPoints?.length === 1
      && instrument.administrationPoints.includes("Graduation")
    ))
    || null;
}

function clinicHealthInstrumentFor(instruments = []) {
  return instruments.find((instrument) => instrument.id === activeHealthInstrumentId && instrument.status === "Active")
    || instruments.find((instrument) => (
      instrument.name === "Nutrition & Healthy Habits Questionnaire"
      && instrument.status === "Active"
    ))
    || null;
}

function clinicEvaluationQuestionsForInstrument(questions = [], instrumentId = "") {
  return questions
    .filter((question) => question.instrumentId === instrumentId && question.recordStatus !== "Draft")
    .sort((first, second) => Number(first.sortOrder || 0) - Number(second.sortOrder || 0));
}

function clinicKnowledgeQuestionsForInstrument(questions = [], instrumentId = "") {
  return clinicEvaluationQuestionsForInstrument(questions, instrumentId);
}

function clinicEvaluationResponsesForClient(responses = [], clientId = "", instrumentId = "") {
  return responses
    .filter((response) => response.clientId === clientId && (!instrumentId || response.instrumentId === instrumentId))
    .sort((first, second) => (
      cleanText(second.responseDate).localeCompare(cleanText(first.responseDate))
      || cleanText(second.updatedAt || second.createdAt).localeCompare(cleanText(first.updatedAt || first.createdAt))
    ));
}

function clinicKnowledgeResponsesForClient(responses = [], clientId = "", instrumentId = "") {
  return clinicEvaluationResponsesForClient(responses, clientId, instrumentId);
}

function clinicEvaluationResponseForPoint(responses = [], clientId = "", instrumentId = "", administrationPoint = "") {
  return clinicEvaluationResponsesForClient(responses, clientId, instrumentId)
    .find((response) => response.administrationPoint === administrationPoint) || null;
}

function clinicKnowledgeResponseForPoint(responses = [], clientId = "", instrumentId = "", administrationPoint = "") {
  return clinicEvaluationResponseForPoint(responses, clientId, instrumentId, administrationPoint);
}

function clinicLegacyResponsesForClient(responses = [], clientId = "", activeInstrumentIds = []) {
  const activeIds = new Set(activeInstrumentIds.filter(Boolean));
  return clinicEvaluationResponsesForClient(responses, clientId)
    .filter((response) => !activeIds.has(response.instrumentId));
}

function clinicQuestionsByTopic(questions = []) {
  const groups = new Map();
  questions.forEach((question) => {
    if (!groups.has(question.topic)) groups.set(question.topic, []);
    groups.get(question.topic).push(question);
  });
  return [...groups.entries()].map(([topic, items]) => ({ topic, questions: items }));
}

function clinicLessonColor(topic = "") {
  const lesson = Object.keys(clinicLessonColors).find((candidate) => topic.startsWith(candidate));
  return clinicLessonColors[lesson] || "#e23a4d";
}

function clinicKnowledgeResponseResult(response = {}, questions = []) {
  const activeQuestions = clinicEvaluationQuestionsForInstrument(questions, response.instrumentId);
  const answerMap = new Map((response.answers || []).map((answer) => [answer.questionId, answer]));
  const retrospective = response.instrumentId === activeKnowledgeInstrumentId
    || (response.answers || []).some((answer) => Object.hasOwn(answer, "beforeValue") || Object.hasOwn(answer, "nowValue"));
  const topicGroups = clinicQuestionsByTopic(activeQuestions);

  if (!retrospective) {
    const lessonScores = topicGroups.map(({ topic, questions: lessonQuestions }) => {
      const values = lessonQuestions.map((question) => normalizedAnswer(answerMap.get(question.id)?.value));
      const complete = values.every((value) => value !== null);
      return {
        lesson: topic,
        percent: complete ? roundedPercent((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) : null
      };
    });
    const complete = activeQuestions.length > 0 && lessonScores.every((lesson) => lesson.percent !== null);
    return {
      score: complete ? roundedPercent(lessonScores.reduce((sum, lesson) => sum + lesson.percent, 0) / lessonScores.length) : null,
      beforeScore: null,
      nowScore: null,
      gain: null,
      complete,
      answeredCount: activeQuestions.filter((question) => normalizedAnswer(answerMap.get(question.id)?.value) !== null).length,
      questionCount: activeQuestions.length,
      lessonScores
    };
  }

  const lessonScores = topicGroups.map(({ topic, questions: lessonQuestions }) => {
    const beforeValues = lessonQuestions.map((question) => normalizedAnswer(answerMap.get(question.id)?.beforeValue));
    const nowValues = lessonQuestions.map((question) => normalizedAnswer(answerMap.get(question.id)?.nowValue));
    const beforeComplete = beforeValues.every((value) => value !== null);
    const nowComplete = nowValues.every((value) => value !== null);
    const beforePercent = beforeComplete
      ? roundedPercent((beforeValues.reduce((sum, value) => sum + value, 0) / beforeValues.length) * 100)
      : null;
    const nowPercent = nowComplete
      ? roundedPercent((nowValues.reduce((sum, value) => sum + value, 0) / nowValues.length) * 100)
      : null;
    return {
      lesson: topic,
      beforePercent,
      nowPercent,
      gain: beforePercent === null || nowPercent === null ? null : roundedPercent(nowPercent - beforePercent)
    };
  });
  const complete = activeQuestions.length > 0 && lessonScores.every((lesson) => lesson.beforePercent !== null && lesson.nowPercent !== null);
  const beforeScore = complete
    ? roundedPercent(lessonScores.reduce((sum, lesson) => sum + lesson.beforePercent, 0) / lessonScores.length)
    : null;
  const nowScore = complete
    ? roundedPercent(lessonScores.reduce((sum, lesson) => sum + lesson.nowPercent, 0) / lessonScores.length)
    : null;
  return {
    score: nowScore,
    beforeScore,
    nowScore,
    gain: complete ? roundedPercent(nowScore - beforeScore) : null,
    complete,
    answeredCount: activeQuestions.filter((question) => {
      const answer = answerMap.get(question.id) || {};
      return normalizedAnswer(answer.beforeValue) !== null && normalizedAnswer(answer.nowValue) !== null;
    }).length,
    questionCount: activeQuestions.length,
    lessonScores
  };
}

function clinicKnowledgeResponseScore(response = {}, questions = []) {
  return clinicKnowledgeResponseResult(response, questions).score;
}

function clinicKnowledgeScoreSummary(response = {}, questions = []) {
  const result = clinicKnowledgeResponseResult(response, questions);
  if (!result.complete || result.score === null) return null;
  return {
    score: result.score,
    beforeScore: result.beforeScore,
    nowScore: result.nowScore,
    gain: result.gain
  };
}

function clinicKnowledgeAnsweredCount(response = {}, questions = []) {
  return clinicKnowledgeResponseResult(response, questions).answeredCount;
}

function baseResponsePayload(data, context) {
  return {
    instrumentId: context.instrument?.id || "",
    instrumentName: context.instrument?.name || "",
    instrumentVersion: context.instrument?.version || "",
    instrumentEffectiveDate: context.instrument?.effectiveDate || "",
    programArea: context.instrument?.programArea || "Clinic",
    clientId: context.clientId || "",
    clientBirthdate: context.clientBirthdate || "",
    appointmentId: context.appointmentId || "",
    administrationPoint: context.administrationPoint || "",
    responseDate: cleanText(data.get("responseDate")),
    status: context.status === "Complete" ? "Complete" : "Draft",
    respondentType: context.instrument?.respondentType || "",
    respondentName: "",
    language: cleanText(data.get("language")) || "English",
    notes: cleanText(data.get("notes"))
  };
}

function clinicKnowledgeFormPayload(form, context = {}) {
  const data = form instanceof FormData ? form : new FormData(form);
  const questions = clinicEvaluationQuestionsForInstrument(context.questions || [], context.instrument?.id || "");
  const retrospective = clinicInstrumentKind(context.instrument) === "knowledge-retrospective";
  return {
    ...baseResponsePayload(data, context),
    answers: questions.map((question) => retrospective
      ? {
        questionId: question.id,
        beforeValue: cleanText(data.get(`before-${question.id}`)),
        nowValue: cleanText(data.get(`now-${question.id}`))
      }
      : {
        questionId: question.id,
        value: cleanText(data.get(`answer-${question.id}`))
      }).filter((answer) => retrospective ? answer.beforeValue || answer.nowValue : answer.value)
  };
}

function clinicHealthFormPayload(form, context = {}) {
  const data = form instanceof FormData ? form : new FormData(form);
  const questions = clinicEvaluationQuestionsForInstrument(context.questions || [], context.instrument?.id || "");
  return {
    ...baseResponsePayload(data, context),
    answers: questions.map((question) => ({
      questionId: question.id,
      value: cleanText(data.get(`answer-${question.id}`))
    })).filter((answer) => answer.value)
  };
}

function clinicGenericFormPayload(form, context = {}) {
  const data = form instanceof FormData ? form : new FormData(form);
  const questions = clinicEvaluationQuestionsForInstrument(context.questions || [], context.instrument?.id || "");
  return {
    ...baseResponsePayload(data, context),
    answers: questions.map((question) => {
      const values = data.getAll(`answer-${question.id}`).map(cleanText).filter(Boolean);
      return {
        questionId: question.id,
        value: question.responseType === "Multi choice" ? values : values[0] || ""
      };
    }).filter((answer) => Array.isArray(answer.value) ? answer.value.length : answer.value)
  };
}

function clinicEvaluationFormPayload(form, context = {}) {
  const kind = clinicInstrumentKind(context.instrument);
  if (kind === "health") return clinicHealthFormPayload(form, context);
  if (kind.includes("knowledge")) return clinicKnowledgeFormPayload(form, context);
  return clinicGenericFormPayload(form, context);
}

function clinicFormUrl(options = {}) {
  const params = new URLSearchParams();
  if (options.clientId) params.set("client", options.clientId);
  if (options.instrumentId) params.set("instrument", options.instrumentId);
  if (options.administrationPoint) params.set("point", options.administrationPoint);
  if (options.responseId) params.set("response", options.responseId);
  if (options.appointmentId) params.set("appointment", options.appointmentId);
  if (options.mode) params.set("mode", options.mode);
  const query = params.toString();
  return `./client-form.html${query ? `?${query}` : ""}`;
}

function clinicNativeFormActions(response = null) {
  const started = Boolean(response?.id);
  const complete = response?.status === "Complete";
  return {
    clientLabel: started && !complete ? "Resume Client View" : "Client View",
    staffLabel: complete ? "View/Edit Answers" : "Enter Answers"
  };
}

export {
  activeHealthInstrumentId,
  activeKnowledgeInstrumentId,
  clinicEvaluationFormPayload,
  clinicEvaluationQuestionsForInstrument,
  clinicEvaluationResponseForPoint,
  clinicEvaluationResponsesForClient,
  clinicFormUrl,
  clinicHealthFormPayload,
  clinicHealthInstrumentFor,
  clinicInstrumentForFormType,
  clinicInstrumentKind,
  clinicKnowledgeAnsweredCount,
  clinicKnowledgeFormPayload,
  clinicKnowledgeInstrumentFor,
  clinicKnowledgeQuestionsForInstrument,
  clinicKnowledgeResponseForPoint,
  clinicKnowledgeResponseResult,
  clinicKnowledgeResponsesForClient,
  clinicKnowledgeResponseScore,
  clinicKnowledgeScoreSummary,
  clinicLegacyResponsesForClient,
  clinicLessonColor,
  clinicNativeFormActions,
  clinicQuestionsByTopic,
  legacyKnowledgeInstrumentId
};
