import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  accountMenuUiState,
  cleanModulePageTitle,
  cleanModuleSummaryVisible,
  sessionCountdownLabel,
  staffPageAccessDecision
} from "../../frontend/public/modules/shell.js";

const publicRoot = new URL("../../frontend/public/", import.meta.url);
const cleanSource = await readFile(new URL("clean.js", publicRoot), "utf8");
const staffPages = [
  "index.html",
  "schedule.html",
  "crm.html",
  "outreach.html",
  "finances.html",
  "marketing.html",
  "operations.html",
  "admin.html"
];

test("clean staff pages load one current shared interface version", async () => {
  const versions = [];

  for (const page of staffPages) {
    const source = await readFile(new URL(page, publicRoot), "utf8");
    const cssVersion = source.match(/clean\.css\?v=([^"']+)/)?.[1];
    const scriptVersion = source.match(/clean\.js\?v=([^"']+)/)?.[1];

    assert.ok(cssVersion, `${page} must version clean.css.`);
    assert.ok(scriptVersion, `${page} must version clean.js.`);
    assert.equal(scriptVersion, cssVersion, `${page} must load matching CSS and JavaScript.`);
    const configPosition = source.indexOf("app-config.js");
    const interfacePosition = source.indexOf("clean.js");
    assert.ok(configPosition >= 0, `${page} must load app-config.js.`);
    assert.ok(configPosition < interfacePosition, `${page} must load configuration before the interface.`);
    versions.push(scriptVersion);
  }

  assert.equal(new Set(versions).size, 1, "All staff pages must load the same clean interface version.");
});

test("shared page titles use module names only for dashboards", () => {
  assert.equal(cleanModulePageTitle("crm", "CRM", "Dashboard", "CRM"), "CRM");
  assert.equal(cleanModulePageTitle("crm", "CRM", "Clients", "CRM"), "Clients");
  assert.equal(cleanModulePageTitle("fundraising", "Finances", "Financial Activity", "Finances"), "Financial Activity");
  assert.equal(cleanModulePageTitle("operations", "Operations", "Performance", "Operations"), "Performance");
  assert.equal(cleanModulePageTitle("schedule", "Schedule", "Clinic", "Clinic Schedule"), "Clinic Schedule");
  assert.equal(cleanModulePageTitle("schedule", "Schedule", "Kitchen", "Clinic Schedule"), "Kitchen Schedule");
  assert.equal(cleanModulePageTitle("schedule", "Schedule", "School", "Clinic Schedule"), "School Schedule");
  assert.equal(cleanModulePageTitle("schedule", "Schedule", "Print Forms", "Clinic Schedule"), "Print Forms");
});

test("Operations counters remain dashboard-only and record workspaces avoid empty counters", () => {
  assert.equal(cleanModuleSummaryVisible("operations", "Dashboard"), true);
  assert.equal(cleanModuleSummaryVisible("operations", "Performance"), false);
  assert.equal(cleanModuleSummaryVisible("marketing", "Templates"), false);
  assert.equal(cleanModuleSummaryVisible("fundraising", "Grants"), true);
  assert.equal(cleanModuleSummaryVisible("fundraising", "HRSN Billing"), false);
  assert.equal(cleanModuleSummaryVisible("fundraising", "Budget"), false);
});

test("the staff account menu stays closed until a signed-in user opens it", () => {
  assert.deepEqual(accountMenuUiState(false, true), {
    triggerHidden: true,
    menuHidden: true,
    expanded: false
  });
  assert.deepEqual(accountMenuUiState(true, false), {
    triggerHidden: false,
    menuHidden: true,
    expanded: false
  });
  assert.deepEqual(accountMenuUiState(true, true), {
    triggerHidden: false,
    menuHidden: false,
    expanded: true
  });
});

test("direct staff-page addresses fail closed before showing unauthorized modules or Finance sections", () => {
  assert.deepEqual(staffPageAccessDecision({
    moduleId: "fundraising",
    modules: ["schedule", "crm", "outreach"],
    financeSection: "Grants",
    financeSections: []
  }), {
    allowed: false,
    destination: "schedule",
    financeSection: ""
  });
  assert.deepEqual(staffPageAccessDecision({
    moduleId: "fundraising",
    modules: ["schedule", "fundraising"],
    financeSection: "Budget",
    financeSections: ["Grants", "Giving"]
  }), {
    allowed: false,
    destination: "fundraising",
    financeSection: "Grants"
  });
  assert.deepEqual(staffPageAccessDecision({
    moduleId: "fundraising",
    modules: ["schedule", "fundraising"],
    financeSection: "Grants",
    financeSections: ["Grants", "Giving"]
  }), {
    allowed: true,
    destination: "fundraising",
    financeSection: "Grants"
  });
});

test("verified staff pages remain visible after an in-page workspace change", () => {
  assert.match(cleanSource, /function revealVerifiedStaffShell\(\)/);
  assert.match(cleanSource, /if \(!staffAccessProfile \|\| !currentStaffPageAccessDecision\(\)\.allowed\) return false/);
  assert.match(cleanSource, /if \(moduleId === "fundraising" && fundraisingSubpage === "Grants"\) \{[\s\S]*?refreshFundraisingWorkspace\(\);[\s\S]*?\}\s*revealVerifiedStaffShell\(\);/);
  assert.match(cleanSource, /fundraisingCurrentUser \? staffAccountDisplayName\(fundraisingCurrentUser\) : "Sign in"/);
  assert.doesNotMatch(cleanSource, /CurrentUser \? "Shannon Oddo" : "Sign in"/);
});

test("the inactivity warning shows an exact minute-and-second countdown", () => {
  assert.equal(sessionCountdownLabel(300), "5:00");
  assert.equal(sessionCountdownLabel(299.1), "5:00");
  assert.equal(sessionCountdownLabel(59), "0:59");
  assert.equal(sessionCountdownLabel(-1), "0:00");
});
