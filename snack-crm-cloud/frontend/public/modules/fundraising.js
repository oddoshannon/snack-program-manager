function cleanText(value) {
  return String(value ?? "").trim();
}

function cleanNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : null;
}

function cleanInteger(value) {
  const number = cleanNumber(value);
  return number === null ? null : Math.round(number);
}

function cleanBoolean(value) {
  return value === true || value === "true" || value === "on" || value === "yes" || value === "1";
}

const grantStatusOptions = [
  "Researching",
  "Planning",
  "In Progress",
  "Submitted",
  "Awarded",
  "Reporting",
  "Not A Good Fit",
  "Declined",
  "Closed"
];

const donorStatusOptions = ["Prospect", "Active", "Recurring", "Lapsed", "Inactive"];
const campaignStatusOptions = ["Planning", "Active", "Complete", "Paused", "Canceled"];
const giftTypeOptions = ["Individual Gift", "Sponsorship", "Fundraising Event", "In-Kind", "Other"];
const giftPaymentMethodOptions = ["Online", "Card", "Check", "Cash", "ACH", "Other"];
const giftRecurringFrequencyOptions = ["Monthly", "Quarterly", "Annual", "Other"];
const earnedIncomeStatusOptions = [
  "Planning",
  "Active",
  "Submitted",
  "Partially Paid",
  "Paid",
  "Reconciled",
  "Closed"
];
const financialActivityTypeOptions = [
  "Grant Revenue",
  "Workbook Sale",
  "Merchandise Sale",
  "Toolkit Sale",
  "Other Income"
];
const financialGiftActivityTypeOptions = [
  "Individual Gift",
  "Sponsorship Revenue",
  "Event Revenue",
  "In-Kind Gift",
  "Other Gift"
];

const closedGrantStatuses = new Set(["Awarded", "Reporting", "Not A Good Fit", "Declined", "Closed"]);
const grantPipelineColumns = ["Researching", "Planning", "In Progress", "Submitted", "Awarded"];

function formatGrantDate(value, options = {}) {
  const text = cleanText(value);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return text || "-";

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", {
    month: options.short ? "short" : "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function formatGrantTime(value) {
  const text = cleanText(value);
  const match = text.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return text;
  const hour = Number(match[1]);
  const minute = match[2];
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute} ${suffix}`;
}

function formatGrantMoney(value, fallback = "-") {
  const amount = cleanNumber(value);
  if (amount === null) return fallback;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2
  }).format(amount);
}

function grantTitle(grant = {}) {
  return cleanText(grant.grantName) || cleanText(grant.foundationName) || "Unnamed grant";
}

function grantFoundation(grant = {}) {
  return cleanText(grant.foundationName) || "-";
}

function grantDeadlineLabel(grant = {}) {
  const date = formatGrantDate(grant.deadlineDate, { short: true });
  const time = formatGrantTime(grant.deadlineTime);
  if (date === "-") return time || "-";
  return time ? `${date} at ${time}` : date;
}

function grantAmountRange(grant = {}) {
  const minimum = formatGrantMoney(grant.amountMin, "");
  const maximum = formatGrantMoney(grant.amountMax, "");
  if (minimum && maximum) return `${minimum} - ${maximum}`;
  return minimum || maximum || "-";
}

function grantPreviousAward(grant = {}) {
  if (!cleanBoolean(grant.pastGrantReceived)) return "-";
  const amount = formatGrantMoney(grant.pastGrantAmount, "Yes");
  const date = formatGrantDate(grant.previousAwardDate, { short: true });
  const year = cleanInteger(grant.pastGrantYear);
  const when = date !== "-" ? date : year ? String(year) : "";
  return when ? `${amount} (${when})` : amount;
}

function grantContact(grant = {}) {
  return [cleanText(grant.contactName), cleanText(grant.contactRole)].filter(Boolean).join(" | ") || "-";
}

function grantSubtitle(grant = {}) {
  const foundation = cleanText(grant.foundationName);
  const deadline = grantDeadlineLabel(grant);
  const parts = [];
  if (cleanText(grant.grantName) && foundation) parts.push(foundation);
  if (deadline !== "-") parts.push(`Due ${deadline}`);
  if (!parts.length) parts.push(cleanText(grant.focusAreas) || "No deadline set");
  return parts.join(" | ");
}

function grantDeadlineSortValue(grant = {}) {
  const date = cleanText(grant.deadlineDate);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return Number.POSITIVE_INFINITY;
  const time = /^\d{1,2}:\d{2}$/.test(cleanText(grant.deadlineTime)) ? cleanText(grant.deadlineTime) : "23:59";
  const value = new Date(`${date}T${time}:00`).getTime();
  return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
}

function mapGrant(grant = {}) {
  const status = cleanText(grant.status) || "Researching";
  const documents = Array.isArray(grant.documents) ? grant.documents : [];
  return {
    id: cleanText(grant.id),
    kind: "grant",
    title: grantTitle(grant),
    subtitle: grantSubtitle(grant),
    status,
    foundation: grantFoundation(grant),
    grantName: cleanText(grant.grantName) || "-",
    openDate: formatGrantDate(grant.openDate, { short: true }),
    openDateValue: cleanText(grant.openDate),
    deadline: grantDeadlineLabel(grant),
    deadlineDateValue: cleanText(grant.deadlineDate),
    deadlineTimeValue: cleanText(grant.deadlineTime),
    awardExpected: formatGrantDate(grant.awardExpectedDate, { short: true }),
    awardExpectedDateValue: cleanText(grant.awardExpectedDate),
    requested: formatGrantMoney(grant.amountRequested),
    amountRequested: formatGrantMoney(grant.amountRequested),
    amountRequestedValue: cleanNumber(grant.amountRequested),
    range: grantAmountRange(grant),
    amountMinValue: cleanNumber(grant.amountMin),
    amountMaxValue: cleanNumber(grant.amountMax),
    focusAreas: cleanText(grant.focusAreas) || "-",
    recurrence: cleanText(grant.recurrence) || "-",
    frequency: cleanText(grant.applicationFrequency) || "-",
    contact: grantContact(grant),
    contactName: cleanText(grant.contactName) || "-",
    contactRole: cleanText(grant.contactRole) || "-",
    contactEmail: cleanText(grant.contactEmail) || "-",
    contactPhone: cleanText(grant.contactPhone) || "-",
    secondaryContact: cleanText(grant.secondaryContactName) || "-",
    secondaryEmail: cleanText(grant.secondaryContactEmail) || "-",
    website: cleanText(grant.websiteUrl) || "-",
    portal: cleanText(grant.portalUrl) || "-",
    portalLoginEmail: cleanText(grant.portalLoginEmail) || "-",
    portalLoginNotes: cleanText(grant.portalLoginNotes) || "-",
    reporting: cleanText(grant.reportingRequirements) || "-",
    pastAward: grantPreviousAward(grant),
    pastGrantNotes: cleanText(grant.pastGrantNotes) || "-",
    brandingNotes: cleanText(grant.brandingNotes) || "-",
    notes: cleanText(grant.notes) || "-",
    documents,
    source: grant
  };
}

function mapGrants(grants = []) {
  return grants
    .map(mapGrant)
    .sort((first, second) =>
      grantDeadlineSortValue(first.source) - grantDeadlineSortValue(second.source)
      || first.title.localeCompare(second.title));
}

function grantMatches(item = {}, query = "") {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [
    item.title,
    item.foundation,
    item.status,
    item.focusAreas,
    item.contact,
    item.reporting,
    item.notes
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function grantIsOpen(grant = {}) {
  return !closedGrantStatuses.has(cleanText(grant.status) || "Researching");
}

function fundraisingSummary(grants = [], referenceDate = new Date()) {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  const cutoff = new Date(start);
  cutoff.setDate(cutoff.getDate() + 45);
  const dueSoon = grants.filter((grant) => {
    const status = cleanText(grant.status) || "Researching";
    if (!grantIsOpen(grant) || status === "Submitted") return false;
    const deadline = grantDeadlineSortValue({ deadlineDate: grant.deadlineDate, deadlineTime: "00:00" });
    return Number.isFinite(deadline) && deadline >= start.getTime() && deadline <= cutoff.getTime();
  });

  return [
    [String(grants.filter(grantIsOpen).length), "Open Grants"],
    [String(dueSoon.length), "Due in 45 Days"],
    [String(grants.filter((grant) => cleanText(grant.status) === "Submitted").length), "Submitted"],
    [String(grants.filter((grant) => ["Awarded", "Reporting"].includes(cleanText(grant.status))).length), "Awarded"]
  ];
}

function grantPayload(values = {}, existingGrant = {}) {
  const textFields = [
    "foundationName",
    "grantName",
    "status",
    "openDate",
    "deadlineDate",
    "deadlineTime",
    "awardExpectedDate",
    "focusAreas",
    "recurrence",
    "applicationFrequency",
    "contactName",
    "contactRole",
    "contactEmail",
    "contactPhone",
    "secondaryContactName",
    "secondaryContactEmail",
    "websiteUrl",
    "portalUrl",
    "portalLoginEmail",
    "portalLoginPassword",
    "portalLoginNotes",
    "reportingRequirements",
    "previousAwardDate",
    "pastGrantNotes",
    "brandingNotes",
    "notes"
  ];
  const payload = Object.fromEntries(textFields.map((field) => [field, cleanText(values[field])]));
  payload.status ||= "Researching";
  payload.amountRequested = cleanNumber(values.amountRequested);
  payload.amountMin = cleanNumber(values.amountMin);
  payload.amountMax = cleanNumber(values.amountMax);
  payload.pastGrantReceived = cleanBoolean(values.pastGrantReceived);
  payload.pastGrantAmount = cleanNumber(values.pastGrantAmount);
  payload.pastGrantYear = cleanInteger(values.pastGrantYear);
  payload.documents = Array.isArray(values.documents)
    ? values.documents
    : Array.isArray(existingGrant.documents)
      ? existingGrant.documents
      : [];
  return payload;
}

function grantDeleteDecision(pendingGrantId, grantId) {
  const id = cleanText(grantId);
  return id && cleanText(pendingGrantId) === id ? "delete" : "confirm";
}

function grantPipelineGroups(items = []) {
  const groups = Object.fromEntries(grantPipelineColumns.map((status) => [status, []]));
  for (const item of items) {
    const status = cleanText(item.status) || "Researching";
    if (status === "Reporting") {
      groups.Awarded.push(item);
    } else if (groups[status]) {
      groups[status].push(item);
    }
  }
  return groups;
}

function grantMovePayload(item = {}, status = "Researching") {
  return grantPayload({ ...(item.source || {}), status }, item.source || {});
}

function grantDeadlineItems(items = [], referenceDate = new Date()) {
  const cutoff = new Date(referenceDate);
  cutoff.setHours(0, 0, 0, 0);
  return items
    .flatMap((item) => {
      const rows = [];
      if (item.deadlineDateValue) {
        rows.push({
          id: `${item.id}:deadline`,
          grantId: item.id,
          title: item.title,
          foundation: item.foundation,
          date: item.deadlineDateValue,
          dateLabel: item.deadline,
          type: "Application",
          amount: item.requested,
          status: item.status
        });
      }
      if (item.awardExpectedDateValue) {
        rows.push({
          id: `${item.id}:decision`,
          grantId: item.id,
          title: item.title,
          foundation: item.foundation,
          date: item.awardExpectedDateValue,
          dateLabel: item.awardExpected,
          type: "Decision",
          amount: item.requested,
          status: item.status
        });
      }
      return rows;
    })
    .filter((row) => {
      const timestamp = new Date(`${row.date}T00:00:00`).getTime();
      return Number.isFinite(timestamp) && timestamp >= cutoff.getTime();
    })
    .sort((first, second) => first.date.localeCompare(second.date) || first.title.localeCompare(second.title));
}

function mapGrantQuestions(questions = []) {
  return questions
    .map((question) => ({
      id: cleanText(question.id),
      category: cleanText(question.category) || "General",
      prompt: cleanText(question.prompt) || "Untitled answer",
      answer: cleanText(question.answer),
      targetLimit: cleanText(question.targetLimit),
      notes: cleanText(question.notes),
      wordCount: cleanText(question.answer).split(/\s+/).filter(Boolean).length,
      updatedAt: cleanText(question.updatedAt),
      source: question
    }))
    .sort((first, second) => first.category.localeCompare(second.category) || first.prompt.localeCompare(second.prompt));
}

function grantQuestionPayload(values = {}) {
  return {
    category: cleanText(values.category) || "General",
    prompt: cleanText(values.prompt),
    answer: cleanText(values.answer),
    targetLimit: cleanText(values.targetLimit),
    notes: cleanText(values.notes)
  };
}

function mapGrantOrganizationInfo(info = {}) {
  return {
    legalName: cleanText(info.legalName),
    dbaName: cleanText(info.dbaName),
    ein: cleanText(info.ein),
    mailingAddress: cleanText(info.mailingAddress),
    yearFounded: cleanInteger(info.yearFounded),
    websiteUrl: cleanText(info.websiteUrl),
    socialMediaLinks: cleanText(info.socialMediaLinks),
    fundingStructure: cleanText(info.fundingStructure),
    mission: cleanText(info.mission),
    vision: cleanText(info.vision),
    guidingPrinciples: cleanText(info.guidingPrinciples),
    organizationDescription: cleanText(info.organizationDescription),
    populationServed: cleanText(info.populationServed),
    annualBudget: cleanText(info.annualBudget),
    copyBlocks: Array.isArray(info.copyBlocks) ? info.copyBlocks : [],
    documents: Array.isArray(info.documents) ? info.documents : [],
    dataNotes: cleanText(info.dataNotes),
    updatedAt: cleanText(info.updatedAt)
  };
}

function grantOrganizationInfoPayload(values = {}, existing = {}) {
  const mapped = mapGrantOrganizationInfo({ ...existing, ...values });
  const { updatedAt: _updatedAt, ...payload } = mapped;
  return payload;
}

function grantDocumentPayload(values = {}) {
  return {
    id: cleanText(values.id),
    type: cleanText(values.type) || cleanText(values.category) || "Other",
    category: cleanText(values.category) || cleanText(values.type) || "Other",
    title: cleanText(values.title) || cleanText(values.fileName) || "Document",
    url: cleanText(values.url),
    storagePath: cleanText(values.storagePath),
    fileName: cleanText(values.fileName),
    mimeType: cleanText(values.mimeType),
    fileSize: cleanInteger(values.fileSize),
    uploadedAt: cleanText(values.uploadedAt),
    uploadedBy: cleanText(values.uploadedBy),
    notes: cleanText(values.notes)
  };
}

const grantDocumentTypes = Object.freeze({
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  txt: "text/plain",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp"
});

function grantDocumentExtension(file) {
  return cleanText(file?.name).split(".").at(-1)?.toLowerCase() || "";
}

function grantDocumentMimeType(file) {
  return grantDocumentTypes[grantDocumentExtension(file)] || "";
}

function grantDocumentPreviewKind(document = {}) {
  const mimeType = cleanText(document.mimeType).toLowerCase();
  const fileName = cleanText(document.fileName) || cleanText(document.storagePath);
  const extension = fileName.split("?")[0].split(".").at(-1)?.toLowerCase() || "";
  if (mimeType === "application/pdf" || extension === "pdf") return "pdf";
  if (mimeType.startsWith("image/") || ["jpg", "jpeg", "png", "webp"].includes(extension)) return "image";
  if (["text/plain", "text/csv"].includes(mimeType) || ["txt", "csv"].includes(extension)) return "text";
  return "";
}

function grantPreviewClickIsOutside(rect = {}, clientX = 0, clientY = 0) {
  return clientX < Number(rect.left)
    || clientX > Number(rect.right)
    || clientY < Number(rect.top)
    || clientY > Number(rect.bottom);
}

function grantDocumentFileError(file, maximumBytes = 20 * 1024 * 1024) {
  if (!file) return "Choose a file to upload.";
  if (!file.size) return "The selected file is empty.";
  if (file.size > maximumBytes) return "Choose a file smaller than 20 MB.";
  const expectedType = grantDocumentMimeType(file);
  if (!expectedType) {
    return "Choose a PDF, DOCX, XLSX, CSV, TXT, JPG, PNG, or WEBP file.";
  }
  if (file.type && file.type !== expectedType
    && !(expectedType === "image/jpeg" && file.type === "image/jpg")) {
    return "The file name and file type do not match. Save a fresh copy and try again.";
  }
  return "";
}

async function grantDocumentFileSignatureError(file) {
  if (!file?.slice || !grantDocumentMimeType(file)) return "The file could not be verified.";
  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const extension = grantDocumentExtension(file);
  const startsWith = (...values) => values.every((value, index) => bytes[index] === value);
  const ascii = String.fromCharCode(...bytes);
  const verified = extension === "pdf"
    ? ascii.startsWith("%PDF-")
    : ["docx", "xlsx"].includes(extension)
      ? startsWith(0x50, 0x4b, 0x03, 0x04)
      : ["jpg", "jpeg"].includes(extension)
        ? startsWith(0xff, 0xd8, 0xff)
        : extension === "png"
          ? startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
          : extension === "webp"
            ? ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP"
            : !bytes.includes(0);
  return verified ? "" : "The file contents do not match its file type. Save a fresh copy and try again.";
}

function grantDocumentsWithoutIndex(documents = [], documentIndex = -1) {
  return (Array.isArray(documents) ? documents : [])
    .filter((_document, index) => index !== Number(documentIndex));
}

function grantDocumentRows(items = [], organizationInfo = {}) {
  const organizationDocuments = (Array.isArray(organizationInfo.documents) ? organizationInfo.documents : [])
    .map((document, index) => ({
      id: `organization:${cleanText(document.id) || index}`,
      title: cleanText(document.title) || cleanText(document.name) || "Organization document",
      url: cleanText(document.url),
      category: cleanText(document.category) || cleanText(document.type) || "Organization",
      storagePath: cleanText(document.storagePath),
      fileName: cleanText(document.fileName),
      mimeType: cleanText(document.mimeType),
      fileSize: cleanInteger(document.fileSize),
      scope: "organization",
      documentIndex: index,
      grantId: "",
      grantTitle: "Organization"
    }));
  const grantDocuments = items.flatMap((item) =>
    (Array.isArray(item.documents) ? item.documents : []).map((document, index) => ({
      id: `grant:${item.id}:${cleanText(document.id) || index}`,
      title: cleanText(document.title) || cleanText(document.name) || "Grant document",
      url: cleanText(document.url),
      category: cleanText(document.category) || cleanText(document.type) || "Grant",
      storagePath: cleanText(document.storagePath),
      fileName: cleanText(document.fileName),
      mimeType: cleanText(document.mimeType),
      fileSize: cleanInteger(document.fileSize),
      scope: "grant",
      documentIndex: index,
      grantId: item.id,
      grantTitle: item.title
    }))
  );
  return [...organizationDocuments, ...grantDocuments];
}

function fundraisingDateRange(startValue, endValue) {
  const start = formatGrantDate(startValue, { short: true });
  const end = formatGrantDate(endValue, { short: true });
  if (start !== "-" && end !== "-") return `${start} - ${end}`;
  return start !== "-" ? `Starts ${start}` : end !== "-" ? `Ends ${end}` : "No dates set";
}

function donorPayload(values = {}) {
  const textFields = [
    "name",
    "status",
    "donorType",
    "email",
    "phone",
    "address",
    "preferredContact",
    "firstGiftDate",
    "lastGiftDate",
    "recurringFrequency",
    "campaignId",
    "campaignName",
    "acknowledgementStatus",
    "notes"
  ];
  const payload = Object.fromEntries(textFields.map((field) => [field, cleanText(values[field])]));
  payload.status ||= "Prospect";
  payload.donorType ||= "Individual";
  payload.lastGiftAmount = cleanNumber(values.lastGiftAmount);
  payload.lifetimeGiving = cleanNumber(values.lifetimeGiving);
  payload.recurringAmount = cleanNumber(values.recurringAmount);
  return payload;
}

function mapDonor(donor = {}) {
  const status = cleanText(donor.status) || "Prospect";
  const lastGift = formatGrantMoney(donor.lastGiftAmount);
  const lastGiftDate = formatGrantDate(donor.lastGiftDate, { short: true });
  const lastGiftSummary = lastGift !== "-"
    ? `${lastGift}${lastGiftDate !== "-" ? ` on ${lastGiftDate}` : ""}`
    : "No gifts recorded";
  const recurringAmount = formatGrantMoney(donor.recurringAmount);
  const recurringFrequency = cleanText(donor.recurringFrequency);

  return {
    id: cleanText(donor.id),
    kind: "donor",
    title: cleanText(donor.name) || "Unnamed donor",
    subtitle: `${cleanText(donor.donorType) || "Individual"} | ${lastGiftSummary}`,
    status,
    donorType: cleanText(donor.donorType) || "Individual",
    email: cleanText(donor.email) || "-",
    phone: cleanText(donor.phone) || "-",
    address: cleanText(donor.address) || "-",
    preferredContact: cleanText(donor.preferredContact) || "-",
    firstGiftDate: formatGrantDate(donor.firstGiftDate, { short: true }),
    firstGiftDateValue: cleanText(donor.firstGiftDate),
    lastGiftDate,
    lastGiftDateValue: cleanText(donor.lastGiftDate),
    lastGift: lastGiftSummary,
    lastGiftAmount: lastGift,
    lastGiftAmountValue: cleanNumber(donor.lastGiftAmount),
    lifetimeGiving: formatGrantMoney(donor.lifetimeGiving, "$0"),
    lifetimeGivingValue: cleanNumber(donor.lifetimeGiving),
    recurring: recurringAmount !== "-"
      ? `${recurringAmount}${recurringFrequency ? ` ${recurringFrequency}` : ""}`
      : "-",
    recurringAmount,
    recurringAmountValue: cleanNumber(donor.recurringAmount),
    recurringFrequency: recurringFrequency || "-",
    campaignId: cleanText(donor.campaignId),
    campaignName: cleanText(donor.campaignName) || "-",
    acknowledgementStatus: cleanText(donor.acknowledgementStatus) || "-",
    notes: cleanText(donor.notes) || "-",
    source: donor
  };
}

function mapDonors(donors = []) {
  return donors.map(mapDonor).sort((first, second) => first.title.localeCompare(second.title));
}

function donorsWithGiftRollups(donors = [], gifts = []) {
  const giftsByDonor = new Map();
  gifts.forEach((gift) => {
    const donorId = cleanText(gift.donorId);
    if (!donorId) return;
    const linked = giftsByDonor.get(donorId) || [];
    linked.push(gift);
    giftsByDonor.set(donorId, linked);
  });

  return donors.map((donor) => {
    const linked = giftsByDonor.get(cleanText(donor.id)) || [];
    if (!linked.length) return donor;
    const ordered = [...linked].sort((first, second) => cleanText(first.giftDate).localeCompare(cleanText(second.giftDate)));
    const firstGift = ordered[0];
    const lastGift = ordered.at(-1);
    const recurringGift = [...ordered].reverse().find((gift) => cleanBoolean(gift.recurring));
    return {
      ...donor,
      firstGiftDate: cleanText(firstGift.giftDate),
      lastGiftDate: cleanText(lastGift.giftDate),
      lastGiftAmount: cleanNumber(lastGift.amount),
      lifetimeGiving: linked.reduce((total, gift) => total + (cleanNumber(gift.amount) || 0), 0),
      recurringAmount: recurringGift ? cleanNumber(recurringGift.amount) : donor.recurringAmount,
      recurringFrequency: recurringGift
        ? cleanText(recurringGift.recurringFrequency)
        : donor.recurringFrequency
    };
  });
}

function donorMatches(item = {}, query = "") {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [
    item.title,
    item.status,
    item.donorType,
    item.email,
    item.phone,
    item.campaignName,
    item.notes
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function donorSummary(donors = []) {
  const lifetimeGiving = donors.reduce((total, donor) => total + (cleanNumber(donor.lifetimeGiving) || 0), 0);
  return [
    [String(donors.length), "Total Donors"],
    [String(donors.filter((donor) => ["Active", "Recurring"].includes(cleanText(donor.status))).length), "Active"],
    [String(donors.filter((donor) => cleanText(donor.status) === "Recurring").length), "Recurring"],
    [formatGrantMoney(lifetimeGiving, "$0"), "Lifetime Giving"]
  ];
}

function campaignPayload(values = {}) {
  const textFields = [
    "name",
    "status",
    "campaignType",
    "startDate",
    "endDate",
    "audience",
    "channels",
    "owner",
    "contactName",
    "contactEmail",
    "notes"
  ];
  const payload = Object.fromEntries(textFields.map((field) => [field, cleanText(values[field])]));
  payload.status ||= "Planning";
  payload.goalAmount = cleanNumber(values.goalAmount);
  payload.raisedAmount = cleanNumber(values.raisedAmount);
  return payload;
}

function mapCampaign(campaign = {}) {
  const goalValue = cleanNumber(campaign.goalAmount) || 0;
  const raisedValue = cleanNumber(campaign.raisedAmount) || 0;
  const remainingValue = Math.max(goalValue - raisedValue, 0);
  return {
    id: cleanText(campaign.id),
    kind: "campaign",
    title: cleanText(campaign.name) || "Unnamed campaign",
    subtitle: `${cleanText(campaign.campaignType) || "Campaign"} | ${fundraisingDateRange(campaign.startDate, campaign.endDate)}`,
    status: cleanText(campaign.status) || "Planning",
    campaignType: cleanText(campaign.campaignType) || "-",
    startDate: formatGrantDate(campaign.startDate, { short: true }),
    startDateValue: cleanText(campaign.startDate),
    endDate: formatGrantDate(campaign.endDate, { short: true }),
    endDateValue: cleanText(campaign.endDate),
    dateRange: fundraisingDateRange(campaign.startDate, campaign.endDate),
    goal: formatGrantMoney(goalValue, "$0"),
    goalValue,
    raised: formatGrantMoney(raisedValue, "$0"),
    raisedValue,
    remaining: formatGrantMoney(remainingValue, "$0"),
    remainingValue,
    audience: cleanText(campaign.audience) || "-",
    channels: cleanText(campaign.channels) || "-",
    owner: cleanText(campaign.owner) || "-",
    contactName: cleanText(campaign.contactName) || "-",
    contactEmail: cleanText(campaign.contactEmail) || "-",
    notes: cleanText(campaign.notes) || "-",
    source: campaign
  };
}

function mapCampaigns(campaigns = []) {
  return campaigns.map(mapCampaign).sort((first, second) => {
    const firstDate = cleanText(first.source.startDate) || "9999-99-99";
    const secondDate = cleanText(second.source.startDate) || "9999-99-99";
    return firstDate.localeCompare(secondDate) || first.title.localeCompare(second.title);
  });
}

function campaignsWithGiftRollups(campaigns = [], gifts = []) {
  const raisedByCampaign = new Map();
  const linkedCampaigns = new Set();
  gifts.forEach((gift) => {
    const campaignId = cleanText(gift.campaignId);
    if (!campaignId) return;
    linkedCampaigns.add(campaignId);
    const giftType = cleanText(gift.giftType).toLowerCase();
    const amount = giftType.includes("in-kind") || giftType.includes("in kind")
      ? 0
      : cleanNumber(gift.amount) || 0;
    raisedByCampaign.set(campaignId, (raisedByCampaign.get(campaignId) || 0) + amount);
  });

  return campaigns.map((campaign) => linkedCampaigns.has(cleanText(campaign.id))
    ? { ...campaign, raisedAmount: raisedByCampaign.get(cleanText(campaign.id)) || 0 }
    : campaign);
}

function campaignMatches(item = {}, query = "") {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [item.title, item.status, item.campaignType, item.audience, item.channels, item.owner, item.notes]
    .some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function campaignSummary(campaigns = []) {
  const totalGoal = campaigns.reduce((total, campaign) => total + (cleanNumber(campaign.goalAmount) || 0), 0);
  const totalRaised = campaigns.reduce((total, campaign) => total + (cleanNumber(campaign.raisedAmount) || 0), 0);
  return [
    [String(campaigns.filter((campaign) => cleanText(campaign.status) === "Active").length), "Active Campaigns"],
    [formatGrantMoney(totalGoal, "$0"), "Total Goal"],
    [formatGrantMoney(totalRaised, "$0"), "Raised"],
    [formatGrantMoney(Math.max(totalGoal - totalRaised, 0), "$0"), "Remaining"]
  ];
}

function giftPayload(values = {}) {
  return {
    donorId: cleanText(values.donorId),
    donorName: cleanText(values.donorName),
    campaignId: cleanText(values.campaignId),
    campaignName: cleanText(values.campaignName),
    giftDate: cleanText(values.giftDate),
    amount: cleanNumber(values.amount),
    giftType: cleanText(values.giftType) || "Individual Gift",
    paymentMethod: cleanText(values.paymentMethod),
    recurring: cleanBoolean(values.recurring),
    recurringFrequency: cleanText(values.recurringFrequency),
    acknowledgementStatus: cleanText(values.acknowledgementStatus),
    externalTransactionId: cleanText(values.externalTransactionId),
    notes: cleanText(values.notes)
  };
}

function mapGift(gift = {}) {
  const giftType = cleanText(gift.giftType) || "Individual Gift";
  const amountValue = cleanNumber(gift.amount);
  const giftDateValue = cleanText(gift.giftDate);
  const giftDate = formatGrantDate(giftDateValue, { short: true });
  const recurringFrequency = cleanText(gift.recurringFrequency);
  const recurring = cleanBoolean(gift.recurring);
  return {
    id: cleanText(gift.id),
    kind: "gift",
    title: cleanText(gift.donorName) || "Unnamed donor",
    subtitle: `${formatGrantMoney(amountValue, "$0")} | ${giftDate}`,
    status: giftType,
    donorId: cleanText(gift.donorId),
    donorName: cleanText(gift.donorName) || "-",
    campaignId: cleanText(gift.campaignId),
    campaignName: cleanText(gift.campaignName) || "-",
    giftDate,
    giftDateValue,
    amount: formatGrantMoney(amountValue, "$0"),
    amountValue,
    giftType,
    paymentMethod: cleanText(gift.paymentMethod) || "-",
    recurring: recurring ? `Yes${recurringFrequency ? ` | ${recurringFrequency}` : ""}` : "No",
    recurringValue: recurring,
    recurringFrequency: recurringFrequency || "-",
    acknowledgementStatus: cleanText(gift.acknowledgementStatus) || "-",
    externalTransactionId: cleanText(gift.externalTransactionId) || "-",
    notes: cleanText(gift.notes) || "-",
    source: gift
  };
}

function mapGifts(gifts = []) {
  return gifts.map(mapGift).sort((first, second) =>
    second.giftDateValue.localeCompare(first.giftDateValue) || first.title.localeCompare(second.title));
}

function giftMatches(item = {}, query = "") {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [
    item.title,
    item.giftType,
    item.campaignName,
    item.paymentMethod,
    item.acknowledgementStatus,
    item.externalTransactionId,
    item.notes
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function giftSummary(gifts = []) {
  const total = gifts.reduce((sum, gift) => sum + (cleanNumber(gift.amount) || 0), 0);
  const donorIds = new Set(gifts.map((gift) => cleanText(gift.donorId) || cleanText(gift.donorName).toLowerCase()).filter(Boolean));
  return [
    [String(gifts.length), "Gift Transactions"],
    [formatGrantMoney(total, "$0"), "Total Gifts"],
    [String(donorIds.size), "Donors"],
    [String(gifts.filter((gift) => cleanBoolean(gift.recurring)).length), "Recurring Gifts"]
  ];
}

function earnedIncomePayload(values = {}) {
  const textFields = [
    "name",
    "status",
    "source",
    "serviceType",
    "useOfFunds",
    "periodStart",
    "periodEnd",
    "dueDate",
    "paymentDate",
    "payerName",
    "contactName",
    "contactEmail",
    "reportingFrequency",
    "requiredMetrics",
    "risk",
    "notes"
  ];
  const payload = Object.fromEntries(textFields.map((field) => [field, cleanText(values[field])]));
  payload.status ||= "Planning";
  payload.amountBilled = cleanNumber(values.amountBilled);
  payload.amountReceived = cleanNumber(values.amountReceived);
  return payload;
}

function mapEarnedIncome(record = {}) {
  const billedValue = cleanNumber(record.amountBilled) || 0;
  const receivedValue = cleanNumber(record.amountReceived) || 0;
  const outstandingValue = Math.max(billedValue - receivedValue, 0);
  return {
    id: cleanText(record.id),
    kind: "earned-income",
    title: cleanText(record.name) || "Unnamed income source",
    subtitle: `${cleanText(record.source) || cleanText(record.serviceType) || "Income source"} | ${fundraisingDateRange(record.periodStart, record.periodEnd)}`,
    status: cleanText(record.status) || "Planning",
    sourceName: cleanText(record.source) || "-",
    serviceType: cleanText(record.serviceType) || "-",
    useOfFunds: cleanText(record.useOfFunds) || "-",
    periodStart: formatGrantDate(record.periodStart, { short: true }),
    periodStartValue: cleanText(record.periodStart),
    periodEnd: formatGrantDate(record.periodEnd, { short: true }),
    periodEndValue: cleanText(record.periodEnd),
    period: fundraisingDateRange(record.periodStart, record.periodEnd),
    dueDate: formatGrantDate(record.dueDate, { short: true }),
    dueDateValue: cleanText(record.dueDate),
    paymentDate: formatGrantDate(record.paymentDate, { short: true }),
    paymentDateValue: cleanText(record.paymentDate),
    billed: formatGrantMoney(billedValue, "$0"),
    billedValue,
    received: formatGrantMoney(receivedValue, "$0"),
    receivedValue,
    outstanding: formatGrantMoney(outstandingValue, "$0"),
    outstandingValue,
    payerName: cleanText(record.payerName) || "-",
    contactName: cleanText(record.contactName) || "-",
    contactEmail: cleanText(record.contactEmail) || "-",
    contact: [cleanText(record.contactName), cleanText(record.contactEmail)].filter(Boolean).join(" | ") || "-",
    reportingFrequency: cleanText(record.reportingFrequency) || "-",
    requiredMetrics: cleanText(record.requiredMetrics) || "-",
    risk: cleanText(record.risk) || "-",
    notes: cleanText(record.notes) || "-",
    source: record
  };
}

function mapEarnedIncomeRecords(records = []) {
  return records.map(mapEarnedIncome).sort((first, second) => {
    const firstDate = cleanText(first.source.dueDate) || "9999-99-99";
    const secondDate = cleanText(second.source.dueDate) || "9999-99-99";
    return firstDate.localeCompare(secondDate) || first.title.localeCompare(second.title);
  });
}

function earnedIncomeMatches(item = {}, query = "") {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [
    item.title,
    item.status,
    item.sourceName,
    item.serviceType,
    item.payerName,
    item.contact,
    item.notes
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function earnedIncomeSummary(records = []) {
  const billed = records.reduce((total, record) => total + (cleanNumber(record.amountBilled) || 0), 0);
  const received = records.reduce((total, record) => total + (cleanNumber(record.amountReceived) || 0), 0);
  const inactiveStatuses = new Set(["Paid", "Reconciled", "Closed"]);
  return [
    [String(records.filter((record) => !inactiveStatuses.has(cleanText(record.status))).length), "Active Sources"],
    [formatGrantMoney(billed, "$0"), "Billed"],
    [formatGrantMoney(received, "$0"), "Received"],
    [formatGrantMoney(Math.max(billed - received, 0), "$0"), "Outstanding"]
  ];
}

function financialActivityPayload(values = {}) {
  return {
    activityType: cleanText(values.activityType),
    transactionDate: cleanText(values.transactionDate),
    amount: cleanNumber(values.amount),
    sourceName: cleanText(values.sourceName),
    grantId: cleanText(values.grantId),
    grantName: cleanText(values.grantName),
    campaignId: cleanText(values.campaignId),
    campaignName: cleanText(values.campaignName),
    donorId: cleanText(values.donorId),
    donorName: cleanText(values.donorName),
    paymentMethod: cleanText(values.paymentMethod),
    externalTransactionId: cleanText(values.externalTransactionId),
    notes: cleanText(values.notes)
  };
}

function mapFinancialActivity(record = {}) {
  const amountValue = cleanNumber(record.amount) || 0;
  return {
    id: cleanText(record.id),
    sourceKind: cleanText(record.sourceKind),
    sourceRecordId: cleanText(record.sourceRecordId),
    activityType: cleanText(record.activityType) || "Other Income",
    transactionDate: formatGrantDate(record.transactionDate, { short: true }),
    transactionDateValue: cleanText(record.transactionDate),
    amount: formatGrantMoney(amountValue, "$0"),
    amountValue,
    sourceName: cleanText(record.sourceName) || "-",
    status: cleanText(record.status) || "Received",
    grantId: cleanText(record.grantId),
    grantName: cleanText(record.grantName),
    campaignId: cleanText(record.campaignId),
    campaignName: cleanText(record.campaignName),
    donorId: cleanText(record.donorId),
    donorName: cleanText(record.donorName),
    paymentMethod: cleanText(record.paymentMethod),
    externalTransactionId: cleanText(record.externalTransactionId),
    notes: cleanText(record.notes),
    includedInRevenue: record.includedInRevenue !== false,
    legacy: record.legacy === true,
    source: record
  };
}

function mapFinancialActivities(records = []) {
  return records.map(mapFinancialActivity).sort((first, second) => (
    second.transactionDateValue.localeCompare(first.transactionDateValue)
    || first.activityType.localeCompare(second.activityType)
    || first.id.localeCompare(second.id)
  ));
}

function financialActivityMatches(item = {}, query = "", activityType = "All Revenue") {
  if (activityType !== "All Revenue" && item.activityType !== activityType) return false;
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [
    item.activityType,
    item.sourceName,
    item.grantName,
    item.campaignName,
    item.donorName,
    item.paymentMethod,
    item.externalTransactionId,
    item.notes
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function financialActivityPeriod(referenceDate = new Date()) {
  const date = new Date(referenceDate);
  const year = date.getFullYear();
  const quarterStartMonth = Math.floor(date.getMonth() / 3) * 3;
  const dateKey = (value) => [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0")
  ].join("-");
  return {
    yearStart: `${year}-01-01`,
    yearEnd: `${year}-12-31`,
    quarterStart: dateKey(new Date(year, quarterStartMonth, 1)),
    quarterEnd: dateKey(new Date(year, quarterStartMonth + 3, 0))
  };
}

function financialActivityTotals(records = [], startDate = "", endDate = "") {
  const included = records.filter((record) => (
    record.includedInRevenue !== false
    && (!startDate || cleanText(record.transactionDateValue || record.transactionDate) >= startDate)
    && (!endDate || cleanText(record.transactionDateValue || record.transactionDate) <= endDate)
  ));
  const byType = included.reduce((totals, record) => {
    const type = cleanText(record.activityType) || "Other Income";
    totals[type] = Math.round(((totals[type] || 0) + (cleanNumber(record.amountValue ?? record.amount) || 0)) * 100) / 100;
    return totals;
  }, {});
  return {
    total: Math.round(included.reduce((sum, record) => sum + (cleanNumber(record.amountValue ?? record.amount) || 0), 0) * 100) / 100,
    count: included.length,
    byType
  };
}

function financialActivitySummary(records = [], referenceDate = new Date()) {
  const mapped = records.map((record) => record.amountValue === undefined ? mapFinancialActivity(record) : record);
  const period = financialActivityPeriod(referenceDate);
  const year = financialActivityTotals(mapped, period.yearStart, period.yearEnd);
  const quarter = financialActivityTotals(mapped, period.quarterStart, period.quarterEnd);
  return [
    [formatGrantMoney(year.total, "$0"), "Revenue YTD"],
    [formatGrantMoney(quarter.total, "$0"), "This Quarter"],
    [String(year.count), "Transactions YTD"],
    [formatGrantMoney(year.byType["Grant Revenue"] || 0, "$0"), "Grant Revenue YTD"]
  ];
}

export {
  campaignMatches,
  campaignPayload,
  campaignStatusOptions,
  campaignSummary,
  campaignsWithGiftRollups,
  donorMatches,
  donorPayload,
  donorStatusOptions,
  donorSummary,
  donorsWithGiftRollups,
  earnedIncomeMatches,
  earnedIncomePayload,
  earnedIncomeStatusOptions,
  earnedIncomeSummary,
  financialActivityMatches,
  financialActivityPayload,
  financialActivityPeriod,
  financialActivitySummary,
  financialActivityTotals,
  financialActivityTypeOptions,
  financialGiftActivityTypeOptions,
  giftMatches,
  giftPayload,
  giftPaymentMethodOptions,
  giftRecurringFrequencyOptions,
  giftSummary,
  giftTypeOptions,
  formatGrantDate,
  formatGrantMoney,
  fundraisingSummary,
  grantDeadlineItems,
  grantDeleteDecision,
  grantDocumentFileSignatureError,
  grantDocumentFileError,
  grantDocumentMimeType,
  grantDocumentPayload,
  grantDocumentPreviewKind,
  grantDocumentRows,
  grantDocumentsWithoutIndex,
  grantPreviewClickIsOutside,
  grantMatches,
  grantMovePayload,
  grantOrganizationInfoPayload,
  grantPayload,
  grantPipelineColumns,
  grantPipelineGroups,
  grantQuestionPayload,
  grantStatusOptions,
  grantTitle,
  mapGrantOrganizationInfo,
  mapGrantQuestions,
  mapCampaigns,
  mapDonors,
  mapEarnedIncomeRecords,
  mapFinancialActivities,
  mapGifts,
  mapGrant,
  mapGrants
};
