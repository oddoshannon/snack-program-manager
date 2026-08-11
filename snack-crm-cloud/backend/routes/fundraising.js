import express from "express";
import {
  allowedHrsnDescriptions,
  allowedHrsnOutcomes,
  budgetCategories,
  cleanBudgetCategoryPayload,
  cleanEarnedIncomePayload,
  cleanFundraisingCampaignPayload,
  cleanFundraisingDonorPayload,
  cleanFundraisingGiftPayload,
  cleanHrsnClaimPayload,
  cleanOptionalNumber,
  cleanPerformanceMeasurementPayload,
  cleanString,
  clients,
  earnedIncome,
  fetchAllDocuments,
  firestore,
  fundraisingCampaigns,
  fundraisingDonors,
  fundraisingGifts,
  hrsnClaims,
  performanceMeasurements,
  requireAuth,
  toBudgetCategory,
  toClient,
  toEarnedIncome,
  toFundraisingCampaign,
  toFundraisingDonor,
  toFundraisingGift,
  toHrsnClaim,
  toPerformanceMeasurement,
  todayDateString
} from "../lib/core.js";

const router = express.Router();

const financialActivityTypes = Object.freeze([
  "Grant Revenue",
  "Workbook Sale",
  "Merchandise Sale",
  "Toolkit Sale",
  "Other Income"
]);

const financialGiftActivityTypes = Object.freeze([
  "Individual Gift",
  "Sponsorship Revenue",
  "Event Revenue",
  "In-Kind Gift",
  "Other Gift"
]);

function inferredFinancialActivityType(record = {}) {
  const explicit = cleanString(record.activityType);
  if (explicit) return explicit;
  const value = [record.name, record.source, record.serviceType, record.useOfFunds, record.payerName]
    .map(cleanString)
    .join(" ")
    .toLowerCase();
  if (value.includes("grant")) return "Grant Revenue";
  if (value.includes("hrsn") || value.includes("health-related social needs") || value.includes("health related social needs")) {
    return "HRSN Revenue";
  }
  if (value.includes("workbook")) return "Workbook Sale";
  if (value.includes("toolkit")) return "Toolkit Sale";
  if (value.includes("merch")) return "Merchandise Sale";
  return "Other Income";
}

function giftActivityType(record = {}) {
  const type = cleanString(record.giftType).toLowerCase();
  if (type.includes("sponsor")) return "Sponsorship Revenue";
  if (type.includes("event")) return "Event Revenue";
  if (type.includes("in-kind") || type.includes("in kind")) return "In-Kind Gift";
  if (type.includes("individual")) return "Individual Gift";
  return "Other Gift";
}

function giftTypeFromActivityType(activityType = "") {
  if (activityType === "Sponsorship Revenue") return "Sponsorship";
  if (activityType === "Event Revenue") return "Fundraising Event";
  if (activityType === "In-Kind Gift") return "In-Kind";
  if (activityType === "Individual Gift") return "Individual Gift";
  return "Other";
}

function financialActivityFromIncome(record = {}) {
  const activityType = inferredFinancialActivityType(record);
  return {
    id: `income:${record.id}`,
    sourceKind: "income",
    sourceRecordId: record.id,
    activityType,
    transactionDate: cleanString(record.paymentDate || record.periodEnd || record.periodStart),
    amount: Number(record.amountReceived ?? record.amountBilled ?? 0),
    sourceName: cleanString(record.grantName || record.payerName || record.source || record.name) || "Income source",
    status: cleanString(record.status) || "Received",
    grantId: cleanString(record.grantId),
    grantName: cleanString(record.grantName),
    campaignId: cleanString(record.campaignId),
    campaignName: cleanString(record.campaignName),
    donorId: cleanString(record.donorId),
    donorName: cleanString(record.donorName),
    paymentMethod: "",
    externalTransactionId: cleanString(record.externalTransactionId),
    notes: cleanString(record.notes),
    includedInRevenue: activityType !== "HRSN Revenue",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function financialActivityFromHrsnClaim(record = {}) {
  return {
    id: `hrsn:${record.id}`,
    sourceKind: "hrsn",
    sourceRecordId: record.id,
    activityType: "HRSN Revenue",
    transactionDate: cleanString(record.approvalDate),
    amount: Number(record.amount || 0),
    sourceName: cleanString(record.name) || "HRSN billing record",
    status: "Approved",
    grantId: "",
    grantName: "",
    campaignId: "",
    campaignName: "",
    donorId: "",
    donorName: "",
    paymentMethod: "",
    externalTransactionId: cleanString(record.invoiceNumber),
    notes: cleanString(record.notes),
    includedInRevenue: record.approved === true && Boolean(cleanString(record.approvalDate)),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function financialActivityFromGift(record = {}) {
  const activityType = giftActivityType(record);
  return {
    id: `gift:${record.id}`,
    sourceKind: "gift",
    sourceRecordId: record.id,
    activityType,
    transactionDate: cleanString(record.giftDate),
    amount: Number(record.amount ?? 0),
    sourceName: cleanString(record.donorName) || "Unnamed donor",
    status: "Received",
    grantId: "",
    grantName: "",
    campaignId: cleanString(record.campaignId),
    campaignName: cleanString(record.campaignName),
    donorId: cleanString(record.donorId),
    donorName: cleanString(record.donorName),
    paymentMethod: cleanString(record.paymentMethod),
    externalTransactionId: cleanString(record.externalTransactionId),
    notes: cleanString(record.notes),
    includedInRevenue: activityType !== "In-Kind Gift",
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function financialActivityFromLegacyMeasurement(record = {}) {
  return {
    id: `legacy:${record.id}`,
    sourceKind: "legacy",
    sourceRecordId: record.id,
    activityType: "Grant Revenue",
    transactionDate: cleanString(record.periodEnd || record.periodStart),
    amount: Number(record.value ?? 0),
    sourceName: cleanString(record.note) || "Legacy Operations entry",
    status: "Received",
    grantId: "",
    grantName: "",
    campaignId: "",
    campaignName: "",
    donorId: "",
    donorName: "",
    paymentMethod: "",
    externalTransactionId: "",
    notes: cleanString(record.note),
    includedInRevenue: true,
    legacy: true,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt
  };
}

function sortFinancialActivities(records = []) {
  return [...records].sort((first, second) => (
    cleanString(second.transactionDate).localeCompare(cleanString(first.transactionDate))
    || cleanString(second.updatedAt || second.createdAt).localeCompare(cleanString(first.updatedAt || first.createdAt))
    || first.id.localeCompare(second.id)
  ));
}

function financialActivityId(value = "") {
  const match = cleanString(value).match(/^(income|gift|legacy):(.+)$/);
  return match ? { sourceKind: match[1], sourceRecordId: match[2] } : null;
}

function financialActivityValidationError(payload = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanString(payload.transactionDate))) return "Transaction Date is required.";
  if (!(Number(payload.amount) > 0)) return "Amount must be greater than zero.";
  if (![...financialActivityTypes, ...financialGiftActivityTypes].includes(cleanString(payload.activityType))) {
    return "Choose a valid revenue type.";
  }
  return "";
}

function cleanFinancialActivityPayload(body = {}) {
  return {
    activityType: cleanString(body.activityType),
    transactionDate: cleanString(body.transactionDate),
    amount: Number(body.amount),
    sourceName: cleanString(body.sourceName),
    grantId: cleanString(body.grantId),
    grantName: cleanString(body.grantName),
    campaignId: cleanString(body.campaignId),
    campaignName: cleanString(body.campaignName),
    donorId: cleanString(body.donorId),
    donorName: cleanString(body.donorName),
    paymentMethod: cleanString(body.paymentMethod),
    externalTransactionId: cleanString(body.externalTransactionId),
    notes: cleanString(body.notes)
  };
}

function incomeRecordFromFinancialActivity(payload = {}, existing = {}) {
  return cleanEarnedIncomePayload({
    ...existing,
    name: payload.sourceName || payload.activityType,
    activityType: payload.activityType,
    status: "Received",
    source: payload.sourceName,
    serviceType: payload.activityType,
    paymentDate: payload.transactionDate,
    amountBilled: payload.amount,
    amountReceived: payload.amount,
    payerName: payload.sourceName,
    grantId: payload.grantId,
    grantName: payload.grantName,
    campaignId: payload.campaignId,
    campaignName: payload.campaignName,
    donorId: payload.donorId,
    donorName: payload.donorName,
    externalTransactionId: payload.externalTransactionId,
    notes: payload.notes
  });
}

async function resolveGiftLinks(payload) {
  if (!payload.donorId) return { error: "Choose a donor for this gift." };
  const donorSnapshot = await fundraisingDonors.doc(payload.donorId).get();
  if (!donorSnapshot.exists) return { error: "The selected donor was not found." };

  const resolved = {
    ...payload,
    donorName: toFundraisingDonor(donorSnapshot).name || "Unnamed donor"
  };
  if (!payload.campaignId) {
    resolved.campaignName = "";
    return { payload: resolved };
  }

  const campaignSnapshot = await fundraisingCampaigns.doc(payload.campaignId).get();
  if (!campaignSnapshot.exists) return { error: "The selected campaign was not found." };
  resolved.campaignName = toFundraisingCampaign(campaignSnapshot).name || "Unnamed campaign";
  return { payload: resolved };
}

function giftValidationError(payload) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.giftDate)) return "Gift Date is required.";
  if (!(payload.amount > 0)) return "Gift Amount must be greater than zero.";
  return "";
}

const resources = [
  {
    path: "donors",
    parameter: "donorId",
    collection: fundraisingDonors,
    clean: cleanFundraisingDonorPayload,
    serialize: toFundraisingDonor,
    listKey: "donors",
    itemKey: "donor",
    label: "Donor"
  },
  {
    path: "campaigns",
    parameter: "campaignId",
    collection: fundraisingCampaigns,
    clean: cleanFundraisingCampaignPayload,
    serialize: toFundraisingCampaign,
    listKey: "campaigns",
    itemKey: "campaign",
    label: "Campaign"
  },
  {
    path: "gifts",
    parameter: "giftId",
    collection: fundraisingGifts,
    clean: cleanFundraisingGiftPayload,
    serialize: toFundraisingGift,
    listKey: "gifts",
    itemKey: "gift",
    label: "Gift",
    resolve: resolveGiftLinks,
    validate: giftValidationError
  },
  {
    path: "earned-income",
    parameter: "incomeId",
    collection: earnedIncome,
    clean: cleanEarnedIncomePayload,
    serialize: toEarnedIncome,
    listKey: "earnedIncome",
    itemKey: "earnedIncomeRecord",
    label: "Earned income record"
  }
];

function registerResource(config) {
  router.get(`/api/${config.path}`, requireAuth, async (_request, response, next) => {
    try {
      const documents = await fetchAllDocuments(config.collection);
      response.json({
        [config.listKey]: documents.map(config.serialize)
      });
    } catch (error) {
      next(error);
    }
  });

  router.post(`/api/${config.path}`, requireAuth, async (request, response, next) => {
    try {
      const cleaned = config.clean(request.body);
      const resolved = config.resolve ? await config.resolve(cleaned) : { payload: cleaned };
      if (resolved.error) {
        response.status(400).json({ error: resolved.error });
        return;
      }
      const payload = resolved.payload;
      const validationError = config.validate ? config.validate(payload) : !payload.name ? `${config.label} name is required.` : "";
      if (validationError) {
        response.status(400).json({ error: validationError });
        return;
      }

      const now = new Date().toISOString();
      const docRef = await config.collection.add({
        ...payload,
        createdAt: now,
        updatedAt: now,
        createdBy: request.user.email
      });
      const created = await docRef.get();
      response.status(201).json({
        [config.itemKey]: config.serialize(created)
      });
    } catch (error) {
      next(error);
    }
  });

  router.patch(`/api/${config.path}/:${config.parameter}`, requireAuth, async (request, response, next) => {
    try {
      const recordId = cleanString(request.params[config.parameter]);
      const docRef = config.collection.doc(recordId);
      const snapshot = await docRef.get();

      if (!snapshot.exists) {
        response.status(404).json({ error: `${config.label} was not found.` });
        return;
      }

      const cleaned = config.clean(request.body);
      const resolved = config.resolve ? await config.resolve(cleaned) : { payload: cleaned };
      if (resolved.error) {
        response.status(400).json({ error: resolved.error });
        return;
      }
      const payload = resolved.payload;
      const validationError = config.validate ? config.validate(payload) : !payload.name ? `${config.label} name is required.` : "";
      if (validationError) {
        response.status(400).json({ error: validationError });
        return;
      }

      await docRef.update({
        ...payload,
        updatedAt: new Date().toISOString(),
        updatedBy: request.user.email
      });
      const updated = await docRef.get();
      response.json({
        [config.itemKey]: config.serialize(updated)
      });
    } catch (error) {
      next(error);
    }
  });

  router.delete(`/api/${config.path}/:${config.parameter}`, requireAuth, async (request, response, next) => {
    try {
      const recordId = cleanString(request.params[config.parameter]);
      const docRef = config.collection.doc(recordId);
      const snapshot = await docRef.get();

      if (!snapshot.exists) {
        response.status(404).json({ error: `${config.label} was not found.` });
        return;
      }

      await docRef.delete();
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  });
}

router.get("/api/financial-activity", requireAuth, async (_request, response, next) => {
  try {
    const [incomeDocuments, giftDocuments, measurementDocuments, claimDocuments] = await Promise.all([
      fetchAllDocuments(earnedIncome),
      fetchAllDocuments(fundraisingGifts),
      fetchAllDocuments(performanceMeasurements),
      fetchAllDocuments(hrsnClaims)
    ]);
    const activities = sortFinancialActivities([
      ...incomeDocuments.map(toEarnedIncome).map(financialActivityFromIncome),
      ...giftDocuments.map(toFundraisingGift).map(financialActivityFromGift),
      ...measurementDocuments
        .map(toPerformanceMeasurement)
        .filter((measurement) => measurement.metricKey === "financial.grant-revenue")
        .map(financialActivityFromLegacyMeasurement),
      ...claimDocuments
        .map(toHrsnClaim)
        .filter((claim) => claim.approved === true && cleanString(claim.approvalDate))
        .map(financialActivityFromHrsnClaim)
    ]);
    response.json({ activities, activityTypes: financialActivityTypes });
  } catch (error) {
    next(error);
  }
});

router.post("/api/financial-activity", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanFinancialActivityPayload(request.body);
    const validationError = financialActivityValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    if (!financialActivityTypes.includes(payload.activityType)) {
      response.status(400).json({ error: "Add donor gifts from the Gifts submodule so the donor record stays linked." });
      return;
    }

    const now = new Date().toISOString();
    const docRef = await earnedIncome.add({
      ...incomeRecordFromFinancialActivity(payload),
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    const created = financialActivityFromIncome(toEarnedIncome(await docRef.get()));
    response.status(201).json({ activity: created });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/financial-activity/:activityId", requireAuth, async (request, response, next) => {
  try {
    const identity = financialActivityId(request.params.activityId);
    if (!identity) {
      response.status(400).json({ error: "The financial activity identifier is invalid." });
      return;
    }
    const payload = cleanFinancialActivityPayload(request.body);
    const validationError = financialActivityValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    const updatedAt = new Date().toISOString();

    if (identity.sourceKind === "income") {
      const docRef = earnedIncome.doc(identity.sourceRecordId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        response.status(404).json({ error: "The financial activity was not found." });
        return;
      }
      await docRef.update({
        ...incomeRecordFromFinancialActivity(payload, toEarnedIncome(snapshot)),
        updatedAt,
        updatedBy: request.user.email
      });
      response.json({ activity: financialActivityFromIncome(toEarnedIncome(await docRef.get())) });
      return;
    }

    if (identity.sourceKind === "gift") {
      if (!financialGiftActivityTypes.includes(payload.activityType)) {
        response.status(400).json({ error: "Gift activity must keep a gift revenue type." });
        return;
      }
      const docRef = fundraisingGifts.doc(identity.sourceRecordId);
      const snapshot = await docRef.get();
      if (!snapshot.exists) {
        response.status(404).json({ error: "The gift transaction was not found." });
        return;
      }
      const existing = toFundraisingGift(snapshot);
      const cleaned = cleanFundraisingGiftPayload({
        ...existing,
        donorId: payload.donorId || existing.donorId,
        donorName: payload.donorName || payload.sourceName || existing.donorName,
        campaignId: payload.campaignId,
        campaignName: payload.campaignName,
        giftDate: payload.transactionDate,
        amount: payload.amount,
        giftType: giftTypeFromActivityType(payload.activityType),
        paymentMethod: payload.paymentMethod || existing.paymentMethod,
        externalTransactionId: payload.externalTransactionId,
        notes: payload.notes
      });
      const resolved = await resolveGiftLinks(cleaned);
      if (resolved.error) {
        response.status(400).json({ error: resolved.error });
        return;
      }
      await docRef.update({ ...resolved.payload, updatedAt, updatedBy: request.user.email });
      response.json({ activity: financialActivityFromGift(toFundraisingGift(await docRef.get())) });
      return;
    }

    if (payload.activityType !== "Grant Revenue") {
      response.status(400).json({ error: "Legacy Operations entries must remain Grant Revenue." });
      return;
    }
    const docRef = performanceMeasurements.doc(identity.sourceRecordId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "The legacy revenue entry was not found." });
      return;
    }
    const cleaned = cleanPerformanceMeasurementPayload({
      metricKey: "financial.grant-revenue",
      periodStart: payload.transactionDate,
      periodEnd: payload.transactionDate,
      value: payload.amount,
      note: payload.notes || payload.sourceName
    });
    await docRef.update({ ...cleaned, updatedAt, updatedBy: request.user.email });
    response.json({ activity: financialActivityFromLegacyMeasurement(toPerformanceMeasurement(await docRef.get())) });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/financial-activity/:activityId", requireAuth, async (request, response, next) => {
  try {
    const identity = financialActivityId(request.params.activityId);
    if (!identity) {
      response.status(400).json({ error: "The financial activity identifier is invalid." });
      return;
    }
    const collection = identity.sourceKind === "income"
      ? earnedIncome
      : identity.sourceKind === "gift"
        ? fundraisingGifts
        : performanceMeasurements;
    const docRef = collection.doc(identity.sourceRecordId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "The financial activity was not found." });
      return;
    }
    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

function hrsnClaimValidationError(payload = {}) {
  if (!payload.name) return "Client Name is required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.dateOfBirth)) return "Date of Birth is required.";
  if (!payload.medicaidId) return "Medicaid Number is required.";
  if (!payload.address) return "Address is required.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.serviceDate)) return "Date of Service is required.";
  if (!(payload.durationMinutes > 0) || payload.durationMinutes % 15 !== 0) return "Duration must use 15-minute increments.";
  if (payload.amount === null || payload.amount < 0) return "Dollar Amount must be zero or greater.";
  if (!payload.coveredPopulations.length) return "Choose at least one Covered Population.";
  if (!Number.isInteger(payload.foodSecurityScore) || payload.foodSecurityScore < 0 || payload.foodSecurityScore > 6) {
    return "Food Security Score must be between 0 and 6.";
  }
  if (!payload.descriptions.length || payload.descriptions.some((value) => !allowedHrsnDescriptions.has(value))) {
    return "Choose at least one valid Description.";
  }
  if (!payload.outcomes.length || payload.outcomes.some((value) => !allowedHrsnOutcomes.has(value))) {
    return "Choose at least one valid Outcome.";
  }
  if (payload.outcomes.includes("None") && payload.outcomes.length > 1) {
    return "None cannot be combined with another Outcome.";
  }
  if (payload.approved && !payload.submitted) return "An approved claim must also be marked Submitted.";
  return "";
}

function budgetCategoryValidationError(payload = {}) {
  if (!Number.isInteger(payload.budgetYear) || payload.budgetYear < 2000 || payload.budgetYear > 2100) {
    return "Choose a valid Budget Year.";
  }
  if (!payload.groupName) return "Category Group is required.";
  if (!payload.name) return "Category Name is required.";
  if (payload.annualBudget === null || payload.annualBudget < 0) return "Annual Budget must be zero or greater.";
  return "";
}

function hrsnClaimSort(first, second) {
  return cleanString(second.serviceDate).localeCompare(cleanString(first.serviceDate))
    || cleanString(second.updatedAt || second.createdAt).localeCompare(cleanString(first.updatedAt || first.createdAt))
    || cleanString(first.name).localeCompare(cleanString(second.name));
}

function cleanHrsnBulkApprovalIds(body = {}) {
  const claimIds = Array.isArray(body.claimIds) ? body.claimIds : [];
  return [...new Set(claimIds.map(cleanString).filter(Boolean))].slice(0, 200);
}

function hrsnApprovalDateForSave(payload = {}, existing = {}, now = new Date()) {
  if (payload.approved !== true) return "";
  const requestedDate = cleanString(payload.approvalDate);
  if (/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) return requestedDate;
  const existingDate = cleanString(existing.approvalDate);
  if (/^\d{4}-\d{2}-\d{2}$/.test(existingDate)) return existingDate;
  return todayDateString(now);
}

function budgetCategorySort(first, second) {
  return (Number(first.sortOrder ?? Number.MAX_SAFE_INTEGER) - Number(second.sortOrder ?? Number.MAX_SAFE_INTEGER))
    || cleanString(first.groupName).localeCompare(cleanString(second.groupName))
    || cleanString(first.name).localeCompare(cleanString(second.name));
}

router.get("/api/hrsn-claims", requireAuth, async (_request, response, next) => {
  try {
    const [claimDocuments, clientDocuments] = await Promise.all([
      fetchAllDocuments(hrsnClaims),
      fetchAllDocuments(clients)
    ]);
    response.json({
      claims: claimDocuments.map(toHrsnClaim).sort(hrsnClaimSort),
      clientOptions: clientDocuments.map(toClient).map((client) => ({
        id: client.id,
        name: [client.firstName, client.lastName].map(cleanString).filter(Boolean).join(" "),
        dateOfBirth: cleanString(client.dateOfBirth),
        medicaidId: cleanString(client.yccoId),
        address: [
          client.addressStreet,
          [client.addressCity, client.addressState, client.addressZip].map(cleanString).filter(Boolean).join(" ")
        ].map(cleanString).filter(Boolean).join(", ")
      })).filter((client) => client.name).sort((first, second) => first.name.localeCompare(second.name))
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/hrsn-claims", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanHrsnClaimPayload(request.body);
    payload.approvalDate = hrsnApprovalDateForSave(payload);
    const validationError = hrsnClaimValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    const now = new Date().toISOString();
    const docRef = await hrsnClaims.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email,
      updatedBy: request.user.email
    });
    response.status(201).json({ claim: toHrsnClaim(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/hrsn-claims/bulk-approval", requireAuth, async (request, response, next) => {
  try {
    const claimIds = cleanHrsnBulkApprovalIds(request.body);
    if (!claimIds.length) {
      response.status(400).json({ error: "Choose at least one HRSN billing record." });
      return;
    }

    const snapshots = await Promise.all(claimIds.map((claimId) => hrsnClaims.doc(claimId).get()));
    const missingClaimIds = snapshots.filter((snapshot) => !snapshot.exists).map((snapshot) => snapshot.id);
    if (missingClaimIds.length) {
      response.status(404).json({ error: "One or more HRSN billing records could not be found." });
      return;
    }

    const now = new Date().toISOString();
    const approvalDate = todayDateString(new Date(now));
    const batch = firestore.batch();
    snapshots.forEach((snapshot) => {
      batch.update(snapshot.ref, {
        submitted: true,
        approved: true,
        approvalDate: cleanString(snapshot.data()?.approvalDate) || approvalDate,
        updatedAt: now,
        updatedBy: request.user.email
      });
    });
    await batch.commit();
    response.json({ updatedCount: snapshots.length });
  } catch (error) {
    next(error);
  }
});

router.put("/api/hrsn-claims/:claimId", requireAuth, async (request, response, next) => {
  try {
    const docRef = hrsnClaims.doc(cleanString(request.params.claimId));
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "HRSN claim was not found." });
      return;
    }
    const payload = cleanHrsnClaimPayload(request.body);
    const validationError = hrsnClaimValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    const existing = toHrsnClaim(snapshot);
    payload.approvalDate = hrsnApprovalDateForSave(payload, existing);
    const now = new Date().toISOString();
    await docRef.set({
      ...payload,
      createdAt: existing.createdAt || now,
      createdBy: existing.createdBy || request.user.email,
      updatedAt: now,
      updatedBy: request.user.email
    });
    response.json({ claim: toHrsnClaim(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/hrsn-claims/:claimId", requireAuth, async (request, response, next) => {
  try {
    const docRef = hrsnClaims.doc(cleanString(request.params.claimId));
    if (!(await docRef.get()).exists) {
      response.status(404).json({ error: "HRSN claim was not found." });
      return;
    }
    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/api/budget-categories", requireAuth, async (request, response, next) => {
  try {
    const budgetYear = cleanOptionalNumber(request.query.year);
    const documents = await fetchAllDocuments(budgetCategories);
    const categories = documents.map(toBudgetCategory)
      .filter((category) => budgetYear === null || category.budgetYear === budgetYear)
      .sort(budgetCategorySort);
    response.json({ categories });
  } catch (error) {
    next(error);
  }
});

router.post("/api/budget-categories", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanBudgetCategoryPayload(request.body);
    const validationError = budgetCategoryValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    const now = new Date().toISOString();
    const docRef = await budgetCategories.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email,
      updatedBy: request.user.email
    });
    response.status(201).json({ category: toBudgetCategory(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.put("/api/budget-categories/:categoryId", requireAuth, async (request, response, next) => {
  try {
    const docRef = budgetCategories.doc(cleanString(request.params.categoryId));
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Budget category was not found." });
      return;
    }
    const payload = cleanBudgetCategoryPayload(request.body);
    const validationError = budgetCategoryValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    const existing = toBudgetCategory(snapshot);
    const now = new Date().toISOString();
    await docRef.set({
      ...payload,
      createdAt: existing.createdAt || now,
      createdBy: existing.createdBy || request.user.email,
      updatedAt: now,
      updatedBy: request.user.email
    });
    response.json({ category: toBudgetCategory(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/budget-categories/:categoryId", requireAuth, async (request, response, next) => {
  try {
    const docRef = budgetCategories.doc(cleanString(request.params.categoryId));
    if (!(await docRef.get()).exists) {
      response.status(404).json({ error: "Budget category was not found." });
      return;
    }
    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

resources.forEach(registerResource);

export {
  budgetCategoryValidationError,
  cleanHrsnBulkApprovalIds,
  financialActivityFromGift,
  financialActivityFromHrsnClaim,
  financialActivityFromIncome,
  financialActivityFromLegacyMeasurement,
  financialActivityValidationError,
  financialActivityTypes,
  hrsnClaimValidationError,
  hrsnApprovalDateForSave,
  sortFinancialActivities
};

export default router;
