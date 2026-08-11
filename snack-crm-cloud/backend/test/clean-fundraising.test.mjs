import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  campaignMatches,
  campaignPayload,
  campaignSummary,
  campaignsWithGiftRollups,
  donorMatches,
  donorPayload,
  donorSummary,
  donorsWithGiftRollups,
  earnedIncomeMatches,
  earnedIncomePayload,
  earnedIncomeSummary,
  financialActivityMatches,
  financialActivityPayload,
  financialActivitySummary,
  financialActivityTotals,
  giftMatches,
  giftPayload,
  giftSummary,
  fundraisingSummary,
  grantDeadlineItems,
  grantDeleteDecision,
  grantDocumentFileSignatureError,
  grantDocumentFileError,
  grantDocumentMimeType,
  grantDocumentPayload,
  grantDocumentPreviewKind,
  grantDocumentRows,
  grantDocumentsWithoutIndex,
  grantPreviewClickIsOutside,
  grantMatches,
  grantMovePayload,
  grantOrganizationInfoPayload,
  grantPayload,
  grantPipelineGroups,
  grantQuestionPayload,
  mapCampaigns,
  mapDonors,
  mapEarnedIncomeRecords,
  mapFinancialActivities,
  mapGifts,
  mapGrantOrganizationInfo,
  mapGrantQuestions,
  mapGrants
} from "../../frontend/public/modules/fundraising.js";
import {
  financialActivityFromGift,
  financialActivityFromHrsnClaim,
  financialActivityFromIncome,
  financialActivityFromLegacyMeasurement,
  financialActivityValidationError,
  sortFinancialActivities
} from "../routes/fundraising.js";
import {
  controlledCountingQaData,
  controlledCountingQaExpected,
  controlledCountingQaPeriod
} from "../scripts/lib/controlled-counting-qa-fixtures.mjs";

const fundraisingHtml = await readFile(new URL("../../frontend/public/finances.html", import.meta.url), "utf8");
const fundraisingRedirectHtml = await readFile(new URL("../../frontend/public/fundraising.html", import.meta.url), "utf8");
const cleanSource = await readFile(new URL("../../frontend/public/clean.js", import.meta.url), "utf8");
const routeSource = await readFile(new URL("../routes/fundraising.js", import.meta.url), "utf8");
const futurePreviewHtml = await readFile(new URL("../../frontend/public/fundraising-future-preview.html", import.meta.url), "utf8");
const futurePreviewSource = await readFile(new URL("../../frontend/public/fundraising-future-preview.js", import.meta.url), "utf8");

const grants = [
  {
    id: "grant-2",
    foundationName: "Community Health Foundation",
    grantName: "Family Wellness Fund",
    status: "Submitted",
    deadlineDate: "2026-08-15",
    amountRequested: 25000,
    focusAreas: "Nutrition education",
    contactName: "Maya Rivera",
    contactRole: "Program Officer"
  },
  {
    id: "grant-1",
    foundationName: "Yamhill Giving Fund",
    grantName: "Healthy Families Grant",
    status: "Planning",
    deadlineDate: "2026-08-01",
    deadlineTime: "17:00",
    amountMin: 5000,
    amountMax: 15000,
    reportingRequirements: "Final outcomes report",
    documents: [{ title: "Guidelines", url: "https://example.org/guidelines" }]
  },
  {
    id: "grant-3",
    foundationName: "County Wellness Fund",
    status: "Awarded",
    deadlineDate: "2026-06-01",
    pastGrantReceived: true,
    pastGrantAmount: 10000,
    pastGrantYear: 2025
  },
  {
    id: "grant-4",
    grantName: "Food Access Renewal",
    status: "Reporting",
    deadlineDate: "2026-05-01"
  }
];

test("Fundraising future preview keeps all five proposed workspaces isolated from the live module", () => {
  assert.match(futurePreviewHtml, /data-preview-view="pipeline"/);
  assert.match(futurePreviewHtml, /data-preview-view="deadlines"/);
  assert.match(futurePreviewHtml, /data-preview-view="answers"/);
  assert.match(futurePreviewHtml, /data-preview-view="organization"/);
  assert.match(futurePreviewHtml, /data-preview-view="documents"/);
  assert.match(futurePreviewHtml, /data-grant-card/);
  assert.match(futurePreviewSource, /addEventListener\("drop"/);
  assert.doesNotMatch(fundraisingHtml, /fundraising-future-preview/);
});

test("clean Fundraising maps and orders grants by deadline", () => {
  const items = mapGrants(grants);

  assert.deepEqual(items.map((item) => item.id), ["grant-4", "grant-3", "grant-1", "grant-2"]);
  assert.equal(items[2].title, "Healthy Families Grant");
  assert.equal(items[2].subtitle, "Yamhill Giving Fund | Due Aug 1, 2026 at 5:00 PM");
  assert.equal(items[2].range, "$5,000 - $15,000");
  assert.equal(items[2].documents.length, 1);
  assert.equal(items[1].pastAward, "$10,000 (2025)");
});

test("new grant editor tabs switch between funding, reporting, contacts, and document guidance", () => {
  assert.match(cleanSource, /data-fundraising-editor-panel="funding"/);
  assert.match(cleanSource, /data-fundraising-editor-panel="reporting"/);
  assert.match(cleanSource, /data-fundraising-editor-panel="contacts"/);
  assert.match(cleanSource, /data-fundraising-editor-panel="documents"/);
  assert.match(cleanSource, /panel\.hidden = panel\.dataset\.fundraisingEditorPanel !== fundraisingDetailTab/);
  assert.match(cleanSource, /Save this grant first/);
});

test("clean Fundraising calculates established grant counters", () => {
  assert.deepEqual(fundraisingSummary(grants, new Date(2026, 6, 21, 12)), [
    ["2", "Open Grants"],
    ["1", "Due in 45 Days"],
    ["1", "Submitted"],
    ["2", "Awarded"]
  ]);
});

test("clean Fundraising payload trims fields and preserves linked documents", () => {
  const documents = [{ title: "Guidelines", url: "https://example.org/guidelines" }];
  const payload = grantPayload({
    foundationName: "  Yamhill Giving Fund  ",
    grantName: " Healthy Families ",
    status: " Planning ",
    amountRequested: "25000.567",
    pastGrantReceived: "on",
    pastGrantYear: "2025.4"
  }, { documents });

  assert.equal(payload.foundationName, "Yamhill Giving Fund");
  assert.equal(payload.grantName, "Healthy Families");
  assert.equal(payload.status, "Planning");
  assert.equal(payload.amountRequested, 25000.57);
  assert.equal(payload.pastGrantReceived, true);
  assert.equal(payload.pastGrantYear, 2025);
  assert.deepEqual(payload.documents, documents);
});

test("clean Fundraising search covers grant, foundation, contact, and reporting context", () => {
  const items = mapGrants(grants);
  assert.equal(grantMatches(items[2], "Yamhill"), true);
  assert.equal(grantMatches(items[3], "Maya Rivera"), true);
  assert.equal(grantMatches(items[2], "final outcomes"), true);
  assert.equal(grantMatches(items[2], "capital campaign"), false);
});

test("clean Fundraising requires a second delete action", () => {
  assert.equal(grantDeleteDecision("", "grant-1"), "confirm");
  assert.equal(grantDeleteDecision("grant-2", "grant-1"), "confirm");
  assert.equal(grantDeleteDecision("grant-1", "grant-1"), "delete");
});

test("clean Fundraising groups pipeline stages, persists moves, and orders deadlines", () => {
  const items = mapGrants(grants);
  const groups = grantPipelineGroups(items);

  assert.deepEqual(groups.Planning.map(({ id }) => id), ["grant-1"]);
  assert.deepEqual(groups.Submitted.map(({ id }) => id), ["grant-2"]);
  assert.deepEqual(groups.Awarded.map(({ id }) => id), ["grant-4", "grant-3"]);
  assert.equal(grantMovePayload(items.find(({ id }) => id === "grant-1"), "In Progress").status, "In Progress");
  assert.deepEqual(
    grantDeadlineItems(items, new Date(2026, 6, 21, 12)).map(({ grantId, type }) => [grantId, type]),
    [["grant-1", "Application"], ["grant-2", "Application"]]
  );
});

test("clean Fundraising prepares reusable answers, organization information, and linked documents", () => {
  const questions = mapGrantQuestions([{
    id: "question-1",
    category: "Mission",
    prompt: "What is your mission?",
    answer: "SNACK improves child and family wellness.",
    targetLimit: "50 words"
  }]);
  assert.equal(questions[0].wordCount, 6);
  assert.deepEqual(grantQuestionPayload({ prompt: " Mission? ", answer: " Our answer. " }), {
    category: "General",
    prompt: "Mission?",
    answer: "Our answer.",
    targetLimit: "",
    notes: ""
  });

  const organization = mapGrantOrganizationInfo({
    legalName: "The SNACK Program",
    updatedAt: "2026-07-21T12:00:00.000Z",
    documents: [{ id: "irs", title: "IRS letter", type: "Organization", url: "https://example.org/irs", storagePath: "grant-documents/org/irs.pdf" }]
  });
  const organizationPayload = grantOrganizationInfoPayload({ mission: " Improve wellness. " }, organization);
  assert.equal(organizationPayload.mission, "Improve wellness.");
  assert.equal(Object.hasOwn(organizationPayload, "updatedAt"), false);
  assert.equal(organizationPayload.documents.length, 1);

  const rows = grantDocumentRows(mapGrants(grants), organization);
  assert.deepEqual(rows.map(({ title, grantTitle }) => [title, grantTitle]), [
    ["IRS letter", "Organization"],
    ["Guidelines", "Healthy Families Grant"]
  ]);
  assert.equal(rows[0].scope, "organization");
  assert.equal(rows[0].storagePath, "grant-documents/org/irs.pdf");
  assert.equal(rows[1].scope, "grant");
  assert.equal(rows[1].grantId, "grant-1");
});

test("clean Fundraising validates uploads and prepares removable document metadata", () => {
  const document = grantDocumentPayload({
    id: " document-1 ",
    category: " Budget ",
    title: " 2027 Budget ",
    storagePath: " grant-documents/staff/budget.pdf ",
    fileName: " budget.pdf ",
    mimeType: " application/pdf ",
    fileSize: "2048",
    uploadedBy: " director@snackprogram.org "
  });

  assert.equal(document.type, "Budget");
  assert.equal(document.title, "2027 Budget");
  assert.equal(document.fileSize, 2048);
  assert.equal(document.uploadedBy, "director@snackprogram.org");
  assert.equal(grantDocumentFileError(null), "Choose a file to upload.");
  assert.equal(grantDocumentFileError({ name: "empty.pdf", type: "application/pdf", size: 0 }), "The selected file is empty.");
  assert.match(grantDocumentFileError({ name: "large.pdf", type: "application/pdf", size: 21 * 1024 * 1024 }), /smaller than 20 MB/);
  assert.equal(grantDocumentFileError({ name: "budget.pdf", type: "application/pdf", size: 1024 }), "");
  assert.match(grantDocumentFileError({ name: "danger.html", type: "text/html", size: 100 }), /PDF, DOCX/);
  assert.match(grantDocumentFileError({ name: "fake.pdf", type: "text/html", size: 100 }), /do not match/);
  assert.equal(grantDocumentMimeType({ name: "budget.DOCX" }), "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  assert.deepEqual(grantDocumentsWithoutIndex(["first", "second", "third"], 1), ["first", "third"]);
  assert.equal(grantDocumentPreviewKind({ fileName: "proposal.pdf" }), "pdf");
  assert.equal(grantDocumentPreviewKind({ mimeType: "image/png" }), "image");
  assert.equal(grantDocumentPreviewKind({ storagePath: "grant-documents/list.csv" }), "text");
  assert.equal(grantDocumentPreviewKind({ fileName: "application.docx" }), "");
  const previewRect = { left: 100, right: 900, top: 80, bottom: 700 };
  assert.equal(grantPreviewClickIsOutside(previewRect, 50, 400), true);
  assert.equal(grantPreviewClickIsOutside(previewRect, 500, 40), true);
  assert.equal(grantPreviewClickIsOutside(previewRect, 500, 400), false);
});

test("clean Fundraising verifies the bytes inside uploaded grant files", async () => {
  const pdf = new Blob([new TextEncoder().encode("%PDF-1.7 safe test")], { type: "application/pdf" });
  Object.defineProperty(pdf, "name", { value: "application.pdf" });
  const disguised = new Blob([new TextEncoder().encode("<html>not a pdf</html>")], { type: "application/pdf" });
  Object.defineProperty(disguised, "name", { value: "application.pdf" });
  assert.equal(await grantDocumentFileSignatureError(pdf), "");
  assert.match(await grantDocumentFileSignatureError(disguised), /do not match/);
});

test("clean Fundraising maps, searches, and summarizes donors", () => {
  const donors = [
    {
      id: "donor-2",
      name: "Riverbend Market",
      status: "Recurring",
      donorType: "Business",
      lifetimeGiving: 12500,
      recurringAmount: 500,
      recurringFrequency: "monthly",
      campaignName: "Family Nutrition Fund"
    },
    {
      id: "donor-1",
      name: "Alex Smith",
      status: "Active",
      donorType: "Individual",
      lastGiftDate: "2026-07-01",
      lastGiftAmount: 250,
      lifetimeGiving: 750,
      email: "alex@example.org"
    }
  ];
  const items = mapDonors(donors);

  assert.deepEqual(items.map((item) => item.id), ["donor-1", "donor-2"]);
  assert.equal(items[0].lastGift, "$250 on Jul 1, 2026");
  assert.equal(items[1].recurring, "$500 monthly");
  assert.equal(donorMatches(items[1], "Family Nutrition"), true);
  assert.deepEqual(donorSummary(donors), [
    ["2", "Total Donors"],
    ["2", "Active"],
    ["1", "Recurring"],
    ["$13,250", "Lifetime Giving"]
  ]);
  assert.deepEqual(donorPayload({ name: " Alex ", lifetimeGiving: "750.555" }), {
    name: "Alex",
    status: "Prospect",
    donorType: "Individual",
    email: "",
    phone: "",
    address: "",
    preferredContact: "",
    firstGiftDate: "",
    lastGiftDate: "",
    recurringFrequency: "",
    campaignId: "",
    campaignName: "",
    acknowledgementStatus: "",
    notes: "",
    lastGiftAmount: null,
    lifetimeGiving: 750.56,
    recurringAmount: null
  });
});

test("clean Fundraising maps, searches, and summarizes gift transactions", () => {
  const gifts = [
    {
      id: "gift-1",
      donorId: "donor-1",
      donorName: "Alex Smith",
      campaignId: "campaign-1",
      campaignName: "Family Nutrition Fund",
      giftDate: "2026-07-21",
      amount: 125.5,
      giftType: "Individual Gift",
      paymentMethod: "Online",
      recurring: true,
      recurringFrequency: "Monthly",
      acknowledgementStatus: "Sent"
    },
    {
      id: "gift-2",
      donorId: "donor-2",
      donorName: "Riverbend Market",
      giftDate: "2026-07-25",
      amount: 1000,
      giftType: "Sponsorship",
      paymentMethod: "Check"
    }
  ];
  const items = mapGifts(gifts);

  assert.deepEqual(items.map((item) => item.id), ["gift-2", "gift-1"]);
  assert.equal(items[1].amount, "$125.50");
  assert.equal(items[1].recurring, "Yes | Monthly");
  assert.equal(giftMatches(items[1], "Family Nutrition"), true);
  assert.equal(giftMatches(items[0], "check"), true);
  assert.deepEqual(giftSummary(gifts), [
    ["2", "Gift Transactions"],
    ["$1,125.50", "Total Gifts"],
    ["2", "Donors"],
    ["1", "Recurring Gifts"]
  ]);
  assert.deepEqual(giftPayload({
    donorId: " donor-1 ",
    giftDate: " 2026-07-21 ",
    amount: "125.505",
    recurring: "on"
  }), {
    donorId: "donor-1",
    donorName: "",
    campaignId: "",
    campaignName: "",
    giftDate: "2026-07-21",
    amount: 125.51,
    giftType: "Individual Gift",
    paymentMethod: "",
    recurring: true,
    recurringFrequency: "",
    acknowledgementStatus: "",
    externalTransactionId: "",
    notes: ""
  });
});

test("gift transactions roll up into donor and campaign profiles", () => {
  const gifts = [
    { donorId: "donor-1", campaignId: "campaign-1", giftDate: "2026-01-15", amount: 100, giftType: "Individual Gift" },
    { donorId: "donor-1", campaignId: "campaign-1", giftDate: "2026-07-20", amount: 25, giftType: "Individual Gift", recurring: true, recurringFrequency: "Monthly" },
    { donorId: "donor-1", campaignId: "campaign-1", giftDate: "2026-07-22", amount: 300, giftType: "In-Kind" }
  ];
  const [donor] = donorsWithGiftRollups([{ id: "donor-1", name: "Alex Smith", lifetimeGiving: 999 }], gifts);
  const [campaign] = campaignsWithGiftRollups([{ id: "campaign-1", name: "Annual Appeal", raisedAmount: 999 }], gifts);

  assert.equal(donor.firstGiftDate, "2026-01-15");
  assert.equal(donor.lastGiftDate, "2026-07-22");
  assert.equal(donor.lastGiftAmount, 300);
  assert.equal(donor.lifetimeGiving, 425);
  assert.equal(donor.recurringAmount, 25);
  assert.equal(donor.recurringFrequency, "Monthly");
  assert.equal(campaign.raisedAmount, 125);
});

test("clean Fundraising maps, searches, and summarizes campaigns", () => {
  const campaigns = [
    {
      id: "campaign-1",
      name: "Family Nutrition Fund",
      status: "Active",
      campaignType: "Annual Appeal",
      startDate: "2026-07-01",
      endDate: "2026-09-30",
      goalAmount: 20000,
      raisedAmount: 7500,
      audience: "Community donors"
    }
  ];
  const [item] = mapCampaigns(campaigns);

  assert.equal(item.remaining, "$12,500");
  assert.equal(campaignMatches(item, "Community donors"), true);
  assert.deepEqual(campaignSummary(campaigns), [
    ["1", "Active Campaigns"],
    ["$20,000", "Total Goal"],
    ["$7,500", "Raised"],
    ["$12,500", "Remaining"]
  ]);
  const payload = campaignPayload({ name: " Annual Appeal ", goalAmount: "20000" });
  assert.equal(payload.name, "Annual Appeal");
  assert.equal(payload.status, "Planning");
  assert.equal(payload.goalAmount, 20000);
});

test("clean Fundraising maps, searches, and summarizes earned income", () => {
  const records = [
    {
      id: "income-1",
      name: "YCCO Nutrition Services",
      status: "Partially Paid",
      source: "Insurance reimbursement",
      periodStart: "2026-07-01",
      periodEnd: "2026-07-31",
      amountBilled: 4000,
      amountReceived: 2500,
      payerName: "YCCO"
    }
  ];
  const [item] = mapEarnedIncomeRecords(records);

  assert.equal(item.outstanding, "$1,500");
  assert.equal(earnedIncomeMatches(item, "insurance"), true);
  assert.deepEqual(earnedIncomeSummary(records), [
    ["1", "Active Sources"],
    ["$4,000", "Billed"],
    ["$2,500", "Received"],
    ["$1,500", "Outstanding"]
  ]);
  const payload = earnedIncomePayload({ name: " YCCO ", amountReceived: "2500.2" });
  assert.equal(payload.name, "YCCO");
  assert.equal(payload.status, "Planning");
  assert.equal(payload.amountReceived, 2500.2);
});

test("Financial Activity combines source records into one editable revenue ledger", () => {
  const rawActivities = sortFinancialActivities([
    financialActivityFromHrsnClaim({
      id: "claim-1",
      approved: true,
      approvalDate: "2026-07-18",
      amount: 2500,
      name: "QA Client",
      invoiceNumber: "QA-INVOICE-1"
    }),
    financialActivityFromIncome({
      id: "income-1",
      activityType: "HRSN Revenue",
      paymentDate: "2026-07-18",
      amountReceived: 2500,
      payerName: "YCCO"
    }),
    financialActivityFromGift({
      id: "gift-1",
      donorId: "donor-1",
      donorName: "Alex Smith",
      giftDate: "2026-07-21",
      amount: 125,
      giftType: "Individual Gift"
    }),
    financialActivityFromGift({
      id: "gift-2",
      donorId: "donor-2",
      donorName: "Riverbend Market",
      giftDate: "2026-07-20",
      amount: 300,
      giftType: "In-Kind"
    }),
    financialActivityFromLegacyMeasurement({
      id: "legacy-1",
      metricKey: "financial.grant-revenue",
      periodEnd: "2026-07-10",
      value: 10000,
      note: "Roundhouse Foundation"
    })
  ]);
  const items = mapFinancialActivities(rawActivities);

  assert.deepEqual(items.map((item) => item.id), ["gift:gift-1", "gift:gift-2", "hrsn:claim-1", "income:income-1", "legacy:legacy-1"]);
  assert.equal(financialActivityMatches(items[2], "QA Client", "HRSN Revenue"), true);
  assert.equal(financialActivityMatches(items[3], "YCCO", "HRSN Revenue"), true);
  assert.equal(items[3].includedInRevenue, false);
  assert.deepEqual(financialActivityTotals(items, "2026-07-01", "2026-07-31"), {
    total: 12625,
    count: 3,
    byType: {
      "Individual Gift": 125,
      "HRSN Revenue": 2500,
      "Grant Revenue": 10000
    }
  });
  assert.deepEqual(financialActivitySummary(items, new Date(2026, 6, 27)), [
    ["$12,625", "Revenue YTD"],
    ["$12,625", "This Quarter"],
    ["3", "Transactions YTD"],
    ["$10,000", "Grant Revenue YTD"]
  ]);
  assert.deepEqual(financialActivityPayload({
    activityType: " Grant Revenue ",
    transactionDate: " 2026-07-10 ",
    amount: "10000.129",
    grantId: " grant-1 ",
    grantName: " Roundhouse "
  }), {
    activityType: "Grant Revenue",
    transactionDate: "2026-07-10",
    amount: 10000.13,
    sourceName: "",
    grantId: "grant-1",
    grantName: "Roundhouse",
    campaignId: "",
    campaignName: "",
    donorId: "",
    donorName: "",
    paymentMethod: "",
    externalTransactionId: "",
    notes: ""
  });
  assert.equal(financialActivityValidationError({ activityType: "Grant Revenue", transactionDate: "", amount: 100 }), "Transaction Date is required.");
  assert.equal(financialActivityValidationError({ activityType: "Grant Revenue", transactionDate: "2026-07-10", amount: 0 }), "Amount must be greater than zero.");
  assert.equal(financialActivityValidationError({ activityType: "Grant Revenue", transactionDate: "2026-07-10", amount: 100 }), "");
});

test("controlled counting QA financial activity excludes non-revenue and duplicate HRSN rows", () => {
  const data = controlledCountingQaData();
  const items = mapFinancialActivities(sortFinancialActivities([
    ...data.earnedIncome.map(financialActivityFromIncome),
    ...data.fundraisingGifts.map(financialActivityFromGift),
    ...data.hrsnClaims
      .filter((claim) => claim.approved === true && claim.approvalDate)
      .map(financialActivityFromHrsnClaim)
  ]));
  const quarter = financialActivityTotals(
    items,
    controlledCountingQaPeriod.startDate,
    controlledCountingQaPeriod.endDate
  );
  const yearToDate = financialActivityTotals(items, "2026-01-01", controlledCountingQaPeriod.endDate);

  assert.equal(quarter.total, controlledCountingQaExpected.financialActivity.quarterTotal);
  assert.equal(quarter.count, controlledCountingQaExpected.financialActivity.quarterTransactions);
  assert.equal(yearToDate.total, controlledCountingQaExpected.financialActivity.yearToDateTotal);
  assert.equal(yearToDate.count, controlledCountingQaExpected.financialActivity.yearToDateTransactions);
  assert.equal(
    yearToDate.byType["Grant Revenue"],
    controlledCountingQaExpected.financialActivity.yearToDateGrantRevenue
  );
  assert.equal(items.find((item) => item.id === "income:qa-counting-income-legacy-hrsn").includedInRevenue, false);
  assert.equal(items.find((item) => item.id === "gift:qa-counting-gift-in-kind").includedInRevenue, false);
});

test("clean Finances page loads the approved work areas and the real grant workflow", () => {
  assert.match(fundraisingHtml, /<script src="\.\/app-config\.js[^"]*"><\/script>/);
  assert.match(fundraisingHtml, /<script type="module" src="\.\/clean\.js[^"]*"><\/script>/);
  assert.ok(fundraisingHtml.indexOf("app-config.js") < fundraisingHtml.indexOf("clean.js"));
  assert.match(cleanSource, /from "\.\/modules\/fundraising\.js/);
  assert.match(cleanSource, /initializeFundraisingData\(\)/);
  assert.match(cleanSource, /label: "Finances"/);
  assert.match(cleanSource, /subpages: \["Financial Activity", "Grants", "HRSN Billing", "Budget", "Giving"\]/);
  assert.match(cleanSource, /: "Financial Activity";/);
  assert.match(cleanSource, /title: label/);
  assert.match(cleanSource, /title: "Grants"/);
  assert.match(cleanSource, /views: \["Gifts", "Donors", "Campaigns"\]/);
  assert.match(cleanSource, /data-fundraising-giving-view/);
  assert.match(cleanSource, /\["Gifts", "Donors", "Campaigns"\]\.includes\(fundraisingInitialSection\)/);
  assert.match(cleanSource, /\["HRSN Billing", "Budget"\]\.includes\(fundraisingSubpage\)/);
  assert.match(cleanSource, /data-financial-source-view/);
  assert.match(cleanSource, /detailTabs: \["Funding", "Reporting", "Contacts", "Documents"\]/);
  assert.match(cleanSource, /data-fundraising-record-form/);
  assert.match(cleanSource, /"\/api\/donors"/);
  assert.match(cleanSource, /"\/api\/gifts"/);
  assert.match(cleanSource, /"\/api\/campaigns"/);
  assert.match(cleanSource, /"\/api\/financial-activity"/);
  assert.match(cleanSource, /data-financial-activity-workspace/);
  assert.match(cleanSource, /\["Dashboard", "Ledger"\]\.map/);
  assert.match(cleanSource, /data-financial-view="\$\{view\}"/);
  assert.match(cleanSource, /data-financial-view="Ledger"[^>]*>View Ledger/);
  assert.match(cleanSource, /data-financial-edit/);
  assert.match(cleanSource, /data-financial-delete/);
  assert.match(cleanSource, /Confirm Delete/);
  assert.match(cleanSource, /function renderFundraisingLinkedFinancialActivity/);
  assert.match(cleanSource, /data-fundraising-related-financial-activity/);
  assert.match(cleanSource, /data-fundraising-subpage/);
  assert.match(cleanSource, /\["Pipeline", "columns"\]/);
  assert.match(cleanSource, /\["Details", "file"\]/);
  assert.match(cleanSource, /\["Deadlines", "calendar"\]/);
  assert.match(cleanSource, /\["Answer Library", "note"\]/);
  assert.match(cleanSource, /\["Organization", "building"\]/);
  assert.match(cleanSource, /\["Documents", "file"\]/);
  assert.match(cleanSource, /addEventListener\("drop"/);
  assert.match(cleanSource, /saveFundraisingPipelineStatus/);
  assert.match(cleanSource, /data-fundraising-question-form/);
  assert.match(cleanSource, /data-fundraising-organization-form/);
  assert.match(cleanSource, /firebase-storage\.js/);
  assert.match(cleanSource, /data-fundraising-document-form/);
  assert.match(cleanSource, /data-preview-fundraising-document/);
  assert.match(cleanSource, /data-download-fundraising-document[^>]*>Download<\/button>/);
  assert.match(cleanSource, /Document downloaded\./);
  assert.match(cleanSource, /data-delete-fundraising-document/);
  assert.doesNotMatch(cleanSource, /Secure document storage is not connected yet/);
  assert.match(cleanSource, /function renderFundraisingGiftPanels\(item\)/);
  assert.match(cleanSource, /function renderFundraisingGiftEditorMain\(item = null\)/);
  assert.match(cleanSource, /data-fundraising-add-grant-revenue/);
  assert.match(cleanSource, /data-fundraising-add-gift-donor/);
  assert.match(cleanSource, /data-fundraising-add-gift-campaign/);
  assert.match(cleanSource, /data-fundraising-manage-documents/);
  assert.match(cleanSource, /form\.elements\.medicaidId\.value = client\.medicaidId \|\| ""/);
  assert.match(cleanSource, /function openLinkedGiftEditor/);
  assert.match(cleanSource, /function openLinkedGrantRevenueEditor/);
  assert.match(routeSource, /path: "gifts"/);
  assert.match(routeSource, /router\.get\("\/api\/financial-activity", requireAuth/);
  assert.match(routeSource, /router\.patch\("\/api\/financial-activity\/:activityId", requireAuth/);
  assert.match(routeSource, /router\.delete\("\/api\/financial-activity\/:activityId", requireAuth/);
  assert.match(routeSource, /fetchAllDocuments\(earnedIncome\)/);
  assert.match(routeSource, /fetchAllDocuments\(fundraisingGifts\)/);
  assert.match(routeSource, /fetchAllDocuments\(performanceMeasurements\)/);
  assert.match(routeSource, /medicaidId: cleanString\(client\.yccoId\)/);
  assert.match(routeSource, /router\.get\(`\/api\/\$\{config\.path\}`, requireAuth/);
  assert.match(routeSource, /fetchAllDocuments\(config\.collection\)/);
});

test("the retired Fundraising address safely forwards to Finances", () => {
  assert.match(fundraisingRedirectHtml, /finances\.html/);
  assert.match(fundraisingRedirectHtml, /location\.search/);
  assert.match(fundraisingRedirectHtml, /location\.hash/);
});
