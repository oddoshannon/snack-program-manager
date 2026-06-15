import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const publicDir = new URL("../../frontend/public/", import.meta.url);
const indexHtml = await readFile(new URL("index.html", publicDir), "utf8");
const bookingHtml = await readFile(new URL("booking.html", publicDir), "utf8");
const appJs = await readFile(new URL("app.js", publicDir), "utf8");
const bookingJs = await readFile(new URL("booking.js", publicDir), "utf8");
const stylesCss = await readFile(new URL("styles.css", publicDir), "utf8");
const appConfigJs = await readFile(new URL("app-config.js", publicDir), "utf8");

function assertInOrder(source, values) {
  let cursor = -1;

  for (const value of values) {
    const index = source.indexOf(value);
    assert.ok(index > cursor, `${value} should appear after the previous marker`);
    cursor = index;
  }
}

test("main shell exposes the primary modules in the left nav", () => {
  assertInOrder(indexHtml, [
    'id="nav-workflow"',
    'id="nav-scheduling"',
    'id="nav-crm"',
    'id="nav-outreach"',
    'id="nav-dashboard"'
  ]);

  assert.match(indexHtml, /Protected Program Manager/);
  assert.match(indexHtml, /Sign in with Google/);
  assert.match(indexHtml, /SNACK Google account/);
});

test("CRM dashboard focuses on metrics and clients without next appointments", () => {
  assert.match(indexHtml, /id="dashboard-summary"/);
  assert.match(indexHtml, /Program Metrics/);
  assert.match(indexHtml, /Clients Without Next Appointment/);
});

test("workflow module includes start-day controls and a task summary", () => {
  assert.match(indexHtml, /id="start-day"/);
  assert.match(indexHtml, /id="new-task"/);
  assert.match(indexHtml, /id="workflow-task-summary"/);
  assert.match(indexHtml, /Daily work queue for referrals, reschedules, scheduling prep, and follow-up/);
});

test("admin settings surface current scheduling rules", () => {
  assert.match(indexHtml, /id="admin-tab-settings"/);
  assert.match(indexHtml, /id="admin-tab-grants"/);
  assert.match(indexHtml, /Scheduling Settings/);
  assert.match(indexHtml, /Tuesday, Wednesday, Thursday/);
  assert.match(indexHtml, /1:00 PM - 6:00 PM/);
  assert.match(indexHtml, /30 minutes/);
  assert.match(indexHtml, /15 minutes/);
  assert.match(indexHtml, /45 minutes for 3\+ clients/);
  assert.match(stylesCss, /\.admin-settings-list/);
});

test("admin grants tab exposes deadlines, grant list, reusable answers, and organization info", () => {
  assert.match(indexHtml, /id="admin-grants-view"/);
  assert.match(appJs, /dashboardTitle\.textContent = showAdminGrants \? "Grants" : "Admin"/);
  assert.equal(indexHtml.includes("Grant Tracker"), false);
  assert.equal(indexHtml.includes("Funding</p>"), false);
  assertInOrder(indexHtml, [
    'id="admin-grants-actions"',
    'id="grant-search"',
    'id="new-grant"',
    'id="admin-settings-view"',
    'id="admin-grants-view"'
  ]);
  assert.match(indexHtml, /id="grant-deadline-list"/);
  assert.match(indexHtml, /id="grants-list"/);
  assert.match(indexHtml, /id="grant-org-card"/);
  assert.match(indexHtml, /id="grant-question-card"/);
  assert.match(indexHtml, /id="grant-question-form"/);
  assert.match(indexHtml, /id="grant-org-form"/);
  assert.match(indexHtml, /Reusable Answers/);
  assert.match(indexHtml, /DBA name/);
  assert.match(indexHtml, /Guiding principles/);
  assert.match(indexHtml, /Board roster link/);
  assert.match(indexHtml, /CHA \/ CHIP link/);
  assert.match(indexHtml, /Balance sheet link/);
  assert.match(indexHtml, /Profit &amp; Loss Statement link/);
  assert.match(indexHtml, /Strategic Plan link/);
  assert.match(indexHtml, /Annual Report link/);
  assert.equal(indexHtml.includes("Service area"), false);
  assert.equal(indexHtml.includes("Organization description / reusable copy"), false);
});

test("grant modal captures application details, portal info, awards, reports, and document links", () => {
  const grantModal = indexHtml.slice(indexHtml.indexOf('id="grant-modal"'), indexHtml.indexOf('id="crm-tabs"'));

  for (const field of [
    "foundationName",
    "grantName",
    "deadlineDate",
    "focusAreas",
    "recurrence",
    "applicationFrequency",
    "contactName",
    "websiteUrl",
    "portalUrl",
    "portalLoginNotes",
    "amountMin",
    "amountMax",
    "reportingRequirements",
    "pastGrantReceived",
    "completedApplicationUrl",
    "grantAgreementUrl",
    "budgetUrl",
    "finalReportUrl",
    "brandingUrl"
  ]) {
    assert.match(grantModal, new RegExp(`name="${field}"`));
  }

  assert.match(grantModal, /<option value="Not A Good Fit">Not A Good Fit<\/option>/);
});

test("grants index stays compact with profile and answer modals", () => {
  assert.match(indexHtml, /id="grant-detail"/);
  assert.match(indexHtml, /id="new-grant-question"/);
  assert.match(indexHtml, /id="grant-question-modal"/);
  assert.equal(indexHtml.includes("Sorted by next application deadline"), false);
  assert.equal(indexHtml.includes("Foundation details, portals, reports, and document links"), false);
  assert.match(stylesCss, /\.grant-list-row/);
  assert.match(stylesCss, /\.grant-profile-grid/);
  assert.match(stylesCss, /\.grant-edit-profile-grid/);
  assert.match(stylesCss, /\.grant-form > \.grant-edit-profile-grid\s*{\s*grid-column: 1 \/ -1;/);
  assert.match(stylesCss, /\.grant-reference-card/);
  assert.match(stylesCss, /#grant-search\s*{[^}]*width: min\(240px, 36vw\);/s);
  assert.match(stylesCss, /\.grant-question-card \.grant-reference-actions\s*{[^}]*margin-bottom: 10px;/s);
  assert.match(stylesCss, /\.grant-deadline-item\s*{[^}]*border-left: 4px solid var\(--brand-red\);/s);
});

test("grant interactions open profiles, support question editing, and close on backdrop click", () => {
  assert.match(appJs, /function openGrantProfile/);
  assert.match(appJs, /row\.addEventListener\("click", \(\) => openGrantProfile\(grant\.id\)\)/);
  assert.match(appJs, /card\.addEventListener\("click", \(\) => openGrantProfile\(grant\.id\)\)/);
  assert.match(appJs, /function startEditGrantQuestion/);
  assert.match(appJs, /\/api\/grant-questions\/\$\{encodeURIComponent\(editingGrantQuestionId\)\}/);
  assert.match(appJs, /event\.target === grantModal/);
  assert.match(appJs, /event\.target === grantQuestionModal/);
  assert.match(appJs, /function grantDisclosureStateKey/);
  assert.match(appJs, /bindGrantDisclosureState\(grantOrgCard, "organization-info"\)/);
  assert.match(appJs, /bindGrantDisclosureState\(grantQuestionCard, "reusable-answers"\)/);
});

test("scheduling module keeps calendar, today board, and bottom list views", () => {
  assert.match(indexHtml, /id="appointment-summary"/);
  assert.match(indexHtml, /id="scheduling-calendar"/);
  assert.match(indexHtml, /id="scheduling-today-board"/);
  assert.match(indexHtml, /id="appointments-list"/);
});

test("scheduling module exposes printable daily schedule and prep sheets", () => {
  assert.match(indexHtml, /id="print-today-schedule"/);
  assert.match(indexHtml, /id="print-prep-sheets"/);
  assert.match(indexHtml, /id="print-note-sheets"/);
  assert.match(appJs, /function printTodaySchedule/);
  assert.match(appJs, /function printPrepSheets/);
  assert.match(appJs, /function printAppointmentNoteSheets/);
  assert.match(appJs, /window\.open\("", "_blank"\)/);
  assert.match(appJs, /Appointment Prep Sheets/);
  assert.match(appJs, /Appointment Note Sheets/);
});

test("appointment prep checklist mirrors the When to Give What guide", () => {
  assert.match(appJs, /Enrollment form \(file cabinet\); siblings can share one form/);
  assert.match(appJs, /Questionnaire for each child \(file cabinet\); each child needs their own/);
  assert.match(appJs, /HRSN screener for YCCO client \(file cabinet\)/);
  assert.match(appJs, /Workbook/);
  assert.match(appJs, /1 SNACK tumbler per child/);
  assert.match(appJs, /1 \$50 grocery gift card per family/);
});

test("printable appointment note sheets include handwritten visit note prompts", () => {
  assert.match(appJs, /Visit Notes/);
  assert.match(appJs, /Lesson \/ Topics Covered/);
  assert.match(appJs, /Client Response \/ Observations/);
  assert.match(appJs, /Goal Set Today/);
  assert.match(appJs, /Follow-Up \/ Chart Note To-Do/);
  assert.match(appJs, /print-lines/);
});

test("client edit form uses the same profile-grid shell as profile view", () => {
  assert.match(indexHtml, /id="client-form" class="referral-form client-profile-edit-form"/);
  assert.match(indexHtml, /client-profile-grid/);
  assert.match(indexHtml, /client-admin-strip/);
  assert.match(indexHtml, /Client Details/);

  assert.match(indexHtml, /id="referral-form" class="referral-form client-profile-edit-form"/);
  assert.match(indexHtml, /referral-person-card/);
  assert.match(indexHtml, /id="referral-edit-sibling-summary"/);
});

test("referral edit form uses profile cards for source and appointment fields", () => {
  const referralForm = indexHtml.slice(indexHtml.indexOf('id="referral-form"'), indexHtml.indexOf('id="client-modal"'));

  assert.match(referralForm, /id="referral-source-display" class="profile-source-text is-empty">None linked yet/);
  assert.match(referralForm, /<span>Last Appt<\/span>\s*<input id="last-appointment-date"/);
  assert.equal(referralForm.includes("<span>Graduation Date</span>"), false);
  assertInOrder(referralForm, [
    "client-profile-grid",
    "client-admin-strip",
    "Referral Details",
    "Provider Profiles"
  ]);
});

test("client detail edit cards keep Referral, Contact, Insurance, and Assessment sections", () => {
  const clientForm = indexHtml.slice(indexHtml.indexOf('id="client-form"'));

  assertInOrder(clientForm, [
    "<strong>Referral</strong>",
    "<strong>Contact</strong>",
    "<strong>Insurance</strong>",
    "<strong>Assessment</strong>"
  ]);
});

test("client contact section keeps opt-outs before address", () => {
  assertInOrder(indexHtml, [
    'id="client-email-opt-out"',
    'id="client-text-opt-out"',
    'id="client-address-street"'
  ]);
});

test("insurance section exposes YCCO and HRSN as checkboxes", () => {
  assert.match(indexHtml, /id="client-ycco" name="ycco" type="checkbox"/);
  assert.match(indexHtml, /id="client-hrsn" name="hrsn" type="checkbox"/);
  assert.match(indexHtml, /id="ycco" name="ycco" type="checkbox"/);
  assert.match(indexHtml, /id="hrsn" name="hrsn" type="checkbox"/);
});

test("provider profile links keep referral source displays in sync", () => {
  assert.match(appJs, /function syncReferralSourceFromLinks/);
  assert.match(appJs, /function syncClientReferralSourceFromLinks/);
  assert.match(appJs, /setProfileSourceDisplay\(referralSourceDisplay, source\)/);
  assert.match(appJs, /setProfileSourceDisplay\(clientReferralSourceDisplay, source\)/);
  assert.match(appJs, /None linked yet/);
  assert.match(stylesCss, /\.client-profile-field \.profile-source-text\.is-empty/);
});

test("activity log modal supports call/text direction, result, date, time, and description", () => {
  assert.match(indexHtml, /id="activity-log-direction"/);
  assert.match(indexHtml, /id="activity-log-result"/);
  assert.match(indexHtml, /id="activity-log-date"/);
  assert.match(indexHtml, /id="activity-log-time"/);
  assert.match(indexHtml, /id="activity-log-description"/);
});

test("appointment completion flow can complete and schedule the next visit", () => {
  assert.match(indexHtml, /id="appointment-complete-form"/);
  assert.match(indexHtml, /Complete (?:&amp;|&) Schedule/);
  assert.match(indexHtml, /id="completion-schedule-next"/);
  assert.match(indexHtml, /id="completion-next-time"/);
});

test("sibling modal is a button-driven profile link flow", () => {
  assert.match(indexHtml, /id="sibling-modal"/);
  assert.match(indexHtml, /Add Sibling/);
  assert.match(indexHtml, /id="sibling-search"/);
});

test("CSV import modals exist for referrals, clients, and providers", () => {
  assert.match(indexHtml, /id="referral-import-modal"/);
  assert.match(indexHtml, /id="client-import-modal"/);
  assert.match(indexHtml, /id="network-import-modal"/);
});

test("app config points localhost at the local API and production at same-origin", () => {
  assert.match(appConfigJs, /API_BASE_URL/);
  assert.match(appConfigJs, /localhost/);
  assert.match(appConfigJs, /http:\/\/localhost:8080/);
  assert.match(appConfigJs, /projectId: "snack-crm"/);
});

test("public booking page has a standalone three-step form", () => {
  assert.match(bookingHtml, /Book an Appointment/);
  assert.match(bookingHtml, /id="public-service-id"/);
  assert.match(bookingHtml, /id="public-availability"/);
  assert.match(bookingHtml, /Child first name/);
  assert.match(bookingHtml, /class="public-field public-honeypot"/);
  assert.match(bookingHtml, /name="website"/);
  assert.match(bookingHtml, /Book Appointment/);
  assertInOrder(bookingHtml, [
    '<script src="./app-config.js"></script>',
    '<script type="module" src="./booking.js'
  ]);
});

test("public booking JavaScript uses public endpoints and guards submission", () => {
  assert.match(bookingJs, /\/api\/public\/booking-options/);
  assert.match(bookingJs, /\/api\/public\/availability/);
  assert.match(bookingJs, /\/api\/public\/bookings/);
  assert.equal(bookingJs.includes("/api/clients"), false);
  assert.match(bookingJs, /if \(!selectedSlot\)/);
  assert.match(bookingJs, /Choose an appointment time/);
  assert.match(bookingJs, /bookingForm\.hidden = true/);
  assert.match(bookingJs, /confirmationEl\.hidden = false/);
  assert.match(bookingJs, /Appointment booked/);
  assert.match(stylesCss, /\.public-honeypot/);
});

test("SNACK brand variables are present in the app stylesheet", () => {
  for (const color of ["#e23a4d", "#d27354", "#f4c753", "#078b4d", "#039cbb", "#004aad", "#7a33c2"]) {
    assert.match(stylesCss, new RegExp(color.replace("#", "#")));
  }
});

test("summary cards keep rainbow order for six-card modules", () => {
  assertInOrder(stylesCss, [
    ".summary-item:nth-child(1) { --summary-accent: var(--brand-red); }",
    ".summary-item:nth-child(2) { --summary-accent: var(--brand-orange); }",
    ".summary-item:nth-child(3) { --summary-accent: var(--brand-yellow); }",
    ".summary-item:nth-child(4) { --summary-accent: var(--brand-green); }",
    ".summary-item:nth-child(5) { --summary-accent: var(--brand-teal); }",
    ".summary-item:nth-child(6) { --summary-accent: var(--brand-blue); }"
  ]);
});

test("workflow task summary uses the shared counter-card system", () => {
  assert.match(stylesCss, /\.task-summary\s*{\s*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\);/);
  assert.match(indexHtml, /class="summary-grid task-summary"/);
});

test("frontend script wires grants API resources and Admin Grants navigation", () => {
  assert.match(appJs, /activeAdminView/);
  assert.match(appJs, /function setAdminView/);
  assert.match(appJs, /\/api\/grants/);
  assert.match(appJs, /\/api\/grant-questions/);
  assert.match(appJs, /\/api\/grant-organization-info/);
  assert.match(appJs, /function renderGrantDeadlines/);
  assert.match(appJs, /function saveGrantOrganizationInfo/);
  assert.match(stylesCss, /\.grants-layout/);
  assert.match(stylesCss, /\.grant-card/);
});

test("grant tracker includes a draggable colored flow board and closed archive", () => {
  assert.match(indexHtml, /id="grant-flow-board"/);
  assert.match(indexHtml, /Grant Flow/);
  assert.match(appJs, /const grantFlowColumns = \[/);
  assertInOrder(appJs, [
    'label: "Upcoming Grants", statuses: ["Researching", "Planning"], accent: "var(--brand-red)"',
    'label: "In Progress", statuses: ["In Progress"], accent: "var(--brand-green)"',
    'label: "Submitted", statuses: ["Submitted"], accent: "var(--brand-blue)"',
    'label: "Awarded", statuses: ["Awarded", "Reporting"], accent: "var(--brand-purple)"',
    'label: "Closed Grants Archive"'
  ]);
  assert.match(appJs, /statuses: \["Not A Good Fit", "Declined", "Closed"\]/);
  assert.match(appJs, /\["Awarded", "Reporting", "Not A Good Fit", "Declined", "Closed"\]/);
  assert.match(appJs, /dragKind: "grant-flow"/);
  assert.match(appJs, /function moveGrantToFlowColumn/);
  assert.match(appJs, /function updateGrantStatus/);
  assert.match(stylesCss, /\.grant-flow-card\s*{\s*grid-column: 1 \/ -1;/);
  assert.match(stylesCss, /\.grant-flow-card \.flow-lanes\s*{\s*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\);/);
});

test("archive cards hover like flow cards instead of turning solid green", () => {
  const archiveHover = stylesCss.slice(stylesCss.indexOf(".flow-archive:hover"), stylesCss.indexOf(".flow-archive h4"));

  assert.match(archiveHover, /box-shadow/);
  assert.equal(/background:\s*var\(--brand-green\)/.test(archiveHover), false);
});

test("left navigation remains sticky and independently scrollable", () => {
  const sidebarBlock = stylesCss.slice(stylesCss.indexOf(".sidebar {"), stylesCss.indexOf(".sidebar .eyebrow"));

  assert.match(sidebarBlock, /position: sticky/);
  assert.match(sidebarBlock, /height: 100vh/);
  assert.match(sidebarBlock, /overflow-y: auto/);
});

test("public booking CSS has mobile responsive safeguards", () => {
  assert.match(stylesCss, /@media \(max-width: 760px\)/);
  assert.match(stylesCss, /\.public-booking-step,\s*\.public-booking-grid\s*{\s*grid-template-columns: 1fr;/);
});

test("frontend script includes public-facing and staff-facing appointment duration rules", () => {
  assert.match(appJs, /function appointmentDurationMinutes/);
  assert.match(appJs, /durationMinutes/);
  assert.match(appJs, /clientIds/);
});

test("frontend task flow columns are explicitly color-coded", () => {
  assert.match(appJs, /label: "Calls", color: "var\(--brand-red\)"/);
  assert.match(appJs, /label: "Texts", color: "var\(--brand-green\)"/);
  assert.match(appJs, /label: "Forms", color: "var\(--brand-blue\)"/);
  assert.match(appJs, /label: "Tasks", color: "var\(--brand-purple\)"/);
});

test("CRM archive labels are capitalized and concise", () => {
  assert.match(appJs, /Closed Referrals Archive/);
  assert.match(appJs, /Graduated Clients Archive/);
  assert.match(appJs, /Closed Clients Archive/);
  assert.equal(appJs.includes("not front and center"), false);
});
