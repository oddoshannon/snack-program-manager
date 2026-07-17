import {
  appointmentLessonNumber,
  appointmentLessonTitles,
  clientFullName,
  formatScheduleTime,
  scheduleTimeMinutes
} from "./schedule.js";

const excludedPrintStatuses = new Set(["Canceled", "Rescheduled"]);

export const lessonRetentionPrompts = Object.freeze({
  1: Object.freeze([]),
  2: Object.freeze([
    "Nutrient dense / sometimes foods"
  ]),
  3: Object.freeze([
    "Natural sugar & added sugar",
    "Find added sugar on label & # grams",
    "Nutrient dense / sometimes foods"
  ]),
  4: Object.freeze([
    "5 food groups",
    "Whole vs. white grains",
    "# food groups each meal / day",
    "Natural sugar & added sugar",
    "Find added sugar on label & # grams",
    "Nutrient dense / sometimes foods"
  ]),
  5: Object.freeze([
    "3 macro (big) nutrients",
    "Fiber, protein, fat foods",
    "5 food groups",
    "Whole vs. white grains",
    "# food groups each meal / day",
    "Natural sugar & added sugar",
    "Find added sugar on label & # grams",
    "Nutrient dense / sometimes foods"
  ]),
  6: Object.freeze([
    "2 micro (small) nutrients",
    "Why eat the rainbow",
    "3 macro (big) nutrients",
    "Fiber, protein, fat foods",
    "5 food groups",
    "Whole vs. white grains",
    "# food groups each meal / day",
    "Natural sugar & added sugar",
    "Find added sugar on label & # grams",
    "Nutrient dense / sometimes foods"
  ]),
  7: Object.freeze([
    "Mindful eating & how to do it",
    "Hunger & fullness cues",
    "2 micro (small) nutrients",
    "Why eat the rainbow",
    "3 macro (big) nutrients",
    "Fiber, protein, fat foods",
    "5 food groups",
    "Whole vs. white grains",
    "# food groups each meal / day",
    "Natural sugar & added sugar",
    "Find added sugar on label & # grams",
    "Nutrient dense / sometimes foods"
  ])
});

const enrollmentPrompts = Object.freeze([
  "What do you know about the program? What interested you in making an appointment?",
  "What do you do that makes you feel healthy?",
  "Is there anything you wish you did that would make you feel more healthy?",
  "Caregiver health goals or anything they would like the client to work on",
  "Foods enjoyed or preferred not to eat"
]);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function formatLongDate(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""))) {
    return String(dateKey || "Date not listed");
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${dateKey}T00:00:00`));
}

function formatWeekday(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""))) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", { weekday: "long" })
    .format(new Date(`${dateKey}T00:00:00`));
}

function formatBirthdate(dateKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""))) {
    return String(dateKey || "Not listed");
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  return `${month}/${day}/${year}`;
}

function caregiverFirstName(value) {
  return String(value || "").trim().split(/\s+/)[0] || "";
}

function appointmentDate(item) {
  return item?.date || item?.source?.appointmentDate || "";
}

function appointmentTime(item) {
  return item?.time || item?.source?.appointmentTime || "";
}

function appointmentStatus(item) {
  return String(item?.status || item?.source?.status || "Scheduled").trim();
}

function appointmentType(item) {
  return String(item?.type || item?.source?.appointmentType || "").replace(/\s+Appointment$/i, "").trim();
}

function appointmentClientIds(item) {
  const values = item?.clientIds || item?.source?.clientIds || [];
  const fallback = item?.source?.clientId ? [item.source.clientId] : [];
  return unique((Array.isArray(values) && values.length ? values : fallback).map(String));
}

function appointmentClientNames(item) {
  const values = item?.clientNames || item?.source?.clientNames || [];
  const fallback = item?.source?.clientName ? [item.source.clientName] : [];
  return unique((Array.isArray(values) && values.length ? values : fallback).map(String));
}

function isBlocked(item) {
  return appointmentStatus(item) === "Blocked" || appointmentType(item) === "Administrative";
}

function isCheckIn(item) {
  return /^check[ -]?in$/i.test(String(item?.lesson || item?.source?.lesson || "").trim());
}

function lessonNumber(item) {
  return appointmentLessonNumber(item?.lesson || item?.source?.lesson);
}

function lessonTitle(item) {
  if (isCheckIn(item)) return "Check In";
  if (appointmentType(item) === "Enrollment") return "Enrollment";
  return appointmentLessonTitles[lessonNumber(item)] || String(item?.lesson || item?.source?.lesson || appointmentType(item) || "Appointment");
}

function appointmentSortValue(item) {
  return `${appointmentDate(item)}T${appointmentTime(item) || "00:00"}`;
}

function appointmentsShareClient(first, second) {
  const firstIds = appointmentClientIds(first);
  const secondIds = appointmentClientIds(second);
  if (firstIds.length && secondIds.length) {
    return firstIds.some((id) => secondIds.includes(id));
  }

  const firstNames = appointmentClientNames(first).map((name) => name.toLowerCase());
  const secondNames = appointmentClientNames(second).map((name) => name.toLowerCase());
  return firstNames.some((name) => secondNames.includes(name));
}

function previousAppointment(item, allItems) {
  const currentSortValue = appointmentSortValue(item);
  return [...allItems]
    .filter((candidate) => candidate?.id !== item?.id)
    .filter((candidate) => !excludedPrintStatuses.has(appointmentStatus(candidate)))
    .filter((candidate) => !isBlocked(candidate))
    .filter((candidate) => appointmentsShareClient(candidate, item))
    .filter((candidate) => appointmentSortValue(candidate) < currentSortValue)
    .sort((first, second) => appointmentSortValue(second).localeCompare(appointmentSortValue(first)))[0];
}

function appointmentInterval(item, allItems) {
  const previous = previousAppointment(item, allItems);
  if (!previous) {
    return appointmentType(item) === "Enrollment" ? "New enrollment" : "Not available";
  }

  const currentDate = new Date(`${appointmentDate(item)}T00:00:00`);
  const previousDate = new Date(`${appointmentDate(previous)}T00:00:00`);
  const days = Math.max(0, Math.round((currentDate - previousDate) / 86400000));
  return `${days} days since ${formatLongDate(appointmentDate(previous))}`;
}

export function printableScheduleItems(items, dateKey) {
  return items
    .filter((item) => appointmentDate(item) === dateKey)
    .filter((item) => !excludedPrintStatuses.has(appointmentStatus(item)))
    .sort((first, second) => appointmentTime(first).localeCompare(appointmentTime(second))
      || appointmentClientNames(first).join(" ").localeCompare(appointmentClientNames(second).join(" ")));
}

export function appointmentPrintClients(item, clientsById = new Map()) {
  const records = appointmentClientIds(item)
    .map((id) => clientsById.get(id))
    .filter(Boolean);
  const matchedNames = new Set(records.map((client) => clientFullName(client).toLowerCase()));
  const fallback = appointmentClientNames(item)
    .filter((name) => !matchedNames.has(name.toLowerCase()))
    .map((name) => ({ firstName: name, lastName: "" }));

  return [...records, ...fallback].map((client) => ({
    id: client.id || "",
    name: clientFullName(client) || client.firstName || "Client",
    firstName: client.firstName || String(client.name || "Client").split(/\s+/)[0],
    caregiver: caregiverFirstName(client.parentName || client.caregiver),
    language: client.preferredLanguage || client.language || "",
    birthdate: client.dateOfBirth || client.birthdate || ""
  }));
}

export function appointmentPrepGroups(item) {
  if (isBlocked(item)) {
    return { forms: [], supplies: [] };
  }

  if (appointmentType(item) === "Enrollment") {
    return {
      forms: [
        "Enrollment form (file cabinet); siblings can share one form.",
        "Questionnaire for each child (file cabinet); each child needs their own.",
        "Write client name in the top right corner, initial code on the back, and circle PRE.",
        "Place forms at reception before the appointment."
      ],
      supplies: ["SNACK sticker.", "SNACK pen or pencil."]
    };
  }

  const lesson = lessonNumber(item);
  if (lesson === 1) {
    return {
      forms: [],
      supplies: ["Workbook.", "Prize from the bin.", "Food snack."]
    };
  }

  if (lesson >= 2 && lesson <= 6) {
    return {
      forms: [],
      supplies: ["Prize from the bin.", "Food snack."]
    };
  }

  if (lesson === 7) {
    return {
      forms: [
        "Questionnaire for each child (file cabinet); each child needs their own.",
        "Write client name in the top right corner, initial code on the back, and circle POST.",
        "Child Feedback form for each child (file cabinet); each child needs their own.",
        "Parent Feedback form (file cabinet).",
        "Client can complete it with you or in the lobby and return it to the front desk.",
        "Place forms at reception before the appointment."
      ],
      supplies: ["1 SNACK tumbler per child.", "1 $50 grocery gift card per family.", "Food snack."]
    };
  }

  if (isCheckIn(item)) {
    return {
      forms: ["Review the client's most recent goal and appointment notes.", "Check In note sheet."],
      supplies: ["Food snack."]
    };
  }

  return {
    forms: [],
    supplies: ["Prize from the bin.", "Food snack."]
  };
}

export function noteRetentionForAppointment(item) {
  return lessonRetentionPrompts[lessonNumber(item)] || [];
}

export function appointmentNoteType(item) {
  if (appointmentType(item) === "Enrollment") return "enrollment";
  if (isCheckIn(item)) return "check-in";
  return "lesson";
}

function pageHeader(title, dateKey) {
  return `
    <header class="print-header">
      <div class="note-title"><h1>${escapeHtml(title)}</h1></div>
      <div class="print-date">
        <span>${escapeHtml(formatWeekday(dateKey))}</span>
        <strong>${escapeHtml(formatLongDate(dateKey))}</strong>
      </div>
    </header>
  `;
}

function visitSummary(item, clientsById, allItems, { showGoal = true } = {}) {
  const clients = appointmentPrintClients(item, clientsById);
  const names = clients.map((client) => client.name);
  const caregivers = unique(clients.map((client) => client.caregiver));
  const languages = unique(clients.map((client) => client.language));
  const birthdates = clients.map((client) => `<span>${clients.length > 1 ? `${escapeHtml(client.firstName)}: ` : ""}${escapeHtml(formatBirthdate(client.birthdate))}</span>`).join("");
  const goal = String(item?.goal || item?.source?.goal || "").trim();

  return `
    <section class="visit-summary" aria-label="Appointment details">
      <dl class="visit-details">
        <div class="client-detail"><dt>${names.length === 1 ? "Client" : "Clients"}</dt><dd>${escapeHtml(names.join(" & ") || "Client not listed")}</dd></div>
        <div><dt>Caregiver</dt><dd>${escapeHtml(caregivers.join(" / ") || "Not listed")}</dd></div>
        <div><dt>Language</dt><dd>${escapeHtml(languages.join(" / ") || "Not listed")}</dd></div>
        <div><dt>${clients.length === 1 ? "Birthdate" : "Birthdates"}</dt><dd class="birthdate-list">${birthdates || "<span>Not listed</span>"}</dd></div>
        <div><dt>Time</dt><dd>${escapeHtml(formatScheduleTime(scheduleTimeMinutes(appointmentTime(item))))}</dd></div>
        <div><dt>Interval since last appointment</dt><dd>${escapeHtml(appointmentInterval(item, allItems))}</dd></div>
      </dl>
      ${showGoal ? `<div class="current-goal"><strong>Previous Goal</strong><span>${escapeHtml(goal || "Not listed")}</span></div>` : ""}
    </section>
  `;
}

function writingBox(label, className = "") {
  return `<div class="writing-box ${className}"><span>${escapeHtml(label)}</span></div>`;
}

function nextAppointmentRow() {
  return `
    <div class="next-appointment-row">
      <div class="next-appointment-choice"><strong>Next appointment scheduled</strong><i aria-hidden="true"></i></div>
      <div class="next-appointment-date"><span>Date</span><em aria-hidden="true"></em></div>
    </div>
  `;
}

function knowledgeList(prompts) {
  if (!prompts.length) return "";
  const columns = prompts.length > 6 ? 2 : 1;
  const rows = Math.ceil(prompts.length / columns);

  return `
    <section class="note-section knowledge-section">
      <h2>Knowledge Retention</h2>
      <div class="knowledge-list is-variable ${columns === 2 ? "is-two-column" : "is-one-column"}" style="--knowledge-rows: ${rows};">
        ${prompts.map((prompt, index) => `
          <div class="knowledge-row ${index >= rows ? "is-column-start" : ""} ${index % rows ? "has-row-border" : ""}">
            <span>${escapeHtml(prompt)}</span>
            <span class="knowledge-choice"><strong>Yes</strong><i></i></span>
            <span class="knowledge-choice"><strong>No</strong><i></i></span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function lessonNotePage(item, clientsById, allItems) {
  const lesson = lessonNumber(item);
  const title = appointmentLessonTitles[lesson] || lessonTitle(item);
  const retention = noteRetentionForAppointment(item);
  const pageClasses = ["print-page", "note-page", "generated-note-page"];
  if (retention.length) pageClasses.push("has-retention");
  if (lesson === 7) pageClasses.push("healthy-habits-page");

  return `
    <article class="${pageClasses.join(" ")}" aria-label="${escapeHtml(title)} appointment note">
      ${pageHeader(`${title} Appointment Note`, appointmentDate(item))}
      ${visitSummary(item, clientsById, allItems)}
      <section class="note-section">
        <h2>Goal Check In</h2>
        ${writingBox("How did the previous goal go? What helped or made it harder? Other updates or wins?", retention.length ? "retention-goal-check-box" : "goal-check-box")}
      </section>
      ${knowledgeList(retention)}
      <section class="note-section">
        <h2>Lesson: ${escapeHtml(title)}</h2>
        ${writingBox("Activities practiced / client response", retention.length ? "retention-lesson-box" : "lesson-box")}
      </section>
      <section class="note-section next-steps-section">
        <h2>Goal &amp; Next Steps</h2>
        ${writingBox("Goal set today", retention.length ? "retention-goal-box" : "goal-box")}
        ${nextAppointmentRow()}
        ${writingBox("Follow-up needed?", retention.length ? "retention-follow-up-box" : "follow-up-box")}
      </section>
    </article>
  `;
}

function enrollmentNotePage(item, clientsById, allItems) {
  return `
    <article class="print-page note-page generated-note-page enrollment-note-page" aria-label="Enrollment appointment note">
      ${pageHeader("Enrollment Appointment Note", appointmentDate(item))}
      ${visitSummary(item, clientsById, allItems, { showGoal: false })}
      <section class="note-section enrollment-conversation">
        <h2>Enrollment Conversation</h2>
        <div class="enrollment-prompt-grid">
          ${enrollmentPrompts.map((prompt) => writingBox(prompt, "enrollment-prompt-box")).join("")}
        </div>
      </section>
      <section class="note-section next-steps-section">
        <h2>Goal &amp; Next Steps</h2>
        <div class="enrollment-next-grid">
          ${writingBox("Goal", "enrollment-next-box")}
          ${writingBox("Next Lesson", "enrollment-next-box")}
        </div>
        ${nextAppointmentRow()}
      </section>
    </article>
  `;
}

function checkInNotePage(item, clientsById, allItems) {
  return `
    <article class="print-page note-page generated-note-page check-in-note-page" aria-label="Check In appointment note">
      ${pageHeader("Check In Appointment Note", appointmentDate(item))}
      ${visitSummary(item, clientsById, allItems)}
      <section class="note-section">
        <h2>Goal Check In</h2>
        ${writingBox("How did the previous goal go? What helped or made it harder? Other updates or wins?", "check-in-goal-box")}
      </section>
      <section class="note-section check-in-conversation">
        <h2>Today’s Conversation</h2>
        <div class="check-in-prompt-grid">
          ${writingBox("Is there anything you’d like to talk about today?", "check-in-prompt-box")}
          ${writingBox("What is one thing you would like help or support with?", "check-in-prompt-box")}
        </div>
      </section>
      <section class="note-section next-steps-section">
        <h2>Goal &amp; Next Steps</h2>
        ${writingBox("New Goal", "check-in-new-goal-box")}
        ${nextAppointmentRow()}
      </section>
    </article>
  `;
}

export function appointmentNotePage(item, clientsById = new Map(), allItems = []) {
  if (appointmentNoteType(item) === "enrollment") return enrollmentNotePage(item, clientsById, allItems);
  if (appointmentNoteType(item) === "check-in") return checkInNotePage(item, clientsById, allItems);
  return lessonNotePage(item, clientsById, allItems);
}

function scheduleRow(item, clientsById) {
  if (isBlocked(item)) {
    return `
      <article class="schedule-row blocked">
        <time>${escapeHtml(formatScheduleTime(scheduleTimeMinutes(appointmentTime(item))))}</time>
        <div class="appointment-main">
          <div class="appointment-heading"><h2>Blocked Time</h2><span>Administrative</span></div>
          <dl><div><dt>Duration</dt><dd>${escapeHtml(String(item?.duration || item?.source?.durationMinutes || 30))} minutes</dd></div></dl>
        </div>
      </article>
    `;
  }

  const clients = appointmentPrintClients(item, clientsById);
  return `
    <article class="schedule-row">
      <time>${escapeHtml(formatScheduleTime(scheduleTimeMinutes(appointmentTime(item))))}</time>
      <div class="appointment-main">
        <div class="appointment-heading"><h2>${escapeHtml(clients.map((client) => client.name).join(" & ") || "Client not listed")}</h2><span>${escapeHtml(lessonTitle(item))}</span></div>
        <dl>
          <div><dt>Caregiver</dt><dd>${escapeHtml(unique(clients.map((client) => client.caregiver)).join(" / ") || "Not listed")}</dd></div>
          <div><dt>Language</dt><dd>${escapeHtml(unique(clients.map((client) => client.language)).join(" / ") || "Not listed")}</dd></div>
        </dl>
      </div>
    </article>
  `;
}

export function dailySchedulePages(items, dateKey, clientsById = new Map()) {
  const printable = printableScheduleItems(items, dateKey);
  if (!printable.length) return [];

  const chunks = [];
  for (let index = 0; index < printable.length; index += 10) {
    chunks.push(printable.slice(index, index + 10));
  }

  return chunks.map((chunk, index) => `
    <article class="print-page daily-schedule-page" aria-label="Daily clinic schedule">
      ${pageHeader(`SNACK Daily Schedule${index ? " (continued)" : ""}`, dateKey)}
      <section class="schedule-list" aria-label="Appointments">${chunk.map((item) => scheduleRow(item, clientsById)).join("")}</section>
      <footer class="print-footer"><span>SNACK Program Manager</span><span>Daily clinic schedule</span></footer>
    </article>
  `);
}

function prepCard(item, clientsById) {
  const clients = appointmentPrintClients(item, clientsById);
  const groups = appointmentPrepGroups(item);
  const prepList = (entries) => entries.length
    ? `<ul class="check-list">${entries.map((entry) => `<li><i></i><span>${escapeHtml(entry)}</span></li>`).join("")}</ul>`
    : `<p class="empty-prep">None.</p>`;

  return `
    <article class="prep-card ${groups.forms.length > 4 ? "graduation" : "compact"}">
      <header class="prep-card-header">
        <time>${escapeHtml(formatScheduleTime(scheduleTimeMinutes(appointmentTime(item))))}</time>
        <h2>${escapeHtml(clients.map((client) => client.name).join(" & ") || "Client not listed")}</h2>
        <span>${escapeHtml(lessonTitle(item))}</span>
      </header>
      <div class="prep-columns">
        <section><h3>Forms</h3>${prepList(groups.forms)}</section>
        <section><h3>Supplies</h3>${prepList(groups.supplies)}</section>
      </div>
    </article>
  `;
}

export function appointmentPrepPage(item, clientsById = new Map()) {
  if (!item || isBlocked(item) || excludedPrintStatuses.has(appointmentStatus(item))) {
    return "";
  }

  return `
    <article class="print-page daily-prep-page" aria-label="Appointment prep list">
      ${pageHeader("Appointment Prep List", appointmentDate(item))}
      <section class="prep-list" aria-label="Appointment preparation list">${prepCard(item, clientsById)}</section>
      <footer class="print-footer"><span>SNACK Program Manager</span><span>Appointment prep list</span></footer>
    </article>
  `;
}

function prepPageChunks(items) {
  const chunks = [];
  let current = [];
  let weight = 0;

  items.forEach((item) => {
    const groups = appointmentPrepGroups(item);
    const itemWeight = groups.forms.length > 4 ? 3 : groups.forms.length > 2 ? 2 : 1;
    if (current.length && weight + itemWeight > 6) {
      chunks.push(current);
      current = [];
      weight = 0;
    }
    current.push(item);
    weight += itemWeight;
  });

  if (current.length) chunks.push(current);
  return chunks;
}

export function dailyPrepPages(items, dateKey, clientsById = new Map()) {
  const printable = printableScheduleItems(items, dateKey).filter((item) => !isBlocked(item));
  if (!printable.length) return [];

  return prepPageChunks(printable).map((chunk, index) => `
    <article class="print-page daily-prep-page" aria-label="Daily appointment prep list">
      ${pageHeader(`Daily Prep List${index ? " (continued)" : ""}`, dateKey)}
      <section class="prep-list" aria-label="Appointment preparation lists">${chunk.map((item) => prepCard(item, clientsById)).join("")}</section>
      <footer class="print-footer"><span>SNACK Program Manager</span><span>Daily appointment prep list</span></footer>
    </article>
  `);
}

export function dailyAppointmentNotePages(items, dateKey, clientsById = new Map()) {
  return printableScheduleItems(items, dateKey)
    .filter((item) => !isBlocked(item))
    .map((item) => appointmentNotePage(item, clientsById, items));
}

export function printDocumentHtml({ title, pages, baseHref, autoPrint = true }) {
  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <base href="${escapeHtml(baseHref)}">
        <title>${escapeHtml(title)}</title>
        <link rel="icon" type="image/png" href="./favicon.png">
        <link rel="stylesheet" href="./print-daily-template.css">
        <link rel="stylesheet" href="./print-prep-template.css">
        <link rel="stylesheet" href="./print-note-template.css">
        <link rel="stylesheet" href="./print-packet.css">
      </head>
      <body>
        <div class="print-toolbar"><strong>${escapeHtml(title)}</strong><button type="button" onclick="window.print()">Print</button></div>
        <main class="print-preview print-packet">${pages.join("")}</main>
        ${autoPrint ? `<script>window.addEventListener("load", () => document.fonts.ready.then(() => window.setTimeout(() => window.print(), 250)));</script>` : ""}
      </body>
    </html>`;
}

export function dailyPrintPacketPages(items, dateKey, clientsById = new Map()) {
  return [
    ...dailySchedulePages(items, dateKey, clientsById),
    ...dailyPrepPages(items, dateKey, clientsById),
    ...dailyAppointmentNotePages(items, dateKey, clientsById)
  ];
}
