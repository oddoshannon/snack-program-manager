import express from "express";
import { cleanString, requireAuth } from "../lib/core.js";
import { clientMessageDeliveryPolicy, clientMessageTemplates } from "../lib/client-messages.js";
import { gmailConfigurationStatus, sendGmailMessage } from "../lib/gmail-sender.js";

const router = express.Router();
const twilioTestFromNumber = "+15005550006";
const twilioTestToNumber = "+15005550006";

function twilioTestConfigurationStatus(
  accountSidValue = process.env.TWILIO_TEST_ACCOUNT_SID,
  authTokenValue = process.env.TWILIO_TEST_AUTH_TOKEN
) {
  const accountSid = cleanString(accountSidValue);
  const authToken = cleanString(authTokenValue);
  const configured = Boolean(accountSid && authToken);
  return {
    provider: "Twilio",
    configured,
    connected: false,
    simulated: true,
    deliveryEnabled: false,
    connectionMode: configured
      ? "Test details stored; ready for a no-send test"
      : "Twilio test details have not been configured"
  };
}

async function twilioSimulatedSmsTest(
  accountSidValue = process.env.TWILIO_TEST_ACCOUNT_SID,
  authTokenValue = process.env.TWILIO_TEST_AUTH_TOKEN,
  fetchImpl = globalThis.fetch
) {
  const accountSid = cleanString(accountSidValue);
  const authToken = cleanString(authTokenValue);
  const base = twilioTestConfigurationStatus(accountSid, authToken);
  if (!base.configured) return base;
  if (typeof fetchImpl !== "function") {
    return { ...base, connectionMode: "Twilio could not be reached" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const requestBody = new URLSearchParams({
      From: twilioTestFromNumber,
      To: twilioTestToNumber,
      Body: "SNACK reminder connection test. Twilio test details prevent delivery."
    });
    const providerResponse = await fetchImpl(
      `https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(accountSid)}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: requestBody.toString(),
        signal: controller.signal
      }
    );
    if (providerResponse.ok) {
      return {
        ...base,
        connected: true,
        connectionMode: "Safe Twilio test passed; no text was sent"
      };
    }
    if ([401, 403].includes(providerResponse.status)) {
      return { ...base, connectionMode: "Twilio rejected the test details" };
    }
    return { ...base, connectionMode: "The safe Twilio test did not pass" };
  } catch {
    return { ...base, connectionMode: "Twilio could not be reached" };
  } finally {
    clearTimeout(timeout);
  }
}

router.get("/api/reminders/twilio/status", requireAuth, (_request, response) => {
  response.json(twilioTestConfigurationStatus());
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

router.post("/api/reminders/twilio/test", requireAuth, async (request, response) => {
  if (cleanString(request.body?.confirmation) !== "TEST TWILIO WITHOUT SENDING") {
    response.status(400).json({ error: "The safe Twilio test confirmation is required." });
    return;
  }
  response.json(await twilioSimulatedSmsTest());
});

export { twilioSimulatedSmsTest, twilioTestConfigurationStatus };
export default router;
