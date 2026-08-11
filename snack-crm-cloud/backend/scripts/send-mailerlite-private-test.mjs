import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const projectId = String(process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || "").trim();
const requiredProjectId = "snack-crm";
const confirmation = process.argv.find((value) => value.startsWith("--confirm="))?.slice(10) || "";
const verificationCampaignId = process.argv.find((value) => value.startsWith("--verify-campaign="))?.slice(18) || "";
const requiredConfirmation = "SEND ONE MAILERLITE TEST TO DIRECTOR";
const testEmail = "director@snackprogram.org";
const testGroupId = "195482882036204989";
const mailerLiteApiBase = "https://connect.mailerlite.com/api";

if (projectId !== requiredProjectId) {
  throw new Error(`Refusing to run for ${projectId || "an unspecified project"}. Expected ${requiredProjectId}.`);
}

if (verificationCampaignId && !/^\d+$/.test(verificationCampaignId)) {
  throw new Error("The verification campaign ID must contain digits only.");
}

if (!verificationCampaignId && confirmation !== requiredConfirmation) {
  console.log(`Preview only: send one clearly labeled MailerLite test to ${testEmail}.`);
  console.log(`The campaign is restricted to private group ${testGroupId} and will refuse any other recipient.`);
  console.log(`Run again with --confirm="${requiredConfirmation}" to create and send it.`);
  process.exit(0);
}

async function loadMailerLiteToken() {
  const { stdout } = await execFileAsync("gcloud", [
    "secrets",
    "versions",
    "access",
    "latest",
    "--secret=mailerlite-api-token",
    `--project=${requiredProjectId}`
  ], { maxBuffer: 1024 * 1024 });
  const token = stdout.trim();
  if (!token) throw new Error("The MailerLite API token could not be loaded.");
  return token;
}

async function mailerLiteRequest(token, path, options = {}) {
  const response = await fetch(`${mailerLiteApiBase}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });
  const result = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = result?.message || Object.values(result?.errors || {}).flat().join(" ") || "Unknown provider error";
    throw new Error(`MailerLite request failed with status ${response.status}: ${detail}`);
  }
  return result;
}

const token = await loadMailerLiteToken();

if (verificationCampaignId) {
  const campaign = await mailerLiteRequest(token, `/campaigns/${verificationCampaignId}`);
  console.log(`Campaign ${verificationCampaignId} provider status: ${campaign.data?.status || "unknown"}`);
  console.log(`Sent count: ${campaign.data?.emails?.[0]?.stats?.sent || campaign.data?.stats?.sent || 0}`);
  console.log(`Currently sending: ${Boolean(campaign.data?.is_currently_sending_out)}`);
  console.log(`Send after: ${campaign.data?.send_after || "not reported"}`);
  const missingData = Array.isArray(campaign.data?.missing_data) ? campaign.data.missing_data : [];
  console.log(`Missing data: ${missingData.length ? missingData.join(", ") : "none"}`);
  process.exit(0);
}

const subscribersResult = await mailerLiteRequest(token, `/groups/${testGroupId}/subscribers?limit=100`);
const recipients = (Array.isArray(subscribersResult.data) ? subscribersResult.data : [])
  .filter((subscriber) => subscriber.status === "active")
  .map((subscriber) => String(subscriber.email || "").trim().toLowerCase());

if (recipients.length !== 1 || recipients[0] !== testEmail) {
  throw new Error(`Refusing to send: private group must contain exactly ${testEmail}.`);
}

const created = await mailerLiteRequest(token, "/campaigns", {
  method: "POST",
  body: JSON.stringify({
    name: "SNACK Hub private connection test - August 2026",
    type: "regular",
    groups: [testGroupId],
    emails: [{
      subject: "[TEST] SNACK Hub MailerLite connection",
      from_name: "The SNACK Program",
      from: testEmail,
      reply_to: testEmail,
      content: [
        "<h1>SNACK Hub MailerLite test</h1>",
        "<p>This is a controlled, one-recipient delivery test for the SNACK Program Hub.</p>",
        "<p>No client or family information is included. Receiving this message confirms the private MailerLite connection can deliver to the approved test inbox.</p>",
        "<p>The SNACK Program</p>"
      ].join("")
    }]
  })
});

const campaignId = String(created.data?.id || "");
if (!campaignId) throw new Error("MailerLite did not return a campaign ID.");

const missingData = Array.isArray(created.data?.missing_data) ? created.data.missing_data : [];
if (missingData.length) {
  throw new Error(`MailerLite created draft ${campaignId} but will not send because it reports missing data: ${missingData.join(", ")}.`);
}

const sent = await mailerLiteRequest(token, `/campaigns/${campaignId}/schedule`, {
  method: "POST",
  body: JSON.stringify({ delivery: "instant" })
});

console.log(`Sent controlled MailerLite campaign ${campaignId}.`);
console.log(`Verified recipient: ${testEmail}`);
console.log(`Provider status: ${sent.data?.status || "accepted"}`);
