import { Firestore } from "@google-cloud/firestore";
import { readFile, writeFile, chmod } from "node:fs/promises";
import { resolve } from "node:path";

const projectId = process.env.GOOGLE_CLOUD_PROJECT || "snack-crm";
const planPath = resolve(process.argv.find((value) => value.startsWith("--plan="))?.slice(7) || ".data/approved-real-data-import-2026-08-05.json");
const apply = process.argv.includes("--apply");
const confirmation = process.argv.find((value) => value.startsWith("--confirm="))?.slice(10) || "";
const requiredConfirmation = "IMPORT EXACT AUGUST 5 RECORDS";

if (projectId !== "snack-crm") throw new Error(`Import requires project snack-crm; received ${projectId}.`);
if (process.env.FIRESTORE_EMULATOR_HOST) throw new Error("Production import refuses FIRESTORE_EMULATOR_HOST.");
if (apply && confirmation !== requiredConfirmation) {
  throw new Error(`Apply mode requires --confirm="${requiredConfirmation}".`);
}

const plan = JSON.parse(await readFile(planPath, "utf8"));
if (plan.format !== "snack-approved-real-data-import-v1" || plan.sourceCutoff !== "2026-08-05") {
  throw new Error("The import plan format or source cutoff is not approved.");
}
const backup = JSON.parse(await readFile(plan.backupPath, "utf8"));
if (backup.format !== "snack-firestore-backup-v1" || backup.projectId !== projectId) {
  throw new Error("The verified production backup is missing or invalid.");
}

const db = new Firestore({ projectId });
const now = new Date().toISOString();
const actor = "director@snackprogram.org";

async function fetchCollection(name) {
  const snapshot = await db.collection(name).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
}

try {
  const current = {
    clients: await fetchCollection("clients"),
    referrals: await fetchCollection("referrals"),
    appointments: await fetchCollection("appointments"),
    referralNetwork: await fetchCollection("referralNetwork")
  };
  for (const name of Object.keys(current)) {
    const expected = Number(backup.counts[name] || 0);
    if (current[name].length !== expected) {
      throw new Error(`${name} changed after the backup (${expected} then, ${current[name].length} now). Create a new plan and backup before importing.`);
    }
  }

  const liveClientZohoIds = new Set(current.clients.map((row) => row.data.zohoRecordId).filter(Boolean));
  const liveReferralZohoIds = new Set(current.referrals.map((row) => row.data.zohoRecordId).filter(Boolean));
  const liveAppointmentIds = new Set(current.appointments.map((row) => row.id));
  const duplicateClientRows = plan.clientsToCreate.filter((row) => liveClientZohoIds.has(row.zohoRecordId));
  const duplicateReferralRows = plan.referralsToCreate.filter((row) => liveReferralZohoIds.has(row.zohoRecordId));
  const duplicateAppointmentRows = plan.appointmentsToCreate.filter((row) => liveAppointmentIds.has(row.id));
  if (duplicateClientRows.length || duplicateReferralRows.length || duplicateAppointmentRows.length) {
    throw new Error("The import plan is no longer idempotent against production; rebuild it before applying.");
  }

  const preview = {
    projectId,
    sourceCutoff: plan.sourceCutoff,
    mode: apply ? "apply" : "preview",
    clientsToCreate: plan.clientsToCreate.length,
    referralsToCreate: plan.referralsToCreate.length,
    appointmentsToCreate: plan.appointmentsToCreate.length,
    appointmentSourceRowsToCreate: plan.summary.appointmentSourceRowsToCreate,
    unresolvedAppointmentRowsSkipped: plan.unresolvedAppointments.length,
    unresolvedReferralProviderLinksSkipped: plan.unresolvedReferralProviderLinks.length,
    nonClinicSetmoreRowsExcluded: plan.excludedNonClinicRows.length,
    deletes: 0
  };
  console.log(JSON.stringify(preview, null, 2));
  if (!apply) process.exit(0);

  const batch = db.batch();
  for (const row of plan.clientsToCreate) {
    const { id, rowNumber: _rowNumber, ...data } = row;
    batch.create(db.collection("clients").doc(id), {
      ...data,
      importedFrom: "Zoho CSV",
      importedAt: now,
      createdAt: now,
      updatedAt: now,
      createdBy: actor
    });
  }
  for (const row of plan.referralsToCreate) {
    const { id, rowNumber: _rowNumber, ...data } = row;
    batch.create(db.collection("referrals").doc(id), {
      ...data,
      importedFrom: "Zoho CSV",
      importedAt: now,
      createdAt: now,
      updatedAt: now,
      createdBy: actor
    });
  }
  for (const row of plan.appointmentsToCreate) {
    const { id, ...data } = row;
    batch.create(db.collection("appointments").doc(id), {
      ...data,
      location: "",
      goal: "",
      appointmentNote: "",
      importedAt: now,
      createdAt: now,
      updatedAt: now,
      createdBy: actor
    });
  }
  const auditRef = db.collection("securityAuditLogs").doc();
  batch.create(auditRef, {
    actorEmail: actor,
    actorUid: "approved-data-changeover",
    action: "data.import",
    result: "success",
    resourceType: "approved-august-5-source-data",
    resourceId: plan.sourceCutoff,
    metadata: preview,
    occurredAt: now
  });
  await batch.commit();

  const after = {
    clients: (await db.collection("clients").count().get()).data().count,
    referrals: (await db.collection("referrals").count().get()).data().count,
    appointments: (await db.collection("appointments").count().get()).data().count,
    referralNetwork: (await db.collection("referralNetwork").count().get()).data().count
  };
  const expectedAfter = {
    clients: backup.counts.clients + plan.clientsToCreate.length,
    referrals: backup.counts.referrals + plan.referralsToCreate.length,
    appointments: backup.counts.appointments + plan.appointmentsToCreate.length,
    referralNetwork: backup.counts.referralNetwork
  };
  if (JSON.stringify(after) !== JSON.stringify(expectedAfter)) {
    throw new Error(`Post-import counts do not match. Expected ${JSON.stringify(expectedAfter)}, received ${JSON.stringify(after)}.`);
  }
  const reportPath = planPath.replace(/\.json$/, "-applied-report.json");
  const report = { ...preview, appliedAt: now, after, expectedAfter, auditLogId: auditRef.id };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
  await chmod(reportPath, 0o600);
  console.log(JSON.stringify({ applied: true, reportPath, after }, null, 2));
} finally {
  await db.terminate();
}
