function cleanText(value) {
  return String(value ?? "").trim();
}

function clientName(client) {
  return [cleanText(client?.firstName), cleanText(client?.lastName)].filter(Boolean).join(" ") || "Unnamed client";
}

function formatClientDate(value) {
  const text = cleanText(value);
  if (!text) return "-";

  const dateOnly = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!dateOnly) return text;

  return `${Number(dateOnly[2])}/${Number(dateOnly[3])}/${dateOnly[1].slice(-2)}`;
}

function formatClientAddress(client) {
  return [
    cleanText(client?.addressStreet),
    cleanText(client?.addressCity),
    cleanText(client?.addressState),
    cleanText(client?.addressZip)
  ].filter(Boolean).join(", ") || "-";
}

function linkedSiblingProfiles(client, clientsById) {
  return (Array.isArray(client?.siblingIds) ? client.siblingIds : [])
    .map((id) => clientsById.get(id))
    .filter(Boolean)
    .map((sibling) => ({
      id: cleanText(sibling.id),
      name: clientName(sibling),
      section: "Clients"
    }))
    .filter((sibling) => sibling.id);
}

function linkedSiblingNames(client, clientsById) {
  const profiles = linkedSiblingProfiles(client, clientsById);
  return profiles.length ? profiles.map((profile) => profile.name).join(", ") : "-";
}

const lessonProgression = [
  ["Enroll", "#667085"],
  ["Nutrient Density", "#e23a4d"],
  ["Sugar", "#d27354"],
  ["Food Groups", "#f4c753"],
  ["Macronutrients", "#078b4d"],
  ["Micronutrients", "#039cbb"],
  ["Mindful Eating", "#004aad"],
  ["Healthy Habits", "#7a33c2"]
];

let clientStatusDefinitions = [
  { name: "Scheduled", color: "#078b4d" },
  { name: "Active", color: "#004aad" },
  { name: "Needs Reschedule", color: "#e23a4d" },
  { name: "Needs Language Support", color: "#7a33c2" },
  { name: "Waiting on Family", color: "#7a33c2" },
  { name: "Age Limit", color: "#d27354" },
  { name: "Graduated", color: "#f4c753" },
  { name: "Inactive", color: "#475467" },
  { name: "Closed", color: "#172033" }
];
let clientStatusOptions = clientStatusDefinitions.map((status) => status.name);
const preferredClientStatusSortOrder = [
  "Needs Reschedule",
  "Scheduled",
  "Active",
  "Needs Language Support",
  "Waiting on Family",
  "Age Limit",
  "Graduated",
  "Inactive",
  "Closed"
];

function clientStatusOrderFor(definitions) {
  const names = definitions.map((status) => status.name);
  return [
    ...preferredClientStatusSortOrder.filter((name) => names.includes(name)),
    ...names.filter((name) => !preferredClientStatusSortOrder.includes(name))
  ];
}

let clientStatusSortOrder = clientStatusOrderFor(clientStatusDefinitions);

function setCrmClientStatusDefinitions(definitions = []) {
  const next = Array.isArray(definitions)
    ? definitions.map((item) => ({ name: cleanText(item?.name), color: cleanText(item?.color) }))
      .filter((item) => item.name)
    : [];
  if (!next.length) return;
  clientStatusDefinitions = next;
  clientStatusOptions = next.map((status) => status.name);
  clientStatusSortOrder = clientStatusOrderFor(next);
}

const referralTypeOptions = [
  "Internal Clinic Referral",
  "External Clinic Referral",
  "Community Org Referral",
  "Nutrition Assessment",
  "Self Referral",
  "Outreach Event Interest",
  "Hosted Event/Class Interest",
  "Other"
];

const languageOptions = ["English", "Spanish", "Other"];
const preferredContactOptions = ["Phone Call", "Text", "Email"];

function crmStatusLabel(value) {
  const status = cleanText(value);
  return status === "Needs Reschedule" ? "Reschedule" : status;
}

function crmClientStatusRank(value) {
  const index = clientStatusSortOrder.indexOf(cleanText(value));
  return index < 0 ? clientStatusSortOrder.length : index;
}

function crmClientStatusTone(value) {
  const status = cleanText(value);
  if (status === "Needs Reschedule") return "red";
  if (status === "Scheduled") return "green";
  if (status === "Active") return "blue";
  if (["Needs Language Support", "Waiting on Family"].includes(status)) return "purple";
  if (status === "Graduated") return "yellow";
  return "navy";
}

function crmClientStatusColor(value) {
  return clientStatusDefinitions.find((status) => status.name === cleanText(value))?.color || "#475467";
}

function clientLessonIndex(value) {
  const lesson = cleanText(value).toLowerCase();
  if (!lesson) return -1;
  if (lesson === "enrollment" || lesson === "enroll") return 0;

  const numberedLesson = lesson.match(/^(?:lesson[-\s]?)?([1-7])$/);
  if (numberedLesson) return Number(numberedLesson[1]);

  return lessonProgression.findIndex(([label]) => label.toLowerCase() === lesson);
}

function clientLessonLabel(value, fallback = "No lesson assigned") {
  const index = clientLessonIndex(value);
  if (index === 0) return "Enrollment";
  return index > 0 ? lessonProgression[index][0] : cleanText(value) || fallback;
}

function clientLessonValue(index) {
  return index === 0 ? "enrollment" : index > 0 && index < lessonProgression.length ? `lesson-${index}` : "";
}

function clientLessonSteps(value) {
  const completedIndex = clientLessonIndex(value);
  const nextIndex = Math.min(completedIndex + 1, lessonProgression.length - 1);

  return lessonProgression.map(([label, color], index) => ({
    index,
    label,
    color,
    value: clientLessonValue(index),
    state: completedIndex >= 0 && index <= completedIndex
      ? "Done"
      : index === nextIndex
        ? "Next"
        : ""
  }));
}

function appointmentClientIds(appointment) {
  if (Array.isArray(appointment?.clientIds)) {
    return appointment.clientIds.filter(Boolean);
  }
  return appointment?.clientId ? [appointment.clientId] : [];
}

function appointmentClientNames(appointment) {
  if (Array.isArray(appointment?.clientNames)) {
    return appointment.clientNames.map(cleanText).filter(Boolean);
  }
  return appointment?.clientName ? [cleanText(appointment.clientName)] : [];
}

function appointmentBelongsToClient(appointment, client) {
  if (appointmentClientIds(appointment).includes(client?.id)) {
    return true;
  }

  const name = clientName(client).toLowerCase();
  return Boolean(name && appointmentClientNames(appointment).some((candidate) => candidate.toLowerCase() === name));
}

function crmAppointmentsForClient(client, appointments = []) {
  return appointments
    .filter((appointment) => appointmentBelongsToClient(appointment, client))
    .sort((first, second) =>
      `${second.appointmentDate || ""}T${second.appointmentTime || ""}`
        .localeCompare(`${first.appointmentDate || ""}T${first.appointmentTime || ""}`));
}

function crmActivityForClient(client, activityLogs = []) {
  return activityLogs
    .filter((activity) => activity?.relatedType === "client" && activity?.relatedId === client?.id)
    .sort((first, second) =>
      String(second.occurredAt || `${second.activityDate || ""}T${second.activityTime || ""}`)
        .localeCompare(String(first.occurredAt || `${first.activityDate || ""}T${first.activityTime || ""}`)));
}

function crmSiblingChanges(previousIds = [], selectedIds = []) {
  const previous = new Set(previousIds.map(cleanText).filter(Boolean));
  const selected = new Set(selectedIds.map(cleanText).filter(Boolean));

  return {
    additions: [...selected].filter((id) => !previous.has(id)),
    removals: [...previous].filter((id) => !selected.has(id))
  };
}

function crmActivityPayload(values = {}, item = {}, type = "Call") {
  const contactType = cleanText(type) || "Call";
  const direction = cleanText(values.direction) || "Outbound";

  return {
    direction,
    result: cleanText(values.result),
    activityDate: cleanText(values.activityDate),
    activityTime: cleanText(values.activityTime),
    description: cleanText(values.description),
    type: contactType,
    relatedType: "client",
    relatedId: cleanText(item.id),
    relatedName: cleanText(item.title),
    title: `${direction} ${contactType}`
  };
}

function crmAppointmentDescription(appointment = {}) {
  const lesson = clientLessonLabel(appointment.lesson, "");
  return [lesson, cleanText(appointment.appointmentType), cleanText(appointment.goal)]
    .filter(Boolean)
    .join(" | ") || "Appointment";
}

function crmAppointmentUrl(appointment = {}) {
  const query = new URLSearchParams({
    appointment: cleanText(appointment.id),
    date: cleanText(appointment.appointmentDate)
  });
  return `./schedule.html?${query}`;
}

function crmNewAppointmentUrl(item = {}) {
  const query = new URLSearchParams({
    client: cleanText(item.id),
    new: "1"
  });
  return `./schedule.html?${query}`;
}

function crmCloseDecision(pendingId, clientId) {
  const id = cleanText(clientId);
  if (!id) {
    return { pendingId: "", shouldClose: false };
  }
  if (cleanText(pendingId) !== id) {
    return { pendingId: id, shouldClose: false };
  }
  return { pendingId: "", shouldClose: true };
}

function crmStatusOptions(currentStatus = "") {
  const status = cleanText(currentStatus);
  const options = clientStatusOptions.filter((option) => option !== "Closed");
  return status === "Closed" ? [...options, "Closed"] : options;
}

function crmPreferredItemId(items = [], selectedId = "", requestedId = "") {
  const preferredId = cleanText(selectedId) || cleanText(requestedId);
  if (preferredId && items.some((item) => cleanText(item?.id) === preferredId)) {
    return preferredId;
  }

  return cleanText(items[0]?.id);
}

function crmLessonIsCurrent(currentValue, nextValue) {
  const currentIndex = clientLessonIndex(currentValue);
  const nextIndex = clientLessonIndex(nextValue);
  if (currentIndex >= 0 || nextIndex >= 0) {
    return currentIndex === nextIndex;
  }
  return cleanText(currentValue).toLowerCase() === cleanText(nextValue).toLowerCase();
}

function earliestDate(values) {
  return values.map(cleanText).filter(Boolean).sort()[0] || "";
}

function latestDate(values) {
  return values.map(cleanText).filter(Boolean).sort().at(-1) || "";
}

function providerProfileLinks(providerLinks = []) {
  return providerLinks
    .map((link) => {
      const provider = cleanText(link?.providerName);
      const organization = cleanText(link?.organizationName);
      const label = provider && organization ? `${provider} (${organization})` : provider || organization;
      return {
        networkId: cleanText(link?.networkId),
        providerId: cleanText(link?.providerId),
        label
      };
    })
    .filter((link) => link.label);
}

function providerProfileSummary(providerLinks = []) {
  const profiles = providerProfileLinks(providerLinks);
  return profiles.length ? profiles.map((profile) => profile.label).join(", ") : "-";
}

function caregiverFirstName(value) {
  return cleanText(value).split(/\s+/)[0] || "-";
}

function mapCrmClient(client, clientsById = new Map(), options = {}) {
  const status = cleanText(client?.status) || "Active";
  const appointments = crmAppointmentsForClient(client, options.appointments);
  const activityLogs = crmActivityForClient(client, options.activityLogs);
  const appointmentDates = appointments.map((appointment) => appointment.appointmentDate);
  const activityDates = activityLogs.map((activity) => activity.activityDate);
  const recentDate = latestDate([
    ...appointmentDates,
    client?.mostRecentAppointmentDate,
    client?.lastAppointmentDate,
    client?.firstAppointmentDate
  ]);
  const firstAppointmentDate = earliestDate([...appointmentDates, client?.firstAppointmentDate]);
  const recentContactDate = latestDate([
    ...activityDates,
    client?.mostRecentContactDate,
    client?.firstContactDate,
    client?.referralDate
  ]);
  const convertedDate = client?.convertedAt || (client?.sourceReferralId ? client?.createdAt : "");
  const lesson = clientLessonLabel(client?.currentLesson);
  const providerLinks = Array.isArray(client?.providerLinks) ? client.providerLinks : [];
  const siblingProfiles = linkedSiblingProfiles(client, clientsById);
  const referringProviderProfiles = providerProfileLinks(providerLinks);
  const possibleMatchProfiles = (Array.isArray(client?.publicPossibleMatchIds) ? client.publicPossibleMatchIds : [])
    .map((id) => clientsById.get(id))
    .filter(Boolean)
    .map((candidate) => ({
      id: cleanText(candidate.id),
      name: clientName(candidate),
      section: "Clients",
      detail: [formatClientDate(candidate.dateOfBirth), cleanText(candidate.parentName), cleanText(candidate.phone)]
        .filter((value) => value && value !== "-")
        .join(" | ")
    }));
  const recentContact = formatClientDate(recentContactDate);
  const phone = cleanText(client?.phone) || "-";
  const caregiver = cleanText(client?.parentName) || "-";
  const language = cleanText(client?.preferredLanguage) || "-";

  return {
    id: cleanText(client?.id),
    title: clientName(client),
    subtitle: `${recentContact} | ${phone} | ${caregiverFirstName(caregiver)} | ${language}`,
    status,
    statusTone: crmClientStatusTone(status),
    statusColor: crmClientStatusColor(status),
    caregiver,
    siblings: linkedSiblingNames(client, clientsById),
    siblingProfiles,
    language,
    phone,
    email: cleanText(client?.email) || "-",
    emailOptOut: client?.emailOptOut === true ? "Yes" : "No",
    textOptOut: client?.textOptOut === true ? "Yes" : "No",
    serviceEmailConsent: client?.serviceEmailConsent === true ? "Yes" : "No",
    serviceTextConsent: client?.serviceTextConsent === true ? "Yes" : "No",
    marketingConsent: client?.marketingConsent === true ? "Yes" : "No",
    consentSource: cleanText(client?.consentSource) || "-",
    consentDate: formatClientDate(client?.consentDate),
    preferredContact: cleanText(client?.preferredContactMethod) || "-",
    address: formatClientAddress(client),
    gender: cleanText(client?.gender) || "-",
    recentContact,
    firstContact: formatClientDate(client?.firstContactDate),
    referralDate: formatClientDate(client?.referralDate),
    convertedDate: formatClientDate(convertedDate),
    referralType: cleanText(client?.referralType) || "-",
    dob: formatClientDate(client?.dateOfBirth),
    graduationDate: formatClientDate(client?.graduationDate) === "-"
      ? "Not graduated"
      : formatClientDate(client?.graduationDate),
    insurance: client?.ycco === true ? "YCCO" : client?.ycco === false ? "Not YCCO" : "Not listed",
    yccoId: cleanText(client?.yccoId) || "-",
    hrsn: client?.hrsn === true ? "Eligible" : client?.hrsn === false ? "Not Eligible" : "Not listed",
    firstAppt: formatClientDate(firstAppointmentDate),
    recentAppt: formatClientDate(recentDate),
    stage: status,
    nextLesson: lesson,
    providerProfiles: providerProfileSummary(providerLinks),
    providerProfileLinks: referringProviderProfiles,
    possibleMatchProfiles,
    referralSource: cleanText(client?.referralSource || client?.referralType) || "-",
    notes: cleanText(client?.notes) || "-",
    lessonSteps: clientLessonSteps(client?.currentLesson),
    appointments,
    activityLogs,
    source: client
  };
}

function mapCrmClients(clients = [], options = {}) {
  const clientsById = new Map(clients.map((client) => [client.id, client]));

  return clients
    .map((client) => mapCrmClient(client, clientsById, options))
    .sort((first, second) => crmClientStatusRank(first.status) - crmClientStatusRank(second.status)
      || first.title.localeCompare(second.title));
}

function crmClientMatches(item, query) {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;

  return [
    item?.title,
    item?.status,
    item?.caregiver,
    item?.siblings,
    item?.language,
    item?.phone,
    item?.preferredContact,
    item?.address,
    item?.nextLesson,
    item?.referralType,
    item?.referralSource,
    item?.providerProfiles,
    item?.insurance,
    item?.hrsn,
    item?.email,
    item?.source?.email
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function crmClientPayload(values = {}) {
  const textFields = [
    "firstName",
    "lastName",
    "parentName",
    "dateOfBirth",
    "gender",
    "phone",
    "email",
    "preferredLanguage",
    "preferredContactMethod",
    "referralType",
    "referralSource",
    "referralDate",
    "firstContactDate",
    "mostRecentContactDate",
    "firstAppointmentDate",
    "mostRecentAppointmentDate",
    "lastAppointmentDate",
    "graduationDate",
    "currentLesson",
    "addressStreet",
    "addressCity",
    "addressState",
    "addressZip",
    "consentSource",
    "consentDate",
    "yccoId",
    "notes",
    "status"
  ];
  const payload = Object.fromEntries(
    textFields
      .filter((field) => Object.hasOwn(values, field))
      .map((field) => [field, cleanText(values[field])])
  );

  for (const field of ["ycco", "hrsn", "emailOptOut", "textOptOut", "serviceEmailConsent", "serviceTextConsent", "marketingConsent"]) {
    if (Object.hasOwn(values, field)) {
      payload[field] = values[field] === true || values[field] === "true" || values[field] === "on";
    }
  }

  for (const field of ["assessmentScore", "willingnessScore"]) {
    if (Object.hasOwn(values, field)) {
      const value = cleanText(values[field]);
      payload[field] = value === "" ? null : Number(value);
    }
  }

  if (Array.isArray(values.providerLinks)) {
    payload.providerLinks = values.providerLinks;
  }

  return payload;
}

function crmSummary(items = []) {
  const count = (status) => items.filter((item) => item.status === status).length;

  return [
    [String(count("Needs Reschedule")), "Reschedule"],
    [String(count("Scheduled")), "Scheduled"],
    [String(count("Active")), "Active"],
    [String(count("Waiting on Family")), "Waiting on Family"]
  ];
}

export {
  clientLessonValue,
  clientLessonIndex,
  clientLessonLabel,
  clientLessonSteps,
  clientName,
  clientStatusOptions,
  crmActivityPayload,
  crmActivityForClient,
  crmAppointmentDescription,
  crmAppointmentUrl,
  crmAppointmentsForClient,
  crmClientMatches,
  crmClientPayload,
  crmClientStatusRank,
  crmClientStatusColor,
  crmClientStatusTone,
  crmCloseDecision,
  crmLessonIsCurrent,
  crmNewAppointmentUrl,
  crmPreferredItemId,
  crmSiblingChanges,
  crmStatusLabel,
  crmStatusOptions,
  setCrmClientStatusDefinitions,
  crmSummary,
  formatClientAddress,
  formatClientDate,
  languageOptions,
  lessonProgression,
  mapCrmClient,
  mapCrmClients,
  preferredContactOptions,
  referralTypeOptions
};
