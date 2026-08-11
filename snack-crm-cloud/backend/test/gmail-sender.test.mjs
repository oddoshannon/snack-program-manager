import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRawGmailMessage,
  domainWideGmailAccessToken,
  gmailConfigurationStatus,
  sendGmailMessage
} from "../lib/gmail-sender.js";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

test("gmail status keeps automatic delivery separate from controlled tests", () => {
  assert.deepEqual(gmailConfigurationStatus({
    serviceAccountEmail: "snack-hub-mailer@snack-crm.iam.gserviceaccount.com",
    senderEmail: "appointments@snackprogram.org",
    replyTo: "director@snackprogram.org",
    automaticDeliveryEnabled: false
  }), {
    provider: "Google Workspace Gmail",
    configured: true,
    connected: true,
    sendingEnabled: true,
    automaticDeliveryEnabled: false,
    senderEmail: "appointments@snackprogram.org",
    replyTo: "director@snackprogram.org",
    connectionMode: "Connected for controlled tests; automatic delivery remains off"
  });
});

test("raw Gmail message includes the dedicated sender, reply address, and both bodies", () => {
  const raw = buildRawGmailMessage({
    senderEmail: "appointments@snackprogram.org",
    senderName: "SNACK Program",
    replyTo: "director@snackprogram.org",
    to: "shannon@snackprogram.org",
    subject: "Safe test",
    text: "Plain test",
    html: "<p>HTML test</p>"
  });
  const mime = Buffer.from(raw, "base64url").toString("utf8");
  assert.match(mime, /From: .* <appointments@snackprogram\.org>/);
  assert.match(mime, /To: shannon@snackprogram\.org/);
  assert.match(mime, /Reply-To: director@snackprogram\.org/);
  assert.ok(mime.includes(Buffer.from("Plain test").toString("base64")));
  assert.ok(mime.includes(Buffer.from("<p>HTML test</p>").toString("base64")));
});

test("domain-wide token request uses only the approved Gmail send scope", async () => {
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url: String(url), options });
    return requests.length === 1
      ? jsonResponse({ signedJwt: "signed-assertion" })
      : jsonResponse({ access_token: "delegated-token" });
  };
  const token = await domainWideGmailAccessToken({
    serviceAccountEmail: "snack-hub-mailer@snack-crm.iam.gserviceaccount.com",
    senderEmail: "appointments@snackprogram.org",
    signerAccessToken: "cloud-token",
    nowSeconds: 1_700_000_000,
    fetchImpl
  });
  assert.equal(token, "delegated-token");
  const signedPayload = JSON.parse(JSON.parse(requests[0].options.body).payload);
  assert.equal(signedPayload.sub, "appointments@snackprogram.org");
  assert.equal(signedPayload.scope, "https://www.googleapis.com/auth/gmail.send");
  assert.equal(signedPayload.exp - signedPayload.iat, 3600);
  assert.equal(new URLSearchParams(requests[1].options.body).get("assertion"), "signed-assertion");
});

test("controlled Gmail test sends while automatic delivery remains disabled", async () => {
  const requests = [];
  const fetchImpl = async (url, options) => {
    requests.push({ url: String(url), options });
    if (requests.length === 1) return jsonResponse({ signedJwt: "signed-assertion" });
    if (requests.length === 2) return jsonResponse({ access_token: "delegated-token" });
    return jsonResponse({ id: "message-1", threadId: "thread-1" });
  };
  const sent = await sendGmailMessage({
    to: "director@snackprogram.org",
    subject: "Connection test",
    text: "No client information."
  }, {
    serviceAccountEmail: "snack-hub-mailer@snack-crm.iam.gserviceaccount.com",
    senderEmail: "appointments@snackprogram.org",
    senderName: "SNACK Program",
    replyTo: "director@snackprogram.org",
    automaticDeliveryEnabled: false,
    allowWhenDisabled: true,
    signerAccessToken: "cloud-token",
    fetchImpl
  });
  assert.equal(sent.id, "message-1");
  assert.equal(sent.automaticDeliveryEnabled, false);
  assert.match(requests[2].url, /gmail\/v1\/users\/appointments%40snackprogram\.org\/messages\/send$/);
});

test("ordinary message delivery stays blocked until explicitly enabled", async () => {
  await assert.rejects(() => sendGmailMessage({
    to: "director@snackprogram.org",
    subject: "Blocked",
    text: "Blocked"
  }, {
    serviceAccountEmail: "snack-hub-mailer@snack-crm.iam.gserviceaccount.com",
    senderEmail: "appointments@snackprogram.org",
    automaticDeliveryEnabled: false
  }), /Automatic email delivery is not enabled/);
});
