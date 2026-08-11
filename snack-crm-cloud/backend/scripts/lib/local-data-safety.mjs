import { FieldPath, GeoPoint, Timestamp } from "@google-cloud/firestore";

export const localDataCollections = [
  "referrals",
  "clients",
  "appointments",
  "tasks",
  "activityLogs",
  "securityAuditLogs",
  "grants",
  "grantQuestions",
  "fundraisingDonors",
  "fundraisingCampaigns",
  "fundraisingGifts",
  "earnedIncome",
  "marketingCampaigns",
  "marketingSubscribers",
  "performanceMetrics",
  "performanceMeasurements",
  "performanceEvaluationQuestions",
  "performanceEvaluationInstruments",
  "performanceEvaluationResponses",
  "hrsnClaims",
  "budgetCategories",
  "programSessions",
  "programRegistrations",
  "referralNetwork",
  "outreachEvents",
  "outreachContacts",
  "volunteerProfiles",
  "volunteerOpportunities",
  "adminSettings",
  "staffUsers",
  "messages"
];

export const localDataConfirmations = {
  clear: "DELETE LOCAL TEST DATA",
  restore: "RESTORE LOCAL TEST DATA",
  replace: "REPLACE LOCAL TEST DATA"
};

export function localEmulatorAddress(value) {
  const match = String(value || "").match(/^(localhost|127\.0\.0\.1):(\d+)$/);
  if (!match) {
    throw new Error("FIRESTORE_EMULATOR_HOST must point to a local Firestore emulator.");
  }

  return { host: match[1], port: Number(match[2]) };
}

export function assertSafeLocalTarget({ projectId, emulatorHost }) {
  const address = localEmulatorAddress(emulatorHost);
  const normalizedProjectId = String(projectId || "").trim();

  if (!normalizedProjectId) {
    throw new Error("GOOGLE_CLOUD_PROJECT is required for local data tools.");
  }

  if (normalizedProjectId === "snack-crm") {
    throw new Error("Local data tools cannot run against the production project.");
  }

  return {
    projectId: normalizedProjectId,
    ...address
  };
}

export function isLocalFixtureRecord(documentId, data = {}, fixtureSet = "") {
  return String(documentId || "").startsWith("qa-")
    || data.qaFixture === true
    || (Boolean(fixtureSet) && data.qaFixtureSet === fixtureSet);
}

export function parseCollectionSelection(value) {
  if (!value) return [...localDataCollections];

  const selected = [...new Set(
    String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  )];
  const invalid = selected.find((collectionName) => !localDataCollections.includes(collectionName));

  if (invalid) {
    throw new Error(`Unsupported collection: ${invalid}`);
  }

  if (!selected.length) {
    throw new Error("Choose at least one collection.");
  }

  return selected;
}

export function parseCliArguments(argumentsList) {
  const [action = "", ...flagArguments] = argumentsList;
  const flags = {};

  flagArguments.forEach((argument) => {
    if (!argument.startsWith("--")) {
      throw new Error(`Unexpected argument: ${argument}`);
    }

    const separatorIndex = argument.indexOf("=");
    const key = separatorIndex === -1
      ? argument.slice(2)
      : argument.slice(2, separatorIndex);
    const value = separatorIndex === -1
      ? true
      : argument.slice(separatorIndex + 1);
    flags[key] = value;
  });

  return { action, flags };
}

export function assertConfirmation(action, confirmation) {
  const expected = localDataConfirmations[action];
  if (!expected) {
    throw new Error(`Unsupported confirmation action: ${action}`);
  }

  if (confirmation !== expected) {
    throw new Error(`Type ${expected} to confirm this local-only action.`);
  }
}

export function encodeFirestoreValue(value) {
  if (value === null || value === undefined) return value;
  if (value instanceof Timestamp) {
    return { __snackLocalType: "timestamp", value: value.toDate().toISOString() };
  }
  if (value instanceof Date) {
    return { __snackLocalType: "date", value: value.toISOString() };
  }
  if (value instanceof GeoPoint) {
    return {
      __snackLocalType: "geopoint",
      latitude: value.latitude,
      longitude: value.longitude
    };
  }
  if (Buffer.isBuffer(value)) {
    return { __snackLocalType: "bytes", value: value.toString("base64") };
  }
  if (value?.constructor?.name === "DocumentReference" && value.path) {
    return { __snackLocalType: "reference", value: value.path };
  }
  if (Array.isArray(value)) {
    return value.map(encodeFirestoreValue);
  }
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, encodeFirestoreValue(nestedValue)])
    );
  }

  return value;
}

export function decodeFirestoreValue(value, firestore) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) {
    return value.map((nestedValue) => decodeFirestoreValue(nestedValue, firestore));
  }
  if (typeof value !== "object") return value;

  if (value.__snackLocalType === "timestamp") {
    return Timestamp.fromDate(new Date(value.value));
  }
  if (value.__snackLocalType === "date") {
    return new Date(value.value);
  }
  if (value.__snackLocalType === "geopoint") {
    return new GeoPoint(value.latitude, value.longitude);
  }
  if (value.__snackLocalType === "bytes") {
    return Buffer.from(value.value, "base64");
  }
  if (value.__snackLocalType === "reference") {
    return firestore.doc(value.value);
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      decodeFirestoreValue(nestedValue, firestore)
    ])
  );
}

export function validateLocalBackup(backup) {
  if (!backup || backup.format !== "snack-local-firestore-v1") {
    throw new Error("This file is not a supported SNACK local-data backup.");
  }

  if (!backup.collections || typeof backup.collections !== "object") {
    throw new Error("The local-data backup does not contain any collections.");
  }

  Object.entries(backup.collections).forEach(([collectionName, records]) => {
    if (!localDataCollections.includes(collectionName)) {
      throw new Error(`The backup contains an unsupported collection: ${collectionName}`);
    }
    if (!Array.isArray(records)) {
      throw new Error(`The backup collection ${collectionName} is invalid.`);
    }
    records.forEach((record) => {
      if (!record || typeof record.id !== "string" || !record.id || typeof record.data !== "object") {
        throw new Error(`The backup collection ${collectionName} contains an invalid record.`);
      }
    });
  });

  return backup;
}

export async function fetchAllCollectionDocuments(firestore, collectionName) {
  const documents = [];
  let lastDocument = null;

  while (true) {
    let query = firestore
      .collection(collectionName)
      .orderBy(FieldPath.documentId())
      .limit(250);

    if (lastDocument) {
      query = query.startAfter(lastDocument);
    }

    const snapshot = await query.get();
    documents.push(...snapshot.docs);
    if (snapshot.size < 250) break;
    lastDocument = snapshot.docs.at(-1);
  }

  return documents;
}

export function backupCounts(backup) {
  return Object.fromEntries(
    Object.entries(backup.collections || {}).map(([collectionName, records]) => [
      collectionName,
      records.length
    ])
  );
}
