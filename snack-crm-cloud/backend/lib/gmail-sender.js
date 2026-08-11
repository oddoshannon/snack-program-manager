import { GoogleAuth } from "google-auth-library";
import { randomUUID } from "node:crypto";

const gmailSendScope = "https://www.googleapis.com/auth/gmail.send";
const googleCloudScope = "https://www.googleapis.com/auth/cloud-platform";
const oauthTokenUrl = "https://oauth2.googleapis.com/token";

function cleanHeaderValue(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function cleanEmailAddress(value) {
  const address = cleanHeaderValue(value).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address) ? address : "";
}

function base64Url(value) {
  return Buffer.from(value).toString("base64url");
}

function encodedHeader(value) {
  const text = cleanHeaderValue(value);
  return `=?UTF-8?B?${Buffer.from(text).toString("base64")}?=`;
}

function gmailConfiguration(options = {}) {
  return {
    serviceAccountEmail: cleanEmailAddress(options.serviceAccountEmail || process.env.GOOGLE_GMAIL_SERVICE_ACCOUNT_EMAIL),
    senderEmail: cleanEmailAddress(options.senderEmail || process.env.GOOGLE_GMAIL_SENDER_EMAIL),
    senderName: cleanHeaderValue(options.senderName || process.env.GOOGLE_GMAIL_SENDER_NAME || "SNACK Program"),
    replyTo: cleanEmailAddress(options.replyTo || process.env.GOOGLE_GMAIL_REPLY_TO),
    automaticDeliveryEnabled: String(options.automaticDeliveryEnabled ?? process.env.GOOGLE_GMAIL_DELIVERY_ENABLED) === "true"
  };
}

function gmailConfigurationStatus(options = {}) {
  const configuration = gmailConfiguration(options);
  const configured = Boolean(configuration.serviceAccountEmail && configuration.senderEmail);
  return {
    provider: "Google Workspace Gmail",
    configured,
    connected: configured,
    sendingEnabled: configured,
    automaticDeliveryEnabled: configured && configuration.automaticDeliveryEnabled,
    senderEmail: configuration.senderEmail,
    replyTo: configuration.replyTo,
    connectionMode: configured
      ? configuration.automaticDeliveryEnabled
        ? "Connected; approved automatic delivery is enabled"
        : "Connected for controlled tests; automatic delivery remains off"
      : "Google Workspace sender has not been configured"
  };
}

function buildRawGmailMessage({ senderEmail, senderName, replyTo, to, subject, text, html }) {
  const fromAddress = cleanEmailAddress(senderEmail);
  const toAddress = cleanEmailAddress(to);
  const replyAddress = cleanEmailAddress(replyTo);
  if (!fromAddress || !toAddress) throw new Error("A valid sender and recipient are required.");

  const boundary = `snack_${randomUUID().replaceAll("-", "")}`;
  const headers = [
    `From: ${encodedHeader(senderName || "SNACK Program")} <${fromAddress}>`,
    `To: ${toAddress}`,
    `Subject: ${encodedHeader(subject || "SNACK Program message")}`,
    ...(replyAddress ? [`Reply-To: ${replyAddress}`] : []),
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`
  ];
  const message = [
    ...headers,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(String(text || "")).toString("base64"),
    `--${boundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(String(html || `<p>${String(text || "")}</p>`)).toString("base64"),
    `--${boundary}--`,
    ""
  ].join("\r\n");
  return base64Url(message);
}

async function responseJson(response, fallbackMessage) {
  const body = await response.json().catch(() => ({}));
  if (response.ok) return body;
  const error = new Error(fallbackMessage);
  error.statusCode = response.status;
  error.providerCode = body?.error?.status || body?.error || "";
  throw error;
}

async function defaultSignerAccessToken() {
  const auth = new GoogleAuth({ scopes: [googleCloudScope] });
  const client = await auth.getClient();
  const tokenResult = await client.getAccessToken();
  const token = typeof tokenResult === "string" ? tokenResult : tokenResult?.token;
  if (!token) throw new Error("The Hub could not obtain its Google Cloud identity token.");
  return token;
}

async function domainWideGmailAccessToken({
  serviceAccountEmail,
  senderEmail,
  fetchImpl = globalThis.fetch,
  signerAccessToken = "",
  nowSeconds = Math.floor(Date.now() / 1000)
}) {
  const signerEmail = cleanEmailAddress(serviceAccountEmail);
  const subjectEmail = cleanEmailAddress(senderEmail);
  if (!signerEmail || !subjectEmail) throw new Error("The Gmail service account and sender must be configured.");
  if (typeof fetchImpl !== "function") throw new Error("Google Workspace could not be reached.");

  const accessToken = signerAccessToken || await defaultSignerAccessToken();
  const claims = {
    iss: signerEmail,
    sub: subjectEmail,
    scope: gmailSendScope,
    aud: oauthTokenUrl,
    iat: nowSeconds,
    exp: nowSeconds + 3600
  };
  const signResponse = await fetchImpl(
    `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(signerEmail)}:signJwt`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ payload: JSON.stringify(claims) })
    }
  );
  const signed = await responseJson(signResponse, "The Hub could not sign the Google Workspace request.");
  if (!signed.signedJwt) throw new Error("Google did not return a signed Workspace request.");

  const tokenBody = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: signed.signedJwt
  });
  const tokenResponse = await fetchImpl(oauthTokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: tokenBody.toString()
  });
  const delegated = await responseJson(tokenResponse, "Google Workspace did not authorize the appointments sender.");
  if (!delegated.access_token) throw new Error("Google Workspace did not return a Gmail access token.");
  return delegated.access_token;
}

async function sendGmailMessage(message = {}, options = {}) {
  const configuration = gmailConfiguration(options);
  const recipient = cleanEmailAddress(message.to);
  if (!recipient) throw new Error("Enter a valid recipient email address.");
  if (!configuration.automaticDeliveryEnabled && !options.allowWhenDisabled) {
    const error = new Error("Automatic email delivery is not enabled.");
    error.statusCode = 409;
    throw error;
  }

  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const accessToken = await domainWideGmailAccessToken({
    serviceAccountEmail: configuration.serviceAccountEmail,
    senderEmail: configuration.senderEmail,
    fetchImpl,
    signerAccessToken: options.signerAccessToken,
    nowSeconds: options.nowSeconds
  });
  const raw = buildRawGmailMessage({
    senderEmail: configuration.senderEmail,
    senderName: configuration.senderName,
    replyTo: configuration.replyTo,
    to: recipient,
    subject: message.subject,
    text: message.text,
    html: message.html
  });
  const sendResponse = await fetchImpl(
    `https://gmail.googleapis.com/gmail/v1/users/${encodeURIComponent(configuration.senderEmail)}/messages/send`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ raw })
    }
  );
  const sent = await responseJson(sendResponse, "Google Workspace could not send the email.");
  return {
    id: String(sent.id || ""),
    threadId: String(sent.threadId || ""),
    from: configuration.senderEmail,
    to: recipient,
    replyTo: configuration.replyTo,
    automaticDeliveryEnabled: configuration.automaticDeliveryEnabled
  };
}

export {
  buildRawGmailMessage,
  cleanEmailAddress,
  domainWideGmailAccessToken,
  gmailConfiguration,
  gmailConfigurationStatus,
  gmailSendScope,
  sendGmailMessage
};
