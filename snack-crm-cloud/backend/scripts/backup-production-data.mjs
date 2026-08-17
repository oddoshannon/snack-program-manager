import { FieldPath, Firestore, Timestamp, GeoPoint, DocumentReference } from "@google-cloud/firestore";
import { mkdir, readFile, writeFile, chmod } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const projectId = process.env.GOOGLE_CLOUD_PROJECT || "snack-crm";
const outputPath = resolve(
  process.argv.find((value) => value.startsWith("--out="))?.slice(6)
    || `.data/production-backups/snack-production-backup-${new Date().toISOString().replaceAll(":", "-")}.json`
);

if (projectId !== "snack-crm") {
  throw new Error(`Production backup requires GOOGLE_CLOUD_PROJECT=snack-crm; received ${projectId}.`);
}
if (process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error("Production backup refuses FIRESTORE_EMULATOR_HOST.");
}

function encode(value) {
  if (value instanceof Timestamp) return { __type: "timestamp", value: value.toDate().toISOString() };
  if (value instanceof GeoPoint) return { __type: "geopoint", latitude: value.latitude, longitude: value.longitude };
  if (value instanceof DocumentReference) return { __type: "reference", path: value.path };
  if (Buffer.isBuffer(value) || value instanceof Uint8Array) {
    return { __type: "bytes", value: Buffer.from(value).toString("base64") };
  }
  if (Array.isArray(value)) return value.map(encode);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, encode(item)]));
  }
  return value;
}

async function fetchDocuments(collection) {
  const documents = [];
  let last = null;
  while (true) {
    let query = collection.orderBy(FieldPath.documentId()).limit(250);
    if (last) query = query.startAfter(last);
    const snapshot = await query.get();
    documents.push(...snapshot.docs);
    if (snapshot.size < 250) break;
    last = snapshot.docs.at(-1);
  }
  return documents;
}

async function backupCollection(collection, collections) {
  const documents = await fetchDocuments(collection);
  const rows = [];
  for (const document of documents) {
    rows.push({ id: document.id, data: encode(document.data()) });
    for (const child of await document.ref.listCollections()) {
      await backupCollection(child, collections);
    }
  }
  collections[collection.path] = rows;
}

const db = new Firestore({ projectId, preferRest: true });
try {
  const collections = {};
  for (const collection of await db.listCollections()) {
    await backupCollection(collection, collections);
  }
  const counts = Object.fromEntries(Object.entries(collections).map(([name, rows]) => [name, rows.length]));
  const backup = {
    format: "snack-firestore-backup-v1",
    projectId,
    createdAt: new Date().toISOString(),
    counts,
    collections
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(backup, null, 2)}\n`, { mode: 0o600 });
  await chmod(outputPath, 0o600);

  const verified = JSON.parse(await readFile(outputPath, "utf8"));
  if (verified.projectId !== projectId || JSON.stringify(verified.counts) !== JSON.stringify(counts)) {
    throw new Error("Backup verification failed after writing the file.");
  }
  console.log(JSON.stringify({ outputPath, collectionCount: Object.keys(collections).length, counts }, null, 2));
} finally {
  await db.terminate();
}
