function cleanText(value) {
  return String(value ?? "").trim();
}

function cleanNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.round(number * 100) / 100) : null;
}

const marketingStatusOptions = [
  "Draft",
  "Planned",
  "Ready for Review",
  "Scheduled",
  "Sent",
  "Paused",
  "Archived"
];

const marketingCampaignTypeOptions = [
  "General Campaign",
  "Email",
  "Newsletter",
  "Google Ad Grant",
  "Print",
  "Website"
];

const marketingChannelOptions = [
  "Email",
  "Google Ads",
  "Website",
  "Print",
  "Social Media"
];

const marketingCampaignFilterOptions = [
  "All Campaigns",
  "Email",
  "Newsletter",
  "Google Ads",
  "Website",
  "Print",
  "Social Media"
];

const marketingSubscriberStatusOptions = [
  "Consent Needed",
  "Active",
  "Unsubscribed",
  "Bounced",
  "Complained",
  "Do Not Contact"
];

const marketingCommunicationPreferenceOptions = [
  "Email",
  "Text",
  "Mail",
  "No Preference",
  "No Contact"
];

const defaultMarketingAudienceGroups = [
  "Newsletter",
  "Cooking Classes",
  "Volunteers",
  "Community Partners"
];

function formatMarketingDate(value) {
  const text = cleanText(value);
  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return text || "-";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function formatMarketingNumber(value) {
  const number = cleanNumber(value);
  return number === null ? "-" : new Intl.NumberFormat("en-US").format(number);
}

function formatMarketingRate(numerator, denominator) {
  const top = cleanNumber(numerator) || 0;
  const bottom = cleanNumber(denominator) || 0;
  if (!bottom) return "-";
  return `${Math.round((top / bottom) * 1000) / 10}%`;
}

function formatMarketingDateTime(value) {
  const text = cleanText(value);
  if (!text) return "-";
  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function marketingCampaignPayload(values = {}) {
  const textFields = [
    "name",
    "status",
    "campaignType",
    "channel",
    "owner",
    "startDate",
    "sendDate",
    "endDate",
    "subject",
    "preheader",
    "goal",
    "callToAction",
    "language",
    "audience",
    "audienceSource",
    "consentRule",
    "deliveryTool",
    "sendWindow",
    "metric",
    "nextStep",
    "notes",
    "externalCampaignId"
  ];
  const payload = Object.fromEntries(textFields.map((field) => [field, cleanText(values[field])]));
  payload.status ||= "Draft";
  payload.campaignType ||= "General Campaign";
  payload.channel ||= "Email";
  payload.audienceCount = cleanNumber(values.audienceCount);
  payload.sentCount = cleanNumber(values.sentCount);
  payload.openCount = cleanNumber(values.openCount);
  payload.clickCount = cleanNumber(values.clickCount);
  payload.conversionCount = cleanNumber(values.conversionCount);
  payload.impressions = cleanNumber(values.impressions);
  payload.spend = cleanNumber(values.spend);
  return payload;
}

function marketingCampaignSubtitle(campaign = {}) {
  const date = formatMarketingDate(campaign.sendDate || campaign.startDate);
  const parts = [cleanText(campaign.campaignType) || "General Campaign"];
  if (date !== "-") parts.push(date);
  else if (cleanText(campaign.channel)) parts.push(cleanText(campaign.channel));
  return parts.join(" | ");
}

function marketingCampaignChannel(campaign = {}) {
  const channel = cleanText(campaign.channel) || "Email";
  return channel === "Newsletter" ? "Email" : channel;
}

function mapMarketingCampaign(campaign = {}) {
  const sentValue = cleanNumber(campaign.sentCount) || 0;
  const openValue = cleanNumber(campaign.openCount) || 0;
  const clickValue = cleanNumber(campaign.clickCount) || 0;
  const conversionValue = cleanNumber(campaign.conversionCount) || 0;
  return {
    id: cleanText(campaign.id),
    kind: "marketing-campaign",
    title: cleanText(campaign.name) || "Unnamed Campaign",
    subtitle: marketingCampaignSubtitle(campaign),
    status: cleanText(campaign.status) || "Draft",
    campaignType: cleanText(campaign.campaignType) || "General Campaign",
    channel: marketingCampaignChannel(campaign),
    owner: cleanText(campaign.owner) || "-",
    startDate: formatMarketingDate(campaign.startDate),
    sendDate: formatMarketingDate(campaign.sendDate),
    endDate: formatMarketingDate(campaign.endDate),
    subject: cleanText(campaign.subject) || "-",
    preheader: cleanText(campaign.preheader) || "-",
    goal: cleanText(campaign.goal) || "-",
    callToAction: cleanText(campaign.callToAction) || "-",
    language: cleanText(campaign.language) || "-",
    audience: cleanText(campaign.audience) || "-",
    audienceCount: formatMarketingNumber(campaign.audienceCount),
    audienceCountValue: cleanNumber(campaign.audienceCount) || 0,
    audienceSource: cleanText(campaign.audienceSource) || "-",
    consentRule: cleanText(campaign.consentRule) || "-",
    deliveryTool: cleanText(campaign.deliveryTool) || "-",
    sendWindow: cleanText(campaign.sendWindow) || "-",
    metric: cleanText(campaign.metric) || "-",
    nextStep: cleanText(campaign.nextStep) || "-",
    notes: cleanText(campaign.notes) || "-",
    sentCount: formatMarketingNumber(campaign.sentCount),
    sentCountValue: sentValue,
    openCount: formatMarketingNumber(campaign.openCount),
    openCountValue: openValue,
    clickCount: formatMarketingNumber(campaign.clickCount),
    clickCountValue: clickValue,
    conversionCount: formatMarketingNumber(campaign.conversionCount),
    conversionCountValue: conversionValue,
    impressions: formatMarketingNumber(campaign.impressions),
    impressionsValue: cleanNumber(campaign.impressions) || 0,
    spend: campaign.spend === null || campaign.spend === undefined || campaign.spend === ""
      ? "-"
      : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cleanNumber(campaign.spend) || 0),
    spendValue: cleanNumber(campaign.spend) || 0,
    openRate: formatMarketingRate(openValue, sentValue),
    clickRate: formatMarketingRate(clickValue, sentValue),
    externalCampaignId: cleanText(campaign.externalCampaignId) || "-",
    source: campaign
  };
}

function mapMarketingCampaigns(campaigns = []) {
  return campaigns.map(mapMarketingCampaign).sort((first, second) => {
    const firstDate = cleanText(first.source.sendDate || first.source.startDate) || "9999-99-99";
    const secondDate = cleanText(second.source.sendDate || second.source.startDate) || "9999-99-99";
    return firstDate.localeCompare(secondDate) || first.title.localeCompare(second.title);
  });
}

function marketingCampaignMatches(item = {}, query = "") {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [
    item.title,
    item.status,
    item.campaignType,
    item.channel,
    item.owner,
    item.subject,
    item.goal,
    item.audience,
    item.notes
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function marketingCampaignHasResults(item = {}) {
  return cleanText(item.status) === "Sent" || [
    item.sentCountValue,
    item.openCountValue,
    item.clickCountValue,
    item.conversionCountValue,
    item.impressionsValue,
    item.spendValue
  ].some((value) => (cleanNumber(value) || 0) > 0);
}

function marketingCampaignsForFilter(items = [], filter = "All Campaigns") {
  const selected = cleanText(filter) || "All Campaigns";
  if (selected === "All Campaigns") return items;
  if (selected === "Newsletter") {
    return items.filter((item) => item.campaignType === "Newsletter");
  }
  if (selected === "Email") {
    return items.filter((item) => item.channel === "Email" && item.campaignType !== "Newsletter");
  }
  if (selected === "Google Ads") {
    return items.filter((item) => item.channel === "Google Ads" || item.campaignType === "Google Ad Grant");
  }
  return items.filter((item) => item.channel === selected || item.campaignType === selected);
}

function marketingCampaignsForSubpage(items = [], subpage = "Campaigns") {
  if (subpage === "Email") {
    return marketingCampaignsForFilter(items, "Email");
  }
  if (subpage === "Newsletter") {
    return marketingCampaignsForFilter(items, "Newsletter");
  }
  if (subpage === "Ad Grants") {
    return marketingCampaignsForFilter(items, "Google Ads");
  }
  if (subpage === "Analytics") {
    return items.filter(marketingCampaignHasResults);
  }
  return items;
}

function marketingSummary(items = [], subpage = "Campaigns") {
  const visible = marketingCampaignsForSubpage(items, subpage);
  if (subpage === "Analytics") {
    const delivered = visible.filter((item) => item.sentCountValue > 0);
    const sent = delivered.reduce((total, item) => total + item.sentCountValue, 0);
    const opened = delivered.reduce((total, item) => total + item.openCountValue, 0);
    const clicked = delivered.reduce((total, item) => total + item.clickCountValue, 0);
    const conversions = visible.reduce((total, item) => total + item.conversionCountValue, 0);
    return [
      [formatMarketingNumber(sent), "Sent"],
      [formatMarketingRate(opened, sent), "Open Rate"],
      [formatMarketingRate(clicked, sent), "Click Rate"],
      [formatMarketingNumber(conversions), "Conversions"]
    ];
  }

  const active = visible.filter((item) => !["Sent", "Archived"].includes(item.status)).length;
  const scheduled = visible.filter((item) => item.status === "Scheduled").length;
  const sent = visible.filter((item) => item.status === "Sent").length;
  const audience = visible.reduce((maximum, item) => Math.max(maximum, item.audienceCountValue), 0);
  return [
    [String(active), "Active"],
    [String(scheduled), "Scheduled"],
    [String(sent), "Sent"],
    [formatMarketingNumber(audience), "Largest Audience"]
  ];
}

function marketingDefaultsForSubpage(subpage = "Campaigns") {
  if (subpage === "Email") return { campaignType: "Email", channel: "Email", deliveryTool: "MailerLite" };
  if (subpage === "Newsletter") return { campaignType: "Newsletter", channel: "Email", deliveryTool: "MailerLite" };
  if (subpage === "Ad Grants") return { campaignType: "Google Ad Grant", channel: "Google Ads", deliveryTool: "Google Ads" };
  return { campaignType: "General Campaign", channel: "Email" };
}

function marketingSubscriberTags(value) {
  const tags = Array.isArray(value) ? value : cleanText(value).split(",");
  return [...new Set(tags.map(cleanText).filter(Boolean))];
}

function marketingSubscriberPayload(values = {}) {
  const textFields = [
    "fullName",
    "firstName",
    "lastName",
    "email",
    "phone",
    "address",
    "preferredLanguage",
    "communicationPreference",
    "status",
    "signupSource",
    "consentSource",
    "consentDate",
    "dateSubscribed",
    "notes",
    "mailerLiteSubscriberId",
    "lastEmailOpenedAt",
    "lastEmailClickedAt"
  ];
  const payload = Object.fromEntries(textFields.map((field) => [field, cleanText(values[field])]));
  payload.email = payload.email.toLowerCase();
  payload.status ||= "Consent Needed";
  payload.communicationPreference ||= "Email";
  payload.audienceGroups = marketingSubscriberTags(values.audienceGroups ?? values.tags);
  payload.tags = payload.audienceGroups;
  payload.emailOptOut = values.emailOptOut === true || values.emailOptOut === "true" || values.emailOptOut === "on";
  payload.totalEmailsSent = cleanNumber(values.totalEmailsSent) || 0;
  payload.totalOpens = cleanNumber(values.totalOpens) || 0;
  payload.totalClicks = cleanNumber(values.totalClicks) || 0;
  return payload;
}

function mapMarketingSubscriber(subscriber = {}) {
  const roleTags = marketingSubscriberTags(subscriber.roleTags);
  const audienceGroups = marketingSubscriberTags(subscriber.audienceGroups ?? subscriber.tags);
  const sourceRecords = Array.isArray(subscriber.sourceRecords) ? subscriber.sourceRecords : [];
  const sourceSummary = cleanText(subscriber.sourceSummary)
    || [...new Set(sourceRecords.map((source) => cleanText(source.type)).filter(Boolean))].join(", ")
    || "Manual";
  const eligible = subscriber.eligible === true;
  return {
    id: cleanText(subscriber.id),
    kind: "marketing-subscriber",
    title: cleanText(subscriber.fullName) || [subscriber.firstName, subscriber.lastName].map(cleanText).filter(Boolean).join(" ") || "Unnamed Contact",
    subtitle: cleanText(subscriber.email) || "No email address",
    status: cleanText(subscriber.status) || "Consent Needed",
    email: cleanText(subscriber.email) || "-",
    phone: cleanText(subscriber.phone) || "-",
    address: cleanText(subscriber.address) || "-",
    preferredLanguage: cleanText(subscriber.preferredLanguage) || "-",
    communicationPreference: cleanText(subscriber.communicationPreference) || "Email",
    roleTags,
    roleTagSummary: roleTags.join(", ") || "-",
    audienceGroups,
    audienceGroupSummary: audienceGroups.join(", ") || "-",
    tags: audienceGroups,
    tagSummary: audienceGroups.join(", ") || "-",
    emailOptOut: subscriber.emailOptOut === true,
    signupSource: cleanText(subscriber.signupSource) || "-",
    consentSource: cleanText(subscriber.consentSource) || "-",
    consentDate: formatMarketingDate(subscriber.consentDate),
    consentDateValue: cleanText(subscriber.consentDate),
    dateSubscribed: formatMarketingDate(subscriber.dateSubscribed),
    dateSubscribedValue: cleanText(subscriber.dateSubscribed),
    notes: cleanText(subscriber.notes) || "-",
    mailerLiteSubscriberId: cleanText(subscriber.mailerLiteSubscriberId) || "-",
    mailerLiteStatus: cleanText(subscriber.mailerLiteStatus) || "-",
    mailerLiteSyncStatus: cleanText(subscriber.mailerLiteSyncStatus) || "Not synchronized",
    mailerLiteSyncError: cleanText(subscriber.mailerLiteSyncError) || "-",
    mailerLiteLastSyncedAt: formatMarketingDateTime(subscriber.mailerLiteLastSyncedAt),
    mailerLiteSyncMode: cleanText(subscriber.mailerLiteSyncMode) || "-",
    lastEmailOpenedAt: formatMarketingDateTime(subscriber.lastEmailOpenedAt),
    lastEmailClickedAt: formatMarketingDateTime(subscriber.lastEmailClickedAt),
    totalEmailsSent: formatMarketingNumber(subscriber.totalEmailsSent || 0),
    totalOpens: formatMarketingNumber(subscriber.totalOpens || 0),
    totalClicks: formatMarketingNumber(subscriber.totalClicks || 0),
    sourceRecords,
    sourceSummary,
    eligible,
    eligibilityLabel: cleanText(subscriber.eligibilityLabel) || (eligible ? "Ready for MailerLite" : "Excluded"),
    stored: subscriber.stored === true,
    createdAt: formatMarketingDateTime(subscriber.createdAt),
    updatedAt: formatMarketingDateTime(subscriber.updatedAt),
    source: subscriber
  };
}

function mapMarketingSubscribers(subscribers = []) {
  return subscribers.map(mapMarketingSubscriber).sort((first, second) => first.title.localeCompare(second.title) || first.email.localeCompare(second.email));
}

function marketingSubscriberMatches(item = {}, query = "") {
  const normalized = cleanText(query).toLowerCase();
  if (!normalized) return true;
  return [
    item.title,
    item.email,
    item.phone,
    item.status,
    item.communicationPreference,
    item.roleTagSummary,
    item.audienceGroupSummary,
    item.sourceSummary,
    item.notes
  ].some((value) => cleanText(value).toLowerCase().includes(normalized));
}

function marketingSubscriberSummary(items = []) {
  return [
    [String(items.length), "Contacts"],
    [String(items.filter((item) => item.eligible).length), "Email Eligible"],
    [String(items.filter((item) => item.status === "Consent Needed" || item.eligibilityLabel === "Consent Incomplete").length), "Consent Needed"],
    [String(items.filter((item) => item.status === "Unsubscribed" || item.emailOptOut).length), "Unsubscribed"]
  ];
}

function marketingDashboardSummary(campaigns = [], contacts = []) {
  const activeCampaigns = campaigns.filter((item) => !["Sent", "Archived"].includes(item.status)).length;
  const scheduledCampaigns = campaigns.filter((item) => item.status === "Scheduled").length;
  return [
    [String(contacts.length), "Contacts"],
    [String(contacts.filter((item) => item.eligible).length), "Email Eligible"],
    [String(activeCampaigns), "Active Campaigns"],
    [String(scheduledCampaigns), "Scheduled"]
  ];
}

function marketingDashboardData(campaigns = [], contacts = []) {
  const results = campaigns.filter(marketingCampaignHasResults);
  const emailResults = results.filter((item) => item.channel === "Email");
  const sent = emailResults.reduce((total, item) => total + item.sentCountValue, 0);
  const opened = emailResults.reduce((total, item) => total + item.openCountValue, 0);
  const clicked = emailResults.reduce((total, item) => total + item.clickCountValue, 0);
  const conversions = results.reduce((total, item) => total + item.conversionCountValue, 0);
  const audienceGroups = marketingSubscriberTags([
    ...defaultMarketingAudienceGroups,
    ...contacts.flatMap((item) => item.audienceGroups || [])
  ]).map((name) => ({
    name,
    count: contacts.filter((item) => (item.audienceGroups || []).includes(name)).length
  }));

  return {
    summary: marketingDashboardSummary(campaigns, contacts),
    performance: [
      [formatMarketingNumber(sent), "Emails Sent"],
      [formatMarketingRate(opened, sent), "Open Rate"],
      [formatMarketingRate(clicked, sent), "Click Rate"],
      [formatMarketingNumber(conversions), "Conversions"]
    ],
    pipeline: [
      [String(campaigns.filter((item) => item.status === "Draft").length), "Draft"],
      [String(campaigns.filter((item) => ["Planned", "Ready for Review"].includes(item.status)).length), "In Review"],
      [String(campaigns.filter((item) => item.status === "Scheduled").length), "Scheduled"],
      [String(campaigns.filter((item) => item.status === "Sent").length), "Sent"]
    ],
    audienceReadiness: marketingSubscriberSummary(contacts),
    audienceGroups,
    upcoming: campaigns.filter((item) => !["Sent", "Archived"].includes(item.status)).slice(0, 5),
    recentResults: [...results].sort((first, second) => {
      const firstDate = cleanText(first.source.sendDate || first.source.startDate);
      const secondDate = cleanText(second.source.sendDate || second.source.startDate);
      return secondDate.localeCompare(firstDate) || first.title.localeCompare(second.title);
    }).slice(0, 4)
  };
}

function marketingRecipientsForTargets(items = [], targets = []) {
  const targetSet = new Set(marketingSubscriberTags(targets).map((value) => value.toLowerCase()));
  if (!targetSet.size) return [];

  const seen = new Set();
  return items.filter((item) => {
    if (item.eligible !== true) return false;
    const matches = [
      ...(item.roleTags || []),
      ...(item.audienceGroups || [])
    ].some((value) => targetSet.has(cleanText(value).toLowerCase()));
    if (!matches) return false;

    const key = cleanText(item.email).toLowerCase() || cleanText(item.id);
    if (key && seen.has(key)) return false;
    if (key) seen.add(key);
    return true;
  });
}

export {
  defaultMarketingAudienceGroups,
  formatMarketingDateTime,
  mapMarketingCampaign,
  mapMarketingCampaigns,
  mapMarketingSubscriber,
  mapMarketingSubscribers,
  marketingCampaignFilterOptions,
  marketingCommunicationPreferenceOptions,
  marketingCampaignHasResults,
  marketingCampaignMatches,
  marketingCampaignPayload,
  marketingCampaignTypeOptions,
  marketingCampaignsForFilter,
  marketingCampaignsForSubpage,
  marketingChannelOptions,
  marketingDashboardData,
  marketingDashboardSummary,
  marketingDefaultsForSubpage,
  marketingRecipientsForTargets,
  marketingSubscriberMatches,
  marketingSubscriberPayload,
  marketingSubscriberStatusOptions,
  marketingSubscriberSummary,
  marketingStatusOptions,
  marketingSummary
};
