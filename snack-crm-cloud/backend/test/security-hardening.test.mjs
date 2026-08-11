import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  configuredFrontendOrigins,
  staffRoleCanAccessGrantDocuments
} from "../server.js";

const storageRules = await readFile(new URL("../../storage.rules", import.meta.url), "utf8");
const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
const bookingSource = await readFile(new URL("../../frontend/public/book.js", import.meta.url), "utf8");
const coreSource = await readFile(new URL("../lib/core.js", import.meta.url), "utf8");
const rootIgnore = await readFile(new URL("../../../.gitignore", import.meta.url), "utf8");

test("grant documents require an active staff record with Grants access", () => {
  assert.equal(staffRoleCanAccessGrantDocuments("Admin"), true);
  assert.equal(staffRoleCanAccessGrantDocuments("Manager"), true);
  assert.equal(staffRoleCanAccessGrantDocuments("Staff"), false);
  assert.match(storageRules, /staffRecord\(\)\.data\.active == true/);
  assert.match(storageRules, /staffRecord\(\)\.data\.grantDocumentAccess == true/);
  assert.match(storageRules, /request\.auth\.uid == ownerUid/);
  assert.match(storageRules, /request\.resource\.size <= 20 \* 1024 \* 1024/);
});

test("production CORS has no wildcard fallback and local development stays available", () => {
  assert.deepEqual(configuredFrontendOrigins({
    FRONTEND_ORIGINS: "https://preview.example, https://hub.snackprogram.org/",
    NODE_ENV: "production"
  }), ["https://preview.example", "https://hub.snackprogram.org"]);
  assert.deepEqual(configuredFrontendOrigins({ NODE_ENV: "production" }), []);
  assert.ok(configuredFrontendOrigins({}).includes("http://localhost:5002"));
});

test("staff sessions visibly sign out and end after inactivity", () => {
  assert.match(cleanSource, /data-account-menu-toggle/);
  assert.match(cleanSource, /data-secure-sign-out/);
  assert.match(cleanSource, /configureAccountSignInControl/);
  assert.match(cleanSource, /window\.location\.replace\("\.\/index\.html"\)/);
  assert.match(cleanSource, /browserSessionPersistence/);
  assert.match(cleanSource, /session\.inactivity_logout/);
  assert.match(cleanSource, /Your session will end soon/);
  assert.match(cleanSource, /data-session-countdown/);
});

test("denied access is saved before the server finishes its response", () => {
  const start = coreSource.indexOf("async function requireAuth");
  const end = coreSource.indexOf("async function ensureHelloMessage", start);
  const requireAuthSource = coreSource.slice(start, end);
  assert.ok(start >= 0 && end > start);
  assert.doesNotMatch(requireAuthSource, /void appendSecurityAudit/);
  assert.ok((requireAuthSource.match(/await appendSecurityAudit/g) || []).length >= 5);
});

test("public booking management tokens move out of the query string", () => {
  assert.match(bookingSource, /sessionStorage\.setItem\(storageKey, suppliedToken\)/);
  assert.match(bookingSource, /query\.delete\("token"\)/);
  assert.match(bookingSource, /history\.replaceState/);
});

test("private exports and common data files are ignored", () => {
  for (const pattern of ["*.csv", "*.tsv", "*.jsonl", "**/data-backups/", "**/real-data-import/"]) {
    assert.ok(rootIgnore.includes(pattern), `missing ${pattern}`);
  }
});
