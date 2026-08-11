import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  adminDataCollections,
  applicationDataCollectionNames,
  protectedAdminDataCollectionNames
} from "../lib/core.js";
import {
  adminDataCollectionAllowsCleanup,
  googleCalendarTestErrorMessage,
  isAdminQaFixtureDocument
} from "../routes/admin.js";
import { accessLevelDeletionError } from "../routes/access.js";
import {
  twilioSimulatedSmsTest,
  twilioTestConfigurationStatus
} from "../routes/reminders.js";
import { fullSystemFixtureCollectionNames } from "../scripts/lib/full-system-fixtures.mjs";
import { localDataCollections } from "../scripts/lib/local-data-safety.mjs";
import { parseAdminCsv, prepareAdminCsvImport } from "../../frontend/public/modules/admin-data.js";

const adminHtml = await readFile(new URL("../../frontend/public/admin.html", import.meta.url), "utf8");
const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
const cleanCss = await readFile(new URL("../../frontend/public/clean.css", import.meta.url), "utf8");
const accessRouteSource = await readFile(new URL("../routes/access.js", import.meta.url), "utf8");
const adminRouteSource = await readFile(new URL("../routes/admin.js", import.meta.url), "utf8");

test("clean Admin organizes Settings, Schedule, and Integrations without quick actions", () => {
  assert.match(adminHtml, /SNACK_MODULE_ID = "admin"/);
  assert.match(cleanSource, /subpages: \["Settings", "Schedule", "Integrations"\]/);
  assert.match(cleanSource, /const adminSettingsTabs = Object\.freeze\(\["Team", "Access", "CRM", "Forms", "Data"\]\)/);
  assert.match(cleanSource, /function renderAdminSettingsWorkspace\(\)/);
  assert.match(cleanSource, /function renderAdminTeamWorkspace\(\)/);
  assert.match(cleanSource, /function renderAdminCrmSettingsWorkspace\(\)/);
  assert.match(cleanSource, /function renderAdminFormsWorkspace\(\)/);
  assert.match(cleanSource, /function renderAdminDataWorkspace\(\)/);
  assert.match(cleanSource, /function renderAdminIntegrationsWorkspace\(\)/);
  assert.match(cleanSource, /data-admin-settings-workspace/);
  assert.match(cleanSource, /\{ id: "Team", iconName: "crm" \}/);
  assert.match(cleanSource, /\{ id: "Access", iconName: "admin" \}/);
  assert.match(cleanSource, /\{ id: "CRM", iconName: "crm" \}/);
  assert.match(cleanSource, /\{ id: "Forms", iconName: "file" \}/);
  assert.match(cleanSource, /\{ id: "Data", iconName: "upload" \}/);
  assert.match(cleanSource, /data-admin-settings-tab="\$\{tab\.id\}"/);
  assert.match(cleanSource, /data-admin-integrations-workspace/);
  assert.match(cleanSource, /data-admin-scheduling-workspace/);
  assert.match(cleanSource, /module\.quickActions\.length && moduleId !== "admin"/);
  assert.match(cleanCss, /\.admin-settings-tabs/);
  assert.match(cleanCss, /\.admin-settings-tabs[\s\S]*grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/);
  assert.match(cleanSource, /data-program-settings-column="clinic"/);
  assert.match(cleanSource, /data-program-settings-column="kitchen"/);
  assert.ok(cleanSource.indexOf("Clinic Availability") < cleanSource.indexOf("Clinic Appointment Types"));
  assert.ok(cleanSource.indexOf("Kitchen Availability") < cleanSource.indexOf("Kitchen Class Types"));
  assert.match(cleanCss, /\.program-settings-columns/);
  assert.match(cleanSource, /Default Appointment Length/);
  assert.match(cleanSource, /name="defaultDurationMinutes"/);
});

test("Admin can manage CRM statuses and safely remove temporary staff access", () => {
  assert.match(cleanSource, /Age Limit is available for children outside SNACK's 6–18 age range/);
  assert.match(cleanSource, /\/api\/admin\/crm-settings/);
  assert.match(cleanSource, /data-admin-add-client-status/);
  assert.match(cleanSource, /data-admin-remove-client-status/);
  assert.match(cleanSource, /data-admin-remove-account/);
  assert.match(cleanSource, /Their Google account will not be deleted/);
  assert.match(accessRouteSource, /router\.delete\("\/api\/admin\/staff-users\/:staffEmail"/);
  assert.match(accessRouteSource, /The protected director account cannot be removed/);
  assert.match(accessRouteSource, /You cannot remove the account you are currently using/);
});

test("Manager access is limited to Grants and Giving within Finances", () => {
  assert.match(cleanSource, /const financeSectionOrder = Object\.freeze\(\[/);
  assert.match(cleanSource, /function staffCanAccessFinanceSection\(section\)/);
  assert.match(cleanSource, /staffPageAccessDecision/);
  assert.match(cleanSource, /Finance Sections/);
  assert.match(accessRouteSource, /financeSections/);
});

test("Admin Data Center previews imports and limits cleanup to marked sample records", () => {
  assert.match(cleanSource, /Data Center/);
  assert.match(cleanSource, /\/api\/admin\/data-center/);
  assert.match(cleanSource, /\/api\/admin\/qa-fixtures\/delete/);
  assert.match(cleanSource, /DELETE SAMPLE DATA/);
  assert.match(cleanSource, /downloadAdminBackup/);
  assert.match(cleanCss, /\.admin-data-grid/);
  assert.match(cleanCss, /\.admin-security-history\s*\{\s*grid-column:\s*1\s*\/\s*-1/);
  assert.match(cleanCss, /\.admin-security-history \.admin-data-collection-list\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(cleanSource, /event\.result === "denied" \? "is-denied"/);
  assert.match(cleanCss, /\.admin-security-history \.admin-data-collection-list b\.is-denied\s*\{\s*color:\s*var\(--danger\)/);
  assert.match(adminRouteSource, /router\.get\("\/api\/admin\/data-center"/);
  assert.match(adminRouteSource, /router\.post\("\/api\/admin\/qa-fixtures\/delete"/);

  assert.equal(isAdminQaFixtureDocument({
    id: "qa-system-client-sky",
    data: () => ({ qaFixture: true, qaFixtureSet: "full-system" })
  }), true);
  assert.equal(isAdminQaFixtureDocument({ id: "qa-system-client-sky", data: () => ({}) }), false);
  assert.equal(isAdminQaFixtureDocument({ id: "ordinary", data: () => ({ qaFixture: true, qaFixtureSet: "full-system" }) }), false);
  assert.equal(isAdminQaFixtureDocument({ id: "qa-system-client-sky", data: () => ({ qaFixture: true }) }), false);
  assert.equal(isAdminQaFixtureDocument({ id: "ordinary", data: () => ({ firstName: "Avery" }) }), false);
});

test("Admin Data Center covers every application collection and protects staff configuration", () => {
  const sortNames = (values) => [...values].sort();
  const backupConfigs = Object.values(adminDataCollections);
  const backupNames = backupConfigs.map((config) => config.collection.id);

  assert.equal(new Set(backupNames).size, backupNames.length);
  assert.deepEqual(sortNames(backupNames), sortNames(applicationDataCollectionNames));
  assert.deepEqual(sortNames(localDataCollections), sortNames(applicationDataCollectionNames));

  fullSystemFixtureCollectionNames.forEach((collectionName) => {
    assert.ok(applicationDataCollectionNames.includes(collectionName));
    const config = backupConfigs.find((item) => item.collection.id === collectionName);
    assert.ok(config);
    if (protectedAdminDataCollectionNames.includes(collectionName)) {
      assert.equal(adminDataCollectionAllowsCleanup(config), false);
    } else {
      assert.equal(adminDataCollectionAllowsCleanup(config), true);
    }
  });

  protectedAdminDataCollectionNames.forEach((collectionName) => {
    const config = backupConfigs.find((item) => item.collection.id === collectionName);
    assert.ok(config);
    assert.equal(adminDataCollectionAllowsCleanup(config), false);
  });

  assert.match(cleanSource, /collection\.cleanupEligible !== false/);
});

test("Admin Calendar lifecycle failures stay useful without exposing credentials", () => {
  assert.match(
    googleCalendarTestErrorMessage(new Error("invalid_grant: invalid_rapt")),
    /Google sign-in needs to be refreshed/
  );
  assert.doesNotMatch(
    googleCalendarTestErrorMessage(new Error("invalid_grant: invalid_rapt")),
    /invalid_grant|invalid_rapt/
  );
  assert.match(googleCalendarTestErrorMessage(new Error("forbidden")), /permission to edit/);
});

test("Admin CSV preview handles quoted values and blocks incomplete people", () => {
  const parsed = parseAdminCsv('First Name,Last Name,Parent Name,Mobile,Preferred Language,Status,Note\nAvery,Rivera,Morgan,503-555-0101,English,Scheduled,"Needs, follow-up"');
  assert.equal(parsed.rows.length, 1);
  assert.equal(parsed.rows[0].Note, "Needs, follow-up");

  const preview = prepareAdminCsvImport("clients", [
    "First Name,Last Name,Parent Name,Mobile,Preferred Language,Status",
    "Avery,Rivera,Morgan,503-555-0101,English,Scheduled",
    "Missing,Phone,Morgan,,English,Scheduled"
  ].join("\n"), "clients.csv");
  assert.equal(preview.records.length, 1);
  assert.equal(preview.invalidRows.length, 1);
  assert.match(preview.invalidRows[0].reason, /phone/);
});

test("Admin Team profiles stay separate from access permissions", () => {
  assert.match(cleanSource, /data-admin-team-profile/);
  assert.match(cleanSource, /Module access is managed separately in the Access tab/);
  assert.match(cleanSource, /\/api\/admin\/staff-users\/\$\{encodeURIComponent\(email\)\}\/profile/);
  assert.match(accessRouteSource, /router\.patch\("\/api\/admin\/staff-users\/:staffEmail\/profile"/);
  assert.match(accessRouteSource, /programs: cleanStaffPrograms\(request\.body\.programs\)/);
  assert.match(cleanCss, /\.admin-team-grid/);
});

test("Admin access levels are editable, reusable, and assignable to additional Admins", () => {
  assert.match(cleanSource, /data-admin-access-level/);
  assert.match(cleanSource, /data-admin-access-level-new/);
  assert.match(cleanSource, /name="accessLevelId"/);
  assert.match(cleanSource, /additional staff may be assigned the Admin level/);
  assert.match(cleanSource, /protectedOwner/);
  assert.match(cleanSource, /\/api\/admin\/access-levels/);
  assert.match(accessRouteSource, /router\.post\("\/api\/admin\/access-levels"/);
  assert.match(accessRouteSource, /router\.put\("\/api\/admin\/access-levels\/:accessLevelId"/);
  assert.match(accessRouteSource, /router\.delete\("\/api\/admin\/access-levels\/:accessLevelId"/);
  assert.match(cleanSource, /data-admin-delete-access-level/);
  assert.match(accessRouteSource, /accessLevelId: role/);
  assert.match(accessRouteSource, /protectedOwner: true/);
  assert.match(cleanCss, /\.admin-access-module-options/);
  assert.equal(accessLevelDeletionError({ system: true }, 0), "Built-in access levels cannot be deleted.");
  assert.match(accessLevelDeletionError({ system: false }, 1), /Reassign 1 staff account/);
  assert.equal(accessLevelDeletionError({ system: false }, 0), "");
});

test("Admin Forms separates native assessments from the remaining bilingual packet downloads", () => {
  assert.match(cleanSource, /Print Form Library/);
  assert.match(cleanSource, /crmPrintFormPackets\.enrollment\.English/);
  assert.match(cleanSource, /crmPrintFormPackets\.graduation\.Spanish/);
  assert.match(cleanSource, /Native Clinic Forms/);
  assert.match(cleanSource, /Enrollment Questionnaire/);
  assert.match(cleanSource, /Graduation Knowledge Assessment/);
  assert.match(cleanSource, /1\. Program Enrollment - Print\.docx/);
  assert.match(cleanSource, /5\. SP Parent Feedback Form - Print\.docx/);
  assert.doesNotMatch(cleanSource, /2\. SP Questionnaire - Print\.xlsx/);
  assert.match(cleanSource, /operations\.html\?section=Evaluation/);
  assert.match(cleanCss, /\.admin-form-library/);
});

test("Admin Integrations reports live connections without exposing credentials", () => {
  assert.match(cleanSource, /function loadAdminIntegrationStatus\(\)/);
  assert.match(cleanSource, /\/api\/access\/me/);
  assert.match(cleanSource, /\/api\/admin\/scheduling-settings/);
  assert.match(cleanSource, /\/api\/admin\/google-calendar\/status/);
  assert.match(cleanSource, /\/api\/admin\/google-calendar\/test/);
  assert.match(cleanSource, /data-admin-test-calendar/);
  assert.match(adminRouteSource, /router\.post\("\/api\/admin\/google-calendar\/test"/);
  assert.match(adminRouteSource, /TEST CLINIC CALENDAR/);
  assert.match(cleanSource, /\/api\/marketing\/mailerlite\/status/);
  assert.match(cleanSource, /\/api\/reminders\/twilio\/status/);
  assert.match(cleanSource, /\/api\/reminders\/twilio\/test/);
  assert.match(cleanSource, /TEST TWILIO WITHOUT SENDING/);
  assert.match(cleanSource, /No text was sent and delivery remains off/);
  assert.match(cleanSource, /Secret keys are configured on the server and never shown here/);
  assert.match(cleanCss, /\.admin-integration-grid/);
});

test("real integration failures create one deduplicated Admin follow-up task", () => {
  assert.match(cleanSource, /Check \$\{service\} connection/);
  assert.match(cleanSource, /failed a real connection check/);
  assert.match(cleanSource, /No secret keys or client messages/);
});

test("Twilio connection testing is simulated and cannot send a real text", async () => {
  assert.equal(twilioTestConfigurationStatus("", "").configured, false);

  let request = null;
  const result = await twilioSimulatedSmsTest("ACtest", "test-token", async (url, options) => {
    request = { url, options };
    return { ok: true, status: 201 };
  });

  assert.equal(result.configured, true);
  assert.equal(result.connected, true);
  assert.equal(result.simulated, true);
  assert.equal(result.deliveryEnabled, false);
  assert.match(request.url, /Accounts\/ACtest\/Messages\.json$/);
  assert.equal(request.options.method, "POST");
  assert.match(request.options.body, /From=%2B15005550006/);
  assert.match(request.options.body, /To=%2B15005550006/);
  assert.doesNotMatch(request.options.body, /9712020232/);
});
