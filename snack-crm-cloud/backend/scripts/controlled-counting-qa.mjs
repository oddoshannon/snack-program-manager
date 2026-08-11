import { Firestore } from "@google-cloud/firestore";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildControlledCountingQaRecords,
  controlledCountingQaCollections,
  controlledCountingQaExpected,
  controlledCountingQaPeriod
} from "./lib/controlled-counting-qa-fixtures.mjs";
import {
  applyOperationsRevenueValues,
  defaultOperationsMetricDefinitions,
  operationsAutomaticValues
} from "../routes/operations.js";
import {
  financialActivityFromGift,
  financialActivityFromHrsnClaim,
  financialActivityFromIncome,
  sortFinancialActivities
} from "../routes/fundraising.js";
import {
  financialActivityTotals,
  mapFinancialActivities
} from "../../frontend/public/modules/fundraising.js";
import { appointmentCompletionValidationError } from "../routes/appointments.js";
import {
  assertSafeLocalTarget,
  decodeFirestoreValue,
  encodeFirestoreValue,
  fetchAllCollectionDocuments,
  parseCliArguments,
  validateLocalBackup
} from "./lib/local-data-safety.mjs";

const projectId = process.env.GOOGLE_CLOUD_PROJECT || "snack-crm-local";
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || "";
const sessionDirectory = path.resolve(".data", "controlled-counting-qa");
const sessionManifestPath = path.join(sessionDirectory, "active-session.json");
const confirmations = Object.freeze({
  start: "START CONTROLLED COUNTING QA",
  test: "RUN CONTROLLED COUNTING QA",
  reset: "RESET CONTROLLED COUNTING QA",
  cleanup: "RESTORE CONTROLLED COUNTING QA"
});

function timestampForFileName() {
  return new Date().toISOString().replaceAll(":", "-").replaceAll(".", "-");
}

function assertControlledConfirmation(action, confirmation) {
  if (confirmation !== confirmations[action]) {
    throw new Error(`Type ${confirmations[action]} to confirm this local-only action.`);
  }
}

async function readActiveManifest() {
  try {
    return JSON.parse(await readFile(sessionManifestPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function writeActiveManifest(manifest) {
  await mkdir(sessionDirectory, { recursive: true });
  await writeFile(sessionManifestPath, `${JSON.stringify(manifest, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600
  });
}

async function backupControlledCollections(firestore, backupPath) {
  const collections = {};
  for (const collectionName of controlledCountingQaCollections) {
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
  await mkdir(path.dirname(backupPath), { recursive: true });
  await writeFile(backupPath, `${JSON.stringify(backup, null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o600
  });
  return backup;
}

async function clearControlledCollections(firestore) {
  for (const collectionName of controlledCountingQaCollections) {
    while (true) {
      const snapshot = await firestore.collection(collectionName).limit(400).get();
      if (snapshot.empty) break;
      const batch = firestore.batch();
      snapshot.docs.forEach((document) => batch.delete(document.ref));
      await batch.commit();
      if (snapshot.size < 400) break;
    }
  }
}

async function writeControlledRecords(firestore) {
  const records = buildControlledCountingQaRecords(new Date().toISOString());
  for (let index = 0; index < records.length; index += 400) {
    const batch = firestore.batch();
    records.slice(index, index + 400).forEach(([collectionName, documentId, data]) => {
      batch.set(firestore.collection(collectionName).doc(documentId), data);
    });
    await batch.commit();
  }
  return records.length;
}

async function readControlledData(firestore) {
  const data = {};
  for (const collectionName of controlledCountingQaCollections) {
    const documents = await fetchAllCollectionDocuments(firestore, collectionName);
    data[collectionName] = documents.map((document) => ({
      id: document.id,
      ...document.data()
    }));
  }
  return data;
}

function collectExpectedMismatches(actual, expected, area) {
  return Object.entries(expected)
    .filter(([key, expectedValue]) => actual[key] !== expectedValue)
    .map(([key, expectedValue]) => ({
      area,
      key,
      expected: expectedValue,
      actual: actual[key]
    }));
}

function calculateControlledValues(data) {
  const automaticValues = operationsAutomaticValues(
    data,
    controlledCountingQaPeriod.startDate,
    controlledCountingQaPeriod.endDate
  );
  const operations = applyOperationsRevenueValues(
    automaticValues,
    data.performanceMeasurements,
    defaultOperationsMetricDefinitions,
    controlledCountingQaPeriod.startDate,
    controlledCountingQaPeriod.endDate
  );
  const activities = mapFinancialActivities(sortFinancialActivities([
    ...data.earnedIncome.map(financialActivityFromIncome),
    ...data.fundraisingGifts.map(financialActivityFromGift),
    ...data.hrsnClaims
      .filter((claim) => claim.approved === true && claim.approvalDate)
      .map(financialActivityFromHrsnClaim)
  ]));
  const quarter = financialActivityTotals(
    activities,
    controlledCountingQaPeriod.startDate,
    controlledCountingQaPeriod.endDate
  );
  const yearToDate = financialActivityTotals(
    activities,
    "2026-01-01",
    controlledCountingQaPeriod.endDate
  );
  const financialActivity = {
    quarterTotal: quarter.total,
    quarterTransactions: quarter.count,
    yearToDateTotal: yearToDate.total,
    yearToDateTransactions: yearToDate.count,
    yearToDateGrantRevenue: yearToDate.byType["Grant Revenue"] || 0
  };
  return { operations, financialActivity, activities };
}

function assertExpectedValues(actual, expected, area) {
  const mismatches = collectExpectedMismatches(actual, expected, area);
  if (!mismatches.length) return;
  mismatches.forEach((mismatch) => {
    console.error(`${mismatch.area} ${mismatch.key}: expected ${mismatch.expected}, received ${mismatch.actual}`);
  });
  throw new Error(`${area} failed with ${mismatches.length} mismatched value${mismatches.length === 1 ? "" : "s"}.`);
}

async function verifyControlledRecords(firestore) {
  const data = await readControlledData(firestore);
  const { operations, financialActivity } = calculateControlledValues(data);
  const mismatches = [
    ...collectExpectedMismatches(
      operations,
      controlledCountingQaExpected.operations,
      "Operations"
    ),
    ...collectExpectedMismatches(
      financialActivity,
      controlledCountingQaExpected.financialActivity,
      "Financial Activity"
    )
  ];

  if (mismatches.length) {
    mismatches.forEach((mismatch) => {
      console.error(`${mismatch.area} ${mismatch.key}: expected ${mismatch.expected}, received ${mismatch.actual}`);
    });
    throw new Error(`Controlled QA failed with ${mismatches.length} mismatched value${mismatches.length === 1 ? "" : "s"}.`);
  }

  console.log(`Controlled QA passed ${Object.keys(controlledCountingQaExpected.operations).length} Operations totals.`);
  console.log(`Controlled QA passed ${Object.keys(controlledCountingQaExpected.financialActivity).length} Financial Activity totals.`);
  console.log(`Verified Total Children Served: ${operations.organizationEstimatedChildrenServed}`);
  console.log(`Verified Program Engagements: ${operations.organizationProgramEngagements}`);
  console.log(`Verified Total Revenue: $${operations.financialTotalRevenue}`);
}

async function resetControlledRecords(firestore) {
  await clearControlledCollections(firestore);
  await writeControlledRecords(firestore);
}

async function calculateStoredValues(firestore) {
  return calculateControlledValues(await readControlledData(firestore));
}

async function runControlledMutationTests(firestore) {
  let passedScenarios = 0;

  await resetControlledRecords(firestore);
  const scheduledAppointmentRef = firestore.collection("appointments").doc("qa-counting-appointment-validation");
  const scheduledAppointment = (await scheduledAppointmentRef.get()).data();
  const missingSiblingResult = appointmentCompletionValidationError({
    ...scheduledAppointment,
    status: "Completed",
    participantGoals: [{
      clientId: "qa-counting-client-avery",
      clientName: "QA Count Avery Rivera",
      goalResult: "Achieved"
    }]
  });
  if (missingSiblingResult !== "Choose a Goal Result for QA Count Jordan Rivera.") {
    throw new Error(`Sibling completion validation returned: ${missingSiblingResult || "no error"}`);
  }
  await scheduledAppointmentRef.update({
    status: "Completed",
    participantGoals: [
      {
        clientId: "qa-counting-client-avery",
        clientName: "QA Count Avery Rivera",
        goalResult: "Achieved"
      },
      {
        clientId: "qa-counting-client-jordan",
        clientName: "QA Count Jordan Rivera",
        goalResult: "Achieved"
      }
    ],
    updatedAt: new Date().toISOString()
  });
  let values = await calculateStoredValues(firestore);
  assertExpectedValues(values.operations, {
    clinicAppointmentsDelivered: 3,
    organizationProgramEngagements: 27,
    organizationEstimatedChildrenServed: 22,
    clinicNoShowRate: 25,
    clinicGoalAchievement: 60,
    clinicGoalPartlyAchieved: 20
  }, "Sibling completion");
  passedScenarios += 1;
  console.log("PASS 1/6 Sibling completion requires one result per child.");

  await resetControlledRecords(firestore);
  await firestore.collection("programSessions").doc("qa-counting-school-class").update({ participantCount: 21 });
  values = await calculateStoredValues(firestore);
  assertExpectedValues(values.operations, {
    schoolStudentsReached: 21,
    organizationEstimatedChildrenServed: 23,
    organizationProgramEngagements: 26
  }, "School aggregate count");
  passedScenarios += 1;
  console.log("PASS 2/6 School aggregate participants update all three totals.");

  await resetControlledRecords(firestore);
  await firestore.collection("programRegistrations").doc("qa-counting-kitchen-absent").update({ status: "Attended" });
  values = await calculateStoredValues(firestore);
  assertExpectedValues(values.operations, {
    cookingParticipantsServed: 3,
    cookingTotalAttendance: 3,
    cookingAttendanceRate: 100,
    organizationEstimatedChildrenServed: 23,
    organizationProgramEngagements: 26
  }, "Kitchen child attendance");
  passedScenarios += 1;
  console.log("PASS 3/6 Kitchen attendance counts children rather than families.");

  await resetControlledRecords(firestore);
  const approvedClaimRef = firestore.collection("hrsnClaims").doc("qa-counting-hrsn-approved");
  await approvedClaimRef.update({ amount: 300 });
  values = await calculateStoredValues(firestore);
  assertExpectedValues(values.operations, {
    financialHrsnRevenue: 300,
    financialTotalRevenue: 2100
  }, "HRSN amount edit");
  assertExpectedValues(values.financialActivity, {
    quarterTotal: 2100,
    yearToDateTotal: 2200
  }, "HRSN activity amount edit");
  await approvedClaimRef.update({ approved: false, approvalDate: "" });
  values = await calculateStoredValues(firestore);
  assertExpectedValues(values.operations, {
    financialHrsnRevenue: 0,
    financialTotalRevenue: 1800
  }, "HRSN unapproval");
  assertExpectedValues(values.financialActivity, { quarterTotal: 1800 }, "HRSN activity unapproval");
  passedScenarios += 1;
  console.log("PASS 4/6 HRSN amount and approval status drive recognized revenue.");

  await resetControlledRecords(firestore);
  await firestore.collection("fundraisingGifts").doc("qa-counting-gift-repeat").update({ amount: 550 });
  values = await calculateStoredValues(firestore);
  assertExpectedValues(values.operations, {
    financialGiftRevenue: 750,
    financialIndividualGiving: 750,
    financialAverageGiftSize: 375,
    financialTotalRevenue: 2100,
    financialNewDonors: 1,
    financialRepeatDonors: 1
  }, "Gift correction");
  passedScenarios += 1;
  console.log("PASS 5/6 Gift corrections recalculate revenue and donor metrics.");

  await resetControlledRecords(firestore);
  await firestore.collection("fundraisingGifts").doc("qa-counting-gift-in-kind").update({ amount: 500 });
  values = await calculateStoredValues(firestore);
  assertExpectedValues(values.operations, {
    financialGiftRevenue: 700,
    financialTotalRevenue: 2050
  }, "In-kind exclusion");
  assertExpectedValues(values.financialActivity, { quarterTotal: 2050 }, "In-kind activity exclusion");
  passedScenarios += 1;
  console.log("PASS 6/6 In-kind gifts remain excluded when their amount changes.");

  await resetControlledRecords(firestore);
  await verifyControlledRecords(firestore);
  console.log(`Controlled mutation QA passed ${passedScenarios}/6 scenarios and reset the fixture to baseline.`);
}

async function restoreControlledBackup(firestore, backupPath) {
  const backup = validateLocalBackup(JSON.parse(await readFile(backupPath, "utf8")));
  for (const collectionName of controlledCountingQaCollections) {
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
  }
  return backup;
}

function printExpectedBaseline() {
  console.log(`Reporting period: ${controlledCountingQaPeriod.startDate} through ${controlledCountingQaPeriod.endDate}`);
  console.log(`Expected Total Children Served: ${controlledCountingQaExpected.operations.organizationEstimatedChildrenServed}`);
  console.log(`Expected Program Engagements: ${controlledCountingQaExpected.operations.organizationProgramEngagements}`);
  console.log(`Expected Total Revenue: $${controlledCountingQaExpected.operations.financialTotalRevenue}`);
}

function printUsage() {
  console.log("Controlled counting and revenue QA");
  console.log("  status");
  console.log("  verify");
  console.log(`  test --confirm="${confirmations.test}"`);
  console.log(`  start --confirm="${confirmations.start}"`);
  console.log(`  reset --confirm="${confirmations.reset}"`);
  console.log(`  cleanup --confirm="${confirmations.cleanup}"`);
  console.log("Start backs up and temporarily replaces only the listed local source collections.");
  console.log("Cleanup restores the exact pre-test local records from that backup.");
}

async function main() {
  const { action, flags } = parseCliArguments(process.argv.slice(2));
  if (!Object.hasOwn(confirmations, action) && !["status", "verify"].includes(action)) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const activeManifest = await readActiveManifest();
  if (action === "status") {
    if (!activeManifest) {
      console.log("No controlled counting QA session is active.");
      return;
    }
    console.log(`Controlled counting QA is ${activeManifest.state || "active"}.`);
    console.log(`Backup file: ${activeManifest.backupPath}`);
    printExpectedBaseline();
    return;
  }

  if (action === "verify" && !activeManifest) {
    throw new Error("No controlled counting QA session is active.");
  }

  if (Object.hasOwn(confirmations, action) && !flags.confirm) {
    console.log(`Preview only. This action requires --confirm="${confirmations[action]}".`);
    console.log(`Collections: ${controlledCountingQaCollections.join(", ")}`);
    return;
  }
  if (Object.hasOwn(confirmations, action)) {
    assertControlledConfirmation(action, flags.confirm);
  }

  if (action === "start" && activeManifest) {
    throw new Error("A controlled counting QA session is already active. Reset it or clean it up before starting another one.");
  }
  if (["test", "reset", "cleanup"].includes(action) && !activeManifest) {
    throw new Error("No controlled counting QA session is active.");
  }

  const target = assertSafeLocalTarget({ projectId, emulatorHost });
  delete process.env.FIRESTORE_EMULATOR_HOST;
  const firestore = new Firestore({
    projectId: target.projectId,
    host: target.host,
    port: target.port,
    ssl: false
  });

  try {
    if (action === "verify") {
      await verifyControlledRecords(firestore);
      return;
    }

    if (action === "test") {
      await runControlledMutationTests(firestore);
      return;
    }

    if (action === "start") {
      const backupPath = path.join(sessionDirectory, `pre-test-${timestampForFileName()}.json`);
      await backupControlledCollections(firestore, backupPath);
      await writeActiveManifest({
        state: "starting",
        backupPath,
        startedAt: new Date().toISOString(),
        projectId: target.projectId,
        emulatorHost
      });
      await clearControlledCollections(firestore);
      const recordCount = await writeControlledRecords(firestore);
      await writeActiveManifest({
        state: "active",
        backupPath,
        startedAt: new Date().toISOString(),
        projectId: target.projectId,
        emulatorHost,
        recordCount
      });
      console.log(`Controlled QA started with ${recordCount} exact fixture records.`);
      console.log(`Pre-test local data backup: ${backupPath}`);
      printExpectedBaseline();
      return;
    }

    if (action === "reset") {
      await clearControlledCollections(firestore);
      const recordCount = await writeControlledRecords(firestore);
      console.log(`Controlled QA reset to ${recordCount} original fixture records.`);
      printExpectedBaseline();
      return;
    }

    await clearControlledCollections(firestore);
    const backup = await restoreControlledBackup(firestore, activeManifest.backupPath);
    await unlink(sessionManifestPath);
    const restoredCount = Object.values(backup.collections)
      .reduce((sum, records) => sum + records.length, 0);
    console.log(`Controlled QA cleaned up. Restored ${restoredCount} pre-test local records.`);
    console.log(`Safety backup retained at: ${activeManifest.backupPath}`);
  } finally {
    await firestore.terminate();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
