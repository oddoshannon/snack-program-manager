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
  cleanAppointmentPrepChecklist,
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
  cleanSchedulingSettingsPayload,
  cleanSiblingZohoRecordIds,
  cleanString,
  cleanTaskPayload,
  clientPayloadFromReferral,
  daysBetweenDateStrings,
  fetchAllDocuments,
  formatAppointmentTimeValue,
  hasRequiredPersonFields,
  isActiveTaskStatus,
  isAdminBulkDeleteEnabled,
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
  publicManageClientIdsFromAppointment,
  publicManageTokenHash,
  publicManageTokensMatch,
  publicSlotValuesForDate,
  referralSourceFromRecord,
  resolveAppointmentImportClients,
  serializePublicManagedBooking,
  schedulingWindowEndLabel,
  schedulingWindowError,
  siblingIdsForImportedRecord,
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

test("appointment prep checklist keeps only supported checkbox values", () => {
  assert.deepEqual(cleanAppointmentPrepChecklist({
    sticker: true,
    penPencil: "checked",
    questionnaire: false,
    unknownItem: true
  }), {
    sticker: true,
    penPencil: true,
    questionnaire: false
  });
});

test("admin bulk delete is disabled unless explicitly enabled", () => {
  const previous = process.env.ALLOW_ADMIN_BULK_DELETE;

  try {
    delete process.env.ALLOW_ADMIN_BULK_DELETE;
    assert.equal(isAdminBulkDeleteEnabled(), false);
    process.env.ALLOW_ADMIN_BULK_DELETE = "false";
    assert.equal(isAdminBulkDeleteEnabled(), false);
    process.env.ALLOW_ADMIN_BULK_DELETE = "true";
    assert.equal(isAdminBulkDeleteEnabled(), true);
  } finally {
    if (previous === undefined) {
      delete process.env.ALLOW_ADMIN_BULK_DELETE;
    } else {
      process.env.ALLOW_ADMIN_BULK_DELETE = previous;
    }
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

test("sibling import helpers link rows by explicit Zoho sibling ids", () => {
  const currentRecord = {
    docRef: { id: "current-id" },
    zohoRecordId: "zcrm-current",
    row: {
      siblingZohoRecordIds: [" zcrm-sibling ", "", "missing-sibling"]
    }
  };
  const reciprocalRecord = {
    docRef: { id: "reciprocal-id" },
    zohoRecordId: "zcrm-reciprocal",
    row: {
      siblingZohoRecordIds: ["zcrm-current"]
    }
  };
  const recordsByZohoId = new Map([
    ["zcrm-current", currentRecord],
    ["zcrm-reciprocal", reciprocalRecord],
    ["zcrm-sibling", { docRef: { id: "new-sibling-id" } }]
  ]);

  assert.deepEqual(cleanSiblingZohoRecordIds(currentRecord.row), ["zcrm-sibling", "missing-sibling"]);
  assert.deepEqual(siblingIdsForImportedRecord(currentRecord, recordsByZohoId, [currentRecord, reciprocalRecord]), ["new-sibling-id", "reciprocal-id"]);
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
  assert.equal(normalizeAppointmentStatus("Blocked"), "Blocked");
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

test("appointment blocking includes scheduled, completed, and blocked records", () => {
  assert.equal(appointmentBlocksSchedule({ status: "Scheduled" }), true);
  assert.equal(appointmentBlocksSchedule({ status: "Completed" }), true);
  assert.equal(appointmentBlocksSchedule({ status: "Blocked" }), true);
  assert.equal(appointmentBlocksSchedule({ status: "Canceled" }), false);
  assert.equal(appointmentBlocksSchedule({ status: "No-show" }), false);
});

test("appointment scheduling window allows appointments ending by 6 PM", () => {
  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "13:00", durationMinutes: 30 }), false);
  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "13:30", durationMinutes: 30 }), true);
  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "17:30", durationMinutes: 30 }), true);
  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "17:45", durationMinutes: 30 }), false);
  assert.equal(schedulingWindowEndLabel(), "6:00 PM");
});

test("appointment scheduling window accepts custom settings", () => {
  const settings = {
    ...cleanSchedulingSettingsPayload({
      weekdays: [1, 3],
      officeStartTime: "12:00",
      officeEndTime: "17:00",
      bookableStartTime: "12:30",
      bookableEndTime: "17:00",
      defaultDurationMinutes: 30,
      slotIntervalMinutes: 15
    }),
    bookableStartMinutes: 12 * 60 + 30,
    bookableEndMinutes: 17 * 60
  };

  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "12:00", durationMinutes: 30 }, settings), false);
  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "12:30", durationMinutes: 30 }, settings), true);
  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "16:30", durationMinutes: 30 }, settings), true);
  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "16:45", durationMinutes: 30 }, settings), false);
  assert.equal(schedulingWindowEndLabel(settings), "5:00 PM");
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
    durationMinutes: "30",
    publicBookingServiceId: "nutrition-education",
    publicBookingServiceLabel: "Nutrition Education Appointment",
    caregiverMood: " Good ",
    confidence: " High ",
    participation: " Engaged ",
    barriers: " None "
  });

  assert.deepEqual(payload.clientIds, ["a", "b"]);
  assert.deepEqual(payload.clientNames, ["Andi Smith", "Jessie Kellmer"]);
  assert.equal(payload.appointmentTime, "14:15");
  assert.equal(payload.durationMinutes, 30);
  assert.equal(payload.publicBookingServiceId, "nutrition-education");
  assert.equal(payload.caregiverMood, "Good");
  assert.equal(payload.confidence, "High");
  assert.equal(payload.participation, "Engaged");
  assert.equal(payload.barriers, "None");
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

test("resolveAppointmentImportClients can preserve unmatched appointment names on import", async () => {
  const payload = cleanAppointmentPayload({
    clientNames: "Rafael De Jesús Hernández García, Aaliyah Martinez Nambo",
    appointmentDate: "2026-06-30",
    appointmentTime: "2:30 PM"
  });
  const clientsByName = new Map([
    [normalizedLookupKey("Rafael de Jesus Hernandez Garcia"), {
      id: "client-1",
      firstName: "Rafael de Jesús",
      lastName: "Hernández García"
    }]
  ]);

  const error = await resolveAppointmentImportClients(payload, clientsByName, { allowNameOnly: true });

  assert.equal(error, "");
  assert.deepEqual(payload.clientIds, ["client-1"]);
  assert.deepEqual(payload.clientNames, ["Rafael De Jesús Hernández García", "Aaliyah Martinez Nambo"]);
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
  assert.equal(publicBookingServices.length, 4);
  assert.deepEqual(publicBookingServices.map((service) => service.label), [
    "Enrollment Appointment",
    "Nutrition Education Appointment",
    "Cita de inscripción en español",
    "Cita de educación nutricional en español"
  ]);
  assert.equal(publicBookingServices.every((service) => service.durationMinutes === 30), true);
  assert.equal(publicBookingServices.some((service) => service.id === "spanish-enrollment" && service.defaultLanguage === "Spanish"), true);
  assert.equal(publicBookingServiceFromId("nutrition-education").appointmentType, "Nutrition Education");
  assert.equal(publicBookingServiceFromId("unknown").id, "enrollment");
});

test("public appointment drafts are scheduled and private-safe", () => {
  const service = publicBookingServiceFromId("spanish-nutrition-education");
  const draft = publicAppointmentDraft({
    service,
    appointmentDate: nextUtcWeekday(2),
    appointmentTime: "13:00",
    clientName: "Public Client"
  });

  assert.equal(draft.status, "Scheduled");
  assert.equal(draft.durationMinutes, 30);
  assert.equal(draft.appointmentType, "Nutrition Education");
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

  assert.equal(nonblockingSlots[0].value, "13:30");
});

test("public slots follow configurable appointment days and hours", () => {
  const date = nextUtcWeekday(3);
  const service = publicBookingServiceFromId("enrollment");
  const customSettings = {
    weekdays: [3],
    bookableStartTime: "14:00",
    bookableEndTime: "15:00",
    bookableStartMinutes: 14 * 60,
    bookableEndMinutes: 15 * 60,
    slotIntervalMinutes: 15
  };

  assert.deepEqual(publicSlotValuesForDate(date, service, [], customSettings).map((slot) => slot.value), [
    "14:00",
    "14:15",
    "14:30"
  ]);
  assert.deepEqual(publicSlotValuesForDate(nextUtcWeekday(4), service, [], customSettings), []);
});

test("public management tokens and serialized bookings are private-safe", () => {
  const token = "family-private-token";
  const hash = publicManageTokenHash(token);
  const booking = serializePublicManagedBooking({
    id: "appt-1",
    clientNames: ["Rafael Hernandez", "Janney Hernandez"],
    publicBookingServiceId: "spanish-nutrition-education",
    publicBookingServiceLabel: "Cita de educación nutricional en español",
    appointmentDate: nextUtcWeekday(2),
    appointmentTime: "14:30",
    durationMinutes: 30,
    status: "Scheduled"
  });

  assert.equal(publicManageTokensMatch(token, hash), true);
  assert.equal(publicManageTokensMatch("wrong-token", hash), false);
  assert.equal(publicManageTokensMatch("", hash), false);
  assert.equal(publicManageTokensMatch(token, "not-a-valid-hash"), false);
  assert.equal(booking.serviceId, "spanish-nutrition-education");
  assert.equal(booking.serviceLabel, "Cita de educación nutricional en español");
  assert.equal(booking.appointmentTimeLabel, "2:30 PM");
  assert.equal(booking.clientName, "Rafael Hernandez, Janney Hernandez");
  assert.equal(Object.hasOwn(booking, "publicManageTokenHash"), false);
});

test("public management client IDs include fallback client and avoid duplicates", () => {
  assert.deepEqual(publicManageClientIdsFromAppointment({
    clientIds: ["client-a", " client-b ", "client-a", ""],
    clientId: "client-c"
  }), ["client-a", "client-b", "client-c"]);

  assert.deepEqual(publicManageClientIdsFromAppointment({
    clientIds: [],
    clientId: "client-only"
  }), ["client-only"]);
});

test("cleanPublicBookingPayload accepts child aliases and service language defaults", () => {
  const payload = cleanPublicBookingPayload({
    serviceId: "spanish-enrollment",
    children: [{
      childName: " Ana Bello ",
      dateOfBirth: "2015-01-02",
      gender: "Female"
    }],
    caregiverName: " Arianna ",
    mobilePhone: " 503 ",
    email: " family@example.com ",
    address: " 2435 NE Cumulus Ave ",
    preferredContactMethod: "Phone Call",
    consentReminders: "on",
    appointmentDate: nextUtcWeekday(2),
    appointmentTime: "1 PM"
  });

  assert.equal(payload.firstName, "Ana");
  assert.equal(payload.lastName, "Bello");
  assert.equal(payload.children[0].dateOfBirth, "2015-01-02");
  assert.equal(payload.parentName, "Arianna");
  assert.equal(payload.preferredLanguage, "Spanish");
  assert.equal(payload.phone, "503");
  assert.equal(payload.appointmentTime, "13:00");
});

test("public booking validation rejects spam traps and malformed public input", () => {
  const validPayload = cleanPublicBookingPayload({
    serviceId: "enrollment",
    children: [{
      childName: "Andi Jo Smith",
      dateOfBirth: "2014-03-04",
      gender: "Female"
    }],
    parentName: "Michelle",
    phone: "(503) 560-2538",
    email: "family@example.com",
    address: "2435 NE Cumulus Ave",
    preferredLanguage: "English",
    preferredContactMethod: "Text",
    consentReminders: true,
    appointmentDate: nextUtcWeekday(2),
    appointmentTime: "1 PM"
  });

  assert.equal(publicBookingValidationError(validPayload), "");
  assert.match(publicBookingValidationError({ ...validPayload, website: "bot.example" }), /Could not submit/);
  assert.match(publicBookingValidationError({ ...validPayload, spamTrap: "bot.example" }), /Could not submit/);
  assert.match(publicBookingValidationError({ ...validPayload, email: "not-an-email" }), /valid email/);
  assert.match(publicBookingValidationError({ ...validPayload, email: "" }), /required/);
  assert.match(publicBookingValidationError({ ...validPayload, consentReminders: false }), /required/);
  assert.match(publicBookingValidationError({ ...validPayload, notes: "x".repeat(601) }), /shorten/);
});

test("serializers produce stable API shapes", () => {
  const referral = toReferral(snapshot("r1", { firstName: "Ana", ycco: "yes", siblingIds: ["r2"] }));
  const client = toClient(snapshot("c1", { firstName: "Ana", hrsn: "checked", providerLinks: [{ providerName: "William" }] }));
  const appointment = toAppointment(snapshot("a1", {
    clientIds: ["c1"],
    appointmentTime: "13:00",
    durationMinutes: 15,
    prepChecklist: { sticker: true, unknownItem: true }
  }));
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
  assert.deepEqual(appointment.prepChecklist, { sticker: true });
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

function collectRoutes(stack, routes = []) {
  for (const layer of stack) {
    if (layer.route) {
      routes.push(layer.route);
    } else if (layer.name === "router" && layer.handle?.stack) {
      collectRoutes(layer.handle.stack, routes);
    }
  }

  return routes;
}

test("public and protected API routes are registered with expected middleware", () => {
  const registeredRoutes = collectRoutes(app._router.stack);
  const routes = registeredRoutes.map((route) => route.path);

  assert.ok(routes.indexOf("/api/public/booking-options") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/availability") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/bookings") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/bookings/:appointmentId") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/bookings/:appointmentId/cancel") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/bookings/:appointmentId/reschedule") < routes.indexOf("/api/message"));
  assert.ok(routes.includes("/api/grants"));
  assert.ok(routes.includes("/api/grants/:grantId"));
  assert.ok(routes.includes("/api/grant-questions"));
  assert.ok(routes.includes("/api/grant-questions/:questionId"));
  assert.ok(routes.includes("/api/grant-organization-info"));
  assert.ok(routes.includes("/api/admin/scheduling-settings"));
  const healthRoute = registeredRoutes.find((route) => route.path === "/health");
  const bookingOptionsRoute = registeredRoutes.find((route) => route.path === "/api/public/booking-options");
  const messageRoute = registeredRoutes.find((route) => route.path === "/api/message");

  assert.equal(healthRoute.stack.length, 1);
  assert.equal(bookingOptionsRoute.stack.length, 1);
  assert.equal(bookingOptionsRoute.methods.get, true);
  assert.equal(messageRoute.methods.get, true);
  assert.equal(messageRoute.stack.length, 2);
});

test("fetchAllDocuments pages past the batch size instead of truncating", async () => {
  function fakeQuery(docs, offset = 0) {
    return {
      limit(batchSize) {
        return {
          get: async () => ({ docs: docs.slice(offset, offset + batchSize) })
        };
      },
      startAfter(cursor) {
        return fakeQuery(docs, docs.indexOf(cursor) + 1);
      }
    };
  }

  const smallSet = Array.from({ length: 12 }, (_, index) => ({ id: `doc-${index}` }));
  assert.deepEqual(await fetchAllDocuments(fakeQuery(smallSet)), smallSet);

  const largeSet = Array.from({ length: 650 }, (_, index) => ({ id: `doc-${index}` }));
  const fetched = await fetchAllDocuments(fakeQuery(largeSet));
  assert.equal(fetched.length, 650);
  assert.equal(fetched[0].id, "doc-0");
  assert.equal(fetched[649].id, "doc-649");

  const exactMultiple = Array.from({ length: 600 }, (_, index) => ({ id: `doc-${index}` }));
  assert.equal((await fetchAllDocuments(fakeQuery(exactMultiple))).length, 600);
});
