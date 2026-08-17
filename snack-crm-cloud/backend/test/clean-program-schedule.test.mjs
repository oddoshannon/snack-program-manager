import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  defaultKitchenClassTypes,
  mapProgramSessions,
  normalizeProgramScheduleSettings,
  programClientContact,
  programClientSearchResults,
  programRegistrationPayload,
  programScheduleSummary,
  programSessionPayload
} from "../../frontend/public/modules/program-schedule.js";
import { normalizeMailingAddress as normalizePublicMailingAddress } from "../../frontend/public/modules/public-booking.js";
import {
  cleanProgramRegistrationPayload,
  cleanProgramSessionPayload,
  normalizeSchedulingSettings,
  programRegistrationStatusForCapacity
} from "../server.js";

const classNames = [
  "Kids Cooking + Nutrition Class - Ages 6-9",
  "Kids Cooking + Nutrition Class - Ages 8-12",
  "Teen Nutrition & Cooking Class - Ages 13-18"
];

test("Kitchen starts with the approved editable class defaults only", () => {
  assert.deepEqual(defaultKitchenClassTypes.map((item) => item.label), classNames);
  assert.equal(defaultKitchenClassTypes.every((item) => item.durationMinutes === 120), true);
  assert.equal(defaultKitchenClassTypes.every((item) => item.capacity === 8), true);
  assert.equal(defaultKitchenClassTypes.some((item) => item.label.includes("Community Wellness Day")), false);
  assert.equal(
    normalizeProgramScheduleSettings({}).kitchen.location,
    "1317 NE Dustin Ct, McMinnville, OR 97128"
  );
  assert.equal(
    normalizeSchedulingSettings({}).kitchen.location,
    "1317 NE Dustin Ct, McMinnville, OR 97128"
  );
});

test("legacy Kids class names display with the approved Cooking + Nutrition wording", () => {
  const settings = normalizeProgramScheduleSettings({
    kitchenClassTypes: [{
      id: "kids-cooking-ages-6-9",
      label: "Kids Nutrition & Cooking Class - Ages 6-9",
      durationMinutes: 120,
      capacity: 8,
      active: true,
      publiclyBookable: true
    }]
  });
  assert.equal(settings.kitchenClassTypes[0].label, "Kids Cooking + Nutrition Class - Ages 6-9");
  assert.equal(mapProgramSessions([{
    id: "session-1",
    program: "Kitchen",
    title: "Kids Nutrition & Cooking Class - Ages 6-9",
    classTypeLabel: "Kids Nutrition & Cooking Class - Ages 6-9",
    sessionDate: "2026-08-20",
    startTime: "17:30",
    status: "Scheduled"
  }], [], "Kitchen")[0].title, "Kids Cooking + Nutrition Class - Ages 6-9");
});

test("schedule settings preserve customized clinic services and Kitchen classes", () => {
  const settings = normalizeProgramScheduleSettings({
    clinicServices: [{
      id: "clinic-custom",
      label: "Custom Clinic Visit",
      appointmentType: "Custom",
      durationMinutes: 45,
      defaultLanguage: "English",
      staffMember: "Shannon Oddo",
      active: true,
      publiclyBookable: false
    }],
    kitchenClassTypes: [{
      id: "family-cooking",
      label: "Family Cooking Lab",
      durationMinutes: 90,
      capacity: 12,
      active: true,
      publiclyBookable: true
    }],
    kitchen: {
      startTime: "10:00",
      endTime: "16:30",
      weekdays: [1, 5],
      defaultCapacity: 12,
      waitlistEnabled: false,
      location: "321 Kitchen Street, McMinnville, Oregon 97128"
    }
  });

  assert.equal(settings.clinicServices[0].label, "Custom Clinic Visit");
  assert.equal(settings.clinicServices[0].durationMinutes, 45);
  assert.equal(settings.kitchenClassTypes[0].label, "Family Cooking Lab");
  assert.equal(settings.kitchenClassTypes[0].capacity, 12);
  assert.deepEqual(settings.kitchen.weekdays, [1, 5]);
  assert.equal(settings.kitchen.waitlistEnabled, false);
  assert.equal(settings.kitchen.location, "321 Kitchen Street, McMinnville, Oregon 97128");
  assert.equal(settings.clinicLocation, "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128");
});

test("backend scheduling settings normalize editable program defaults", () => {
  const settings = normalizeSchedulingSettings({
    kitchenClassTypes: [{
      id: "test-class",
      label: "Test Class",
      durationMinutes: 75,
      capacity: 6,
      active: true,
      publiclyBookable: false
    }],
    kitchen: {
      startTime: "09:00",
      endTime: "14:00",
      weekdays: [6],
      defaultCapacity: 6,
      waitlistEnabled: true,
      location: "321 se kitchen street, mcminnville, oregon 97128"
    },
    clinicLocation: "2435 ne cumulus avenue, suite a, mcminnville, oregon 97128"
  });

  assert.equal(settings.kitchenClassTypes[0].label, "Test Class");
  assert.equal(settings.kitchenClassTypes[0].durationMinutes, 75);
  assert.equal(settings.kitchen.defaultCapacity, 6);
  assert.deepEqual(settings.kitchen.weekdays, [6]);
  assert.equal(settings.kitchen.location, "321 SE Kitchen St, McMinnville, OR 97128");
  assert.equal(settings.clinicLocation, "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128");
});

test("public booking address formatting matches the backend rule", () => {
  assert.equal(
    normalizePublicMailingAddress("2435 ne cumulus avenue, suite a, mcminnville, oregon 97128"),
    "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128"
  );
});

test("Kitchen sessions inherit the selected class defaults but remain editable", () => {
  const payload = programSessionPayload({
    classTypeId: "kids-cooking-ages-6-9",
    sessionDate: "2026-08-04",
    startTime: "13:00",
    durationMinutes: "150",
    capacity: "10",
    status: "Scheduled",
    location: "SNACK kitchen"
  }, "Kitchen", defaultKitchenClassTypes);

  assert.equal(payload.title, "Kids Cooking + Nutrition Class - Ages 6-9");
  assert.equal(payload.durationMinutes, 150);
  assert.equal(payload.capacity, 10);
  assert.equal(cleanProgramSessionPayload(payload).program, "Kitchen");
});

test("Kitchen registration stores one family with multiple children", () => {
  const session = { id: "session-1", program: "Kitchen" };
  const payload = programRegistrationPayload({
    caregiverName: "Jordan",
    phone: "971-555-0100",
    email: "family@example.com"
  }, session, [
    { id: "milo", firstName: "Milo", lastName: "Garcia" },
    { id: "tessa", firstName: "Tessa", lastName: "Garcia" }
  ]);
  const cleaned = cleanProgramRegistrationPayload(payload);

  assert.deepEqual(cleaned.clientIds, ["milo", "tessa"]);
  assert.deepEqual(cleaned.clientNames, ["Milo Garcia", "Tessa Garcia"]);
  assert.equal(cleaned.attendeeCount, 2);
  assert.equal(cleaned.caregiverName, "Jordan");
});

test("Kitchen client search waits for a real query and returns family contact details", () => {
  const clients = [
    { id: "milo", firstName: "Milo", lastName: "Garcia", parentName: "Jordan", phone: "971-555-0100", email: "family@example.com" },
    { id: "tessa", firstName: "Tessa", lastName: "Garcia", parentName: "Jordan", phone: "971-555-0100", email: "family@example.com" },
    { id: "other", firstName: "Other", lastName: "Child", parentName: "Someone" }
  ];

  assert.deepEqual(programClientSearchResults(clients, "", []), []);
  assert.deepEqual(programClientSearchResults(clients, "mi", ["tessa"]).map((client) => client.id), ["milo"]);
  assert.deepEqual(programClientSearchResults(clients, "jordan", ["milo"]).map((client) => client.id), ["tessa"]);
  assert.deepEqual(programClientContact(clients[0]), {
    caregiverName: "Jordan",
    phone: "971-555-0100",
    email: "family@example.com"
  });
});

test("capacity counts children and waitlists a whole family together", () => {
  const session = { capacity: 8 };
  const registrations = [
    { status: "Registered", attendeeCount: 3 },
    { status: "Attended", attendeeCount: 4 }
  ];

  assert.equal(programRegistrationStatusForCapacity(session, registrations, 1, true), "Registered");
  assert.equal(programRegistrationStatusForCapacity(session, registrations, 2, true), "Waitlisted");
});

test("Kitchen and School summaries use their own program measures", () => {
  const sessions = mapProgramSessions([
    { id: "k1", program: "Kitchen", title: "Class", sessionDate: "2026-08-04", startTime: "13:00", durationMinutes: 120, capacity: 8, status: "Scheduled" },
    { id: "s1", program: "School", title: "School Visit", schoolName: "Test School", sessionDate: "2026-08-05", startTime: "10:00", durationMinutes: 60, participantCount: 24, status: "Completed" }
  ], [
    { id: "r1", sessionId: "k1", program: "Kitchen", status: "Registered", attendeeCount: 2 }
  ], "Kitchen");

  assert.deepEqual(programScheduleSummary(sessions, "Kitchen", "2026-08-01")[1], ["2", "Registered Children"]);
  const schoolSessions = mapProgramSessions([
    { id: "s1", program: "School", title: "School Visit", schoolName: "Test School", sessionDate: "2026-08-05", startTime: "10:00", durationMinutes: 60, participantCount: 24, status: "Completed" }
  ], [], "School");
  assert.deepEqual(programScheduleSummary(schoolSessions, "School", "2026-08-01")[0], ["1", "Upcoming Classes"]);
  assert.deepEqual(programScheduleSummary(schoolSessions, "School", "2026-08-01")[1], ["24", "Participants"]);
  assert.deepEqual(programScheduleSummary(schoolSessions, "School", "2026-08-01")[3], ["1", "Completed Classes"]);
});

test("clean schedule exposes Kitchen and School without enabling School public booking", () => {
  const cleanSource = readFileSync(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
  const programRouteSource = readFileSync(new URL("../routes/program-schedule.js", import.meta.url), "utf8");

  assert.match(cleanSource, /subpages: \["Clinic", "Kitchen", "School", "Public Booking"\]/);
  assert.match(cleanSource, /subpages: \["Settings", "Schedule", "Security & Integrations"\]/);
  assert.match(cleanSource, /const adminSettingsTabs = Object\.freeze\(\["Team", "Access", "CRM", "Forms", "Data"\]\)/);
  assert.match(cleanSource, /data-program-settings-form/);
  assert.match(cleanSource, /data-program-registration-form/);
  assert.match(cleanSource, /data-program-select-client/);
  assert.match(cleanSource, /Choose automatically registers the whole family/);
  assert.match(cleanSource, /School Classes/);
  assert.match(cleanSource, /Clinic Appointment Location/);
  assert.match(cleanSource, /Default Cooking Class Location/);
  assert.doesNotMatch(cleanSource, /\["settings", "Settings", "admin"\]/);
  assert.match(programRouteSource, /router\.post\("\/api\/program-sessions"/);
  assert.doesNotMatch(programRouteSource, /\/api\/public\/school/);
});
