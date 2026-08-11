import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  mapVolunteerOpportunities,
  mapVolunteerProfiles,
  volunteerMatches,
  volunteerOpportunityPayload,
  volunteerProfilePayload,
  volunteerSummary
} from "../../frontend/public/modules/volunteers.js";
import {
  opportunityValidationError,
  profileValidationError,
  publicVolunteerApplicationPayload
} from "../routes/volunteers.js";

const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
const serverSource = await readFile(new URL("../server.js", import.meta.url), "utf8");
const volunteerPageSource = await readFile(new URL("../../frontend/public/volunteer.html", import.meta.url), "utf8");
const volunteerPageScript = await readFile(new URL("../../frontend/public/volunteer.js", import.meta.url), "utf8");
const volunteerRouteSource = await readFile(new URL("../routes/volunteers.js", import.meta.url), "utf8");

test("Volunteer profiles preserve directory and approval details", () => {
  const payload = volunteerProfilePayload({
    fullName: "  Alex Sample  ",
    email: " ALEX@EXAMPLE.ORG ",
    status: " Approved ",
    interests: "Cooking Classes, Outreach, Cooking Classes",
    skills: "Spanish, Food preparation"
  });
  assert.equal(payload.fullName, "Alex Sample");
  assert.equal(payload.email, "alex@example.org");
  assert.deepEqual(payload.interests, ["Cooking Classes", "Outreach"]);
  assert.equal(profileValidationError(payload), "");

  const [profile] = mapVolunteerProfiles([{ id: "volunteer-1", ...payload }]);
  assert.equal(profile.kind, "volunteer-profile");
  assert.equal(profile.snackEmail, "Not created");
  assert.equal(volunteerMatches(profile, "food preparation"), true);
});

test("Volunteer opportunity validation protects time ranges", () => {
  const payload = volunteerOpportunityPayload({
    title: "  Pantry packing  ",
    status: "Open",
    opportunityDate: "2026-09-12",
    startTime: "09:00",
    endTime: "11:30",
    requirements: "Closed-toe shoes, Age 16+",
    capacity: "8"
  });
  assert.equal(opportunityValidationError(payload), "");
  assert.equal(opportunityValidationError({ ...payload, endTime: "08:30" }), "Opportunity end time must be after the start time.");

  const [opportunity] = mapVolunteerOpportunities([{ id: "opportunity-1", ...payload }]);
  assert.equal(opportunity.kind, "volunteer-opportunity");
  assert.equal(opportunity.timeLabel, "9:00 AM–11:30 AM");
  assert.equal(opportunity.capacity, "8");
});

test("Volunteer summary separates approved people from open opportunities", () => {
  const profiles = mapVolunteerProfiles([
    { id: "one", fullName: "Active Person", status: "Active" },
    { id: "two", fullName: "New Person", status: "Applicant" }
  ]);
  const opportunities = mapVolunteerOpportunities([
    { id: "open", title: "Open Event", status: "Open" },
    { id: "filled", title: "Filled Event", status: "Filled" }
  ]);
  assert.deepEqual(volunteerSummary(profiles, opportunities), [
    ["1", "Approved Volunteers"],
    ["1", "Applications to Review"],
    ["1", "Open Opportunities"],
    ["1", "Filled Opportunities"]
  ]);
});

test("Volunteers V1 is connected to the clean Outreach interface and protected server", () => {
  assert.match(cleanSource, /subpages: \["Events", "Leads", "Volunteers"\]/);
  assert.match(cleanSource, /data-outreach-new-volunteer/);
  assert.match(cleanSource, /data-outreach-new-opportunity/);
  assert.match(cleanSource, /data-volunteer-profile-form/);
  assert.match(cleanSource, /data-volunteer-opportunity-form/);
  assert.match(cleanSource, /fetch\(`\$\{apiBaseUrl\}\/api\/volunteer-profiles`/);
  assert.match(cleanSource, /fetch\(`\$\{apiBaseUrl\}\/api\/volunteer-opportunities`/);
  assert.match(serverSource, /app\.use\(volunteerRoutes\)/);
});

test("Volunteer view selection and detail tabs retain visible active state", () => {
  assert.match(cleanSource, /outreachSubpage === "Volunteers" \? view === outreachVolunteerView/);
  assert.match(cleanSource, /outreachDetailTab = outreachVolunteerView === "Profiles" \? "profile" : "overview"/);
  assert.match(cleanSource, /setOutreachDetailTab\(detailTab\.dataset\.outreachDetailTab\)/);
  assert.match(cleanSource, /aria-controls="outreach-detail-panel-\$\{outreachDetailTabKey\(tab\)\}"/);
});

test("Public volunteer applications create safe Applicant records", () => {
  const payload = publicVolunteerApplicationPayload({
    fullName: "  Alex Volunteer ",
    email: " ALEX@EXAMPLE.ORG ",
    phone: "971-555-0100",
    preferredContact: "Text",
    interests: ["Kids Cooking + Nutrition Classes", "Community Events"],
    volunteerFrequency: "Ongoing",
    groupVolunteering: "Open to either",
    availabilityDays: "Thursday",
    availabilityTimes: "Evenings; about 3 hours per week",
    availabilitySeasons: "Year-round",
    experience: "Event setup and bilingual communication",
    motivation: "I want to support local families.",
    permissionToContact: true
  }, "2026-08-10T18:30:00.000Z");

  assert.equal(payload.error, "");
  assert.equal(payload.record.status, "Applicant");
  assert.equal(payload.record.applicationDate, "2026-08-10");
  assert.equal(payload.record.email, "alex@example.org");
  assert.equal(payload.record.backgroundCheckStatus, "Not Started");
  assert.equal(payload.record.volunteerFrequency, "Ongoing");
  assert.equal(payload.record.groupVolunteering, "Open to either");
  assert.equal(payload.record.availabilityDays, "Thursday");
  assert.equal(payload.record.motivation, "I want to support local families.");
  assert.equal(payload.record.submissionSource, "Public volunteer application");
  assert.equal(Object.hasOwn(payload.record, "approvalDate"), true);
  assert.equal(Object.hasOwn(payload.record, "snackEmail"), true);
});

test("Public volunteer application rejects invalid or unapproved contact", () => {
  assert.equal(publicVolunteerApplicationPayload({ fullName: "Alex", email: "bad", permissionToContact: true }).error, "Enter a valid email address.");
  const completeApplication = {
    fullName: "Alex",
    email: "alex@example.org",
    volunteerFrequency: "One time",
    groupVolunteering: "No",
    availabilityDays: "Saturday",
    availabilityTimes: "Morning",
    availabilitySeasons: "Summer",
    motivation: "I want to help."
  };
  assert.equal(publicVolunteerApplicationPayload(completeApplication).error, "Permission to contact you is required.");
  assert.equal(publicVolunteerApplicationPayload({ ...completeApplication, volunteerFrequency: "Sometimes", permissionToContact: true }).error, "Choose how often you would like to volunteer.");
  assert.equal(publicVolunteerApplicationPayload({ website: "spam.example" }).spam, true);
});

test("Public volunteer application page posts only to the public application route", () => {
  assert.match(volunteerPageSource, /Volunteer With the SNACK Program/);
  assert.match(volunteerPageSource, /name="website"/);
  assert.match(volunteerPageSource, /name="permissionToContact"/);
  assert.doesNotMatch(volunteerPageSource, /Family Nutrition Education/);
  assert.match(volunteerPageSource, /name="volunteerFrequency"/);
  assert.match(volunteerPageSource, /name="groupVolunteering"/);
  assert.match(volunteerPageSource, /name="availabilityDays"/);
  assert.match(volunteerPageSource, /name="availabilityTimes"/);
  assert.match(volunteerPageSource, /name="availabilitySeasons"/);
  assert.match(volunteerPageSource, /name="motivation" rows="5" required/);
  assert.doesNotMatch(volunteerPageSource, /Your application is sent securely/);
  assert.match(volunteerPageScript, /\/api\/public\/volunteer-applications/);
  assert.match(volunteerRouteSource, /router\.post\("\/api\/public\/volunteer-applications", publicVolunteerApplicationRateLimit/);
});
