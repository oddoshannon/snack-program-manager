import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  clientLessonIndex,
  clientLessonLabel,
  clientLessonSteps,
  crmActivityPayload,
  crmActivityForClient,
  crmAppointmentDescription,
  crmAppointmentUrl,
  crmAppointmentsForClient,
  crmClientMatches,
  crmClientPayload,
  crmCloseDecision,
  crmLessonIsCurrent,
  crmNewAppointmentUrl,
  crmPreferredItemId,
  crmSiblingChanges,
  crmClientStatusRank,
  crmClientStatusTone,
  crmStatusLabel,
  crmStatusOptions,
  crmSummary,
  mapCrmClient,
  mapCrmClients
} from "../../frontend/public/modules/crm.js";
import {
  crmReferralStatusRank,
  crmReferralStatusTone,
  mapCrmReferrals
} from "../../frontend/public/modules/referrals.js";
import {
  crmCompletedTaskItems,
  crmDashboardItems,
  crmDashboardSummary,
  crmDashboardTaskSummary,
  hasNextAppointment,
  taskDueBucket
} from "../../frontend/public/modules/crm-dashboard.js";
import {
  clinicEvaluationFormPayload,
  clinicFormUrl,
  clinicHealthInstrumentFor,
  clinicInstrumentKind,
  clinicKnowledgeAnsweredCount,
  clinicKnowledgeInstrumentFor,
  clinicKnowledgeQuestionsForInstrument,
  clinicKnowledgeResponseForPoint,
  clinicKnowledgeResponseResult,
  clinicKnowledgeResponseScore,
  clinicKnowledgeScoreSummary,
  clinicLessonColor,
  clinicNativeFormActions
} from "../../frontend/public/modules/clinic-evaluation.js";

const crmHtml = await readFile(new URL("../../frontend/public/crm.html", import.meta.url), "utf8");
const appConfig = await readFile(new URL("../../frontend/public/app-config.js", import.meta.url), "utf8");
const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
const cleanCss = await readFile(new URL("../../frontend/public/clean.css", import.meta.url), "utf8");
const clientFormHtml = await readFile(new URL("../../frontend/public/client-form.html", import.meta.url), "utf8");
const clientFormSource = await readFile(new URL("../../frontend/public/client-form.js", import.meta.url), "utf8");
const clientFormCss = await readFile(new URL("../../frontend/public/client-form.css", import.meta.url), "utf8");

test("CRM no longer exposes a separate Tasks submodule", () => {
  assert.match(cleanSource, /subpages: \["Clients", "Referrals", "Referral Network"\]/);
  assert.match(cleanSource, /\["Dashboard", "Tasks"\]\.includes\(crmInitialParams\.get\("section"\)\)[\s\S]*?\? "Clients"/);
  assert.doesNotMatch(cleanSource, /href="\.\/crm\.html\?section=Tasks"/);
});

test("Home includes the shared CRM Workflow queues above daily work", () => {
  assert.match(cleanSource, /function renderHomeWorkflow/);
  assert.match(cleanSource, /Families and appointments that need attention/);
  assert.match(cleanSource, /clients: homeClients/);
  assert.match(cleanSource, /referrals: homeReferrals/);
});

test("referral contact logging confirms closure and completes the first-call task", async () => {
  const activityRoute = await readFile(new URL("../routes/activity-logs.js", import.meta.url), "utf8");
  assert.match(cleanSource, /data-crm-not-interested-confirm/);
  assert.match(cleanSource, /Confirm that this referral should be closed/);
  assert.match(activityRoute, /startsWith\("Call new referral:"\)/);
  assert.match(activityRoute, /contactUpdates\.status = "Not Interested"/);
});

test("profile phone numbers remain plain CRM data while Google Voice stays separate", () => {
  assert.doesNotMatch(cleanSource, /clickToCall|renderClickToCallField/);
  assert.doesNotMatch(cleanCss, /\.click-to-call/);
});

test("CRM Referrals exposes the protected public-intake handoff", () => {
  assert.match(cleanSource, /crmSubpage === "Referrals"/);
  assert.match(cleanSource, /href="\.\/refer\.html"/);
  assert.match(cleanCss, /\.header-link-action/);
});

test("CRM profile editors use searchable siblings and keep detail tabs available", () => {
  assert.match(cleanSource, /data-crm-sibling-search/);
  assert.match(cleanSource, /data-crm-sibling-add/);
  assert.doesNotMatch(cleanSource, /placeholder="First name"/);
  assert.doesNotMatch(cleanSource, /placeholder="Last name"/);
  assert.match(cleanSource, /button\.disabled = editing && !editingProfile/);
});

test("CRM form program points use regular weight text", () => {
  assert.match(cleanSource, /class="crm-form-program-point"/);
  assert.match(cleanCss, /\.crm-assessment-summary-row \.crm-form-program-point[\s\S]*?font-weight: 400;/);
});

const clients = [
  {
    id: "client-2",
    firstName: "Tessa",
    lastName: "Exampleton",
    parentName: "Jordan",
    preferredLanguage: "Spanish",
    phone: "(971) 555-0101",
    dateOfBirth: "2018-08-14",
    status: "Scheduled",
    currentLesson: "Enrollment",
    firstAppointmentDate: "2026-07-07",
    mostRecentAppointmentDate: "2026-07-12",
    lastAppointmentDate: "2026-07-14",
    graduationDate: "2026-07-15",
    mostRecentContactDate: "2026-07-10",
    referralDate: "2026-06-01",
    preferredContactMethod: "Text",
    referralType: "Internal Clinic Referral",
    referralSource: "Physicians Medical Center",
    firstContactDate: "2026-06-03",
    gender: "Female",
    email: "jordan@example.com",
    emailOptOut: true,
    textOptOut: false,
    addressStreet: "2435 NE Cumulus Ave",
    addressCity: "McMinnville",
    addressState: "OR",
    addressZip: "97128",
    siblingIds: ["client-1"],
    ycco: true,
    yccoId: "123ABC456",
    hrsn: false,
    providerLinks: [{
      networkId: "network-1",
      providerId: "provider-1",
      providerName: "Dr. Rivera",
      organizationName: "Physicians Medical Center"
    }]
  },
  {
    id: "client-1",
    firstName: "Milo",
    lastName: "Exampleton",
    parentName: "Jordan",
    preferredLanguage: "Spanish",
    status: "Needs Reschedule",
    siblingIds: ["client-2"]
  },
  {
    id: "client-3",
    firstName: "Cora",
    lastName: "Sample",
    status: "Active"
  },
  {
    id: "client-4",
    firstName: "Max",
    lastName: "Sample",
    status: "Waiting on Family"
  }
];

test("clean CRM maps real client records in workflow status order", () => {
  const items = mapCrmClients(clients);
  const tessa = items.find((item) => item.id === "client-2");

  assert.deepEqual(items.map((item) => item.title), ["Milo Exampleton", "Tessa Exampleton", "Cora Sample", "Max Sample"]);
  assert.equal(tessa.siblings, "Milo Exampleton");
  assert.deepEqual(tessa.siblingProfiles, [{
    id: "client-1",
    name: "Milo Exampleton",
    section: "Clients"
  }]);
  assert.equal(tessa.subtitle, "7/10/26 | (971) 555-0101 | Jordan | Spanish");
  assert.equal(tessa.insurance, "YCCO");
  assert.equal(tessa.yccoId, "123ABC456");
  assert.equal(tessa.providerProfiles, "Dr. Rivera (Physicians Medical Center)");
  assert.deepEqual(tessa.providerProfileLinks, [{
    networkId: "network-1",
    providerId: "provider-1",
    label: "Dr. Rivera (Physicians Medical Center)"
  }]);
  assert.equal(tessa.recentContact, "7/10/26");
  assert.equal(tessa.referralDate, "6/1/26");
  assert.equal(tessa.preferredContact, "Text");
  assert.equal(tessa.email, "jordan@example.com");
  assert.equal(tessa.emailOptOut, "Yes");
  assert.equal(tessa.textOptOut, "No");
  assert.equal(tessa.gender, "Female");
  assert.equal(tessa.hrsn, "Not Eligible");
  assert.equal(tessa.firstContact, "6/3/26");
  assert.equal(items[1].referralType, "Internal Clinic Referral");
  assert.equal(items[1].referralSource, "Physicians Medical Center");
  assert.equal(items[1].address, "2435 NE Cumulus Ave, McMinnville, OR, 97128");
  assert.equal(items[1].graduationDate, "7/15/26");
});

test("clean CRM keeps long names readable and handles incomplete records safely", () => {
  const item = mapCrmClient({
    id: "client-long",
    firstName: "Alexandria",
    lastName: "Martinez de la Cruz Exampleton",
    status: "",
    siblingIds: ["missing-sibling"],
    providerLinks: [{ providerName: "Dr. Rivera", organizationName: "" }],
    emailOptOut: false,
    textOptOut: true
  }, new Map(), {
    appointments: [],
    activityLogs: []
  });

  assert.equal(item.title, "Alexandria Martinez de la Cruz Exampleton");
  assert.equal(item.status, "Active");
  assert.equal(item.siblings, "-");
  assert.deepEqual(item.siblingProfiles, []);
  assert.equal(item.email, "-");
  assert.equal(item.address, "-");
  assert.equal(item.insurance, "Not listed");
  assert.equal(item.hrsn, "Not listed");
  assert.equal(item.providerProfiles, "Dr. Rivera");
  assert.deepEqual(item.providerProfileLinks, [{
    networkId: "",
    providerId: "",
    label: "Dr. Rivera"
  }]);
  assert.equal(item.emailOptOut, "No");
  assert.equal(item.textOptOut, "Yes");
});

test("clean CRM lesson progression preserves the established lesson order", () => {
  assert.deepEqual(clientLessonSteps("lesson-2").map(({ label, state }) => [label, state]), [
    ["Enroll", "Done"],
    ["Nutrient Density", "Done"],
    ["Sugar", "Done"],
    ["Food Groups", "Next"],
    ["Macronutrients", ""],
    ["Micronutrients", ""],
    ["Mindful Eating", ""],
    ["Healthy Habits", ""]
  ]);
  assert.equal(clientLessonIndex("Enrollment"), 0);
  assert.equal(clientLessonIndex("2"), 2);
  assert.equal(clientLessonIndex("lesson-4"), 4);
  assert.equal(clientLessonIndex("Mindful Eating"), 6);
  assert.equal(clientLessonLabel("lesson-2"), "Sugar");
  assert.equal(crmLessonIsCurrent("Enrollment", "enrollment"), true);
  assert.equal(crmLessonIsCurrent("lesson-2", "2"), true);
  assert.equal(crmLessonIsCurrent("lesson-2", "lesson-3"), false);
});

test("clean CRM template keeps the approved shell while adding CRM-specific information", () => {
  assert.match(cleanSource, /subpages: \["Clinic", "Kitchen", "School", "Public Booking"\]/);
  assert.match(cleanSource, /subpages: \["Clients", "Referrals", "Referral Network"\]/);
  assert.match(cleanSource, /\["Dashboard", "Tasks"\]\.includes\(crmInitialParams\.get\("section"\)\)[\s\S]*?\? "Clients"/);
  assert.doesNotMatch(cleanSource, /href="\.\/crm\.html\?section=Tasks"/);
  assert.doesNotMatch(cleanSource, />View CRM Dashboard</);
  assert.match(cleanSource, /views: \[\]/);
  assert.match(cleanSource, /detailTabIcons: \["crm", "note", "calendar", "file"\]/);
  assert.match(cleanSource, /footerActions: \["Log Call", "Log Text", "New Appt", "Close Client"\]/);
  assert.match(cleanSource, /quickActions: \["New Client", "New Referral"\]/);
  assert.doesNotMatch(cleanSource, /quickActions: \["New Client", "New Referral", "New Task"\]/);
  assert.match(cleanSource, /data-crm-status-select/);
  assert.match(cleanSource, /data-crm-detail-tab/);
  assert.match(cleanSource, /data-crm-action/);
  assert.match(cleanSource, /data-crm-communications-drawer/);
  assert.match(cleanSource, /data-crm-communications-review/);
  assert.match(cleanSource, /data-crm-communications-send/);
  assert.match(cleanSource, /Sent by \$\{escapeHtml\(sender\)\}/);
  assert.match(cleanSource, /data-crm-lesson-steps/);
  assert.match(cleanSource, /\["Email", "email"\]/);
  assert.match(cleanSource, /\["Preferred Contact", "preferredContact"\]/);
  assert.match(cleanSource, /\["Address", "address"\]/);
  assert.match(cleanSource, /\["Email Opt Out", "emailOptOut"\]/);
  assert.match(cleanSource, /\["Text Opt Out", "textOptOut"\]/);
  assert.match(cleanSource, /\["HRSN", "hrsn"\]/);
  assert.match(cleanSource, /\["YCCO Member ID", "yccoId"\]/);
  assert.match(cleanSource, /\["Birthdate", "dob"\]/);
  assert.match(cleanSource, /\["Gender", "gender"\]/);
  assert.match(cleanSource, /\["Converted Date", "convertedDate"\]/);
  assert.match(cleanSource, /\["First Contact", "firstContact"\]/);
  assert.match(cleanSource, /\["First Appointment", "firstAppt"\]/);
  assert.match(cleanSource, /\["Graduation Date", "graduationDate"\]/);
  assert.match(cleanSource, /\["Referral Type", "referralType"\]/);
  assert.match(cleanSource, /\["Referral Date", "referralDate"\]/);
  assert.match(cleanSource, /\["Referring Provider", "providerProfiles"\]/);
  const familyFieldsBlock = cleanSource.match(/const crmFamilyFields = \[([\s\S]*?)\n\];/)?.[1] || "";
  const familyFieldOrder = [...familyFieldsBlock.matchAll(/\["([^"]+)", "([^"]+)"\]/g)]
    .map((match) => [match[1], match[2]]);
  assert.deepEqual(familyFieldOrder, [
    ["Caregiver", "caregiver"],
    ["Siblings", "siblings"],
    ["Phone", "phone"],
    ["Email", "email"],
    ["Address", "address"]
  ]);
  const expectedProfileFieldOrder = [
    ["Language", "language"],
    ["Referral Date", "referralDate"],
    ["Referral Type", "referralType"],
    ["Birthdate", "dob"],
    ["First Contact", "firstContact"],
    ["Referring Provider", "providerProfiles"],
    ["Gender", "gender"],
    ["Converted Date", "convertedDate"],
    ["Preferred Contact", "preferredContact"],
    ["Insurance", "insurance"],
    ["YCCO Member ID", "yccoId"],
    ["First Appointment", "firstAppt"],
    ["Email Opt Out", "emailOptOut"],
    ["HRSN", "hrsn"],
    ["Graduation Date", "graduationDate"],
    ["Text Opt Out", "textOptOut"],
    ["Service Email Consent", "serviceEmailConsent"],
    ["Service Text Consent", "serviceTextConsent"],
    ["Marketing Email Consent", "marketingConsent"],
    ["Consent Source", "consentSource"],
    ["Consent Date", "consentDate"]
  ];
  const detailFieldsBlock = cleanSource.match(/const crmClientDetailFields = \[([\s\S]*?)\n\];/)?.[1] || "";
  const detailFieldOrder = [...detailFieldsBlock.matchAll(/\["([^"]+)", "([^"]+)"\]/g)]
    .map((match) => [match[1], match[2]]);
  assert.deepEqual(detailFieldOrder, expectedProfileFieldOrder);
  const editorBlock = cleanSource.slice(
    cleanSource.indexOf("function renderCrmClientEditorMain"),
    cleanSource.indexOf("function renderCrmClientForm")
  );
  const editorFieldOrder = [...editorBlock.matchAll(/<label[^>]*>\s*<span>([^<]+)<\/span>/g)]
    .map((match) => match[1])
    .slice(0, expectedProfileFieldOrder.length);
  assert.deepEqual(editorFieldOrder, expectedProfileFieldOrder.map(([label]) => label));
  assert.doesNotMatch(cleanSource, /\["Referral source", "referralSource"\]/);
  assert.match(cleanSource, /<strong>Eligible<\/strong>/);
  assert.doesNotMatch(cleanSource, /modules\.crm[\s\S]*?sideLink: "Open Client Profile"/);
  assert.match(cleanSource, /typeof select\.showPicker === "function"/);
  assert.match(cleanSource, /select\.showPicker\(\)/);
  assert.match(cleanSource, /new URLSearchParams\(window\.location\.search\)\.get\("client"\)/);
  assert.match(cleanSource, /location\.href = crmAppointmentUrl\(item\)/);
  assert.match(cleanSource, /location\.href = crmNewAppointmentUrl\(item\)/);
  assert.match(cleanSource, /location\.href = `\.\/crm\.html\?client=/);
  assert.match(cleanSource, /data-crm-side-detail/);
  assert.match(cleanSource, /data-crm-side-editor/);
  assert.match(cleanSource, /data-crm-related-id/);
  assert.match(cleanSource, /data-crm-provider-network-id/);
  assert.match(cleanSource, /renderCrmFields\(card\.fields\)/);
  assert.match(cleanSource, /id="\$\{crmClientEditorFormId\}" data-crm-client-form/);
  assert.match(cleanSource, /form="\$\{escapeHtml\(formId\)\}"/);
  assert.match(cleanSource, /event\.target\.matches\("\[data-crm-status-select\]"\)/);
  assert.match(cleanSource, /saveCrmStatus\(crmSelectedItem\(\), event\.target\.value, event\.target\)/);
  assert.match(cleanCss, /\.app-shell\[data-module-id="crm"\] \.footer-actions \{[\s\S]*?padding: 14px;/);
  assert.match(cleanCss, /\[data-crm-detail-content\] \{[\s\S]*?gap: 12px;/);
  assert.match(cleanCss, /\.crm-status-control select \{[\s\S]*?field-sizing: content;/);
  assert.match(cleanCss, /\.crm-client-detail-grid \{[\s\S]*?grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);/);
  assert.match(cleanCss, /\.crm-detail-column \{[\s\S]*?align-content: start;[\s\S]*?gap: 15px;/);
  assert.match(cleanCss, /\.crm-profile-link \{[\s\S]*?color: #175cd3;/);
  assert.match(cleanCss, /\.crm-profile-editor-fields \{[\s\S]*?grid-template-columns: repeat\(3, minmax\(0, 1fr\)\);/);
  assert.match(cleanCss, /\.crm-communications-drawer \{[\s\S]*?inset: 0 0 0 auto;[\s\S]*?width: min\(440px, 100%\);/);
  assert.match(cleanCss, /\.crm-communication-entry\.is-outbound > div \{[\s\S]*?background: #0a84ff;[\s\S]*?color: #fff;/);
  assert.match(cleanCss, /\.crm-lesson-button \{[\s\S]*?margin-left: -8px;[\s\S]*?padding: 0 12px;/);
  assert.match(cleanCss, /\.crm-lesson-steps \.is-next \{[\s\S]*?padding-right: 12px;[\s\S]*?padding-left: 12px;/);
});

test("shared clean detail layouts anchor footer actions to the panel bottom", () => {
  assert.match(cleanCss, /\.detail-main \{[\s\S]*?display: flex;[\s\S]*?flex-direction: column;/);
  assert.match(cleanCss, /\.footer-actions \{[\s\S]*?margin-top: auto;/);
  assert.match(cleanCss, /\.schedule-detail-panel \{[\s\S]*?flex: 1 1 auto;/);
  assert.match(cleanCss, /\.schedule-wrap-up-actions \{[\s\S]*?margin-top: auto;/);
  assert.match(cleanCss, /\[data-crm-detail-content\] \{[\s\S]*?flex: 1 1 auto;[\s\S]*?flex-direction: column;/);
  assert.match(cleanCss, /\[data-outreach-detail-content\] \{[\s\S]*?flex: 1 1 auto;[\s\S]*?flex-direction: column;/);
  assert.match(cleanCss, /\[data-fundraising-detail-content\] \{[\s\S]*?flex: 1 1 auto;[\s\S]*?flex-direction: column;/);
  assert.match(cleanCss, /\.crm-profile-editor-main \{[\s\S]*?display: flex;[\s\S]*?flex-direction: column;[\s\S]*?min-height: 100%;/);
});

test("shared clean edit buttons preserve the visual rulebook style", () => {
  assert.match(cleanCss, /\.edit-button \{[\s\S]*?border: 0;[\s\S]*?background: transparent;[\s\S]*?color: #175cd3;/);
  assert.doesNotMatch(cleanCss, /^\s*\.card-heading > button/m);
  assert.match(cleanCss, /\.program-settings-form \.card-heading > button/);
});

test("clean CRM links and sorts appointments and contact history by client", () => {
  const client = clients[0];
  const appointments = [
    {
      id: "appointment-old",
      clientIds: ["client-2"],
      appointmentDate: "2026-07-12",
      appointmentTime: "13:30"
    },
    {
      id: "appointment-other",
      clientIds: ["client-3"],
      appointmentDate: "2026-07-20",
      appointmentTime: "14:00"
    },
    {
      id: "appointment-new",
      clientNames: ["Tessa Exampleton"],
      appointmentDate: "2026-07-18",
      appointmentTime: "15:00"
    }
  ];
  const activityLogs = [
    {
      id: "contact-old",
      relatedType: "client",
      relatedId: "client-2",
      occurredAt: "2026-07-10T20:00:00.000Z"
    },
    {
      id: "contact-other",
      relatedType: "referral",
      relatedId: "client-2",
      occurredAt: "2026-07-20T20:00:00.000Z"
    },
    {
      id: "contact-new",
      relatedType: "client",
      relatedId: "client-2",
      occurredAt: "2026-07-16T20:00:00.000Z"
    }
  ];

  assert.deepEqual(
    crmAppointmentsForClient(client, appointments).map(({ id }) => id),
    ["appointment-new", "appointment-old"]
  );
  assert.deepEqual(
    crmActivityForClient(client, activityLogs).map(({ id }) => id),
    ["contact-new", "contact-old"]
  );
});

test("clean CRM search covers profile and family information", () => {
  const item = mapCrmClients(clients)[1];

  assert.equal(crmClientMatches(item, "tessa"), true);
  assert.equal(crmClientMatches(item, "jordan"), true);
  assert.equal(crmClientMatches(item, "milo"), true);
  assert.equal(crmClientMatches(item, "mcminnville"), true);
  assert.equal(crmClientMatches(item, "no such client"), false);
});

test("clean CRM client payload only sends fields present in the form", () => {
  assert.deepEqual(crmClientPayload({
    firstName: " Tessa ",
    notes: " New note ",
    ycco: "on",
    yccoId: " 123ABC456 "
  }), {
    firstName: "Tessa",
    notes: "New note",
    ycco: true,
    yccoId: "123ABC456"
  });

  assert.deepEqual(crmClientPayload({
    graduationDate: " 2026-07-15 ",
    assessmentScore: ""
  }), {
    graduationDate: "2026-07-15",
    assessmentScore: null
  });
});

test("clean CRM computes reciprocal sibling changes without duplicate requests", () => {
  assert.deepEqual(
    crmSiblingChanges(["client-1", "client-2", "client-2"], ["client-2", "client-3", "client-3"]),
    {
      additions: ["client-3"],
      removals: ["client-1"]
    }
  );
});

test("clean CRM contact logs are linked to the selected client", () => {
  assert.deepEqual(crmActivityPayload({
    direction: " Inbound ",
    result: " Scheduled ",
    activityDate: " 2026-07-17 ",
    activityTime: " 15:30 ",
    description: " Confirmed next visit "
  }, {
    id: " client-2 ",
    title: " Tessa Exampleton "
  }, "Call"), {
    direction: "Inbound",
    result: "Scheduled",
    activityDate: "2026-07-17",
    activityTime: "15:30",
    description: "Confirmed next visit",
    type: "Call",
    relatedType: "client",
    relatedId: "client-2",
    relatedName: "Tessa Exampleton",
    title: "Inbound Call"
  });
});

test("clean CRM protects close actions and excludes Closed from ordinary status changes", () => {
  assert.deepEqual(crmCloseDecision("", "client-2"), {
    pendingId: "client-2",
    shouldClose: false
  });
  assert.deepEqual(crmCloseDecision("client-2", "client-2"), {
    pendingId: "",
    shouldClose: true
  });
  assert.equal(crmStatusOptions().includes("Closed"), false);
  assert.equal(crmStatusOptions("Scheduled").includes("Closed"), false);
  assert.equal(crmStatusOptions("Closed").at(-1), "Closed");
});

test("clean CRM presents the reschedule status without changing its stored value", () => {
  assert.equal(crmStatusLabel("Needs Reschedule"), "Reschedule");
  assert.equal(crmStatusLabel("Scheduled"), "Scheduled");
  assert.ok(crmStatusOptions().includes("Needs Reschedule"));
});

test("client status groups have the approved default open and closed behavior", () => {
  assert.match(cleanSource, /new Set\(\["Needs Reschedule", "Scheduled", "Active"\]\)/);
  assert.match(cleanSource, /data-crm-client-status-expand="all"/);
  assert.match(cleanSource, /data-crm-client-status-expand="none"/);
  assert.match(cleanSource, /data-crm-client-status-toggle/);
  assert.match(cleanCss, /\.crm-client-status-heading\[aria-expanded="true"\] svg/);
});

test("clean CRM keeps a newly saved record selected after its refreshed list arrives", () => {
  const items = [{ id: "first" }, { id: "new-record" }];

  assert.equal(crmPreferredItemId(items, "new-record"), "new-record");
  assert.equal(crmPreferredItemId(items, "", "new-record"), "new-record");
  assert.equal(crmPreferredItemId(items, "missing"), "first");
  assert.equal(crmPreferredItemId([], "new-record"), "");
});

test("clean CRM Scheduling handoffs preserve client and appointment context", () => {
  assert.equal(
    crmAppointmentUrl({ id: "appt 7", appointmentDate: "2026-07-22" }),
    "./schedule.html?appointment=appt+7&date=2026-07-22"
  );
  assert.equal(
    crmNewAppointmentUrl({ id: "client 2" }),
    "./schedule.html?client=client+2&new=1"
  );
  assert.equal(
    crmAppointmentDescription({ lesson: "2", appointmentType: "Nutrition Education", goal: "Try carrots" }),
    "Sugar | Nutrition Education | Try carrots"
  );
});

test("clean CRM summary uses current client statuses", () => {
  assert.deepEqual(crmSummary(mapCrmClients(clients)), [
    ["1", "Reschedule"],
    ["1", "Scheduled"],
    ["1", "Active"],
    ["1", "Waiting on Family"]
  ]);
});

test("clean CRM preserves workflow status order and color meaning", () => {
  assert.ok(crmClientStatusRank("Needs Reschedule") < crmClientStatusRank("Scheduled"));
  assert.ok(crmClientStatusRank("Scheduled") < crmClientStatusRank("Active"));
  assert.equal(crmClientStatusTone("Needs Reschedule"), "red");
  assert.equal(crmClientStatusTone("Scheduled"), "green");
  assert.equal(crmClientStatusTone("Active"), "blue");
  assert.equal(crmClientStatusTone("Waiting on Family"), "purple");
  assert.equal(crmClientStatusTone("Graduated"), "yellow");

  assert.ok(crmReferralStatusRank("New") < crmReferralStatusRank("Texted"));
  assert.ok(crmReferralStatusRank("Texted") < crmReferralStatusRank("Scheduled"));
  assert.equal(crmReferralStatusTone("New"), "red");
  assert.equal(crmReferralStatusTone("Texted"), "green");
  assert.equal(crmReferralStatusTone("Scheduled"), "blue");
  assert.equal(crmReferralStatusTone("Caregiver Will Call Back"), "purple");

  assert.deepEqual(
    mapCrmClients([
      { id: "active", firstName: "Active", status: "Active" },
      { id: "reschedule", firstName: "Reschedule", status: "Needs Reschedule" },
      { id: "scheduled", firstName: "Scheduled", status: "Scheduled" }
    ]).map((client) => client.id),
    ["reschedule", "scheduled", "active"]
  );
  assert.deepEqual(
    mapCrmReferrals([
      { id: "scheduled", firstName: "Scheduled", status: "Scheduled" },
      { id: "new", firstName: "New", status: "New" },
      { id: "texted", firstName: "Texted", status: "Texted" }
    ]).map((referral) => referral.id),
    ["new", "texted", "scheduled"]
  );
  assert.match(cleanSource, /data-status-tone/);
  assert.match(cleanCss, /crm-status-control\[data-status-tone="green"\]/);
});

test("clean CRM selects, scores, and launches the approved retrospective knowledge assessment", () => {
  const instrument = {
    id: "clinic-knowledge-2026-2",
    name: "Clinic Knowledge Assessment",
    version: "2026.2",
    effectiveDate: "2026-07-29",
    programArea: "Clinic",
    status: "Active",
    administrationPoints: ["Graduation"],
    languages: ["English"]
  };
  const questions = [
    { id: "Q1", instrumentId: instrument.id, recordStatus: "Active", topic: "Lesson 1", sortOrder: 1 },
    { id: "Q2", instrumentId: instrument.id, recordStatus: "Active", topic: "Lesson 1", sortOrder: 2 },
    { id: "Q3", instrumentId: instrument.id, recordStatus: "Active", topic: "Lesson 2", sortOrder: 3 }
  ];
  const answers = [
    { questionId: "Q1", beforeValue: "No", nowValue: "Yes" },
    { questionId: "Q2", beforeValue: "No", nowValue: "Yes" },
    { questionId: "Q3", beforeValue: "No", nowValue: "No" }
  ];
  const formData = new FormData();
  formData.set("responseDate", "2026-07-29");
  formData.set("language", "English");
  formData.set("before-Q1", "No");
  formData.set("now-Q1", "Yes");
  formData.set("before-Q2", "No");
  formData.set("now-Q2", "Yes");
  formData.set("before-Q3", "No");
  formData.set("now-Q3", "No");
  formData.set("notes", "Reviewed with child.");

  assert.equal(clinicKnowledgeInstrumentFor([
    { ...instrument, id: "other-clinic-tool", name: "Other Clinic Tool" },
    instrument
  ]).id, instrument.id);
  assert.deepEqual(clinicKnowledgeQuestionsForInstrument(questions, instrument.id).map(({ id }) => id), ["Q1", "Q2", "Q3"]);
  assert.deepEqual(clinicKnowledgeResponseResult({ instrumentId: instrument.id, answers }, questions), {
    score: 50,
    beforeScore: 0,
    nowScore: 50,
    gain: 50,
    complete: true,
    answeredCount: 3,
    questionCount: 3,
    lessonScores: [
      { lesson: "Lesson 1", beforePercent: 0, nowPercent: 100, gain: 100 },
      { lesson: "Lesson 2", beforePercent: 0, nowPercent: 0, gain: 0 }
    ]
  });
  assert.deepEqual(clinicKnowledgeScoreSummary({ instrumentId: instrument.id, answers }, questions), {
    score: 50,
    beforeScore: 0,
    nowScore: 50,
    gain: 50
  });
  assert.equal(clinicKnowledgeResponseScore({ instrumentId: instrument.id, answers }, questions), 50);
  assert.equal(clinicKnowledgeAnsweredCount({ instrumentId: instrument.id, answers }, questions), 3);
  assert.equal(clinicKnowledgeResponseForPoint([
    { id: "older", clientId: "child-1", instrumentId: instrument.id, administrationPoint: "Enrollment", responseDate: "2026-07-01" },
    { id: "newer", clientId: "child-1", instrumentId: instrument.id, administrationPoint: "Enrollment", responseDate: "2026-07-02" }
  ], "child-1", instrument.id, "Enrollment").id, "newer");
  assert.deepEqual(clinicEvaluationFormPayload(formData, {
    instrument,
    questions,
    clientId: "child-1",
    clientBirthdate: "2015-05-14",
    administrationPoint: "Graduation",
    status: "Complete"
  }), {
    instrumentId: instrument.id,
    instrumentName: instrument.name,
    instrumentVersion: instrument.version,
    instrumentEffectiveDate: instrument.effectiveDate,
    programArea: "Clinic",
    clientId: "child-1",
    clientBirthdate: "2015-05-14",
    appointmentId: "",
    administrationPoint: "Graduation",
    responseDate: "2026-07-29",
    status: "Complete",
    respondentType: "",
    respondentName: "",
    language: "English",
    answers,
    notes: "Reviewed with child."
  });
  assert.equal(clinicInstrumentKind(instrument), "knowledge-retrospective");
  assert.equal(clinicLessonColor("Lesson 2: Sugar"), "#d27354");
  assert.equal(clinicFormUrl({ clientId: "child 1", instrumentId: instrument.id, administrationPoint: "Graduation" }), "./client-form.html?client=child+1&instrument=clinic-knowledge-2026-2&point=Graduation");
  assert.equal(clinicFormUrl({ clientId: "child 1", instrumentId: instrument.id, administrationPoint: "Graduation", appointmentId: "appt 1" }), "./client-form.html?client=child+1&instrument=clinic-knowledge-2026-2&point=Graduation&appointment=appt+1");
  assert.deepEqual(clinicNativeFormActions(), {
    clientLabel: "Client View",
    staffLabel: "Enter Answers"
  });
  assert.deepEqual(clinicNativeFormActions({ id: "draft-1", status: "Draft" }), {
    clientLabel: "Resume Client View",
    staffLabel: "Enter Answers"
  });
  assert.deepEqual(clinicNativeFormActions({ id: "complete-1", status: "Complete" }), {
    clientLabel: "Client View",
    staffLabel: "View/Edit Answers"
  });
  assert.equal(clinicHealthInstrumentFor([{ id: "clinic-health-2026-1", name: "Nutrition & Healthy Habits Questionnaire", status: "Active" }]).id, "clinic-health-2026-1");
  assert.match(cleanSource, /clinicFormUrl/);
  assert.match(cleanSource, /Previous Form Versions/);
  assert.doesNotMatch(cleanSource, /data-crm-assessment-form/);
  assert.match(cleanSource, /\/api\/evaluation-instruments\?status=Active&includeQuestions=true/);
  assert.match(cleanSource, /\/api\/evaluation-responses/);
  assert.match(cleanSource, /mode: "staff"/);
  assert.match(cleanSource, /target="_blank" rel="noopener">\$\{escapeHtml\(actionLabels\.staffLabel\)\}/);
  assert.doesNotMatch(cleanSource, /Other Printable Forms/);
  assert.match(cleanSource, /crmFormTypeInstrument\("Enrollment"\)/);
  assert.match(cleanSource, /crmFormTypeInstrument\("HRSN Screener"\)/);
  assert.match(cleanSource, /crmFormTypeInstrument\("Child Feedback"\)/);
  assert.match(cleanSource, /crmFormTypeInstrument\("Caregiver Feedback"\)/);
  const formsPanelSource = cleanSource.slice(
    cleanSource.indexOf("function renderCrmFormsPanel"),
    cleanSource.indexOf("function renderCrmReferralNotesPanel")
  );
  assert.ok(formsPanelSource.indexOf('title: "Program Enrollment"') < formsPanelSource.indexOf('title: "Questionnaire"'));
  assert.ok(formsPanelSource.indexOf('title: "Questionnaire"') < formsPanelSource.indexOf('title: "HRSN Screener"'));
  assert.ok(formsPanelSource.indexOf('title: "HRSN Screener"') < formsPanelSource.indexOf('title: "Knowledge Assessment"'));
  const assessmentSummarySource = cleanSource.slice(
    cleanSource.indexOf("function renderCrmAssessmentSummary"),
    cleanSource.indexOf("function renderCrmLegacyAssessmentHistory")
  );
  assert.doesNotMatch(assessmentSummarySource, /Effective/);
  assert.doesNotMatch(assessmentSummarySource, /options\.description/);
  const appointmentPanelSource = cleanSource.slice(
    cleanSource.indexOf("function renderCrmAppointmentHeading"),
    cleanSource.indexOf("function renderCrmFormsPanel")
  );
  assert.doesNotMatch(appointmentPanelSource, /Enrollment Packet|Graduation Packet|crmPacketUrl/);
  assert.doesNotMatch(cleanSource, /renderCrmNativePrintLink/);
  assert.match(cleanCss, /\.crm-assessment-row-actions/);
  assert.match(clientFormHtml, /manifest\.webmanifest/);
  assert.match(clientFormSource, /\["No", "Yes"\]/);
  assert.match(clientFormSource, /BEFORE SNACK/);
  assert.doesNotMatch(clientFormSource, /Choose No or Yes for what you knew then/);
  assert.match(clientFormSource, /function renderStaffMode\(\)/);
  assert.match(clientFormSource, /client-form-knowledge-comparison/);
  assert.match(clientFormSource, /client-form-staff-nav-label/);
  assert.match(clientFormSource, /has-compact-numbers/);
  assert.doesNotMatch(clientFormSource, /function visibleQuestionsForGroup\(/);
  assert.doesNotMatch(clientFormSource, /Not applicable because/);
  assert.doesNotMatch(clientFormSource, /answers\.delete\(conditional\.id\)/);
  assert.match(clientFormSource, /group\.questions\.every\(\(question\) => questionComplete\(question, kind\)\)/);
  assert.match(clientFormSource, /group\.questions\.map\(\(question\) => renderStaffQuestion/);
  assert.match(clientFormSource, /data-staff-save="Complete"/);
  assert.match(clientFormSource, /data-staff-delete-draft/);
  assert.match(clientFormSource, /Select Confirm Delete to permanently remove this draft/);
  assert.match(clientFormSource, /method: "DELETE"/);
  assert.match(clientFormCss, /\.client-form-staff-footer button\.is-danger/);
  assert.match(clientFormSource, /Think about the past 7 days/);
  assert.match(clientFormSource, /function packetDefinition\(instruments = \[\]\)/);
  assert.match(clientFormSource, /requestedPacket === "enrollment"/);
  assert.match(clientFormSource, /renderPacketPaperMode/);
  assert.match(clientFormCss, /\.client-form-progress/);
  assert.match(clientFormCss, /\.client-form-perspective-heading h2/);
  assert.match(clientFormCss, /\.client-form-staff-workspace/);
  assert.match(clientFormCss, /\.client-form-paper-options\.is-balanced-seven/);
  assert.match(clientFormCss, /\.client-form-paper-question\.has-healthy-habits-options/);
  assert.match(clientFormCss, /grid-template-columns: max-content repeat\(2, max-content\) max-content repeat\(2, max-content\)/);
  assert.match(clientFormCss, /\.client-form-paper-retrospective-options strong \{\s*grid-column: auto;/);
  assert.match(clientFormCss, /\.client-form-paper-packet \.client-form-paper \+ \.client-form-paper/);
  assert.match(clientFormCss, /grid-template-columns: minmax\(0, 1\.4fr\) minmax\(0, 1fr\) minmax\(0, 1fr\)/);
  assert.match(clientFormCss, /\.client-form-knowledge-comparison-row/);
  assert.match(clientFormCss, /grid-template-columns: minmax\(0, 42%\) minmax\(0, 58%\)/);
});

test("clean CRM Dashboard combines actionable records and links each item to its source", () => {
  const dashboardClients = [
    { id: "waiting", firstName: "Wait", lastName: "Family", status: "Waiting on Family" },
    { id: "reschedule", firstName: "Needs", lastName: "Time", status: "Needs Reschedule" },
    { id: "no-next", firstName: "No", lastName: "Appointment", status: "Active", currentLesson: "Sugar" },
    { id: "scheduled", firstName: "Has", lastName: "Appointment", status: "Active" }
  ];
  const appointments = [
    { id: "future", clientIds: ["scheduled"], status: "Scheduled", appointmentDate: "2026-07-30" },
    { id: "completed", clientIds: ["no-next"], status: "Completed", appointmentDate: "2026-07-29" }
  ];
  const items = crmDashboardItems({
    clients: dashboardClients,
    referrals: [
      { id: "new-referral", firstName: "New", lastName: "Referral", status: "New" },
      { id: "converted-referral", firstName: "Converted", status: "New", convertedClientId: "client-1" }
    ],
    appointments,
    tasks: [{ id: "task-1", title: "Call family", status: "Open", clientId: "waiting", dueDate: "2026-07-22" }],
    referenceDate: new Date(2026, 6, 21, 12)
  });

  assert.deepEqual(items.map(({ queue }) => queue), [
    "New Referrals",
    "Waiting on Family",
    "Reschedule",
    "No Next Appointment",
    "Workflow Tasks"
  ]);
  assert.deepEqual(items.map(({ section, recordId }) => [section, recordId]), [
    ["Referrals", "new-referral"],
    ["Clients", "waiting"],
    ["Clients", "reschedule"],
    ["Clients", "no-next"],
    ["Clients", "waiting"]
  ]);
  assert.equal(items.find(({ queue }) => queue === "No Next Appointment")?.status, "Active");
  assert.deepEqual(crmDashboardSummary(items), [
    ["1", "New Referrals"],
    ["1", "Reschedule"],
    ["1", "No Next Appt"],
    ["0", "Due Tasks"]
  ]);
  assert.deepEqual(crmDashboardTaskSummary(items), {
    overdue: 0,
    dueToday: 0,
    upcoming: 1,
    noDate: 0,
    total: 1
  });
  assert.equal(taskDueBucket({ dueDate: "2026-07-20" }, new Date(2026, 6, 21, 12)), "Overdue");
  assert.equal(taskDueBucket({ dueDate: "2026-07-21" }, new Date(2026, 6, 21, 12)), "Due Today");
  assert.equal(taskDueBucket({ dueDate: "2026-07-22" }, new Date(2026, 6, 21, 12)), "Upcoming");
  assert.equal(hasNextAppointment("scheduled", appointments, new Date(2026, 6, 21, 12)), true);
  assert.equal(hasNextAppointment("no-next", appointments, new Date(2026, 6, 21, 12)), false);
  assert.deepEqual(crmCompletedTaskItems([
    {
      id: "completed-task",
      title: "Confirm next appointment",
      status: "Done",
      assignedTo: "Cynthia Esparza",
      clientId: "waiting",
      completedAt: "2026-07-23T15:00:00.000Z"
    },
    { id: "open-task", title: "Still open", status: "Open" }
  ]).map(({ title, status, section, recordId }) => ({ title, status, section, recordId })), [{
    title: "Confirm next appointment",
    status: "Completed",
    section: "Clients",
    recordId: "waiting"
  }]);
  assert.match(cleanSource, /data-crm-dashboard-section/);
  assert.match(cleanSource, /data-crm-dashboard-complete-task/);
  assert.match(cleanSource, /data-crm-dashboard-new-task/);
  assert.match(cleanSource, /data-crm-dashboard-task-view="completed"/);
  assert.match(cleanSource, /data-crm-dashboard-restore-task/);
  assert.match(cleanSource, /function renderCrmTaskDialog\(\)/);
  assert.match(cleanSource, /form\.elements\.relatedRecord\.innerHTML = renderCrmTaskRelatedOptions\(\)/);
  assert.match(cleanSource, /data-crm-dashboard-toggle-queue/);
  assert.doesNotMatch(cleanSource, /Recent CRM Activity/);
  assert.match(cleanCss, /\.app-shell\[data-crm-section="Tasks"\] \.workspace \{\s*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(cleanCss, /\.app-shell\[data-crm-section="Tasks"\] \.detail-panel,/);
  assert.doesNotMatch(cleanCss, /data-crm-section="Dashboard"/);
});

test("clean CRM loads Firebase configuration before its interface code", () => {
  const configPosition = crmHtml.indexOf('src="./app-config.js');
  const interfacePosition = crmHtml.indexOf('src="./clean.js');

  assert.ok(configPosition >= 0, "CRM page must load app-config.js");
  assert.ok(interfacePosition >= 0, "CRM page must load clean.js");
  assert.ok(configPosition < interfacePosition, "Firebase configuration must load before clean.js");
});

test("local staff sign-in uses Firebase's authorized localhost address", () => {
  assert.match(appConfig, /hostname === "127\.0\.0\.1"/);
  assert.match(appConfig, /localUrl\.hostname = "localhost"/);
  assert.match(appConfig, /window\.location\.replace\(localUrl\.toString\(\)\)/);
});
