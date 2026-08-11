import {
  clientName,
  formatClientAddress,
  formatClientDate,
  referralTypeOptions
} from "./crm.js";

function cleanText(value) {
  return String(value ?? "").trim();
}

const referralStatusOptions = [
  "New",
  "Texted",
  "Left Voicemail",
  "Emailed",
  "Requested Call Back",
  "Scheduled",
  "Caregiver Will Call Back",
  "Not Interested",
  "Closed / No Further Outreach"
];
const referralStatusSortOrder = [
  "New",
  "Texted",
  "Left Voicemail",
  "Emailed",
  "Requested Call Back",
  "Scheduled",
  "Caregiver Will Call Back",
  "Not Interested",
  "Closed / No Further Outreach"
];

function crmReferralStatusRank(value) {
  const index = referralStatusSortOrder.indexOf(cleanText(value));
  return index < 0 ? referralStatusSortOrder.length : index;
}

function crmReferralStatusTone(value) {
  const status = cleanText(value);
  if (status === "New") return "red";
  if (["Texted", "Left Voicemail", "Emailed", "Requested Call Back"].includes(status)) return "green";
  if (status === "Scheduled") return "blue";
  if (status === "Caregiver Will Call Back") return "purple";
  return "navy";
}

const referralNetworkTypeOptions = [
  "Clinic",
  "Healthcare",
  "School",
  "Community Organization",
  "Government",
  "Other"
];

function linkedReferralSiblingProfiles(referral, referralsById) {
  return (Array.isArray(referral?.siblingIds) ? referral.siblingIds : [])
    .map((id) => referralsById.get(id))
    .filter(Boolean)
    .map((sibling) => ({
      id: cleanText(sibling.id),
      name: clientName(sibling),
      section: "Referrals"
    }))
    .filter((sibling) => sibling.id);
}

function linkedReferralSiblingNames(referral, referralsById) {
  const profiles = linkedReferralSiblingProfiles(referral, referralsById);
  return profiles.length ? profiles.map((profile) => profile.name).join(", ") : "-";
}

function referralActivity(referral, activityLogs = []) {
  return activityLogs
    .filter((activity) => activity?.relatedType === "referral" && activity?.relatedId === referral?.id)
    .sort((first, second) =>
      String(second.occurredAt || `${second.activityDate || ""}T${second.activityTime || ""}`)
        .localeCompare(String(first.occurredAt || `${first.activityDate || ""}T${first.activityTime || ""}`)));
}

function latestDate(values) {
  return values.map(cleanText).filter(Boolean).sort().at(-1) || "";
}

function referralProviderProfiles(providerLinks = []) {
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

function providerSummary(providerLinks = []) {
  const profiles = referralProviderProfiles(providerLinks);
  return profiles.length ? profiles.map((profile) => profile.label).join(", ") : "-";
}

function caregiverFirstName(value) {
  return cleanText(value).split(/\s+/)[0] || "-";
}

function mapCrmReferral(referral, referralsById = new Map(), options = {}) {
  const activityLogs = referralActivity(referral, options.activityLogs);
  const recentContactDate = latestDate([
    ...activityLogs.map((activity) => activity.activityDate),
    referral?.mostRecentContactDate,
    referral?.firstContactDate,
    referral?.referralDate
  ]);
  const convertedDate = referral?.convertedAt || "";
  const providerLinks = Array.isArray(referral?.providerLinks) ? referral.providerLinks : [];
  const siblingProfiles = linkedReferralSiblingProfiles(referral, referralsById);
  const referringProviderProfiles = referralProviderProfiles(providerLinks);
  const recentContact = formatClientDate(recentContactDate);
  const phone = cleanText(referral?.phone) || "-";
  const caregiver = cleanText(referral?.parentName) || "-";
  const language = cleanText(referral?.preferredLanguage) || "-";

  return {
    id: cleanText(referral?.id),
    title: clientName(referral),
    subtitle: `${recentContact} | ${phone} | ${caregiverFirstName(caregiver)} | ${language}`,
    status: cleanText(referral?.status) || "New",
    statusTone: crmReferralStatusTone(referral?.status || "New"),
    caregiver,
    siblings: linkedReferralSiblingNames(referral, referralsById),
    siblingProfiles,
    language,
    phone,
    email: cleanText(referral?.email) || "-",
    address: formatClientAddress(referral),
    preferredContact: cleanText(referral?.preferredContactMethod) || "-",
    gender: cleanText(referral?.gender) || "-",
    dob: formatClientDate(referral?.dateOfBirth),
    insurance: referral?.ycco === true ? "YCCO" : referral?.ycco === false ? "Not YCCO" : "Not listed",
    yccoId: cleanText(referral?.yccoId) || "-",
    hrsn: referral?.hrsn === true ? "Eligible" : referral?.hrsn === false ? "Not Eligible" : "Not listed",
    referralDate: formatClientDate(referral?.referralDate),
    firstContact: formatClientDate(referral?.firstContactDate),
    recentContact,
    firstAppt: formatClientDate(referral?.firstAppointmentDate),
    recentAppt: formatClientDate(referral?.mostRecentAppointmentDate || referral?.lastAppointmentDate),
    convertedDate: formatClientDate(convertedDate),
    referralType: cleanText(referral?.referralType) || "-",
    referralSource: cleanText(referral?.referralSource) || "-",
    providerProfiles: providerSummary(providerLinks),
    providerProfileLinks: referringProviderProfiles,
    emailOptOut: referral?.emailOptOut === true ? "Yes" : "No",
    textOptOut: referral?.textOptOut === true ? "Yes" : "No",
    serviceEmailConsent: referral?.serviceEmailConsent === true ? "Yes" : "No",
    serviceTextConsent: referral?.serviceTextConsent === true ? "Yes" : "No",
    marketingConsent: referral?.marketingConsent === true ? "Yes" : "No",
    consentSource: cleanText(referral?.consentSource) || "-",
    consentDate: formatClientDate(referral?.consentDate),
    notes: cleanText(referral?.notes) || "-",
    convertedClientId: cleanText(referral?.convertedClientId),
    activityLogs,
    source: referral
  };
}

function mapCrmReferrals(referrals = [], options = {}) {
  const activeReferrals = referrals.filter((referral) => !cleanText(referral?.convertedClientId));
  const referralsById = new Map(activeReferrals.map((referral) => [referral.id, referral]));
  return activeReferrals
    .map((referral) => mapCrmReferral(referral, referralsById, options))
    .sort((first, second) => crmReferralStatusRank(first.status) - crmReferralStatusRank(second.status)
      || first.title.localeCompare(second.title));
}

function crmReferralMatches(item, query) {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;

  return [
    item?.title,
    item?.status,
    item?.caregiver,
    item?.siblings,
    item?.language,
    item?.phone,
    item?.email,
    item?.address,
    item?.preferredContact,
    item?.referralType,
    item?.referralSource,
    item?.providerProfiles
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function crmReferralSummary(items = []) {
  const inContactStatuses = new Set([
    "Texted",
    "Left Voicemail",
    "Emailed",
    "Requested Call Back",
    "Caregiver Will Call Back"
  ]);
  const closedStatuses = new Set(["Not Interested", "Closed / No Further Outreach"]);

  return [
    [String(items.filter((item) => item.status === "New").length), "New"],
    [String(items.filter((item) => inContactStatuses.has(item.status)).length), "In Contact"],
    [String(items.filter((item) => item.status === "Scheduled").length), "Scheduled"],
    [String(items.filter((item) => closedStatuses.has(item.status)).length), "Closed"]
  ];
}

function crmReferralPayload(values = {}) {
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

  if (Array.isArray(values.providerLinks)) {
    payload.providerLinks = values.providerLinks
      .map((link) => ({
        networkId: cleanText(link?.networkId),
        providerId: cleanText(link?.providerId),
        organizationName: cleanText(link?.organizationName),
        providerName: cleanText(link?.providerName)
      }))
      .filter((link) => link.networkId && link.providerId);
  }

  return payload;
}

function crmReferralActivityPayload(values = {}, item = {}, type = "Call") {
  const contactType = cleanText(type) || "Call";
  const direction = cleanText(values.direction) || "Outbound";
  return {
    direction,
    result: cleanText(values.result),
    activityDate: cleanText(values.activityDate),
    activityTime: cleanText(values.activityTime),
    description: cleanText(values.description),
    type: contactType,
    relatedType: "referral",
    relatedId: cleanText(item.id),
    relatedName: cleanText(item.title),
    title: `${direction} ${contactType}`
  };
}

function crmConfirmDecision(pendingId, itemId) {
  const id = cleanText(itemId);
  if (!id) return { pendingId: "", confirmed: false };
  if (cleanText(pendingId) !== id) return { pendingId: id, confirmed: false };
  return { pendingId: "", confirmed: true };
}

function crmReferralProviderLinks(selectedProviderIds = [], networkEntries = [], organizationId = "") {
  const selected = new Set(selectedProviderIds.map(cleanText).filter(Boolean));
  const selectedOrganizationId = cleanText(organizationId);
  return networkEntries
    .filter((entry) => !selectedOrganizationId || cleanText(entry?.id) === selectedOrganizationId)
    .flatMap((entry) =>
    (Array.isArray(entry?.providers) ? entry.providers : [])
      .filter((provider) => selected.has(provider.id))
      .map((provider) => ({
        networkId: cleanText(entry.id),
        providerId: cleanText(provider.id),
        organizationName: cleanText(entry.name),
        providerName: cleanText(provider.name)
      })));
}

function mapCrmNetworkEntry(entry = {}) {
  const providers = Array.isArray(entry.providers) ? entry.providers : [];
  const providerCount = providers.length;
  return {
    id: cleanText(entry.id),
    title: cleanText(entry.name) || "Unnamed organization",
    subtitle: cleanText(entry.type) || "Referral partner",
    status: `${providerCount} ${providerCount === 1 ? "provider" : "providers"}`,
    type: cleanText(entry.type) || "-",
    contactName: cleanText(entry.contactName) || "-",
    phone: cleanText(entry.phone) || "-",
    email: cleanText(entry.email) || "-",
    website: cleanText(entry.website) || "-",
    providerCount: String(providerCount),
    notes: cleanText(entry.notes) || "-",
    providers,
    source: entry
  };
}

function mapCrmNetworkEntries(entries = []) {
  return entries.map(mapCrmNetworkEntry).sort((first, second) => first.title.localeCompare(second.title));
}

function crmNetworkMatches(item, query) {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [
    item?.title,
    item?.type,
    item?.contactName,
    item?.phone,
    item?.email,
    item?.website,
    ...(item?.providers || []).flatMap((provider) => [provider.name, provider.email, provider.notes])
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function crmNetworkSummary(items = []) {
  return [
    [String(items.length), "Organizations"],
    [String(items.reduce((total, item) => total + item.providers.length, 0)), "Providers"],
    [String(items.filter((item) => cleanText(item.source?.email)).length), "With Email"],
    [String(items.filter((item) => cleanText(item.source?.phone)).length), "With Phone"]
  ];
}

function crmNetworkPayload(values = {}) {
  const payload = Object.fromEntries(
    ["name", "type", "contactName", "phone", "email", "website", "notes"]
      .filter((field) => Object.hasOwn(values, field))
      .map((field) => [field, cleanText(values[field])])
  );

  if (Array.isArray(values.providers)) {
    payload.providers = values.providers
      .map((provider) => ({
        id: cleanText(provider?.id),
        name: cleanText(provider?.name),
        email: cleanText(provider?.email),
        notes: cleanText(provider?.notes)
      }))
      .filter((provider) => provider.name);
  }

  return payload;
}

export {
  crmConfirmDecision,
  crmNetworkMatches,
  crmNetworkPayload,
  crmNetworkSummary,
  crmReferralActivityPayload,
  crmReferralStatusRank,
  crmReferralStatusTone,
  crmReferralMatches,
  crmReferralPayload,
  crmReferralProviderLinks,
  crmReferralSummary,
  mapCrmNetworkEntries,
  mapCrmNetworkEntry,
  mapCrmReferral,
  mapCrmReferrals,
  referralNetworkTypeOptions,
  referralStatusOptions,
  referralTypeOptions
};
