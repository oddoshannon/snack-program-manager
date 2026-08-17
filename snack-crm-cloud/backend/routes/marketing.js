import express from "express";
import crypto from "node:crypto";
import {
  adminSettings,
  buildUnifiedMarketingSubscribers,
  cleanMarketingCampaignPayload,
  cleanMarketingSubscriberPayload,
  cleanString,
  clients,
  defaultMarketingAudienceGroups,
  fetchAllDocuments,
  fundraisingDonors,
  marketingCampaigns,
  marketingSubscriberIdForEmail,
  marketingSubscriberValidationError,
  marketingSubscribers,
  outreachContacts,
  outreachEvents,
  programRegistrations,
  referralNetwork,
  referrals,
  requireAuth,
  toClient,
  toFundraisingDonor,
  toMarketingCampaign,
  toMarketingSubscriber,
  toOutreachContact,
  toOutreachEvent,
  toProgramRegistration,
  toReferral,
  toReferralNetworkEntry
} from "../lib/core.js";
import { defaultClientMessageTemplateRecords } from "../lib/client-messages.js";

const router = express.Router();
const mailerLiteApiBaseUrl = "https://connect.mailerlite.com/api";
const mailerLiteGroupsUrl = "https://connect.mailerlite.com/api/groups?limit=1";
const messageTemplateStatuses = new Set(["Draft", "Ready for Review", "Approved"]);
const messageTemplateVersionLimit = 10;
const messageTemplateSettingsRef = adminSettings.doc("messageTemplates");

function cleanTemplateText(value, maxLength = 12_000) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function mergeMessageTemplates(savedTemplates = []) {
  const savedById = new Map((Array.isArray(savedTemplates) ? savedTemplates : [])
    .filter((template) => template && typeof template === "object" && template.id)
    .map((template) => [String(template.id), template]));
  return defaultClientMessageTemplateRecords().map((template) => ({
    ...template,
    ...(savedById.get(template.id) || {}),
    id: template.id,
    name: template.name,
    category: template.category,
    baseTemplateId: template.baseTemplateId || template.id,
    language: template.language,
    status: messageTemplateStatuses.has(savedById.get(template.id)?.status)
      ? savedById.get(template.id).status
      : template.status,
    version: Math.max(1, Number(savedById.get(template.id)?.version) || 1),
    versions: Array.isArray(savedById.get(template.id)?.versions)
      ? savedById.get(template.id).versions.slice(-messageTemplateVersionLimit)
      : []
  }));
}

function cleanMessageTemplateUpdate(body = {}) {
  return {
    emailSubject: cleanTemplateText(body.emailSubject, 240),
    emailBody: cleanTemplateText(body.emailBody, 6_000),
    smsBody: cleanTemplateText(body.smsBody, 1_600)
  };
}

function canApproveMessageTemplates(user = {}) {
  return ["Admin", "Manager"].includes(String(user.accessLevelId || user.accessLevelName || ""));
}

async function loadMessageTemplates() {
  const snapshot = await messageTemplateSettingsRef.get();
  return mergeMessageTemplates(snapshot.exists ? snapshot.data()?.templates : []);
}

async function mailerLiteReadOnlyStatus(tokenValue = "", fetchImpl = globalThis.fetch) {
  const token = cleanString(tokenValue);
  const base = {
    provider: "MailerLite",
    configured: Boolean(token),
    connected: false,
    sendingEnabled: false
  };
  if (!token) return { ...base, connectionMode: "Not connected" };
  if (typeof fetchImpl !== "function") return { ...base, connectionMode: "MailerLite could not be reached" };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const providerResponse = await fetchImpl(mailerLiteGroupsUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      signal: controller.signal
    });
    if (providerResponse.ok) {
      return {
        ...base,
        connected: true,
        connectionMode: "Connected; read-only check passed"
      };
    }
    if ([401, 403].includes(providerResponse.status)) {
      return { ...base, connectionMode: "MailerLite rejected the API token" };
    }
    if (providerResponse.status === 429) {
      return { ...base, connectionMode: "MailerLite is temporarily limiting connection checks" };
    }
    return { ...base, connectionMode: "MailerLite connection check failed" };
  } catch {
    return { ...base, connectionMode: "MailerLite could not be reached" };
  } finally {
    clearTimeout(timeout);
  }
}

function mailerLiteSyncConfiguration(environment = process.env) {
  const testAllowlist = new Set(cleanString(environment.MAILERLITE_TEST_ALLOWLIST)
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean));
  return {
    token: cleanString(environment.MAILERLITE_API_TOKEN),
    testGroupId: cleanString(environment.MAILERLITE_TEST_GROUP_ID),
    webhookSecret: cleanString(environment.MAILERLITE_WEBHOOK_SECRET),
    webhookScope: cleanString(environment.MAILERLITE_WEBHOOK_SCOPE) || "disabled",
    testAllowlist,
    testSyncEnabled: environment.MAILERLITE_TEST_SYNC_ENABLED === "true",
    webhookEnabled: environment.MAILERLITE_WEBHOOK_ENABLED === "true",
    sendingEnabled: false
  };
}

function mailerLiteContactSyncIntent(contact = {}, configuration = {}) {
  const email = cleanString(contact.email).toLowerCase();
  if (!configuration.testSyncEnabled) return { action: "paused", reason: "MailerLite test syncing is disabled." };
  if (!configuration.token || !configuration.testGroupId) {
    return { action: "paused", reason: "MailerLite test syncing is not fully configured." };
  }
  if (!configuration.testAllowlist?.has(email)) {
    return { action: "ignored", reason: "This address is outside the private MailerLite test allowlist." };
  }
  const suppressed = contact.emailOptOut === true
    || ["Unsubscribed", "Bounced", "Complained", "Do Not Contact"].includes(cleanString(contact.status));
  if (suppressed || (contact.eligible !== true && cleanString(contact.mailerLiteSubscriberId))) {
    return { action: "unsubscribe", reason: "The Hub contact is no longer eligible for Marketing email." };
  }
  if (contact.eligible === true) {
    return { action: "upsert", reason: "The contact has complete Marketing consent." };
  }
  return { action: "blocked", reason: "This contact does not have complete Marketing consent." };
}

async function mailerLiteApiRequest(configuration, path, options = {}, fetchImpl = globalThis.fetch) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const providerResponse = await fetchImpl(`${mailerLiteApiBaseUrl}${path}`, {
      method: options.method || "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${configuration.token}`,
        ...(options.body ? { "Content-Type": "application/json" } : {})
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
      signal: controller.signal
    });
    const payload = providerResponse.status === 204
      ? {}
      : await providerResponse.json().catch(() => ({}));
    if (!providerResponse.ok) {
      const error = new Error("MailerLite did not accept the private contact synchronization.");
      error.status = providerResponse.status;
      throw error;
    }
    return payload;
  } finally {
    clearTimeout(timeout);
  }
}

async function syncPrivateMailerLiteContact(contact = {}, configuration = {}, fetchImpl = globalThis.fetch) {
  const intent = mailerLiteContactSyncIntent(contact, configuration);
  const email = cleanString(contact.email).toLowerCase();
  if (!["upsert", "unsubscribe"].includes(intent.action)) {
    return { state: intent.action, email, reason: intent.reason };
  }

  if (intent.action === "upsert") {
    const payload = mailerLiteSafeSubscriberPayload(contact, configuration.testGroupId);
    const result = await mailerLiteApiRequest(configuration, "/subscribers", {
      method: "POST",
      body: payload
    }, fetchImpl);
    const subscriber = result?.data || {};
    const providerStatus = cleanString(subscriber.status).toLowerCase();
    const suppressed = ["unsubscribed", "bounced", "junk"].includes(providerStatus);
    return {
      state: suppressed ? "suppressed" : "synced",
      email,
      subscriberId: cleanString(subscriber.id),
      providerStatus,
      reason: suppressed
        ? "MailerLite already suppresses this address; the Hub will not reactivate it automatically."
        : "Consent synchronized to the private MailerLite test group."
    };
  }

  let subscriberId = cleanString(contact.mailerLiteSubscriberId);
  if (!subscriberId) {
    try {
      const lookup = await mailerLiteApiRequest(
        configuration,
        `/subscribers/${encodeURIComponent(email)}`,
        {},
        fetchImpl
      );
      subscriberId = cleanString(lookup?.data?.id);
    } catch (error) {
      if (error.status === 404) {
        return {
          state: "not-found",
          email,
          reason: "The Hub opt-out is saved; MailerLite did not have this address."
        };
      }
      throw error;
    }
  }
  if (!subscriberId) {
    return { state: "not-found", email, reason: "The Hub opt-out is saved; MailerLite did not have this address." };
  }
  const result = await mailerLiteApiRequest(configuration, `/subscribers/${encodeURIComponent(subscriberId)}`, {
    method: "PUT",
    body: { status: "unsubscribed" }
  }, fetchImpl);
  return {
    state: "unsubscribed",
    email,
    subscriberId: cleanString(result?.data?.id) || subscriberId,
    providerStatus: cleanString(result?.data?.status) || "unsubscribed",
    reason: "The address is unsubscribed in both the Hub and MailerLite."
  };
}

function mailerLiteSyncMetadata(result = {}, now = new Date().toISOString()) {
  const state = cleanString(result.state) || "unknown";
  const synchronized = ["synced", "unsubscribed", "suppressed", "not-found"].includes(state);
  return {
    ...(cleanString(result.subscriberId) ? { mailerLiteSubscriberId: cleanString(result.subscriberId) } : {}),
    mailerLiteStatus: cleanString(result.providerStatus),
    mailerLiteSyncStatus: state,
    mailerLiteSyncError: state === "error" ? cleanString(result.reason).slice(0, 300) : "",
    mailerLiteLastSyncedAt: synchronized ? now : "",
    mailerLiteSyncMode: "Private Test"
  };
}

async function persistPrivateMailerLiteSync(docRef, contact = {}, actor = "", options = {}) {
  const configuration = options.configuration || mailerLiteSyncConfiguration();
  let result;
  try {
    result = await syncPrivateMailerLiteContact(contact, configuration, options.fetchImpl || globalThis.fetch);
  } catch (error) {
    result = {
      state: "error",
      email: cleanString(contact.email).toLowerCase(),
      reason: cleanString(error?.message) || "MailerLite synchronization failed."
    };
  }
  if (result.state === "ignored") return result;
  const now = new Date().toISOString();
  const metadata = mailerLiteSyncMetadata(result, now);
  const providerSuppressed = result.state === "suppressed";
  await docRef.set({
    ...metadata,
    ...(providerSuppressed ? { status: "Unsubscribed", emailOptOut: true } : {}),
    updatedAt: now,
    ...(cleanString(actor) ? { updatedBy: cleanString(actor) } : {})
  }, { merge: true });
  return result;
}

function mailerLiteSafeSubscriberPayload(contact = {}, groupId = "") {
  const eligibility = contact.eligible === true
    ? { eligible: true }
    : { eligible: false };
  if (!eligibility.eligible) return null;
  const email = cleanString(contact.email).toLowerCase();
  if (!email) return null;
  return {
    email,
    fields: {
      name: cleanString(contact.firstName),
      last_name: cleanString(contact.lastName)
    },
    groups: cleanString(groupId) ? [cleanString(groupId)] : []
  };
}

function mailerLiteTestSyncReadiness(contact = {}, configuration = {}) {
  const email = cleanString(contact.email).toLowerCase();
  if (!configuration.testSyncEnabled) return { ready: false, reason: "MailerLite test syncing is disabled." };
  if (!configuration.token || !configuration.testGroupId) {
    return { ready: false, reason: "MailerLite test syncing is not fully configured." };
  }
  if (!configuration.testAllowlist?.has(email)) {
    return { ready: false, reason: "This address is not in the private MailerLite test allowlist." };
  }
  if (contact.eligible !== true) {
    return { ready: false, reason: "This contact does not have complete marketing consent." };
  }
  return { ready: true, reason: "Ready for private MailerLite test sync." };
}

function verifyMailerLiteWebhookSignature(rawBody, suppliedSignature = "", secret = "") {
  if (!Buffer.isBuffer(rawBody) || !rawBody.length || !cleanString(suppliedSignature) || !cleanString(secret)) {
    return false;
  }
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const received = cleanString(suppliedSignature).toLowerCase();
  if (received.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(received, "utf8"), Buffer.from(expected, "utf8"));
}

function mailerLiteOptOutUpdate(event = {}) {
  const eventType = cleanString(event.type || event.event);
  const subscriber = event.data?.subscriber || event.subscriber || event.data || event;
  const email = cleanString(subscriber.email).toLowerCase();
  const optOutEvents = new Set([
    "subscriber.unsubscribed",
    "subscriber.bounced",
    "subscriber.spam_reported",
    "subscriber.deleted"
  ]);
  if (!optOutEvents.has(eventType) || !email) return null;
  const status = ({
    "subscriber.bounced": "Bounced",
    "subscriber.spam_reported": "Complained"
  })[eventType] || "Unsubscribed";
  return {
    email,
    mailerLiteSubscriberId: cleanString(subscriber.id),
    status,
    emailOptOut: true,
    mailerLiteStatus: cleanString(subscriber.status) || eventType.replace("subscriber.", ""),
    mailerLiteOptOutEvent: eventType
  };
}

async function loadUnifiedMarketingContacts() {
  const [
    clientDocuments,
    referralDocuments,
    donorDocuments,
    outreachContactDocuments,
    outreachEventDocuments,
    registrationDocuments,
    referralNetworkDocuments,
    subscriberDocuments
  ] = await Promise.all([
    fetchAllDocuments(clients),
    fetchAllDocuments(referrals),
    fetchAllDocuments(fundraisingDonors),
    fetchAllDocuments(outreachContacts),
    fetchAllDocuments(outreachEvents),
    fetchAllDocuments(programRegistrations),
    fetchAllDocuments(referralNetwork),
    fetchAllDocuments(marketingSubscribers)
  ]);
  return buildUnifiedMarketingSubscribers({
    clients: clientDocuments.map(toClient),
    referrals: referralDocuments.map(toReferral),
    donors: donorDocuments.map(toFundraisingDonor),
    outreachContacts: outreachContactDocuments.map(toOutreachContact),
    outreachEvents: outreachEventDocuments.map(toOutreachEvent),
    programRegistrations: registrationDocuments.map(toProgramRegistration),
    referralNetwork: referralNetworkDocuments.map(toReferralNetworkEntry),
    subscribers: subscriberDocuments.map(toMarketingSubscriber)
  });
}

router.get("/api/marketing-campaigns", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(marketingCampaigns);
    response.json({ campaigns: documents.map(toMarketingCampaign) });
  } catch (error) {
    next(error);
  }
});

router.post("/api/marketing-campaigns", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanMarketingCampaignPayload(request.body);
    if (!payload.name) {
      response.status(400).json({ error: "Campaign name is required." });
      return;
    }

    const now = new Date().toISOString();
    const docRef = await marketingCampaigns.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    response.status(201).json({ campaign: toMarketingCampaign(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/marketing-campaigns/:campaignId", requireAuth, async (request, response, next) => {
  try {
    const campaignId = cleanString(request.params.campaignId);
    const docRef = marketingCampaigns.doc(campaignId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Campaign was not found." });
      return;
    }

    const payload = cleanMarketingCampaignPayload(request.body);
    if (!payload.name) {
      response.status(400).json({ error: "Campaign name is required." });
      return;
    }

    await docRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    response.json({ campaign: toMarketingCampaign(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/marketing-campaigns/:campaignId", requireAuth, async (request, response, next) => {
  try {
    const campaignId = cleanString(request.params.campaignId);
    const docRef = marketingCampaigns.doc(campaignId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Campaign was not found." });
      return;
    }

    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/api/marketing-subscribers", requireAuth, async (_request, response, next) => {
  try {
    const contacts = await loadUnifiedMarketingContacts();

    response.json({
      contacts,
      subscribers: contacts,
      audienceGroups: defaultMarketingAudienceGroups
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/marketing-subscribers", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanMarketingSubscriberPayload(request.body);
    const validationError = marketingSubscriberValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }

    const subscriberId = marketingSubscriberIdForEmail(payload.email);
    const docRef = marketingSubscribers.doc(subscriberId);
    const snapshot = await docRef.get();
    if (snapshot.exists) {
      response.status(409).json({ error: "This email already has a Marketing contact record." });
      return;
    }

    const now = new Date().toISOString();
    await docRef.set({
      ...payload,
      signupSource: payload.signupSource || "Manual",
      dateSubscribed: payload.dateSubscribed || (payload.status === "Active" ? payload.consentDate : ""),
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    let contact = toMarketingSubscriber(await docRef.get());
    const mailerLiteSync = await persistPrivateMailerLiteSync(docRef, contact, request.user.email);
    contact = toMarketingSubscriber(await docRef.get());
    response.status(201).json({ contact, subscriber: contact, mailerLiteSync });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/marketing-subscribers/:subscriberId", requireAuth, async (request, response, next) => {
  try {
    const subscriberId = cleanString(request.params.subscriberId);
    const payload = cleanMarketingSubscriberPayload(request.body);
    const validationError = marketingSubscriberValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }

    const targetId = marketingSubscriberIdForEmail(payload.email);
    const currentRef = marketingSubscribers.doc(subscriberId);
    const targetRef = marketingSubscribers.doc(targetId);
    const [currentSnapshot, targetSnapshot] = await Promise.all([currentRef.get(), targetRef.get()]);
    if (targetId !== subscriberId && targetSnapshot.exists) {
      response.status(409).json({ error: "Another Marketing contact already uses this email." });
      return;
    }
    if (targetId !== subscriberId && cleanString(currentSnapshot.data()?.mailerLiteSubscriberId)) {
      response.status(409).json({ error: "Unsubscribe this MailerLite contact before changing its email address." });
      return;
    }

    const now = new Date().toISOString();
    const currentData = currentSnapshot.exists ? currentSnapshot.data() : {};
    const batch = marketingSubscribers.firestore.batch();
    batch.set(targetRef, {
      ...payload,
      mailerLiteSubscriberId: cleanString(currentData.mailerLiteSubscriberId || payload.mailerLiteSubscriberId),
      mailerLiteStatus: cleanString(currentData.mailerLiteStatus),
      mailerLiteSyncStatus: cleanString(currentData.mailerLiteSyncStatus),
      mailerLiteSyncError: cleanString(currentData.mailerLiteSyncError),
      mailerLiteLastSyncedAt: cleanString(currentData.mailerLiteLastSyncedAt),
      mailerLiteSyncMode: cleanString(currentData.mailerLiteSyncMode),
      signupSource: payload.signupSource || currentData.signupSource || "Manual",
      dateSubscribed: payload.dateSubscribed || (payload.status === "Active" ? payload.consentDate : ""),
      createdAt: currentSnapshot.data()?.createdAt || now,
      updatedAt: now,
      updatedBy: request.user.email
    });
    if (targetId !== subscriberId && currentSnapshot.exists) batch.delete(currentRef);
    await batch.commit();
    let contact = toMarketingSubscriber(await targetRef.get());
    const mailerLiteSync = await persistPrivateMailerLiteSync(targetRef, contact, request.user.email);
    contact = toMarketingSubscriber(await targetRef.get());
    response.json({ contact, subscriber: contact, mailerLiteSync });
  } catch (error) {
    next(error);
  }
});

router.get("/api/marketing/templates", requireAuth, async (_request, response, next) => {
  try {
    response.json({
      templates: await loadMessageTemplates(),
      deliveryEnabled: false
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/marketing/templates/:templateId", requireAuth, async (request, response, next) => {
  try {
    if (!canApproveMessageTemplates(request.user)) {
      response.status(403).json({ error: "Only an Admin or Manager can change message templates." });
      return;
    }

    const templateId = cleanString(request.params.templateId);
    const templates = await loadMessageTemplates();
    const index = templates.findIndex((template) => template.id === templateId);
    if (index < 0) {
      response.status(404).json({ error: "Message template was not found." });
      return;
    }

    const current = templates[index];
    const action = cleanString(request.body?.action) || "save";
    const now = new Date().toISOString();
    let updated = { ...current };

    if (action === "newDraft") {
      if (current.status !== "Approved") {
        response.status(409).json({ error: "Only an approved template needs a new draft." });
        return;
      }
      updated = {
        ...current,
        status: "Draft",
        version: current.version + 1,
        approvedAt: "",
        approvedBy: "",
        updatedAt: now,
        updatedBy: request.user.email
      };
    } else {
      if (current.status === "Approved") {
        response.status(409).json({ error: "Approved templates are locked. Create a new draft to revise this message." });
        return;
      }
      const content = cleanMessageTemplateUpdate(request.body);
      const requestedStatus = messageTemplateStatuses.has(request.body?.status)
        ? request.body.status
        : current.status;
      if (!content.emailSubject || !content.emailBody) {
        response.status(400).json({ error: "Email subject and body are required." });
        return;
      }
      if (requestedStatus === "Approved" && current.status !== "Ready for Review") {
        response.status(409).json({ error: "Move the template to Ready for Review before approving it." });
        return;
      }
      updated = {
        ...current,
        ...content,
        status: requestedStatus,
        updatedAt: now,
        updatedBy: request.user.email
      };
      if (requestedStatus === "Approved") {
        const approval = {
          version: current.version,
          emailSubject: content.emailSubject,
          emailBody: content.emailBody,
          smsBody: content.smsBody,
          approvedAt: now,
          approvedBy: request.user.email
        };
        updated.approvedAt = now;
        updated.approvedBy = request.user.email;
        updated.versions = [...current.versions, approval].slice(-messageTemplateVersionLimit);
      }
    }

    templates[index] = updated;
    await messageTemplateSettingsRef.set({
      templates,
      updatedAt: now,
      updatedBy: request.user.email
    }, { merge: true });
    response.json({ template: updated, deliveryEnabled: false });
  } catch (error) {
    next(error);
  }
});

router.get("/api/marketing/mailerlite/status", requireAuth, async (_request, response) => {
  const configuration = mailerLiteSyncConfiguration();
  response.json({
    ...await mailerLiteReadOnlyStatus(configuration.token),
    testSyncEnabled: configuration.testSyncEnabled,
    webhookEnabled: configuration.webhookEnabled,
    webhookScope: configuration.webhookScope,
    testGroupConfigured: Boolean(configuration.testGroupId),
    testAllowlistCount: configuration.testAllowlist.size,
    sendingEnabled: false
  });
});

router.post("/api/marketing/mailerlite/test-sync", requireAuth, async (request, response, next) => {
  try {
    if (!canApproveMessageTemplates(request.user)) {
      response.status(403).json({ error: "Only an Admin or Manager can run a MailerLite test sync." });
      return;
    }
    const email = cleanString(request.body?.email).toLowerCase();
    const contact = (await loadUnifiedMarketingContacts()).find((item) => item.email === email);
    if (!contact) {
      response.status(404).json({ error: "The Marketing contact was not found." });
      return;
    }
    const configuration = mailerLiteSyncConfiguration();
    const readiness = mailerLiteTestSyncReadiness(contact, configuration);
    if (!readiness.ready) {
      response.status(409).json({ error: readiness.reason });
      return;
    }
    const docRef = marketingSubscribers.doc(marketingSubscriberIdForEmail(email));
    const result = await persistPrivateMailerLiteSync(docRef, contact, request.user.email, { configuration });
    if (result.state === "error") {
      response.status(502).json({ error: result.reason });
      return;
    }
    response.json({
      synced: result.state === "synced",
      state: result.state,
      mode: "Private Test",
      email,
      groupId: configuration.testGroupId,
      sendingEnabled: false
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/public/mailerlite/webhook", async (request, response, next) => {
  try {
    const configuration = mailerLiteSyncConfiguration();
    if (!configuration.webhookEnabled) {
      response.status(503).json({ error: "MailerLite webhook processing is disabled." });
      return;
    }
    if (!configuration.webhookSecret || !["private-test", "production"].includes(configuration.webhookScope)) {
      response.status(503).json({ error: "MailerLite webhook processing is not fully configured." });
      return;
    }
    if (!verifyMailerLiteWebhookSignature(
      request.rawBody,
      request.get("Signature"),
      configuration.webhookSecret
    )) {
      response.status(401).json({ error: "Invalid MailerLite webhook signature." });
      return;
    }
    const update = mailerLiteOptOutUpdate(request.body);
    if (!update) {
      response.status(204).send();
      return;
    }
    if (configuration.webhookScope === "private-test" && !configuration.testAllowlist.has(update.email)) {
      response.status(204).send();
      return;
    }
    const now = new Date().toISOString();
    await marketingSubscribers.doc(marketingSubscriberIdForEmail(update.email)).set({
      ...update,
      normalizedEmail: update.email,
      mailerLiteSyncStatus: "provider-opt-out",
      mailerLiteSyncError: "",
      mailerLiteLastSyncedAt: now,
      mailerLiteSyncMode: configuration.webhookScope === "private-test" ? "Private Test" : "Production",
      updatedAt: now,
      updatedBy: "MailerLite webhook"
    }, { merge: true });
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

export {
  canApproveMessageTemplates,
  cleanMessageTemplateUpdate,
  mailerLiteOptOutUpdate,
  mailerLiteContactSyncIntent,
  mailerLiteSyncMetadata,
  mailerLiteReadOnlyStatus,
  mailerLiteSafeSubscriberPayload,
  mailerLiteSyncConfiguration,
  mailerLiteTestSyncReadiness,
  mergeMessageTemplates,
  syncPrivateMailerLiteContact,
  verifyMailerLiteWebhookSignature
};
export default router;
