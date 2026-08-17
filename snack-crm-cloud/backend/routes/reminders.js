import express from "express";
import { cleanString, requireAuth } from "../lib/core.js";
import { clientMessageDeliveryPolicy, clientMessageTemplates } from "../lib/client-messages.js";
import { gmailConfigurationStatus, sendGmailMessage } from "../lib/gmail-sender.js";

const router = express.Router();

function enabledEnvironmentValue(value) {
  return cleanString(value).toLowerCase() === "true";
}

function azureCommunicationConfigurationStatus(environment = process.env) {
  const resourceConfigured = Boolean(cleanString(environment.AZURE_COMMUNICATIONS_CONNECTION_STRING));
  const numberConfigured = Boolean(cleanString(environment.AZURE_COMMUNICATIONS_PHONE_NUMBER));
  const tenDlcRegistered = enabledEnvironmentValue(environment.AZURE_COMMUNICATIONS_TEN_DLC_REGISTERED);
  const inboundWebhookConfigured = enabledEnvironmentValue(environment.AZURE_COMMUNICATIONS_EVENT_GRID_CONFIGURED);
  const callingConfigured = enabledEnvironmentValue(environment.AZURE_COMMUNICATIONS_CALLING_READY);
  const requestedReady = enabledEnvironmentValue(environment.AZURE_COMMUNICATIONS_READY);
  const deliveryEnabled = enabledEnvironmentValue(environment.AZURE_COMMUNICATIONS_DELIVERY_ENABLED);
  const ready = resourceConfigured
    && numberConfigured
    && tenDlcRegistered
    && inboundWebhookConfigured
    && callingConfigured
    && requestedReady;
  const checklist = [
    { id: "resource", label: "Azure resource secret stored", complete: resourceConfigured },
    { id: "number", label: "SNACK phone number assigned", complete: numberConfigured },
    { id: "registration", label: "10DLC brand and campaign approved", complete: tenDlcRegistered },
    { id: "inbound", label: "Incoming text and delivery events connected", complete: inboundWebhookConfigured },
    { id: "calling", label: "Hub calling connection tested", complete: callingConfigured },
    { id: "approval", label: "SNACK production-readiness approval recorded", complete: requestedReady }
  ];
  const completedCount = checklist.filter((item) => item.complete).length;
  return {
    provider: "Azure Communication Services",
    configured: resourceConfigured,
    connected: ready,
    ready,
    deliveryEnabled: ready && deliveryEnabled,
    deliveryRequested: deliveryEnabled,
    safeMode: !(ready && deliveryEnabled),
    checklist,
    completedCount,
    totalCount: checklist.length,
    connectionMode: ready
      ? deliveryEnabled
        ? "Azure Communications is ready and production delivery is enabled"
        : "All readiness checks passed; production delivery remains off"
      : `${completedCount} of ${checklist.length} readiness checks complete; production delivery remains off`
  };
}

router.get("/api/reminders/azure/status", requireAuth, (_request, response) => {
  response.json(azureCommunicationConfigurationStatus());
});

router.get("/api/reminders/policy", requireAuth, (_request, response) => {
  response.json({
    deliveryPolicy: clientMessageDeliveryPolicy,
    templateNames: Object.keys(clientMessageTemplates())
  });
});

router.get("/api/reminders/email/status", requireAuth, (_request, response) => {
  response.json(gmailConfigurationStatus());
});

router.post("/api/reminders/email/test", requireAuth, async (request, response, next) => {
  try {
    if (!["Admin", "Manager"].includes(String(request.user?.accessLevelId || request.user?.accessLevelName || ""))) {
      response.status(403).json({ error: "Only an Admin or Manager can send a Workspace test email." });
      return;
    }
    if (cleanString(request.body?.confirmation) !== "SEND SAFE WORKSPACE TEST") {
      response.status(400).json({ error: "The safe Workspace email test confirmation is required." });
      return;
    }
    const recipient = cleanString(request.user?.email).toLowerCase();
    const sent = await sendGmailMessage({
      to: recipient,
      subject: "SNACK Program Hub email connection test",
      text: "This is a controlled test from appointments@snackprogram.org. No client information is included, and automatic email delivery remains off.",
      html: "<p>This is a controlled test from <strong>appointments@snackprogram.org</strong>.</p><p>No client information is included, and automatic email delivery remains off.</p>"
    }, { allowWhenDisabled: true });
    response.json({
      sent: true,
      recipient,
      senderEmail: sent.from,
      replyTo: sent.replyTo,
      automaticDeliveryEnabled: sent.automaticDeliveryEnabled
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/reminders/azure/readiness-test", requireAuth, async (request, response) => {
  if (cleanString(request.body?.confirmation) !== "CHECK AZURE WITHOUT SENDING") {
    response.status(400).json({ error: "The Azure no-send readiness confirmation is required." });
    return;
  }
  response.json({ ...azureCommunicationConfigurationStatus(), messageSent: false, callPlaced: false });
});

export { azureCommunicationConfigurationStatus };
export default router;
