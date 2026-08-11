import {
  clinicEvaluationFormPayload,
  clinicEvaluationQuestionsForInstrument,
  clinicHealthInstrumentFor,
  clinicInstrumentForFormType,
  clinicInstrumentKind,
  clinicKnowledgeInstrumentFor,
  clinicKnowledgeResponseResult,
  clinicLessonColor,
  clinicQuestionsByTopic
} from "./modules/clinic-evaluation.js?v=20260804-feedback-hrsn1";

const params = new URLSearchParams(window.location.search);
const requestedClientId = params.get("client") || "";
const requestedInstrumentId = params.get("instrument") || "";
const requestedPoint = params.get("point") || "";
const requestedResponseId = params.get("response") || "";
const requestedAppointmentId = params.get("appointment") || "";
const requestedPacket = ["enrollment", "graduation"].includes(params.get("packet")) ? params.get("packet") : "";
const mode = ["print", "review", "staff"].includes(params.get("mode")) ? params.get("mode") : "client";
const embeddedPacket = requestedPacket && mode === "print" && params.get("embed") === "1";
const app = document.querySelector("#client-form-app");

let currentUser = null;
let client = null;
let instrument = null;
let questions = [];
let response = null;
let packetItems = [];
let stepIndex = 0;
let saving = false;
let actionMessage = "";
let staffResponseDate = "";
let deleteConfirming = false;
const answers = new Map();

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function dateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Los_Angeles",
    year: "numeric"
  }).formatToParts(date);
  const valueFor = (type) => parts.find((part) => part.type === type)?.value || "";
  return [valueFor("year"), valueFor("month"), valueFor("day")].join("-");
}

function displayDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T12:00:00Z`));
}

function clientName() {
  return [client?.firstName, client?.lastName].filter(Boolean).join(" ") || "Client";
}

function childFirstName() {
  return client?.firstName || "the child";
}

function replaceChild(value) {
  return String(value || "").replaceAll("[Child]", childFirstName());
}

function isSpanish() {
  const language = response?.language || client?.preferredLanguage || "English";
  return String(language).toLowerCase().includes("spanish") || String(language).toLowerCase().includes("español");
}

function useSpanishTranslations() {
  return mode !== "staff" && isSpanish();
}

function localizedValue(item, englishKey, spanishKey) {
  return useSpanishTranslations() && item?.[spanishKey] ? item[spanishKey] : item?.[englishKey] || "";
}

function localizedQuestion(question) {
  return replaceChild(localizedValue(question, "question", "questionEs"));
}

function localizedHelper(question) {
  return replaceChild(localizedValue(question, "helperText", "helperTextEs"));
}

function localizedTopic(group) {
  const firstQuestion = group?.questions?.[0];
  return localizedValue(firstQuestion, "topic", "topicEs") || group?.topic || "";
}

function localizedInstrumentName() {
  return localizedValue(instrument, "name", "nameEs");
}

function localizedInstructions() {
  return localizedValue(instrument, "instructions", "instructionsEs");
}

function localizedProgramPoint(value = requestedPoint) {
  if (!useSpanishTranslations()) return value;
  if (value === "Enrollment") return "Inscripción";
  if (value === "Graduation") return "Graduación";
  return value;
}

function returnUrl() {
  return `./crm.html?section=Clients&client=${encodeURIComponent(requestedClientId)}&tab=forms`;
}

async function authedFetch(path, options = {}) {
  if (!currentUser) throw new Error("Sign in is required.");
  const token = await currentUser.getIdToken();
  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL || "";
  const fetchResponse = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const result = await fetchResponse.json().catch(() => ({}));
  if (!fetchResponse.ok) throw new Error(result.error || `Form service returned ${fetchResponse.status}.`);
  return result;
}

function hydrateAnswers() {
  answers.clear();
  (response?.answers || []).forEach((answer) => answers.set(answer.questionId, { ...answer }));
}

function prefillValue(key) {
  const values = {
    clientName: clientName(),
    currentDate: response?.responseDate || dateKey(),
    dateOfBirth: client?.dateOfBirth || client?.dob || "",
    email: client?.email || "",
    gender: client?.gender || "",
    parentName: client?.parentName || "",
    phone: client?.phone || "",
    preferredContactMethod: client?.preferredContactMethod || "",
    preferredLanguage: client?.preferredLanguage || "English",
    referralSource: client?.referralSource || "",
    ycco: client?.ycco === true ? "Yes" : client?.ycco === false ? "No" : "",
    yccoId: client?.yccoId || ""
  };
  return values[key] ?? "";
}

function hydratePrefilledAnswers() {
  questions.forEach((question) => {
    if (!question.prefillKey || answerFor(question.id).value) return;
    const value = prefillValue(question.prefillKey);
    if (value !== "") setAnswer(question.id, "value", value);
  });
}

function answerFor(questionId) {
  return answers.get(questionId) || { questionId, value: "", beforeValue: "", nowValue: "" };
}

function setAnswer(questionId, field, value) {
  answers.set(questionId, { ...answerFor(questionId), questionId, [field]: value });
}

function formGroups() {
  return clinicQuestionsByTopic(questions);
}

function questionComplete(question, kind = clinicInstrumentKind(instrument)) {
  const answer = answerFor(question.id);
  if (kind === "knowledge-retrospective") return Boolean(answer.beforeValue && answer.nowValue);
  const answered = Array.isArray(answer.value) ? answer.value.length > 0 : Boolean(answer.value);
  return answered || question.required === false;
}

function answerProgress() {
  const kind = clinicInstrumentKind(instrument);
  const allQuestions = formGroups()
    .flatMap((group) => group.questions)
    .filter((question) => question.required !== false);
  return {
    answered: allQuestions.filter((question) => questionComplete(question, kind)).length,
    total: allQuestions.length
  };
}

function firstIncompleteGroupIndex() {
  const kind = clinicInstrumentKind(instrument);
  return formGroups().findIndex((group) => (
    group.questions.some((question) => !questionComplete(question, kind))
  ));
}

function modeUrl(nextMode) {
  const url = new URL(window.location.href);
  if (nextMode === "client") url.searchParams.delete("mode");
  else url.searchParams.set("mode", nextMode);
  return `${url.pathname}${url.search}`;
}

function selectedClass(selected, option) {
  return (Array.isArray(selected) ? selected.includes(option) : selected === option) ? " is-selected" : "";
}

function compactNumberOption(option) {
  return /^\d+\+?$/.test(String(option || ""));
}

function renderAnswerOptions(question, field, selected, color) {
  const sourceOptions = question.responseOptions || [];
  const options = sourceOptions.length === 2 && sourceOptions.includes("No") && sourceOptions.includes("Yes")
    ? ["No", "Yes"]
    : sourceOptions;
  const translatedOptions = useSpanishTranslations() && question.responseOptionsEs?.length === options.length
    ? question.responseOptionsEs
    : options;
  const hasCompactNumbers = options.some(compactNumberOption);
  const optionClasses = [
    hasCompactNumbers ? "has-compact-numbers" : "",
    question.responseType === "Rating" ? "is-rating" : "",
    question.responseType === "Agreement" ? "is-agreement" : "",
    options.length <= 3 ? "is-short-choice" : ""
  ].filter(Boolean).join(" ");
  return `
    <div class="client-form-options${optionClasses ? ` ${optionClasses}` : ""}" style="--option-count: ${Math.min(options.length, 4)}; --step-color: ${color};" role="group" aria-label="${escapeHtml(localizedQuestion(question))}">
      ${options.map((option, index) => `
        <button
          class="client-form-option${compactNumberOption(option) ? " is-compact-number" : ""}${selectedClass(selected, option)}"
          data-answer-question="${escapeHtml(question.id)}"
          data-answer-field="${escapeHtml(field)}"
          data-answer-value="${escapeHtml(option)}"
          ${question.responseType === "Multi choice" ? "data-answer-multiple=\"true\"" : ""}
          type="button"
          ${saving ? "disabled" : ""}
        >${escapeHtml(translatedOptions[index] || option)}</button>
      `).join("")}
    </div>
  `;
}

function renderTextAnswer(question, value, options = {}) {
  const multiline = question.responseType === "Long text";
  const inputType = question.responseType === "Date"
    ? "date"
    : question.responseType === "Email"
      ? "email"
      : question.responseType === "Phone"
        ? "tel"
        : "text";
  const attributes = `data-answer-input="${escapeHtml(question.id)}" ${question.required ? "required" : ""} ${saving ? "disabled" : ""}`;
  if (multiline) {
    return `<textarea class="client-form-text-answer" ${attributes} rows="${options.staff ? 4 : 5}">${escapeHtml(value || "")}</textarea>`;
  }
  return `<input class="client-form-text-answer" ${attributes} type="${inputType}" value="${escapeHtml(value || "")}">`;
}

function renderGenericAnswer(question, color, options = {}) {
  const answer = answerFor(question.id);
  if (["Short text", "Long text", "Date", "Email", "Phone"].includes(question.responseType)) {
    return renderTextAnswer(question, answer.value, options);
  }
  return renderAnswerOptions(question, "value", answer.value, color);
}

function renderKnowledgeStep(group, color) {
  return `
    <section class="client-form-knowledge-comparison" style="--now-color: ${color};">
      <div class="client-form-knowledge-comparison-heading">
        <strong>Knowledge Statement</strong>
        <div class="is-before">
          <h2>BEFORE SNACK</h2>
          <p>Think back to before your first SNACK appointment.</p>
        </div>
        <div class="is-now">
          <h2>NOW</h2>
          <p>Think about what you know today, after completing the SNACK lessons. Choose No or Yes for what you know now.</p>
        </div>
      </div>
      <div class="client-form-knowledge-comparison-rows">
        ${group.questions.map((question) => `
          <div class="client-form-knowledge-comparison-row">
            <div class="client-form-question-copy"><strong>${escapeHtml(question.question)}</strong></div>
            <div class="client-form-knowledge-answer is-before">
              <span>Before SNACK</span>
              ${renderAnswerOptions(question, "beforeValue", answerFor(question.id).beforeValue, "#ad2637")}
            </div>
            <div class="client-form-knowledge-answer is-now">
              <span>Now</span>
              ${renderAnswerOptions(question, "nowValue", answerFor(question.id).nowValue, color)}
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function lessonTopicParts(topic, fallbackNumber) {
  const match = String(topic || "").match(/^Lesson\s+(\d+)\s*:\s*(.+)$/i);
  return {
    number: match?.[1] || String(fallbackNumber),
    label: match?.[2] || String(topic || "")
  };
}

function renderHealthStep(group, color) {
  return `
    <section class="client-form-health-section" style="--step-color: ${color};">
      <div class="client-form-question-list">
        ${group.questions.map((question) => `
          <div class="client-form-question">
            <div class="client-form-question-copy">
              <strong>${escapeHtml(localizedQuestion(question))}</strong>
              ${localizedHelper(question) ? `<small>${escapeHtml(localizedHelper(question))}</small>` : ""}
            </div>
            ${renderAnswerOptions(question, "value", answerFor(question.id).value, color)}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderGenericStep(group, color) {
  return `
    <section class="client-form-health-section client-form-generic-section" data-form-topic="${escapeHtml(group.topic)}" style="--step-color: ${color};">
      <div class="client-form-question-list">
        ${group.questions.map((question) => `
          <div class="client-form-question is-generic" data-question-id="${escapeHtml(question.id)}">
            <div class="client-form-question-copy">
              <strong>${escapeHtml(localizedQuestion(question))}</strong>
              ${localizedHelper(question) ? `<small>${escapeHtml(localizedHelper(question))}</small>` : ""}
            </div>
            ${renderGenericAnswer(question, color)}
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function sectionInstructions(kind, group) {
  if (kind !== "hrsn") return localizedInstructions();
  if (group.topic === "Covered Population") {
    return useSpanishTranslations()
      ? "¿Alguna de las siguientes situaciones se aplica al participante?"
      : "Do any of the following apply to the participant?";
  }
  if (group.topic === "Food Access") {
    return useSpanishTranslations()
      ? "Para las siguientes preguntas, indique si la afirmación fue frecuentemente cierta, a veces cierta o nunca cierta para su hogar durante los últimos 12 meses."
      : "For the following, please report whether the statement is often true, sometimes true, or never true, for your household in the last 12 months.";
  }
  if (group.topic === "Consent and Agreement") {
    return useSpanishTranslations()
      ? "Como padre, madre o tutor legal, estoy de acuerdo con las siguientes declaraciones."
      : "As the parent or legal guardian, I agree with the following statements.";
  }
  return localizedInstructions();
}

function clientHeading(kind, group) {
  if (kind === "knowledge-retrospective") {
    return {
      eyebrow: group.topic,
      title: "Knowledge Assessment",
      instruction: "For each sentence, answer once for before you started SNACK and once for what you know now."
    };
  }
  if (!["health", "knowledge-legacy"].includes(kind)) {
    return {
      eyebrow: localizedTopic(group),
      title: localizedInstrumentName(),
      instruction: sectionInstructions(kind, group)
    };
  }
  return {
    eyebrow: localizedTopic(group),
    title: useSpanishTranslations() ? "Cuestionario" : "Questionnaire",
    instruction: useSpanishTranslations()
      ? "Piense en los últimos 7 días. Elija la respuesta que mejor corresponda. Seleccione No sé solamente si realmente no lo sabe."
      : "Think about the past 7 days. Choose the answer that fits best. Select I don't know only if you truly do not know."
  };
}

function renderClientMode() {
  const kind = clinicInstrumentKind(instrument);
  const groups = formGroups();
  const group = groups[stepIndex] || groups[0];
  if (!group) return renderError("This form does not have any active questions.");
  const color = kind === "knowledge-retrospective" ? clinicLessonColor(group.topic) : "#e23a4d";
  const heading = clientHeading(kind, group);
  const progress = ((stepIndex + 1) / groups.length) * 100;
  app.innerHTML = `
    <form class="client-form-shell" data-form-kind="${escapeHtml(kind)}" style="--step-color: ${color};" data-client-form novalidate>
      <header class="client-form-minimal-header">
        <button class="client-form-back" data-client-form-back type="button" ${stepIndex === 0 ? "hidden" : ""}>Back</button>
        <div class="client-form-progress" aria-label="Form progress"><span style="--progress: ${progress}%;"></span></div>
        <button class="client-form-exit" data-client-form-exit type="button">Exit</button>
      </header>
      <div class="client-form-heading">
        <span>${escapeHtml(heading.eyebrow)}</span>
        <h1>${escapeHtml(heading.title)}</h1>
        <p>${escapeHtml(heading.instruction)}</p>
      </div>
      ${kind === "knowledge-retrospective"
        ? renderKnowledgeStep(group, color)
        : kind === "health" || kind === "knowledge-legacy"
          ? renderHealthStep(group, color)
          : renderGenericStep(group, color)}
      <p class="client-form-error" data-client-form-status role="status">${escapeHtml(actionMessage)}</p>
      <button class="client-form-next" data-client-form-next type="submit" ${saving ? "disabled" : ""}>${stepIndex === groups.length - 1 ? "Finish" : "Next"}</button>
    </form>
  `;
}

function renderStaffQuestion(question, kind, color) {
  const answer = answerFor(question.id);
  if (kind === "knowledge-retrospective") {
    return `
      <div class="client-form-staff-question is-knowledge">
        <div class="client-form-staff-question-copy"><strong>${escapeHtml(question.question)}</strong></div>
        <div class="client-form-staff-answer-period is-before">
          <span>Before SNACK</span>
          ${renderAnswerOptions(question, "beforeValue", answer.beforeValue, "#ad2637")}
        </div>
        <div class="client-form-staff-answer-period is-now">
          <span>Now</span>
          ${renderAnswerOptions(question, "nowValue", answer.nowValue, color)}
        </div>
      </div>
    `;
  }
  if (!["health", "knowledge-legacy"].includes(kind)) {
    return `
      <div class="client-form-staff-question is-generic" data-question-id="${escapeHtml(question.id)}">
        <div class="client-form-staff-question-copy">
          <strong>${escapeHtml(localizedQuestion(question))}</strong>
          ${localizedHelper(question) ? `<small>${escapeHtml(localizedHelper(question))}</small>` : ""}
        </div>
        ${renderGenericAnswer(question, color, { staff: true })}
      </div>
    `;
  }
  return `
    <div class="client-form-staff-question is-health">
      <div class="client-form-staff-question-copy">
        <strong>${escapeHtml(localizedQuestion(question))}</strong>
        ${localizedHelper(question) ? `<small>${escapeHtml(localizedHelper(question))}</small>` : ""}
      </div>
      ${renderAnswerOptions(question, "value", answer.value, color)}
    </div>
  `;
}

function renderStaffMode() {
  const kind = clinicInstrumentKind(instrument);
  const groups = formGroups();
  const group = groups[stepIndex] || groups[0];
  if (!group) return renderError("This form does not have any active questions.");
  const color = kind === "knowledge-retrospective" ? clinicLessonColor(group.topic) : "#e23a4d";
  const progress = answerProgress();
  const complete = response?.status === "Complete";
  const title = kind === "health"
    ? "Questionnaire"
    : kind.includes("knowledge")
      ? "Knowledge Assessment"
      : localizedInstrumentName();
  const pageTitle = ["health", "knowledge-legacy", "knowledge-retrospective"].includes(kind)
    ? `${localizedProgramPoint()} ${title}`
    : title;
  const clientViewUrl = modeUrl("client");
  const printUrl = modeUrl("print");
  app.innerHTML = `
    <main class="client-form-staff-shell" data-form-kind="${escapeHtml(kind)}" style="--step-color: ${color};">
      <header class="client-form-staff-header">
        <div>
          <a href="${escapeHtml(returnUrl())}">Back to Client</a>
          <span>Staff Entry</span>
          <h1>${escapeHtml(pageTitle)}</h1>
          <p>${escapeHtml(clientName())} · ${escapeHtml(instrument.version)}</p>
        </div>
        <div class="client-form-staff-header-actions">
          <a href="${escapeHtml(clientViewUrl)}">Client View</a>
          <a href="${escapeHtml(printUrl)}" target="_blank">Print</a>
          <span class="client-form-staff-status" data-response-status="${escapeHtml(response?.status || "Not Started")}">${escapeHtml(response?.status || "Not Started")}</span>
        </div>
      </header>
      <section class="client-form-staff-meta${kind === "hrsn" ? " is-without-program-point" : ""}" aria-label="Form details">
        <label><span>Completion Date</span><input data-staff-response-date type="date" value="${escapeHtml(staffResponseDate)}"></label>
        ${kind === "hrsn" ? "" : `<div><span>Program Point</span><strong>${escapeHtml(localizedProgramPoint())}</strong></div>`}
        <div><span>Language</span><strong>${escapeHtml(response?.language || client?.preferredLanguage || "English")}</strong></div>
        <div><span>Progress</span><strong>${progress.answered} of ${progress.total}</strong></div>
      </section>
      <div class="client-form-staff-workspace">
        <nav class="client-form-staff-nav" aria-label="Form sections">
          ${groups.map((candidate, index) => {
            const sectionColor = kind === "knowledge-retrospective" ? clinicLessonColor(candidate.topic) : "#e23a4d";
            const sectionQuestions = candidate.questions.filter((question) => question.required !== false);
            const sectionAnswered = sectionQuestions.filter((question) => questionComplete(question, kind)).length;
            const lesson = lessonTopicParts(candidate.topic, index + 1);
            return `
              <button
                class="${index === stepIndex ? "is-active" : ""}"
                style="--section-color: ${sectionColor};"
                data-staff-group-index="${index}"
                type="button"
              >
                ${kind === "knowledge-retrospective"
                  ? `<span class="client-form-staff-nav-label"><b>${escapeHtml(lesson.number)}</b><span>${escapeHtml(lesson.label)}</span></span>`
                  : `<span class="client-form-staff-nav-topic">${escapeHtml(localizedTopic(candidate))}</span>`}
                <small>${sectionQuestions.length ? `${sectionAnswered}/${sectionQuestions.length}` : "Optional"}</small>
              </button>
            `;
          }).join("")}
        </nav>
        <section class="client-form-staff-content" data-form-topic="${escapeHtml(group.topic)}" style="--section-color: ${color};">
          <header>
            <span>${escapeHtml(title)}</span>
            <h2>${escapeHtml(localizedTopic(group))}</h2>
            <p>${kind === "knowledge-retrospective"
              ? "Record each answer once for before the child started SNACK and once for what they know now."
              : kind === "health"
                ? "Record the answer selected for each question. I don't know should only be used when the respondent truly does not know."
                : sectionInstructions(kind, group)}</p>
          </header>
          <div class="client-form-staff-question-list">
            ${group.questions.map((question) => renderStaffQuestion(question, kind, color)).join("")}
          </div>
        </section>
      </div>
      <footer class="client-form-staff-footer">
        <p role="status" aria-live="polite">${escapeHtml(actionMessage)}</p>
        ${response?.id && !complete
          ? `<button class="is-danger" data-staff-delete-draft type="button" ${saving ? "disabled" : ""}>${deleteConfirming ? "Confirm Delete" : "Delete Draft"}</button>`
          : ""}
        ${complete
          ? `<button class="is-primary" data-staff-save="Complete" type="button" ${saving ? "disabled" : ""}>Save Changes</button>`
          : `
            <button data-staff-save="Draft" type="button" ${saving ? "disabled" : ""}>Save Draft</button>
            <button class="is-primary" data-staff-save="Complete" type="button" ${saving ? "disabled" : ""}>Mark Complete</button>
          `}
      </footer>
    </main>
  `;
}

function paperAnswerOption(option, selected, label = option) {
  const isSelected = Array.isArray(selected) ? selected.includes(option) : selected === option;
  return `<span><i class="client-form-paper-check ${isSelected ? "is-selected" : ""}"></i>${escapeHtml(label)}</span>`;
}

function renderPaperQuestion(question, kind) {
  const answer = answerFor(question.id);
  if (kind === "knowledge-retrospective") {
    return `
      <div class="client-form-paper-question">
        <span>${escapeHtml(question.question)}</span>
        <div class="client-form-paper-retrospective-options">
          <strong>Before SNACK</strong>
          ${["No", "Yes"].map((option) => paperAnswerOption(option, answer.beforeValue)).join("")}
          <strong>Now</strong>
          ${["No", "Yes"].map((option) => paperAnswerOption(option, answer.nowValue)).join("")}
        </div>
      </div>
    `;
  }
  if (kind === "knowledge-legacy") {
    return `
      <div class="client-form-paper-question">
        <span>${escapeHtml(question.question)}</span>
        <div class="client-form-paper-options">${["No", "Yes"].map((option) => paperAnswerOption(option, answer.value)).join("")}</div>
      </div>
    `;
  }
  if (!["health", "knowledge-legacy"].includes(kind)
    && ["Short text", "Long text", "Date", "Email", "Phone"].includes(question.responseType)) {
    const recordedValue = Array.isArray(answer.value) ? answer.value.join(", ") : answer.value;
    return `
      <div class="client-form-paper-question is-written-answer${question.responseType === "Long text" ? " is-long-answer" : ""}">
        <span>
          ${escapeHtml(localizedQuestion(question))}
          ${localizedHelper(question) ? `<small>${escapeHtml(localizedHelper(question))}</small>` : ""}
        </span>
        <div class="client-form-paper-write-line${question.responseType === "Long text" ? " is-multiline" : ""}">${escapeHtml(recordedValue || "")}</div>
      </div>
    `;
  }
  const responseOptions = question.responseOptions || [];
  const translatedOptions = useSpanishTranslations() && question.responseOptionsEs?.length === responseOptions.length
    ? question.responseOptionsEs
    : responseOptions;
  const optionCount = responseOptions.length;
  const paperQuestionClasses = [
    "client-form-paper-question",
    optionCount === 7 ? "has-balanced-seven" : "",
    question.responseType === "Rating" ? "is-rating" : "",
    question.responseType === "Agreement" ? "is-agreement" : "",
    question.topic === "Healthy Habits" ? "has-healthy-habits-options" : ""
  ].filter(Boolean).join(" ");
  return `
    <div class="${paperQuestionClasses}" data-question-id="${escapeHtml(question.id)}">
      <span>
        ${escapeHtml(localizedQuestion(question))}
        ${localizedHelper(question) ? `<small>${escapeHtml(localizedHelper(question))}</small>` : ""}
      </span>
      <div class="client-form-paper-options${optionCount === 7 ? " is-balanced-seven" : ""}" data-option-count="${optionCount}">${responseOptions.map((option, index) => paperAnswerOption(option, answer.value, translatedOptions[index] || option)).join("")}</div>
    </div>
  `;
}

function paperArticleHtml(programPoint = requestedPoint) {
  const kind = clinicInstrumentKind(instrument);
  const groups = formGroups();
  const printPageCount = kind === "enrollment" ? Math.max(1, groups.length) : kind === "hrsn" ? 2 : 1;
  const completionDate = response?.responseDate || dateKey();
  const instructions = kind === "health"
    ? localizedInstructions()
    : kind === "knowledge-retrospective"
      ? "For every statement, answer once for Before SNACK and once for Now. Before SNACK means before the first SNACK appointment. Now means today, after completing the SNACK lessons."
      : kind.includes("knowledge")
        ? "This record is shown with the questions and scoring version that were active when it was completed."
        : localizedInstructions();
  const title = kind === "health"
    ? localizedInstrumentName()
    : kind.includes("knowledge")
      ? "Clinic Knowledge Assessment"
      : localizedInstrumentName();
  const result = kind.includes("knowledge") && response ? clinicKnowledgeResponseResult(response, questions) : null;
  return `
    <article class="client-form-paper" data-form-kind="${escapeHtml(kind)}" data-print-page-count="${printPageCount}">
      <header class="client-form-paper-header">
        <img src="./favicon.png" alt="">
        <div><h1>${escapeHtml(title)}</h1><p>The SNACK Program</p></div>
      </header>
      <div class="client-form-paper-meta${kind === "hrsn" ? " is-without-program-point" : ""}">
        <div><span>Child</span><strong>${escapeHtml(clientName())}</strong></div>
        <div><span>Completion Date</span><strong>${escapeHtml(displayDate(completionDate))}</strong></div>
        ${kind === "hrsn" ? "" : `<div><span>Program Point</span><strong>${escapeHtml(localizedProgramPoint(programPoint || response?.administrationPoint || ""))}</strong></div>`}
      </div>
      <p class="client-form-paper-instructions">${escapeHtml(instructions)}</p>
      ${result?.complete ? `
        <p class="client-form-paper-result"><strong>Recorded result:</strong> ${result.gain === null ? `${escapeHtml(result.score)}%` : `${result.beforeScore}% Before SNACK, ${result.nowScore}% Now, ${result.gain > 0 ? "+" : ""}${result.gain} points`}</p>
      ` : ""}
      ${groups.map((group) => `
        <section class="client-form-paper-section" data-form-topic="${escapeHtml(group.topic)}" style="--section-color: ${kind.includes("knowledge") ? clinicLessonColor(group.topic) : "#172033"};">
          <h2>${escapeHtml(localizedTopic(group))}</h2>
          ${group.questions.map((question) => renderPaperQuestion(question, kind)).join("")}
        </section>
      `).join("")}
    </article>
  `;
}

function renderPaperMode() {
  app.innerHTML = `
    <div class="client-form-paper-tools">
      <a href="${escapeHtml(returnUrl())}">Back to Client</a>
      ${mode === "print" ? `<button class="client-form-print-button" data-print-form type="button">Print</button>` : ""}
    </div>
    ${paperArticleHtml()}
  `;
}

function renderPacketPaperMode() {
  const originalContext = { instrument, questions, response, entries: [...answers.entries()] };
  const articles = packetItems.map((item) => {
    instrument = item.instrument;
    questions = item.questions;
    response = item.response;
    hydrateAnswers();
    hydratePrefilledAnswers();
    return paperArticleHtml(item.administrationPoint);
  }).join("");

  instrument = originalContext.instrument;
  questions = originalContext.questions;
  response = originalContext.response;
  answers.clear();
  originalContext.entries.forEach(([key, value]) => answers.set(key, value));

  const packetTitle = requestedPacket === "enrollment" ? "Enrollment Packet" : "Graduation Packet";
  app.innerHTML = `
    ${embeddedPacket ? "" : `<div class="client-form-paper-tools">
      <a href="${escapeHtml(returnUrl())}">Back to Client</a>
      <div><strong>${escapeHtml(packetTitle)}</strong><button class="client-form-print-button" data-print-form type="button">Print Packet</button></div>
    </div>`}
    <div class="client-form-paper-packet">${articles}</div>
  `;
  if (embeddedPacket) document.documentElement.dataset.packetReady = "true";
}

function renderError(message) {
  if (embeddedPacket) document.documentElement.dataset.packetError = String(message || "The forms could not be loaded.");
  app.innerHTML = `
    <section class="client-form-message">
      <img src="./favicon.png" alt="">
      <h1>Form unavailable</h1>
      <p>${escapeHtml(message)}</p>
      <a href="${escapeHtml(returnUrl())}">Back to Client</a>
    </section>
  `;
}

function renderSignedOut(openSignIn) {
  if (embeddedPacket) {
    document.documentElement.dataset.packetError = "Staff sign-in was not available in the print window. Close it and try again.";
  }
  app.innerHTML = `
    <section class="client-form-message">
      <img src="./favicon.png" alt="">
      <h1>Staff sign-in required</h1>
      <p>Sign in with a SNACK account before handing this iPad to a client.</p>
      <button class="client-form-signin" data-client-form-signin type="button">Sign In</button>
    </section>
  `;
  app.querySelector("[data-client-form-signin]")?.addEventListener("click", openSignIn);
}

function renderComplete() {
  app.innerHTML = `
    <section class="client-form-message">
      <img src="./favicon.png" alt="">
      <h1>All done</h1>
      <p>Thank you. Your answers have been saved.</p>
      <a href="${escapeHtml(returnUrl())}">Return to Client Profile</a>
    </section>
  `;
}

function render() {
  if (requestedPacket) renderPacketPaperMode();
  else if (mode === "print" || mode === "review") renderPaperMode();
  else if (mode === "staff") renderStaffMode();
  else renderClientMode();
}

function currentStepComplete() {
  const kind = clinicInstrumentKind(instrument);
  const group = formGroups()[stepIndex];
  if (!group) return false;
  return group.questions.every((question) => questionComplete(question, kind));
}

function responsePayload(status) {
  const data = new FormData();
  data.set("responseDate", mode === "staff" ? staffResponseDate : response?.responseDate || dateKey());
  data.set("language", response?.language || client?.preferredLanguage || "English");
  const kind = clinicInstrumentKind(instrument);
  questions.forEach((question) => {
    const answer = answerFor(question.id);
    if (kind === "knowledge-retrospective") {
      if (answer.beforeValue) data.set(`before-${question.id}`, answer.beforeValue);
      if (answer.nowValue) data.set(`now-${question.id}`, answer.nowValue);
    } else if (Array.isArray(answer.value)) {
      answer.value.forEach((value) => data.append(`answer-${question.id}`, value));
    } else if (answer.value) {
      data.set(`answer-${question.id}`, answer.value);
    }
  });
  return clinicEvaluationFormPayload(data, {
    instrument,
    questions,
    clientId: client.id,
    clientBirthdate: client.dateOfBirth || client.dob || "",
    appointmentId: requestedAppointmentId,
    administrationPoint: requestedPoint,
    status
  });
}

async function saveResponse(status) {
  const payload = responsePayload(status);
  const result = await authedFetch(
    response?.id ? `/api/evaluation-responses/${encodeURIComponent(response.id)}` : "/api/evaluation-responses",
    {
      method: response?.id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    }
  );
  response = result.response;
  deleteConfirming = false;
  hydrateAnswers();
}

async function deleteStaffDraft() {
  if (saving || !response?.id || response.status === "Complete") return;
  if (!deleteConfirming) {
    deleteConfirming = true;
    actionMessage = "Select Confirm Delete to permanently remove this draft.";
    render();
    return;
  }

  saving = true;
  actionMessage = "Deleting draft...";
  render();
  try {
    await authedFetch(`/api/evaluation-responses/${encodeURIComponent(response.id)}`, { method: "DELETE" });
    response = null;
    deleteConfirming = false;
    hydrateAnswers();
    hydratePrefilledAnswers();
    staffResponseDate = dateKey();
    actionMessage = "Draft deleted.";
  } catch (error) {
    console.error(error);
    deleteConfirming = false;
    actionMessage = error.message || "The draft could not be deleted.";
  } finally {
    saving = false;
  }
  render();
}

async function saveStaffResponse(status) {
  if (saving) return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(staffResponseDate)) {
    actionMessage = "Choose a completion date before saving.";
    render();
    return;
  }
  if (status === "Complete") {
    const incompleteIndex = firstIncompleteGroupIndex();
    if (incompleteIndex >= 0) {
      stepIndex = incompleteIndex;
      actionMessage = "Complete every answer before marking this form complete.";
      render();
      return;
    }
  }

  saving = true;
  actionMessage = "Saving...";
  render();
  try {
    await saveResponse(status);
    actionMessage = status === "Complete" ? "Answers saved and marked complete." : "Draft answers saved.";
  } catch (error) {
    console.error(error);
    actionMessage = error.message || "The answers could not be saved.";
  } finally {
    saving = false;
  }
  render();
}

async function moveNext() {
  if (saving) return;
  if (!currentStepComplete()) {
    actionMessage = clinicInstrumentKind(instrument) === "knowledge-retrospective"
      ? "Choose No or Yes for both Before SNACK and Now before continuing."
      : "Choose an answer for each question shown before continuing.";
    render();
    return;
  }
  saving = true;
  actionMessage = "Saving...";
  render();
  try {
    const lastStep = stepIndex === formGroups().length - 1;
    await saveResponse(lastStep || response?.status === "Complete" ? "Complete" : "Draft");
    if (lastStep) {
      renderComplete();
      return;
    }
    stepIndex += 1;
    actionMessage = "";
  } catch (error) {
    console.error(error);
    actionMessage = error.message || "Your answers could not be saved. Please ask a staff member for help.";
  } finally {
    saving = false;
  }
  render();
}

async function moveBack() {
  if (saving || stepIndex === 0) return;
  saving = true;
  actionMessage = "Saving...";
  render();
  try {
    await saveResponse(response?.status === "Complete" ? "Complete" : "Draft");
    stepIndex -= 1;
    actionMessage = "";
  } catch (error) {
    console.error(error);
    actionMessage = error.message || "Your answers could not be saved.";
  } finally {
    saving = false;
  }
  render();
}

async function loadFormData() {
  if (!requestedClientId || !requestedInstrumentId || !requestedPoint) {
    throw new Error("A client, form, and program point are required.");
  }
  const [clientsResult, definitionsResult, responsesResult] = await Promise.all([
    authedFetch("/api/clients"),
    authedFetch(`/api/evaluation-instruments/${encodeURIComponent(requestedInstrumentId)}/questions`),
    authedFetch(`/api/evaluation-responses?clientId=${encodeURIComponent(requestedClientId)}&instrumentId=${encodeURIComponent(requestedInstrumentId)}`)
  ]);
  client = (clientsResult.clients || []).find((item) => item.id === requestedClientId) || null;
  instrument = definitionsResult.instrument || null;
  questions = clinicEvaluationQuestionsForInstrument(definitionsResult.questions || [], instrument?.id || "");
  const availableResponses = responsesResult.responses || [];
  response = availableResponses.find((item) => item.id === requestedResponseId)
    || availableResponses.find((item) => item.administrationPoint === requestedPoint)
    || null;
  if (!client) throw new Error("The selected client could not be found.");
  if (!instrument || !questions.length) throw new Error("The selected form version is not available.");
  if (!instrument.administrationPoints.includes(requestedPoint)) throw new Error("This form does not support the selected program point.");
  if (mode === "review" && !response) throw new Error("The previous response could not be found.");
  hydrateAnswers();
  hydratePrefilledAnswers();
  staffResponseDate = response?.responseDate || dateKey();
  document.title = `${instrument.name} | The SNACK Program`;
  render();
}

function packetDefinition(instruments = []) {
  const healthInstrument = clinicHealthInstrumentFor(instruments);
  const knowledgeInstrument = clinicKnowledgeInstrumentFor(instruments);
  const definitions = requestedPacket === "enrollment"
    ? [
        { instrument: clinicInstrumentForFormType(instruments, "Enrollment"), administrationPoint: "Enrollment" },
        { instrument: clinicInstrumentForFormType(instruments, "HRSN Screener"), administrationPoint: "Enrollment" },
        { instrument: healthInstrument, administrationPoint: "Enrollment" }
      ]
    : [
        { instrument: healthInstrument, administrationPoint: "Graduation" },
        { instrument: knowledgeInstrument, administrationPoint: "Graduation" },
        { instrument: clinicInstrumentForFormType(instruments, "Child Feedback"), administrationPoint: "Graduation" },
        { instrument: clinicInstrumentForFormType(instruments, "Caregiver Feedback"), administrationPoint: "Graduation" }
      ];
  return definitions.filter((item) => item.instrument);
}

async function loadPacketData() {
  if (!requestedClientId || !requestedPacket) throw new Error("A client and packet type are required.");
  const packetResult = await authedFetch(`/api/evaluation-packets/${encodeURIComponent(requestedPacket)}/${encodeURIComponent(requestedClientId)}`);
  client = packetResult.client || null;
  if (!client) throw new Error("The selected client could not be found.");

  const allQuestions = packetResult.questions || [];
  const allResponses = packetResult.responses || [];
  packetItems = packetDefinition(packetResult.instruments || []).map((item) => ({
    ...item,
    questions: clinicEvaluationQuestionsForInstrument(allQuestions, item.instrument.id),
    response: allResponses.find((candidate) => (
      candidate.instrumentId === item.instrument.id
      && candidate.administrationPoint === item.administrationPoint
    )) || null
  })).filter((item) => item.questions.length);
  if (!packetItems.length) throw new Error("The active forms for this packet are not available.");
  document.title = `${requestedPacket === "enrollment" ? "Enrollment" : "Graduation"} Packet | The SNACK Program`;
  render();
}

app.addEventListener("click", (event) => {
  const answerButton = event.target.closest("[data-answer-question]");
  if (answerButton && !saving) {
    const questionId = answerButton.dataset.answerQuestion;
    const field = answerButton.dataset.answerField;
    const value = answerButton.dataset.answerValue;
    if (answerButton.dataset.answerMultiple === "true") {
      const selected = Array.isArray(answerFor(questionId)[field]) ? answerFor(questionId)[field] : [];
      setAnswer(questionId, field, selected.includes(value)
        ? selected.filter((candidate) => candidate !== value)
        : [...selected, value]);
    } else {
      setAnswer(questionId, field, value);
    }
    actionMessage = "";
    render();
    return;
  }
  const staffGroupButton = event.target.closest("[data-staff-group-index]");
  if (staffGroupButton && !saving) {
    stepIndex = Number(staffGroupButton.dataset.staffGroupIndex) || 0;
    actionMessage = "";
    render();
    return;
  }
  const staffSaveButton = event.target.closest("[data-staff-save]");
  if (staffSaveButton) {
    saveStaffResponse(staffSaveButton.dataset.staffSave);
    return;
  }
  if (event.target.closest("[data-staff-delete-draft]")) {
    deleteStaffDraft();
    return;
  }
  if (event.target.closest("[data-client-form-back]")) {
    moveBack();
    return;
  }
  if (event.target.closest("[data-client-form-exit]")) {
    window.location.assign(returnUrl());
    return;
  }
  if (event.target.closest("[data-print-form]")) window.print();
});

app.addEventListener("change", (event) => {
  if (event.target.matches("[data-staff-response-date]")) {
    staffResponseDate = event.target.value;
    actionMessage = "";
  }
});

app.addEventListener("input", (event) => {
  if (!event.target.matches("[data-answer-input]")) return;
  setAnswer(event.target.dataset.answerInput, "value", event.target.value);
  actionMessage = "";
});

app.addEventListener("submit", (event) => {
  if (!event.target.matches("[data-client-form]")) return;
  event.preventDefault();
  moveNext();
});

async function initialize() {
  try {
    const [{ initializeApp }, { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js")
    ]);
    const auth = getAuth(initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG));
    const provider = new GoogleAuthProvider();
    const openSignIn = () => signInWithPopup(auth, provider).catch((error) => renderError(error.message));
    onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      if (!user) {
        renderSignedOut(openSignIn);
        return;
      }
      try {
        if (requestedPacket) await loadPacketData();
        else await loadFormData();
      } catch (error) {
        console.error(error);
        renderError(error.message || "The form could not be loaded.");
      }
    });
  } catch (error) {
    console.error(error);
    renderError("The secure sign-in connection could not be started.");
  }
}

initialize();
