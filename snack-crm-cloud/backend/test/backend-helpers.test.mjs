import assert from "node:assert/strict";
import { test } from "node:test";
import {
  app,
  appointmentBlocksSchedule,
  appointmentClientCountFromRecord,
  appointmentDurationMinutesFromRecord,
  appointmentFitsSchedulingWindow,
  appointmentRangesOverlap,
  appointmentTimeMinutes,
  cleanActivityLogPayload,
  cleanAppointmentPayload,
  cleanBoolean,
  cleanGrantDocumentLink,
  cleanGrantOrganizationInfoPayload,
  cleanGrantPayload,
  cleanGrantQuestionPayload,
  cleanNetworkProvider,
  cleanOptionalInteger,
  cleanOptionalNumber,
  cleanOutreachContactPayload,
  cleanOutreachEventPayload,
  cleanPersonPayload,
  cleanProviderLink,
  cleanPublicBookingPayload,
  cleanReferralNetworkPayload,
  cleanString,
  cleanTaskPayload,
  clientPayloadFromReferral,
  daysBetweenDateStrings,
  formatAppointmentTimeValue,
  hasRequiredPersonFields,
  isActiveTaskStatus,
  isGeneratedTaskSource,
  isPublicBookableDate,
  normalizeActivityDirection,
  normalizeActivityType,
  normalizeAppointmentStatus,
  normalizeAppointmentTimeValue,
  normalizeStatus,
  normalizeTaskPriority,
  normalizeTaskStatus,
  normalizeTaskType,
  normalizedLookupKey,
  normalizedTaskTitle,
  publicAppointmentDraft,
  publicBookingServiceFromId,
  publicBookingServices,
  publicBookingValidationError,
  publicSlotValuesForDate,
  referralSourceFromRecord,
  resolveAppointmentImportClients,
  schedulingWindowEndLabel,
  schedulingWindowError,
  startDayTaskIntent,
  startDayTaskSubject,
  tasksMatchStartDayIntent,
  toActivityLog,
  toAppointment,
  toClient,
  toGrant,
  toGrantOrganizationInfo,
  toGrantQuestion,
  toReferral,
  toTask
} from "../server.js";

function snapshot(id, data) {
  return {
    id,
    exists: true,
    data: () => data
  };
}

function nextUtcWeekday(day) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);

  while (date.getUTCDay() !== day) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return date.toISOString().slice(0, 10);
}

test("cleanString trims only string values", () => {
  assert.equal(cleanString("  Andi Jo  "), "Andi Jo");
  assert.equal(cleanString(42), "");
});

test("cleanBoolean accepts checked-style true values", () => {
  for (const value of [true, "true", "yes", "Y", "1", "checked"]) {
    assert.equal(cleanBoolean(value), true);
  }

  for (const value of [false, "false", "no", "0", "", null]) {
    assert.equal(cleanBoolean(value), false);
  }
});

test("cleanOptionalNumber returns numbers or null", () => {
  assert.equal(cleanOptionalNumber(" 8 "), 8);
  assert.equal(cleanOptionalNumber(""), null);
  assert.equal(cleanOptionalNumber("not a number"), null);
  assert.equal(cleanOptionalInteger("4.6"), 5);
  assert.equal(cleanOptionalInteger("-2"), 0);
});

test("normalizeStatus maps legacy caregiver callback labels", () => {
  assert.equal(normalizeStatus("Parent Will Call Back"), "Caregiver Will Call Back");
  assert.equal(normalizeStatus(""), "New");
});

test("cleanPersonPayload normalizes profile data", () => {
  const payload = cleanPersonPayload({
    firstName: " Melody ",
    lastName: " Martinez ",
    parentName: " Mellani ",
    phone: " 503 ",
    preferredLanguage: " English ",
    emailOptOut: "checked",
    textOptOut: "",
    ycco: "yes",
    hrsn: "1",
    assessmentScore: "8",
    willingnessScore: "5"
  });

  assert.equal(payload.firstName, "Melody");
  assert.equal(payload.emailOptOut, true);
  assert.equal(payload.textOptOut, false);
  assert.equal(payload.ycco, true);
  assert.equal(payload.hrsn, true);
  assert.equal(payload.assessmentScore, 8);
  assert.equal(payload.willingnessScore, 5);
});

test("hasRequiredPersonFields enforces core profile requirements", () => {
  assert.equal(hasRequiredPersonFields({
    firstName: "A",
    lastName: "B",
    parentName: "Caregiver",
    phone: "555",
    preferredLanguage: "English"
  }), true);
  assert.equal(hasRequiredPersonFields({
    firstName: "A",
    lastName: "B",
    parentName: "Caregiver",
    preferredLanguage: "English"
  }), false);
});

test("cleanNetworkProvider preserves provided ids and trims values", () => {
  assert.deepEqual(cleanNetworkProvider({
    id: "p1",
    name: " William Koenig, DO ",
    phone: " 503 ",
    email: " doc@example.com ",
    website: " https://example.com "
  }), {
    id: "p1",
    name: "William Koenig, DO",
    email: "doc@example.com",
    notes: ""
  });

  const provider = cleanNetworkProvider({ name: "New Provider" });
  assert.match(provider.id, /^[0-9a-f-]{36}$/i);
});

test("cleanProviderLink trims linked provider metadata", () => {
  assert.deepEqual(cleanProviderLink({
    networkId: " org ",
    providerId: " provider ",
    organizationName: " Clinic ",
    providerName: " Doctor "
  }), {
    networkId: "org",
    providerId: "provider",
    organizationName: "Clinic",
    providerName: "Doctor"
  });
});

test("referralSourceFromRecord keeps explicit source before provider fallback", () => {
  assert.equal(referralSourceFromRecord({
    referralSource: " Sunrise Family Clinic ",
    providerLinks: [{
      providerName: "William Koenig, DO",
      organizationName: "Physicians' Medical Center"
    }]
  }), "Sunrise Family Clinic");

  assert.equal(referralSourceFromRecord({
    providerLinks: [{
      providerName: " William Koenig, DO ",
      organizationName: " Physicians' Medical Center "
    }]
  }), "William Koenig, DO");
});

test("clientPayloadFromReferral carries conversion and provider-source fields", () => {
  const payload = clientPayloadFromReferral({
    firstName: " Andi Jo ",
    lastName: " Smith ",
    parentName: "Michelle",
    phone: "(503) 560-2538",
    preferredLanguage: "English",
    referralType: "Internal Clinic Referral",
    referralDate: "2026-01-22",
    providerLinks: [{
      networkId: " clinic ",
      providerId: " william ",
      organizationName: " Physicians' Medical Center ",
      providerName: " William Koenig, DO "
    }],
    siblingIds: ["ref-sibling"],
    emailOptOut: true,
    textOptOut: false,
    ycco: "checked",
    hrsn: "yes",
    assessmentScore: 8,
    willingnessScore: 5,
    notes: "Ready for scheduling"
  }, "ref-1", {
    now: "2026-06-15T16:00:00.000Z",
    convertedSiblingClientIds: ["client-sibling", ""],
    createdBy: " director@snackprogram.org "
  });

  assert.equal(payload.status, "Scheduled");
  assert.equal(payload.sourceReferralId, "ref-1");
  assert.equal(payload.referralSource, "William Koenig, DO");
  assert.deepEqual(payload.siblingIds, ["client-sibling"]);
  assert.equal(payload.providerLinks[0].providerName, "William Koenig, DO");
  assert.equal(payload.providerLinks[0].organizationName, "Physicians' Medical Center");
  assert.equal(payload.ycco, true);
  assert.equal(payload.hrsn, true);
  assert.equal(payload.createdBy, "director@snackprogram.org");
  assert.equal(payload.convertedAt, "2026-06-15T16:00:00.000Z");
});

test("cleanReferralNetworkPayload filters empty providers", () => {
  const payload = cleanReferralNetworkPayload({
    name: " Physicians' Medical Center ",
    providers: [{ name: " William " }, { name: " " }]
  });

  assert.equal(payload.name, "Physicians' Medical Center");
  assert.equal(payload.providers.length, 1);
  assert.equal(payload.providers[0].name, "William");
});

test("cleanGrantPayload normalizes grant tracker details and document links", () => {
  const documentLink = cleanGrantDocumentLink({
    type: " Completed Application ",
    title: " 2025 Application ",
    url: " https://drive.example/app ",
    storagePath: " grant-documents/user/app.pdf ",
    fileName: " app.pdf ",
    mimeType: " application/pdf ",
    fileSize: "1234",
    uploadedAt: " 2026-06-16T12:00:00.000Z ",
    notes: " Final "
  });

  assert.equal(documentLink.type, "Completed Application");
  assert.equal(documentLink.title, "2025 Application");
  assert.equal(documentLink.url, "https://drive.example/app");
  assert.equal(documentLink.storagePath, "grant-documents/user/app.pdf");
  assert.equal(documentLink.fileName, "app.pdf");
  assert.equal(documentLink.mimeType, "application/pdf");
  assert.equal(documentLink.fileSize, 1234);
  assert.equal(documentLink.uploadedAt, "2026-06-16T12:00:00.000Z");

  const payload = cleanGrantPayload({
    foundationName: " Oregon Foundation ",
    grantName: " Community Health ",
    openDate: " 2026-05-01 ",
    deadlineDate: " 2026-06-15 ",
    deadlineTime: " 4:30 PM ",
    awardExpectedDate: " 2026-09-01 ",
    recurrence: " Annual ",
    contactName: " Primary Contact ",
    secondaryContactName: " Second Contact ",
    secondaryContactEmail: " second@example.org ",
    portalLoginEmail: " grants@example.org ",
    portalLoginPassword: " pass phrase ",
    amountRequested: "9000",
    amountMin: "5000",
    amountMax: " 15000 ",
    pastGrantReceived: "checked",
    pastGrantAmount: "7500",
    previousAwardDate: " 2024-08-05 ",
    documents: [documentLink, { title: " " }]
  });

  assert.equal(payload.foundationName, "Oregon Foundation");
  assert.equal(payload.openDate, "2026-05-01");
  assert.equal(payload.deadlineDate, "2026-06-15");
  assert.equal(payload.deadlineTime, "16:30");
  assert.equal(payload.awardExpectedDate, "2026-09-01");
  assert.equal(payload.recurrence, "Annual");
  assert.equal(payload.contactName, "Primary Contact");
  assert.equal(payload.secondaryContactName, "Second Contact");
  assert.equal(payload.secondaryContactEmail, "second@example.org");
  assert.equal(payload.portalLoginEmail, "grants@example.org");
  assert.equal(payload.portalLoginPassword, "pass phrase");
  assert.equal(payload.amountRequested, 9000);
  assert.equal(payload.amountMin, 5000);
  assert.equal(payload.amountMax, 15000);
  assert.equal(payload.pastGrantReceived, true);
  assert.equal(payload.pastGrantAmount, 7500);
  assert.equal(payload.previousAwardDate, "2024-08-05");
  assert.equal(payload.documents.length, 1);
  assert.equal(payload.documents[0].storagePath, "grant-documents/user/app.pdf");
});

test("grant question and organization info payloads preserve reusable grant content", () => {
  const question = cleanGrantQuestionPayload({
    category: " Mission ",
    prompt: " What do you do? ",
    answer: " We support kids. ",
    targetLimit: " 250 words "
  });

  assert.deepEqual(question, {
    category: "Mission",
    prompt: "What do you do?",
    answer: "We support kids.",
    targetLimit: "250 words",
    notes: ""
  });

  const organizationInfo = cleanGrantOrganizationInfoPayload({
    legalName: " SNACK ",
    dbaName: " The SNACK Program ",
    ein: " 00-0000000 ",
    mailingAddress: " 123 Main St ",
    yearFounded: "2025",
    websiteUrl: " https://snackprogram.org ",
    socialMediaLinks: " Instagram: https://instagram.com/thesnackprogram ",
    fundingStructure: " Reserve fund held at bank. ",
    guidingPrinciples: " Inclusive, practical, joyful. ",
    copyBlocks: [{ title: " Mission ", content: " Copy " }],
    documents: [
      { type: "DEI Statement", title: " DEI ", url: " https://drive.example/dei " },
      { type: "Balance Sheet", title: " Balance Sheet ", url: " https://drive.example/balance " }
    ]
  });

  assert.equal(organizationInfo.legalName, "SNACK");
  assert.equal(organizationInfo.dbaName, "The SNACK Program");
  assert.equal(organizationInfo.ein, "00-0000000");
  assert.equal(organizationInfo.mailingAddress, "123 Main St");
  assert.equal(organizationInfo.yearFounded, 2025);
  assert.equal(organizationInfo.websiteUrl, "https://snackprogram.org");
  assert.equal(organizationInfo.socialMediaLinks, "Instagram: https://instagram.com/thesnackprogram");
  assert.equal(organizationInfo.fundingStructure, "Reserve fund held at bank.");
  assert.equal(organizationInfo.guidingPrinciples, "Inclusive, practical, joyful.");
  assert.equal(organizationInfo.copyBlocks[0].title, "Mission");
  assert.equal(organizationInfo.documents[0].title, "DEI");
  assert.equal(organizationInfo.documents[1].type, "Balance Sheet");
});

test("cleanOutreachEventPayload defaults type and integer counts", () => {
  const payload = cleanOutreachEventPayload({
    name: " Cooking Class ",
    interactionsCount: "2.2"
  });

  assert.equal(payload.type, "Outreach Event");
  assert.equal(payload.status, "Scheduled");
  assert.equal(payload.name, "Cooking Class");
  assert.equal(payload.interactionsCount, 2);

  const contactPayload = cleanOutreachContactPayload({
    contactName: " Caregiver ",
    childName: " Child "
  });

  assert.equal(contactPayload.contactName, "Caregiver");
  assert.equal(contactPayload.status, "New");
});

test("appointment status normalization protects known values", () => {
  assert.equal(normalizeAppointmentStatus("Completed"), "Completed");
  assert.equal(normalizeAppointmentStatus("Bogus"), "Scheduled");
});

test("task normalization protects status, priority, and type", () => {
  assert.equal(normalizeTaskStatus("Waiting"), "Waiting");
  assert.equal(normalizeTaskStatus("Later"), "Open");
  assert.equal(normalizeTaskPriority("Urgent"), "Urgent");
  assert.equal(normalizeTaskPriority("Emergency"), "Normal");
  assert.equal(normalizeTaskType("call"), "Call");
  assert.equal(normalizeTaskType("forms"), "Form");
  assert.equal(normalizeTaskType("mystery"), "Task");
});

test("activity normalization defaults to call/outbound", () => {
  assert.equal(normalizeActivityType("Text"), "Text");
  assert.equal(normalizeActivityType("Email"), "Call");
  assert.equal(normalizeActivityDirection("Inbound"), "Inbound");
  assert.equal(normalizeActivityDirection("Sideways"), "Outbound");
});

test("appointment time normalization accepts 24-hour and standard time", () => {
  assert.equal(normalizeAppointmentTimeValue("3 pm"), "15:00");
  assert.equal(normalizeAppointmentTimeValue("12:15 AM"), "00:15");
  assert.equal(normalizeAppointmentTimeValue("7:05"), "07:05");
  assert.equal(appointmentTimeMinutes("2:30 PM"), 870);
  assert.equal(formatAppointmentTimeValue("14:30"), "2:30 PM");
  assert.equal(formatAppointmentTimeValue("not-time"), "not-time");
});

test("appointment client counts include clientIds before names", () => {
  assert.equal(appointmentClientCountFromRecord({ clientIds: ["a", "", "b"] }), 2);
  assert.equal(appointmentClientCountFromRecord({ clientNames: ["A", "B", ""] }), 2);
  assert.equal(appointmentClientCountFromRecord({ clientName: "Single" }), 1);
});

test("appointment duration honors explicit values and multi-client defaults", () => {
  assert.equal(appointmentDurationMinutesFromRecord({ durationMinutes: 15, clientIds: ["a", "b", "c"] }), 15);
  assert.equal(appointmentDurationMinutesFromRecord({ clientIds: ["a", "b", "c"] }), 45);
  assert.equal(appointmentDurationMinutesFromRecord({ clientIds: ["a"] }), 30);
});

test("appointment blocking only counts scheduled and completed visits", () => {
  assert.equal(appointmentBlocksSchedule({ status: "Scheduled" }), true);
  assert.equal(appointmentBlocksSchedule({ status: "Completed" }), true);
  assert.equal(appointmentBlocksSchedule({ status: "Canceled" }), false);
  assert.equal(appointmentBlocksSchedule({ status: "No-show" }), false);
});

test("appointment scheduling window allows appointments ending by 6 PM", () => {
  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "17:30", durationMinutes: 30 }), true);
  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "17:45", durationMinutes: 30 }), false);
  assert.equal(schedulingWindowEndLabel(), "6:00 PM");
});

test("schedulingWindowError names invalid time and duration issues", () => {
  assert.equal(schedulingWindowError({ appointmentTime: "bad", durationMinutes: 30 }), "Choose a valid appointment time.");
  assert.match(schedulingWindowError({ appointmentTime: "17:45", durationMinutes: 30 }), /30 min/);
});

test("appointmentRangesOverlap detects true overlaps and safe boundaries", () => {
  assert.equal(
    appointmentRangesOverlap({ appointmentTime: "13:00", durationMinutes: 30 }, { appointmentTime: "13:15", durationMinutes: 30 }),
    true
  );
  assert.equal(
    appointmentRangesOverlap({ appointmentTime: "13:00", durationMinutes: 30 }, { appointmentTime: "13:30", durationMinutes: 30 }),
    false
  );
});

test("cleanAppointmentPayload supports CSV-like client fields and public durations", () => {
  const payload = cleanAppointmentPayload({
    clientIds: "a, b",
    clientNames: "Andi Smith, Jessie Kellmer",
    appointmentDate: "2026-06-10",
    appointmentTime: "2:15 PM",
    durationMinutes: "15",
    publicBookingServiceId: "sibling-enrollment",
    publicBookingServiceLabel: "Sibling Enrollment Appointment"
  });

  assert.deepEqual(payload.clientIds, ["a", "b"]);
  assert.deepEqual(payload.clientNames, ["Andi Smith", "Jessie Kellmer"]);
  assert.equal(payload.appointmentTime, "14:15");
  assert.equal(payload.durationMinutes, 15);
  assert.equal(payload.publicBookingServiceId, "sibling-enrollment");
});

test("resolveAppointmentImportClients matches CSV client names to existing clients", async () => {
  const payload = cleanAppointmentPayload({
    clientName: "Andi Jo Smith",
    appointmentDate: "2026-06-10",
    appointmentTime: "2:15 PM"
  });
  const clientsByName = new Map([
    [normalizedLookupKey("Andi Jo Smith"), {
      id: "client-1",
      firstName: "Andi Jo",
      lastName: "Smith"
    }]
  ]);

  const error = await resolveAppointmentImportClients(payload, clientsByName);

  assert.equal(error, "");
  assert.deepEqual(payload.clientIds, ["client-1"]);
  assert.equal(payload.clientId, "client-1");
  assert.deepEqual(payload.clientNames, ["Andi Jo Smith"]);
});

test("cleanTaskPayload normalizes task defaults", () => {
  const payload = cleanTaskPayload({
    title: " Reschedule Andi ",
    type: "schedule",
    status: "Later",
    priority: "Huge"
  });

  assert.equal(payload.title, "Reschedule Andi");
  assert.equal(payload.type, "Call");
  assert.equal(payload.status, "Open");
  assert.equal(payload.priority, "Normal");
  assert.equal(payload.source, "Manual");
});

test("task helper functions classify generated active tasks", () => {
  assert.equal(isActiveTaskStatus("Waiting"), true);
  assert.equal(isActiveTaskStatus("Done"), false);
  assert.equal(isGeneratedTaskSource("Start the Day"), true);
  assert.equal(isGeneratedTaskSource("Manual"), false);
});

test("start-day task matching catches duplicate reschedule work", () => {
  const existingTask = {
    title: "Call Reschedule Andi Jo Smith",
    clientId: "client-1",
    appointmentId: "appt-1"
  };
  const payload = {
    title: "Reschedule Andi Jo Smith appointment",
    clientId: "client-1",
    appointmentId: "appt-1"
  };

  assert.equal(tasksMatchStartDayIntent(existingTask, payload), true);
});

test("start-day task subject removes action prefixes", () => {
  assert.equal(normalizedTaskTitle("  Prep   Lesson 1 Appointment "), "prep lesson 1 appointment");
  assert.equal(startDayTaskIntent("Update outcome for Andi Jo Smith"), "outcome");
  assert.equal(startDayTaskSubject("Call new referral Melody Martinez"), "melody martinez");
});

test("cleanActivityLogPayload builds titles and timestamps", () => {
  const payload = cleanActivityLogPayload({
    type: "Text",
    direction: "Inbound",
    relatedName: "Melody Martinez",
    relatedType: "referral",
    relatedId: "r1",
    activityDate: "2026-06-03",
    activityTime: "4:31 PM",
    result: "Scheduled",
    description: "Booked appt"
  });

  assert.equal(payload.title, "Inbound Text to Melody Martinez");
  assert.equal(payload.activityTime, "16:31");
  assert.equal(payload.occurredAt, new Date("2026-06-03T16:31:00").toISOString());
});

test("normalizedLookupKey trims and lowercases", () => {
  assert.equal(normalizedLookupKey(" William Koenig, DO "), "william koenig, do");
});

test("public booking service list mirrors the Setmore service choices", () => {
  assert.equal(publicBookingServices.length, 6);
  assert.equal(publicBookingServices.some((service) => service.id === "spanish-enrollment" && service.defaultLanguage === "Spanish"), true);
  assert.equal(publicBookingServices.some((service) => service.id === "sibling-enrollment" && service.durationMinutes === 15), true);
  assert.equal(publicBookingServiceFromId("nutrition-education").appointmentType, "Nutrition Education");
  assert.equal(publicBookingServiceFromId("unknown").id, "enrollment");
});

test("public appointment drafts are scheduled and private-safe", () => {
  const service = publicBookingServiceFromId("sibling-nutrition-education");
  const draft = publicAppointmentDraft({
    service,
    appointmentDate: nextUtcWeekday(2),
    appointmentTime: "13:00",
    clientName: "Public Client"
  });

  assert.equal(draft.status, "Scheduled");
  assert.equal(draft.durationMinutes, 15);
  assert.deepEqual(draft.clientNames, ["Public Client"]);
  assert.equal(isPublicBookableDate(nextUtcWeekday(2)), true);
  assert.equal(isPublicBookableDate(nextUtcWeekday(0)), false);
});

test("public slots respect service duration and appointment conflicts", () => {
  const date = nextUtcWeekday(3);
  const service = publicBookingServiceFromId("enrollment");
  const slots = publicSlotValuesForDate(date, service, [
    { appointmentDate: date, appointmentTime: "13:00", durationMinutes: 30, status: "Scheduled" }
  ]);
  const values = slots.map((slot) => slot.value);

  assert.equal(values.includes("13:00"), false);
  assert.equal(values.includes("13:15"), false);
  assert.equal(values.includes("13:30"), true);
  assert.equal(values.at(-1), "17:30");

  const nonblockingSlots = publicSlotValuesForDate(nextUtcWeekday(4), service, [
    { appointmentDate: date, appointmentTime: "13:00", durationMinutes: 30, status: "Canceled" }
  ]);

  assert.equal(nonblockingSlots[0].value, "13:00");
});

test("cleanPublicBookingPayload accepts child aliases and service language defaults", () => {
  const payload = cleanPublicBookingPayload({
    serviceId: "spanish-enrollment",
    childFirstName: " Ana ",
    childLastName: " Bello ",
    caregiverName: " Arianna ",
    phone: " 503 ",
    appointmentDate: nextUtcWeekday(2),
    appointmentTime: "1 PM"
  });

  assert.equal(payload.firstName, "Ana");
  assert.equal(payload.parentName, "Arianna");
  assert.equal(payload.preferredLanguage, "Spanish");
  assert.equal(payload.appointmentTime, "13:00");
});

test("public booking validation rejects spam traps and malformed public input", () => {
  const validPayload = cleanPublicBookingPayload({
    serviceId: "enrollment",
    firstName: "Andi Jo",
    lastName: "Smith",
    parentName: "Michelle",
    phone: "(503) 560-2538",
    email: "family@example.com",
    preferredLanguage: "English",
    appointmentDate: nextUtcWeekday(2),
    appointmentTime: "1 PM"
  });

  assert.equal(publicBookingValidationError(validPayload), "");
  assert.match(publicBookingValidationError({ ...validPayload, website: "bot.example" }), /Could not submit/);
  assert.match(publicBookingValidationError({ ...validPayload, spamTrap: "bot.example" }), /Could not submit/);
  assert.match(publicBookingValidationError({ ...validPayload, email: "not-an-email" }), /valid email/);
  assert.match(publicBookingValidationError({ ...validPayload, notes: "x".repeat(601) }), /shorten/);
});

test("serializers produce stable API shapes", () => {
  const referral = toReferral(snapshot("r1", { firstName: "Ana", ycco: "yes", siblingIds: ["r2"] }));
  const client = toClient(snapshot("c1", { firstName: "Ana", hrsn: "checked", providerLinks: [{ providerName: "William" }] }));
  const appointment = toAppointment(snapshot("a1", { clientIds: ["c1"], appointmentTime: "13:00", durationMinutes: 15 }));
  const task = toTask(snapshot("t1", { title: "Call", type: "forms", status: "Open" }));
  const activity = toActivityLog(snapshot("l1", { type: "Call", direction: "Outbound" }));
  const grant = toGrant(snapshot("g1", { foundationName: "Foundation", pastGrantReceived: true, documents: [{ title: "Application" }] }));
  const question = toGrantQuestion(snapshot("q1", { prompt: "Question", answer: "Answer" }));
  const organizationInfo = toGrantOrganizationInfo(snapshot("grantOrganizationInfo", {
    legalName: "SNACK",
    documents: [{ title: "Board Roster" }]
  }));

  assert.equal(referral.id, "r1");
  assert.equal(referral.ycco, true);
  assert.equal(client.hrsn, true);
  assert.equal(client.providerLinks[0].providerName, "William");
  assert.equal(appointment.durationMinutes, 15);
  assert.equal(task.type, "Form");
  assert.equal(activity.direction, "Outbound");
  assert.equal(grant.pastGrantReceived, true);
  assert.equal(grant.documents[0].title, "Application");
  assert.equal(question.prompt, "Question");
  assert.equal(organizationInfo.legalName, "SNACK");
});

test("date helpers validate date-only values", () => {
  assert.equal(daysBetweenDateStrings("2026-06-10", "2026-06-17"), 7);
  assert.equal(daysBetweenDateStrings("bad", "2026-06-17"), null);
});

test("public and protected API routes are registered with expected middleware", () => {
  const routes = app._router.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path);

  assert.ok(routes.indexOf("/api/public/booking-options") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/availability") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/bookings") < routes.indexOf("/api/message"));
  assert.ok(routes.includes("/api/grants"));
  assert.ok(routes.includes("/api/grants/:grantId"));
  assert.ok(routes.includes("/api/grant-questions"));
  assert.ok(routes.includes("/api/grant-questions/:questionId"));
  assert.ok(routes.includes("/api/grant-organization-info"));
  const healthRoute = app._router.stack.find((layer) => layer.route?.path === "/health").route;
  const bookingOptionsRoute = app._router.stack.find((layer) => layer.route?.path === "/api/public/booking-options").route;
  const messageRoute = app._router.stack.find((layer) => layer.route?.path === "/api/message").route;

  assert.equal(healthRoute.stack.length, 1);
  assert.equal(bookingOptionsRoute.stack.length, 1);
  assert.equal(bookingOptionsRoute.methods.get, true);
  assert.equal(messageRoute.methods.get, true);
  assert.equal(messageRoute.stack.length, 2);
});
