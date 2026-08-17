import express from "express";
import {
  adminDataCollections,
  adminSettings,
  appointments,
  cleanSchedulingSettingsPayload,
  cleanString,
  clients,
  collectionCount,
  deleteCollectionDocuments,
  fetchAllDocuments,
  firestore,
  googleCalendarConnectionStatus,
  isAdminBulkDeleteEnabled,
  loadSchedulingSettings,
  loadClientStatusDefinitions,
  normalizeClientStatusDefinitions,
  persistClinicAppointmentCalendarSync,
  requireAuth,
  serializeSchedulingSettings,
  toSchedulingSettings,
  todayDateString,
  verifyGoogleCalendarLifecycle
} from "../lib/core.js";

const router = express.Router();
const adminImportableCollectionKeys = new Set([
  "clients",
  "referrals",
  "referral-network",
  "appointments"
]);

const vendorAgreementStatuses = new Set([
  "Complete",
  "Pending Signature",
  "Covered Through Partner",
  "Review Required",
  "Not Used for PHI",
  "Retiring"
]);

const complianceStatuses = new Set(["Complete", "In Progress", "Not Started", "Not Applicable"]);

const defaultVendorAgreements = Object.freeze([
  { id: "google-workspace", vendor: "Google Workspace", service: "Gmail, Calendar, Drive, Forms, and managed accounts", agreementType: "HIPAA BAA", status: "Complete", owner: "Executive Director", documentUrl: "", reviewDate: "", renewalDate: "", notes: "BAA accepted in the Google Admin console." },
  { id: "google-cloud", vendor: "Google Cloud", service: "Cloud Run, Firestore, Storage, Identity Platform, Secret Manager, and Logging", agreementType: "HIPAA BAA", status: "Complete", owner: "Executive Director", documentUrl: "", reviewDate: "", renewalDate: "", notes: "Use only services listed as covered by Google." },
  { id: "pmc", vendor: "Physicians' Medical Center", service: "Clinic referrals and shared office workflows", agreementType: "BAA / data-sharing terms", status: "Pending Signature", owner: "Executive Director", documentUrl: "", reviewDate: "", renewalDate: "", notes: "Replacement agreement is being prepared for signature." },
  { id: "ycco", vendor: "Yamhill Community Care", service: "HRSN referrals, engagement, and billing", agreementType: "HRSN Provider Agreement", status: "Complete", owner: "Executive Director", documentUrl: "", reviewDate: "", renewalDate: "", notes: "Signed by both parties; attach the fully executed copy." },
  { id: "unite-us", vendor: "Unite Us", service: "YCCO member referrals", agreementType: "Covered through YCCO", status: "Covered Through Partner", owner: "Executive Director", documentUrl: "", reviewDate: "", renewalDate: "", notes: "YCCO confirmed coverage. Keep that confirmation with the agreement record." },
  { id: "azure-communications", vendor: "Microsoft Azure Communication Services", service: "Future service texts and Hub calling", agreementType: "Microsoft HIPAA BAA / Product Terms", status: "Review Required", owner: "Executive Director", documentUrl: "", reviewDate: "", renewalDate: "", notes: "Do not enable family messaging until the organizational account, covered-service terms, phone registration, and controlled tests are documented." },
  { id: "mailerlite", vendor: "MailerLite", service: "Marketing email only", agreementType: "Data processing terms", status: "Not Used for PHI", owner: "Executive Director", documentUrl: "", reviewDate: "", renewalDate: "", notes: "Keep appointment, referral, health, and HRSN information out of MailerLite." },
  { id: "setmore", vendor: "Setmore", service: "Legacy booking and reminders during cutover", agreementType: "Legacy vendor review", status: "Retiring", owner: "Executive Director", documentUrl: "", reviewDate: "", renewalDate: "", notes: "Keep active until the SNACK booking and messaging cutover is verified." }
]);

const defaultComplianceChecklist = Object.freeze([
  { id: "mfa", item: "Multi-factor authentication enabled for every staff account", status: "Complete", owner: "Executive Director", dueDate: "", evidenceUrl: "", notes: "Recheck during each quarterly access review." },
  { id: "risk-analysis", item: "Written security risk analysis and risk-management plan", status: "In Progress", owner: "Executive Director", dueDate: "", evidenceUrl: "", notes: "Review whenever systems, vendors, or data flows materially change." },
  { id: "incident-response", item: "Incident response and breach-escalation procedure approved", status: "In Progress", owner: "Executive Director", dueDate: "", evidenceUrl: "", notes: "Include vendor notification paths and an incident log." },
  { id: "device-rules", item: "Staff device, screen lock, download, and lost-device rules approved", status: "In Progress", owner: "Executive Director", dueDate: "", evidenceUrl: "", notes: "Applies to computers, phones, tablets, and printed records." },
  { id: "retention", item: "Record retention and secure deletion schedule approved", status: "Not Started", owner: "Executive Director", dueDate: "", evidenceUrl: "", notes: "Confirm contract, billing, personnel, and program-record requirements." },
  { id: "backup-restore", item: "Backup restoration tested and recorded", status: "Not Started", owner: "Executive Director", dueDate: "", evidenceUrl: "", notes: "A successful download is not a restore test." },
  { id: "access-review", item: "Quarterly staff access and MFA review scheduled", status: "In Progress", owner: "Executive Director", dueDate: "", evidenceUrl: "", notes: "Remove access promptly when a role or employment ends." },
  { id: "audit-review", item: "Monthly security-history review scheduled", status: "Not Started", owner: "Executive Director", dueDate: "", evidenceUrl: "", notes: "Record reviewer, date, findings, and follow-up." },
  { id: "training", item: "Annual confidentiality and security training documented", status: "In Progress", owner: "Executive Director", dueDate: "", evidenceUrl: "", notes: "Include new-hire acknowledgment and refresher training." },
  { id: "vendor-review", item: "Vendor agreements and covered-service limits reviewed annually", status: "In Progress", owner: "Executive Director", dueDate: "", evidenceUrl: "", notes: "Recheck before enabling a new integration." }
]);

function adminSecurityManagerAllowed(user = {}) {
  const accessLevel = cleanString(user.accessLevelId || user.accessLevelName || user.role).toLowerCase();
  return ["admin", "manager"].includes(accessLevel);
}

function adminCalendarCutoverAllowed(user = {}) {
  const accessLevel = cleanString(user.accessLevelId || user.accessLevelName || user.role).toLowerCase();
  return accessLevel === "admin";
}

function eligibleGoogleCalendarBackfillAppointments(documents = [], minimumDate = todayDateString()) {
  return documents
    .map((document) => ({ id: document.id, ...document.data() }))
    .filter((appointment) => (
      cleanString(appointment.appointmentDate) >= minimumDate
      && cleanString(appointment.status).toLowerCase() === "scheduled"
      && cleanString(appointment.appointmentTime)
    ))
    .sort((left, right) => (
      cleanString(left.appointmentDate).localeCompare(cleanString(right.appointmentDate))
      || cleanString(left.appointmentTime).localeCompare(cleanString(right.appointmentTime))
      || cleanString(left.id).localeCompare(cleanString(right.id))
    ));
}

function cleanAdminDate(value) {
  const date = cleanString(value);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

function cleanAdminDocumentUrl(value) {
  const url = cleanString(value);
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed.toString() : "";
  } catch {
    return "";
  }
}

function normalizeVendorAgreement(record = {}, fallback = {}) {
  const status = cleanString(record.status);
  return {
    id: cleanString(record.id || fallback.id).slice(0, 80),
    vendor: cleanString(record.vendor || fallback.vendor).slice(0, 160),
    service: cleanString(record.service || fallback.service).slice(0, 300),
    agreementType: cleanString(record.agreementType || fallback.agreementType).slice(0, 160),
    status: vendorAgreementStatuses.has(status) ? status : fallback.status || "Review Required",
    owner: cleanString(record.owner || fallback.owner).slice(0, 160),
    documentUrl: cleanAdminDocumentUrl(record.documentUrl || fallback.documentUrl),
    reviewDate: cleanAdminDate(record.reviewDate || fallback.reviewDate),
    renewalDate: cleanAdminDate(record.renewalDate || fallback.renewalDate),
    notes: cleanString(record.notes || fallback.notes).slice(0, 1200)
  };
}

function normalizeComplianceItem(record = {}, fallback = {}) {
  const status = cleanString(record.status);
  return {
    id: cleanString(record.id || fallback.id).slice(0, 80),
    item: cleanString(record.item || fallback.item).slice(0, 300),
    status: complianceStatuses.has(status) ? status : fallback.status || "Not Started",
    owner: cleanString(record.owner || fallback.owner).slice(0, 160),
    dueDate: cleanAdminDate(record.dueDate || fallback.dueDate),
    evidenceUrl: cleanAdminDocumentUrl(record.evidenceUrl || fallback.evidenceUrl),
    notes: cleanString(record.notes || fallback.notes).slice(0, 1200)
  };
}

function mergeAdminSecurityRecords(defaults, saved, normalizer) {
  const savedById = new Map((Array.isArray(saved) ? saved : []).map((item) => [cleanString(item?.id), item]));
  const merged = defaults.map((fallback) => normalizer(savedById.get(fallback.id) || {}, fallback));
  const defaultIds = new Set(defaults.map((item) => item.id));
  (Array.isArray(saved) ? saved : [])
    .filter((item) => item?.id && !defaultIds.has(cleanString(item.id)))
    .forEach((item) => merged.push(normalizer(item)));
  return merged.filter((item) => item.id);
}

function isAdminQaFixtureDocument(document) {
  const data = typeof document?.data === "function" ? document.data() : document || {};
  const id = cleanString(document?.id || data.id);
  return /^qa(?:[-_]|$)/i.test(id)
    && data.qaFixture === true
    && Boolean(cleanString(data.qaFixtureSet));
}

function adminDataCollectionAllowsCleanup(config) {
  return Boolean(config) && config.cleanupEligible !== false;
}

function googleCalendarTestErrorMessage(error) {
  const message = cleanString(error?.message);
  if (/invalid_grant|invalid_rapt|reauth/i.test(message)) {
    return "This computer's Google sign-in needs to be refreshed before the Clinic Calendar test can run. No calendar event was created.";
  }
  return "The Clinic Calendar test could not complete. Confirm that the app has permission to edit the Clinic Appts calendar, then try again.";
}

async function deleteAdminQaFixtureDocuments(documents) {
  let deletedCount = 0;

  for (let start = 0; start < documents.length; start += 450) {
    const batch = firestore.batch();
    const page = documents.slice(start, start + 450);
    page.forEach((document) => batch.delete(document.ref));
    await batch.commit();
    deletedCount += page.length;
  }

  return deletedCount;
}

router.get("/api/admin/data-center", requireAuth, async (_request, response, next) => {
  try {
    const collections = [];

    for (const [key, config] of Object.entries(adminDataCollections)) {
      const documents = await fetchAllDocuments(config.collection);
      collections.push({
        key,
        label: config.label,
        count: documents.length,
        qaFixtureCount: adminDataCollectionAllowsCleanup(config)
          ? documents.filter(isAdminQaFixtureDocument).length
          : 0,
        cleanupEligible: adminDataCollectionAllowsCleanup(config),
        importable: adminImportableCollectionKeys.has(key)
      });
    }

    response.json({
      collections,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/data-counts", requireAuth, async (_request, response, next) => {
  try {
    const counts = {};

    for (const [key, config] of Object.entries(adminDataCollections)) {
      counts[key] = await collectionCount(config.collection);
    }

    response.json({ counts });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/export/:collectionKey", requireAuth, async (request, response, next) => {
  try {
    const collectionKey = cleanString(request.params.collectionKey);
    const config = adminDataCollections[collectionKey];

    if (!config) {
      response.status(400).json({
        error: "Data collection is not available for export."
      });
      return;
    }

    const documents = await fetchAllDocuments(config.collection);

    response.json({
      collection: collectionKey,
      label: config.label,
      exportedAt: new Date().toISOString(),
      records: documents.map(config.serializer)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/admin/bulk-delete", requireAuth, async (request, response, next) => {
  try {
    if (!isAdminBulkDeleteEnabled()) {
      response.status(403).json({
        error: "Bulk delete is disabled for this environment."
      });
      return;
    }

    const collectionKeys = Array.isArray(request.body.collections)
      ? request.body.collections.map(cleanString).filter(Boolean)
      : [];
    const confirmation = cleanString(request.body.confirmation);
    const uniqueCollectionKeys = [...new Set(collectionKeys)];

    if (confirmation !== "DELETE TEST DATA") {
      response.status(400).json({
        error: "Type DELETE TEST DATA to confirm this reset."
      });
      return;
    }

    if (!uniqueCollectionKeys.length) {
      response.status(400).json({
        error: "Choose at least one data collection to delete."
      });
      return;
    }

    const invalidCollection = uniqueCollectionKeys.find(
      (key) => !adminDataCollectionAllowsCleanup(adminDataCollections[key])
    );

    if (invalidCollection) {
      response.status(400).json({
        error: "One or more data collections cannot be deleted from this tool."
      });
      return;
    }

    const deleted = {};

    for (const key of uniqueCollectionKeys) {
      deleted[key] = await deleteCollectionDocuments(adminDataCollections[key].collection);
    }

    response.json({
      deleted,
      deletedAt: new Date().toISOString(),
      deletedBy: request.user.email
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/admin/qa-fixtures/delete", requireAuth, async (request, response, next) => {
  try {
    const collectionKeys = Array.isArray(request.body.collections)
      ? request.body.collections.map(cleanString).filter(Boolean)
      : [];
    const uniqueCollectionKeys = [...new Set(collectionKeys)];

    if (cleanString(request.body.confirmation) !== "DELETE SAMPLE DATA") {
      response.status(400).json({
        error: "Type DELETE SAMPLE DATA to confirm this cleanup."
      });
      return;
    }

    if (!uniqueCollectionKeys.length) {
      response.status(400).json({
        error: "Choose at least one data collection to clean up."
      });
      return;
    }

    const invalidCollection = uniqueCollectionKeys.find(
      (key) => !adminDataCollectionAllowsCleanup(adminDataCollections[key])
    );
    if (invalidCollection) {
      response.status(400).json({
        error: "One or more data collections cannot be cleaned from this tool."
      });
      return;
    }

    const deleted = {};
    for (const key of uniqueCollectionKeys) {
      const documents = await fetchAllDocuments(adminDataCollections[key].collection);
      const fixtureDocuments = documents.filter(isAdminQaFixtureDocument);
      deleted[key] = await deleteAdminQaFixtureDocuments(fixtureDocuments);
    }

    response.json({
      deleted,
      deletedAt: new Date().toISOString(),
      deletedBy: request.user.email
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/scheduling-settings", requireAuth, async (_request, response, next) => {
  try {
    const settings = await loadSchedulingSettings();

    response.json({
      schedulingSettings: serializeSchedulingSettings(settings)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/crm-settings", requireAuth, async (_request, response, next) => {
  try {
    response.json({ clientStatuses: await loadClientStatusDefinitions() });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/admin/crm-settings", requireAuth, async (request, response, next) => {
  try {
    if (!Array.isArray(request.body?.clientStatuses) || !request.body.clientStatuses.length) {
      response.status(400).json({ error: "Add at least one client status." });
      return;
    }
    const clientStatuses = normalizeClientStatusDefinitions(request.body.clientStatuses);
    const allowedNames = new Set(clientStatuses.map((item) => item.name));
    const clientDocuments = await fetchAllDocuments(clients);
    const statusesInUse = [...new Set(clientDocuments.map((document) => cleanString(document.data()?.status)).filter(Boolean))];
    const missingStatus = statusesInUse.find((status) => !allowedNames.has(status));
    if (missingStatus) {
      response.status(409).json({
        error: `The ${missingStatus} status is still used by a client. Change those clients before removing it.`
      });
      return;
    }
    const now = new Date().toISOString();
    await adminSettings.doc("crm").set({
      clientStatuses,
      updatedAt: now,
      updatedBy: request.user.email
    }, { merge: true });
    response.json({ clientStatuses });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/security-compliance", requireAuth, async (request, response, next) => {
  try {
    if (!adminSecurityManagerAllowed(request.user)) {
      response.status(403).json({ error: "Only an Admin or Manager can view security and vendor records." });
      return;
    }
    const snapshot = await adminSettings.doc("securityCompliance").get();
    const saved = snapshot.exists ? snapshot.data() : {};
    response.json({
      vendorAgreements: mergeAdminSecurityRecords(
        defaultVendorAgreements,
        saved.vendorAgreements,
        normalizeVendorAgreement
      ),
      complianceChecklist: mergeAdminSecurityRecords(
        defaultComplianceChecklist,
        saved.complianceChecklist,
        normalizeComplianceItem
      ),
      updatedAt: cleanString(saved.updatedAt),
      updatedBy: cleanString(saved.updatedBy)
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/admin/security-compliance", requireAuth, async (request, response, next) => {
  try {
    if (!adminSecurityManagerAllowed(request.user)) {
      response.status(403).json({ error: "Only an Admin or Manager can update security and vendor records." });
      return;
    }
    if (!Array.isArray(request.body?.vendorAgreements) || !Array.isArray(request.body?.complianceChecklist)) {
      response.status(400).json({ error: "Vendor agreements and the compliance checklist are required." });
      return;
    }
    const vendorAgreements = request.body.vendorAgreements
      .map((item) => normalizeVendorAgreement(item))
      .filter((item) => item.id && item.vendor);
    const complianceChecklist = request.body.complianceChecklist
      .map((item) => normalizeComplianceItem(item))
      .filter((item) => item.id && item.item);
    if (!vendorAgreements.length || !complianceChecklist.length) {
      response.status(400).json({ error: "Keep at least one vendor agreement and one compliance item." });
      return;
    }
    const now = new Date().toISOString();
    await adminSettings.doc("securityCompliance").set({
      vendorAgreements,
      complianceChecklist,
      updatedAt: now,
      updatedBy: request.user.email
    }, { merge: true });
    response.json({ vendorAgreements, complianceChecklist, updatedAt: now, updatedBy: request.user.email });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/google-calendar/status", requireAuth, async (_request, response) => {
  try {
    response.json(await googleCalendarConnectionStatus());
  } catch (error) {
    response.json({
      configured: true,
      enabled: true,
      connected: false,
      error: cleanString(error?.message) || "Google Calendar connection check failed."
    });
  }
});

router.post("/api/admin/google-calendar/test", requireAuth, async (request, response) => {
  try {
    if (cleanString(request.body?.confirmation) !== "TEST CLINIC CALENDAR") {
      response.status(400).json({
        error: "Confirm the controlled Clinic Calendar connection test."
      });
      return;
    }

    response.json(await verifyGoogleCalendarLifecycle());
  } catch (error) {
    response.status(503).json({ error: googleCalendarTestErrorMessage(error) });
  }
});

router.get("/api/admin/google-calendar/backfill", requireAuth, async (request, response, next) => {
  try {
    if (!adminCalendarCutoverAllowed(request.user)) {
      response.status(403).json({ error: "Only an Admin can prepare the Clinic Calendar cutover." });
      return;
    }
    const candidates = eligibleGoogleCalendarBackfillAppointments(await fetchAllDocuments(appointments));
    response.json({
      count: candidates.length,
      alreadyConnectedCount: candidates.filter((appointment) => cleanString(appointment.googleEventId)).length,
      firstDate: cleanString(candidates[0]?.appointmentDate),
      lastDate: cleanString(candidates.at(-1)?.appointmentDate)
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/admin/google-calendar/backfill", requireAuth, async (request, response, next) => {
  try {
    if (!adminCalendarCutoverAllowed(request.user)) {
      response.status(403).json({ error: "Only an Admin can run the Clinic Calendar cutover." });
      return;
    }
    if (cleanString(request.body?.confirmation) !== "SYNC FUTURE APPOINTMENTS") {
      response.status(400).json({ error: "Confirm the future Clinic appointment synchronization." });
      return;
    }

    const documents = await fetchAllDocuments(appointments);
    const candidates = eligibleGoogleCalendarBackfillAppointments(documents);
    const documentById = new Map(documents.map((document) => [document.id, document]));
    const results = [];

    for (const appointment of candidates) {
      const result = await persistClinicAppointmentCalendarSync(
        documentById.get(appointment.id).ref,
        appointment,
        request.user.email,
        { enabled: true }
      );
      results.push({ appointmentId: appointment.id, state: result.state });
    }

    const errors = results.filter((result) => result.state === "error");
    response.status(errors.length ? 503 : 200).json({
      attemptedCount: results.length,
      syncedCount: results.filter((result) => result.state === "synced").length,
      errorCount: errors.length,
      results
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/admin/scheduling-settings", requireAuth, async (request, response, next) => {
  try {
    const current = serializeSchedulingSettings(await loadSchedulingSettings());
    const payload = cleanSchedulingSettingsPayload({
      ...current,
      ...request.body,
      kitchen: {
        ...current.kitchen,
        ...(request.body?.kitchen || request.body?.kitchenSettings || {})
      }
    });
    const docRef = adminSettings.doc("scheduling");

    await docRef.set({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    }, { merge: true });

    const updated = await docRef.get();

    response.json({
      schedulingSettings: serializeSchedulingSettings(toSchedulingSettings(updated))
    });
  } catch (error) {
    next(error);
  }
});

export default router;
export {
  adminCalendarCutoverAllowed,
  adminSecurityManagerAllowed,
  adminDataCollectionAllowsCleanup,
  mergeAdminSecurityRecords,
  normalizeComplianceItem,
  normalizeVendorAgreement,
  googleCalendarTestErrorMessage,
  eligibleGoogleCalendarBackfillAppointments,
  isAdminQaFixtureDocument
};
