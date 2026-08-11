import { randomUUID } from "node:crypto";
import express from "express";
import {
  adminSettings,
  adminEmails,
  allowedEmailDomain,
  cleanStaffFinanceSections,
  cleanStaffModules,
  cleanString,
  fetchAllDocuments,
  firestore,
  loadStaffAccessLevels,
  normalizeStaffEmail,
  normalizeStaffRole,
  requireAuth,
  staffAccessLevelForRole,
  staffFinanceSectionIds,
  staffFinanceSectionsForRole,
  staffModuleIds,
  staffModulesForRole,
  staffRoleCanAccessGrantDocuments,
  sessionInactivityMinutes,
  sessionWarningMinutes,
  staffUsers,
  toStaffUser
} from "../lib/core.js";

const router = express.Router();
const staffProgramAreas = Object.freeze(["Clinic", "Kitchen", "School", "Outreach"]);
const staffModuleLabels = Object.freeze({
  schedule: "Schedule",
  crm: "CRM",
  outreach: "Outreach",
  fundraising: "Finances",
  marketing: "Marketing",
  operations: "Operations",
  admin: "Admin"
});

function cleanStaffPrograms(value) {
  const requested = Array.isArray(value) ? value.map(cleanString) : [];
  return staffProgramAreas.filter((program) => requested.includes(program));
}

function accessLevelById(accessLevels, value) {
  const requested = cleanString(value).toLowerCase();
  return accessLevels.find((level) => level.id.toLowerCase() === requested);
}

function accessLevelNameExists(accessLevels, name, exceptId = "") {
  const requested = cleanString(name).toLowerCase();
  return accessLevels.some((level) =>
    level.id !== exceptId && level.name.toLowerCase() === requested);
}

function accessLevelDeletionError(accessLevel = {}, assignedAccountCount = 0) {
  if (accessLevel.system || accessLevel.admin) {
    return "Built-in access levels cannot be deleted.";
  }
  if (Number(assignedAccountCount) > 0) {
    return `Reassign ${Number(assignedAccountCount)} staff account${Number(assignedAccountCount) === 1 ? "" : "s"} before deleting this access level.`;
  }
  return "";
}

async function saveStaffAccessLevels(accessLevels, updatedBy) {
  const now = new Date().toISOString();
  const docRef = adminSettings.doc("staffAccess");
  const existing = await docRef.get();
  await docRef.set({
    accessLevels,
    createdAt: existing.exists ? existing.data().createdAt || now : now,
    updatedAt: now,
    updatedBy
  }, { merge: true });
}

async function synchronizeGrantDocumentAccess(accessLevels, updatedBy) {
  const documents = await fetchAllDocuments(staffUsers);
  const now = new Date().toISOString();
  const records = new Map(documents.map((document) => [
    normalizeStaffEmail(document.data()?.email || document.id),
    document
  ]));
  const writes = [];

  for (const document of documents) {
    const data = document.data() || {};
    const email = normalizeStaffEmail(data.email || document.id);
    const role = normalizeStaffRole(data.accessLevelId || data.role, email, accessLevels);
    const expected = data.active !== false && staffRoleCanAccessGrantDocuments(role, accessLevels);
    if (data.grantDocumentAccess !== expected) {
      writes.push({
        ref: document.ref,
        data: { grantDocumentAccess: expected, updatedAt: now, updatedBy }
      });
    }
  }

  for (const email of adminEmails) {
    if (records.has(email)) continue;
    writes.push({
      ref: staffUsers.doc(email),
      data: {
        email,
        displayName: "Shannon Oddo",
        role: "Admin",
        accessLevelId: "Admin",
        active: true,
        grantDocumentAccess: true,
        createdAt: now,
        updatedAt: now,
        updatedBy
      }
    });
  }

  for (let start = 0; start < writes.length; start += 450) {
    const batch = firestore.batch();
    writes.slice(start, start + 450).forEach((write) => batch.set(write.ref, write.data, { merge: true }));
    await batch.commit();
  }
}

router.get("/api/access/me", requireAuth, (request, response) => {
  response.json({
    access: {
      email: request.user.email,
      displayName: request.user.displayName,
      role: request.user.role,
      accessLevelId: request.user.accessLevelId,
      accessLevelName: request.user.accessLevelName,
      active: request.user.active,
      modules: request.user.modules,
      financeSections: request.user.financeSections
    },
    sessionPolicy: {
      inactivityMinutes: sessionInactivityMinutes,
      warningMinutes: sessionWarningMinutes
    }
  });
});

router.get("/api/staff-directory", requireAuth, async (_request, response, next) => {
  try {
    const accessLevels = await loadStaffAccessLevels();
    const documents = await fetchAllDocuments(staffUsers);
    const users = documents
      .map((document) => toStaffUser(document, accessLevels))
      .filter((user) => user.active && user.displayName)
      .map((user) => ({
        email: user.email,
        displayName: user.displayName,
        accessLevelName: user.accessLevelName
      }))
      .sort((first, second) => first.displayName.localeCompare(second.displayName));
    response.json({ users });
  } catch (error) {
    next(error);
  }
});

router.get("/api/admin/staff-users", requireAuth, async (_request, response, next) => {
  try {
    const accessLevels = await loadStaffAccessLevels();
    await synchronizeGrantDocumentAccess(accessLevels, _request.user.email);
    const documents = await fetchAllDocuments(staffUsers);
    const usersByEmail = new Map(documents.map((document) => {
      const user = toStaffUser(document, accessLevels);
      return [user.email, {
        ...user,
        protectedOwner: adminEmails.has(user.email)
      }];
    }));

    for (const email of adminEmails) {
      const existing = usersByEmail.get(email) || {};
      const adminLevel = staffAccessLevelForRole("Admin", accessLevels);
      usersByEmail.set(email, {
        ...existing,
        id: existing.id || email,
        email,
        displayName: existing.displayName || "Shannon Oddo",
        role: "Admin",
        accessLevelId: "Admin",
        accessLevelName: adminLevel.name,
        active: true,
        modules: staffModulesForRole("Admin", accessLevels),
        financeSections: staffFinanceSectionsForRole("Admin", accessLevels),
        protectedOwner: true
      });
    }

    const users = [...usersByEmail.values()].sort((first, second) =>
      Number(second.role === "Admin") - Number(first.role === "Admin")
      || (first.displayName || first.email).localeCompare(second.displayName || second.email));

    response.json({
      users,
      accessLevels,
      modules: staffModuleIds.map((id) => ({ id, name: staffModuleLabels[id] })),
      financeSections: staffFinanceSectionIds
    });
  } catch (error) {
    next(error);
  }
});

router.post("/api/admin/access-levels", requireAuth, async (request, response, next) => {
  try {
    const accessLevels = await loadStaffAccessLevels();
    const name = cleanString(request.body.name);
    const modules = cleanStaffModules(request.body.modules);
    const financeSections = modules.includes("fundraising")
      ? cleanStaffFinanceSections(request.body.financeSections)
      : [];

    if (!name) {
      response.status(400).json({ error: "Enter a name for the new access level." });
      return;
    }
    if (accessLevelNameExists(accessLevels, name)) {
      response.status(409).json({ error: "An access level with this name already exists." });
      return;
    }
    if (!modules.length) {
      response.status(400).json({ error: "Choose at least one module for this access level." });
      return;
    }
    if (modules.includes("fundraising") && !financeSections.length) {
      response.status(400).json({ error: "Choose at least one Finance section for this access level." });
      return;
    }

    const accessLevel = {
      id: `custom-${randomUUID()}`,
      name,
      modules,
      financeSections,
      system: false,
      admin: false
    };
    const nextLevels = [...accessLevels, accessLevel];
    await saveStaffAccessLevels(nextLevels, request.user.email);
    await synchronizeGrantDocumentAccess(nextLevels, request.user.email);
    response.status(201).json({ accessLevel, accessLevels: nextLevels });
  } catch (error) {
    next(error);
  }
});

router.put("/api/admin/access-levels/:accessLevelId", requireAuth, async (request, response, next) => {
  try {
    const accessLevels = await loadStaffAccessLevels();
    const accessLevel = accessLevelById(accessLevels, request.params.accessLevelId);
    if (!accessLevel) {
      response.status(404).json({ error: "That access level could not be found." });
      return;
    }

    const name = cleanString(request.body.name);
    const modules = cleanStaffModules(request.body.modules);
    const financeSections = accessLevel.admin
      ? [...staffFinanceSectionIds]
      : modules.includes("fundraising")
        ? cleanStaffFinanceSections(request.body.financeSections)
        : [];
    if (!name) {
      response.status(400).json({ error: "Enter a name for this access level." });
      return;
    }
    if (accessLevelNameExists(accessLevels, name, accessLevel.id)) {
      response.status(409).json({ error: "An access level with this name already exists." });
      return;
    }
    if (!modules.length) {
      response.status(400).json({ error: "Choose at least one module for this access level." });
      return;
    }
    if (modules.includes("fundraising") && !financeSections.length) {
      response.status(400).json({ error: "Choose at least one Finance section for this access level." });
      return;
    }
    if (accessLevel.admin && !modules.includes("admin")) modules.push("admin");

    const updated = {
      ...accessLevel,
      name,
      modules,
      financeSections
    };
    const nextLevels = accessLevels.map((level) =>
      level.id === updated.id ? updated : level);
    await saveStaffAccessLevels(nextLevels, request.user.email);
    await synchronizeGrantDocumentAccess(nextLevels, request.user.email);
    response.json({ accessLevel: updated, accessLevels: nextLevels });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/admin/access-levels/:accessLevelId", requireAuth, async (request, response, next) => {
  try {
    const accessLevels = await loadStaffAccessLevels();
    const accessLevel = accessLevelById(accessLevels, request.params.accessLevelId);
    if (!accessLevel) {
      response.status(404).json({ error: "That access level could not be found." });
      return;
    }

    const staffDocuments = await fetchAllDocuments(staffUsers);
    const assignedAccountCount = staffDocuments.filter((document) => {
      const data = document.data() || {};
      return cleanString(data.accessLevelId || data.role).toLowerCase() === accessLevel.id.toLowerCase();
    }).length;
    const deletionError = accessLevelDeletionError(accessLevel, assignedAccountCount);
    if (deletionError) {
      response.status(accessLevel.system || accessLevel.admin ? 403 : 409).json({ error: deletionError });
      return;
    }

    const nextLevels = accessLevels.filter((level) => level.id !== accessLevel.id);
    await saveStaffAccessLevels(nextLevels, request.user.email);
    await synchronizeGrantDocumentAccess(nextLevels, request.user.email);
    response.json({ removed: true, accessLevelId: accessLevel.id, accessLevels: nextLevels });
  } catch (error) {
    next(error);
  }
});

router.put("/api/admin/staff-users/:staffEmail", requireAuth, async (request, response, next) => {
  try {
    const email = normalizeStaffEmail(request.params.staffEmail);
    const displayName = cleanString(request.body.displayName);
    const protectedOwner = adminEmails.has(email);
    const accessLevels = await loadStaffAccessLevels();
    const requestedLevel = accessLevelById(
      accessLevels,
      request.body.accessLevelId || request.body.role
    );

    if (!email || (allowedEmailDomain && !email.endsWith(`@${allowedEmailDomain}`))) {
      response.status(400).json({
        error: `Staff access requires an @${allowedEmailDomain} email address.`
      });
      return;
    }

    if (!requestedLevel && !protectedOwner) {
      response.status(400).json({
        error: "Choose a current access level for this account."
      });
      return;
    }

    const role = protectedOwner ? "Admin" : requestedLevel.id;
    const active = protectedOwner ? true : request.body.active !== false;
    const now = new Date().toISOString();
    const docRef = staffUsers.doc(email);
    const existing = await docRef.get();
    await docRef.set({
      email,
      displayName,
      role,
      accessLevelId: role,
      active,
      grantDocumentAccess: active && staffRoleCanAccessGrantDocuments(role, accessLevels),
      createdAt: existing.exists ? existing.data().createdAt || now : now,
      updatedAt: now,
      updatedBy: request.user.email
    }, { merge: true });

    response.json({
      user: {
        ...toStaffUser(await docRef.get(), accessLevels),
        protectedOwner
      }
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/admin/staff-users/:staffEmail/profile", requireAuth, async (request, response, next) => {
  try {
    const email = normalizeStaffEmail(request.params.staffEmail);

    if (!email || (allowedEmailDomain && !email.endsWith(`@${allowedEmailDomain}`))) {
      response.status(400).json({
        error: `Team profiles require an @${allowedEmailDomain} email address.`
      });
      return;
    }

    const docRef = staffUsers.doc(email);
    const existing = await docRef.get();
    const protectedOwner = adminEmails.has(email);
    const accessLevels = await loadStaffAccessLevels();

    if (!existing.exists && !protectedOwner) {
      response.status(404).json({
        error: "Add this person in the Access tab before creating their team profile."
      });
      return;
    }

    const current = existing.exists ? existing.data() : {};
    const now = new Date().toISOString();
    await docRef.set({
      email,
      displayName: cleanString(request.body.displayName),
      title: cleanString(request.body.title),
      phone: cleanString(request.body.phone),
      programs: cleanStaffPrograms(request.body.programs),
      role: protectedOwner
        ? "Admin"
        : normalizeStaffRole(current.accessLevelId || current.role, email, accessLevels),
      accessLevelId: protectedOwner
        ? "Admin"
        : normalizeStaffRole(current.accessLevelId || current.role, email, accessLevels),
      active: protectedOwner ? true : current.active !== false,
      grantDocumentAccess: (protectedOwner ? true : current.active !== false)
        && staffRoleCanAccessGrantDocuments(
          protectedOwner ? "Admin" : current.accessLevelId || current.role,
          accessLevels
        ),
      createdAt: current.createdAt || now,
      updatedAt: now,
      updatedBy: request.user.email
    }, { merge: true });

    response.json({
      user: {
        ...toStaffUser(await docRef.get(), accessLevels),
        protectedOwner
      }
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/admin/staff-users/:staffEmail", requireAuth, async (request, response, next) => {
  try {
    const email = normalizeStaffEmail(request.params.staffEmail);
    if (!email || (allowedEmailDomain && !email.endsWith(`@${allowedEmailDomain}`))) {
      response.status(400).json({ error: "Choose a valid SNACK staff account." });
      return;
    }
    if (adminEmails.has(email)) {
      response.status(403).json({ error: "The protected director account cannot be removed." });
      return;
    }
    if (email === request.user.email) {
      response.status(409).json({ error: "You cannot remove the account you are currently using." });
      return;
    }

    const docRef = staffUsers.doc(email);
    const existing = await docRef.get();
    if (!existing.exists) {
      response.status(404).json({ error: "That staff account could not be found." });
      return;
    }
    await docRef.delete();
    response.json({ removed: true, email });
  } catch (error) {
    next(error);
  }
});

export { accessLevelDeletionError };
export default router;
