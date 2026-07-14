import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";

const publicDir = new URL("../../frontend/public/", import.meta.url);
const indexHtml = await readFile(new URL("index.html", publicDir), "utf8");
const bookingHtml = await readFile(new URL("booking.html", publicDir), "utf8");
const appJs = await readFile(new URL("app.js", publicDir), "utf8");
const bookingJs = await readFile(new URL("booking.js", publicDir), "utf8");
const stylesCss = await readFile(new URL("styles.css", publicDir), "utf8");
const appConfigJs = await readFile(new URL("app-config.js", publicDir), "utf8");
const firebaseJson = await readFile(new URL("../../firebase.json", import.meta.url), "utf8");
const storageRules = await readFile(new URL("../../storage.rules", import.meta.url), "utf8");
const serverEntry = await readFile(new URL("../server.js", import.meta.url), "utf8");
const coreJs = await readFile(new URL("../lib/core.js", import.meta.url), "utf8");
const routeFiles = (await readdir(new URL("../routes/", import.meta.url))).sort();
const routesJs = (
  await Promise.all(routeFiles.map((file) => readFile(new URL(`../routes/${file}`, import.meta.url), "utf8")))
).join("\n");
const serverJs = [serverEntry, coreJs, routesJs].join("\n");
const printForms = await readdir(new URL("print-forms/", publicDir));

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
    'id="nav-fundraising"',
    'id="nav-dashboard"'
  ]);

  assert.match(indexHtml, /Protected Program Manager/);
  assert.match(indexHtml, /Sign in with Google/);
  assert.match(indexHtml, /SNACK Google account/);
});

test("CRM module stays focused on operational tabs", () => {
  assert.equal(indexHtml.includes('id="crm-tab-dashboard"'), false);
  assert.equal(indexHtml.includes('id="crm-dashboard-panel"'), false);
  assertInOrder(indexHtml, [
    'id="crm-tab-referrals"',
    'id="crm-tab-clients"',
    'id="crm-tab-referral-network"'
  ]);
  assert.match(indexHtml, /id="referrals-view-flow"[^>]*>Profiles<\/button>/);
  assert.match(indexHtml, /id="clients-view-flow"[^>]*>Profiles<\/button>/);
  assert.match(indexHtml, /aria-label="Referral Profiles"/);
  assert.match(indexHtml, /aria-label="Client Profiles"/);
});

test("workflow module includes start-day controls and a task summary", () => {
  assert.match(indexHtml, /id="start-day"/);
  assert.match(indexHtml, /id="new-task"/);
  assert.match(indexHtml, /id="workflow-task-summary"/);
  assert.match(indexHtml, /Daily work queue for referrals, reschedules, scheduling prep, and follow-up/);
});

test("admin settings surface current scheduling rules", () => {
  assert.match(indexHtml, /id="admin-tab-settings"/);
  assert.equal(indexHtml.includes('id="admin-tab-grants"'), false);
  assert.match(indexHtml, /id="admin-tab-kpi"/);
  assert.match(indexHtml, /id="admin-tab-work-plan"/);
  assert.match(indexHtml, /Scheduling Settings/);
  assert.match(indexHtml, /id="admin-scheduling-settings-form"/);
  assert.match(indexHtml, /name="weekdays" value="2"/);
  assert.match(indexHtml, /Office Opens/);
  assert.match(indexHtml, /First Appointment/);
  assert.match(indexHtml, /Appointments End By/);
  assert.match(indexHtml, /30 minutes/);
  assert.match(indexHtml, /15 minutes/);
  assert.match(appJs, /\/api\/admin\/scheduling-settings/);
  assert.match(stylesCss, /\.admin-settings-form/);
  assert.match(stylesCss, /\.admin-settings-grid/);
});

test("admin data tools centralize operational import export and deletion", () => {
  assertInOrder(indexHtml, [
    'id="admin-tab-settings"',
    'id="admin-tab-data-tools"',
    'id="admin-tab-kpi"',
    'id="admin-tab-work-plan"'
  ]);
  assert.match(indexHtml, /id="admin-data-tools-view"/);
  assert.match(indexHtml, /id="data-tools-list"/);
  assert.match(indexHtml, /id="refresh-data-tools"/);
  assert.match(indexHtml, /id="appointment-csv-input"/);
  assert.match(indexHtml, /id="appointment-import-modal"/);
  assert.match(indexHtml, /id="confirm-appointment-import"/);
  assert.match(appJs, /const adminDataToolDefinitions = \[/);
  assert.match(appJs, /key: "referrals"/);
  assert.match(appJs, /key: "clients"/);
  assert.match(appJs, /key: "referral-network"/);
  assert.match(appJs, /key: "appointments"/);
  assert.match(appJs, /key: "tasks"/);
  assert.match(appJs, /key: "activity-logs"/);
  assert.match(appJs, /Setmore appointment export/);
  assert.match(appJs, /Skipped Non-Appointment Rows/);
  assert.match(appJs, /Wellness Day will live outside appointment scheduling/);
  assert.match(appJs, /Classes will be handled in a separate classes\/events workflow/);
  assert.match(appJs, /DELETE TEST DATA/);
  assert.match(appJs, /\/api\/admin\/data-counts/);
  assert.match(appJs, /\/api\/admin\/bulk-delete/);
  assert.match(appJs, /\/api\/appointments\/import/);
  assert.match(stylesCss, /\.data-tools-list/);
  assert.match(stylesCss, /\.data-tool-card/);
  assert.match(serverJs, /router\.get\("\/api\/admin\/data-counts"/);
  assert.match(serverJs, /router\.get\("\/api\/admin\/export\/:collectionKey"/);
  assert.match(serverJs, /router\.post\("\/api\/admin\/bulk-delete"/);
  assert.match(serverJs, /ALLOW_ADMIN_BULK_DELETE/);
  assert.match(serverJs, /Bulk delete is disabled for this environment/);
  assert.match(serverJs, /router\.post\("\/api\/appointments\/import"/);
  assert.match(serverJs, /confirmation !== "DELETE TEST DATA"/);
});

test("admin KPI and Work Plan tabs expose 2026 targets and quarterly actions", () => {
  assert.match(indexHtml, /id="admin-kpi-view"/);
  assert.match(indexHtml, /id="kpi-summary"/);
  assert.match(indexHtml, /Clinic Snapshot/);
  assert.match(indexHtml, /id="clinic-snapshot-summary"/);
  assert.match(indexHtml, /Program Metrics/);
  assert.match(indexHtml, /Clients Without Next Appointment/);
  assert.match(indexHtml, /2026 KPI Progress/);
  assert.match(indexHtml, /Organization KPI Table/);
  assert.match(indexHtml, /Revenue KPI Table/);
  assert.match(indexHtml, /Program KPI Drafts/);
  assert.match(indexHtml, /id="admin-work-plan-view"/);
  assert.match(indexHtml, /2026 Work Plan Tracker/);
  assert.match(appJs, /const organizationKpiRows = \[/);
  assert.match(appJs, /Clinic Clients/);
  assert.match(appJs, /Workbook Royalties/);
  assert.match(appJs, /const workPlanItems = \[/);
  assert.match(appJs, /Launch Curriculum Toolkit/);
  assert.match(appJs, /function renderAdminKpi/);
  assert.match(appJs, /function renderWorkPlan/);
  assert.match(appJs, /activeAdminView === "kpi"/);
  assert.match(appJs, /activeAdminView === "work-plan"/);
  assert.match(stylesCss, /\.kpi-layout/);
  assert.match(stylesCss, /\.kpi-table-grid/);
  assert.match(stylesCss, /\.work-plan-list/);
  assert.match(stylesCss, /\.work-plan-status\.status-in-progress/);
});

test("fundraising grants tab exposes deadlines, grant list, reusable answers, and organization info", () => {
  assert.match(indexHtml, /id="fundraising-panel"/);
  assert.match(indexHtml, /id="fundraising-tab-grants"/);
  assert.match(indexHtml, /id="fundraising-tab-sales"/);
  assert.match(indexHtml, /id="fundraising-tab-individual-giving"/);
  assert.match(indexHtml, /id="fundraising-tab-corporate-partnerships"/);
  assert.match(indexHtml, /id="fundraising-tab-events"/);
  assert.match(indexHtml, /id="fundraising-grants-view"/);
  assert.match(appJs, /activeFundraisingView/);
  assert.match(appJs, /function setFundraisingView/);
  assert.match(appJs, /saved\.activeAdminView === "grants" \? "grants" : saved\.activeFundraisingView/);
  assert.equal(indexHtml.includes("Grant Tracker"), false);
  assert.equal(indexHtml.includes("Funding</p>"), false);
  assertInOrder(indexHtml, [
    'id="fundraising-grants-actions"',
    'id="grant-search"',
    'id="new-grant"',
    'id="fundraising-grants-view"'
  ]);
  assert.match(indexHtml, /id="grant-deadline-list"/);
  assert.match(indexHtml, /id="grants-list"/);
  assert.match(indexHtml, /Grant Opportunities/);
  assert.equal(indexHtml.includes("Grant Applications"), false);
  assert.match(indexHtml, /id="grant-org-card"/);
  assert.match(indexHtml, /id="grant-question-card"/);
  assert.match(indexHtml, /id="grant-question-form"/);
  assert.match(indexHtml, /id="grant-org-form"/);
  assert.match(indexHtml, /Reusable Answers/);
  assert.match(indexHtml, /DBA name/);
  assert.match(indexHtml, /Mailing address/);
  assert.match(indexHtml, /Year founded/);
  assert.match(indexHtml, /Social media links/);
  assert.match(indexHtml, /Fiscal sponsor \/ endowment \/ reserve fund/);
  assert.match(indexHtml, /Guiding principles/);
  assert.match(indexHtml, /Board roster/);
  assert.match(indexHtml, /CHA \/ CHIP/);
  assert.match(indexHtml, /Balance sheet/);
  assert.match(indexHtml, /Profit &amp; Loss Statement/);
  assert.match(indexHtml, /Strategic Plan/);
  assert.match(indexHtml, /Annual Report/);
  assert.match(indexHtml, /name="boardRosterUrl" type="file"/);
  assert.equal(indexHtml.includes("No file uploaded"), false);
  assert.equal(indexHtml.includes("Service area"), false);
  assert.equal(indexHtml.includes("Organization description / reusable copy"), false);
});

test("grant modal captures application details, portal info, awards, reports, and document uploads", () => {
  const grantModal = indexHtml.slice(indexHtml.indexOf('id="grant-modal"'), indexHtml.indexOf('id="crm-tabs"'));

  for (const field of [
    "foundationName",
    "grantName",
    "openDate",
    "deadlineDate",
    "deadlineTime",
    "awardExpectedDate",
    "focusAreas",
    "recurrence",
    "contactName",
    "contactEmail",
    "secondaryContactName",
    "secondaryContactEmail",
    "websiteUrl",
    "portalUrl",
    "portalLoginEmail",
    "portalLoginPassword",
    "amountRequested",
    "amountMin",
    "amountMax",
    "reportingRequirements",
    "pastGrantReceived",
    "previousAwardDate",
    "completedApplicationUrl",
    "grantAgreementUrl",
    "budgetUrl",
    "finalReportUrl",
    "brandingUrl"
  ]) {
    assert.match(grantModal, new RegExp(`name="${field}"`));
  }

  assert.match(grantModal, /Completed application/);
  assert.match(grantModal, /name="completedApplicationUrl" type="file"/);
  assert.match(grantModal, /<select name="recurrence">/);
  assert.equal(grantModal.includes("Completed application upload"), false);
  assert.equal(grantModal.includes("Portal login notes"), false);
  assert.equal(grantModal.includes("Past grant notes"), false);
  assert.equal(grantModal.includes("Do not store passwords here"), false);
  assert.equal(grantModal.includes("How often we can apply"), false);
  assert.equal(grantModal.includes("Contact role"), false);
  assert.equal(grantModal.includes("Contact phone"), false);
  assert.match(appJs, /firebase-storage\.js/);
  assert.match(appJs, /uploadBytes/);
  assert.match(appJs, /getDownloadURL/);
  assert.match(appJs, /storagePath/);
  assert.match(appJs, /grantDocumentDisplayName/);
  assert.match(appJs, /await documentsFromFixedFields/);
  assert.match(appJs, /function grantPreviewAmount/);
  assert.match(appJs, /function grantPreviewDate/);
  assert.match(appJs, /function grantHasUpcomingDeadline/);
  assert.match(appJs, /grantPortalLoginEmail/);
  assert.match(appJs, /grantPortalLoginPassword/);
  assert.match(grantModal, /<option value="Not A Good Fit">Not A Good Fit<\/option>/);
});

test("grant document uploads are backed by Firebase Storage rules", () => {
  assert.match(firebaseJson, /"storage"\s*:\s*{\s*"rules"\s*:\s*"storage\.rules"\s*}/s);
  assert.match(storageRules, /match \/grant-documents\/\{allPaths=\*\*\}/);
  assert.equal(storageRules.includes("request.auth.token.email.matches('.*@snackprogram\\\\.org$')"), true);
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
  assert.match(stylesCss, /\.grants-layout\s*{[^}]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/s);
  assert.match(stylesCss, /#grant-search\s*{[^}]*width: min\(240px, 36vw\);/s);
  assert.match(stylesCss, /\.grant-question-card \.grant-reference-actions\s*{[^}]*margin-bottom: 10px;/s);
  assert.match(stylesCss, /\.grant-deadline-item\s*{[^}]*border-left: 4px solid var\(--brand-red\);/s);
  assert.match(stylesCss, /\.grant-deadline-item:hover,\s*\.grant-deadline-item:focus-visible\s*{[^}]*var\(--red-soft\)/s);
});

test("outreach dashboard uses grant-style flow lanes and event profiles", () => {
  assert.match(indexHtml, /id="outreach-event-flow-board"/);
  assert.match(indexHtml, /Event Flow/);
  assert.match(indexHtml, /Upcoming Events &amp; Classes/);
  assert.match(indexHtml, /Events &amp; Classes/);
  assert.match(indexHtml, /id="outreach-event-status" name="status"/);
  assert.match(indexHtml, /<option value="Follow Up">Follow Up<\/option>/);
  assert.match(appJs, /const outreachEventFlowColumns = \[/);
  assert.match(appJs, /function renderOutreachEventFlow/);
  assert.match(appJs, /dragKind: "outreach-event-flow"/);
  assert.match(appJs, /function createOutreachEventStatusSelect/);
  assert.match(appJs, /function updateOutreachEventStatus/);
  assert.match(appJs, /\["Status", createOutreachEventStatusSelect\(event\)\]/);
  assert.match(stylesCss, /\.outreach-flow-card/);
  assert.match(stylesCss, /\.outreach-status-select/);
  assert.match(stylesCss, /\.outreach-status-pill\.status-group-outreach-follow-up/);
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
  assert.match(appJs, /function createGrantStatusSelect/);
  assert.match(appJs, /\["Status", createGrantStatusSelect\(grant\)\]/);
  assert.match(appJs, /updateGrantStatus\(grant, select\.value\)/);
});

test("scheduling module keeps the hidden list view nodes app.js still targets", () => {
  assert.match(indexHtml, /id="appointment-summary"/);
  assert.match(indexHtml, /id="appointments-list"/);
});

test("scheduling module renders the v2 design with v1 archived and disconnected", () => {
  assert.match(indexHtml, /id="scheduling-v2-preview"/);
  assert.match(appJs, /function renderSchedulingV2Preview/);
  assert.match(appJs, /function renderSchedulingV2Sidebar/);
  assert.match(stylesCss, /scheduling-v2-shell/);
  assert.equal(indexHtml.includes('id="scheduling-classic-view-button"'), false);
  assert.equal(indexHtml.includes('id="scheduling-v2-view-button"'), false);
  assert.equal(appJs.includes("activeSchedulingDesign"), false);
  assert.equal(appJs.includes("function setSchedulingDesign"), false);
});

test("scheduling v2 rendered actions have click handlers", () => {
  const renderedActions = [...new Set([...appJs.matchAll(/data-scheduling-action="([a-z-]+)"/g)].map((match) => match[1]))];
  const handledActions = new Set([...appJs.matchAll(/action === "([a-z-]+)"/g)].map((match) => match[1]));

  for (const action of renderedActions) {
    assert.ok(handledActions.has(action), `${action} should have a Scheduling V2 click handler`);
  }

  for (const quickAction of ["block-time", "view-unscheduled", "print-notes", "placeholder"]) {
    assert.ok(handledActions.has(quickAction), `${quickAction} quick action should have a Scheduling V2 click handler`);
  }
});

test("scheduling module exposes printable daily schedule and prep sheets", () => {
  assert.match(indexHtml, /id="print-today-schedule"/);
  assert.match(indexHtml, /id="print-prep-sheets"/);
  assert.match(indexHtml, /id="print-note-sheets"/);
  assert.match(indexHtml, /id="print-root"/);
  assert.match(appJs, /function printTodaySchedule/);
  assert.match(appJs, /function printPrepSheets/);
  assert.match(appJs, /function printAppointmentNoteSheets/);
  assert.match(appJs, /function printScheduleForDate/);
  assert.match(appJs, /function printPrepSheetsForDate/);
  assert.match(appJs, /function printAppointmentNoteSheetsForDate/);
  assert.match(appJs, /function printPreparedDocument/);
  assert.match(appJs, /window\.print\(\)/);
  assert.match(stylesCss, /@media print/);
  assert.match(stylesCss, /body > :not\(\.print-root\)/);
  assert.match(appJs, /Appointment Prep Sheets/);
  assert.match(appJs, /No appointments scheduled on \$\{formatDateOnly\(dateKey\)\} for note sheets/);
});

test("appointment prep checklist mirrors the When to Give What guide", () => {
  assert.match(appJs, /Enrollment form \(file cabinet\); siblings can share one form/);
  assert.match(appJs, /Questionnaire for each child \(file cabinet\); each child needs their own/);
  assert.match(appJs, /HRSN screener for YCCO client \(file cabinet\)/);
  assert.match(appJs, /Workbook/);
  assert.match(appJs, /1 SNACK tumbler per child/);
  assert.match(appJs, /1 \$50 grocery gift card per family/);
});

test("Setmore sibling appointment imports normalize into multi-client appointments", () => {
  assert.match(appJs, /sibling enrollment appointment/);
  assert.match(appJs, /sibling nutrition education appointment/);
  assert.match(appJs, /function canonicalSetmoreAppointmentServiceLabel/);
  assert.match(appJs, /function setmoreAppointmentImportsCanMerge/);
  assert.match(appJs, /function mergeAppointmentImportIntoGroup/);
  assert.match(appJs, /schedulingV2AppointmentsShareFamilySignal/);
  assert.match(appJs, /Cita de inscripción en español/);
  assert.match(appJs, /Nutrition Education Appointment/);
});

test("printable appointment note sheets include handwritten visit note prompts", () => {
  assert.match(appJs, /Visit Note/);
  assert.match(appJs, /Goal Check In/);
  assert.match(appJs, /Goal & Next Steps/);
  assert.match(appJs, /function appointmentLessonTopicTitle/);
  assert.match(appJs, /Food Groups Appointment Note/);
  assert.match(appJs, /Age/);
  assert.match(appJs, /Interval since last appointment/);
  assert.match(appJs, /Goal:/);
  assert.match(appJs, /Other updates or wins/);
  assert.match(appJs, /Activities practiced \/ client response/);
  assert.match(appJs, /Goal set today/);
  assert.match(appJs, /Next appt scheduled/);
  assert.match(appJs, /Follow-up needed/);
  assert.match(appJs, /Knowledge Retention/);
  assert.match(appJs, /print-checkbox-row/);
  assert.match(appJs, /print-next-appt-row/);
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
  assert.match(appJs, /siblingZohoRecordIds/);
  assertInOrder(referralForm, [
    "client-profile-grid",
    "client-admin-strip",
    "Referral Details",
    "Provider Profiles"
  ]);
});

test("referral profile keeps progress concise and actionable", () => {
  const referralFlow = appJs.slice(appJs.indexOf("function renderReferralFlow"), appJs.indexOf("function renderClientFlow"));
  const referralProgress = appJs.slice(appJs.indexOf("function renderReferralProgressPanel"), appJs.indexOf("function renderReferralDetailsPanel"));
  const referralDetailShell = appJs.slice(appJs.indexOf("function renderReferralDetail"), appJs.indexOf("function renderNetworkDetail"));

  assert.match(appJs, /Waiting-on-family referrals land here/);
  assert.match(referralFlow, /renderProfileV2List\(referralFlowBoard, referrals/);
  assert.match(referralFlow, /status: \(referral\) => normalizeStatus\(referral\.status\)/);
  assert.match(appJs, /profileV2StatusLabel\(status, options\.fallbackStatus\)/);
  assert.doesNotMatch(referralFlow, /renderFlowBoard/);
  assert.match(appJs, /function renderReferralProfileV2Side/);
  assertInOrder(appJs, [
    "profileV2MetaRow(\"Referral date\", profileDate(referral.referralDate))",
    "profileV2MetaRow(\"Recent contact\", profileDate(referral.mostRecentContactDate))",
    "profileV2MetaRow(\"Caregiver\", referral.parentName)"
  ]);
  assert.match(appJs, /\{ label: "Contacted", status: "Texted"/);
  assert.match(appJs, /\{ label: "Scheduled", status: "Scheduled"/);
  assert.match(appJs, /\{ label: "Closed", status: "Closed \/ No Further Outreach"/);
  assert.match(appJs, /dot\.addEventListener\("click", \(\) => updateReferralStatus\(referral, item\.status\)\)/);
  assert.doesNotMatch(referralProgress, /client-current-lesson/);
  assert.match(appJs, /renderReferralProgressV2Card\(referral\)/);
  assert.match(appJs, /renderProfileV2Card\("Referral Source"/);
  assert.match(referralDetailShell, /newAppointmentFromReferralButton\.textContent = "New Appt"/);
  assert.match(referralDetailShell, /renderReferralProfileV2Body\(referral, activeReferralProfileTab/);
  assert.doesNotMatch(appJs, /renderProfileSection\("Key dates"/);
  assert.doesNotMatch(appJs, /"Recent appt", profileDate\(referral\.mostRecentAppointmentDate\)/);
});

test("flow cards and appointment scheduling avoid duplicate status text", () => {
  const statusSort = appJs.slice(appJs.indexOf("function statusSortIndex"), appJs.indexOf("function clientStatusGroupKey"));
  const clientFlow = appJs.slice(appJs.indexOf("function renderClientFlow"), appJs.indexOf("function renderGrantFlow"));
  const appointmentSave = appJs.slice(appJs.indexOf("async function saveAppointment"), appJs.indexOf("function nextLessonNumberForAppointment"));

  assert.match(statusSort, /\["new", "in-contact", "referral-scheduled", "watch", "closed"\]/);
  assert.match(clientFlow, /renderProfileV2List\(clientFlowBoard, clients/);
  assert.match(clientFlow, /status: \(client\) => client\.status \|\| "Scheduled"/);
  assert.doesNotMatch(clientFlow, /renderFlowBoard/);
  assert.doesNotMatch(clientFlow, /meta: \[client\.status \|\| "Scheduled"/);
  assert.match(appJs, /function renderClientProfileV2Side/);
  assertInOrder(appJs, [
    "profileV2MetaRow(\"First appointment\", profileDate(client.firstAppointmentDate))",
    "profileV2MetaRow(\"Recent contact\", profileDate(client.mostRecentContactDate))",
    "profileV2MetaRow(\"Caregiver\", client.parentName)"
  ]);
  assert.match(appJs, /renderClientLessonProgressionCard\(client\)/);
  assert.match(appJs, /label: appointmentLessonTitles\[lesson\]/);
  assert.match(appointmentSave, /Add a client or type a referral name before saving/);
  assert.match(appointmentSave, /appointment\.clientNames = \[typedClientName\]/);
  assert.match(stylesCss, /grid-template-columns: repeat\(8, minmax\(0, 1fr\)\)/);
  assert.match(stylesCss, /grid-template-columns: repeat\(auto-fit, minmax\(54px, 1fr\)\)/);
});

test("CRM profile new appointment actions route into Scheduling V2 inline flow", () => {
  const bridge = appJs.slice(appJs.indexOf("function startSchedulingV2AppointmentFromProfile"), appJs.indexOf("function cancelSchedulingV2InlineForm"));
  const referralDetail = appJs.slice(appJs.indexOf("function renderReferralDetail()"), appJs.indexOf("function renderClientDetail()"));
  const clientDetail = appJs.slice(appJs.indexOf("function renderClientDetail()"), appJs.indexOf("function renderNetworkDetail()"));
  const inlinePayload = appJs.slice(appJs.indexOf("function schedulingV2InlineAppointmentPayload"), appJs.indexOf("function schedulingV2InlineClientIdsFromForm"));
  const inlineValidation = appJs.slice(appJs.indexOf("function schedulingV2ValidateInlineAppointment"), appJs.indexOf("function schedulingV2PayloadForCreate"));

  assert.match(appJs, /function startSchedulingV2AppointmentFromProfile/);
  assert.match(bridge, /closeClientModal\(\)/);
  assert.match(bridge, /closeReferralModal\(\)/);
  assert.match(bridge, /activeSchedulingPreviewView = "day"/);
  assert.match(bridge, /setActiveModule\("scheduling"\)/);
  assert.match(bridge, /startSchedulingV2InlineForm\("new"/);
  assert.match(appJs, /mode === "new" && !schedulingV2InlineDefaults\.staffMember/);
  assert.match(appJs, /schedulingV2InlineDefaults\.staffMember = defaultSchedulingStaffMembers\[0\]/);
  assert.match(referralDetail, /startSchedulingV2AppointmentFromProfile\(\{/);
  assert.match(clientDetail, /startSchedulingV2AppointmentFromProfile\(\{/);
  assert.match(clientDetail, /clientId: client\.id/);
  assert.match(clientDetail, /clientIds: \[client\.id\]/);
  assert.match(clientDetail, /clientNames: \[clientName\(client\)\]/);
  assert.doesNotMatch(referralDetail, /startNewAppointment\(\{/);
  assert.doesNotMatch(clientDetail, /startNewAppointment\(\{/);
  assert.match(appJs, /name="clientNames"/);
  assert.match(appJs, /function schedulingV2InlineClientNamesFromForm/);
  assert.match(inlinePayload, /preservedClientNames/);
  assert.match(inlinePayload, /typedClientName/);
  assert.match(inlinePayload, /clientNames/);
  assert.match(inlineValidation, /appointmentClientNames\(appointment\)\.length/);
  assert.match(inlineValidation, /Choose a client or type a referral name before saving/);
});

test("CRM profile tabs expose stable functional hooks", () => {
  const profileTabs = appJs.slice(appJs.indexOf("function renderProfileV2Tabs"), appJs.indexOf("function renderProfileV2ActivityCard"));
  const clientBody = appJs.slice(appJs.indexOf("function renderClientProfileV2Body"), appJs.indexOf("function renderReferralProfileV2Body"));
  const referralBody = appJs.slice(appJs.indexOf("function renderReferralProfileV2Body"), appJs.indexOf("function renderReferralDetail()"));

  assert.match(profileTabs, /button\.dataset\.profileTab = tab/);
  assert.match(profileTabs, /button\.setAttribute\("role", "tab"\)/);
  assert.match(profileTabs, /button\.setAttribute\("aria-selected"/);
  for (const tab of ["notes", "activity", "appointments", "forms"]) {
    assert.match(clientBody, new RegExp(`tab === "${tab}"`));
    assert.match(referralBody, new RegExp(`tab === "${tab}"`));
  }
});

test("CRM profile forms tab links to hosted print-form packets", () => {
  const referencedPrintForms = [...new Set([...appJs.matchAll(/fileName: "([^"]+)"/g)].map((match) => match[1]))];

  assert.equal(referencedPrintForms.length, 10);
  for (const fileName of referencedPrintForms) {
    assert.ok(printForms.includes(fileName), `${fileName} should be hosted for CRM print forms`);
  }

  assert.match(appJs, /const printFormPackets/);
  assert.match(appJs, /function profileV2PrintFormHref/);
  assert.match(appJs, /function schedulingV2AppointmentPrintFormPacket/);
  assert.match(appJs, /Enrollment packet/);
  assert.match(appJs, /Graduation packet/);
  assert.match(appJs, /Forms 1, 2, and 3/);
  assert.match(appJs, /Forms 2, 4, and 5/);
  assert.match(appJs, /SP Program Enrollment/);
  assert.match(appJs, /SP Parent Feedback/);
  assert.match(appJs, /scheduling-v2-form-links/);
  assert.match(stylesCss, /\.profile-v2-form-links/);
  assert.match(stylesCss, /\.scheduling-v2-form-links/);
});

test("appointment API can save referral name-only appointments", () => {
  assert.match(serverJs, /\(!payload\.clientIds\.length && !payload\.clientNames\.length\)/);
  assert.match(serverJs, /Client or referral name, appointment date, and appointment time are required/);
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

test("referral network providers can be edited inline", () => {
  assert.match(appJs, /let editingNetworkProviderId = null/);
  assert.match(appJs, /function sortedNetworkProviders/);
  assert.match(appJs, /function providerPayloadForSave/);
  assert.match(appJs, /function updateNetworkProvider/);
  assert.match(appJs, /network-provider-edit-form/);
  assert.match(appJs, /name="email" type="email"/);
  assert.match(appJs, /textarea name="notes"/);
  assert.match(appJs, /provider\.email \|\| "-"/);
  assert.match(stylesCss, /\.network-provider-actions/);
  assert.match(stylesCss, /\.network-provider-edit-form/);
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
  assert.match(appJs, /loadedAppointments\.find\(\(item\) => item\.id === selectedAppointmentId\)/);
  assert.match(appJs, /loadedAppointments\.find\(\(item\) => item\.id === selectedSchedulingPreviewAppointmentId\)/);
  assert.match(appJs, /schedulingV2ValidateInlineAppointment\(nextAppointment, appointment\.id\)/);
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
  assert.match(bookingHtml, /id="public-children"/);
  assert.match(bookingHtml, /id="public-add-child"/);
  assert.match(bookingHtml, /id="booking-management"/);
  assert.match(bookingHtml, /id="public-management-availability"/);
  assert.match(bookingHtml, /id="public-cancel-booking"/);
  assert.match(bookingHtml, /id="public-reschedule-booking"/);
  assert.match(bookingHtml, /Caregiver name/);
  assert.match(bookingHtml, /Mobile phone/);
  assert.match(bookingHtml, /name="consentReminders"/);
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
  assert.match(bookingJs, /appointmentId/);
  assert.match(bookingJs, /manageToken/);
  assert.match(bookingJs, /loadManagedBooking/);
  assert.match(bookingJs, /cancelManagedBooking/);
  assert.match(bookingJs, /rescheduleManagedBooking/);
  assert.equal(bookingJs.includes("/api/clients"), false);
  assert.match(bookingJs, /if \(!selectedSlot\)/);
  assert.match(bookingJs, /publicBookingChildrenFromForm/);
  assert.match(bookingJs, /payload\.children = children/);
  assert.match(bookingJs, /formatPublicNameList/);
  assert.match(bookingJs, /Choose an appointment time/);
  assert.match(bookingJs, /bookingForm\.hidden = true/);
  assert.match(bookingJs, /confirmationEl\.hidden = false/);
  assert.match(bookingJs, /Appointment booked/);
  assert.match(stylesCss, /\.public-honeypot/);
  assert.match(stylesCss, /\.public-child-card/);
  assert.match(stylesCss, /\.public-booking-management/);
  assert.match(stylesCss, /\.public-management-link/);
});

test("SNACK brand variables match the locked visual rulebook palette", () => {
  for (const color of ["#e5484d", "#d66a1f", "#cf9600", "#18724a", "#1570ef", "#7651c7", "#4969af"]) {
    assert.match(stylesCss, new RegExp(color.replace("#", "#")));
  }
  assert.match(stylesCss, /\.module-tabs\s*{[^}]*max-width: 100%;[^}]*overflow-x: auto;/s);
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

test("frontend script wires grants API resources and Fundraising navigation", () => {
  assert.match(appJs, /activeFundraisingView/);
  assert.match(appJs, /function setFundraisingView/);
  assert.match(appJs, /setActiveModule\("fundraising"\)/);
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
  assert.doesNotMatch(appJs, /meta: \[grant\.status \|\| "Researching"/);
  assert.match(stylesCss, /\.grant-flow-card\s*{\s*grid-column: 1 \/ -1;/);
  assert.match(stylesCss, /\.grant-flow-card \.flow-lanes\s*{\s*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\);/);
  assert.match(stylesCss, /\.grant-status-pill\.status-group-grant-upcoming\s*{[^}]*var\(--brand-red\)/s);
  assert.match(stylesCss, /\.grant-status-pill\.status-group-grant-in-progress\s*{[^}]*var\(--brand-green\)/s);
  assert.match(stylesCss, /\.grant-status-pill\.status-group-grant-submitted\s*{[^}]*var\(--brand-blue\)/s);
  assert.match(stylesCss, /\.grant-status-pill\.status-group-grant-awarded\s*{[^}]*var\(--brand-purple\)/s);
  assert.match(stylesCss, /\.grant-status-select\.status-group-grant-awarded\s*{[^}]*var\(--brand-purple\)/s);
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
