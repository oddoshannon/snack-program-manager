import express from "express";
import { adminSettings, cleanString, requireAuth } from "../lib/core.js";
import {
  clientMessageDeliveryPolicy,
  clientMessageTemplates,
  defaultClientMessageTemplateRecords
} from "../lib/client-messages.js";
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

function messageTemplateApprovalStatus(savedTemplates = []) {
  const savedById = new Map((Array.isArray(savedTemplates) ? savedTemplates : [])
    .filter((template) => template && typeof template === "object" && template.id)
    .map((template) => [String(template.id), template]));
  const expected = defaultClientMessageTemplateRecords();
  const summarize = (language) => {
    const templates = expected.filter((template) => template.language === language);
    const approvedCount = templates.filter((template) => {
      const saved = savedById.get(template.id);
      return saved?.status === "Approved"
        && Boolean(cleanString(saved.approvedAt))
        && Boolean(cleanString(saved.approvedBy));
    }).length;
    return {
      approvedCount,
      totalCount: templates.length,
      complete: approvedCount === templates.length
    };
  };
  return {
    english: summarize("English"),
    spanish: summarize("Spanish")
  };
}

function messagingLaunchConfigurationStatus({ environment = process.env, savedTemplates = [] } = {}) {
  const templates = messageTemplateApprovalStatus(savedTemplates);
  const workspaceEmail = gmailConfigurationStatus({
    serviceAccountEmail: environment.GOOGLE_GMAIL_SERVICE_ACCOUNT_EMAIL,
    senderEmail: environment.GOOGLE_GMAIL_SENDER_EMAIL,
    senderName: environment.GOOGLE_GMAIL_SENDER_NAME,
    replyTo: environment.GOOGLE_GMAIL_REPLY_TO,
    automaticDeliveryEnabled: environment.GOOGLE_GMAIL_DELIVERY_ENABLED
  });
  const azure = azureCommunicationConfigurationStatus(environment);
  const reminderAutomationReady = enabledEnvironmentValue(environment.MESSAGING_REMINDER_AUTOMATION_READY);
  const deliveryLoggingReady = enabledEnvironmentValue(environment.MESSAGING_DELIVERY_LOGGING_READY);
  const productionApproved = enabledEnvironmentValue(environment.MESSAGING_PRODUCTION_APPROVED);
  const checklist = [
    {
      id: "english-templates",
      label: `English service templates approved and locked (${templates.english.approvedCount}/${templates.english.totalCount})`,
      complete: templates.english.complete
    },
    {
      id: "spanish-templates",
      label: `Spanish family templates approved and locked (${templates.spanish.approvedCount}/${templates.spanish.totalCount})`,
      complete: templates.spanish.complete
    },
    { id: "workspace-email", label: "Google Workspace service-email sender verified", complete: workspaceEmail.configured },
    { id: "consent", label: "Separate service-email, service-text, and Marketing consent gates are active", complete: true },
    { id: "reminder-automation", label: "Booking confirmations and 48-hour email / 6-hour text reminders tested", complete: reminderAutomationReady },
    { id: "azure", label: "Azure number, registration, inbound events, and calling are ready", complete: azure.ready },
    { id: "delivery-logging", label: "Delivered, failed, replied, and opt-out logging passed controlled tests", complete: deliveryLoggingReady },
    { id: "production-approval", label: "Executive Director production approval recorded", complete: productionApproved }
  ];
  const completedCount = checklist.filter((item) => item.complete).length;
  const ready = completedCount === checklist.length;
  const deliveryEnabled = ready
    && workspaceEmail.automaticDeliveryEnabled
    && azure.deliveryEnabled;
  return {
    ready,
    safeMode: !deliveryEnabled,
    deliveryEnabled,
    completedCount,
    totalCount: checklist.length,
    checklist,
    templates,
    connectionMode: ready
      ? deliveryEnabled
        ? "All launch gates passed and production delivery is enabled"
        : "All launch gates passed; production delivery remains off"
      : `${completedCount} of ${checklist.length} messaging launch gates complete; family delivery remains off`
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

router.get("/api/reminders/launch-status", requireAuth, async (_request, response, next) => {
  try {
    const snapshot = await adminSettings.doc("messageTemplates").get();
    const savedTemplates = snapshot.exists && Array.isArray(snapshot.data()?.templates)
      ? snapshot.data().templates
      : [];
    response.json(messagingLaunchConfigurationStatus({ savedTemplates }));
  } catch (error) {
    next(error);
  }
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

export {
  azureCommunicationConfigurationStatus,
  messageTemplateApprovalStatus,
  messagingLaunchConfigurationStatus
};
export default router;
