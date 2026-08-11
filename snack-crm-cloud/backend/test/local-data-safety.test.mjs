import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { GeoPoint, Timestamp } from "@google-cloud/firestore";
import {
  assertConfirmation,
  assertSafeLocalTarget,
  backupCounts,
  decodeFirestoreValue,
  encodeFirestoreValue,
  isLocalFixtureRecord,
  localEmulatorAddress,
  parseCliArguments,
  parseCollectionSelection,
  validateLocalBackup
} from "../scripts/lib/local-data-safety.mjs";
import {
  assertFullSystemFixtureCoverage,
  fullSystemFixtureCoverage,
  requiredFixtureCoverage
} from "../scripts/lib/full-system-fixtures.mjs";
import {
  buildControlledCountingQaRecords,
  controlledCountingQaCollections,
  controlledCountingQaFixtureSet
} from "../scripts/lib/controlled-counting-qa-fixtures.mjs";

const controlledQaSource = await readFile(
  new URL("../scripts/controlled-counting-qa.mjs", import.meta.url),
  "utf8"
);

test("local data tools accept only a loopback Firestore emulator", () => {
  assert.deepEqual(localEmulatorAddress("127.0.0.1:8085"), {
    host: "127.0.0.1",
    port: 8085
  });
  assert.deepEqual(localEmulatorAddress("localhost:8080"), {
    host: "localhost",
    port: 8080
  });
  assert.throws(
    () => localEmulatorAddress("firestore.googleapis.com:443"),
    /local Firestore emulator/
  );
  assert.throws(() => localEmulatorAddress("0.0.0.0:8080"), /local Firestore emulator/);
});

test("local data tools refuse the production project", () => {
  assert.throws(
    () => assertSafeLocalTarget({
      projectId: "snack-crm",
      emulatorHost: "127.0.0.1:8085"
    }),
    /production project/
  );
  assert.deepEqual(
    assertSafeLocalTarget({
      projectId: "snack-crm-local",
      emulatorHost: "127.0.0.1:8085"
    }),
    {
      projectId: "snack-crm-local",
      host: "127.0.0.1",
      port: 8085
    }
  );
});

test("full-system fixture cleanup removes only explicitly marked local records", () => {
  assert.equal(isLocalFixtureRecord("qa-system-client", {}, "full-system-test"), true);
  assert.equal(isLocalFixtureRecord("client-1", { qaFixture: true }, "full-system-test"), true);
  assert.equal(isLocalFixtureRecord("client-2", { qaFixtureSet: "full-system-test" }, "full-system-test"), true);
  assert.equal(isLocalFixtureRecord("client-3", { qaFixtureSet: "another-set" }, "full-system-test"), false);
  assert.equal(isLocalFixtureRecord("client-4", {}, "full-system-test"), false);
});

test("full-system fixtures require the workflow states needed for the Monday test", () => {
  const records = requiredFixtureCoverage.flatMap(({ collectionName, field, values }) => (
    values.map((value, index) => [collectionName, `${collectionName}-${index}`, { [field]: value }])
  ));
  records.push(
    ["performanceEvaluationQuestions", "question", {}],
    ["performanceEvaluationInstruments", "instrument", {}],
    ["performanceEvaluationResponses", "response", {
      instrumentId: "clinic-knowledge-2026-2",
      administrationPoint: "Graduation",
      status: "Complete",
      answers: Array.from({ length: 34 }, (_, index) => ({
        questionId: `CKA2-${String(index + 1).padStart(2, "0")}`,
        beforeValue: "No",
        nowValue: "Yes"
      }))
    }]
  );

  assert.equal(fullSystemFixtureCoverage([]).ready, false);
  assert.throws(() => assertFullSystemFixtureCoverage([]), /fixtures are incomplete/i);
  assert.deepEqual(assertFullSystemFixtureCoverage(records), { ready: true, missing: [] });
});

test("controlled counting QA fixtures are isolated and backed up before replacement", () => {
  const records = buildControlledCountingQaRecords();
  const populatedCollections = new Set(records.map(([collectionName]) => collectionName));
  const startActionIndex = controlledQaSource.lastIndexOf('if (action === "start") {');
  const resetActionIndex = controlledQaSource.indexOf(
    'if (action === "reset") {',
    startActionIndex
  );
  const startActionSource = controlledQaSource.slice(startActionIndex, resetActionIndex);

  records.forEach(([, documentId, data]) => {
    assert.match(documentId, /^qa-counting-/);
    assert.equal(data.qaFixture, true);
    assert.equal(data.qaFixtureSet, controlledCountingQaFixtureSet);
  });
  populatedCollections.forEach((collectionName) => {
    assert.ok(controlledCountingQaCollections.includes(collectionName));
  });
  assert.match(controlledQaSource, /assertSafeLocalTarget/);
  assert.match(startActionSource, /await backupControlledCollections\(firestore, backupPath\)/);
  assert.ok(
    startActionSource.indexOf("await backupControlledCollections(firestore, backupPath)")
      < startActionSource.indexOf("await clearControlledCollections(firestore)")
  );
  assert.match(controlledQaSource, /START CONTROLLED COUNTING QA/);
  assert.match(controlledQaSource, /RESTORE CONTROLLED COUNTING QA/);
});

test("local data collection selection is explicit and validated", () => {
  assert.deepEqual(parseCollectionSelection("clients,appointments,clients"), [
    "clients",
    "appointments"
  ]);
  assert.throws(() => parseCollectionSelection("clients,secrets"), /Unsupported collection/);
});

test("local data command parsing preserves confirmation phrases", () => {
  assert.deepEqual(
    parseCliArguments([
      "clear",
      "--collections=clients,appointments",
      "--confirm=DELETE LOCAL TEST DATA"
    ]),
    {
      action: "clear",
      flags: {
        collections: "clients,appointments",
        confirm: "DELETE LOCAL TEST DATA"
      }
    }
  );
  assert.throws(() => parseCliArguments(["clear", "clients"]), /Unexpected argument/);
});

test("local data mutations require their exact confirmation phrase", () => {
  assert.doesNotThrow(() => assertConfirmation("clear", "DELETE LOCAL TEST DATA"));
  assert.doesNotThrow(() => assertConfirmation("restore", "RESTORE LOCAL TEST DATA"));
  assert.doesNotThrow(() => assertConfirmation("replace", "REPLACE LOCAL TEST DATA"));
  assert.throws(() => assertConfirmation("clear", "delete"), /DELETE LOCAL TEST DATA/);
});

test("local data backups preserve Firestore-specific values", () => {
  const timestamp = Timestamp.fromDate(new Date("2026-07-18T12:00:00.000Z"));
  const encoded = encodeFirestoreValue({
    timestamp,
    point: new GeoPoint(45.2, -123.1),
    bytes: Buffer.from("SNACK"),
    nested: [timestamp]
  });
  const fakeFirestore = {
    doc: (path) => ({ path })
  };
  const decoded = decodeFirestoreValue(encoded, fakeFirestore);

  assert.equal(decoded.timestamp.toDate().toISOString(), "2026-07-18T12:00:00.000Z");
  assert.equal(decoded.point.latitude, 45.2);
  assert.equal(decoded.point.longitude, -123.1);
  assert.equal(decoded.bytes.toString(), "SNACK");
  assert.equal(decoded.nested[0].toDate().toISOString(), "2026-07-18T12:00:00.000Z");
});

test("local data backup validation rejects unsupported or malformed records", () => {
  const backup = {
    format: "snack-local-firestore-v1",
    collections: {
      clients: [{ id: "client-1", data: { firstName: "Test" } }],
      appointments: []
    }
  };

  assert.equal(validateLocalBackup(backup), backup);
  assert.deepEqual(backupCounts(backup), { clients: 1, appointments: 0 });
  assert.throws(
    () => validateLocalBackup({ format: "other", collections: {} }),
    /not a supported/
  );
  assert.throws(
    () => validateLocalBackup({
      format: "snack-local-firestore-v1",
      collections: { unknown: [] }
    }),
    /unsupported collection/
  );
  assert.throws(
    () => validateLocalBackup({
      format: "snack-local-firestore-v1",
      collections: { clients: [{ id: "", data: {} }] }
    }),
    /invalid record/
  );
});
