import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";

const publicRoot = new URL("../../frontend/public/", import.meta.url);
const page = await readFile(new URL("sandbox.html", publicRoot), "utf8");
const script = await readFile(new URL("sandbox.js", publicRoot), "utf8");

test("training sandbox is isolated to the four approved modules and browser-local fictional data", () => {
  assert.match(page, /Training Sandbox/);
  for (const moduleId of ["schedule", "crm", "outreach", "marketing"]) {
    assert.match(script, new RegExp(`${moduleId}: \\{`));
  }
  assert.doesNotMatch(script, /fundraising:/);
  assert.doesNotMatch(script, /operations:/);
  assert.doesNotMatch(script, /admin:/);
  assert.match(script, /localStorage\.setItem\(storageKey/);
  assert.match(script, /example\.invalid/);
  assert.doesNotMatch(script, /fetch\(/);
  assert.doesNotMatch(script, /\/api\//);
});

test("training sandbox supports create, edit, delete, and a complete fictional-data reset", () => {
  assert.match(script, /crypto\.randomUUID\(\)/);
  assert.match(script, /data\[activeModule\]\.unshift\(blank\)/);
  assert.match(script, /filter\(\(row\) => row\.id !== selectedId\)/);
  assert.match(script, /Object\.assign\(row, values\)/);
  assert.match(script, /data = seed\(\)/);
  assert.match(script, /Email, texting, calling, calendar, MailerLite, and production database actions are disabled/);
});
