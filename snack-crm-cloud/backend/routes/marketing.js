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
const mailerLiteGroupsUrl = "https://connect.mailerlite.com/api/groups?limit=1";
const mailerLiteSubscribersUrl = "https://connect.mailerlite.com/api/subscribers";
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
    testAllowlist,
    testSyncEnabled: environment.MAILERLITE_TEST_SYNC_ENABLED === "true",
    webhookEnabled: environment.MAILERLITE_WEBHOOK_ENABLED === "true",
    sendingEnabled: false
  };
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
  const eventType = cleanString(event.type);
  const subscriber = event.data?.subscriber || event.data || {};
  const email = cleanString(subscriber.email).toLowerCase();
  const optOutEvents = new Set([
    "subscriber.unsubscribed",
    "subscriber.bounced",
    "subscriber.spam_reported",
    "subscriber.deleted"
  ]);
  if (!optOutEvents.has(eventType) || !email) return null;
  return {
    email,
    mailerLiteSubscriberId: cleanString(subscriber.id),
    status: "Unsubscribed",
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
    const contact = toMarketingSubscriber(await docRef.get());
    response.status(201).json({ contact, subscriber: contact });
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

    const now = new Date().toISOString();
    const batch = marketingSubscribers.firestore.batch();
    batch.set(targetRef, {
      ...payload,
      signupSource: payload.signupSource || currentSnapshot.data()?.signupSource || "Manual",
      dateSubscribed: payload.dateSubscribed || (payload.status === "Active" ? payload.consentDate : ""),
      createdAt: currentSnapshot.data()?.createdAt || now,
      updatedAt: now,
      updatedBy: request.user.email
    });
    if (targetId !== subscriberId && currentSnapshot.exists) batch.delete(currentRef);
    await batch.commit();
    const contact = toMarketingSubscriber(await targetRef.get());
    response.json({ contact, subscriber: contact });
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
    const payload = mailerLiteSafeSubscriberPayload(contact, configuration.testGroupId);
    const providerResponse = await fetch(mailerLiteSubscribersUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${configuration.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    if (!providerResponse.ok) {
      response.status(502).json({ error: "MailerLite did not accept the private test contact." });
      return;
    }
    const result = await providerResponse.json();
    const providerSubscriber = result?.data || {};
    const now = new Date().toISOString();
    await marketingSubscribers.doc(marketingSubscriberIdForEmail(email)).set({
      mailerLiteSubscriberId: cleanString(providerSubscriber.id),
      mailerLiteLastSyncedAt: now,
      mailerLiteSyncMode: "Private Test",
      updatedAt: now,
      updatedBy: request.user.email
    }, { merge: true });
    response.json({
      synced: true,
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
    const now = new Date().toISOString();
    await marketingSubscribers.doc(marketingSubscriberIdForEmail(update.email)).set({
      ...update,
      normalizedEmail: update.email,
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
  mailerLiteReadOnlyStatus,
  mailerLiteSafeSubscriberPayload,
  mailerLiteSyncConfiguration,
  mailerLiteTestSyncReadiness,
  mergeMessageTemplates,
  verifyMailerLiteWebhookSignature
};
export default router;
