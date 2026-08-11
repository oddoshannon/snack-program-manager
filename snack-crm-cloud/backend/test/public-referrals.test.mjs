import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { newReferralCallTask, publicReferralPayload, publicReferralProviderLinks } from "../routes/referrals.js";

const referralHtml = await readFile(new URL("../../frontend/public/refer.html", import.meta.url), "utf8");
const referralSource = await readFile(new URL("../../frontend/public/refer.js", import.meta.url), "utf8");
const referralCss = await readFile(new URL("../../frontend/public/refer.css", import.meta.url), "utf8");
const printableReferralHtml = await readFile(new URL("../../frontend/public/refer-print.html", import.meta.url), "utf8");
const printableReferralCss = await readFile(new URL("../../frontend/public/refer-print.css", import.meta.url), "utf8");

test("printable referrals include fax instructions and keep handwriting areas aligned", () => {
  assert.match(printableReferralHtml, /fax it to Physicians' Medical Center/);
  assert.match(printableReferralHtml, /\(503\) 434-6290/);
  assert.match(printableReferralHtml, /page-one-referral-reason/);
  assert.doesNotMatch(printableReferralHtml, /Family\/Caregiver:/);
  assert.match(printableReferralHtml, /staff-check-grid/);
  assert.match(printableReferralCss, /\.writing-area\.reason/);
  assert.match(printableReferralCss, /\.staff-check-grid/);
});

test("public provider referrals create a New CRM referral with source details", () => {
  const result = publicReferralPayload({
    referralType: "External Clinic Referral",
    firstName: " Avery ",
    lastName: " Rivera ",
    dateOfBirth: "2015-05-14",
    parentName: " Morgan Rivera ",
    phone: " 503-555-0101 ",
    email: " morgan@example.org ",
    preferredLanguage: "English",
    preferredContactMethod: "Text",
    referralOrganization: " Sample Clinic ",
    referrerName: " Dr. Chen ",
    referrerEmail: " chen@example.org ",
    reason: "Nutrition support",
    permissionToContact: true
  }, "2026-07-31T18:00:00.000Z");

  assert.equal(result.error, "");
  assert.equal(result.record.status, "New");
  assert.equal(result.record.firstName, "Avery");
  assert.equal(result.record.referralSource, "Sample Clinic");
  assert.equal(result.record.referralDate, "2026-07-31");
  assert.equal(result.record.permissionToContact, true);
  assert.equal(result.record.referralOrganization, "Sample Clinic");
  assert.equal(result.record.referrerName, "Dr. Chen");
  assert.equal(result.record.referrerEmail, "chen@example.org");
  assert.match(result.record.notes, /Referrer: Dr\. Chen/);
  assert.match(result.record.notes, /Reason for referral: Nutrition support/);
});

test("public self referrals do not require provider fields", () => {
  const result = publicReferralPayload({
    referralType: "Self Referral",
    firstName: "Avery",
    lastName: "Rivera",
    parentName: "Morgan Rivera",
    phone: "503-555-0101",
    permissionToContact: "on"
  });
  assert.equal(result.error, "");
  assert.equal(result.record.referralSource, "Public referral form");
});

test("public family referrals create one linked record for each child", () => {
  const result = publicReferralPayload({
    referralType: "Self Referral",
    children: [
      { firstName: "Avery", lastName: "Rivera", dateOfBirth: "2015-05-14" },
      { firstName: "Jordan", lastName: "Rivera" }
    ],
    parentName: "Morgan Rivera",
    phone: "503-555-0101",
    permissionToContact: true
  });
  assert.equal(result.error, "");
  assert.equal(result.records.length, 2);
  assert.equal(result.records[1].firstName, "Jordan");
});

test("new referrals create one shared call task linked to the referral", () => {
  const task = newReferralCallTask({
    firstName: "Avery",
    lastName: "Rivera",
    parentName: "Morgan Rivera",
    referralDate: "2026-08-05",
    createdAt: "2026-08-05T17:00:00.000Z",
    updatedAt: "2026-08-05T17:00:00.000Z"
  }, "referral-1", "public-referral-form");
  assert.equal(task.title, "Call new referral: Avery Rivera");
  assert.equal(task.type, "Call");
  assert.equal(task.priority, "High");
  assert.equal(task.referralId, "referral-1");
  assert.equal(task.assignedTo, "");
  assert.match(task.notes, /Logging a call/);
});

test("public referrals only link one exact existing provider", () => {
  const links = publicReferralProviderLinks([{
    id: "network-1",
    name: "Sample Clinic",
    providers: [{ id: "provider-1", name: "Dr. Chen", email: "chen@example.org" }]
  }], {
    referralOrganization: " sample clinic ",
    referrerName: "Dr. Chen",
    referrerEmail: "CHEN@example.org"
  });
  assert.deepEqual(links, [{
    networkId: "network-1",
    providerId: "provider-1",
    organizationName: "Sample Clinic",
    providerName: "Dr. Chen"
  }]);
  assert.deepEqual(publicReferralProviderLinks([], {
    referralOrganization: "Unknown Clinic",
    referrerName: "Dr. Chen"
  }), []);
});

test("public referrals reject missing consent and silently absorb bot traps", () => {
  const missingConsent = publicReferralPayload({
    referralType: "Self Referral",
    firstName: "Avery",
    lastName: "Rivera",
    parentName: "Morgan Rivera",
    phone: "503-555-0101"
  });
  assert.match(missingConsent.error, /Permission to contact/);

  const spam = publicReferralPayload({ website: "https://spam.example" });
  assert.equal(spam.spam, true);
  assert.equal(spam.error, "");
});

test("public referral page connects required fields to the public API", () => {
  assert.match(referralHtml, /id="public-referral-form"/);
  assert.match(referralHtml, /name="permissionToContact"[^>]*required/);
  assert.match(referralHtml, /name="website"/);
  assert.match(referralHtml, /id="provider-fields"/);
  assert.match(referralHtml, /Refer a Family to the SNACK Program/);
  assert.match(referralHtml, /data-add-child/);
  assert.match(referralHtml, /refer-print\.html/);
  assert.match(referralSource, /\/api\/public\/referrals/);
  assert.match(referralSource, /children:/);
  assert.match(referralSource, /providerFields\.hidden = !visible/);
  assert.match(referralCss, /@media \(max-width: 760px\)/);
  assert.equal((printableReferralHtml.match(/class="child-box"/g) || []).length, 3);
  assert.match(printableReferralHtml, /Permission to Contact/);
  assert.match(printableReferralHtml, /SNACK Staff Use/);
  assert.match(printableReferralCss, /@page \{ size:letter portrait/);
});
