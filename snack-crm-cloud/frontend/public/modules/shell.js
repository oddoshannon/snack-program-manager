const titledSubpageModules = new Set(["crm", "outreach", "fundraising", "marketing", "operations"]);

function cleanModulePageTitle(moduleId, moduleLabel, subpage = "", fallbackTitle = "") {
  if (moduleId === "schedule") {
    if (!subpage || subpage === "Clinic") return fallbackTitle || "Clinic Schedule";
    if (subpage === "Print Forms") return "Print Forms";
    return `${subpage} Schedule`;
  }
  if (!titledSubpageModules.has(moduleId)) return fallbackTitle || moduleLabel;
  if (!subpage || subpage === "Dashboard") return moduleLabel;
  return subpage;
}

function cleanModuleSummaryVisible(moduleId, subpage = "") {
  if (moduleId === "admin") return false;
  if (moduleId === "operations") return subpage === "Dashboard";
  if (moduleId === "marketing" && subpage === "Templates") return false;
  if (moduleId === "fundraising" && ["HRSN Billing", "Budget"].includes(subpage)) return false;
  return true;
}

function accountMenuUiState(authenticated = false, requestedOpen = false) {
  const available = Boolean(authenticated);
  const open = available && Boolean(requestedOpen);
  return {
    triggerHidden: !available,
    menuHidden: !open,
    expanded: open
  };
}

function staffPageAccessDecision({
  moduleId = "home",
  modules = [],
  financeSection = "",
  financeSections = []
} = {}) {
  const allowedModules = Array.isArray(modules) ? modules : [];
  const allowedFinanceSections = Array.isArray(financeSections) ? financeSections : [];
  if (moduleId === "home") return { allowed: true, destination: "home", financeSection: "" };

  if (!allowedModules.includes(moduleId)) {
    return {
      allowed: false,
      destination: allowedModules[0] || "home",
      financeSection: ""
    };
  }

  if (moduleId !== "fundraising") {
    return { allowed: true, destination: moduleId, financeSection: "" };
  }

  if (!allowedFinanceSections.length) {
    return {
      allowed: false,
      destination: allowedModules.find((id) => id !== "fundraising") || "home",
      financeSection: ""
    };
  }

  if (!allowedFinanceSections.includes(financeSection)) {
    return {
      allowed: false,
      destination: "fundraising",
      financeSection: allowedFinanceSections[0]
    };
  }

  return { allowed: true, destination: moduleId, financeSection };
}

function sessionCountdownLabel(totalSeconds = 0) {
  const safeSeconds = Math.max(0, Math.ceil(Number(totalSeconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export {
  accountMenuUiState,
  cleanModulePageTitle,
  cleanModuleSummaryVisible,
  sessionCountdownLabel,
  staffPageAccessDecision
};
