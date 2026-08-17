import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  app,
  appointmentBlocksSchedule,
  appointmentClientCountFromRecord,
  appointmentDurationMinutesFromRecord,
  appointmentFitsSchedulingWindow,
  appointmentLessonValidationError,
  appointmentRangesOverlap,
  appointmentTimeMinutes,
  cleanActivityLogPayload,
  cleanAppointmentParticipantGoals,
  cleanAppointmentPrepChecklist,
  cleanAppointmentPayload,
  cleanBoolean,
  cleanGrantDocumentLink,
  cleanGrantOrganizationInfoPayload,
  cleanGrantPayload,
  cleanGrantQuestionPayload,
  cleanFundraisingCampaignPayload,
  cleanFundraisingDonorPayload,
  cleanFundraisingGiftPayload,
  cleanMarketingCampaignPayload,
  cleanEarnedIncomePayload,
  cleanNetworkProvider,
  cleanOptionalInteger,
  cleanOptionalNumber,
  cleanOutreachContactPayload,
  cleanOutreachEventPayload,
  cleanPersonPayload,
  cleanProviderLink,
  cleanPublicBookingPayload,
  cleanPublicClassRegistrationPayload,
  cleanReferralNetworkPayload,
  cleanSchedulingSettingsPayload,
  cleanSiblingZohoRecordIds,
  cleanString,
  cleanTaskPayload,
  clientPayloadFromReferral,
  daysBetweenDateStrings,
  defaultSchedulingSettingsNormalized,
  defaultStaffAccessLevels,
  fetchAllDocuments,
  formatAppointmentTimeValue,
  googleCalendarEventForAppointment,
  googleCalendarScopes,
  hasRequiredPersonFields,
  isActiveTaskStatus,
  isAdminBulkDeleteEnabled,
  isGeneratedTaskSource,
  isPublicBookableDate,
  isPublicAppointmentAtLeastHoursAhead,
  normalizeActivityDirection,
  normalizeActivityType,
  normalizeAppointmentStatus,
  normalizeAppointmentTimeValue,
  normalizeAddressState,
  normalizeClientStatusDefinitions,
  normalizeMailingAddress,
  normalizeStaffAccessLevels,
  normalizeStaffRole,
  normalizeStatus,
  normalizeTaskPriority,
  normalizeTaskStatus,
  normalizeTaskType,
  normalizedLookupKey,
  normalizedTaskTitle,
  publicAppointmentDraft,
  buildPublicBookingConfirmation,
  previewPublicBookingConfirmationDelivery,
  publicBookingConfirmationDeliverySummary,
  publicBookingConfirmationMode,
  publicBookingServiceFromId,
  publicBookingServices,
  publicBookingValidationError,
  publicAppointmentCanReview,
  publicClassRegistrationValidationError,
  publicKitchenSessionAvailability,
  publicManageClientIdsFromAppointment,
  publicBookingManageUrl,
  publicManageTokenHash,
  publicManageTokensMatch,
  publicSlotValuesForDate,
  referralSourceFromRecord,
  resolveAppointmentImportClients,
  serializePublicManagedBooking,
  schedulingWindowEndLabel,
  schedulingWindowError,
  staffAccountIsActive,
  staffFinanceSectionForApiPath,
  staffFinanceSectionsForRole,
  staffAccessLevelForRole,
  staffModuleForApiPath,
  staffModulesCanAccessApiPath,
  staffModulesForRole,
  staffRoleCanAccessApiPath,
  staffRoleCanAccessModule,
  syncClinicAppointmentCalendar,
  verifyGoogleCalendarLifecycle,
  siblingIdsForImportedRecord,
  startDayTaskIntent,
  startDayTaskSubject,
  tasksMatchStartDayIntent,
  toActivityLog,
  toAppointment,
  toClient,
  toScheduleClient,
  toGrant,
  toGrantOrganizationInfo,
  toGrantQuestion,
  toFundraisingCampaign,
  toFundraisingDonor,
  toFundraisingGift,
  toMarketingCampaign,
  toEarnedIncome,
  toReferral,
  toStaffUser,
  toTask
} from "../server.js";
import { staleAppointmentWorkflowTask } from "../routes/tasks.js";

const dockerfile = await readFile(new URL("../Dockerfile", import.meta.url), "utf8");

test("Cloud Run container includes the reorganized backend files", () => {
  assert.match(dockerfile, /^COPY server\.js \.\/$/m);
  assert.match(dockerfile, /^COPY lib \.\/lib$/m);
  assert.match(dockerfile, /^COPY routes \.\/routes$/m);
});

test("the server does not advertise its internal web framework", () => {
  assert.equal(app.get("x-powered-by"), false);
});

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

test("mailing addresses use consistent street, direction, city, and state formatting", () => {
  assert.equal(
    normalizeMailingAddress("2435 ne cumulus avenue, suite a, mcminnville, oregon 97128"),
    "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128"
  );
  assert.equal(
    normalizeMailingAddress("the SNACK program office"),
    "The SNACK Program Office"
  );
  assert.equal(normalizeAddressState("Oregon"), "OR");
  assert.equal(normalizeAddressState("or"), "OR");
  assert.equal(normalizeAddressState("wa"), "WA");
});

test("cleanBoolean accepts checked-style true values", () => {
  for (const value of [true, "true", "yes", "Y", "1", "checked", "on"]) {
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

test("staff access levels expose their configured modules", () => {
  assert.deepEqual(staffModulesForRole("Admin"), ["schedule", "crm", "outreach", "fundraising", "marketing", "operations", "admin"]);
  assert.deepEqual(staffModulesForRole("Manager"), ["schedule", "crm", "outreach", "fundraising"]);
  assert.deepEqual(staffFinanceSectionsForRole("Manager"), ["Grants", "Giving"]);
  assert.deepEqual(staffModulesForRole("Staff"), ["schedule", "crm", "outreach"]);
  assert.deepEqual(staffModulesForRole("Intern"), ["schedule", "outreach"]);
  assert.equal(staffRoleCanAccessModule("Intern", "schedule"), true);
  assert.equal(staffRoleCanAccessModule("Intern", "crm"), false);
  assert.equal(normalizeStaffRole("Admin", "intern@snackprogram.org"), "Admin");
  assert.equal(normalizeStaffRole("Admin", "director@snackprogram.org"), "Admin");
  assert.equal(staffAccountIsActive({ isAdmin: true, configured: false }), true);
  assert.equal(staffAccountIsActive({ configured: true, active: true }), true);
  assert.equal(staffAccountIsActive({ configured: true, active: false }), false);
  assert.equal(staffAccountIsActive({ configured: false, active: true }), false);

  const accessLevels = normalizeStaffAccessLevels([
    ...defaultStaffAccessLevels,
    {
      id: "custom-coordinator",
      name: "Program Coordinator",
      modules: ["schedule", "crm", "operations"]
    }
  ]);
  assert.equal(staffAccessLevelForRole("custom-coordinator", accessLevels).name, "Program Coordinator");
  assert.deepEqual(
    staffModulesForRole("custom-coordinator", accessLevels),
    ["schedule", "crm", "operations"]
  );
  assert.equal(
    staffRoleCanAccessApiPath("custom-coordinator", "/api/operations", accessLevels),
    true
  );
  assert.equal(
    staffRoleCanAccessApiPath("custom-coordinator", "/api/outreach-events", accessLevels),
    false
  );
  assert.equal(
    staffModulesCanAccessApiPath(["schedule", "outreach"], "/api/clients"),
    false
  );
});

test("staff profiles preserve directory fields separately from access", () => {
  const user = toStaffUser(snapshot("staff@snackprogram.org", {
    email: " staff@snackprogram.org ",
    displayName: " Cynthia Esparza ",
    title: " Nutrition Coordinator ",
    phone: " (971) 202-0232 ",
    programs: ["Clinic", "Kitchen"],
    role: "Staff",
    active: true
  }));

  assert.equal(user.displayName, "Cynthia Esparza");
  assert.equal(user.title, "Nutrition Coordinator");
  assert.equal(user.phone, "(971) 202-0232");
  assert.deepEqual(user.programs, ["Clinic", "Kitchen"]);
  assert.deepEqual(user.modules, ["schedule", "crm", "outreach"]);
});

test("protected API areas follow the staff module boundary", () => {
  assert.equal(staffModuleForApiPath("/api/schedule/clients"), "schedule");
  assert.equal(staffModuleForApiPath("/api/schedule/activity-logs"), "schedule");
  assert.equal(staffModuleForApiPath("/api/clients"), "crm");
  assert.equal(staffModuleForApiPath("/api/tasks"), "crm");
  assert.equal(staffModuleForApiPath("/api/activity-logs"), "crm");
  assert.equal(staffModuleForApiPath("/api/outreach-tasks"), "outreach");
  assert.equal(staffModuleForApiPath("/api/financial-activity"), "fundraising");
  assert.equal(staffModuleForApiPath("/api/donors"), "fundraising");
  assert.equal(staffModuleForApiPath("/api/gifts/gift-1"), "fundraising");
  assert.equal(staffModuleForApiPath("/api/campaigns"), "fundraising");
  assert.equal(staffModuleForApiPath("/api/earned-income"), "fundraising");
  assert.equal(staffFinanceSectionForApiPath("/api/grants/grant-1"), "Grants");
  assert.equal(staffFinanceSectionForApiPath("/api/gifts/gift-1"), "Giving");
  assert.equal(staffFinanceSectionForApiPath("/api/financial-activity"), "Financial Activity");
  assert.equal(staffModuleForApiPath("/api/operations"), "operations");
  assert.equal(staffModuleForApiPath("/api/operations/evaluation-instruments/draft"), "operations");
  assert.equal(staffModuleForApiPath("/api/evaluation-instruments"), "crm");
  assert.equal(staffModuleForApiPath("/api/evaluation-responses?clientId=client-1"), "crm");
  assert.equal(staffRoleCanAccessApiPath("Intern", "/api/schedule/clients"), true);
  assert.equal(staffRoleCanAccessApiPath("Intern", "/api/schedule/activity-logs"), true);
  assert.equal(staffRoleCanAccessApiPath("Intern", "/api/outreach-tasks"), true);
  assert.equal(staffRoleCanAccessApiPath("Intern", "/api/clients"), false);
  assert.equal(staffRoleCanAccessApiPath("Intern", "/api/tasks"), false);
  assert.equal(staffRoleCanAccessApiPath("Intern", "/api/donors"), false);
  assert.equal(staffRoleCanAccessApiPath("Staff", "/api/referrals"), true);
  assert.equal(staffRoleCanAccessApiPath("Staff", "/api/evaluation-responses"), true);
  assert.equal(staffRoleCanAccessApiPath("Intern", "/api/evaluation-responses"), false);
  assert.equal(staffRoleCanAccessApiPath("Staff", "/api/grants"), false);
  assert.equal(staffRoleCanAccessApiPath("Manager", "/api/grants"), true);
  assert.equal(staffRoleCanAccessApiPath("Manager", "/api/donors"), true);
  assert.equal(staffRoleCanAccessApiPath("Manager", "/api/financial-activity"), false);
  assert.equal(staffRoleCanAccessApiPath("Manager", "/api/hrsn-claims"), false);
  assert.equal(staffRoleCanAccessApiPath("Manager", "/api/budget-categories"), false);
  assert.equal(staffRoleCanAccessApiPath("Admin", "/api/admin/staff-users"), true);
});

test("client statuses are editable while Scheduled remains available", () => {
  assert.deepEqual(normalizeClientStatusDefinitions([
    { name: "Age Limit", color: "#D27354" },
    { name: "Custom Review", color: "not-a-color" },
    { name: "custom review", color: "#ffffff" }
  ]), [
    { name: "Scheduled", color: "#078b4d" },
    { name: "Age Limit", color: "#d27354" },
    { name: "Custom Review", color: "#475467" }
  ]);
});

test("schedule client records contain only calendar-safe profile fields", () => {
  const client = toScheduleClient(snapshot("client-1", {
    firstName: "Ari",
    lastName: "Rivera",
    parentName: "Morgan Rivera",
    phone: "503-555-0100",
    email: "private@example.com",
    addressStreet: "123 Main St",
    preferredLanguage: "English",
    status: "Active"
  }));
  assert.equal(client.firstName, "Ari");
  assert.equal(client.phone, "503-555-0100");
  assert.equal(client.email, undefined);
  assert.equal(client.addressStreet, undefined);
});

test("cleanOptionalNumber returns numbers or null", () => {
  assert.equal(cleanOptionalNumber(" 8 "), 8);
  assert.equal(cleanOptionalNumber(""), null);
  assert.equal(cleanOptionalNumber("not a number"), null);
  assert.equal(cleanOptionalInteger("4.6"), 5);
  assert.equal(cleanOptionalInteger("-2"), 0);
});

test("marketing campaign payloads trim text and preserve reporting numbers", () => {
  const payload = cleanMarketingCampaignPayload({
    name: "  Back to School Newsletter  ",
    status: " Scheduled ",
    campaignType: " Newsletter ",
    channel: " Email ",
    audienceCount: "78",
    sentCount: "75",
    openCount: "42",
    spend: "10.555"
  });

  assert.equal(payload.name, "Back to School Newsletter");
  assert.equal(payload.status, "Scheduled");
  assert.equal(payload.campaignType, "Newsletter");
  assert.equal(payload.channel, "Email");
  assert.equal(payload.audienceCount, 78);
  assert.equal(payload.sentCount, 75);
  assert.equal(payload.openCount, 42);
  assert.equal(payload.spend, 10.555);
});

test("marketing campaign serializer keeps delivery and analytics fields", () => {
  const campaign = toMarketingCampaign(snapshot("marketing-1", {
    name: "Summer Newsletter",
    status: "Sent",
    channel: "Newsletter",
    sendDate: "2026-07-20",
    sentCount: 78,
    openCount: 52,
    externalCampaignId: "ml-123"
  }));

  assert.equal(campaign.id, "marketing-1");
  assert.equal(campaign.name, "Summer Newsletter");
  assert.equal(campaign.sendDate, "2026-07-20");
  assert.equal(campaign.sentCount, 78);
  assert.equal(campaign.openCount, 52);
  assert.equal(campaign.externalCampaignId, "ml-123");
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
    graduationDate: " 2026-07-15 ",
    emailOptOut: "checked",
    textOptOut: "",
    ycco: "yes",
    yccoId: " 123ABC456 ",
    hrsn: "1",
    assessmentScore: "8",
    willingnessScore: "5"
  });

  assert.equal(payload.firstName, "Melody");
  assert.equal(payload.graduationDate, "2026-07-15");
  assert.equal(payload.emailOptOut, true);
  assert.equal(payload.textOptOut, false);
  assert.equal(payload.ycco, true);
  assert.equal(payload.yccoId, "123ABC456");
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
    yccoId: " 123ABC456 ",
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
  assert.equal(payload.yccoId, "123ABC456");
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
    category: " Application ",
    uploadedBy: " director@snackprogram.org ",
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
  assert.equal(documentLink.category, "Application");
  assert.equal(documentLink.uploadedBy, "director@snackprogram.org");

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

test("fundraising payloads clean donor, campaign, gift, and earned income records", () => {
  const donor = cleanFundraisingDonorPayload({
    name: " Community Donor ",
    status: " Recurring ",
    lifetimeGiving: "1250.55",
    recurringAmount: "50"
  });
  assert.equal(donor.name, "Community Donor");
  assert.equal(donor.status, "Recurring");
  assert.equal(donor.donorType, "Individual");
  assert.equal(donor.lifetimeGiving, 1250.55);

  const campaign = cleanFundraisingCampaignPayload({
    name: " Annual Appeal ",
    goalAmount: "10000",
    raisedAmount: "2500"
  });
  assert.equal(campaign.name, "Annual Appeal");
  assert.equal(campaign.status, "Planning");
  assert.equal(campaign.goalAmount, 10000);

  const gift = cleanFundraisingGiftPayload({
    donorId: " donor-1 ",
    giftDate: " 2026-07-27 ",
    amount: "125.555",
    giftType: " Sponsorship ",
    recurring: "on"
  });
  assert.equal(gift.donorId, "donor-1");
  assert.equal(gift.amount, 125.56);
  assert.equal(gift.giftType, "Sponsorship");
  assert.equal(gift.recurring, true);

  const income = cleanEarnedIncomePayload({
    name: " YCCO Reimbursement ",
    amountBilled: "4000",
    amountReceived: "1500"
  });
  assert.equal(income.name, "YCCO Reimbursement");
  assert.equal(income.status, "Planning");
  assert.equal(income.amountReceived, 1500);
});

test("fundraising serializers preserve record ids and money values", () => {
  const donor = toFundraisingDonor(snapshot("donor-1", { name: "Donor", lifetimeGiving: 1200 }));
  const campaign = toFundraisingCampaign(snapshot("campaign-1", { name: "Campaign", goalAmount: 5000 }));
  const gift = toFundraisingGift(snapshot("gift-1", { donorId: "donor-1", amount: 125, recurring: true }));
  const income = toEarnedIncome(snapshot("income-1", { name: "Income", amountReceived: 900 }));

  assert.equal(donor.id, "donor-1");
  assert.equal(donor.lifetimeGiving, 1200);
  assert.equal(campaign.id, "campaign-1");
  assert.equal(campaign.goalAmount, 5000);
  assert.equal(gift.id, "gift-1");
  assert.equal(gift.amount, 125);
  assert.equal(gift.recurring, true);
  assert.equal(income.id, "income-1");
  assert.equal(income.amountReceived, 900);
});

test("cleanOutreachEventPayload defaults type and integer counts", () => {
  const payload = cleanOutreachEventPayload({
    name: " Cooking Class ",
    interactionsCount: "2.2",
    deadline: " 2026-08-01 ",
    registration: " Vendor portal ",
    mainActivity: " Prize wheel ",
    costAmount: "45.50"
  });

  assert.equal(payload.type, "Outreach Event");
  assert.equal(payload.status, "Scheduled");
  assert.equal(payload.name, "Cooking Class");
  assert.equal(payload.interactionsCount, 2);
  assert.equal(payload.deadline, "2026-08-01");
  assert.equal(payload.registration, "Vendor portal");
  assert.equal(payload.mainActivity, "Prize wheel");
  assert.equal(payload.costAmount, 45.5);

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

test("appointment scheduling window allows appointments from 1 PM through 6 PM", () => {
  assert.equal(appointmentFitsSchedulingWindow({ appointmentTime: "13:00", durationMinutes: 30 }), true);
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
    interpreterUse: " Yes ",
    caregiverMood: " Good ",
    confidence: " High ",
    participation: " Engaged ",
    barriers: " None ",
    goalResult: " Achieved ",
    participantGoals: [
      { clientId: "a", clientName: "Andi Smith", goal: " Try a fruit ", goalResult: " Achieved " },
      { clientId: "b", clientName: "Jessie Kellmer", goal: " Drink water ", goalResult: " Not Assessed " },
      { clientId: "a", clientName: "Duplicate", goalResult: "Not Achieved" }
    ],
    notes: " Bring workbook ",
    appointmentNote: " Discussed nutrient density. "
  });

  assert.deepEqual(payload.clientIds, ["a", "b"]);
  assert.deepEqual(payload.clientNames, ["Andi Smith", "Jessie Kellmer"]);
  assert.equal(payload.appointmentTime, "14:15");
  assert.equal(payload.durationMinutes, 30);
  assert.equal(payload.publicBookingServiceId, "nutrition-education");
  assert.equal(payload.interpreterUse, "Yes");
  assert.equal(payload.caregiverMood, "Good");
  assert.equal(payload.confidence, "High");
  assert.equal(payload.participation, "Engaged");
  assert.equal(payload.barriers, "None");
  assert.equal(payload.goalResult, "Achieved");
  assert.deepEqual(payload.participantGoals, [
    { clientId: "a", clientName: "Andi Smith", goal: "Try a fruit", goalResult: "Achieved" },
    { clientId: "b", clientName: "Jessie Kellmer", goal: "Drink water", goalResult: "Not Assessed" }
  ]);
  assert.deepEqual(cleanAppointmentParticipantGoals("not-an-array"), []);
  assert.equal(payload.notes, "Bring workbook");
  assert.equal(payload.appointmentNote, "Discussed nutrient density.");
});

test("appointment imports infer a lesson and goal from the matching Setmore note line", () => {
  const payload = cleanAppointmentPayload({
    clientName: "Test Client",
    appointmentDate: "2026-08-20",
    appointmentTime: "4:00 PM",
    appointmentType: "Nutrition Education",
    notes: "Tracker: Sugar\nSugar: eat fruit three times a day"
  });

  assert.equal(payload.lesson, "2");
  assert.equal(payload.goal, "eat fruit three times a day");
});

test("staff-created Nutrition Education appointments require a lesson", () => {
  assert.match(appointmentLessonValidationError({
    appointmentType: "Nutrition Education",
    lesson: ""
  }), /choose a lesson/i);
  assert.equal(appointmentLessonValidationError({
    appointmentType: "Nutrition Education",
    lesson: "Sugar"
  }), "");
  assert.equal(appointmentLessonValidationError({
    appointmentType: "Enrollment",
    lesson: ""
  }), "");
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
    clientNames: "Milo De Jesús Exampleton García, Avery Sample",
    appointmentDate: "2026-06-30",
    appointmentTime: "2:30 PM"
  });
  const clientsByName = new Map([
    [normalizedLookupKey("Milo de Jesus Exampleton Garcia"), {
      id: "client-1",
      firstName: "Milo de Jesús",
      lastName: "Exampleton García"
    }]
  ]);

  const error = await resolveAppointmentImportClients(payload, clientsByName, { allowNameOnly: true });

  assert.equal(error, "");
  assert.deepEqual(payload.clientIds, ["client-1"]);
  assert.deepEqual(payload.clientNames, ["Milo De Jesús Exampleton García", "Avery Sample"]);
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

  const outreachTask = cleanTaskPayload({
    title: " Confirm booth supplies ",
    source: "Outreach",
    outreachEventId: " event-1 ",
    outreachEventName: " County Fair "
  });
  assert.equal(outreachTask.outreachEventId, "event-1");
  assert.equal(outreachTask.outreachEventName, "County Fair");
  assert.equal(outreachTask.source, "Outreach");
});

test("task helper functions classify generated active tasks", () => {
  assert.equal(isActiveTaskStatus("Waiting"), true);
  assert.equal(isActiveTaskStatus("Done"), false);
  assert.equal(isGeneratedTaskSource("Start the Day"), true);
  assert.equal(isGeneratedTaskSource("Workflow Automation"), true);
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

test("generated scheduling tasks deduplicate schedule and reschedule wording for one client", () => {
  assert.equal(tasksMatchStartDayIntent({
    title: "Reschedule Avery Rivera",
    clientId: "client-1"
  }, {
    title: "Schedule next appointment for Avery Rivera",
    clientId: "client-1"
  }), true);
});

test("scheduled appointments create one linked outcome-review candidate the next day", () => {
  const candidate = staleAppointmentWorkflowTask({
    id: "appointment-1",
    status: "Scheduled",
    appointmentDate: "2026-07-29",
    appointmentTime: "13:00",
    durationMinutes: 30,
    clientIds: ["client-1"],
    clientNames: ["Avery Rivera"],
    staffMember: "Cynthia Esparza"
  }, new Date("2026-07-30T19:00:00.000Z"));

  assert.equal(candidate.title, "Update outcome for Avery Rivera");
  assert.equal(candidate.appointmentId, "appointment-1");
  assert.equal(candidate.clientId, "client-1");
  assert.equal(candidate.dueDate, "2026-07-30");
  assert.equal(staleAppointmentWorkflowTask({
    status: "Scheduled",
    appointmentDate: "2026-07-29",
    appointmentTime: "13:00",
    durationMinutes: 30
  }, new Date("2026-07-29T23:59:59.000Z")), null);
  assert.equal(staleAppointmentWorkflowTask({
    status: "Completed",
    appointmentDate: "2026-07-29"
  }, new Date("2026-07-31T12:00:00.000Z")), null);
});

test("Clinic calendar events use limited client details and stable private record IDs", () => {
  const event = googleCalendarEventForAppointment({
    id: "appointment-1",
    appointmentDate: "2026-08-04",
    appointmentTime: "1:30 PM",
    durationMinutes: 45,
    clientNames: ["Avery Rivera", "Jordan Rivera"],
    appointmentType: "Nutrition Education",
    lesson: "2",
    staffMember: "Cynthia Esparza",
    location: "123 Clinic Street",
    phone: "503-555-0101",
    notes: "Private health notes"
  });

  assert.equal(event.summary, "Avery R. + Jordan R. | Nutrition Education");
  assert.equal(event.start.dateTime, "2026-08-04T13:30:00");
  assert.equal(event.end.dateTime, "2026-08-04T14:15:00");
  assert.equal(event.start.timeZone, "America/Los_Angeles");
  assert.equal(event.description, "Lesson: Sugar\nAssigned staff: Cynthia Esparza");
  assert.equal(event.extendedProperties.private.snackRecordId, "appointment-1");
  assert.doesNotMatch(JSON.stringify(event), /503-555-0101|Private health notes|hub\.snackprogram\.org/);
});

test("Clinic calendar permission covers both the connection check and event changes", () => {
  assert.deepEqual(googleCalendarScopes, [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.readonly"
  ]);
  assert.equal(googleCalendarScopes.includes("https://www.googleapis.com/auth/calendar"), false);
});

test("Clinic calendar synchronization creates, updates, and removes one event", async () => {
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    if (options.method === "DELETE") return new Response(null, { status: 204 });
    return new Response(JSON.stringify({
      id: "event-1",
      extendedProperties: {
        private: { snackRecordType: "clinicAppointment", snackRecordId: "appointment-1" }
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  };
  const base = {
    id: "appointment-1",
    appointmentDate: "2026-08-04",
    appointmentTime: "13:30",
    clientNames: ["Avery Rivera"],
    appointmentType: "Enrollment",
    status: "Scheduled"
  };
  const options = {
    enabled: true,
    calendarId: "clinic@test.example",
    approvedCalendarId: "clinic@test.example",
    accessToken: "test-token",
    fetchImpl
  };

  const created = await syncClinicAppointmentCalendar(base, options);
  const updated = await syncClinicAppointmentCalendar({
    ...base,
    googleCalendarId: "clinic@test.example",
    googleEventId: created.eventId,
    appointmentTime: "14:00"
  }, options);
  const removed = await syncClinicAppointmentCalendar({
    ...base,
    googleCalendarId: "clinic@test.example",
    googleEventId: updated.eventId,
    status: "Canceled"
  }, options);

  assert.deepEqual(requests.map((request) => request.options.method), ["POST", "GET", "PATCH", "GET", "DELETE"]);
  assert.equal(created.eventId, "event-1");
  assert.equal(updated.eventId, "event-1");
  assert.equal(removed.eventId, "");
});

test("Clinic calendar synchronization refuses other calendars and events it does not own", async () => {
  let requestCount = 0;
  const base = {
    id: "appointment-1",
    appointmentDate: "2026-08-04",
    appointmentTime: "13:30",
    appointmentType: "Enrollment",
    status: "Scheduled"
  };

  await assert.rejects(
    syncClinicAppointmentCalendar(base, {
      enabled: true,
      calendarId: "another-calendar@test.example",
      approvedCalendarId: "clinic@test.example",
      accessToken: "test-token",
      fetchImpl: async () => {
        requestCount += 1;
        return new Response("{}", { status: 200 });
      }
    }),
    /not the approved Clinic Appts calendar/
  );
  assert.equal(requestCount, 0);

  await assert.rejects(
    syncClinicAppointmentCalendar({
      ...base,
      googleCalendarId: "another-calendar@test.example",
      googleEventId: "event-1"
    }, {
      enabled: true,
      calendarId: "clinic@test.example",
      approvedCalendarId: "clinic@test.example",
      accessToken: "test-token",
      fetchImpl: async () => {
        requestCount += 1;
        return new Response("{}", { status: 200 });
      }
    }),
    /points to a different calendar/
  );
  assert.equal(requestCount, 0);

  await assert.rejects(
    syncClinicAppointmentCalendar({
      ...base,
      googleCalendarId: "clinic@test.example",
      googleEventId: "event-1"
    }, {
      enabled: true,
      calendarId: "clinic@test.example",
      approvedCalendarId: "clinic@test.example",
      accessToken: "test-token",
      fetchImpl: async () => {
        requestCount += 1;
        return new Response(JSON.stringify({
          id: "event-1",
          extendedProperties: {
            private: { snackRecordType: "clinicAppointment", snackRecordId: "some-other-appointment" }
          }
        }), { status: 200, headers: { "Content-Type": "application/json" } });
      }
    }),
    /event is not owned by this Hub appointment/
  );
  assert.equal(requestCount, 1);
});

test("controlled Clinic calendar verification checks access and cleans up its QA event", async () => {
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url, options });
    if (options.method === "GET") {
      const payload = url.includes("/events/")
        ? {
          id: "qa-event-1",
          extendedProperties: {
            private: { snackRecordType: "clinicAppointment", snackRecordId: requests[1]?.options?.body ? JSON.parse(requests[1].options.body).extendedProperties.private.snackRecordId : "" }
          }
        }
        : { summary: "Clinic Appts", accessRole: "writer" };
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (options.method === "DELETE") return new Response(null, { status: 204 });
    return new Response(JSON.stringify({ id: "qa-event-1" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  };

  const result = await verifyGoogleCalendarLifecycle({
    calendarId: "clinic@test.example",
    approvedCalendarId: "clinic@test.example",
    accessToken: "test-token",
    fetchImpl,
    testDate: "2026-08-07"
  });

  assert.deepEqual(requests.map((request) => request.options.method), ["GET", "POST", "GET", "PATCH", "GET", "DELETE"]);
  assert.deepEqual(result.lifecycle, { created: true, updated: true, removed: true });
  assert.equal(result.calendarName, "Clinic Appts");
  assert.equal(result.accessRole, "writer");
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
  const date = "2026-07-29";
  const nonblockingDate = "2026-07-30";
  const service = publicBookingServiceFromId("enrollment");
  const historicalNow = new Date("2026-07-27T12:00:00Z");
  const slots = publicSlotValuesForDate(date, service, [
    { appointmentDate: date, appointmentTime: "13:00", durationMinutes: 30, status: "Scheduled" }
  ], defaultSchedulingSettingsNormalized, historicalNow);
  const values = slots.map((slot) => slot.value);

  assert.equal(values.includes("13:00"), false);
  assert.equal(values.includes("13:15"), false);
  assert.equal(values.includes("13:30"), true);
  assert.equal(values.at(-1), "17:30");

  const nonblockingSlots = publicSlotValuesForDate(nonblockingDate, service, [
    { appointmentDate: date, appointmentTime: "13:00", durationMinutes: 30, status: "Canceled" }
  ], defaultSchedulingSettingsNormalized, historicalNow);

  assert.equal(nonblockingSlots[0].value, "13:00");
});

test("public slots follow configurable appointment days and hours", () => {
  const date = nextUtcWeekday(3);
  const service = publicBookingServiceFromId("enrollment");
  const historicalNow = new Date(`${date}T00:00:00Z`);
  historicalNow.setUTCDate(historicalNow.getUTCDate() - 1);
  const customSettings = {
    weekdays: [3],
    bookableStartTime: "14:00",
    bookableEndTime: "15:00",
    bookableStartMinutes: 14 * 60,
    bookableEndMinutes: 15 * 60,
    slotIntervalMinutes: 15
  };

  assert.deepEqual(publicSlotValuesForDate(date, service, [], customSettings, historicalNow).map((slot) => slot.value), [
    "14:00",
    "14:15",
    "14:30"
  ]);
  assert.deepEqual(publicSlotValuesForDate(nextUtcWeekday(4), service, [], customSettings, historicalNow), []);
});

test("public booking requires at least 24 hours notice in Pacific time", () => {
  const now = new Date("2026-07-15T20:15:00Z");

  assert.equal(isPublicAppointmentAtLeastHoursAhead("2026-07-16", "13:00", now), false);
  assert.equal(isPublicAppointmentAtLeastHoursAhead("2026-07-16", "13:15", now), true);

  const service = publicBookingServiceFromId("enrollment");
  const slots = publicSlotValuesForDate(
    "2026-07-16",
    service,
    [],
    defaultSchedulingSettingsNormalized,
    now
  );

  assert.equal(slots[0].value, "13:15");
});

test("public management tokens and serialized bookings are private-safe", () => {
  const token = "family-private-token";
  const hash = publicManageTokenHash(token);
  const booking = serializePublicManagedBooking({
    id: "appt-1",
    clientNames: ["Milo Exampleton", "Tessa Exampleton"],
    publicBookingServiceId: "spanish-nutrition-education",
    publicBookingServiceLabel: "Cita de educación nutricional en español",
    appointmentDate: nextUtcWeekday(2),
    appointmentTime: "14:30",
    durationMinutes: 30,
    location: "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128",
    status: "Scheduled"
  });

  assert.equal(publicManageTokensMatch(token, hash), true);
  assert.equal(publicManageTokensMatch("wrong-token", hash), false);
  assert.equal(publicManageTokensMatch("", hash), false);
  assert.equal(publicManageTokensMatch(token, "not-a-valid-hash"), false);
  assert.equal(booking.serviceId, "spanish-nutrition-education");
  assert.equal(booking.serviceLabel, "Cita de educación nutricional en español");
  assert.equal(booking.appointmentTimeLabel, "2:30 PM");
  assert.equal(booking.clientName, "Milo Exampleton, Tessa Exampleton");
  assert.equal(booking.location, "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128");
  assert.equal(booking.canReview, false);
  assert.equal(booking.reviewSubmitted, false);
  assert.equal(Object.hasOwn(booking, "publicManageTokenHash"), false);
});

test("public review links open only for completed appointments without a prior review", () => {
  assert.equal(publicAppointmentCanReview({ status: "Completed" }), true);
  assert.equal(publicAppointmentCanReview({ status: "completed" }), true);
  assert.equal(publicAppointmentCanReview({ status: "Scheduled" }), false);
  assert.equal(publicAppointmentCanReview({
    status: "Completed",
    publicReviewSubmittedAt: "2026-08-17T12:00:00.000Z"
  }), false);
});

test("public booking confirmation content includes the private management link", () => {
  const confirmation = buildPublicBookingConfirmation({
    appointmentId: "appt-1",
    manageToken: "private-token",
    bookingPageUrl: "https://booking.example.org/booking.html?old=value#section",
    caregiverName: "Jordan",
    clientNames: ["Milo Exampleton", "Tessa Exampleton"],
    serviceLabel: "Nutrition Education Appointment",
    appointmentDate: "2026-07-21",
    appointmentTimeLabel: "2:30 PM",
    preferredLanguage: "English",
    email: "family@example.com",
    phone: "(503) 555-0100"
  });

  assert.equal(
    confirmation.manageUrl,
    "https://booking.example.org/booking.html?appointmentId=appt-1#token=private-token"
  );
  assert.match(confirmation.email.subject, /appointment is confirmed/i);
  assert.match(confirmation.email.text, /Milo Exampleton and Tessa Exampleton/);
  assert.match(confirmation.email.text, /Tuesday, July 21, 2026/);
  assert.match(confirmation.email.text, /private link/);
  assert.match(confirmation.email.html, /appointmentId=appt-1#token=private-token/);
  assert.match(confirmation.text.body, /Manage appointment:/);
});

test("public booking confirmation content follows the family's preferred language", () => {
  const confirmation = buildPublicBookingConfirmation({
    appointmentId: "appt-2",
    manageToken: "private-token",
    bookingPageUrl: "https://booking.example.org/booking.html",
    caregiverName: "María",
    clientNames: ["Lana", "Hamzah"],
    serviceLabel: "Cita de educación nutricional en español",
    appointmentDate: "2026-07-22",
    appointmentTimeLabel: "3:00 PM",
    preferredLanguage: "Spanish",
    email: "familia@example.com",
    phone: "(503) 555-0101"
  });

  assert.match(confirmation.email.subject, /cita.*confirmada/i);
  assert.match(confirmation.email.text, /Hola María/);
  assert.match(confirmation.email.text, /Lana y Hamzah/);
  assert.match(confirmation.email.text, /cancelar o elegir una nueva hora/);
  assert.match(confirmation.text.body, /Administrar cita:/);
});

test("confirmation delivery remains disabled or preview-only", () => {
  const details = {
    appointmentId: "appt-3",
    manageToken: "private-token",
    bookingPageUrl: "https://booking.example.org/booking.html",
    caregiverName: "Jordan",
    clientNames: ["Milo"],
    serviceLabel: "Enrollment Appointment",
    appointmentDate: "2026-07-23",
    appointmentTimeLabel: "1:00 PM",
    preferredLanguage: "English",
    email: "family@example.com",
    phone: "(503) 555-0102"
  };
  const disabled = previewPublicBookingConfirmationDelivery(details, "live");
  const preview = previewPublicBookingConfirmationDelivery(details, "preview");
  const summary = publicBookingConfirmationDeliverySummary(preview);

  assert.equal(publicBookingConfirmationMode("live"), "disabled");
  assert.deepEqual(disabled, { status: "disabled", channels: [] });
  assert.equal(preview.status, "preview");
  assert.deepEqual(preview.channels, ["email", "text"]);
  assert.deepEqual(summary, { status: "preview", channels: ["email", "text"] });
  assert.equal(JSON.stringify(summary).includes("family@example.com"), false);
  assert.equal(JSON.stringify(summary).includes("private-token"), false);
});

test("public booking management URLs require both private values", () => {
  assert.equal(publicBookingManageUrl({ appointmentId: "appt-1", manageToken: "" }), "");
  assert.equal(publicBookingManageUrl({ appointmentId: "", manageToken: "token" }), "");
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
    address: " 2435 ne cumulus avenue, mcminnville, oregon 97128 ",
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
  assert.equal(payload.address, "2435 NE Cumulus Ave, McMinnville, OR 97128");
  assert.equal(payload.appointmentTime, "13:00");
});

test("public booking validation rejects spam traps and malformed public input", () => {
  const validationNow = new Date("2026-07-15T20:15:00Z");
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
    appointmentDate: "2026-07-21",
    appointmentTime: "1 PM"
  });

  assert.equal(publicBookingValidationError(validPayload, defaultSchedulingSettingsNormalized, validationNow), "");
  assert.match(publicBookingValidationError({ ...validPayload, website: "bot.example" }, defaultSchedulingSettingsNormalized, validationNow), /Could not submit/);
  assert.match(publicBookingValidationError({ ...validPayload, spamTrap: "bot.example" }, defaultSchedulingSettingsNormalized, validationNow), /Could not submit/);
  assert.match(publicBookingValidationError({ ...validPayload, email: "not-an-email" }, defaultSchedulingSettingsNormalized, validationNow), /valid email/);
  assert.match(publicBookingValidationError({ ...validPayload, email: "" }, defaultSchedulingSettingsNormalized, validationNow), /required/);
  assert.match(publicBookingValidationError({ ...validPayload, consentReminders: false, serviceEmailConsent: false, serviceTextConsent: false }, defaultSchedulingSettingsNormalized, validationNow), /Choose email reminders/);
  assert.match(publicBookingValidationError({ ...validPayload, notes: "x".repeat(601) }, defaultSchedulingSettingsNormalized, validationNow), /shorten/);

  const tooSoonPayload = {
    ...validPayload,
    appointmentDate: "2026-07-16",
    appointmentTime: "13:00"
  };
  assert.match(
    publicBookingValidationError(tooSoonPayload, defaultSchedulingSettingsNormalized, validationNow),
    /at least 24 hours/
  );
});

test("public Kitchen registration reuses family fields and keeps food restrictions", () => {
  const payload = cleanPublicClassRegistrationPayload({
    sessionId: "class-1",
    children: [
      { childName: "Milo Garcia", dateOfBirth: "2016-01-02", gender: "Male" },
      { childName: "Tessa Garcia", dateOfBirth: "2018-03-04", gender: "Female" }
    ],
    caregiverName: "Jordan",
    mobilePhone: "(503) 555-0100",
    email: "family@example.com",
    address: "2435 NE Cumulus Ave",
    preferredLanguage: "Spanish",
    preferredContactMethod: "Text",
    yccoMember: "Yes",
    yccoId: "member-1",
    consentReminders: true,
    foodRestrictions: " Peanut allergy "
  });

  assert.equal(payload.sessionId, "class-1");
  assert.equal(payload.children.length, 2);
  assert.equal(payload.parentName, "Jordan");
  assert.equal(payload.preferredLanguage, "Spanish");
  assert.equal(payload.foodRestrictions, "Peanut allergy");
});

test("public Kitchen sessions enforce notice, capacity, and whole-family waitlisting", () => {
  const session = {
    id: "class-1",
    program: "Kitchen",
    title: "Kids Cooking + Nutrition Class - Ages 8-12",
    classTypeId: "kids-cooking-ages-8-12",
    sessionDate: "2026-07-23",
    startTime: "13:00",
    durationMinutes: 120,
    capacity: 8,
    status: "Scheduled"
  };
  const now = new Date("2026-07-21T19:00:00Z");
  const availability = publicKitchenSessionAvailability(session, [
    { status: "Registered", attendeeCount: 7 }
  ], defaultSchedulingSettingsNormalized, now);
  const payload = cleanPublicClassRegistrationPayload({
    sessionId: "class-1",
    children: [{ childName: "Ana Bello", dateOfBirth: "2015-01-02", gender: "Female" }],
    caregiverName: "Arianna",
    mobilePhone: "503-555-0100",
    email: "family@example.com",
    address: "2435 NE Cumulus Ave",
    preferredLanguage: "English",
    preferredContactMethod: "Phone Call",
    consentReminders: true
  });

  assert.equal(availability.spacesRemaining, 1);
  assert.equal(availability.nextStatus, "Registered");
  assert.equal(publicClassRegistrationValidationError(payload, session, defaultSchedulingSettingsNormalized, now), "");

  const tooSoon = { ...session, sessionDate: "2026-07-22" };
  assert.match(
    publicClassRegistrationValidationError(
      payload,
      tooSoon,
      defaultSchedulingSettingsNormalized,
      new Date("2026-07-21T20:30:00Z")
    ),
    /no longer available/
  );
});

test("serializers produce stable API shapes", () => {
  const referral = toReferral(snapshot("r1", { firstName: "Ana", ycco: "yes", yccoId: "123ABC456", siblingIds: ["r2"] }));
  const client = toClient(snapshot("c1", { firstName: "Ana", hrsn: "checked", yccoId: "789XYZ012", providerLinks: [{ providerName: "William" }] }));
  const appointment = toAppointment(snapshot("a1", {
    clientIds: ["c1"],
    appointmentTime: "13:00",
    durationMinutes: 15,
    goalResult: "Partly Achieved",
    participantGoals: [{ clientId: "c1", clientName: "Ana", goal: "Try fruit", goalResult: "Achieved" }],
    prepChecklist: { sticker: true, unknownItem: true }
  }));
  const task = toTask(snapshot("t1", { title: "Call", type: "forms", status: "Open" }));
  const activity = toActivityLog(snapshot("l1", {
    type: "Call",
    direction: "Outbound",
    createdBy: "shannon@snackprogram.org",
    createdByDisplayName: "Shannon Oddo"
  }));
  const grant = toGrant(snapshot("g1", { foundationName: "Foundation", pastGrantReceived: true, documents: [{ title: "Application" }] }));
  const question = toGrantQuestion(snapshot("q1", { prompt: "Question", answer: "Answer" }));
  const organizationInfo = toGrantOrganizationInfo(snapshot("grantOrganizationInfo", {
    legalName: "SNACK",
    documents: [{ title: "Board Roster" }]
  }));

  assert.equal(referral.id, "r1");
  assert.equal(referral.ycco, true);
  assert.equal(referral.yccoId, "123ABC456");
  assert.equal(client.hrsn, true);
  assert.equal(activity.createdBy, "shannon@snackprogram.org");
  assert.equal(activity.createdByDisplayName, "Shannon Oddo");
  assert.equal(client.yccoId, "789XYZ012");
  assert.equal(client.providerLinks[0].providerName, "William");
  assert.equal(appointment.durationMinutes, 15);
  assert.equal(appointment.goalResult, "Partly Achieved");
  assert.equal(appointment.participantGoals[0].goalResult, "Achieved");
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
  assert.ok(routes.indexOf("/api/public/classes") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/classes/:sessionId") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/class-registrations") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/bookings") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/bookings/:appointmentId") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/bookings/:appointmentId/cancel") < routes.indexOf("/api/message"));
  assert.ok(routes.indexOf("/api/public/bookings/:appointmentId/reschedule") < routes.indexOf("/api/message"));
  assert.ok(routes.includes("/api/grants"));
  assert.ok(routes.includes("/api/grants/:grantId"));
  assert.ok(routes.includes("/api/grant-questions"));
  assert.ok(routes.includes("/api/grant-questions/:questionId"));
  assert.ok(routes.includes("/api/grant-organization-info"));
  assert.ok(routes.includes("/api/donors"));
  assert.ok(routes.includes("/api/donors/:donorId"));
  assert.ok(routes.includes("/api/campaigns"));
  assert.ok(routes.includes("/api/campaigns/:campaignId"));
  assert.ok(routes.includes("/api/earned-income"));
  assert.ok(routes.includes("/api/earned-income/:incomeId"));
  assert.ok(routes.includes("/api/marketing-campaigns"));
  assert.ok(routes.includes("/api/marketing-campaigns/:campaignId"));
  assert.ok(routes.includes("/api/marketing/mailerlite/status"));
  assert.ok(routes.includes("/api/marketing/mailerlite/test-sync"));
  assert.ok(routes.includes("/api/public/mailerlite/webhook"));
  assert.equal(routes.includes("/api/marketing/send"), false);
  assert.ok(routes.includes("/api/admin/scheduling-settings"));
  assert.ok(routes.includes("/api/admin/google-calendar/status"));
  assert.ok(routes.includes("/api/admin/google-calendar/backfill"));
  assert.ok(routes.includes("/api/appointments/:appointmentId/prep"));
  assert.ok(routes.includes("/api/outreach-events"));
  assert.ok(routes.includes("/api/outreach-events/:eventId"));
  assert.ok(routes.includes("/api/outreach-contacts"));
  assert.ok(routes.includes("/api/outreach-contacts/:contactId"));
  assert.ok(routes.includes("/api/outreach-contacts/:contactId/link-referral"));
  assert.ok(routes.includes("/api/outreach-tasks"));
  assert.ok(routes.includes("/api/outreach-tasks/:taskId"));
  assert.ok(routes.includes("/api/tasks/reconcile"));
  assert.ok(routes.includes("/api/staff-directory"));
  assert.ok(routes.includes("/api/schedule/activity-logs"));
  const healthRoute = registeredRoutes.find((route) => route.path === "/health");
  const bookingOptionsRoute = registeredRoutes.find((route) => route.path === "/api/public/booking-options");
  const publicClassesRoute = registeredRoutes.find((route) => route.path === "/api/public/classes");
  const publicClassRegistrationRoute = registeredRoutes.find((route) => route.path === "/api/public/class-registrations");
  const prepRoute = registeredRoutes.find((route) => route.path === "/api/appointments/:appointmentId/prep");
  const outreachEventsRoute = registeredRoutes.find((route) => route.path === "/api/outreach-events");
  const donorRoute = registeredRoutes.find((route) => route.path === "/api/donors" && route.methods.get);
  const campaignRoute = registeredRoutes.find((route) => route.path === "/api/campaigns" && route.methods.get);
  const earnedIncomeRoute = registeredRoutes.find((route) => route.path === "/api/earned-income" && route.methods.get);
  const marketingCampaignRoute = registeredRoutes.find((route) => route.path === "/api/marketing-campaigns" && route.methods.get);
  const mailerLiteStatusRoute = registeredRoutes.find((route) => route.path === "/api/marketing/mailerlite/status");
  const mailerLiteTestSyncRoute = registeredRoutes.find((route) => route.path === "/api/marketing/mailerlite/test-sync");
  const mailerLiteWebhookRoute = registeredRoutes.find((route) => route.path === "/api/public/mailerlite/webhook");
  const outreachDeleteRoute = registeredRoutes.find((route) => (
    route.path === "/api/outreach-events/:eventId" && route.methods.delete
  ));
  const outreachReferralLinkRoute = registeredRoutes.find((route) => (
    route.path === "/api/outreach-contacts/:contactId/link-referral"
  ));
  const messageRoute = registeredRoutes.find((route) => route.path === "/api/message");

  assert.equal(healthRoute.stack.length, 1);
  assert.equal(bookingOptionsRoute.stack.length, 1);
  assert.equal(bookingOptionsRoute.methods.get, true);
  assert.equal(publicClassesRoute.methods.get, true);
  assert.equal(publicClassesRoute.stack.length, 1);
  assert.equal(publicClassRegistrationRoute.methods.post, true);
  assert.equal(publicClassRegistrationRoute.stack.length, 2);
  assert.equal(prepRoute.methods.patch, true);
  assert.equal(prepRoute.stack.length, 2);
  assert.equal(outreachEventsRoute.methods.get, true);
  assert.equal(outreachEventsRoute.stack.length, 2);
  assert.equal(donorRoute.stack.length, 2);
  assert.equal(campaignRoute.stack.length, 2);
  assert.equal(earnedIncomeRoute.stack.length, 2);
  assert.equal(marketingCampaignRoute.stack.length, 2);
  assert.equal(mailerLiteStatusRoute.methods.get, true);
  assert.equal(mailerLiteStatusRoute.stack.length, 2);
  assert.equal(mailerLiteTestSyncRoute.methods.post, true);
  assert.equal(mailerLiteTestSyncRoute.stack.length, 2);
  assert.equal(mailerLiteWebhookRoute.methods.post, true);
  assert.equal(mailerLiteWebhookRoute.stack.length, 1);
  assert.equal(outreachDeleteRoute.stack.length, 2);
  assert.equal(outreachReferralLinkRoute.methods.patch, true);
  assert.equal(outreachReferralLinkRoute.stack.length, 2);
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
