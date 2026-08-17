import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Firestore } from "@google-cloud/firestore";
import { marketingSubscriberIdForEmail } from "../lib/core.js";

const execFileAsync = promisify(execFile);
const projectId = String(process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || "").trim();
const requiredProjectId = "snack-crm";
const confirmation = process.argv.find((value) => value.startsWith("--confirm="))?.slice(10) || "";
const requiredConfirmation = "SYNC DIRECTOR MAILERLITE TEST";
const testEmail = "director@snackprogram.org";
const testGroupName = "SNACK Hub Private Test - Do Not Send";
const mailerLiteApiBase = "https://connect.mailerlite.com/api";

if (projectId !== requiredProjectId) {
  throw new Error(`Refusing to run for ${projectId || "an unspecified project"}. Expected ${requiredProjectId}.`);
}

if (confirmation !== requiredConfirmation) {
  console.log(`Preview only: create or reuse '${testGroupName}' and sync only ${testEmail}.`);
  console.log(`Run again with --confirm="${requiredConfirmation}" to apply these exact changes.`);
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
  if (!response.ok) {
    throw new Error(`MailerLite request failed with status ${response.status}.`);
  }
  return response.status === 204 ? {} : response.json();
}

function pacificDateString() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

const token = await loadMailerLiteToken();
const groupsResult = await mailerLiteRequest(token, "/groups?limit=100");
let group = (Array.isArray(groupsResult.data) ? groupsResult.data : [])
  .find((candidate) => candidate.name === testGroupName);

if (!group) {
  const created = await mailerLiteRequest(token, "/groups", {
    method: "POST",
    body: JSON.stringify({ name: testGroupName })
  });
  group = created.data;
}

if (!group?.id) throw new Error("MailerLite did not return the private test group ID.");

const subscriberResult = await mailerLiteRequest(token, "/subscribers", {
  method: "POST",
  body: JSON.stringify({
    email: testEmail,
    fields: {
      name: "Shannon",
      last_name: "Oddo"
    },
    groups: [String(group.id)]
  })
});

const now = new Date().toISOString();
const consentDate = pacificDateString();
const firestore = new Firestore({ projectId: requiredProjectId });
await firestore.collection("marketingSubscribers").doc(marketingSubscriberIdForEmail(testEmail)).set({
  fullName: "Shannon Oddo",
  firstName: "Shannon",
  lastName: "Oddo",
  email: testEmail,
  normalizedEmail: testEmail,
  communicationPreference: "Email",
  status: "Active",
  audienceGroups: ["Newsletter"],
  tags: ["Newsletter"],
  emailOptOut: false,
  signupSource: "Controlled MailerLite test",
  consentSource: "Direct approval for controlled MailerLite test",
  consentDate,
  dateSubscribed: consentDate,
  mailerLiteSubscriberId: String(subscriberResult.data?.id || ""),
  mailerLiteStatus: String(subscriberResult.data?.status || "active").toLowerCase(),
  mailerLiteSyncStatus: "synced",
  mailerLiteSyncError: "",
  mailerLiteLastSyncedAt: now,
  mailerLiteSyncMode: "Private Test",
  updatedAt: now,
  updatedBy: "controlled-mailerlite-test"
}, { merge: true });

console.log(`Private MailerLite test group ready: ${group.id}`);
console.log(`Synced exactly one approved address: ${testEmail}`);
console.log("No campaign or email was created or sent.");
