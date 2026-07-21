import { Firestore } from "@google-cloud/firestore";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  assertConfirmation,
  assertSafeLocalTarget,
  backupCounts,
  decodeFirestoreValue,
  encodeFirestoreValue,
  fetchAllCollectionDocuments,
  parseCliArguments,
  parseCollectionSelection,
  validateLocalBackup
} from "./lib/local-data-safety.mjs";

const projectId = process.env.GOOGLE_CLOUD_PROJECT || "snack-crm-local";
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || "";

function timestampForFileName() {
  return new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
}

function defaultBackupPath() {
  return path.resolve(".data", "local-backups", `snack-local-${timestampForFileName()}.json`);
}

function showCounts(label, counts) {
  console.log(label);
  Object.entries(counts).forEach(([collectionName, count]) => {
    console.log(`  ${collectionName}: ${count}`);
  });
}

async function createBackup(firestore, collectionNames, filePath) {
  const collections = {};

  for (const collectionName of collectionNames) {
    const documents = await fetchAllCollectionDocuments(firestore, collectionName);
    collections[collectionName] = documents.map((document) => ({
      id: document.id,
      data: encodeFirestoreValue(document.data())
    }));
  }

  const backup = {
    format: "snack-local-firestore-v1",
    projectId,
    exportedAt: new Date().toISOString(),
    collections
  };

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(backup, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600
  });

  return backup;
}

async function loadBackup(filePath) {
  const contents = await readFile(filePath, "utf8");
  return validateLocalBackup(JSON.parse(contents));
}

async function collectionCounts(firestore, collectionNames) {
  const counts = {};

  for (const collectionName of collectionNames) {
    const snapshot = await firestore.collection(collectionName).count().get();
    counts[collectionName] = snapshot.data().count || 0;
  }

  return counts;
}

async function clearCollections(firestore, collectionNames) {
  const deleted = {};

  for (const collectionName of collectionNames) {
    let deletedCount = 0;

    while (true) {
      const snapshot = await firestore.collection(collectionName).limit(400).get();
      if (snapshot.empty) break;

      const batch = firestore.batch();
      snapshot.docs.forEach((document) => batch.delete(document.ref));
      await batch.commit();
      deletedCount += snapshot.size;
      if (snapshot.size < 400) break;
    }

    deleted[collectionName] = deletedCount;
  }

  return deleted;
}

async function restoreBackup(firestore, backup, collectionNames) {
  const restored = {};

  for (const collectionName of collectionNames) {
    const records = backup.collections[collectionName] || [];

    for (let index = 0; index < records.length; index += 400) {
      const batch = firestore.batch();
      records.slice(index, index + 400).forEach((record) => {
        batch.set(
          firestore.collection(collectionName).doc(record.id),
          decodeFirestoreValue(record.data, firestore)
        );
      });
      await batch.commit();
    }

    restored[collectionName] = records.length;
  }

  return restored;
}

function usage() {
  console.log("Local Firestore data safety tool");
  console.log("  backup [--file=/path/backup.json] [--collections=clients,appointments]");
  console.log("  clear [--confirm=DELETE LOCAL TEST DATA] [--collections=clients,appointments]");
  console.log("  restore --file=/path/backup.json [--confirm=RESTORE LOCAL TEST DATA]");
  console.log("  replace --file=/path/backup.json [--confirm=REPLACE LOCAL TEST DATA]");
  console.log("Clear, restore, and replace are previews unless the exact confirmation is provided.");
}

async function main() {
  const { action, flags } = parseCliArguments(process.argv.slice(2));
  if (!["backup", "clear", "restore", "replace"].includes(action)) {
    usage();
    process.exitCode = 1;
    return;
  }

  const target = assertSafeLocalTarget({ projectId, emulatorHost });
  const collectionNames = parseCollectionSelection(flags.collections);
  delete process.env.FIRESTORE_EMULATOR_HOST;
  const firestore = new Firestore({
    projectId: target.projectId,
    host: target.host,
    port: target.port,
    ssl: false
  });

  try {
    if (action === "backup") {
      const filePath = path.resolve(String(flags.file || defaultBackupPath()));
      const backup = await createBackup(firestore, collectionNames, filePath);
      showCounts("Local backup created:", backupCounts(backup));
      console.log(`Backup file: ${filePath}`);
      return;
    }

    if (action === "clear") {
      const counts = await collectionCounts(firestore, collectionNames);
      showCounts("Local records selected for deletion:", counts);
      if (!flags.confirm) {
        console.log("Preview only. No local records were changed.");
        return;
      }

      assertConfirmation("clear", flags.confirm);
      const deleted = await clearCollections(firestore, collectionNames);
      showCounts("Local records deleted:", deleted);
      return;
    }

    if (!flags.file) {
      throw new Error(`The ${action} action requires --file=/path/backup.json.`);
    }

    const filePath = path.resolve(String(flags.file));
    const backup = await loadBackup(filePath);
    const backupCollectionNames = parseCollectionSelection(
      flags.collections || Object.keys(backup.collections).join(",")
    ).filter((collectionName) => Object.hasOwn(backup.collections, collectionName));
    if (!backupCollectionNames.length) {
      throw new Error("None of the selected collections exist in this backup.");
    }
    showCounts("Backup records selected:", Object.fromEntries(
      backupCollectionNames.map((collectionName) => [
        collectionName,
        backup.collections[collectionName].length
      ])
    ));

    if (!flags.confirm) {
      console.log("Preview only. No local records were changed.");
      return;
    }

    assertConfirmation(action, flags.confirm);

    if (action === "replace") {
      const safetyPath = defaultBackupPath();
      const safetyBackup = await createBackup(firestore, backupCollectionNames, safetyPath);
      showCounts("Automatic pre-replacement backup:", backupCounts(safetyBackup));
      console.log(`Safety backup file: ${safetyPath}`);
      const deleted = await clearCollections(firestore, backupCollectionNames);
      showCounts("Local records removed before replacement:", deleted);
    }

    const restored = await restoreBackup(firestore, backup, backupCollectionNames);
    showCounts("Local records restored:", restored);
  } finally {
    await firestore.terminate();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
