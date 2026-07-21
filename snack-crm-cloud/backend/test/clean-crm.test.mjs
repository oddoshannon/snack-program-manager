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
  crmStatusOptions,
  crmSummary,
  mapCrmClient,
  mapCrmClients
} from "../../frontend/public/modules/crm.js";

const crmHtml = await readFile(new URL("../../frontend/public/crm.html", import.meta.url), "utf8");
const appConfig = await readFile(new URL("../../frontend/public/app-config.js", import.meta.url), "utf8");
const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
const cleanCss = await readFile(new URL("../../frontend/public/clean.css", import.meta.url), "utf8");

const clients = [
  {
    id: "client-2",
    firstName: "Janney",
    lastName: "Hernandez",
    parentName: "Neiva",
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
    email: "neiva@example.com",
    emailOptOut: true,
    textOptOut: false,
    addressStreet: "2435 NE Cumulus Ave",
    addressCity: "McMinnville",
    addressState: "OR",
    addressZip: "97128",
    siblingIds: ["client-1"],
    ycco: true,
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
    firstName: "Rafael",
    lastName: "Hernandez",
    parentName: "Neiva",
    preferredLanguage: "Spanish",
    status: "Needs Reschedule",
    siblingIds: ["client-2"]
  },
  {
    id: "client-3",
    firstName: "Cali",
    lastName: "Flint",
    status: "Active"
  },
  {
    id: "client-4",
    firstName: "Mark",
    lastName: "Flint",
    status: "Waiting on Family"
  }
];

test("clean CRM maps and alphabetizes real client records", () => {
  const items = mapCrmClients(clients);

  assert.deepEqual(items.map((item) => item.title), ["Cali Flint", "Janney Hernandez", "Mark Flint", "Rafael Hernandez"]);
  assert.equal(items[1].siblings, "Rafael Hernandez");
  assert.deepEqual(items[1].siblingProfiles, [{
    id: "client-1",
    name: "Rafael Hernandez",
    section: "Clients"
  }]);
  assert.equal(items[1].subtitle, "Enrollment | 7/14/26");
  assert.equal(items[1].insurance, "YCCO");
  assert.equal(items[1].providerProfiles, "Dr. Rivera (Physicians Medical Center)");
  assert.deepEqual(items[1].providerProfileLinks, [{
    networkId: "network-1",
    providerId: "provider-1",
    label: "Dr. Rivera (Physicians Medical Center)"
  }]);
  assert.equal(items[1].recentContact, "7/10/26");
  assert.equal(items[1].referralDate, "6/1/26");
  assert.equal(items[1].preferredContact, "Text");
  assert.equal(items[1].email, "neiva@example.com");
  assert.equal(items[1].emailOptOut, "Yes");
  assert.equal(items[1].textOptOut, "No");
  assert.equal(items[1].gender, "Female");
  assert.equal(items[1].hrsn, "Not Eligible");
  assert.equal(items[1].firstContact, "6/3/26");
  assert.equal(items[1].referralType, "Internal Clinic Referral");
  assert.equal(items[1].referralSource, "Physicians Medical Center");
  assert.equal(items[1].address, "2435 NE Cumulus Ave, McMinnville, OR, 97128");
  assert.equal(items[1].graduationDate, "7/15/26");
});

test("clean CRM keeps long names readable and handles incomplete records safely", () => {
  const item = mapCrmClient({
    id: "client-long",
    firstName: "Alexandria",
    lastName: "Martinez de la Cruz Hernandez",
    status: "",
    siblingIds: ["missing-sibling"],
    providerLinks: [{ providerName: "Dr. Rivera", organizationName: "" }],
    emailOptOut: false,
    textOptOut: true
  }, new Map(), {
    appointments: [],
    activityLogs: []
  });

  assert.equal(item.title, "Alexandria Martinez de la Cruz Hernandez");
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
  assert.match(cleanSource, /subpages: \["Clinic", "Public Booking"\]/);
  assert.match(cleanSource, /subpages: \["Clients", "Referrals", "Referral Network"\]/);
  assert.match(cleanSource, /views: \[\]/);
  assert.match(cleanSource, /detailTabIcons: \["crm", "note", "calendar", "file"\]/);
  assert.match(cleanSource, /footerActions: \["Log Call", "Log Text", "New Appt", "Close Client"\]/);
  assert.match(cleanSource, /quickActions: \["New Client", "New Referral"\]/);
  assert.doesNotMatch(cleanSource, /quickActions: \["New Client", "New Referral", "New Task"\]/);
  assert.match(cleanSource, /data-crm-status-select/);
  assert.match(cleanSource, /data-crm-detail-tab/);
  assert.match(cleanSource, /data-crm-action/);
  assert.match(cleanSource, /data-crm-lesson-steps/);
  assert.match(cleanSource, /\["Email", "email"\]/);
  assert.match(cleanSource, /\["Preferred Contact", "preferredContact"\]/);
  assert.match(cleanSource, /\["Address", "address"\]/);
  assert.match(cleanSource, /\["Email Opt Out", "emailOptOut"\]/);
  assert.match(cleanSource, /\["Text Opt Out", "textOptOut"\]/);
  assert.match(cleanSource, /\["HRSN", "hrsn"\]/);
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
    ["First Appointment", "firstAppt"],
    ["Email Opt Out", "emailOptOut"],
    ["HRSN", "hrsn"],
    ["Graduation Date", "graduationDate"],
    ["Text Opt Out", "textOptOut"]
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
  assert.match(cleanCss, /\.crm-lesson-button \{[\s\S]*?margin-left: -8px;[\s\S]*?padding: 0 12px;/);
  assert.match(cleanCss, /\.crm-lesson-steps \.is-next \{[\s\S]*?padding-right: 12px;[\s\S]*?padding-left: 12px;/);
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
      clientNames: ["Janney Hernandez"],
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

  assert.equal(crmClientMatches(item, "janney"), true);
  assert.equal(crmClientMatches(item, "neiva"), true);
  assert.equal(crmClientMatches(item, "rafael"), true);
  assert.equal(crmClientMatches(item, "mcminnville"), true);
  assert.equal(crmClientMatches(item, "no such client"), false);
});

test("clean CRM client payload only sends fields present in the form", () => {
  assert.deepEqual(crmClientPayload({
    firstName: " Janney ",
    notes: " New note ",
    ycco: "on"
  }), {
    firstName: "Janney",
    notes: "New note",
    ycco: true
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
    title: " Janney Hernandez "
  }, "Call"), {
    direction: "Inbound",
    result: "Scheduled",
    activityDate: "2026-07-17",
    activityTime: "15:30",
    description: "Confirmed next visit",
    type: "Call",
    relatedType: "client",
    relatedId: "client-2",
    relatedName: "Janney Hernandez",
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
    ["1", "Needs Reschedule"],
    ["1", "Scheduled"],
    ["1", "Active"],
    ["1", "Waiting on Family"]
  ]);
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
