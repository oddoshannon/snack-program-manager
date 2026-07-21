import { FieldPath, Firestore } from "@google-cloud/firestore";

const sourceProjectId = process.env.SOURCE_GOOGLE_CLOUD_PROJECT || "snack-crm";
const destinationProjectId = process.env.GOOGLE_CLOUD_PROJECT || "snack-crm-local";
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || "";
const collectionNames = [
  "referrals",
  "clients",
  "appointments",
  "tasks",
  "activityLogs",
  "grants",
  "grantQuestions",
  "referralNetwork",
  "outreachEvents",
  "outreachContacts",
  "adminSettings",
  "messages"
];

function localEmulatorAddress(value) {
  const match = String(value).match(/^(localhost|127\.0\.0\.1):(\d+)$/);
  if (!match) {
    throw new Error("FIRESTORE_EMULATOR_HOST must point to a local Firestore emulator.");
  }

  return { host: match[1], port: Number(match[2]) };
}

async function fetchAllCollectionDocuments(firestore, collectionName) {
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

async function copyCollection(source, destination, collectionName) {
  const documents = await fetchAllCollectionDocuments(source, collectionName);

  for (let index = 0; index < documents.length; index += 400) {
    const batch = destination.batch();
    documents.slice(index, index + 400).forEach((document) => {
      batch.set(destination.collection(collectionName).doc(document.id), document.data());
    });
    await batch.commit();
  }

  return documents.length;
}

async function main() {
  if (sourceProjectId === destinationProjectId) {
    throw new Error("The source and local destination projects must be different.");
  }

  const destinationAddress = localEmulatorAddress(emulatorHost);
  // The Firestore client gives FIRESTORE_EMULATOR_HOST precedence over explicit
  // connection settings. Remove it after validation so only the destination
  // client uses the emulator host supplied below.
  delete process.env.FIRESTORE_EMULATOR_HOST;
  const source = new Firestore({
    projectId: sourceProjectId,
    host: "firestore.googleapis.com",
    ssl: true
  });
  const destination = new Firestore({
    projectId: destinationProjectId,
    host: destinationAddress.host,
    port: destinationAddress.port,
    ssl: false
  });

  try {
    console.log(`Refreshing local data from ${sourceProjectId}...`);
    for (const collectionName of collectionNames) {
      const count = await copyCollection(source, destination, collectionName);
      console.log(`${collectionName}: ${count}`);
    }
    console.log("Local data refresh complete. No live records were changed.");
  } finally {
    await Promise.allSettled([source.terminate(), destination.terminate()]);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
