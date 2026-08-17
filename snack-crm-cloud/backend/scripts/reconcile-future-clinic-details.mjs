import crypto from "node:crypto";
import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { promisify } from "node:util";
import {
  cleanString,
  inferAppointmentGoalFromNotes,
  inferAppointmentLessonFromNotes,
  firestore as coreFirestore
} from "../lib/core.js";

const execFileAsync = promisify(execFile);
const projectId = process.env.GOOGLE_CLOUD_PROJECT || "snack-crm";
const backupPath = resolve(process.argv.find((value) => value.startsWith("--backup="))?.slice(9) || "");
const minimumDate = cleanString(process.argv.find((value) => value.startsWith("--minimum-date="))?.slice(15)) || "2026-08-17";
const scope = cleanString(process.argv.find((value) => value.startsWith("--scope="))?.slice(8)) || "future";
const reportPath = cleanString(process.argv.find((value) => value.startsWith("--report="))?.slice(9));
const apply = process.argv.includes("--apply");
const confirmation = process.argv.find((value) => value.startsWith("--confirm="))?.slice(10) || "";
const requiredConfirmation = scope === "all" ? "REPAIR ALL APPOINTMENT DETAILS" : "REPAIR FUTURE CLINIC DETAILS";
const actor = "director@snackprogram.org";
const gcloudPath = "/Users/shannonoddo/Downloads/google-cloud-sdk/bin/gcloud";
const firestoreBaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

if (projectId !== "snack-crm") throw new Error(`Reconciliation requires project snack-crm; received ${projectId}.`);
if (process.env.FIRESTORE_EMULATOR_HOST) throw new Error("Production reconciliation refuses FIRESTORE_EMULATOR_HOST.");
if (!backupPath) throw new Error("Provide a freshly verified production backup with --backup=/absolute/path.json.");
if (apply && confirmation !== requiredConfirmation) {
  throw new Error(`Apply mode requires --confirm="${requiredConfirmation}".`);
}

const backup = JSON.parse(await readFile(backupPath, "utf8"));
const expectedAppointmentCount = backup.format === "snack-firestore-backup-v1" && backup.projectId === projectId
  ? Number(backup.counts?.appointments || 0)
  : backup.format === "SNACK Program Hub data backup" && backup.purpose === "complete"
    ? Number(backup.collections?.appointments?.records?.length || 0)
    : 0;
const expectedClientCount = backup.format === "snack-firestore-backup-v1" && backup.projectId === projectId
  ? Number(backup.counts?.clients || 0)
  : backup.format === "SNACK Program Hub data backup" && backup.purpose === "complete"
    ? Number(backup.collections?.clients?.records?.length || 0)
    : 0;
if (!expectedAppointmentCount) throw new Error("The verified production backup is missing or invalid.");
if (!expectedClientCount) throw new Error("The verified production backup does not include clients.");
if (!new Set(["future", "all"]).has(scope)) throw new Error(`Unknown scope: ${scope}.`);

function decodeFirestoreValue(value = {}) {
  if (Object.hasOwn(value, "nullValue")) return null;
  if (Object.hasOwn(value, "stringValue")) return value.stringValue;
  if (Object.hasOwn(value, "booleanValue")) return value.booleanValue;
  if (Object.hasOwn(value, "integerValue")) return Number(value.integerValue);
  if (Object.hasOwn(value, "doubleValue")) return Number(value.doubleValue);
  if (Object.hasOwn(value, "timestampValue")) return value.timestampValue;
  if (value.arrayValue) return (value.arrayValue.values || []).map(decodeFirestoreValue);
  if (value.mapValue) return decodeFirestoreFields(value.mapValue.fields || {});
  return "";
}

function decodeFirestoreFields(fields = {}) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)]));
}

function encodeFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeFirestoreValue) } };
  if (typeof value === "object") {
    return { mapValue: { fields: encodeFirestoreFields(value) } };
  }
  return { stringValue: String(value) };
}

function encodeFirestoreFields(record = {}) {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, encodeFirestoreValue(value)]));
}

async function firestoreAccessToken() {
  const { stdout } = await execFileAsync(gcloudPath, ["auth", "application-default", "print-access-token"], {
    maxBuffer: 1024 * 1024
  });
  const token = cleanString(stdout);
  if (!token) throw new Error("Google Cloud authorization is unavailable.");
  return token;
}

async function firestoreRequest(url, token, options = {}) {
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {})
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {})
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.message || `Firestore returned ${response.status}.`);
  return payload;
}

async function fetchAllCollection(collectionName, token) {
  const rows = [];
  let pageToken = "";
  do {
    const url = new URL(`${firestoreBaseUrl}/${collectionName}`);
    url.searchParams.set("pageSize", "300");
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const payload = await firestoreRequest(url, token);
    rows.push(...(payload.documents || []).map((document) => ({
      id: cleanString(document.name).split("/").at(-1),
      ...decodeFirestoreFields(document.fields)
    })));
    pageToken = cleanString(payload.nextPageToken);
  } while (pageToken);
  return rows;
}

async function patchAppointment(update, token, now) {
  const patch = { ...update.patch, updatedAt: now, updatedBy: actor };
  const url = new URL(`${firestoreBaseUrl}/appointments/${encodeURIComponent(update.id)}`);
  for (const field of Object.keys(patch)) url.searchParams.append("updateMask.fieldPaths", field);
  await firestoreRequest(url, token, {
    method: "PATCH",
    body: { fields: encodeFirestoreFields(patch) }
  });
}

async function createAuditLog(preview, token, now) {
  const auditLogId = crypto.randomUUID();
  const url = new URL(`${firestoreBaseUrl}/securityAuditLogs`);
  url.searchParams.set("documentId", auditLogId);
  await firestoreRequest(url, token, {
    method: "POST",
    body: {
      fields: encodeFirestoreFields({
        actorEmail: actor,
        actorUid: "approved-data-reconciliation",
        action: scope === "all" ? "appointments.reconcileAllDetails" : "appointments.reconcileFutureClinicDetails",
        result: "success",
        resourceType: "appointments",
        resourceId: minimumDate,
        metadata: {
          appointmentsUpdated: preview.appointmentsToUpdate,
          lessonsUpdated: preview.lessonsToUpdate,
          goalsAdded: preview.goalsToAdd,
          linkedAppointments: preview.linkedAppointments,
          missingClientLinks: preview.missingClientLinks,
          brokenClientLinks: preview.brokenClientLinks,
          unresolvedCount: preview.unresolvedCount,
          deletes: 0
        },
        occurredAt: now
      })
    }
  });
  return auditLogId;
}

try {
  const token = await firestoreAccessToken();
  const appointments = await fetchAllCollection("appointments", token);
  const clients = await fetchAllCollection("clients", token);
  if (appointments.length !== expectedAppointmentCount) {
    throw new Error(`Appointments changed after the backup (${expectedAppointmentCount} then, ${appointments.length} now). Create a fresh backup before continuing.`);
  }
  if (clients.length !== expectedClientCount) {
    throw new Error(`Clients changed after the backup (${expectedClientCount} then, ${clients.length} now). Create a fresh backup before continuing.`);
  }

  const candidates = appointments.filter((appointment) => (
    cleanString(appointment.appointmentType).toLowerCase() === "nutrition education"
    && (scope === "all" || (
      cleanString(appointment.importSource) === "Setmore appointment export"
      && cleanString(appointment.appointmentDate) >= minimumDate
      && cleanString(appointment.status).toLowerCase() === "scheduled"
    ))
  ));
  const approvedOverrides = new Map([
    ["setmore-f94fe3a36c3355ce4eb69761", { lesson: "2", goal: "Veggie tracker" }],
    ["setmore-3998eb963ac919099357a03e", { lesson: "3" }]
  ]);
  const updates = [];
  const unresolved = [];

  for (const appointment of candidates) {
    const inferredLesson = inferAppointmentLessonFromNotes(appointment.notes, appointment.appointmentType);
    const inferredGoal = inferAppointmentGoalFromNotes(appointment.notes, inferredLesson);
    const participantGoal = Array.isArray(appointment.participantGoals)
      ? cleanString(appointment.participantGoals.find((entry) => cleanString(entry?.goal))?.goal)
      : "";
    const storedGoal = cleanString(appointment.goal) || participantGoal;
    const patch = {};
    const approvedOverride = approvedOverrides.get(appointment.id) || {};

    if (!cleanString(appointment.lesson) && inferredLesson) patch.lesson = inferredLesson;
    if (!storedGoal && inferredGoal) patch.goal = inferredGoal;
    if (approvedOverride.lesson && cleanString(appointment.lesson) !== approvedOverride.lesson) patch.lesson = approvedOverride.lesson;
    if (approvedOverride.goal && storedGoal !== approvedOverride.goal) patch.goal = approvedOverride.goal;

    if (Object.keys(patch).length) {
      updates.push({
        id: appointment.id,
        appointmentDate: cleanString(appointment.appointmentDate),
        appointmentTime: cleanString(appointment.appointmentTime),
        lesson: patch.lesson || cleanString(appointment.lesson),
        hasGoal: Boolean(patch.goal || storedGoal),
        approvedOverride: approvedOverrides.has(appointment.id),
        patch
      });
    }

    const finalLesson = cleanString(patch.lesson) || cleanString(appointment.lesson);
    const finalGoal = cleanString(patch.goal) || storedGoal;
    if (!finalLesson || !finalGoal) {
      unresolved.push({
        id: appointment.id,
        appointmentDate: cleanString(appointment.appointmentDate),
        appointmentTime: cleanString(appointment.appointmentTime),
        clientName: cleanString(appointment.clientName),
        status: cleanString(appointment.status),
        missingLesson: !finalLesson,
        missingGoal: !finalGoal,
        goalPendingUntil: appointment.id === "setmore-3998eb963ac919099357a03e" ? "2026-08-20 appointment" : ""
      });
    }
  }

  const clientIds = new Set(clients.map((client) => client.id));
  const clientLinkAudit = appointments
    .filter((appointment) => cleanString(appointment.appointmentType).toLowerCase() !== "administrative")
    .map((appointment) => {
      const appointmentClientIds = [...new Set([
        cleanString(appointment.clientId),
        ...(Array.isArray(appointment.clientIds) ? appointment.clientIds.map(cleanString) : [])
      ].filter(Boolean))];
      return {
        id: appointment.id,
        status: cleanString(appointment.status),
        appointmentDate: cleanString(appointment.appointmentDate),
        clientName: cleanString(appointment.clientName),
        clientIds: appointmentClientIds,
        brokenClientIds: appointmentClientIds.filter((clientId) => !clientIds.has(clientId))
      };
    });
  const missingClientLinkRecords = clientLinkAudit.filter((item) => !item.clientIds.length);
  const brokenClientLinkRecords = clientLinkAudit.filter((item) => item.brokenClientIds.length);

  const preview = {
    projectId,
    mode: apply ? "apply" : "preview",
    scope,
    minimumDate,
    nutritionAppointmentsReviewed: candidates.length,
    totalAppointmentsReviewedForClientLinks: clientLinkAudit.length,
    linkedAppointments: clientLinkAudit.length - missingClientLinkRecords.length,
    missingClientLinks: missingClientLinkRecords.length,
    missingClientLinkRecords,
    brokenClientLinks: brokenClientLinkRecords.length,
    brokenClientLinkRecords,
    appointmentsToUpdate: updates.length,
    lessonsToUpdate: updates.filter((item) => item.patch.lesson).length,
    goalsToAdd: updates.filter((item) => item.patch.goal).length,
    unresolvedCount: unresolved.length,
    unresolved,
    deletes: 0
  };
  console.log(JSON.stringify(preview, null, 2));
  if (reportPath) await writeFile(resolve(reportPath), `${JSON.stringify(preview, null, 2)}\n`, "utf8");

  if (apply) {
    const now = new Date().toISOString();
    for (const update of updates) await patchAppointment(update, token, now);
    const auditLogId = await createAuditLog(preview, token, now);
    console.log(JSON.stringify({
      applied: true,
      appointmentsUpdated: updates.length,
      unresolvedCount: unresolved.length,
      auditLogId
    }, null, 2));
  }
} finally {
  await coreFirestore.terminate();
}
