import { Firestore } from "@google-cloud/firestore";

const requiredProjectId = "snack-crm";
const projectId = String(
  process.env.GOOGLE_CLOUD_PROJECT
  || process.env.GCLOUD_PROJECT
  || process.env.PROJECT_ID
  || ""
).trim();
const confirmation = process.argv.find((argument) => argument.startsWith("--confirm="))?.slice(10) || "";
const requiredConfirmation = "UPDATE APPROVED MESSAGE WORDING";

if (projectId !== requiredProjectId) {
  throw new Error(`Refusing to run for ${projectId || "an unspecified project"}. Expected ${requiredProjectId}.`);
}

function replaceApprovedWords(value = "") {
  return String(value)
    .replaceAll("[Response Window]", "one week")
    .replaceAll("Kids Nutrition & Cooking Class", "Kids Cooking + Nutrition Class");
}

function replaceKitchenTime(value = "") {
  return replaceApprovedWords(value)
    .replace(/\bat \[Time\]/g, "from [Start Time] to [End Time]")
    .replace(/5:30\s*[-–]\s*7:30\s*p\.?m\.?/gi, "[Start Time] to [End Time]");
}

function updateTemplate(template = {}) {
  const updated = { ...template };
  const fields = ["emailSubject", "emailBody", "smsBody"];
  for (const field of fields) {
    const value = String(updated[field] || "");
    const revised = template.id?.startsWith("kitchen")
      ? replaceKitchenTime(value)
      : replaceApprovedWords(value);
    const correctedDate = field === "smsBody"
      ? revised.replaceAll("[Weekday, Month Day, Year]", "[Short Date]").replaceAll("[Weekday, Month Day]", "[Short Date]")
      : revised.replaceAll("[Weekday, Month Day, Year]", "[Weekday, Month Day]");
    updated[field] = template.id === "kitchenWaitlistOffer"
      ? correctedDate.replaceAll("[Private Management Link]", "[Private Offer Link]")
      : correctedDate;
  }
  return updated;
}

function updateKitchenClassName(value = "") {
  return String(value).replace(/^Kids Nutrition & Cooking Class\b/i, "Kids Cooking + Nutrition Class");
}

const firestore = new Firestore({ projectId });
const templatesRef = firestore.collection("adminSettings").doc("messageTemplates");
const schedulingRef = firestore.collection("adminSettings").doc("scheduling");
const [templatesSnapshot, schedulingSnapshot, kitchenSessionsSnapshot] = await Promise.all([
  templatesRef.get(),
  schedulingRef.get(),
  firestore.collection("programSessions").where("program", "==", "Kitchen").get()
]);

const savedTemplates = Array.isArray(templatesSnapshot.data()?.templates)
  ? templatesSnapshot.data().templates
  : [];
const updatedTemplates = savedTemplates.map(updateTemplate);
const changedTemplateNames = updatedTemplates
  .filter((template, index) => JSON.stringify(template) !== JSON.stringify(savedTemplates[index]))
  .map((template) => template.name || template.id);

const schedulingData = schedulingSnapshot.data() || {};
const savedClassTypes = Array.isArray(schedulingData.kitchenClassTypes)
  ? schedulingData.kitchenClassTypes
  : [];
const updatedClassTypes = savedClassTypes.map((classType) => ({
  ...classType,
  label: updateKitchenClassName(classType.label)
}));
const schedulingChanged = JSON.stringify(updatedClassTypes) !== JSON.stringify(savedClassTypes);

const sessionUpdates = kitchenSessionsSnapshot.docs.map((document) => {
  const data = document.data();
  const title = updateKitchenClassName(data.title);
  const classTypeLabel = updateKitchenClassName(data.classTypeLabel);
  return {
    ref: document.ref,
    changes: {
      ...(title !== data.title ? { title } : {}),
      ...(classTypeLabel !== data.classTypeLabel ? { classTypeLabel } : {})
    }
  };
}).filter(({ changes }) => Object.keys(changes).length);

console.log(`Templates to update: ${changedTemplateNames.length}${changedTemplateNames.length ? ` (${changedTemplateNames.join(", ")})` : ""}`);
console.log(`Scheduling class labels to update: ${schedulingChanged ? "yes" : "no"}`);
console.log(`Existing Kitchen sessions to update: ${sessionUpdates.length}`);

if (confirmation !== requiredConfirmation) {
  console.log(`Preview only. Run again with --confirm="${requiredConfirmation}" to apply these exact changes.`);
  process.exit(0);
}

if (changedTemplateNames.length) {
  await templatesRef.set({
    templates: updatedTemplates,
    updatedAt: new Date().toISOString(),
    updatedBy: "approved-wording-update"
  }, { merge: true });
}

if (schedulingChanged) {
  await schedulingRef.set({
    kitchenClassTypes: updatedClassTypes,
    updatedAt: new Date().toISOString(),
    updatedBy: "approved-wording-update"
  }, { merge: true });
}

for (let index = 0; index < sessionUpdates.length; index += 400) {
  const batch = firestore.batch();
  sessionUpdates.slice(index, index + 400).forEach(({ ref, changes }) => {
    batch.update(ref, {
      ...changes,
      updatedAt: new Date().toISOString(),
      updatedBy: "approved-wording-update"
    });
  });
  await batch.commit();
}

console.log("Approved message and Kitchen class wording updated.");
