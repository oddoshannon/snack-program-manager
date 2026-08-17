import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const projectId = String(process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || "").trim();
const requiredProjectId = "snack-crm";
const prepareConfirmation = "PREPARE PRIVATE MAILERLITE OPTOUT WEBHOOK";
const enableConfirmation = "ENABLE PRIVATE MAILERLITE OPTOUT WEBHOOK";
const confirmation = process.argv.find((value) => value.startsWith("--confirm="))?.slice(10) || "";
const webhookName = "SNACK Hub Private Opt-Out Sync";
const webhookUrl = "https://hub.snackprogram.org/api/public/mailerlite/webhook";
const webhookEvents = [
  "subscriber.unsubscribed",
  "subscriber.bounced",
  "subscriber.spam_reported"
];
const mailerLiteApiBase = "https://connect.mailerlite.com/api";
const apiTokenSecretName = "mailerlite-api-token";
const webhookSecretName = "mailerlite-webhook-secret";
const cloudRunServiceAccount = "1013266498299-compute@developer.gserviceaccount.com";

if (projectId !== requiredProjectId) {
  throw new Error(`Refusing to run for ${projectId || "an unspecified project"}. Expected ${requiredProjectId}.`);
}

if (![prepareConfirmation, enableConfirmation].includes(confirmation)) {
  console.log(`Preview only: create or reuse '${webhookName}' for ${webhookUrl}.`);
  console.log(`Events: ${webhookEvents.join(", ")}.`);
  console.log("The prepare step keeps the MailerLite webhook disabled while its signing secret is stored.");
  console.log(`Prepare with --confirm="${prepareConfirmation}".`);
  console.log(`Enable only after the signed Hub endpoint is live with --confirm="${enableConfirmation}".`);
  process.exit(0);
}

async function runGcloud(args, options = {}) {
  return execFileAsync("gcloud", args, { maxBuffer: 1024 * 1024, ...options });
}

async function loadMailerLiteToken() {
  const { stdout } = await runGcloud([
    "secrets",
    "versions",
    "access",
    "latest",
    `--secret=${apiTokenSecretName}`,
    `--project=${requiredProjectId}`
  ]);
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
  const payload = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`MailerLite webhook request failed with status ${response.status}.`);
  }
  return payload;
}

async function writeSecretVersion(secretValue) {
  let exists = true;
  try {
    await runGcloud(["secrets", "describe", webhookSecretName, `--project=${requiredProjectId}`]);
  } catch {
    exists = false;
  }

  const args = exists
    ? ["secrets", "versions", "add", webhookSecretName, `--project=${requiredProjectId}`, "--data-file=-"]
    : [
        "secrets",
        "create",
        webhookSecretName,
        `--project=${requiredProjectId}`,
        "--replication-policy=automatic",
        "--data-file=-"
      ];

  await new Promise((resolve, reject) => {
    const child = spawn("gcloud", args, { stdio: ["pipe", "ignore", "pipe"] });
    let errorOutput = "";
    child.stderr.on("data", (chunk) => {
      errorOutput += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Could not store the MailerLite webhook secret. ${errorOutput.trim()}`));
    });
    child.stdin.end(secretValue);
  });

  await runGcloud([
    "secrets",
    "add-iam-policy-binding",
    webhookSecretName,
    `--project=${requiredProjectId}`,
    `--member=serviceAccount:${cloudRunServiceAccount}`,
    "--role=roles/secretmanager.secretAccessor",
    "--quiet"
  ]);
}

async function findWebhook(token) {
  const result = await mailerLiteRequest(token, "/webhooks?limit=100");
  return (Array.isArray(result.data) ? result.data : [])
    .find((candidate) => candidate.name === webhookName || candidate.url === webhookUrl);
}

const token = await loadMailerLiteToken();
let webhook = await findWebhook(token);

if (confirmation === prepareConfirmation) {
  if (!webhook) {
    const created = await mailerLiteRequest(token, "/webhooks", {
      method: "POST",
      body: JSON.stringify({
        name: webhookName,
        url: webhookUrl,
        events: webhookEvents,
        enabled: false,
        batchable: false
      })
    });
    webhook = created.data;
  } else {
    const updated = await mailerLiteRequest(token, `/webhooks/${encodeURIComponent(webhook.id)}`, {
      method: "PUT",
      body: JSON.stringify({
        name: webhookName,
        url: webhookUrl,
        events: webhookEvents,
        enabled: false,
        batchable: false
      })
    });
    webhook = updated.data;
  }

  if (!webhook?.id || !webhook?.secret) {
    throw new Error("MailerLite did not return the webhook ID and signing secret.");
  }
  await writeSecretVersion(String(webhook.secret));
  console.log(`Prepared disabled MailerLite webhook ${webhook.id}.`);
  console.log(`Stored its signing secret as ${webhookSecretName}; the secret value was not displayed.`);
  console.log("No subscriber, campaign, or email was created or changed.");
  process.exit(0);
}

if (!webhook?.id) throw new Error("Prepare the private MailerLite webhook before enabling it.");
const enabled = await mailerLiteRequest(token, `/webhooks/${encodeURIComponent(webhook.id)}`, {
  method: "PUT",
  body: JSON.stringify({
    name: webhookName,
    url: webhookUrl,
    events: webhookEvents,
    enabled: true,
    batchable: false
  })
});
console.log(`Enabled private MailerLite opt-out webhook ${enabled.data?.id || webhook.id}.`);
console.log("No subscriber, campaign, or email was created or changed.");
