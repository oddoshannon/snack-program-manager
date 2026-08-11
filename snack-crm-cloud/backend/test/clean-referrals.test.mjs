import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  crmConfirmDecision,
  crmNetworkMatches,
  crmNetworkPayload,
  crmNetworkSummary,
  crmReferralActivityPayload,
  crmReferralMatches,
  crmReferralPayload,
  crmReferralProviderLinks,
  crmReferralSummary,
  mapCrmNetworkEntries,
  mapCrmNetworkEntry,
  mapCrmReferral,
  mapCrmReferrals,
  referralStatusOptions
} from "../../frontend/public/modules/referrals.js";

const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
const cleanCss = await readFile(new URL("../../frontend/public/clean.css", import.meta.url), "utf8");

test("referral status choices put Scheduled before the three closed-by-default groups", () => {
  assert.ok(referralStatusOptions.indexOf("Scheduled") < referralStatusOptions.indexOf("Caregiver Will Call Back"));
  assert.match(cleanSource, /crmExpandedReferralStatuses = new Set\(\["New", "Texted", "Left Voicemail", "Emailed", "Requested Call Back", "Scheduled"\]\)/);
  assert.match(cleanSource, /data-crm-add-referral-partner/);
  assert.match(cleanSource, /data-crm-complete-public-review/);
  assert.match(cleanCss, /\.crm-record-review-alert/);
});

const referrals = [
  {
    id: "referral-2",
    firstName: "Tessa",
    lastName: "Exampleton",
    parentName: "Jordan",
    preferredLanguage: "Spanish",
    preferredContactMethod: "Text",
    referralType: "Self Referral",
    referralSource: "Public booking",
    referralDate: "2026-07-10",
    firstContactDate: "2026-07-11",
    mostRecentContactDate: "2026-07-12",
    status: "Texted",
    phone: "971-555-0101",
    email: "jordan@example.com",
    siblingIds: ["referral-1"],
    ycco: true,
    yccoId: "123ABC456",
    hrsn: false,
    providerLinks: [{
      networkId: "network-1",
      providerId: "provider-1",
      organizationName: "Physicians Medical Center",
      providerName: "Dr. Rivera"
    }]
  },
  {
    id: "referral-1",
    firstName: "Milo",
    lastName: "Exampleton",
    parentName: "Jordan",
    status: "New",
    siblingIds: ["referral-2"]
  },
  {
    id: "referral-3",
    firstName: "Cora",
    lastName: "Sample",
    status: "Scheduled",
    convertedClientId: "client-3"
  },
  {
    id: "referral-4",
    firstName: "Max",
    lastName: "Sample",
    status: "Closed / No Further Outreach"
  }
];

const networkEntries = [
  {
    id: "network-1",
    name: "Physicians Medical Center",
    type: "Clinic",
    contactName: "Reception A",
    phone: "971-555-0200",
    email: "referrals@example.com",
    providers: [
      { id: "provider-1", name: "Dr. Rivera", email: "rivera@example.com" },
      { id: "provider-2", name: "Dr. Kim", email: "kim@example.com" }
    ]
  },
  {
    id: "network-2",
    name: "Yamhill School",
    type: "School",
    providers: []
  }
];

test("clean referrals map family, contact, provider, and conversion information", () => {
  const items = mapCrmReferrals(referrals, {
    activityLogs: [{
      id: "activity-1",
      relatedType: "referral",
      relatedId: "referral-2",
      activityDate: "2026-07-15",
      activityTime: "14:30"
    }]
  });
  const tessa = items.find((item) => item.id === "referral-2");

  assert.deepEqual(items.map((item) => item.title), [
    "Milo Exampleton",
    "Tessa Exampleton",
    "Max Sample"
  ]);
  assert.equal(tessa.siblings, "Milo Exampleton");
  assert.deepEqual(tessa.siblingProfiles, [{
    id: "referral-1",
    name: "Milo Exampleton",
    section: "Referrals"
  }]);
  assert.equal(tessa.subtitle, "7/15/26 | 971-555-0101 | Jordan | Spanish");
  assert.equal(tessa.recentContact, "7/15/26");
  assert.equal(tessa.providerProfiles, "Dr. Rivera (Physicians Medical Center)");
  assert.deepEqual(tessa.providerProfileLinks, [{
    networkId: "network-1",
    providerId: "provider-1",
    label: "Dr. Rivera (Physicians Medical Center)"
  }]);
  assert.equal(tessa.insurance, "YCCO");
  assert.equal(tessa.yccoId, "123ABC456");
  assert.equal(tessa.hrsn, "Not Eligible");
  assert.equal(tessa.convertedClientId, "");
});

test("clean referrals and referral partners handle long names and missing fields", () => {
  const referral = mapCrmReferral({
    id: "referral-long",
    firstName: "Lucia",
    lastName: "Martinez de la Cruz Exampleton",
    siblingIds: ["missing-referral"],
    providerLinks: [{ organizationName: "A Very Long Community Health Organization" }]
  });
  const network = mapCrmNetworkEntry({
    id: "network-missing",
    name: "McMinnville Community Learning and Family Resource Academy",
    type: "School",
    providers: [{ id: "provider-1", name: "Elena Ruiz", email: "", notes: "Call or text." }]
  });

  assert.equal(referral.title, "Lucia Martinez de la Cruz Exampleton");
  assert.equal(referral.siblings, "-");
  assert.deepEqual(referral.siblingProfiles, []);
  assert.equal(referral.email, "-");
  assert.equal(referral.insurance, "Not listed");
  assert.equal(referral.hrsn, "Not listed");
  assert.equal(referral.providerProfiles, "A Very Long Community Health Organization");
  assert.equal(network.title, "McMinnville Community Learning and Family Resource Academy");
  assert.equal(network.status, "1 provider");
  assert.equal(network.email, "-");
  assert.equal(network.phone, "-");
  assert.equal(crmNetworkMatches(network, "call or text"), true);
});

test("clean referral summaries and searches cover the complete referral workflow", () => {
  const items = mapCrmReferrals(referrals);
  assert.deepEqual(crmReferralSummary(items), [
    ["1", "New"],
    ["1", "In Contact"],
    ["0", "Scheduled"],
    ["1", "Closed"]
  ]);
  const tessa = items.find((item) => item.id === "referral-2");
  assert.equal(crmReferralMatches(tessa, "dr. rivera"), true);
  assert.equal(crmReferralMatches(tessa, "public booking"), true);
  assert.equal(crmReferralMatches(tessa, "not present"), false);
});

test("clean referral forms produce safe server payloads and linked activity", () => {
  assert.deepEqual(crmReferralPayload({
    firstName: " Tessa ",
    referralType: " Self Referral ",
    ycco: "on",
    yccoId: " 123ABC456 ",
    emailOptOut: false,
    providerLinks: [{
      networkId: " network-1 ",
      providerId: " provider-1 ",
      organizationName: " Physicians Medical Center ",
      providerName: " Dr. Rivera "
    }]
  }), {
    firstName: "Tessa",
    referralType: "Self Referral",
    ycco: true,
    yccoId: "123ABC456",
    emailOptOut: false,
    providerLinks: [{
      networkId: "network-1",
      providerId: "provider-1",
      organizationName: "Physicians Medical Center",
      providerName: "Dr. Rivera"
    }]
  });

  assert.deepEqual(crmReferralActivityPayload({
    direction: " Inbound ",
    result: " Requested call back ",
    activityDate: " 2026-07-17 ",
    activityTime: " 15:30 ",
    description: " Call tomorrow "
  }, {
    id: " referral-2 ",
    title: " Tessa Exampleton "
  }, "Call"), {
    direction: "Inbound",
    result: "Requested call back",
    activityDate: "2026-07-17",
    activityTime: "15:30",
    description: "Call tomorrow",
    type: "Call",
    relatedType: "referral",
    relatedId: "referral-2",
    relatedName: "Tessa Exampleton",
    title: "Inbound Call"
  });
});

test("clean referral provider links are built from current network records", () => {
  assert.deepEqual(
    crmReferralProviderLinks(["provider-2"], networkEntries),
    [{
      networkId: "network-1",
      providerId: "provider-2",
      organizationName: "Physicians Medical Center",
      providerName: "Dr. Kim"
    }]
  );

  assert.deepEqual(
    crmReferralProviderLinks(["provider-1"], [
      ...networkEntries,
      {
        id: "network-3",
        name: "Another Clinic",
        providers: [{ id: "provider-1", name: "Different Provider" }]
      }
    ], "network-1"),
    [{
      networkId: "network-1",
      providerId: "provider-1",
      organizationName: "Physicians Medical Center",
      providerName: "Dr. Rivera"
    }]
  );
});

test("clean referral editor scopes provider choices to one organization", () => {
  assert.match(cleanSource, /data-crm-provider-organization/);
  assert.match(cleanSource, /data-crm-provider-group/);
  assert.match(cleanSource, /checkbox\.disabled = !isSelected/);
  assert.match(cleanSource, /formData\.get\("providerOrganizationId"\)/);
  assert.match(cleanCss, /\.crm-provider-choices \{[\s\S]*?grid-template-columns: minmax\(0, 0\.95fr\) minmax\(0, 1\.05fr\);/);
});

test("clean referrals use searchable siblings and collapsible status groups", () => {
  assert.match(cleanSource, /renderCrmReferralSiblingChoices/);
  assert.match(cleanSource, /data-crm-referral-status-toggle/);
  assert.match(cleanSource, /data-crm-referral-status-expand/);
});

test("clean referral network footer preserves green, blue, and red actions", () => {
  assert.match(cleanCss, /\[data-crm-section="Referral Network"\][\s\S]*?\[data-crm-action="edit"\][\s\S]*?color: var\(--success\);/);
  assert.match(cleanCss, /\[data-crm-section="Referral Network"\][\s\S]*?\[data-crm-action="new-referral"\][\s\S]*?color: #175cd3;/);
  assert.match(cleanCss, /\[data-crm-section="Referral Network"\][\s\S]*?\[data-crm-action="delete"\][\s\S]*?color: var\(--red\);/);
});

test("clean referral confirmations require an intentional second click", () => {
  assert.deepEqual(crmConfirmDecision("", ""), {
    pendingId: "",
    confirmed: false
  });
  assert.deepEqual(crmConfirmDecision("", "referral-2"), {
    pendingId: "referral-2",
    confirmed: false
  });
  assert.deepEqual(crmConfirmDecision("referral-2", "referral-2"), {
    pendingId: "",
    confirmed: true
  });
});

test("clean referral network maps, searches, summarizes, and saves providers", () => {
  const items = mapCrmNetworkEntries(networkEntries);
  assert.equal(items[0].title, "Physicians Medical Center");
  assert.equal(items[0].status, "2 providers");
  assert.equal(crmNetworkMatches(items[0], "rivera"), true);
  assert.equal(crmNetworkMatches(items[0], "school"), false);
  assert.deepEqual(crmNetworkSummary(items), [
    ["2", "Organizations"],
    ["2", "Providers"],
    ["1", "With Email"],
    ["1", "With Phone"]
  ]);
  assert.deepEqual(crmNetworkPayload({
    name: " Physicians Medical Center ",
    notes: " Preferred partner ",
    providers: [
      { id: " provider-1 ", name: " Dr. Rivera ", email: " rivera@example.com " },
      { name: " " }
    ]
  }), {
    name: "Physicians Medical Center",
    notes: "Preferred partner",
    providers: [{
      id: "provider-1",
      name: "Dr. Rivera",
      email: "rivera@example.com",
      notes: ""
    }]
  });
});
