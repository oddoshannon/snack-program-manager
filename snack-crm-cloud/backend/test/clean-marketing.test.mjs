import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  mapMarketingCampaigns,
  mapMarketingSubscribers,
  marketingCampaignFilterOptions,
  marketingCampaignHasResults,
  marketingCampaignMatches,
  marketingCampaignPayload,
  marketingCampaignsForFilter,
  marketingCampaignsForSubpage,
  marketingChannelOptions,
  marketingDashboardData,
  marketingDashboardSummary,
  marketingDefaultsForSubpage,
  marketingRecipientsForTargets,
  marketingSubscriberMatches,
  marketingSubscriberPayload,
  marketingSubscriberSummary,
  marketingSummary
} from "../../frontend/public/modules/marketing.js";
import {
  buildUnifiedMarketingSubscribers,
  cleanMarketingSubscriberPayload,
  defaultMarketingAudienceGroups,
  marketingSubscriberIdForEmail,
  marketingSubscriberValidationError
} from "../lib/core.js";
import {
  canApproveMessageTemplates,
  cleanMessageTemplateUpdate,
  mailerLiteOptOutUpdate,
  mailerLiteReadOnlyStatus,
  mailerLiteSafeSubscriberPayload,
  mailerLiteSyncConfiguration,
  mailerLiteTestSyncReadiness,
  mergeMessageTemplates,
  verifyMailerLiteWebhookSignature
} from "../routes/marketing.js";

const marketingHtml = await readFile(new URL("../../frontend/public/marketing.html", import.meta.url), "utf8");
const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
const cleanCss = await readFile(new URL("../../frontend/public/clean.css", import.meta.url), "utf8");
const routeSource = await readFile(new URL("../routes/marketing.js", import.meta.url), "utf8");

const campaigns = [
  {
    id: "campaign-2",
    name: "August Newsletter",
    status: "Scheduled",
    campaignType: "Newsletter",
    channel: "Newsletter",
    sendDate: "2026-08-10",
    audienceCount: 78,
    subject: "SNACK in August"
  },
  {
    id: "campaign-1",
    name: "Summer Class Search Ads",
    status: "Sent",
    campaignType: "Google Ad Grant",
    channel: "Google Ads",
    sendDate: "2026-07-15",
    impressions: 1200,
    clickCount: 95,
    conversionCount: 8,
    spend: 120
  },
  {
    id: "campaign-3",
    name: "Family Welcome Email",
    status: "Sent",
    campaignType: "Email",
    channel: "Email",
    sendDate: "2026-08-12",
    sentCount: 75,
    openCount: 45,
    clickCount: 15
  }
];

test("clean Marketing exposes a dashboard with consolidated campaign and contact work areas", () => {
  assert.match(marketingHtml, /SNACK_MODULE_ID = "marketing"/);
  assert.ok(marketingHtml.indexOf("app-config.js") < marketingHtml.indexOf("clean.js"));
  assert.match(cleanSource, /window\.SNACK_MODULE_ID === "marketing" && marketingInitialSection/);
  assert.match(cleanSource, /subpages: \["Dashboard", "Campaigns", "Contacts", "Templates"\]/);
  assert.doesNotMatch(cleanSource, /subpages: \[[^\]]*"Email"[^\]]*"Newsletter"[^\]]*"Ad Grants"/);
  assert.match(cleanSource, /function renderMarketingDashboard\(\)/);
  assert.match(cleanSource, /data-marketing-dashboard/);
  assert.match(cleanSource, /data-marketing-campaign-filter/);
  assert.match(cleanSource, /data-marketing-campaign-form/);
  assert.match(cleanSource, /data-marketing-subscriber-form/);
  assert.match(cleanSource, /data-marketing-status-select/);
  assert.match(cleanSource, /renderMarketingChoiceGrid\(audienceChoices, selectedAudiences, "audienceTargets"\)/);
  assert.match(cleanSource, /data-marketing-recipient-preview/);
  assert.match(cleanSource, /Role Tags \(Automatic\)/);
  assert.deepEqual(defaultMarketingAudienceGroups, [
    "Newsletter",
    "Cooking Classes",
    "Volunteers",
    "Community Partners"
  ]);
  assert.match(cleanCss, /data-module-id="marketing"\] \.tabs\.has-icons \{\s*grid-template-columns: repeat\(2/);
  assert.match(cleanCss, /\.marketing-choice-grid/);
  assert.match(cleanCss, /\.marketing-dashboard-grid/);
  assert.match(cleanCss, /\.marketing-dashboard-metrics/);
  assert.match(cleanSource, /data-marketing-templates-workspace/);
  assert.match(cleanSource, /data-marketing-template-form/);
  assert.match(cleanSource, /data-marketing-template-language/);
  assert.match(cleanSource, /marketingTemplateLanguage = "English"/);
  assert.match(cleanSource, /Ready for Review/);
  assert.match(cleanSource, /Approved and locked\. Delivery remains off\./);
  assert.match(cleanCss, /\.marketing-template-layout/);
});

test("Marketing message templates merge saved drafts and restrict approval roles", () => {
  const templates = mergeMessageTemplates([{
    id: "appointmentReminder",
    status: "Approved",
    version: 3,
    emailSubject: "Saved subject",
    emailBody: "Saved body",
    smsBody: "Saved text",
    versions: Array.from({ length: 12 }, (_, index) => ({ version: index + 1 }))
  }, {
    id: "unknownTemplate",
    status: "Approved"
  }]);
  const reminder = templates.find(({ id }) => id === "appointmentReminder");
  assert.equal(templates.length, 17);
  assert.equal(templates.filter(({ language }) => language === "Spanish").length, 8);
  assert.equal(reminder.status, "Approved");
  assert.equal(reminder.version, 3);
  assert.equal(reminder.emailSubject, "Saved subject");
  assert.equal(reminder.versions.length, 10);
  assert.equal(reminder.versions[0].version, 3);
  assert.equal(canApproveMessageTemplates({ accessLevelId: "Admin" }), true);
  assert.equal(canApproveMessageTemplates({ accessLevelName: "Manager" }), true);
  assert.equal(canApproveMessageTemplates({ accessLevelId: "Coordinator" }), false);
  assert.deepEqual(cleanMessageTemplateUpdate({
    emailSubject: ` ${"x".repeat(300)} `,
    emailBody: ` ${"b".repeat(6100)} `,
    smsBody: ` ${"y".repeat(1700)} `
  }), {
    emailSubject: "x".repeat(240),
    emailBody: "b".repeat(6000),
    smsBody: "y".repeat(1600)
  });
});

test("long Marketing contact lists are grouped and can be expanded or collapsed", () => {
  assert.match(cleanSource, /function renderMarketingContactGroupedRows/);
  assert.match(cleanSource, /Ready for Email/);
  assert.match(cleanSource, /Missing Email \/ Review/);
  assert.match(cleanSource, /data-marketing-contact-expand-all/);
  assert.match(cleanSource, /data-marketing-contact-collapse-all/);
});

test("Marketing unifies matching contacts conservatively by email", () => {
  const contacts = buildUnifiedMarketingSubscribers({
    clients: [
      { id: "child-1", firstName: "Ari", lastName: "Family", parentName: "Jamie Family", email: " JAMIE@example.com ", phone: "503-555-0100" },
      { id: "child-2", firstName: "Sam", lastName: "Family", parentName: "Jamie Family", email: "jamie@example.com" }
    ],
    donors: [{ id: "donor-1", name: "Jamie Family", email: "jamie@example.com" }]
  });

  assert.equal(contacts.length, 1);
  assert.equal(contacts[0].fullName, "Jamie Family");
  assert.equal(contacts[0].email, "jamie@example.com");
  assert.equal(contacts[0].status, "Consent Needed");
  assert.equal(contacts[0].eligible, false);
  assert.deepEqual(contacts[0].roleTags, ["Client Family", "Donor"]);
  assert.deepEqual(contacts[0].audienceGroups, []);
  assert.deepEqual(contacts[0].sourceTypes, ["CRM Client", "Fundraising Donor"]);
});

test("only explicitly consented contacts become MailerLite eligible", () => {
  const id = marketingSubscriberIdForEmail("jamie@example.com");
  const [contact] = buildUnifiedMarketingSubscribers({
    clients: [{ id: "child-1", parentName: "Jamie Family", email: "jamie@example.com" }],
    subscribers: [{
      id,
      fullName: "Jamie Family",
      email: "jamie@example.com",
      status: "Active",
      communicationPreference: "Email",
      consentSource: "Website newsletter form",
      consentDate: "2026-07-22",
      audienceGroups: ["Newsletter Subscriber", "Referral", "Class Family"]
    }]
  });

  assert.equal(contact.id, id);
  assert.equal(contact.eligible, true);
  assert.equal(contact.eligibilityLabel, "Ready for MailerLite");
  assert.deepEqual(contact.roleTags, ["Client Family", "Referral", "Class Family"]);
  assert.deepEqual(contact.audienceGroups, ["Newsletter"]);
  assert.deepEqual(contact.tags, ["Newsletter"]);
});

test("contact payloads and summaries preserve consent safety", () => {
  const payload = marketingSubscriberPayload({
    fullName: "  Jamie Family ",
    email: " JAMIE@EXAMPLE.COM ",
    status: "Active",
    audienceGroups: "Newsletter, Volunteers, Newsletter",
    totalEmailsSent: "4"
  });
  assert.equal(payload.email, "jamie@example.com");
  assert.deepEqual(payload.audienceGroups, ["Newsletter", "Volunteers"]);
  assert.deepEqual(payload.tags, ["Newsletter", "Volunteers"]);
  assert.equal(payload.totalEmailsSent, 4);

  const cleaned = cleanMarketingSubscriberPayload(payload);
  assert.equal(marketingSubscriberValidationError(cleaned), "Consent source and consent date are required before a contact can be Active.");

  const items = mapMarketingSubscribers([
    { id: "one", fullName: "Ready", email: "ready@example.com", status: "Active", eligible: true, eligibilityLabel: "Ready for MailerLite" },
    { id: "two", fullName: "Waiting", email: "waiting@example.com", status: "Consent Needed", eligible: false, eligibilityLabel: "Consent Required" },
    { id: "three", fullName: "Stopped", email: "stopped@example.com", status: "Unsubscribed", eligible: false, eligibilityLabel: "Excluded" },
    { id: "four", fullName: "Broken", email: "broken", status: "Consent Needed", eligible: false, eligibilityLabel: "Invalid Email" }
  ]);
  assert.deepEqual(marketingSubscriberSummary(items), [
    ["4", "Contacts"],
    ["1", "Email Eligible"],
    ["2", "Consent Needed"],
    ["1", "Unsubscribed"]
  ]);
  assert.equal(marketingSubscriberMatches(items.find((item) => item.id === "one"), "ready@example"), true);
});

test("unified contacts include programs, providers, and consent-safe opt outs", () => {
  const contacts = buildUnifiedMarketingSubscribers({
    programRegistrations: [{
      id: "registration-1",
      caregiverName: "Taylor Cook",
      email: "taylor@example.com"
    }],
    referralNetwork: [{
      id: "network-1",
      name: "Riverbend Clinic",
      contactName: "Morgan Office",
      email: "office@example.com",
      providers: [{ id: "provider-1", name: "Dr. Lee", email: "lee@example.com" }]
    }],
    clients: [{
      id: "client-1",
      parentName: "Opted Out Family",
      email: "stopped@example.com",
      emailOptOut: true
    }],
    subscribers: [{
      id: marketingSubscriberIdForEmail("stopped@example.com"),
      fullName: "Opted Out Family",
      email: "stopped@example.com",
      status: "Active",
      communicationPreference: "Email",
      consentSource: "Written permission",
      consentDate: "2026-07-22"
    }]
  });

  const classContact = contacts.find((contact) => contact.email === "taylor@example.com");
  const provider = contacts.find((contact) => contact.email === "lee@example.com");
  const optedOut = contacts.find((contact) => contact.email === "stopped@example.com");
  assert.deepEqual(classContact.roleTags, ["Cooking Class Family"]);
  assert.deepEqual(classContact.audienceGroups, ["Cooking Classes"]);
  assert.deepEqual(provider.roleTags, ["Referring Provider", "Community Partner"]);
  assert.equal(optedOut.eligible, false);
  assert.equal(optedOut.eligibilityLabel, "Email Opt Out");
});

test("clean Marketing maps, orders, searches, and filters campaign records", () => {
  const items = mapMarketingCampaigns(campaigns);

  assert.deepEqual(items.map((item) => item.id), ["campaign-1", "campaign-2", "campaign-3"]);
  assert.equal(items[1].channel, "Email");
  assert.equal(items[2].openRate, "60%");
  assert.equal(items[2].clickRate, "20%");
  assert.equal(marketingCampaignMatches(items[1], "SNACK in August"), true);
  assert.deepEqual(marketingCampaignsForFilter(items, "Email").map(({ id }) => id), ["campaign-3"]);
  assert.deepEqual(marketingCampaignsForFilter(items, "Newsletter").map(({ id }) => id), ["campaign-2"]);
  assert.deepEqual(marketingCampaignsForFilter(items, "Google Ads").map(({ id }) => id), ["campaign-1"]);
  assert.deepEqual(marketingCampaignsForSubpage(items, "Email").map(({ id }) => id), ["campaign-3"]);
  assert.deepEqual(marketingCampaignsForSubpage(items, "Newsletter").map(({ id }) => id), ["campaign-2"]);
  assert.deepEqual(marketingCampaignsForSubpage(items, "Ad Grants").map(({ id }) => id), ["campaign-1"]);
  assert.deepEqual(marketingCampaignsForSubpage(items, "Analytics").map(({ id }) => id), ["campaign-1", "campaign-3"]);
  assert.equal(marketingCampaignHasResults(items[1]), false);
  assert.deepEqual(marketingCampaignFilterOptions.slice(0, 4), ["All Campaigns", "Email", "Newsletter", "Google Ads"]);
  assert.equal(marketingChannelOptions.includes("Newsletter"), false);
});

test("Marketing recipient previews include only eligible matching contacts", () => {
  const recipients = marketingRecipientsForTargets([
    { id: "one", title: "Ready Newsletter", email: "ready@example.com", eligible: true, roleTags: ["Client Family"], audienceGroups: ["Newsletter"] },
    { id: "two", title: "No Consent", email: "waiting@example.com", eligible: false, roleTags: ["Client Family"], audienceGroups: ["Newsletter"] },
    { id: "three", title: "Ready Partner", email: "partner@example.com", eligible: true, roleTags: ["Community Partner"], audienceGroups: [] },
    { id: "duplicate", title: "Duplicate", email: "READY@example.com", eligible: true, roleTags: ["Client Family"], audienceGroups: ["Newsletter"] }
  ], ["newsletter", "Community Partner"]);

  assert.deepEqual(recipients.map(({ id }) => id), ["one", "three"]);
  assert.deepEqual(marketingRecipientsForTargets(recipients, []), []);
});

test("clean Marketing calculates operational and analytics counters", () => {
  const items = mapMarketingCampaigns(campaigns);

  assert.deepEqual(marketingSummary(items, "Campaigns"), [
    ["1", "Active"],
    ["1", "Scheduled"],
    ["2", "Sent"],
    ["78", "Largest Audience"]
  ]);
  assert.deepEqual(marketingSummary(items, "Analytics"), [
    ["75", "Sent"],
    ["60%", "Open Rate"],
    ["20%", "Click Rate"],
    ["8", "Conversions"]
  ]);
});

test("Marketing dashboard combines campaign performance and contact readiness", () => {
  const items = mapMarketingCampaigns(campaigns);
  const contacts = mapMarketingSubscribers([
    { id: "ready", fullName: "Ready Family", email: "ready@example.com", status: "Active", eligible: true, audienceGroups: ["Newsletter"] },
    { id: "waiting", fullName: "Waiting Family", email: "waiting@example.com", status: "Consent Needed", eligible: false, audienceGroups: ["Cooking Classes"] }
  ]);
  const dashboard = marketingDashboardData(items, contacts);

  assert.deepEqual(marketingDashboardSummary(items, contacts), [
    ["2", "Contacts"],
    ["1", "Email Eligible"],
    ["1", "Active Campaigns"],
    ["1", "Scheduled"]
  ]);
  assert.deepEqual(dashboard.performance, [
    ["75", "Emails Sent"],
    ["60%", "Open Rate"],
    ["20%", "Click Rate"],
    ["8", "Conversions"]
  ]);
  assert.deepEqual(dashboard.pipeline, [
    ["0", "Draft"],
    ["0", "In Review"],
    ["1", "Scheduled"],
    ["2", "Sent"]
  ]);
  assert.deepEqual(dashboard.upcoming.map(({ id }) => id), ["campaign-2"]);
  assert.deepEqual(dashboard.recentResults.map(({ id }) => id), ["campaign-3", "campaign-1"]);
  assert.equal(dashboard.audienceGroups.find((group) => group.name === "Newsletter").count, 1);
});

test("clean Marketing prepares trimmed campaign payloads and section defaults", () => {
  const payload = marketingCampaignPayload({
    name: "  Family Update  ",
    status: "",
    audienceCount: "78",
    spend: "12.345"
  });

  assert.equal(payload.name, "Family Update");
  assert.equal(payload.status, "Draft");
  assert.equal(payload.audienceCount, 78);
  assert.equal(payload.spend, 12.35);
  assert.deepEqual(marketingDefaultsForSubpage("Newsletter"), {
    campaignType: "Newsletter",
    channel: "Email",
    deliveryTool: "MailerLite"
  });
  assert.deepEqual(marketingDefaultsForSubpage("Email"), {
    campaignType: "Email",
    channel: "Email",
    deliveryTool: "MailerLite"
  });
  assert.deepEqual(marketingDefaultsForSubpage("Ad Grants"), {
    campaignType: "Google Ad Grant",
    channel: "Google Ads",
    deliveryTool: "Google Ads"
  });
});

test("Marketing routes load every contact source, require staff sign-in, and cannot send", () => {
  assert.match(routeSource, /fetchAllDocuments\(marketingCampaigns\)/);
  assert.match(routeSource, /router\.get\("\/api\/marketing-campaigns", requireAuth/);
  assert.match(routeSource, /router\.post\("\/api\/marketing-campaigns", requireAuth/);
  assert.match(routeSource, /router\.patch\("\/api\/marketing-campaigns\/:campaignId", requireAuth/);
  assert.match(routeSource, /router\.delete\("\/api\/marketing-campaigns\/:campaignId", requireAuth/);
  assert.match(routeSource, /router\.get\("\/api\/marketing-subscribers", requireAuth/);
  assert.match(routeSource, /fetchAllDocuments\(clients\)/);
  assert.match(routeSource, /fetchAllDocuments\(referrals\)/);
  assert.match(routeSource, /fetchAllDocuments\(fundraisingDonors\)/);
  assert.match(routeSource, /fetchAllDocuments\(outreachContacts\)/);
  assert.match(routeSource, /fetchAllDocuments\(outreachEvents\)/);
  assert.match(routeSource, /fetchAllDocuments\(programRegistrations\)/);
  assert.match(routeSource, /fetchAllDocuments\(referralNetwork\)/);
  assert.match(routeSource, /fetchAllDocuments\(marketingSubscribers\)/);
  assert.match(routeSource, /router\.post\("\/api\/marketing-subscribers", requireAuth/);
  assert.match(routeSource, /router\.patch\("\/api\/marketing-subscribers\/:subscriberId", requireAuth/);
  assert.match(routeSource, /router\.get\("\/api\/marketing\/templates", requireAuth/);
  assert.match(routeSource, /router\.patch\("\/api\/marketing\/templates\/:templateId", requireAuth/);
  assert.match(routeSource, /Only an Admin or Manager can change message templates/);
  assert.doesNotMatch(routeSource, /router\.delete\("\/api\/marketing-subscribers/);
  assert.match(routeSource, /sendingEnabled: false/);
  assert.doesNotMatch(routeSource, /router\.(?:post|patch)\("\/api\/marketing\/send/);
});

test("MailerLite status verifies the token with a read-only provider request", async () => {
  let request = null;
  const connected = await mailerLiteReadOnlyStatus("fake-token", async (url, options) => {
    request = { url, options };
    return { ok: true, status: 200 };
  });
  assert.equal(connected.configured, true);
  assert.equal(connected.connected, true);
  assert.equal(connected.sendingEnabled, false);
  assert.equal(request.url, "https://connect.mailerlite.com/api/groups?limit=1");
  assert.equal(request.options.method, "GET");
  assert.equal(request.options.headers.Authorization, "Bearer fake-token");

  const rejected = await mailerLiteReadOnlyStatus("fake-token", async () => ({ ok: false, status: 401 }));
  assert.equal(rejected.configured, true);
  assert.equal(rejected.connected, false);
  assert.match(rejected.connectionMode, /rejected/i);

  let unconfiguredCalled = false;
  const unconfigured = await mailerLiteReadOnlyStatus("", async () => {
    unconfiguredCalled = true;
    return { ok: true, status: 200 };
  });
  assert.equal(unconfigured.configured, false);
  assert.equal(unconfigured.connected, false);
  assert.equal(unconfiguredCalled, false);
  assert.doesNotMatch(cleanSource, /marketingMailerLiteStatus\.configured\);/);
  assert.match(cleanSource, /marketingMailerLiteStatus\.connected/);
});

test("MailerLite private syncing requires an explicit allowlist and complete consent", () => {
  const configuration = mailerLiteSyncConfiguration({
    MAILERLITE_API_TOKEN: "token",
    MAILERLITE_TEST_GROUP_ID: "private-group",
    MAILERLITE_TEST_ALLOWLIST: " shannon@example.org, second@example.org ",
    MAILERLITE_TEST_SYNC_ENABLED: "true",
    MAILERLITE_WEBHOOK_ENABLED: "false"
  });
  assert.equal(configuration.testSyncEnabled, true);
  assert.equal(configuration.webhookEnabled, false);
  assert.deepEqual([...configuration.testAllowlist], ["shannon@example.org", "second@example.org"]);

  const contact = {
    email: "shannon@example.org",
    firstName: "Shannon",
    lastName: "Oddo",
    eligible: true,
    phone: "971-555-0100",
    address: "Private address",
    notes: "Private note"
  };
  assert.equal(mailerLiteTestSyncReadiness(contact, configuration).ready, true);
  assert.equal(mailerLiteTestSyncReadiness({ ...contact, email: "family@example.org" }, configuration).ready, false);
  assert.equal(mailerLiteTestSyncReadiness({ ...contact, eligible: false }, configuration).ready, false);

  assert.deepEqual(mailerLiteSafeSubscriberPayload(contact, "private-group"), {
    email: "shannon@example.org",
    fields: { name: "Shannon", last_name: "Oddo" },
    groups: ["private-group"]
  });
  assert.equal(mailerLiteSafeSubscriberPayload({ ...contact, eligible: false }, "private-group"), null);
});

test("MailerLite opt-outs are signed and flow one way into the Hub", () => {
  const rawBody = Buffer.from(JSON.stringify({
    type: "subscriber.unsubscribed",
    data: { subscriber: { id: "ml-1", email: "Family@Example.org", status: "unsubscribed" } }
  }));
  const signature = crypto.createHmac("sha256", "webhook-secret").update(rawBody).digest("hex");
  assert.equal(verifyMailerLiteWebhookSignature(rawBody, signature, "webhook-secret"), true);
  assert.equal(verifyMailerLiteWebhookSignature(rawBody, `${signature.slice(0, -1)}0`, "webhook-secret"), false);
  assert.deepEqual(mailerLiteOptOutUpdate(JSON.parse(rawBody)), {
    email: "family@example.org",
    mailerLiteSubscriberId: "ml-1",
    status: "Unsubscribed",
    emailOptOut: true,
    mailerLiteStatus: "unsubscribed",
    mailerLiteOptOutEvent: "subscriber.unsubscribed"
  });
  assert.equal(mailerLiteOptOutUpdate({
    type: "subscriber.active",
    data: { subscriber: { email: "family@example.org" } }
  }), null);
  assert.match(routeSource, /router\.post\("\/api\/marketing\/mailerlite\/test-sync", requireAuth/);
  assert.match(routeSource, /router\.post\("\/api\/public\/mailerlite\/webhook"/);
  assert.match(routeSource, /sendingEnabled: false/);
});
