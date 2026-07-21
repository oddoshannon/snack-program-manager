import assert from "node:assert/strict";
import test from "node:test";
import { GeoPoint, Timestamp } from "@google-cloud/firestore";
import {
  assertConfirmation,
  assertSafeLocalTarget,
  backupCounts,
  decodeFirestoreValue,
  encodeFirestoreValue,
  localEmulatorAddress,
  parseCliArguments,
  parseCollectionSelection,
  validateLocalBackup
} from "../scripts/lib/local-data-safety.mjs";

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
