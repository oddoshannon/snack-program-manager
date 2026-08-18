import { Firestore } from "@google-cloud/firestore";

const projectId = process.env.GOOGLE_CLOUD_PROJECT || "snack-crm";
const email = String(process.argv[2] || "").trim().toLowerCase();
const displayName = String(process.argv[3] || "").trim();

if (projectId !== "snack-crm") {
  throw new Error("Clinical Advisor provisioning is restricted to the snack-crm project.");
}

if (!/^[^@\s]+@snackprogram\.org$/.test(email)) {
  throw new Error("Provide one @snackprogram.org email address.");
}

const firestore = new Firestore({ projectId });
const reference = firestore.collection("staffUsers").doc(email);
const snapshot = await reference.get();
const existing = snapshot.exists ? snapshot.data() || {} : {};
const now = new Date().toISOString();

await reference.set({
  email,
  displayName: displayName || existing.displayName || "",
  title: "Clinical Physician Advisor",
  role: "ClinicalAdvisor",
  accessLevelId: "ClinicalAdvisor",
  active: true,
  programs: ["Clinic"],
  grantDocumentAccess: false,
  createdAt: existing.createdAt || now,
  updatedAt: now,
  updatedBy: "director@snackprogram.org"
}, { merge: true });

console.log(JSON.stringify({
  ok: true,
  email,
  displayName: displayName || existing.displayName || "",
  accessLevelId: "ClinicalAdvisor"
}));
