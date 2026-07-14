import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-storage.js";

const statusEl = document.querySelector("#status");
const messageEl = document.querySelector("#message");
const refreshButton = document.querySelector("#refresh");
const signInButton = document.querySelector("#sign-in");
const signOutButton = document.querySelector("#sign-out");
const userEl = document.querySelector("#user");
const signedOutPanel = document.querySelector("#signed-out-panel");
const printRoot = document.querySelector("#print-root");
const workflowPanel = document.querySelector("#workflow-panel");
const dashboardPanel = document.querySelector("#dashboard-panel");
const referralsPanel = document.querySelector("#referrals-panel");
const clientsPanel = document.querySelector("#clients-panel");
const referralNetworkPanel = document.querySelector("#referral-network-panel");
const outreachPanel = document.querySelector("#outreach-panel");
const fundraisingPanel = document.querySelector("#fundraising-panel");
const marketingPanel = document.querySelector("#marketing-panel");
const operationsPanel = document.querySelector("#operations-panel");
const schedulingPanel = document.querySelector("#scheduling-panel");
const navDashboardButton = document.querySelector("#nav-dashboard");
const navWorkflowButton = document.querySelector("#nav-workflow");
const navCrmButton = document.querySelector("#nav-crm");
const navOutreachButton = document.querySelector("#nav-outreach");
const navFundraisingButton = document.querySelector("#nav-fundraising");
const navMarketingButton = document.querySelector("#nav-marketing");
const navOperationsButton = document.querySelector("#nav-operations");
const navSchedulingButton = document.querySelector("#nav-scheduling");
const crmTabs = document.querySelector("#crm-tabs");
const crmTabReferralsButton = document.querySelector("#crm-tab-referrals");
const crmTabClientsButton = document.querySelector("#crm-tab-clients");
const crmTabReferralNetworkButton = document.querySelector("#crm-tab-referral-network");
const clinicSnapshotSummary = document.querySelector("#clinic-snapshot-summary");
const clinicSnapshotMetrics = document.querySelector("#clinic-snapshot-metrics");
const clinicSnapshotNoNext = document.querySelector("#clinic-snapshot-no-next");
const dashboardSummary = document.querySelector("#dashboard-summary");
const dashboardFollowups = document.querySelector("#dashboard-followups");
const dashboardNewReferrals = document.querySelector("#dashboard-new-referrals");
const dashboardScheduled = document.querySelector("#dashboard-scheduled");
const dashboardNoNext = document.querySelector("#dashboard-no-next");
const dashboardAppointmentsWeek = document.querySelector("#dashboard-appointments-week");
const dashboardAttention = document.querySelector("#dashboard-attention");
const dashboardWorkflow = document.querySelector("#dashboard-workflow");
const dashboardTitle = document.querySelector("#dashboard-title");
const adminTabSettingsButton = document.querySelector("#admin-tab-settings");
const adminTabDataToolsButton = document.querySelector("#admin-tab-data-tools");
const adminTabKpiButton = document.querySelector("#admin-tab-kpi");
const adminTabWorkPlanButton = document.querySelector("#admin-tab-work-plan");
const adminSettingsView = document.querySelector("#admin-settings-view");
const adminDataToolsView = document.querySelector("#admin-data-tools-view");
const adminKpiView = document.querySelector("#admin-kpi-view");
const adminWorkPlanView = document.querySelector("#admin-work-plan-view");
const adminSchedulingSettingsForm = document.querySelector("#admin-scheduling-settings-form");
const adminSchedulingSettingsStatus = document.querySelector("#admin-scheduling-settings-status");
const adminSchedulingSettingsSaveButton = document.querySelector("#admin-scheduling-settings-save");
const dataToolsList = document.querySelector("#data-tools-list");
const dataToolsStatusEl = document.querySelector("#data-tools-status");
const refreshDataToolsButton = document.querySelector("#refresh-data-tools");
const appointmentCsvInput = document.querySelector("#appointment-csv-input");
const fundraisingTitle = document.querySelector("#fundraising-title");
const fundraisingTabGrantsButton = document.querySelector("#fundraising-tab-grants");
const fundraisingTabSalesButton = document.querySelector("#fundraising-tab-sales");
const fundraisingTabIndividualGivingButton = document.querySelector("#fundraising-tab-individual-giving");
const fundraisingTabCorporatePartnershipsButton = document.querySelector("#fundraising-tab-corporate-partnerships");
const fundraisingTabEventsButton = document.querySelector("#fundraising-tab-events");
const fundraisingGrantsActions = document.querySelector("#fundraising-grants-actions");
const fundraisingGrantsView = document.querySelector("#fundraising-grants-view");
const fundraisingSalesView = document.querySelector("#fundraising-sales-view");
const fundraisingIndividualGivingView = document.querySelector("#fundraising-individual-giving-view");
const fundraisingCorporatePartnershipsView = document.querySelector("#fundraising-corporate-partnerships-view");
const fundraisingEventsView = document.querySelector("#fundraising-events-view");
const grantsSummary = document.querySelector("#grants-summary");
const grantFlowBoard = document.querySelector("#grant-flow-board");
const grantDeadlineList = document.querySelector("#grant-deadline-list");
const grantsList = document.querySelector("#grants-list");
const grantsStatusEl = document.querySelector("#grants-status");
const grantSearchInput = document.querySelector("#grant-search");
const newGrantButton = document.querySelector("#new-grant");
const grantOrgCard = document.querySelector("#grant-org-card");
const grantQuestionCard = document.querySelector("#grant-question-card");
const grantModal = document.querySelector("#grant-modal");
const grantDetail = document.querySelector("#grant-detail");
const grantForm = document.querySelector("#grant-form");
const grantFormTitle = document.querySelector("#grant-form-title");
const saveGrantButton = document.querySelector("#save-grant");
const cancelGrantEditButton = document.querySelector("#cancel-grant-edit");
const deleteGrantButton = document.querySelector("#delete-grant");
const newGrantQuestionButton = document.querySelector("#new-grant-question");
const grantQuestionModal = document.querySelector("#grant-question-modal");
const grantQuestionForm = document.querySelector("#grant-question-form");
const grantQuestionFormTitle = document.querySelector("#grant-question-form-title");
const saveGrantQuestionButton = document.querySelector("#save-grant-question");
const cancelGrantQuestionEditButton = document.querySelector("#cancel-grant-question-edit");
const grantQuestionList = document.querySelector("#grant-question-list");
const grantOrgForm = document.querySelector("#grant-org-form");
const saveGrantOrgButton = document.querySelector("#save-grant-org");
const kpiSummary = document.querySelector("#kpi-summary");
const kpiProgressList = document.querySelector("#kpi-progress-list");
const programKpiList = document.querySelector("#program-kpi-list");
const organizationKpiTable = document.querySelector("#organization-kpi-table");
const revenueKpiTable = document.querySelector("#revenue-kpi-table");
const workPlanSummary = document.querySelector("#work-plan-summary");
const workPlanList = document.querySelector("#work-plan-list");
const referralForm = document.querySelector("#referral-form");
const formTitle = document.querySelector("#form-title");
const saveReferralButton = document.querySelector("#save-referral");
const cancelEditButton = document.querySelector("#cancel-edit");
const newReferralButton = document.querySelector("#new-referral");
const referralsTableHead = document.querySelector("#referrals-table-head");
const referralsTableView = document.querySelector("#referrals-table-view");
const referralsList = document.querySelector("#referrals-list");
const referralFlowBoard = document.querySelector("#referral-flow-board");
const referralsViewListButton = document.querySelector("#referrals-view-list");
const referralsViewFlowButton = document.querySelector("#referrals-view-flow");
const referralsStatusEl = document.querySelector("#referrals-status");
const referralSearchInput = document.querySelector("#referral-search");
const referralColumnOptions = document.querySelector("#referral-column-options");
const importReferralsButton = document.querySelector("#import-referrals");
const referralCsvInput = document.querySelector("#referral-csv-input");
const referralSummary = document.querySelector("#referral-summary");
const referralDetail = document.querySelector("#referral-detail");
const referralModal = document.querySelector("#referral-modal");
const closeReferralModalButton = document.querySelector("#close-referral-modal");
const referralSourceInput = document.querySelector("#referral-source");
const referralEditAvatar = document.querySelector("#referral-edit-avatar");
const referralEditLessonDots = document.querySelector("#referral-edit-lesson-dots");
const referralEditNotesPreview = document.querySelector("#referral-edit-notes-preview");
const referralEditSiblingSummary = document.querySelector("#referral-edit-sibling-summary");
const referralSourceDisplay = document.querySelector("#referral-source-display");
const referralProviderLinkEditor = document.querySelector("#referral-provider-link-editor");
const referralSourceOptions = document.querySelector("#referral-source-options");
const referralImportModal = document.querySelector("#referral-import-modal");
const referralImportDetail = document.querySelector("#referral-import-detail");
const closeReferralImportButton = document.querySelector("#close-referral-import");
const confirmReferralImportButton = document.querySelector("#confirm-referral-import");
const clientsList = document.querySelector("#clients-list");
const clientsTableView = document.querySelector("#clients-table-view");
const clientFlowBoard = document.querySelector("#client-flow-board");
const clientsViewListButton = document.querySelector("#clients-view-list");
const clientsViewFlowButton = document.querySelector("#clients-view-flow");
const clientsTableHead = document.querySelector("#clients-table-head");
const clientsStatusEl = document.querySelector("#clients-status");
const clientSearchInput = document.querySelector("#client-search");
const clientColumnOptions = document.querySelector("#client-column-options");
const importClientsButton = document.querySelector("#import-clients");
const clientCsvInput = document.querySelector("#client-csv-input");
const newClientButton = document.querySelector("#new-client");
const clientSummary = document.querySelector("#client-summary");
const clientModal = document.querySelector("#client-modal");
const clientDetail = document.querySelector("#client-detail");
const clientForm = document.querySelector("#client-form");
const clientFormTitle = document.querySelector("#client-form-title");
const saveClientButton = document.querySelector("#save-client");
const cancelClientEditButton = document.querySelector("#cancel-client-edit");
const clientEditAvatar = document.querySelector("#client-edit-avatar");
const clientEditLessonDots = document.querySelector("#client-edit-lesson-dots");
const clientEditGoalsList = document.querySelector("#client-edit-goals-list");
const clientEditSiblingSummary = document.querySelector("#client-edit-sibling-summary");
const clientReferralSourceInput = document.querySelector("#client-referral-source");
const clientReferralSourceDisplay = document.querySelector("#client-referral-source-display");
const clientProviderLinkEditor = document.querySelector("#client-provider-link-editor");
const clientImportModal = document.querySelector("#client-import-modal");
const clientImportDetail = document.querySelector("#client-import-detail");
const closeClientImportButton = document.querySelector("#close-client-import");
const confirmClientImportButton = document.querySelector("#confirm-client-import");
const networkList = document.querySelector("#network-list");
const networkStatusEl = document.querySelector("#network-status");
const networkSearchInput = document.querySelector("#network-search");
const importNetworkButton = document.querySelector("#import-network");
const networkCsvInput = document.querySelector("#network-csv-input");
const newNetworkEntryButton = document.querySelector("#new-network-entry");
const networkModal = document.querySelector("#network-modal");
const networkDetail = document.querySelector("#network-detail");
const networkForm = document.querySelector("#network-form");
const networkFormTitle = document.querySelector("#network-form-title");
const saveNetworkEntryButton = document.querySelector("#save-network-entry");
const cancelNetworkEditButton = document.querySelector("#cancel-network-edit");
const networkImportModal = document.querySelector("#network-import-modal");
const networkImportDetail = document.querySelector("#network-import-detail");
const closeNetworkImportButton = document.querySelector("#close-network-import");
const confirmNetworkImportButton = document.querySelector("#confirm-network-import");
const appointmentImportModal = document.querySelector("#appointment-import-modal");
const appointmentImportDetail = document.querySelector("#appointment-import-detail");
const closeAppointmentImportButton = document.querySelector("#close-appointment-import");
const confirmAppointmentImportButton = document.querySelector("#confirm-appointment-import");
const outreachList = document.querySelector("#outreach-list");
const outreachSummary = document.querySelector("#outreach-summary");
const outreachEventFlowBoard = document.querySelector("#outreach-event-flow-board");
const outreachStatusEl = document.querySelector("#outreach-status");
const outreachSearchInput = document.querySelector("#outreach-search");
const outreachDashboardView = document.querySelector("#outreach-dashboard-view");
const outreachEventsView = document.querySelector("#outreach-events-view");
const outreachContactsView = document.querySelector("#outreach-contacts-view");
const outreachTabDashboardButton = document.querySelector("#outreach-tab-dashboard");
const outreachTabEventsButton = document.querySelector("#outreach-tab-events");
const outreachTabContactsButton = document.querySelector("#outreach-tab-contacts");
const outreachUpcomingList = document.querySelector("#outreach-upcoming-list");
const outreachContactFollowupList = document.querySelector("#outreach-contact-followup-list");
const newOutreachEventButton = document.querySelector("#new-outreach-event");
const newOutreachContactButton = document.querySelector("#new-outreach-contact");
const outreachModal = document.querySelector("#outreach-modal");
const outreachDetail = document.querySelector("#outreach-detail");
const outreachForm = document.querySelector("#outreach-form");
const outreachFormTitle = document.querySelector("#outreach-form-title");
const saveOutreachEventButton = document.querySelector("#save-outreach-event");
const cancelOutreachEditButton = document.querySelector("#cancel-outreach-edit");
const outreachContactList = document.querySelector("#outreach-contact-list");
const outreachContactStatusEl = document.querySelector("#outreach-contact-status");
const outreachContactSearchInput = document.querySelector("#outreach-contact-search");
const outreachContactModal = document.querySelector("#outreach-contact-modal");
const outreachContactDetail = document.querySelector("#outreach-contact-detail");
const outreachContactForm = document.querySelector("#outreach-contact-form");
const outreachContactFormTitle = document.querySelector("#outreach-contact-form-title");
const outreachContactEventSelect = document.querySelector("#outreach-contact-event-id");
const saveOutreachContactButton = document.querySelector("#save-outreach-contact");
const cancelOutreachContactEditButton = document.querySelector("#cancel-outreach-contact-edit");
const appointmentSummary = document.querySelector("#appointment-summary");
const appointmentsList = document.querySelector("#appointments-list");
const appointmentsStatusEl = document.querySelector("#appointments-status");
const appointmentSearchInput = document.querySelector("#appointment-search");
const appointmentDateFilterSelect = document.querySelector("#appointment-date-filter");
const appointmentStatusFilterSelect = document.querySelector("#appointment-status-filter");
const newAppointmentButton = document.querySelector("#new-appointment");
const printTodayScheduleButton = document.querySelector("#print-today-schedule");
const printPrepSheetsButton = document.querySelector("#print-prep-sheets");
const printNoteSheetsButton = document.querySelector("#print-note-sheets");
const schedulingV2Preview = document.querySelector("#scheduling-v2-preview");
const appointmentModal = document.querySelector("#appointment-modal");
const appointmentDetail = document.querySelector("#appointment-detail");
const appointmentDetailTitle = document.querySelector("#appointment-detail-title");
const appointmentDetailBody = document.querySelector("#appointment-detail-body");
const editAppointmentDetailButton = document.querySelector("#edit-appointment-detail");
const completeAppointmentDetailButton = document.querySelector("#complete-appointment-detail");
const deleteAppointmentDetailButton = document.querySelector("#delete-appointment-detail");
const closeAppointmentDetailButton = document.querySelector("#close-appointment-detail");
const appointmentForm = document.querySelector("#appointment-form");
const appointmentFormTitle = document.querySelector("#appointment-form-title");
const appointmentFormStatusEl = document.querySelector("#appointment-form-status");
const appointmentClientSelect = document.querySelector("#appointment-client-id");
const appointmentClientIdsInput = document.querySelector("#appointment-client-ids");
const appointmentClientSearchInput = document.querySelector("#appointment-client-search");
const appointmentClientOptions = document.querySelector("#appointment-client-options");
const addAppointmentClientButton = document.querySelector("#add-appointment-client");
const appointmentClientSelected = document.querySelector("#appointment-client-selected");
const appointmentTimeInput = document.querySelector("#appointment-time");
const appointmentTimeOptions = document.querySelector("#appointment-time-options");
const saveAppointmentButton = document.querySelector("#save-appointment");
const deleteAppointmentButton = document.querySelector("#delete-appointment");
const cancelAppointmentEditButton = document.querySelector("#cancel-appointment-edit");
const appointmentCompleteModal = document.querySelector("#appointment-complete-modal");
const appointmentCompleteForm = document.querySelector("#appointment-complete-form");
const appointmentCompleteTitle = document.querySelector("#appointment-complete-title");
const appointmentCompleteSummary = document.querySelector("#appointment-complete-summary");
const completionNextLessonInput = document.querySelector("#completion-next-lesson");
const completionNextGoalInput = document.querySelector("#completion-next-goal");
const completionScheduleNextInput = document.querySelector("#completion-schedule-next");
const completionNextDateInput = document.querySelector("#completion-next-date");
const completionNextTimeInput = document.querySelector("#completion-next-time");
const completionNextStaffInput = document.querySelector("#completion-next-staff");
const completionNextNotesInput = document.querySelector("#completion-next-notes");
const saveAppointmentCompletionButton = document.querySelector("#save-appointment-completion");
const cancelAppointmentCompletionButton = document.querySelector("#cancel-appointment-completion");
const appointmentCheckInModal = document.querySelector("#appointment-check-in-modal");
const appointmentCheckInForm = document.querySelector("#appointment-check-in-form");
const appointmentCheckInTitle = document.querySelector("#appointment-check-in-title");
const appointmentCheckInSummary = document.querySelector("#appointment-check-in-summary");
const saveAppointmentCheckInButton = document.querySelector("#save-appointment-check-in");
const closeAppointmentCheckInButtons = document.querySelectorAll("[data-close-appointment-check-in]");
const flowArchiveModal = document.querySelector("#flow-archive-modal");
const flowArchiveEyebrow = document.querySelector("#flow-archive-eyebrow");
const flowArchiveTitle = document.querySelector("#flow-archive-title");
const flowArchiveDescription = document.querySelector("#flow-archive-description");
const flowArchiveList = document.querySelector("#flow-archive-list");
const closeFlowArchiveButton = document.querySelector("#close-flow-archive");
const workflowTaskSummary = document.querySelector("#workflow-task-summary");
const workflowTaskList = document.querySelector("#workflow-task-list");
const tasksStatusEl = document.querySelector("#tasks-status");
const startDayButton = document.querySelector("#start-day");
const newTaskButton = document.querySelector("#new-task");
const taskModal = document.querySelector("#task-modal");
const taskForm = document.querySelector("#task-form");
const taskFormTitle = document.querySelector("#task-form-title");
const taskRelatedTypeSelect = document.querySelector("#task-related-type");
const taskRelatedSearchInput = document.querySelector("#task-related-search");
const taskClientIdInput = document.querySelector("#task-client-id");
const taskReferralIdInput = document.querySelector("#task-referral-id");
const taskAppointmentIdInput = document.querySelector("#task-appointment-id");
const taskRelatedOptions = document.querySelector("#task-related-options");
const openTaskProfileButton = document.querySelector("#open-task-profile");
const saveTaskButton = document.querySelector("#save-task");
const cancelTaskEditButton = document.querySelector("#cancel-task-edit");
const deleteTaskButton = document.querySelector("#delete-task");
const taskUndoToast = document.querySelector("#task-undo-toast");
const taskUndoMessage = document.querySelector("#task-undo-message");
const taskUndoButton = document.querySelector("#task-undo-button");
const activityLogModal = document.querySelector("#activity-log-modal");
const activityLogForm = document.querySelector("#activity-log-form");
const activityLogTitle = document.querySelector("#activity-log-title");
const activityLogRelatedTypeInput = document.querySelector("#activity-log-related-type");
const activityLogRelatedIdInput = document.querySelector("#activity-log-related-id");
const activityLogRelatedNameInput = document.querySelector("#activity-log-related-name");
const activityLogTypeInput = document.querySelector("#activity-log-type");
const activityLogTitleField = document.querySelector("#activity-log-title-field");
const activityLogDirectionSelect = document.querySelector("#activity-log-direction");
const activityLogResultSelect = document.querySelector("#activity-log-result");
const activityLogDateInput = document.querySelector("#activity-log-date");
const activityLogTimeInput = document.querySelector("#activity-log-time");
const saveActivityLogButton = document.querySelector("#save-activity-log");
const cancelActivityLogButton = document.querySelector("#cancel-activity-log");
const siblingModal = document.querySelector("#sibling-modal");
const siblingForm = document.querySelector("#sibling-form");
const siblingModuleInput = document.querySelector("#sibling-module");
const siblingRecordIdInput = document.querySelector("#sibling-record-id");
const siblingSearchInput = document.querySelector("#sibling-search");
const siblingOptions = document.querySelector("#sibling-options");
const saveSiblingLinkButton = document.querySelector("#save-sibling-link");
const cancelSiblingLinkButton = document.querySelector("#cancel-sibling-link");

const app = initializeApp(window.SNACK_CONFIG.FIREBASE_CONFIG);
const auth = getAuth(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();
const defaultAppointmentDurationMinutes = 30;
const defaultSchedulingSettings = Object.freeze({
  officeStartTime: "13:00",
  officeEndTime: "18:00",
  bookableStartTime: "13:30",
  bookableEndTime: "18:00",
  weekdays: [2, 3, 4],
  defaultDurationMinutes: defaultAppointmentDurationMinutes,
  slotIntervalMinutes: 15
});
let schedulingOfficeStartMinutes = 13 * 60;
let schedulingOfficeEndMinutes = 18 * 60;
let schedulingBookableStartMinutes = 13 * 60 + 30;
let schedulingBookableEndMinutes = schedulingOfficeEndMinutes;
let schedulingStartMinutes = schedulingOfficeStartMinutes;
let schedulingEndMinutes = schedulingOfficeEndMinutes;
let schedulingDefaultDurationMinutes = defaultSchedulingSettings.defaultDurationMinutes;
let schedulingSlotIntervalMinutes = 15;
const taskCompleteSoundUrl = "./todoist-complete.m4a?v=20260603-prep-audio";
const taskCompleteSoundDurationMs = 1600;
const legacyStatusMap = {
  new: "New",
  contacted: "Texted",
  scheduled: "Scheduled",
  closed: "Closed / No Further Outreach",
  "Parent Will Call Back": "Caregiver Will Call Back",
  "Parent will Call Back": "Caregiver Will Call Back"
};
const statuses = [
  "New",
  "Texted",
  "Left Voicemail",
  "Emailed",
  "Requested Call Back",
  "Caregiver Will Call Back",
  "Scheduled",
  "Not Interested",
  "Closed / No Further Outreach"
];
const summaryGroups = [
  { key: "all", label: "Total", statuses },
  { key: "new", label: "New", statuses: ["New"] },
  {
    key: "follow-up",
    label: "Follow Up",
    statuses: ["Texted", "Left Voicemail", "Emailed", "Requested Call Back"]
  },
  { key: "scheduled", label: "Scheduled", statuses: ["Scheduled"] },
  { key: "closed", label: "Closed", statuses: ["Not Interested", "Closed / No Further Outreach"] }
];
const referralFlowColumns = [
  { key: "new", label: "New Referrals", statuses: ["New"], accent: "var(--brand-red)" },
  {
    key: "contacted",
    label: "In Contact",
    statuses: ["Texted", "Left Voicemail", "Emailed", "Requested Call Back"],
    accent: "var(--brand-green)"
  },
  { key: "scheduled", label: "Scheduled", statuses: ["Scheduled"], accent: "var(--brand-blue)" },
  { key: "watch", label: "Watch List", statuses: ["Caregiver Will Call Back"], accent: "var(--brand-purple)", emptyText: "Waiting-on-family referrals land here." },
  {
    key: "closed",
    label: "Closed Referrals Archive",
    statuses: ["Not Interested", "Closed / No Further Outreach"],
    accent: "var(--brand-blue)",
    archive: true,
    countLabel: "closed"
  }
];
const clientStatuses = [
  "Scheduled",
  "Active",
  "Needs Reschedule",
  "Needs Language Support",
  "Waiting on Family",
  "Graduated",
  "Inactive",
  "Closed"
];
const appointmentStatuses = ["Scheduled", "Completed", "No-show", "Rescheduled", "Blocked", "Canceled"];
const setmoreAppointmentServices = new Map([
  ["enrollment appointment", "Enrollment"],
  ["sibling enrollment appointment", "Enrollment"],
  ["cita de inscripción en español", "Enrollment"],
  ["nutrition education appointment", "Nutrition Education"],
  ["sibling nutrition education appointment", "Nutrition Education"],
  ["cita de educación nutricional en español", "Nutrition Education"],
  ["virtual nutrition education appointment", "Nutrition Education"]
]);
const appointmentLessonKeywords = [
  { value: "Check In", patterns: [/\bcheck\s*in\b/i] },
  { value: "7", patterns: [/\blesson\s*7\b/i, /\bhealthy\s+habits?\b/i, /\bHH\b/] },
  { value: "6", patterns: [/\blesson\s*6\b/i, /\bmindful\s+eating\b/i, /\bME\b/] },
  { value: "5", patterns: [/\blesson\s*5\b/i, /\bmicronutrients?\b/i, /\bmicros?\b/i] },
  { value: "4", patterns: [/\blesson\s*4\b/i, /\bmacronutrients?\b/i, /\bmacros?\b/i, /\bmacro\b/i] },
  { value: "3", patterns: [/\blesson\s*3\b/i, /\bfood\s+groups?\b/i, /\bFG\b/] },
  { value: "2", patterns: [/\blesson\s*2\b/i, /\bsugar\b/i] },
  { value: "1", patterns: [/\blesson\s*1\b/i, /\bnutrient\s+density\b/i, /\bnutrient\s+dense\b/i, /\bND\b/] }
];
const appointmentLessonTitles = {
  1: "Nutrient Density",
  2: "Sugar",
  3: "Food Groups",
  4: "Macronutrients",
  5: "Micronutrients",
  6: "Mindful Eating",
  7: "Healthy Habits"
};
const appointmentCheckInDefaults = {
  caregiverMood: "Good",
  confidence: "High",
  participation: "Engaged",
  barriers: "None"
};
const appointmentWrapUpOptions = {
  caregiverMood: ["Good", "Okay", "Stressed", "Concerned"],
  confidence: ["High", "Medium", "Low"],
  participation: ["Engaged", "Somewhat Engaged", "Quiet", "Not Engaged"],
  barriers: ["None", "Transportation", "Schedule", "Food access", "Language", "Caregiver capacity", "Other"]
};
const defaultSchedulingStaffMembers = ["Cynthia Esparza", "Shannon Oddo"];
const schedulingStaffMembersStorageKey = "snackSchedulingStaffMembers";
const inactiveSchedulingStaffMembers = new Set(["Paige Spady"]);
let schedulingV2ClinicWeekdays = [...defaultSchedulingSettings.weekdays];
let schedulingV2ClinicWeekdaySet = new Set(schedulingV2ClinicWeekdays);
const importedMonthNames = new Map([
  ["jan", "01"],
  ["january", "01"],
  ["feb", "02"],
  ["february", "02"],
  ["mar", "03"],
  ["march", "03"],
  ["apr", "04"],
  ["april", "04"],
  ["may", "05"],
  ["jun", "06"],
  ["june", "06"],
  ["jul", "07"],
  ["july", "07"],
  ["aug", "08"],
  ["august", "08"],
  ["sep", "09"],
  ["sept", "09"],
  ["september", "09"],
  ["oct", "10"],
  ["october", "10"],
  ["nov", "11"],
  ["november", "11"],
  ["dec", "12"],
  ["december", "12"]
]);
const clientSummaryGroups = [
  { key: "all", label: "Total", statuses: clientStatuses },
  { key: "scheduled", label: "Scheduled", statuses: ["Scheduled"] },
  { key: "active", label: "Active", statuses: ["Active", "Needs Reschedule"] },
  { key: "follow-up", label: "Follow Up", statuses: ["Needs Reschedule", "Needs Language Support"] },
  { key: "graduated", label: "Graduated", statuses: ["Graduated"] },
  { key: "closed", label: "Closed", statuses: ["Inactive", "Closed"] }
];
const clientFlowColumns = [
  { key: "reschedule", label: "Needs Reschedule", statuses: ["Needs Reschedule"], accent: "var(--brand-red)" },
  { key: "scheduled", label: "Scheduled", statuses: ["Scheduled"], accent: "var(--brand-green)" },
  { key: "progress", label: "Appts In Progress", statuses: ["Active"], accent: "var(--brand-blue)" },
  { key: "watch", label: "Watch List", statuses: ["Needs Language Support", "Waiting on Family"], accent: "var(--brand-purple)" },
  {
    key: "graduated",
    label: "Graduated Clients Archive",
    statuses: ["Graduated"],
    accent: "var(--brand-yellow)",
    archive: true,
    countLabel: "graduated"
  },
  {
    key: "closed",
    label: "Closed Clients Archive",
    statuses: ["Inactive", "Closed"],
    accent: "var(--brand-blue)",
    archive: true,
    countLabel: "closed"
  }
];
const taskFlowColumns = [
  { key: "calls", label: "Calls", color: "var(--brand-red)" },
  { key: "texts", label: "Texts", color: "var(--brand-green)" },
  { key: "forms", label: "Forms", color: "var(--brand-blue)" },
  { key: "tasks", label: "Tasks", color: "var(--brand-purple)" }
];
const grantFlowColumns = [
  { key: "upcoming", label: "Upcoming Grants", statuses: ["Researching", "Planning"], accent: "var(--brand-red)" },
  { key: "in-progress", label: "In Progress", statuses: ["In Progress"], accent: "var(--brand-green)" },
  { key: "submitted", label: "Submitted", statuses: ["Submitted"], accent: "var(--brand-blue)" },
  { key: "awarded", label: "Awarded", statuses: ["Awarded", "Reporting"], accent: "var(--brand-purple)" },
  {
    key: "closed",
    label: "Closed Grants Archive",
    statuses: ["Not A Good Fit", "Declined", "Closed"],
    accent: "var(--brand-blue)",
    archive: true,
    countLabel: "closed"
  }
];
const grantStatuses = ["Researching", "Planning", "In Progress", "Submitted", "Awarded", "Reporting", "Not A Good Fit", "Declined", "Closed"];
const outreachEventFlowColumns = [
  { key: "upcoming", label: "Upcoming Events", statuses: ["Scheduled", "Planning"], accent: "var(--brand-red)" },
  { key: "in-progress", label: "In Progress", statuses: ["In Progress"], accent: "var(--brand-green)" },
  { key: "completed", label: "Completed", statuses: ["Completed"], accent: "var(--brand-blue)" },
  { key: "follow-up", label: "Follow Up", statuses: ["Follow Up"], accent: "var(--brand-purple)" },
  {
    key: "closed",
    label: "Closed Events Archive",
    statuses: ["Canceled", "Archived"],
    accent: "var(--brand-blue)",
    archive: true,
    countLabel: "closed"
  }
];
const outreachEventStatuses = ["Scheduled", "Planning", "In Progress", "Completed", "Follow Up", "Canceled", "Archived"];
const organizationKpiRows = [
  { key: "clinicClients", label: "# Clinic Clients", baseline2025: "88", target2026: "90", q2Goal: "45", target2027: "143", target2028: "185" },
  { key: "programGraduates", label: "# Program Graduates", baseline2025: "28", target2026: "45", q2Goal: "23" },
  { key: "appointments", label: "# Appointments", baseline2025: "244", target2026: "400", q2Goal: "200", target2027: "420", target2028: "700" },
  { key: "spanishClients", label: "Spanish-Speaking Clients", baseline2025: "11", target2026: "15", q2Goal: "4", target2027: "25", target2028: "35" },
  { key: "retentionRate", label: "Retention Rate (%)", baseline2025: "32%", target2026: "50%", q2Goal: "50%", target2027: "60%", target2028: "70%" },
  { key: "noShowRate", label: "No Show Rate (%)", baseline2025: "18%", target2026: "15%", q2Goal: "15%", target2027: "12%", target2028: "10%", lowerIsBetter: true },
  { key: "classClients", label: "# Class Clients", baseline2025: "32", target2026: "120", q2Goal: "60" },
  { key: "classes", label: "# Classes", baseline2025: "10", target2026: "11", q2Goal: "5" },
  { key: "schoolClients", label: "# School Clients", baseline2025: "125", target2026: "125", q2Goal: "0", target2027: "250", target2028: "250" },
  { key: "schoolPartnerships", label: "School Partnerships", baseline2025: "1", target2026: "1", q2Goal: "1", target2027: "2", target2028: "2" }
];
const revenueKpiRows = [
  { key: "toolkitRevenue", label: "Toolkit Revenue ($)", baseline2025: "$0", target2026: "$1,000", actual2026: "$0", q2Goal: "$0", target2027: "$2,000", target2028: "$3,000" },
  { key: "workbookRoyalties", label: "Workbook Royalties ($)", baseline2025: "$181", target2026: "$600", actual2026: "$648", q2Goal: "$300", target2027: "$1,200", target2028: "$2,000" },
  { key: "sponsorsDonations", label: "Sponsors / Donations ($)", baseline2025: "$3,200", target2026: "$4,500", actual2026: "$1,800", q2Goal: "$2,200", target2027: "$6,000", target2028: "$8,000" },
  { key: "grantsRevenue", label: "Grants ($)", baseline2025: "$85,000", target2026: "$90,000", actual2026: "$1,800", q2Goal: "$45,000", target2027: "$100,000", target2028: "$110,000" },
  { key: "hrsnRevenue", label: "HRSN Revenue ($)", baseline2025: "$0", target2026: "$1,000", actual2026: "$0", q2Goal: "$500", target2027: "$3,000", target2028: "$5,000" },
  { key: "merchRevenue", label: "Merch Revenue ($)", baseline2025: "$0", target2026: "$800", actual2026: "$0", q2Goal: "$400", target2027: "$1,200", target2028: "$2,000" },
  { key: "totalRevenue", label: "Total Revenue ($)", baseline2025: "$88,381", target2026: "$97,900", actual2026: "$4,248", q2Goal: "$48,400", target2027: "$113,400", target2028: "$130,000" }
];
const programKpiDrafts = [
  "% clients meeting vegetable recommendation",
  "% clients meeting fruit recommendation",
  "% clients meeting whole grain recommendation",
  "% clients meeting protein recommendation",
  "Self-reported goal achievement",
  "Increase nutrition knowledge",
  "% clients retaining knowledge",
  "% clients that report positive changes",
  "Quality of life metrics"
];
const workPlanItems = [
  { quarter: "Q1", action: "Hire bilingual nutrition educator", status: "Complete" },
  { quarter: "Q1", action: "Map new workflows + create SOPs", status: "Complete" },
  { quarter: "Q1", action: "Submit grant applications", status: "Complete" },
  { quarter: "Q1", action: "Begin school outreach", status: "Complete" },
  { quarter: "Q1", action: "Create and send retention survey", status: "Complete" },
  { quarter: "Q1", action: "Conduct retention focus group #1", status: "DNF" },
  { quarter: "Q1", action: "Nutrition Summit event planning", status: "Complete" },
  { quarter: "Q1", action: "Launch updated referral workflow", status: "DNF" },
  { quarter: "Q2", action: "Analyze retention survey and focus group results", status: "Complete" },
  { quarter: "Q2", action: "Begin website SEO updates", status: "Not Started" },
  { quarter: "Q2", action: "Begin Amazon listing review", status: "Not Started" },
  { quarter: "Q2", action: "Begin toolkit development", status: "In Progress" },
  { quarter: "Q2", action: "Open BottleDrop account", status: "Complete" },
  { quarter: "Q2", action: "Launch dropship merch", status: "In Progress" },
  { quarter: "Q2", action: "Launch 1 school partnership and classroom instruction", status: "Complete" },
  { quarter: "Q2", action: "Set up advertising accounts", status: "Not Started" },
  { quarter: "Q2", action: "Prepare marketing toolkit", status: "In Progress" },
  { quarter: "Q2", action: "Begin planning fundraising event", status: "Not Started" },
  { quarter: "Q2", action: "Hold Nutrition Summit", status: "Complete" },
  { quarter: "Q2", action: "Submit grant applications", status: "Complete" },
  { quarter: "Q3", action: "Launch Curriculum Toolkit", status: "Not Started" },
  { quarter: "Q3", action: "Start Amazon optimization + run workbook ads", status: "Not Started" },
  { quarter: "Q3", action: "Launch digital ads for toolkit", status: "Not Started" },
  { quarter: "Q3", action: "Begin planning Giving Tuesday", status: "Not Started" },
  { quarter: "Q3", action: "Submit grant applications", status: "Not Started" },
  { quarter: "Q4", action: "Run Giving Tuesday donor campaign", status: "Not Started" },
  { quarter: "Q4", action: "Hold new annual SNACK fundraising event", status: "Not Started" },
  { quarter: "Q4", action: "Complete year end review, including retention", status: "Not Started" },
  { quarter: "Q4", action: "Update toolkit based on feedback", status: "Not Started" },
  { quarter: "Q4", action: "Submit grant applications", status: "Not Started" }
];
const zohoClientStatusMap = {
  "Appts in Progress": "Active",
  Graduated: "Graduated",
  Inactive: "Inactive",
  Interpreter: "Needs Language Support",
  "On the Way Out": "Inactive",
  "Parent Will Call When Ready": "Waiting on Family",
  "Priority Reschedule": "Needs Reschedule",
  Reschedule: "Needs Reschedule",
  Scheduled: "Scheduled",
  Sunrise: "Waiting on Family"
};
const clientStatusGroupColors = {
  Scheduled: "scheduled",
  Active: "progress",
  "Needs Reschedule": "reschedule",
  "Needs Language Support": "watch",
  "Waiting on Family": "watch",
  Graduated: "graduated",
  Inactive: "closed",
  Closed: "closed"
};
const tableColumns = {
  referrals: [
    { key: "status", label: "Status", width: 150, render: (referral) => statusBadge(referral.status) },
    { key: "recentContact", label: "Recent Contact", width: 150, render: (referral) => formatListDate(referral.mostRecentContactDate), muted: true },
    { key: "name", label: "Name", width: 190, render: referralName, strong: true },
    { key: "phone", label: "Phone", width: 150, render: (referral) => formatPhone(referral.phone), muted: true },
    { key: "language", label: "Language", width: 130, render: (referral) => referral.preferredLanguage || "" },
    { key: "caregiver", label: "Caregiver", width: 180, render: (referral) => referral.parentName || "", muted: true },
    { key: "email", label: "Email", width: 230, render: (referral) => referral.email || "", muted: true }
  ],
  clients: [
    { key: "status", label: "Status", width: 150, render: (client) => clientStatusBadge(client.status || "Scheduled") },
    { key: "recentContact", label: "Recent Contact", width: 150, render: (client) => formatListDate(client.mostRecentContactDate), muted: true },
    { key: "lastAppointment", label: "Graduation Date", width: 160, render: (client) => formatListDate(client.lastAppointmentDate), muted: true },
    { key: "name", label: "Client Name", width: 190, render: clientName, strong: true },
    { key: "phone", label: "Phone", width: 150, render: (client) => formatPhone(client.phone), muted: true },
    { key: "language", label: "Language", width: 130, render: (client) => client.preferredLanguage || "" },
    { key: "caregiver", label: "Caregiver", width: 180, render: (client) => client.parentName || "", muted: true },
    { key: "email", label: "Email", width: 230, render: (client) => client.email || "", muted: true }
  ]
};
const clientCsvFieldMappings = [
  { key: "firstName", label: "Child First Name", source: "First Name", required: true },
  { key: "lastName", label: "Child Last Name", source: "Last Name", required: true },
  { key: "parentName", label: "Caregiver", source: "Parent Name", required: true },
  { key: "phone", label: "Phone", source: "Mobile / Home Phone", required: true },
  { key: "email", label: "Email", source: "Email" },
  { key: "dateOfBirth", label: "Date of Birth", source: "Date of Birth" },
  { key: "preferredLanguage", label: "Preferred Language", source: "Preferred Language", required: true },
  { key: "status", label: "Status", source: "Status" },
  { key: "referralSource", label: "Referral Source", source: "Referring Provider" },
  { key: "referralDate", label: "Referral Date", source: "Referral Date" },
  { key: "firstContactDate", label: "First Contact Date", source: "First Contact Date" },
  { key: "mostRecentContactDate", label: "Most Recent Contact Date", source: "Most Recent Contact Date" },
  { key: "firstAppointmentDate", label: "First Appointment Date", source: "First Appt Date" },
  { key: "lastAppointmentDate", label: "Graduation Date", source: "Last Appt Date" },
  { key: "assessmentScore", label: "Assessment Score", source: "Assessment Score" },
  { key: "willingnessScore", label: "Willingness Score", source: "Willingness Score" },
  { key: "gender", label: "Gender", source: "Gender" },
  { key: "ycco", label: "YCCO", source: "YCCO" },
  { key: "hrsn", label: "HRSN", source: "HRSN" },
  { key: "emailOptOut", label: "Email Opt Out", source: "Email Opt Out" },
  { key: "addressStreet", label: "Street Address", source: "Mailing Street" },
  { key: "addressCity", label: "City", source: "Mailing City" },
  { key: "addressState", label: "State", source: "Mailing State" },
  { key: "addressZip", label: "Zip Code", source: "Mailing Zip" },
  { key: "notes", label: "Notes", source: "Note" },
  { key: "zohoRecordId", label: "Zoho Record ID", source: "Record Id" }
];
const referralCsvFieldMappings = [
  { key: "firstName", label: "Child First Name", source: "First Name", required: true },
  { key: "lastName", label: "Child Last Name", source: "Last Name", required: true },
  { key: "parentName", label: "Caregiver", source: "Parent Name", required: true },
  { key: "phone", label: "Phone", source: "Mobile / Home Phone / Phone", required: true },
  { key: "email", label: "Email", source: "Email" },
  { key: "dateOfBirth", label: "Date of Birth", source: "Date of Birth" },
  { key: "preferredLanguage", label: "Preferred Language", source: "Preferred Language", required: true },
  { key: "status", label: "Status", source: "Referral Status / Contacted? / Status" },
  { key: "referralType", label: "Referral Type", source: "Referral CSV or Assessment CSV", required: true },
  { key: "referralSource", label: "Referral Source", source: "Referring Provider" },
  { key: "referralDate", label: "Referral Date", source: "Referral Date" },
  { key: "firstContactDate", label: "First Contact Date", source: "First Contact Date" },
  { key: "mostRecentContactDate", label: "Most Recent Contact Date", source: "Most Recent Contact Date" },
  { key: "firstAppointmentDate", label: "First Appointment Date", source: "First Appt Date" },
  { key: "lastAppointmentDate", label: "Graduation Date", source: "Last Appt Date" },
  { key: "assessmentScore", label: "Assessment Score", source: "Assessment Score" },
  { key: "willingnessScore", label: "Willingness Score", source: "Willingness Score" },
  { key: "gender", label: "Gender", source: "Gender" },
  { key: "ycco", label: "YCCO", source: "YCCO" },
  { key: "hrsn", label: "HRSN", source: "HRSN" },
  { key: "emailOptOut", label: "Email Opt Out", source: "Email Opt Out" },
  { key: "addressStreet", label: "Street Address", source: "Street" },
  { key: "addressCity", label: "City", source: "City" },
  { key: "addressState", label: "State", source: "State" },
  { key: "addressZip", label: "Zip Code", source: "Zip Code" },
  { key: "notes", label: "Notes", source: "Note" },
  { key: "zohoRecordId", label: "Zoho Record ID", source: "Record Id" }
];
const tableHeads = {
  referrals: referralsTableHead,
  clients: clientsTableHead
};
const tableLists = {
  referrals: referralsList,
  clients: clientsList
};
const columnOptionContainers = {
  referrals: referralColumnOptions,
  clients: clientColumnOptions
};
const adminDeleteConfirmationPhrase = "DELETE TEST DATA";
const adminDataToolDefinitions = [
  {
    key: "referrals",
    label: "Referrals",
    detail: "CRM referrals",
    accent: "var(--brand-red)",
    getRecords: () => loadedReferrals,
    onImport: () => referralCsvInput.click()
  },
  {
    key: "clients",
    label: "Clients",
    detail: "Client profiles",
    accent: "var(--brand-orange)",
    getRecords: () => loadedClients,
    onImport: () => clientCsvInput.click()
  },
  {
    key: "referral-network",
    label: "Referral Network",
    detail: "Organizations and providers",
    accent: "var(--brand-yellow)",
    getRecords: () => loadedNetworkEntries,
    onImport: () => networkCsvInput.click()
  },
  {
    key: "appointments",
    label: "Appointments",
    detail: "Schedule records",
    accent: "var(--brand-green)",
    getRecords: () => loadedAppointments,
    onImport: () => appointmentCsvInput.click()
  },
  {
    key: "tasks",
    label: "Tasks",
    detail: "Workflow queue",
    accent: "var(--brand-teal)",
    getRecords: () => loadedTasks
  },
  {
    key: "activity-logs",
    label: "Activity Logs",
    detail: "Calls, texts, and notes",
    accent: "var(--brand-blue)",
    getRecords: () => loadedActivityLogs
  }
];

let currentUser = null;
let editingReferralId = null;
let selectedReferralId = null;
let selectedClientId = null;
let editingClientId = null;
let selectedNetworkEntryId = null;
let editingNetworkEntryId = null;
let editingNetworkProviderId = null;
let selectedOutreachEventId = null;
let editingOutreachEventId = null;
let selectedOutreachContactId = null;
let editingOutreachContactId = null;
let selectedAppointmentId = null;
let editingAppointmentId = null;
let completingAppointmentId = null;
let checkInAppointmentId = null;
let appointmentCompletionMode = "complete";
let visibleSchedulingPreviewDate = todayDateString();
let activeSchedulingPreviewView = "day";
let activeSchedulingPreviewNavModule = "Schedule";
let selectedSchedulingPreviewAppointmentId = null;
let activeSchedulingV2Panel = "appointment";
let activeSchedulingV2DetailTab = "appt-note";
let schedulingV2InlineMode = "";
let schedulingV2InlineAppointmentId = "";
let schedulingV2InlineDefaults = {};
let schedulingV2DatePickerOpen = false;
let schedulingV2SidebarCollapsed = false;
let schedulingV2AgendaScrollTop = 0;
const selectedAppointmentClientIds = new Set();
let editingTaskId = null;
let editingGrantId = null;
let selectedGrantId = null;
let editingGrantQuestionId = null;
let taskCompletionAudio = null;
let taskUndoTimeoutId = null;
let pendingTaskUndo = null;
let editingReferralProviderLinks = [];
let editingClientProviderLinks = [];
let loadedReferrals = [];
let loadedClients = [];
let loadedNetworkEntries = [];
let loadedOutreachEvents = [];
let loadedOutreachContacts = [];
let loadedAppointments = [];
let loadedTasks = [];
let loadedActivityLogs = [];
let loadedGrants = [];
let loadedGrantQuestions = [];
let loadedGrantOrganizationInfo = null;
let latestClientImportAnalysis = null;
let latestReferralImportAnalysis = null;
let latestNetworkImportAnalysis = null;
let latestAppointmentImportAnalysis = null;
let dataToolsCounts = null;
const expandedNetworkEntryIds = new Set();
let activeOutreachView = "dashboard";
let activeAdminView = "settings";
let activeFundraisingView = "grants";
let activeReferralView = "flow";
let activeClientView = "flow";
let activeReferralProfileTab = "overview";
let activeClientProfileTab = "overview";
const savedNavigationState = loadNavigationState();
let activeModule = savedNavigationState.activeModule;
let activeCrmView = savedNavigationState.activeCrmView;
activeOutreachView = savedNavigationState.activeOutreachView;
activeAdminView = savedNavigationState.activeAdminView;
activeFundraisingView = savedNavigationState.activeFundraisingView;
activeReferralView = savedNavigationState.activeReferralView;
activeClientView = savedNavigationState.activeClientView;

async function authedFetch(path, options = {}) {
  const apiBaseUrl = window.SNACK_CONFIG?.API_BASE_URL;
  const token = await currentUser.getIdToken();

  return fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    }
  });
}

async function loadMessage() {
  if (!currentUser) {
    statusEl.textContent = "Sign in to load the database message.";
    messageEl.textContent = "";
    return;
  }

  statusEl.textContent = "Checking the SNACK CRM API...";
  messageEl.textContent = "";
  refreshButton.disabled = true;

  try {
    const response = await authedFetch("/api/message");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    messageEl.textContent = data.text;
    statusEl.textContent = `Loaded from ${data.source}.`;
  } catch (error) {
    statusEl.textContent = "Could not load the message yet.";
    messageEl.textContent = "Check that the backend is running, then try again.";
    console.error(error);
  } finally {
    refreshButton.disabled = false;
  }
}

function referralName(referral) {
  return `${referral.firstName || ""} ${referral.lastName || ""}`.trim() || "Unnamed referral";
}

function clientName(client) {
  return `${client.firstName || ""} ${client.lastName || ""}`.trim() || "Unnamed client";
}

function appointmentClientName(appointment) {
  const names = appointmentClientNames(appointment);
  return names.length ? names.join(", ") : "Unknown client";
}

function firstNameFromFullName(name) {
  return String(name || "").trim().split(/\s+/)[0] || "";
}

function formatFirstNameList(names) {
  const firstNames = names.map(firstNameFromFullName).filter(Boolean);

  if (firstNames.length <= 1) {
    return firstNames[0] || "";
  }

  if (firstNames.length === 2) {
    return `${firstNames[0]} & ${firstNames[1]}`;
  }

  return `${firstNames.slice(0, -1).join(", ")} & ${firstNames[firstNames.length - 1]}`;
}

function appointmentClientIds(appointment) {
  if (Array.isArray(appointment.clientIds) && appointment.clientIds.length) {
    return appointment.clientIds.filter(Boolean);
  }

  return appointment.clientId ? [appointment.clientId] : [];
}

function appointmentClientNames(appointment) {
  const names = appointmentClientIds(appointment)
    .map((clientId) => loadedClients.find((item) => item.id === clientId))
    .filter(Boolean)
    .map(clientName);

  if (names.length) {
    return names;
  }

  if (Array.isArray(appointment.clientNames) && appointment.clientNames.length) {
    return appointment.clientNames.filter(Boolean);
  }

  return appointment.clientName ? [appointment.clientName] : [];
}

function appointmentTypeLabel(appointment) {
  return appointment.appointmentType || (appointment.lesson ? "Nutrition Education" : "Enrollment");
}

function appointmentCarriesGoal(appointment) {
  return appointmentTypeLabel(appointment) === "Nutrition Education";
}

function appointmentGoalText(appointment) {
  return appointmentCarriesGoal(appointment) ? appointment.goal || "" : "";
}

function stripSetmoreBookingIdFromNotes(notes) {
  return String(notes || "")
    .replace(/^\s*Setmore booking ID:\s*\S+\s*$/gim, "")
    .replace(/\bSetmore booking ID:\s*\S+/gi, "")
    .replace(/\s+\|?\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function appointmentNotesText(appointment) {
  return stripSetmoreBookingIdFromNotes(appointment.notes);
}

function appointmentLessonLabel(appointment) {
  const rawLesson = String(appointment.lesson || "").trim();

  if (!rawLesson) {
    return "";
  }

  return rawLesson.toLowerCase() === "check in" ? "Check In" : appointmentLessonTitle(rawLesson) || rawLesson;
}

function appointmentLessonNumber(appointment) {
  const lesson = Number.parseInt(String(appointment.lesson || "").replace(/\D/g, ""), 10);
  return Number.isFinite(lesson) ? lesson : 0;
}

function appointmentLessonTitle(lesson) {
  const lessonNumber = Number.parseInt(String(lesson || "").replace(/\D/g, ""), 10);
  return appointmentLessonTitles[lessonNumber] || "";
}

function inferAppointmentLessonFromNotes(notes, appointmentType = "") {
  const noteText = stripSetmoreBookingIdFromNotes(notes);

  if (!noteText || String(appointmentType || "").toLowerCase() === "enrollment") {
    return "";
  }

  const numericMatch = noteText.match(/\blesson\s*:?\s*(\d)\b/i);
  if (numericMatch) {
    return numericMatch[1] === "8" ? "Check In" : numericMatch[1];
  }

  for (const item of appointmentLessonKeywords) {
    if (item.patterns.some((pattern) => pattern.test(noteText))) {
      return item.value;
    }
  }

  return "";
}

function cleanInferredGoalText(value) {
  return String(value || "")
    .replace(/\bSetmore booking ID:\s*\S+/gi, "")
    .replace(/\bLesson\s*:?\s*(?:\d|ND|Sugar|Food Groups?|FG|Macro(?:nutrients?)?|Micros?|Micronutrients?|Mindful Eating|ME|Healthy Habits?|HH|Check In)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s:;|,-]+|[\s:;|,-]+$/g, "")
    .trim();
}

function inferAppointmentGoalFromNotes(notes, lesson = "") {
  const noteText = stripSetmoreBookingIdFromNotes(notes);

  if (!noteText) {
    return "";
  }

  const flattened = noteText.replace(/\s*\|\s*/g, " ").replace(/\s+/g, " ").trim();
  const explicitGoal = flattened.match(/\bgoal\s*:?\s*(.+?)(?=\s+\bLesson\b\s*:|\s+\bSetmore\b|$)/i);
  if (explicitGoal?.[1]) {
    return cleanInferredGoalText(explicitGoal[1]);
  }

  const firstLine = noteText.split(/\r?\n/).map((line) => line.trim()).find(Boolean) || "";
  const lessonFromNotes = lesson || inferAppointmentLessonFromNotes(noteText, "Nutrition Education");
  const lessonPattern = lessonFromNotes === "Check In"
    ? /^(check\s*in)\s*[:|-]\s*(.+)$/i
    : new RegExp(`^(${[
      "nutrient density",
      "nutrient dense",
      "sugar",
      "food groups?",
      "fg",
      "macros?",
      "macronutrients?",
      "micros?",
      "micronutrients?",
      "mindful eating",
      "healthy habits?"
    ].join("|")})\\s*[:|-]\\s*(.+)$`, "i");
  const lessonPrefix = firstLine.match(lessonPattern);

  if (lessonPrefix?.[2]) {
    return cleanInferredGoalText(lessonPrefix[2]);
  }

  return "";
}

function inferAppointmentFieldsFromNotes(notes, appointmentType = "") {
  const lesson = inferAppointmentLessonFromNotes(notes, appointmentType);

  return {
    lesson,
    goal: inferAppointmentGoalFromNotes(notes, lesson)
  };
}

function appointmentPrepClients(appointment) {
  return appointmentClientIds(appointment)
    .map((clientId) => loadedClients.find((client) => client.id === clientId))
    .filter(Boolean);
}

function appointmentPrepVisitLabel(appointment) {
  if (appointmentTypeLabel(appointment) === "Enrollment") {
    return "Enrollment";
  }

  if (String(appointment.lesson || "").toLowerCase() === "check in") {
    return "Check In";
  }

  const lesson = appointmentLessonNumber(appointment);
  if (lesson === 7) {
    return `${appointmentLessonTitle(lesson)} / Graduation`;
  }

  return appointmentLessonTitle(lesson) || appointmentTypeLabel(appointment);
}

function appointmentPrepItems(appointment) {
  const lesson = appointmentLessonNumber(appointment);
  const clients = appointmentPrepClients(appointment);
  const hasYccoClient = clients.some((client) => truthyProfileValue(client.ycco));
  const isCheckIn = String(appointment.lesson || "").toLowerCase() === "check in";

  if (appointmentTypeLabel(appointment) === "Enrollment") {
    const items = [
      "Place paperwork at reception before the appointment.",
      "Enrollment form (file cabinet); siblings can share one form.",
      "Questionnaire for each child (file cabinet); each child needs their own.",
      "Write client name in the top right corner, initial code on the back, and circle PRE."
    ];

    if (hasYccoClient) {
      items.push("HRSN screener for YCCO client (file cabinet).");
    }

    items.push("SNACK sticker.", "SNACK pen or pencil.", "Food snack.");
    return items;
  }

  if (lesson === 1) {
    return ["Workbook.", "Prize from the bin.", "Food snack."];
  }

  if (lesson >= 2 && lesson <= 6) {
    return ["Prize from the bin.", "Food snack."];
  }

  if (lesson === 7) {
    return [
      "Graduation paperwork; tell client they can complete it with you or in the lobby and return it to the front desk.",
      "Questionnaire for each child (file cabinet); each child needs their own.",
      "Write client name in the top right corner, initial code on the back, and circle POST.",
      "Child Feedback form for each child (file cabinet); each child needs their own.",
      "Parent Feedback form (file cabinet).",
      "1 SNACK tumbler per child.",
      "1 $50 grocery gift card per family.",
      "Food snack."
    ];
  }

  if (isCheckIn) {
    return [
      "Review the client's most recent goal and appointment notes.",
      "Check In note sheet.",
      "Food snack."
    ];
  }

  if (appointmentTypeLabel(appointment) === "Nutrition Education") {
    return [
      "Review appointment notes for the lesson and goal.",
      "Bring the workbook or lesson materials listed in notes.",
      "Prize from the bin.",
      "Food snack."
    ];
  }

  return [];
}

function appointmentPrepTaskType(appointment) {
  const lesson = appointmentLessonNumber(appointment);
  return appointmentTypeLabel(appointment) === "Enrollment" || lesson === 7 ? "Form" : "Task";
}

function appointmentPrepTaskNotes(appointment) {
  const items = appointmentPrepItems(appointment);

  if (!items.length) {
    return "";
  }

  return [
    `Prep list for ${formatAppointmentDateTime(appointment)} ${appointmentPrepVisitLabel(appointment)}:`,
    ...items.map((item) => `- ${item}`)
  ].join("\n");
}

function appointmentLessonAccent(appointment) {
  if (appointmentTypeLabel(appointment) !== "Nutrition Education") {
    return "var(--muted)";
  }

  const lesson = Number.parseInt(String(appointment.lesson || "").replace(/\D/g, ""), 10);
  return Number.isFinite(lesson) && lesson >= 1 ? profileLessonAccent(lesson) : "var(--brand-red)";
}

function appointmentIsBlockTime(appointment) {
  return appointmentTypeLabel(appointment) === "Administrative" ||
    ["block time", "blocked time"].includes(normalizedLookupKey(appointmentClientName(appointment)));
}

function appointmentDisplayStatus(appointment) {
  if ((appointment.status || "") === "Blocked") {
    return "Blocked";
  }

  return appointmentIsBlockTime(appointment) ? "Blocked" : appointment.status || "Scheduled";
}

function schedulingV2DisplayStatus(status = "Scheduled") {
  return status === "Needs Reschedule" ? "Reschedule" : status;
}

function clientStatusDisplayLabel(status = "Scheduled") {
  return status === "Needs Reschedule" ? "Reschedule" : status;
}

function schedulingV2AppointmentDisplayStatus(appointment) {
  return schedulingV2DisplayStatus(appointmentDisplayStatus(appointment));
}

function appointmentCheckInValue(appointment, key) {
  const value = String(appointment?.[key] || "").trim();
  return value || appointmentCheckInDefaults[key] || "";
}

function appointmentCheckInFields(appointment) {
  return {
    caregiverMood: appointmentCheckInValue(appointment, "caregiverMood"),
    confidence: appointmentCheckInValue(appointment, "confidence"),
    participation: appointmentCheckInValue(appointment, "participation"),
    barriers: appointmentCheckInValue(appointment, "barriers")
  };
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return `${new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit"
  }).format(date)} ${new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date)}`;
}

function formatDateOnly(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit"
  }).format(date);
}

function formatDayPickerDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return formatDateOnly(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatFullDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return formatDateOnly(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatListDate(value) {
  return value ? formatDateOnly(value) : "";
}

function formatAppointmentTime(value) {
  const normalized = normalizeAppointmentTime(value);

  if (!normalized) {
    return "";
  }

  const [hourText, minuteText] = normalized.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${String(minute).padStart(2, "0")} ${period}`;
}

function normalizeAppointmentTime(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  const militaryMatch = raw.match(/^(\d{1,2}):(\d{2})$/);

  if (militaryMatch) {
    const hour = Number(militaryMatch[1]);
    const minute = Number(militaryMatch[2]);

    if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
  }

  const standardMatch = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]\.?m\.?)$/i);

  if (standardMatch) {
    let hour = Number(standardMatch[1]);
    const minute = Number(standardMatch[2] || "00");
    const period = standardMatch[3].toLowerCase();

    if (hour >= 1 && hour <= 12 && minute >= 0 && minute <= 59) {
      if (period.startsWith("p") && hour !== 12) {
        hour += 12;
      }

      if (period.startsWith("a") && hour === 12) {
        hour = 0;
      }

      return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    }
  }

  return raw;
}

function appointmentTimeValue(value) {
  return appointmentTimeMinutes(value) ?? 0;
}

function appointmentTimeMinutes(value) {
  const normalized = normalizeAppointmentTime(value);
  const match = normalized.match(/^(\d{2}):(\d{2})$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

function normalizeSchedulingWeekdays(value) {
  const source = Array.isArray(value) ? value : defaultSchedulingSettings.weekdays;
  const weekdays = source
    .map((day) => Number(day))
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6);
  const unique = [...new Set(weekdays)];

  return unique.length ? unique.sort((first, second) => first - second) : [...defaultSchedulingSettings.weekdays];
}

function normalizeSchedulingTime(value, fallback) {
  const normalized = normalizeAppointmentTime(value);

  return appointmentTimeMinutes(normalized) === null ? fallback : normalized;
}

function normalizeSchedulingSettings(raw = {}) {
  const officeStartTime = normalizeSchedulingTime(raw.officeStartTime, defaultSchedulingSettings.officeStartTime);
  let officeEndTime = normalizeSchedulingTime(raw.officeEndTime, defaultSchedulingSettings.officeEndTime);
  let bookableStartTime = normalizeSchedulingTime(raw.bookableStartTime, defaultSchedulingSettings.bookableStartTime);
  let bookableEndTime = normalizeSchedulingTime(raw.bookableEndTime, defaultSchedulingSettings.bookableEndTime);
  const officeStartMinutes = appointmentTimeMinutes(officeStartTime);
  let officeEndMinutes = appointmentTimeMinutes(officeEndTime);
  let bookableStartMinutes = appointmentTimeMinutes(bookableStartTime);
  let bookableEndMinutes = appointmentTimeMinutes(bookableEndTime);

  if (officeEndMinutes <= officeStartMinutes) {
    officeEndTime = defaultSchedulingSettings.officeEndTime;
    officeEndMinutes = appointmentTimeMinutes(officeEndTime);
  }

  if (bookableStartMinutes < officeStartMinutes || bookableStartMinutes >= officeEndMinutes) {
    bookableStartTime = defaultSchedulingSettings.bookableStartTime;
    bookableStartMinutes = appointmentTimeMinutes(bookableStartTime);
  }

  if (bookableEndMinutes > officeEndMinutes || bookableEndMinutes <= bookableStartMinutes) {
    bookableEndTime = defaultSchedulingSettings.bookableEndTime;
    bookableEndMinutes = appointmentTimeMinutes(bookableEndTime);
  }

  const defaultDurationMinutes = Number(raw.defaultDurationMinutes) || defaultSchedulingSettings.defaultDurationMinutes;
  const slotIntervalMinutes = Number(raw.slotIntervalMinutes) || defaultSchedulingSettings.slotIntervalMinutes;

  return {
    officeStartTime,
    officeEndTime,
    bookableStartTime,
    bookableEndTime,
    weekdays: normalizeSchedulingWeekdays(raw.weekdays),
    defaultDurationMinutes: defaultDurationMinutes > 0 ? defaultDurationMinutes : defaultSchedulingSettings.defaultDurationMinutes,
    slotIntervalMinutes: [5, 10, 15, 30].includes(slotIntervalMinutes) ? slotIntervalMinutes : defaultSchedulingSettings.slotIntervalMinutes,
    officeStartMinutes,
    officeEndMinutes,
    bookableStartMinutes,
    bookableEndMinutes
  };
}

function applySchedulingSettings(raw = defaultSchedulingSettings) {
  const settings = normalizeSchedulingSettings(raw);

  schedulingOfficeStartMinutes = settings.officeStartMinutes;
  schedulingOfficeEndMinutes = settings.officeEndMinutes;
  schedulingBookableStartMinutes = settings.bookableStartMinutes;
  schedulingBookableEndMinutes = settings.bookableEndMinutes;
  schedulingStartMinutes = schedulingOfficeStartMinutes;
  schedulingEndMinutes = schedulingOfficeEndMinutes;
  schedulingDefaultDurationMinutes = settings.defaultDurationMinutes;
  schedulingSlotIntervalMinutes = settings.slotIntervalMinutes;
  schedulingV2ClinicWeekdays = [...settings.weekdays];
  schedulingV2ClinicWeekdaySet = new Set(schedulingV2ClinicWeekdays);

  return settings;
}

function schedulingDateForWeekday(weekStart, weekday) {
  return addDays(weekStart, Number(weekday) === 0 ? 6 : Number(weekday) - 1);
}

function schedulingWeekdayLabels(format = "short", weekdays = schedulingV2ClinicWeekdays) {
  return weekdays.map((weekday) => {
    const date = schedulingDateForWeekday(weekStartDate("2026-06-01"), weekday);
    return new Intl.DateTimeFormat("en-US", { weekday: format }).format(date);
  });
}

function appointmentClientCount(appointment) {
  const clientIds = appointmentClientIds(appointment);

  if (clientIds.length) {
    return clientIds.length;
  }

  if (Array.isArray(appointment.clientNames) && appointment.clientNames.length) {
    return appointment.clientNames.filter(Boolean).length;
  }

  return appointment.clientName ? 1 : 0;
}

function appointmentDurationMinutes(appointment) {
  const explicitDuration = Number(appointment.durationMinutes);

  if (Number.isInteger(explicitDuration) && explicitDuration > 0) {
    return explicitDuration;
  }

  return appointmentClientCount(appointment) >= 3 ? 45 : defaultAppointmentDurationMinutes;
}

function formatDuration(minutes) {
  return `${minutes} min`;
}

function appointmentFitsSchedulingWindow(appointment) {
  const start = appointmentTimeMinutes(appointment.appointmentTime);
  if (start === null) {
    return false;
  }

  return start >= schedulingBookableStartMinutes && start + appointmentDurationMinutes(appointment) <= schedulingBookableEndMinutes;
}

function appointmentBlocksSchedule(appointment) {
  return ["Scheduled", "Completed", "Blocked"].includes(appointment.status || "Scheduled");
}

function appointmentsOverlap(first, second) {
  if (first.appointmentDate !== second.appointmentDate) {
    return false;
  }

  const firstStart = appointmentTimeMinutes(first.appointmentTime);
  const secondStart = appointmentTimeMinutes(second.appointmentTime);

  if (firstStart === null || secondStart === null) {
    return false;
  }

  const firstEnd = firstStart + appointmentDurationMinutes(first);
  const secondEnd = secondStart + appointmentDurationMinutes(second);
  return firstStart < secondEnd && firstEnd > secondStart;
}

function appointmentSchedulingConflict(appointment, excludedAppointmentId = "") {
  if (!appointmentBlocksSchedule(appointment)) {
    return null;
  }

  return loadedAppointments.find(
    (existingAppointment) =>
      existingAppointment.id !== excludedAppointmentId &&
      appointmentBlocksSchedule(existingAppointment) &&
      appointmentsOverlap(appointment, existingAppointment)
  ) || null;
}

function appointmentConflictError(conflict) {
  return `That time overlaps ${appointmentClientName(conflict)} at ${formatAppointmentTime(conflict.appointmentTime)}. Choose a different time or add the client to that appointment.`;
}

function schedulingWindowEndLabel() {
  const hour = Math.floor(schedulingBookableEndMinutes / 60);
  const minute = schedulingBookableEndMinutes % 60;
  return formatAppointmentTime(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
}

function schedulingWindowError(appointment) {
  if (appointmentTimeMinutes(appointment.appointmentTime) === null) {
    return "Choose a valid appointment time.";
  }

  return `This appointment is ${formatDuration(appointmentDurationMinutes(appointment))}. Choose a start time that ends by ${schedulingWindowEndLabel()}.`;
}

function formatAppointmentDateTime(appointment) {
  const date = formatDateOnly(appointment.appointmentDate);
  const time = formatAppointmentTime(appointment.appointmentTime);
  return time ? `${date} ${time}` : date;
}

function localDateTimeParts(date = new Date()) {
  return {
    date: toDateString(date),
    time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  };
}

function activityLogTimestamp(log) {
  return log.occurredAt || `${log.activityDate || ""}T${normalizeAppointmentTime(log.activityTime) || "00:00"}:00`;
}

function normalizeCsvDate(value) {
  const raw = String(value || "").trim();

  if (!raw) {
    return "";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw;
  }

  const slashMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/);

  if (slashMatch) {
    const year = slashMatch[3].length === 2 ? `20${slashMatch[3]}` : slashMatch[3];
    const month = slashMatch[1].padStart(2, "0");
    const day = slashMatch[2].padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const dayMonthMatch = raw.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})(?:\s+\d{1,2}:\d{2}\s*[AP]M)?$/i);

  if (dayMonthMatch) {
    const month = importedMonthNames.get(dayMonthMatch[2].toLowerCase());
    return month ? `${dayMonthMatch[3]}-${month}-${dayMonthMatch[1].padStart(2, "0")}` : "";
  }

  const monthDayMatch = raw.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i);

  if (monthDayMatch) {
    const month = importedMonthNames.get(monthDayMatch[1].toLowerCase());
    return month ? `${monthDayMatch[3]}-${month}-${monthDayMatch[2].padStart(2, "0")}` : "";
  }

  return "";
}

function formatShortDate(value) {
  if (!value) {
    return "";
  }

  const normalized = String(value).includes("T") ? String(value).slice(0, 10) : value;
  const date = new Date(`${normalized}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "2-digit"
  }).format(date);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateString(date) {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function formatWeekdayDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "numeric",
    day: "numeric"
  }).format(date);
}

function formatPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  const normalized = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;

  if (normalized.length !== 10) {
    return value || "";
  }

  return `(${normalized.slice(0, 3)}) ${normalized.slice(3, 6)}-${normalized.slice(6)}`;
}

function normalizePhoneKey(value) {
  const digits = String(value || "").replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

function normalizedLookupKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function displayValue(value) {
  return value === null || value === undefined || value === "" ? "-" : value;
}

function displayBoolean(value) {
  return value ? "✓" : "-";
}

function hasDisplayValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function truthyProfileValue(value) {
  if (value === true) {
    return true;
  }

  const normalized = String(value || "").trim().toLowerCase();
  return ["true", "yes", "y", "1", "checked"].includes(normalized);
}

function formatContact(referral) {
  return [formatPhone(referral.phone), referral.email].filter(Boolean).join(" | ") || "No contact info yet";
}

function normalizeStatus(status) {
  return legacyStatusMap[status] || status || "New";
}

function statusGroupKey(status) {
  const normalized = normalizeStatus(status);
  const group = referralFlowColumns.find((item) => !item.archive && item.statuses.includes(normalized));

  if (group?.key === "contacted") {
    return "in-contact";
  }

  if (group?.key === "scheduled") {
    return "referral-scheduled";
  }

  if (group?.key) {
    return group.key;
  }

  const archiveGroup = referralFlowColumns.find((item) => item.archive && item.statuses.includes(normalized));
  return archiveGroup?.key || "new";
}

function cssToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function tablePreferenceKey(moduleName) {
  const userKey = currentUser?.email || "local";
  return `snack-crm:${userKey}:${moduleName}:columns`;
}

function defaultColumnState(moduleName) {
  const columns = tableColumns[moduleName];
  return {
    order: columns.map((column) => column.key),
    widths: Object.fromEntries(columns.map((column) => [column.key, column.width])),
    visible: Object.fromEntries(columns.map((column) => [column.key, true]))
  };
}

function columnState(moduleName) {
  const defaults = defaultColumnState(moduleName);

  try {
    const saved = JSON.parse(localStorage.getItem(tablePreferenceKey(moduleName)) || "null");
    const validKeys = new Set(defaults.order);
    const savedOrder = Array.isArray(saved?.order) ? saved.order.filter((key) => validKeys.has(key)) : [];
    const order = [...savedOrder, ...defaults.order.filter((key) => !savedOrder.includes(key))];
    const widths = { ...defaults.widths };
    const visible = { ...defaults.visible };

    for (const [key, value] of Object.entries(saved?.widths || {})) {
      if (validKeys.has(key) && Number.isFinite(Number(value))) {
        widths[key] = Math.max(70, Math.min(360, Number(value)));
      }
    }

    for (const [key, value] of Object.entries(saved?.visible || {})) {
      if (validKeys.has(key)) {
        visible[key] = Boolean(value);
      }
    }

    if (!Object.values(visible).some(Boolean)) {
      return defaults;
    }

    return { order, widths, visible };
  } catch (_error) {
    return defaults;
  }
}

function saveColumnState(moduleName, state) {
  localStorage.setItem(tablePreferenceKey(moduleName), JSON.stringify(state));
}

function navigationStateKey() {
  return "snack-crm:navigation-state";
}

function grantDisclosureStateKey(sectionName) {
  return `snack-crm:grant-disclosure:${sectionName}`;
}

function applyGrantDisclosureState(detailsEl, sectionName) {
  if (!detailsEl) {
    return;
  }

  const savedState = localStorage.getItem(grantDisclosureStateKey(sectionName));
  if (savedState === "open") {
    detailsEl.open = true;
  } else if (savedState === "closed") {
    detailsEl.open = false;
  }
}

function bindGrantDisclosureState(detailsEl, sectionName) {
  if (!detailsEl) {
    return;
  }

  applyGrantDisclosureState(detailsEl, sectionName);
  detailsEl.addEventListener("toggle", () => {
    localStorage.setItem(grantDisclosureStateKey(sectionName), detailsEl.open ? "open" : "closed");
  });
}

function validValue(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function loadNavigationState() {
  const defaults = {
    activeModule: "workflow",
    activeCrmView: "referrals",
    activeOutreachView: "dashboard",
    activeAdminView: "settings",
    activeFundraisingView: "grants",
    activeReferralView: "flow",
    activeClientView: "flow"
  };

  try {
    const saved = JSON.parse(localStorage.getItem(navigationStateKey()) || "null") || {};
    const legacyModule = saved.activeModule === "dashboard" ? "admin" : saved.activeModule;
    const savedModule = legacyModule === "admin" && saved.activeAdminView === "grants" ? "fundraising" : legacyModule;
    const savedFundraisingView = saved.activeAdminView === "grants" ? "grants" : saved.activeFundraisingView;
    return {
      activeModule: validValue(savedModule, ["workflow", "scheduling", "crm", "outreach", "fundraising", "marketing", "operations", "admin"], defaults.activeModule),
      activeCrmView: validValue(saved.activeCrmView, ["referrals", "clients", "referral-network"], defaults.activeCrmView),
      activeOutreachView: validValue(saved.activeOutreachView, ["dashboard", "events", "contacts"], defaults.activeOutreachView),
      activeAdminView: validValue(saved.activeAdminView, ["settings", "data-tools", "kpi", "work-plan"], defaults.activeAdminView),
      activeFundraisingView: validValue(savedFundraisingView, ["grants", "sales", "individual-giving", "corporate-partnerships", "events"], defaults.activeFundraisingView),
      activeReferralView: validValue(saved.activeReferralView, ["list", "flow"], defaults.activeReferralView),
      activeClientView: validValue(saved.activeClientView, ["list", "flow"], defaults.activeClientView)
    };
  } catch (_error) {
    return defaults;
  }
}

function saveNavigationState() {
  localStorage.setItem(navigationStateKey(), JSON.stringify({
    activeModule,
    activeCrmView,
    activeOutreachView,
    activeAdminView,
    activeFundraisingView,
    activeReferralView,
    activeClientView
  }));
}

function orderedColumns(moduleName) {
  const columnsByKey = Object.fromEntries(tableColumns[moduleName].map((column) => [column.key, column]));
  return columnState(moduleName).order.map((key) => columnsByKey[key]).filter(Boolean);
}

function visibleColumns(moduleName) {
  const state = columnState(moduleName);
  return orderedColumns(moduleName).filter((column) => state.visible[column.key] !== false);
}

function gridTemplateFor(moduleName) {
  const state = columnState(moduleName);
  return visibleColumns(moduleName)
    .map((column) => {
      const width = state.widths[column.key] || column.width;
      return `minmax(72px, ${width}fr)`;
    })
    .join(" ");
}

function minTableWidth(moduleName) {
  return "100%";
}

function renderCell(column, record) {
  const cell = document.createElement("span");
  cell.className = "table-cell";
  cell.setAttribute("role", "cell");

  if (column.muted) {
    cell.classList.add("muted-cell");
  }

  if (column.strong) {
    cell.classList.add("referral-name-cell");
  }

  const content = column.render(record);

  if (content instanceof Node) {
    cell.append(content);
  } else {
    cell.textContent = content;
  }

  return cell;
}

function renderTableHead(moduleName) {
  const head = tableHeads[moduleName];
  const state = columnState(moduleName);
  head.innerHTML = "";
  head.style.gridTemplateColumns = gridTemplateFor(moduleName);
  head.style.minWidth = minTableWidth(moduleName);
  renderColumnOptions(moduleName);

  for (const column of visibleColumns(moduleName)) {
    const cell = document.createElement("span");
    cell.className = "table-heading-cell";
    cell.setAttribute("role", "columnheader");
    cell.draggable = true;
    cell.dataset.columnKey = column.key;

    const label = document.createElement("span");
    label.textContent = column.label;

    const handle = document.createElement("span");
    handle.className = "column-resize-handle";
    handle.setAttribute("aria-hidden", "true");

    cell.append(label, handle);
    cell.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", column.key);
      event.dataTransfer.effectAllowed = "move";
    });
    cell.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    });
    cell.addEventListener("drop", (event) => {
      event.preventDefault();
      const movedKey = event.dataTransfer.getData("text/plain");
      const targetKey = column.key;

      if (!movedKey || movedKey === targetKey) {
        return;
      }

      const nextOrder = state.order.filter((key) => key !== movedKey);
      const targetIndex = nextOrder.indexOf(targetKey);
      nextOrder.splice(targetIndex, 0, movedKey);
      saveColumnState(moduleName, { ...state, order: nextOrder });
      renderModuleTable(moduleName);
    });
    handle.addEventListener("mousedown", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = state.widths[column.key] || column.width;

      const resize = (moveEvent) => {
        const nextWidth = Math.max(70, Math.min(360, startWidth + moveEvent.clientX - startX));
        const nextState = columnState(moduleName);
        nextState.widths[column.key] = nextWidth;
        saveColumnState(moduleName, nextState);
        renderModuleTable(moduleName);
      };

      const stopResize = () => {
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopResize);
      };

      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    });
    head.append(cell);
  }
}

function renderColumnOptions(moduleName) {
  const container = columnOptionContainers[moduleName];

  if (!container) {
    return;
  }

  const state = columnState(moduleName);
  container.innerHTML = "";

  for (const column of tableColumns[moduleName]) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.visible[column.key] !== false;

    checkbox.addEventListener("change", () => {
      const nextState = columnState(moduleName);
      const visibleCount = Object.entries(nextState.visible).filter(([key, value]) => key === column.key ? checkbox.checked : value !== false).length;

      if (!visibleCount) {
        checkbox.checked = true;
        return;
      }

      nextState.visible[column.key] = checkbox.checked;
      saveColumnState(moduleName, nextState);
      renderModuleTable(moduleName);
    });

    label.append(checkbox, document.createTextNode(column.label));
    container.append(label);
  }
}

function renderModuleTable(moduleName) {
  if (moduleName === "referrals") {
    renderReferrals();
    return;
  }

  renderClients();
}

function setReferralsLoadedStatus() {
  referralsStatusEl.textContent = "";
}

function setClientsLoadedStatus() {
  clientsStatusEl.textContent = "";
}

function percentage(numerator, denominator) {
  if (!denominator) {
    return "0%";
  }

  return `${Math.round((numerator / denominator) * 100)}%`;
}

function percentageNumber(numerator, denominator) {
  if (!denominator) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}

function clearElement(element) {
  if (element) {
    element.innerHTML = "";
  }
}

function todayDateString() {
  const date = new Date();
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function hasFutureAppointment(client) {
  const today = todayDateString();
  return (
    clientAppointments(client).some((appointment) => appointment.status === "Scheduled" && appointment.appointmentDate >= today) ||
    [client.firstAppointmentDate, client.mostRecentAppointmentDate].some((value) => value && value >= today)
  );
}

function knownReferralSources() {
  return [
    ...new Set([
      ...loadedReferrals.map((referral) => referral.referralSource).filter(Boolean),
      ...loadedClients.map((client) => client.referralSource).filter(Boolean),
      ...loadedNetworkEntries.map((entry) => entry.name).filter(Boolean),
      ...loadedNetworkEntries.flatMap((entry) => (entry.providers || []).map((provider) => provider.name)).filter(Boolean)
    ])
  ]
    .sort((first, second) => first.localeCompare(second));
}

function renderReferralSourceOptions(event) {
  const input = event?.target || referralSourceInput;
  const query = input.value.trim().toLowerCase();
  const sources = knownReferralSources()
    .filter((source) => !query || source.toLowerCase().includes(query))
    .slice(0, 10);

  referralSourceOptions.innerHTML = "";

  for (const source of sources) {
    const option = document.createElement("option");
    option.value = source;
    referralSourceOptions.append(option);
  }
}

function referralMatchesFilters(referral) {
  const query = referralSearchInput.value.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const searchable = [
    referral.firstName,
    referral.lastName,
    referral.phone,
    referral.email,
    referral.parentName,
    referral.preferredLanguage,
    referral.preferredContactMethod,
    referral.referralType,
    referral.referralSource,
    referral.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function getSelectedReferral() {
  return loadedReferrals.find((referral) => referral.id === selectedReferralId) || null;
}

function getSelectedClient() {
  return loadedClients.find((client) => client.id === selectedClientId) || null;
}

function clientMatchesSearch(client) {
  const query = clientSearchInput.value.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const searchable = [
    client.firstName,
    client.lastName,
    client.phone,
    client.email,
    client.parentName,
    client.preferredLanguage,
    client.preferredContactMethod,
    client.referralType,
    client.referralSource,
    client.status,
    client.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function networkEntryName(entry) {
  return entry.name || "Unnamed network entry";
}

function normalizeNetworkType(type) {
  const typeMap = {
    "Internal Clinic Referral": "Internal Clinic",
    "External Clinic Referral": "External Clinic",
    "Community Org Referral": "Community Org"
  };

  return typeMap[type] || type || "";
}

function networkProviderName(provider) {
  return provider.name || "Unnamed provider";
}

function networkProviderKey(provider, index) {
  return provider.id || `provider-${index}`;
}

function compareNetworkProviders(first, second) {
  return networkProviderName(first.provider).localeCompare(networkProviderName(second.provider), undefined, { sensitivity: "base" }) ||
    (first.provider.email || "").localeCompare(second.provider.email || "", undefined, { sensitivity: "base" });
}

function sortedNetworkProviders(providers = []) {
  return providers
    .map((provider, originalIndex) => ({ provider, originalIndex }))
    .sort(compareNetworkProviders);
}

function getSelectedNetworkEntry() {
  return loadedNetworkEntries.find((entry) => entry.id === selectedNetworkEntryId) || null;
}

function availableProviderLinks(record) {
  const linked = new Set((record.providerLinks || []).map((link) => `${link.networkId}:${link.providerId}`));
  return loadedNetworkEntries.flatMap((entry) =>
    (entry.providers || []).map((provider) => ({
      networkId: entry.id,
      providerId: provider.id,
      organizationName: networkEntryName(entry),
      providerName: networkProviderName(provider),
      label: `${networkProviderName(provider)} (${networkEntryName(entry)})`
    }))
  ).filter((link) => link.providerId && !linked.has(`${link.networkId}:${link.providerId}`));
}

function renderFormProviderLinkEditor(editor, links, onLinksChange, onAddLink) {
  if (!editor) {
    return;
  }

  editor.innerHTML = "";

  const header = document.createElement("div");
  header.className = "form-link-editor-header";
  const title = document.createElement("strong");
  title.textContent = "Provider Profiles";
  const hint = document.createElement("span");
  hint.textContent = "Choose from Referral Network providers.";
  header.append(title, hint);

  const list = document.createElement("div");
  list.className = "form-link-list";

  if (!links.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No provider profiles linked yet.";
    list.append(empty);
  }

  links.forEach((link, index) => {
    const row = document.createElement("div");
    row.className = "form-link-row";
    const name = document.createElement("span");
    name.textContent = `${link.providerName} (${link.organizationName})`;
    const remove = document.createElement("button");
    remove.className = "secondary-button compact-button";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      onLinksChange(links.filter((_, rowIndex) => rowIndex !== index));
    });
    row.append(name, remove);
    list.append(row);
  });

  const options = availableProviderLinks({ providerLinks: links });
  const controls = document.createElement("div");
  controls.className = "form-link-controls";
  const select = document.createElement("select");
  select.setAttribute("aria-label", "Add provider profile");

  if (!options.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = loadedNetworkEntries.length ? "No more providers available" : "Add providers in Referral Network first";
    select.append(option);
    select.disabled = true;
  } else {
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Add provider";
    select.append(placeholder);

    for (const optionLink of options) {
      const option = document.createElement("option");
      option.value = `${optionLink.networkId}:${optionLink.providerId}`;
      option.textContent = optionLink.label;
      select.append(option);
    }
  }

  const add = document.createElement("button");
  add.type = "button";
  add.textContent = "Add Provider";
  add.disabled = !options.length;
  add.addEventListener("click", () => {
    const link = options.find((optionLink) => `${optionLink.networkId}:${optionLink.providerId}` === select.value);

    if (!link) {
      select.focus();
      return;
    }

    onLinksChange([...links, link]);
    if (onAddLink) {
      onAddLink(link);
    }
  });

  controls.append(select, add);
  editor.append(header, list, controls);
}

function firstProviderSource(links = []) {
  return links.find((link) => String(link.providerName || "").trim())?.providerName || "";
}

function sourceMatchesAnyProvider(source, links = []) {
  return links.some((link) => providerLinkMatchesSource(source, link));
}

function syncReferralSourceFromLinks(previousLinks = []) {
  const currentSource = String(referralFormField("referralSource")?.value || "").trim();
  const nextSource = firstProviderSource(editingReferralProviderLinks);

  if (!currentSource || sourceMatchesAnyProvider(currentSource, previousLinks)) {
    setReferralFormFieldValue("referralSource", nextSource);
  }

  syncReferralSourceDisplay();
}

function syncClientReferralSourceFromLinks(previousLinks = []) {
  const currentSource = String(clientFormField("referralSource")?.value || "").trim();
  const nextSource = firstProviderSource(editingClientProviderLinks);

  if (!currentSource || sourceMatchesAnyProvider(currentSource, previousLinks)) {
    setClientFormFieldValue("referralSource", nextSource);
  }

  syncClientReferralSourceDisplay();
}

function renderReferralProviderLinkEditor() {
  renderFormProviderLinkEditor(
    referralProviderLinkEditor,
    editingReferralProviderLinks,
    (links) => {
      const previousLinks = editingReferralProviderLinks;
      editingReferralProviderLinks = links;
      syncReferralSourceFromLinks(previousLinks);
      renderReferralProviderLinkEditor();
    },
    (link) => {
      syncReferralSourceFromProviderLink(link);
    }
  );
}

function renderClientProviderLinkEditor() {
  renderFormProviderLinkEditor(
    clientProviderLinkEditor,
    editingClientProviderLinks,
    (links) => {
      const previousLinks = editingClientProviderLinks;
      editingClientProviderLinks = links;
      syncClientReferralSourceFromLinks(previousLinks);
      renderClientProviderLinkEditor();
    },
    (link) => {
      setClientFormFieldValue("referralSource", link.providerName || "");
      syncClientReferralSourceDisplay();
    }
  );
}

function networkEntryMatchesSearch(entry) {
  const query = networkSearchInput.value.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const searchable = [
    entry.name,
    entry.type,
    entry.contactName,
    entry.phone,
    entry.email,
    entry.website,
    entry.notes,
    ...(entry.providers || []).flatMap((provider) => [provider.name, provider.phone, provider.email, provider.website, provider.notes])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function outreachEventName(event) {
  return event.name || "Unnamed outreach event";
}

function outreachEventStatus(event = {}) {
  return event.status || "Scheduled";
}

function outreachEventStatusGroupKey(status = "Scheduled") {
  const normalized = status || "Scheduled";
  const column = outreachEventFlowColumns.find((item) => item.statuses.includes(normalized));

  if (column?.key === "upcoming") {
    return "outreach-upcoming";
  }

  if (column?.key) {
    return `outreach-${column.key}`;
  }

  return "outreach-upcoming";
}

function outreachEventStatusPill(status = "Scheduled") {
  const pill = document.createElement("span");
  pill.className = `grant-status-pill outreach-status-pill status-group-${outreachEventStatusGroupKey(status)}`;
  pill.textContent = status || "Scheduled";
  return pill;
}

function applyOutreachStatusSelectColor(select, status) {
  for (const key of ["outreach-upcoming", "outreach-in-progress", "outreach-completed", "outreach-follow-up", "outreach-closed"]) {
    select.classList.remove(`status-group-${key}`);
  }
  select.classList.add("status-select", "outreach-status-select", `status-group-${outreachEventStatusGroupKey(status)}`);
}

function createOutreachEventStatusSelect(event) {
  const select = document.createElement("select");
  select.className = "status-select outreach-status-select";
  select.setAttribute("aria-label", "Event status");

  for (const status of outreachEventStatuses) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    option.className = `status-group-${outreachEventStatusGroupKey(status)}`;
    select.append(option);
  }

  select.value = outreachEventStatus(event);
  applyOutreachStatusSelectColor(select, select.value);
  select.addEventListener("change", () => {
    applyOutreachStatusSelectColor(select, select.value);
    updateOutreachEventStatus(event, select.value);
  });
  return select;
}

function getSelectedOutreachEvent() {
  return loadedOutreachEvents.find((event) => event.id === selectedOutreachEventId) || null;
}

function outreachContactName(contact) {
  return contact.contactName || contact.childName || "Unnamed contact";
}

function getSelectedOutreachContact() {
  return loadedOutreachContacts.find((contact) => contact.id === selectedOutreachContactId) || null;
}

function getSelectedAppointment() {
  return loadedAppointments.find((appointment) => appointment.id === selectedAppointmentId) || null;
}

function outreachEventLabel(eventId) {
  const event = loadedOutreachEvents.find((item) => item.id === eventId);
  return event ? outreachEventName(event) : "";
}

function outreachEventMatchesSearch(event) {
  const query = outreachSearchInput.value.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const searchable = [
    event.name,
    event.type,
    event.status,
    event.eventDate,
    event.repeatPattern,
    event.location,
    event.contactName,
    event.contactRole,
    event.phone,
    event.email,
    event.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function outreachContactMatchesSearch(contact) {
  const query = outreachContactSearchInput.value.trim().toLowerCase();

  if (!query) {
    return true;
  }

  const searchable = [
    contact.contactName,
    contact.childName,
    contact.phone,
    contact.email,
    contact.preferredLanguage,
    contact.interestType,
    contact.status,
    outreachEventLabel(contact.eventId),
    contact.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function appointmentMatchesFilters(appointment) {
  const today = todayDateString();
  const dateFilter = appointmentDateFilterSelect.value;
  const statusFilter = appointmentStatusFilterSelect.value;
  const query = appointmentSearchInput.value.trim().toLowerCase();

  if (dateFilter === "today" && appointment.appointmentDate !== today) {
    return false;
  }

  if (dateFilter === "upcoming" && appointment.appointmentDate <= today) {
    return false;
  }

  if (dateFilter === "past" && appointment.appointmentDate >= today) {
    return false;
  }

  if (statusFilter !== "all" && appointment.status !== statusFilter) {
    return false;
  }

  if (!query) {
    return true;
  }

  const searchable = [
    appointmentClientName(appointment),
    appointmentClientNames(appointment).join(" "),
    appointmentTypeLabel(appointment),
    appointment.status,
    appointment.lesson,
    appointment.goal,
    appointment.staffMember,
    appointment.notes,
    appointment.appointmentDate,
    appointment.appointmentTime,
    formatAppointmentTime(appointment.appointmentTime)
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
}

function numberValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function dateValue(value, emptyPlacement = 1) {
  if (!value) {
    return emptyPlacement * Number.MAX_SAFE_INTEGER;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? emptyPlacement * Number.MAX_SAFE_INTEGER : date.getTime();
}

function dateTimeValue(value, emptyPlacement = 1) {
  if (!value) {
    return emptyPlacement * Number.MAX_SAFE_INTEGER;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? emptyPlacement * Number.MAX_SAFE_INTEGER : date.getTime();
}

function compareNames(firstReferral, secondReferral) {
  return referralName(firstReferral).localeCompare(referralName(secondReferral));
}

function statusSortIndex(referral) {
  const key = statusGroupKey(referral.status);
  const order = ["new", "in-contact", "referral-scheduled", "watch", "closed"];
  const index = order.indexOf(key);
  return index === -1 ? order.length : index;
}

function clientStatusGroupKey(status = "Scheduled") {
  return clientStatusGroupColors[status] || "scheduled";
}

function clientStatusSortIndex(client) {
  const status = client.status || "Scheduled";
  const order = [
    "Needs Reschedule",
    "Scheduled",
    "Active",
    "Needs Language Support",
    "Waiting on Family",
    "Graduated",
    "Inactive",
    "Closed"
  ];
  const index = order.indexOf(status);
  return index === -1 ? order.length : index;
}

function sortReferrals(referrals) {
  const sorted = [...referrals];

  return sorted.sort((first, second) =>
    statusSortIndex(first) - statusSortIndex(second) ||
    dateValue(second.mostRecentContactDate, -1) - dateValue(first.mostRecentContactDate, -1) ||
    compareNames(first, second)
  );
}

function sortClients(clients) {
  const sorted = [...clients];

  return sorted.sort((first, second) =>
    clientStatusSortIndex(first) - clientStatusSortIndex(second) ||
    dateValue(first.lastAppointmentDate) - dateValue(second.lastAppointmentDate) ||
    clientName(first).localeCompare(clientName(second))
  );
}

const grantDocumentFields = [
  { type: "Completed Application", title: "Completed Application", formName: "completedApplicationUrl" },
  { type: "Grant Agreement", title: "Grant Agreement", formName: "grantAgreementUrl" },
  { type: "Budget", title: "Budget", formName: "budgetUrl" },
  { type: "Final Report", title: "Final Report", formName: "finalReportUrl" },
  { type: "Branding / Press Materials", title: "Branding / Logo / Press Info", formName: "brandingUrl" }
];
const grantOrgDocumentFields = [
  { type: "Board Roster", title: "Board of Directors Roster", formName: "boardRosterUrl" },
  { type: "DEI Statement", title: "DEI Statement", formName: "deiStatementUrl" },
  { type: "Youth Protection Policy", title: "Youth Protection Policy", formName: "youthProtectionPolicyUrl" },
  { type: "Data Sheets", title: "Data Sheets", formName: "dataSheetUrl" },
  { type: "CHA / CHIP", title: "Community Health Assessment / Improvement Plan", formName: "chaChipUrl" },
  { type: "Balance Sheet", title: "Balance Sheet", formName: "balanceSheetUrl" },
  { type: "Profit & Loss Statement", title: "Profit & Loss Statement", formName: "profitLossStatementUrl" },
  { type: "Annual Budget", title: "Annual Budget", formName: "annualBudgetDocumentUrl" },
  { type: "Strategic Plan", title: "Strategic Plan", formName: "strategicPlanUrl" },
  { type: "Annual Report", title: "Annual Report", formName: "annualReportUrl" }
];

function formatGrantCurrency(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(number);
}

function grantTitle(grant) {
  return grant.grantName || grant.foundationName || "Unnamed grant";
}

function grantSubtitle(grant) {
  return grant.grantName && grant.foundationName ? grant.foundationName : grant.status || "Grant";
}

function grantAmountRange(grant) {
  const min = formatGrantCurrency(grant.amountMin);
  const max = formatGrantCurrency(grant.amountMax);

  if (min && max) {
    return `${min} - ${max}`;
  }
  return min || max || "Range not set";
}

function grantAmountRequestedLabel(grant) {
  return formatGrantCurrency(grant.amountRequested);
}

function grantPreviewAmount(grant) {
  const status = grant.status || "Researching";
  const requested = grantAmountRequestedLabel(grant);

  if (requested && !["Researching", "Planning"].includes(status)) {
    return requested;
  }

  return grantAmountRange(grant);
}

function grantPreviewDate(grant) {
  const status = grant.status || "Researching";

  if (["Submitted", "Awarded", "Reporting"].includes(status)) {
    const awardDate = formatShortDate(grant.awardExpectedDate);
    return awardDate ? `Award expected ${awardDate}` : "";
  }

  return grantDeadlineLabel(grant, { short: true });
}

function grantDaysUntil(deadlineDate) {
  if (!deadlineDate) {
    return Number.POSITIVE_INFINITY;
  }

  const today = new Date(`${todayDateString()}T00:00:00`);
  const deadline = new Date(`${deadlineDate}T00:00:00`);

  if (Number.isNaN(deadline.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return Math.ceil((deadline.getTime() - today.getTime()) / 86400000);
}

function grantDeadlineSortValue(grant) {
  if (!grant.deadlineDate) {
    return Number.POSITIVE_INFINITY;
  }

  const time = normalizeAppointmentTime(grant.deadlineTime) || "00:00";
  const deadline = new Date(`${grant.deadlineDate}T${time}:00`);
  return Number.isNaN(deadline.getTime()) ? Number.POSITIVE_INFINITY : deadline.getTime();
}

function grantDeadlineLabel(grant, { short = false } = {}) {
  const date = short ? formatShortDate(grant.deadlineDate) : formatDateOnly(grant.deadlineDate);
  const time = formatAppointmentTime(grant.deadlineTime);

  if (date && time) {
    return `${date} at ${time}`;
  }

  return date || time || "";
}

function grantPreviousAwardLabel(grant) {
  if (!grant.pastGrantReceived) {
    return "-";
  }

  const amount = formatGrantCurrency(grant.pastGrantAmount) || "Yes";
  const date = formatDateOnly(grant.previousAwardDate) || (grant.pastGrantYear ? String(grant.pastGrantYear) : "");
  return date ? `${amount} (${date})` : amount;
}

function grantIsOpen(grant) {
  return !["Awarded", "Reporting", "Not A Good Fit", "Declined", "Closed"].includes(grant.status || "Researching");
}

function grantHasUpcomingDeadline(grant) {
  return grantIsOpen(grant) && (grant.status || "Researching") !== "Submitted" && Boolean(grant.deadlineDate);
}

function grantDocumentByType(documents = [], type) {
  return documents.find((document) => document.type === type) || null;
}

function grantDocumentDisplayName(documentLink = {}) {
  return documentLink.fileName || documentLink.title || documentLink.type || "Document";
}

function storageSafeSegment(value) {
  return String(value || "document")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "document";
}

async function uploadGrantDocumentFile(file, field) {
  if (!currentUser) {
    throw new Error("Please sign in before uploading grant documents.");
  }

  const owner = storageSafeSegment(currentUser.uid || currentUser.email || "user");
  const documentType = storageSafeSegment(field.type);
  const fileName = storageSafeSegment(file.name || field.title);
  const uploadId = typeof globalThis.crypto?.randomUUID === "function" ? globalThis.crypto.randomUUID() : `${Date.now()}`;
  const storagePath = `grant-documents/${owner}/${documentType}/${Date.now()}-${uploadId}-${fileName}`;
  const uploadRef = ref(storage, storagePath);

  await uploadBytes(uploadRef, file, {
    contentType: file.type || "application/octet-stream",
    customMetadata: {
      documentType: field.type,
      uploadedBy: currentUser.email || ""
    }
  });

  return {
    url: await getDownloadURL(uploadRef),
    storagePath
  };
}

function updateDocumentUploadStatus(form, field, documentLink = null) {
  const status = form.querySelector(`[data-document-status-for="${field.formName}"]`);
  if (!status) {
    return;
  }

  status.textContent = documentLink?.url ? `Current: ${grantDocumentDisplayName(documentLink)}` : "";
}

function bindGrantDocumentFileStatus(form, fields) {
  for (const field of fields) {
    const input = form.elements[field.formName];
    if (!input || input.dataset.statusBound === "true") {
      continue;
    }

    input.dataset.statusBound = "true";
    input.addEventListener("change", () => {
      const status = form.querySelector(`[data-document-status-for="${field.formName}"]`);
      if (status) {
        status.textContent = input.files?.[0] ? `Selected: ${input.files[0].name}` : "";
      }
    });
  }
}

async function documentFromUploadField(input, field, notes, existingDocument = null) {
  const file = input?.files?.[0];

  if (file) {
    const upload = await uploadGrantDocumentFile(file, field);
    return {
      type: field.type,
      title: field.title,
      url: upload.url,
      storagePath: upload.storagePath,
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
      notes
    };
  }

  if (input?.type === "file") {
    return existingDocument ? { ...existingDocument, notes: notes || existingDocument.notes || "" } : null;
  }

  const url = String(input?.value || "").trim();
  if (!url) {
    return existingDocument ? { ...existingDocument, notes: notes || existingDocument.notes || "" } : null;
  }

  return {
    type: field.type,
    title: field.title,
    url,
    notes
  };
}

async function documentsFromFixedFields(form, fields, notes = "", existingDocuments = []) {
  const documents = [];

  for (const field of fields) {
    const documentLink = await documentFromUploadField(
      form.elements[field.formName],
      field,
      notes,
      grantDocumentByType(existingDocuments, field.type)
    );

    if (documentLink?.url || documentLink?.fileName || documentLink?.notes) {
      documents.push(documentLink);
    }
  }

  if (notes && !documents.length) {
    documents.push({
      type: "Document Notes",
      title: "Document Notes",
      url: "",
      notes
    });
  }

  return documents;
}

function fillFixedDocumentFields(form, fields, documents = []) {
  for (const field of fields) {
    const documentLink = grantDocumentByType(documents, field.type);
    if (form.elements[field.formName]) {
      if (form.elements[field.formName].type !== "file") {
        form.elements[field.formName].value = documentLink?.url || "";
      }
      updateDocumentUploadStatus(form, field, documentLink);
    }
  }

  const notesDocument = documents.find((document) => document.type === "Document Notes");
  return notesDocument?.notes || documents.find((document) => document.notes)?.notes || "";
}

function grantMatchesSearch(grant) {
  const query = grantSearchInput.value.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return [
    grant.foundationName,
    grant.grantName,
    grant.status,
    grant.focusAreas,
    grant.contactName,
    grant.reportingRequirements,
    grant.notes
  ].some((value) => String(value || "").toLowerCase().includes(query));
}

function grantStatusClass(status) {
  return String(status || "Researching")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "researching";
}

function grantStatusGroupKey(status = "Researching") {
  const normalized = status || "Researching";
  const column = grantFlowColumns.find((item) => item.statuses.includes(normalized));

  if (column?.key === "upcoming") {
    return "grant-upcoming";
  }

  if (column?.key) {
    return `grant-${column.key}`;
  }

  return "grant-upcoming";
}

function grantStatusPill(status) {
  const pill = document.createElement("span");
  pill.className = `grant-status-pill status-${grantStatusClass(status)} status-group-${grantStatusGroupKey(status)}`;
  pill.textContent = status || "Researching";
  return pill;
}

function applyGrantStatusSelectColor(select, status) {
  for (const key of ["grant-upcoming", "grant-in-progress", "grant-submitted", "grant-awarded", "grant-closed"]) {
    select.classList.remove(`status-group-${key}`);
  }
  select.classList.add("status-select", "grant-status-select", `status-group-${grantStatusGroupKey(status)}`);
}

function createGrantStatusSelect(grant) {
  const select = document.createElement("select");
  select.className = "status-select grant-status-select";
  select.setAttribute("aria-label", "Grant status");

  for (const status of grantStatuses) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    option.className = `status-group-${grantStatusGroupKey(status)}`;
    select.append(option);
  }

  select.value = grant.status || "Researching";
  applyGrantStatusSelectColor(select, select.value);
  select.addEventListener("change", () => {
    applyGrantStatusSelectColor(select, select.value);
    updateGrantStatus(grant, select.value);
  });
  return select;
}

function grantProfileValue(value, fallback = "-") {
  return hasProfileValue(value) ? value : fallback;
}

function legacyPortalLoginPart(notes, label) {
  const pattern = new RegExp(`${label}:\\s*([^\\n]+)`, "i");
  return String(notes || "").match(pattern)?.[1]?.trim() || "";
}

function grantPortalLoginEmail(grant) {
  return grant.portalLoginEmail || legacyPortalLoginPart(grant.portalLoginNotes, "Email");
}

function grantPortalLoginPassword(grant) {
  return grant.portalLoginPassword || legacyPortalLoginPart(grant.portalLoginNotes, "Password");
}

function createGrantLink(label, url, downloadName = "") {
  if (!url) {
    return document.createTextNode("-");
  }

  const anchor = document.createElement("a");
  anchor.className = "grant-profile-link";
  anchor.href = url;
  if (downloadName || url.startsWith("data:")) {
    anchor.download = downloadName || label;
  } else {
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
  }
  anchor.textContent = label;
  return anchor;
}

function createGrantDocumentList(grant) {
  const list = document.createElement("div");
  list.className = "grant-profile-link-list";

  for (const documentLink of grant.documents || []) {
    if (!documentLink.url) {
      continue;
    }

    list.append(createGrantLink(grantDocumentDisplayName(documentLink), documentLink.url, documentLink.fileName || ""));
  }

  if (!list.children.length) {
    const empty = document.createElement("span");
    empty.className = "empty-inline";
    empty.textContent = "No documents uploaded yet.";
    list.append(empty);
  }

  return list;
}

function renderGrantDetail() {
  clearElement(grantDetail);
  const grant = loadedGrants.find((item) => item.id === selectedGrantId);

  if (!grant) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "Select a grant to view details.";
    grantDetail.append(empty);
    return;
  }

  const topbar = document.createElement("div");
  topbar.className = "client-profile-topbar";
  const heading = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Grant Profile";
  const title = document.createElement("h3");
  title.textContent = grantTitle(grant);
  heading.append(eyebrow, title);

  const actions = document.createElement("div");
  actions.className = "detail-actions form-actions";
  const edit = document.createElement("button");
  edit.type = "button";
  edit.textContent = "Edit";
  edit.addEventListener("click", () => startEditGrant(grant.id));
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "danger-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteCurrentGrant(grant.id));
  const close = document.createElement("button");
  close.type = "button";
  close.className = "secondary-button";
  close.textContent = "Close";
  close.addEventListener("click", closeGrantModal);
  actions.append(edit, deleteButton, close);
  topbar.append(heading, actions);

  const profileGrid = document.createElement("div");
  profileGrid.className = "grant-profile-grid";

  const overview = document.createElement("section");
  overview.className = "grant-profile-panel";
  const overviewHeader = document.createElement("h3");
  overviewHeader.textContent = grant.foundationName || "Foundation";
  const overviewFields = document.createElement("div");
  overviewFields.className = "client-field-grid";
  [
    ["Status", createGrantStatusSelect(grant)],
    ["Opens", formatDateOnly(grant.openDate)],
    ["Deadline", grantDeadlineLabel(grant)],
    ["Award Expected", formatDateOnly(grant.awardExpectedDate)],
    ["Amount Requested", grantAmountRequestedLabel(grant)],
    ["Range", grantAmountRange(grant)],
    ["Recurs", grantProfileValue(grant.recurrence)],
    ["Past Award", grantPreviousAwardLabel(grant)]
  ].forEach(([labelText, value]) => {
    const field = document.createElement("div");
    field.className = "client-profile-field";
    const label = document.createElement("span");
    label.textContent = labelText;
    const strong = document.createElement("strong");
    if (value instanceof Node) {
      strong.append(value);
    } else {
      strong.textContent = value;
    }
    field.append(label, strong);
    overviewFields.append(field);
  });
  overview.append(overviewHeader, overviewFields);

  const details = document.createElement("div");
  details.className = "idea-list";
  const contactRows = [
    { label: "Name", value: grant.contactName },
    { label: "Email", value: grant.contactEmail },
    { label: "Secondary", value: grant.secondaryContactName },
    { label: "Secondary Email", value: grant.secondaryContactEmail },
    { label: "Website", value: createGrantLink("Website", grant.websiteUrl), alwaysShow: true },
    { label: "Portal", value: createGrantLink("Portal", grant.portalUrl), alwaysShow: true },
    { label: "Login Email", value: grantPortalLoginEmail(grant) },
    { label: "Password", value: grantPortalLoginPassword(grant) }
  ];
  details.append(
    renderProfileDetailCard("Focus", [
      { label: "Areas", value: grantProfileValue(grant.focusAreas), alwaysShow: true }
    ], "var(--brand-green)"),
    renderProfileDetailCard("Contact and Portal", contactRows, "var(--brand-teal)"),
    renderProfileDetailCard("Reporting", [
      { label: "Requirements", value: grantProfileValue(grant.reportingRequirements), alwaysShow: true }
    ], "var(--brand-blue)"),
    renderProfileDetailCard("Documents", [
      { label: "Links", value: createGrantDocumentList(grant), alwaysShow: true },
      { label: "Branding", value: grant.brandingNotes },
      { label: "Notes", value: (grant.documents || []).find((documentLink) => documentLink.notes)?.notes }
    ], "var(--brand-purple)"),
    renderProfileDetailCard("Notes", [
      { label: "Grant", value: grantProfileValue(grant.notes), alwaysShow: true }
    ], "var(--brand-orange)")
  );

  profileGrid.append(overview, details);
  grantDetail.append(topbar, profileGrid);
}

function renderGrants() {
  renderGrantsSummary();
  renderGrantFlow(loadedGrants);
  renderGrantDeadlines();
  renderGrantList();
  renderGrantQuestions();
  if (selectedGrantId && grantDetail && !grantDetail.hidden) {
    renderGrantDetail();
  }
  fillGrantOrganizationForm();
}

function renderGrantsSummary() {
  clearElement(grantsSummary);
  const openGrants = loadedGrants.filter(grantIsOpen);
  const dueSoon = loadedGrants.filter((grant) => {
    if (!grantHasUpcomingDeadline(grant)) {
      return false;
    }
    const days = grantDaysUntil(grant.deadlineDate);
    return days >= 0 && days <= 45;
  });
  const submitted = loadedGrants.filter((grant) => (grant.status || "") === "Submitted");
  const awarded = loadedGrants.filter((grant) => ["Awarded", "Reporting"].includes(grant.status || ""));
  const metrics = [
    { label: "Open Grants", value: openGrants.length },
    { label: "Due in 45 Days", value: dueSoon.length },
    { label: "Submitted", value: submitted.length },
    { label: "Awarded", value: awarded.length }
  ];

  for (const metric of metrics) {
    const item = document.createElement("div");
    item.className = "summary-item";
    const value = document.createElement("strong");
    value.textContent = metric.value;
    const label = document.createElement("span");
    label.textContent = metric.label;
    item.append(value, label);
    grantsSummary.append(item);
  }
}

function renderGrantDeadlines() {
  clearElement(grantDeadlineList);
  const upcoming = loadedGrants
    .filter(grantHasUpcomingDeadline)
    .sort((first, second) => grantDeadlineSortValue(first) - grantDeadlineSortValue(second))
    .slice(0, 10);

  if (!upcoming.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No upcoming grant deadlines yet.";
    grantDeadlineList.append(empty);
    return;
  }

  for (const grant of upcoming) {
    const row = document.createElement("button");
    row.className = "dashboard-list-item grant-deadline-item";
    row.type = "button";
    row.addEventListener("click", () => openGrantProfile(grant.id));

    const content = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = grantTitle(grant);
    const detail = document.createElement("span");
    const days = grantDaysUntil(grant.deadlineDate);
    detail.textContent = `${grantSubtitle(grant)} | ${days < 0 ? "Past due" : `${days} day${days === 1 ? "" : "s"}`} | ${grantPreviewAmount(grant)}`;
    content.append(title, detail);

    const date = document.createElement("span");
    date.className = "dashboard-item-date";
    date.textContent = grantDeadlineLabel(grant, { short: true });
    row.append(content, date);
    grantDeadlineList.append(row);
  }
}

function renderGrantList() {
  clearElement(grantsList);
  const grants = loadedGrants
    .filter(grantMatchesSearch)
    .sort((first, second) => grantDeadlineSortValue(first) - grantDeadlineSortValue(second) || grantTitle(first).localeCompare(grantTitle(second)));

  if (!grants.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = loadedGrants.length ? "No grants match this search." : "No grants saved yet.";
    grantsList.append(empty);
    return;
  }

  for (const grant of grants) {
    const card = document.createElement("button");
    card.className = "grant-card grant-list-row";
    card.type = "button";
    card.addEventListener("click", () => openGrantProfile(grant.id));

    const copy = document.createElement("span");
    copy.className = "grant-list-copy";
    const title = document.createElement("h4");
    title.textContent = grantTitle(grant);
    const subtitle = document.createElement("p");
    subtitle.textContent = grantSubtitle(grant);
    copy.append(title, subtitle);
    card.append(copy, grantStatusPill(grant.status));
    grantsList.append(card);
  }
}

function renderGrantQuestions() {
  clearElement(grantQuestionList);

  if (!loadedGrantQuestions.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No reusable grant answers saved yet.";
    grantQuestionList.append(empty);
    return;
  }

  for (const question of loadedGrantQuestions) {
    const item = document.createElement("details");
    item.className = "grant-question-item";
    const summary = document.createElement("summary");
    const title = document.createElement("strong");
    title.textContent = question.prompt || "Untitled question";
    const meta = document.createElement("span");
    meta.textContent = `${question.category || "General"}${question.targetLimit ? ` | ${question.targetLimit}` : ""}`;
    summary.append(title, meta);

    const answer = document.createElement("p");
    answer.textContent = question.answer || "";
    const actions = document.createElement("div");
    actions.className = "grant-question-actions";
    const copy = document.createElement("button");
    copy.className = "secondary-button compact-button";
    copy.type = "button";
    copy.textContent = "Copy";
    copy.addEventListener("click", () => copyGrantAnswer(question.answer || ""));
    const edit = document.createElement("button");
    edit.className = "secondary-button compact-button";
    edit.type = "button";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => startEditGrantQuestion(question.id));
    const deleteButton = document.createElement("button");
    deleteButton.className = "secondary-button compact-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteGrantQuestion(question.id));
    actions.append(copy, edit, deleteButton);

    if (question.notes) {
      const notes = document.createElement("small");
      notes.textContent = question.notes;
      item.append(summary, answer, notes, actions);
    } else {
      item.append(summary, answer, actions);
    }
    grantQuestionList.append(item);
  }
}

function fillGrantOrganizationForm() {
  if (!grantOrgForm || !loadedGrantOrganizationInfo) {
    return;
  }

  const info = loadedGrantOrganizationInfo;
  for (const name of [
    "legalName",
    "dbaName",
    "ein",
    "mailingAddress",
    "yearFounded",
    "websiteUrl",
    "socialMediaLinks",
    "fundingStructure",
    "mission",
    "vision",
    "guidingPrinciples",
    "organizationDescription",
    "populationServed",
    "annualBudget",
    "dataNotes"
  ]) {
    if (grantOrgForm.elements[name]) {
      grantOrgForm.elements[name].value = info[name] || "";
    }
  }
  fillFixedDocumentFields(grantOrgForm, grantOrgDocumentFields, info.documents || []);
}

function renderClinicSnapshot() {
  clearElement(clinicSnapshotSummary);
  clearElement(clinicSnapshotMetrics);
  clearElement(clinicSnapshotNoNext);

  const today = todayDateString();
  const currentYear = today.slice(0, 4);
  const convertedClients = loadedClients.filter((client) => client.sourceReferralId);
  const totalReferralCount = loadedReferrals.length + convertedClients.length;
  const currentClients = loadedClients.filter((client) => !["Closed", "Inactive", "Graduated"].includes(client.status || "Scheduled"));
  const nonClosedClients = loadedClients.filter((client) => (client.status || "Scheduled") !== "Closed");
  const graduatedYtd = loadedClients.filter(
    (client) => (client.status || "Scheduled") === "Graduated" && String(client.lastAppointmentDate || "").startsWith(currentYear)
  );
  const clientsWithoutNextAppointment = loadedClients.filter((client) =>
    ["Active", "Needs Reschedule", "Waiting on Family", "Needs Language Support"].includes(client.status || "Scheduled") &&
    !hasFutureAppointment(client)
  );
  const yccoClients = nonClosedClients.filter((client) => truthyProfileValue(client.ycco));
  const englishClients = nonClosedClients.filter((client) => String(client.preferredLanguage || "").toLowerCase() === "english");
  const spanishClients = nonClosedClients.filter((client) => String(client.preferredLanguage || "").toLowerCase() === "spanish");
  const otherLanguageCount = Math.max(nonClosedClients.length - englishClients.length - spanishClients.length, 0);
  const startedClients = loadedClients.filter((client) => {
    const status = client.status || "Scheduled";
    return (
      client.firstAppointmentDate ||
      clientAppointments(client).length ||
      ["Active", "Needs Reschedule", "Needs Language Support", "Waiting on Family", "Graduated", "Inactive", "Closed"].includes(status)
    );
  });
  const retainedClients = startedClients.filter((client) => !["Inactive", "Closed"].includes(client.status || "Scheduled"));

  const metrics = [
    { label: "Total Referrals", value: totalReferralCount },
    { label: "Active Clients", value: currentClients.length },
    { label: "Conversion Rate", value: percentage(convertedClients.length, totalReferralCount) },
    { label: "Graduated YTD", value: graduatedYtd.length }
  ];

  for (const metric of metrics) {
    const item = document.createElement("div");
    item.className = "summary-item dashboard-summary-item";
    const value = document.createElement("strong");
    value.textContent = metric.value;
    const label = document.createElement("span");
    label.textContent = metric.label;
    item.append(value, label);
    clinicSnapshotSummary.append(item);
  }

  clinicSnapshotMetrics.append(
    renderDashboardMetricCard({
      title: "YCCO",
      center: `${percentageNumber(yccoClients.length, nonClosedClients.length)}%`,
      detail: `${yccoClients.length} of ${nonClosedClients.length} non-closed clients`,
      segments: [{ value: percentageNumber(yccoClients.length, nonClosedClients.length), color: "var(--brand-yellow)" }]
    }),
    renderDashboardMetricCard({
      title: "Language Mix",
      center: `${percentageNumber(englishClients.length, nonClosedClients.length)}% EN`,
      detail: `${englishClients.length} English | ${spanishClients.length} Spanish${otherLanguageCount ? ` | ${otherLanguageCount} other` : ""}`,
      segments: [
        { value: percentageNumber(englishClients.length, nonClosedClients.length), color: "var(--brand-green)" },
        { value: percentageNumber(spanishClients.length, nonClosedClients.length), color: "var(--brand-blue)" }
      ]
    }),
    renderDashboardMetricCard({
      title: "Retention Rate",
      center: `${percentageNumber(retainedClients.length, startedClients.length)}%`,
      detail: `${retainedClients.length} of ${startedClients.length} clients active or graduated after starting`,
      segments: [{ value: percentageNumber(retainedClients.length, startedClients.length), color: "var(--brand-purple)" }]
    })
  );

  const noNextItems = clientsWithoutNextAppointment
    .map((client) => ({
      type: "Client",
      title: clientName(client),
      detail: client.status || "Active",
      date: client.mostRecentContactDate || client.firstContactDate || client.referralDate || client.createdAt || "",
      action: () => setSelectedClient(client.id)
    }))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  renderDashboardList(clinicSnapshotNoNext, noNextItems, "No active clients missing an appointment.");
}

function renderDashboardMetricCard({ title, center, detail, segments }) {
  const card = document.createElement("section");
  card.className = "dashboard-metric-card";

  const ring = document.createElement("div");
  ring.className = "dashboard-ring";
  ring.style.background = dashboardRingGradient(segments);
  const centerLabel = document.createElement("strong");
  centerLabel.textContent = center;
  ring.append(centerLabel);

  const copy = document.createElement("div");
  const heading = document.createElement("h4");
  heading.textContent = title;
  const detailText = document.createElement("p");
  detailText.textContent = detail;
  copy.append(heading, detailText);

  card.append(ring, copy);
  return card;
}

function dashboardRingGradient(segments) {
  let current = 0;
  const stops = [];

  for (const segment of segments) {
    const value = Math.max(Number(segment.value) || 0, 0);
    const end = Math.min(current + value, 100);
    if (end > current) {
      stops.push(`${segment.color} ${current}% ${end}%`);
    }
    current = end;
  }

  stops.push(`#edf2ef ${current}% 100%`);
  return `conic-gradient(${stops.join(", ")})`;
}

function currentKpiActuals() {
  const today = todayDateString();
  const currentYear = today.slice(0, 4);
  const nonClosedClients = loadedClients.filter((client) => (client.status || "Scheduled") !== "Closed");
  const startedClients = loadedClients.filter((client) => {
    const status = client.status || "Scheduled";
    return (
      client.firstAppointmentDate ||
      clientAppointments(client).length ||
      ["Active", "Needs Reschedule", "Needs Language Support", "Waiting on Family", "Graduated", "Inactive", "Closed"].includes(status)
    );
  });
  const retainedClients = startedClients.filter((client) => !["Inactive", "Closed"].includes(client.status || "Scheduled"));
  const completedAppointmentCount = loadedAppointments.filter((appointment) => appointment.status === "Completed").length;
  const noShowAppointmentCount = loadedAppointments.filter((appointment) => appointment.status === "No-show").length;
  const classEvents = loadedOutreachEvents.filter((event) => {
    const type = String(event.type || "").toLowerCase();
    const name = outreachEventName(event).toLowerCase();
    return type.includes("class") || name.includes("class");
  });
  const schoolEvents = loadedOutreachEvents.filter((event) => {
    const haystack = [event.type, event.name, event.location].join(" ").toLowerCase();
    return haystack.includes("school") || haystack.includes("classroom");
  });

  return {
    clinicClients: loadedClients.length,
    programGraduates: loadedClients.filter(
      (client) => (client.status || "Scheduled") === "Graduated" && String(client.lastAppointmentDate || "").startsWith(currentYear)
    ).length,
    appointments: loadedAppointments.filter((appointment) => String(appointment.appointmentDate || "").startsWith(currentYear)).length,
    spanishClients: nonClosedClients.filter((client) => String(client.preferredLanguage || "").toLowerCase() === "spanish").length,
    retentionRate: percentage(retainedClients.length, startedClients.length),
    noShowRate: percentage(noShowAppointmentCount, completedAppointmentCount + noShowAppointmentCount),
    classClients: classEvents.reduce((sum, event) => sum + numberValue(event.participantListCount), 0),
    classes: classEvents.length,
    schoolClients: schoolEvents.reduce((sum, event) => sum + numberValue(event.participantListCount), 0),
    schoolPartnerships: new Set(schoolEvents.map((event) => event.location || outreachEventName(event)).filter(Boolean)).size
  };
}

function kpiTargetNumber(value) {
  const numeric = Number(String(value || "").replace(/[$,%\s,]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
}

function kpiProgressPercent(actual, target, lowerIsBetter = false) {
  const actualValue = kpiTargetNumber(actual);
  const targetValue = kpiTargetNumber(target);

  if (!targetValue) {
    return 0;
  }

  if (lowerIsBetter) {
    return Math.min(Math.round((targetValue / Math.max(actualValue, 1)) * 100), 100);
  }

  return Math.min(Math.round((actualValue / targetValue) * 100), 100);
}

function renderKpiSummary() {
  clearElement(kpiSummary);
  const actuals = currentKpiActuals();
  const metrics = [
    { label: "Clinic Clients", value: actuals.clinicClients },
    { label: "Graduates YTD", value: actuals.programGraduates },
    { label: "Appointments", value: actuals.appointments },
    { label: "Retention", value: actuals.retentionRate },
    { label: "No Show Rate", value: actuals.noShowRate },
    { label: "Revenue YTD", value: "$4,248" }
  ];

  for (const metric of metrics) {
    const item = document.createElement("div");
    item.className = "summary-item";
    const value = document.createElement("strong");
    value.textContent = metric.value;
    const label = document.createElement("span");
    label.textContent = metric.label;
    item.append(value, label);
    kpiSummary.append(item);
  }
}

function renderKpiProgressList() {
  clearElement(kpiProgressList);
  const actuals = currentKpiActuals();
  const progressRows = [
    organizationKpiRows.find((row) => row.key === "clinicClients"),
    organizationKpiRows.find((row) => row.key === "programGraduates"),
    organizationKpiRows.find((row) => row.key === "appointments"),
    organizationKpiRows.find((row) => row.key === "retentionRate"),
    organizationKpiRows.find((row) => row.key === "noShowRate"),
    revenueKpiRows.find((row) => row.key === "totalRevenue")
  ].filter(Boolean);

  for (const row of progressRows) {
    const actual = row.actual2026 || actuals[row.key] || "0";
    const progress = kpiProgressPercent(actual, row.target2026, row.lowerIsBetter);
    const item = document.createElement("article");
    item.className = "kpi-progress-item";

    const copy = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = row.label;
    const detail = document.createElement("span");
    detail.textContent = `Current ${actual} | 2026 target ${row.target2026}`;
    copy.append(title, detail);

    const bar = document.createElement("div");
    bar.className = "kpi-progress-bar";
    const fill = document.createElement("span");
    fill.style.width = `${progress}%`;
    bar.append(fill);

    const percent = document.createElement("span");
    percent.className = "kpi-progress-percent";
    percent.textContent = `${progress}%`;
    item.append(copy, bar, percent);
    kpiProgressList.append(item);
  }
}

function renderKpiTable(container, rows, { actuals = {}, includeLiveActuals = false } = {}) {
  clearElement(container);
  const table = document.createElement("div");
  table.className = "kpi-table-grid";
  const headings = ["KPI", "2025 Baseline", "2026 Target", "Current", "Q2 Goal", "2027 Target", "2028 Target"];

  for (const heading of headings) {
    const cell = document.createElement("span");
    cell.className = "kpi-table-heading";
    cell.textContent = heading;
    table.append(cell);
  }

  for (const row of rows) {
    const actual = includeLiveActuals ? actuals[row.key] ?? row.actual2026 ?? "-" : row.actual2026 ?? "-";
    for (const value of [
      row.label,
      row.baseline2025 || "-",
      row.target2026 || "-",
      actual,
      row.q2Goal || "-",
      row.target2027 || "-",
      row.target2028 || "-"
    ]) {
      const cell = document.createElement("span");
      cell.className = "kpi-table-cell";
      cell.textContent = value;
      table.append(cell);
    }
  }

  container.append(table);
}

function renderProgramKpiDrafts() {
  clearElement(programKpiList);
  for (const label of programKpiDrafts) {
    const item = document.createElement("article");
    item.className = "kpi-draft-item";
    const title = document.createElement("strong");
    title.textContent = label;
    const tag = document.createElement("span");
    tag.textContent = "Needs definition";
    item.append(title, tag);
    programKpiList.append(item);
  }
}

function renderAdminKpi() {
  renderKpiSummary();
  renderClinicSnapshot();
  renderKpiProgressList();
  renderKpiTable(organizationKpiTable, organizationKpiRows, { actuals: currentKpiActuals(), includeLiveActuals: true });
  renderKpiTable(revenueKpiTable, revenueKpiRows);
  renderProgramKpiDrafts();
}

function adminDataCount(definition) {
  if (dataToolsCounts && Number.isFinite(Number(dataToolsCounts[definition.key]))) {
    return Number(dataToolsCounts[definition.key]);
  }

  return definition.getRecords().length;
}

function renderAdminDataTools() {
  clearElement(dataToolsList);

  for (const definition of adminDataToolDefinitions) {
    const card = document.createElement("article");
    card.className = "data-tool-card";
    card.style.setProperty("--data-tool-accent", definition.accent);

    const copy = document.createElement("div");
    copy.className = "data-tool-copy";
    const title = document.createElement("h3");
    title.textContent = definition.label;
    const detail = document.createElement("p");
    detail.textContent = definition.detail;
    const count = document.createElement("strong");
    count.textContent = String(adminDataCount(definition));
    const countLabel = document.createElement("span");
    countLabel.textContent = "records";
    copy.append(title, detail);

    const countWrap = document.createElement("div");
    countWrap.className = "data-tool-count";
    countWrap.append(count, countLabel);

    const actions = document.createElement("div");
    actions.className = "data-tool-actions";

    if (definition.onImport) {
      const importButton = document.createElement("button");
      importButton.className = "secondary-button compact-button";
      importButton.type = "button";
      importButton.textContent = "Import CSV";
      importButton.addEventListener("click", definition.onImport);
      actions.append(importButton);
    }

    const exportButton = document.createElement("button");
    exportButton.className = "secondary-button compact-button";
    exportButton.type = "button";
    exportButton.textContent = "Export JSON";
    exportButton.addEventListener("click", () => exportAdminData(definition));

    const deleteButton = document.createElement("button");
    deleteButton.className = "danger-button compact-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Delete All";
    deleteButton.addEventListener("click", () => deleteAdminDataCollection(definition));

    actions.append(exportButton, deleteButton);
    card.append(copy, countWrap, actions);
    dataToolsList.append(card);
  }
}

async function loadDataToolsCounts() {
  if (!currentUser) {
    return;
  }

  refreshDataToolsButton.disabled = true;
  dataToolsStatusEl.textContent = "Refreshing counts...";

  try {
    const response = await authedFetch("/api/admin/data-counts");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    dataToolsCounts = data.counts || {};
    renderAdminDataTools();
    dataToolsStatusEl.textContent = "Counts refreshed.";
  } catch (error) {
    dataToolsStatusEl.textContent = "Could not refresh counts.";
    console.error(error);
  } finally {
    refreshDataToolsButton.disabled = false;
  }
}

function downloadJsonFile(fileName, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportAdminData(definition) {
  dataToolsStatusEl.textContent = `Exporting ${definition.label.toLowerCase()}...`;

  try {
    const response = await authedFetch(`/api/admin/export/${definition.key}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    const date = todayDateString();
    downloadJsonFile(`snack-${definition.key}-${date}.json`, data);
    dataToolsStatusEl.textContent = `Exported ${definition.label.toLowerCase()}.`;
  } catch (error) {
    dataToolsStatusEl.textContent = error.message || `Could not export ${definition.label.toLowerCase()}.`;
    console.error(error);
  }
}

async function reloadOperationalData() {
  await Promise.all([
    loadReferrals(),
    loadClients(),
    loadReferralNetwork(),
    loadAppointments(),
    loadTasks(),
    loadActivityLogs()
  ]);
}

async function deleteAdminDataCollection(definition) {
  const recordCount = adminDataCount(definition);
  const confirmation = window.prompt(
    `Delete all ${definition.label.toLowerCase()} (${recordCount} records)? Type ${adminDeleteConfirmationPhrase} to confirm.`
  );

  if (confirmation !== adminDeleteConfirmationPhrase) {
    dataToolsStatusEl.textContent = "Delete canceled.";
    return;
  }

  dataToolsStatusEl.textContent = `Deleting ${definition.label.toLowerCase()}...`;

  try {
    const response = await authedFetch("/api/admin/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        collections: [definition.key],
        confirmation
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `API returned ${response.status}`);
    }

    const result = await response.json();
    await reloadOperationalData();
    await loadDataToolsCounts();
    dataToolsStatusEl.textContent = `Deleted ${result.deleted?.[definition.key] || 0} ${definition.label.toLowerCase()} records.`;
  } catch (error) {
    dataToolsStatusEl.textContent = error.message || `Could not delete ${definition.label.toLowerCase()}.`;
    console.error(error);
  }
}

function timeFromMinutes(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

function latestSchedulingStartLabel(settings = normalizeSchedulingSettings(defaultSchedulingSettings)) {
  const latestStart = settings.bookableEndMinutes - (settings.defaultDurationMinutes || defaultAppointmentDurationMinutes);
  return formatAppointmentTime(timeFromMinutes(latestStart));
}

function schedulingSettingsStatusText(settings = normalizeSchedulingSettings(defaultSchedulingSettings)) {
  const dayLabels = schedulingWeekdayLabels("short", settings.weekdays).join(", ");
  return `${dayLabels} starts offered ${formatAppointmentTime(settings.bookableStartTime)} - ${latestSchedulingStartLabel(settings)}.`;
}

function setSchedulingSettingsFormValues(raw = defaultSchedulingSettings) {
  if (!adminSchedulingSettingsForm) {
    return;
  }

  const settings = normalizeSchedulingSettings(raw);

  adminSchedulingSettingsForm.querySelectorAll('input[name="weekdays"]').forEach((field) => {
    field.checked = settings.weekdays.includes(Number(field.value));
  });
  adminSchedulingSettingsForm.elements.officeStartTime.value = settings.officeStartTime;
  adminSchedulingSettingsForm.elements.officeEndTime.value = settings.officeEndTime;
  adminSchedulingSettingsForm.elements.bookableStartTime.value = settings.bookableStartTime;
  adminSchedulingSettingsForm.elements.bookableEndTime.value = settings.bookableEndTime;
  adminSchedulingSettingsForm.elements.defaultDurationMinutes.value = String(settings.defaultDurationMinutes);
  adminSchedulingSettingsForm.elements.slotIntervalMinutes.value = String(settings.slotIntervalMinutes);

  if (adminSchedulingSettingsStatus) {
    adminSchedulingSettingsStatus.textContent = schedulingSettingsStatusText(settings);
  }
}

function schedulingSettingsFormPayload() {
  const formData = new FormData(adminSchedulingSettingsForm);

  return {
    weekdays: formData.getAll("weekdays").map((value) => Number(value)),
    officeStartTime: formData.get("officeStartTime"),
    officeEndTime: formData.get("officeEndTime"),
    bookableStartTime: formData.get("bookableStartTime"),
    bookableEndTime: formData.get("bookableEndTime"),
    defaultDurationMinutes: Number(formData.get("defaultDurationMinutes")),
    slotIntervalMinutes: Number(formData.get("slotIntervalMinutes"))
  };
}

function refreshSchedulingViewsAfterSettingsChange() {
  renderAppointmentTimeOptions();
  renderAppointments();

  if (activeModule === "scheduling") {
    renderSchedulingDesign();
  }
}

async function loadSchedulingSettings() {
  if (!currentUser || !adminSchedulingSettingsForm) {
    applySchedulingSettings(defaultSchedulingSettings);
    setSchedulingSettingsFormValues(defaultSchedulingSettings);
    return;
  }

  try {
    const response = await authedFetch("/api/admin/scheduling-settings");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const settings = applySchedulingSettings(data.schedulingSettings || defaultSchedulingSettings);
    setSchedulingSettingsFormValues(settings);
    refreshSchedulingViewsAfterSettingsChange();
  } catch (error) {
    applySchedulingSettings(defaultSchedulingSettings);
    setSchedulingSettingsFormValues(defaultSchedulingSettings);
    if (adminSchedulingSettingsStatus) {
      adminSchedulingSettingsStatus.textContent = "Using default scheduling settings for now.";
    }
    console.error(error);
  }
}

async function saveSchedulingSettings(event) {
  event.preventDefault();

  if (!currentUser || !adminSchedulingSettingsForm) {
    return;
  }

  const payload = schedulingSettingsFormPayload();
  const previewSettings = normalizeSchedulingSettings(payload);

  if (!payload.weekdays.length) {
    adminSchedulingSettingsStatus.textContent = "Choose at least one appointment day.";
    return;
  }

  adminSchedulingSettingsSaveButton.disabled = true;
  adminSchedulingSettingsStatus.textContent = "Saving scheduling settings...";

  try {
    const response = await authedFetch("/api/admin/scheduling-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    const settings = applySchedulingSettings(data.schedulingSettings || payload);
    setSchedulingSettingsFormValues(settings);
    refreshSchedulingViewsAfterSettingsChange();
    adminSchedulingSettingsStatus.textContent = `Saved. ${schedulingSettingsStatusText(settings)}`;
  } catch (error) {
    adminSchedulingSettingsStatus.textContent = error.message || "Could not save scheduling settings.";
    console.error(error);
  } finally {
    adminSchedulingSettingsSaveButton.disabled = false;
  }
}

function workPlanStatusClass(status) {
  return String(status || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderWorkPlanSummary() {
  clearElement(workPlanSummary);
  const statusCounts = ["Complete", "In Progress", "Not Started", "DNF"].map((status) => ({
    label: status,
    value: workPlanItems.filter((item) => item.status === status).length
  }));

  for (const metric of statusCounts) {
    const item = document.createElement("div");
    item.className = "summary-item";
    const value = document.createElement("strong");
    value.textContent = metric.value;
    const label = document.createElement("span");
    label.textContent = metric.label;
    item.append(value, label);
    workPlanSummary.append(item);
  }
}

function renderWorkPlan() {
  renderWorkPlanSummary();
  clearElement(workPlanList);

  for (const quarter of ["Q1", "Q2", "Q3", "Q4"]) {
    const section = document.createElement("section");
    section.className = "work-plan-quarter";
    const heading = document.createElement("h4");
    heading.textContent = quarter;
    const items = document.createElement("div");
    items.className = "work-plan-items";

    for (const workItem of workPlanItems.filter((item) => item.quarter === quarter)) {
      const row = document.createElement("article");
      row.className = "work-plan-item";
      const action = document.createElement("strong");
      action.textContent = workItem.action;
      const status = document.createElement("span");
      status.className = `work-plan-status status-${workPlanStatusClass(workItem.status)}`;
      status.textContent = workItem.status;
      row.append(action, status);
      items.append(row);
    }

    section.append(heading, items);
    workPlanList.append(section);
  }
}

function renderActiveAdminComputedViews() {
  if (activeModule !== "admin") {
    return;
  }

  if (activeAdminView === "kpi") {
    renderAdminKpi();
  } else if (activeAdminView === "work-plan") {
    renderWorkPlan();
  } else if (activeAdminView === "data-tools") {
    renderAdminDataTools();
  }
}

function renderDashboardAppointmentWeek() {
  const today = new Date(`${todayDateString()}T00:00:00`);
  const weekDates = Array.from({ length: 5 }, (_, index) => addDays(today, index));
  const appointmentsByDate = new Map(weekDates.map((date) => [toDateString(date), []]));

  for (const appointment of loadedAppointments) {
    if (!appointmentsByDate.has(appointment.appointmentDate)) {
      continue;
    }

    appointmentsByDate.get(appointment.appointmentDate).push(appointment);
  }

  for (const date of weekDates) {
    const dateKey = toDateString(date);
    const appointments = (appointmentsByDate.get(dateKey) || []).sort(
      (first, second) =>
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime) ||
        appointmentClientName(first).localeCompare(appointmentClientName(second))
    );

    const day = document.createElement("section");
    day.className = "dashboard-day";
    day.setAttribute("aria-label", formatWeekdayDate(date));

    const header = document.createElement("div");
    header.className = "dashboard-day-title";
    const title = document.createElement("strong");
    title.textContent = formatWeekdayDate(date);
    const count = document.createElement("span");
    count.className = "dashboard-day-count";
    count.textContent = `${appointments.length} appt${appointments.length === 1 ? "" : "s"}`;
    header.append(title, count);
    day.append(header);

    if (!appointments.length) {
      const empty = document.createElement("p");
      empty.className = "empty-inline";
      empty.textContent = "Nothing scheduled.";
      day.append(empty);
    }

    for (const appointment of appointments) {
      const isNutrition = Boolean(String(appointment.lesson || "").trim());
      const item = document.createElement("button");
      item.className = `dashboard-appt ${isNutrition ? "dashboard-appt-nutrition" : "dashboard-appt-enrollment"}`;
      item.style.setProperty("--appointment-accent", appointmentLessonAccent(appointment));
      item.type = "button";
      item.addEventListener("click", () => {
        setActiveModule("scheduling");
        setSelectedAppointment(appointment.id);
      });

      const name = document.createElement("strong");
      name.textContent = appointmentClientName(appointment);
      const detail = document.createElement("span");
      const type = [appointmentTypeLabel(appointment), appointmentLessonLabel(appointment)].filter(Boolean).join(" ");
      detail.textContent = [formatAppointmentTime(appointment.appointmentTime), type].filter(Boolean).join(" | ");
      item.append(name, detail);
      day.append(item);
    }

    dashboardAppointmentsWeek.append(day);
  }
}

function renderDashboardAttention({ newReferrals, referralFollowUps, clientFollowUps, clientsWithoutNextAppointment }) {
  const missingFormsCount = loadedClients.filter((client) => (client.status || "Scheduled") === "Scheduled").length;
  const languageSupportCount = loadedClients.filter((client) => client.status === "Needs Language Support").length;
  const rescheduleCount = loadedClients.filter((client) => client.status === "Needs Reschedule").length;
  const attentionItems = [
    {
      label: "Stale referrals",
      detail: "New or contacted referrals waiting for next outreach",
      value: newReferrals.length + referralFollowUps.length,
      color: "var(--brand-red)"
    },
    {
      label: "Needs reschedule",
      detail: "Clients whose next appointment fell through",
      value: rescheduleCount,
      color: "var(--brand-orange)"
    },
    {
      label: "No next appointment",
      detail: "Active clients without a scheduled next visit",
      value: clientsWithoutNextAppointment.length,
      color: "var(--brand-yellow)"
    },
    {
      label: "Language support",
      detail: "Spanish or interpretation follow-up needed",
      value: languageSupportCount,
      color: "var(--brand-teal)"
    },
    {
      label: "Missing forms",
      detail: "Enrollment paperwork signal placeholder",
      value: missingFormsCount,
      color: "var(--brand-blue)"
    },
    {
      label: "Needs review",
      detail: "Appointment notes and workflow review placeholder",
      value: clientFollowUps.length,
      color: "var(--brand-purple)"
    }
  ];

  dashboardAttention.innerHTML = "";

  for (const item of attentionItems) {
    const row = document.createElement("div");
    row.className = "attention-item";
    row.style.setProperty("--attention-accent", item.color);
    const copy = document.createElement("div");
    const label = document.createElement("strong");
    label.textContent = item.label;
    const detail = document.createElement("span");
    detail.textContent = item.detail;
    copy.append(label, detail);
    const count = document.createElement("span");
    count.className = "attention-count";
    count.textContent = String(item.value);
    row.append(copy, count);
    dashboardAttention.append(row);
  }
}

function renderDashboardWorkflow({ newReferrals, referralFollowUps, clientFollowUps, clientsWithoutNextAppointment }) {
  const columns = [
    {
      title: "Today",
      items: [
        { label: "Call new referrals", detail: `${newReferrals.length} waiting for first contact`, tag: "CRM" },
        { label: "Confirm appointments", detail: `${loadedAppointments.filter((appointment) => appointment.appointmentDate === todayDateString()).length} scheduled today`, tag: "Sched" }
      ]
    },
    {
      title: "Follow up",
      items: [
        { label: "Reschedule list", detail: `${clientFollowUps.length} clients need attention`, tag: "Client" },
        { label: "Voicemails and texts", detail: `${referralFollowUps.length} referrals in contact`, tag: "Calls" }
      ]
    },
    {
      title: "Later",
      items: [
        { label: "Review notes", detail: "Placeholder until workflow is live", tag: "TBD" },
        { label: "No next appointment", detail: `${clientsWithoutNextAppointment.length} active clients to review`, tag: "Appts" }
      ]
    }
  ];

  dashboardWorkflow.innerHTML = "";

  for (const column of columns) {
    const section = document.createElement("section");
    section.className = "workflow-column";
    const heading = document.createElement("h4");
    heading.textContent = column.title;
    section.append(heading);

    for (const item of column.items) {
      const row = document.createElement("div");
      row.className = "workflow-item";
      const copy = document.createElement("div");
      const label = document.createElement("strong");
      label.textContent = item.label;
      const detail = document.createElement("span");
      detail.textContent = item.detail;
      copy.append(label, detail);
      const tag = document.createElement("span");
      tag.className = "workflow-tag";
      tag.textContent = item.tag;
      row.append(copy, tag);
      section.append(row);
    }

    dashboardWorkflow.append(section);
  }
}

function taskClientName(task) {
  const client = loadedClients.find((item) => item.id === task.clientId);
  return client ? clientName(client) : task.clientName || "";
}

function taskReferralName(task) {
  const referral = loadedReferrals.find((item) => item.id === task.referralId);
  return referral ? referralName(referral) : "";
}

function taskRelatedRecord(task) {
  if (task.clientId) {
    return loadedClients.find((item) => item.id === task.clientId) || null;
  }

  if (task.referralId) {
    return loadedReferrals.find((item) => item.id === task.referralId) || null;
  }

  return null;
}

function taskRelatedName(task) {
  if (task.clientId || task.clientName) {
    return taskClientName(task);
  }

  if (task.referralId) {
    return taskReferralName(task);
  }

  return "";
}

function contactPrefersText(record) {
  return /\b(text|sms)\b/i.test(record?.preferredContactMethod || "");
}

function contactActionVerb(record) {
  return contactPrefersText(record) ? "Text" : "Call";
}

function isRescheduleTask(task) {
  return Boolean(task.clientId && /\breschedule\b/i.test(task.title || ""));
}

function taskDisplayTitle(task) {
  const rawTitle = task.title || "Untitled task";
  const relatedName = taskRelatedName(task);
  const referralLabel = taskReferralName(task);

  if (isRescheduleTask(task) && relatedName) {
    return `Reschedule ${relatedName}`;
  }

  if (task.referralId && referralLabel && /about SNACK referral/i.test(rawTitle)) {
    return `Schedule ${referralLabel}`;
  }

  if (task.referralId && referralLabel && /\bnew referral\b/i.test(rawTitle)) {
    return `Schedule ${referralLabel}`;
  }

  return rawTitle.replace(/\bto reschedule\b/i, "to Reschedule");
}

function taskContactLines(task) {
  const record = taskRelatedRecord(task);
  if (!record) {
    return [formatTaskDue(task), task.assignedTo ? `Assigned: ${task.assignedTo}` : ""].filter(Boolean);
  }

  const contactLine = [record.parentName, record.phone ? formatPhone(record.phone) : ""].filter(Boolean).join(" | ");
  const dueLine = formatTaskDue(task);
  const lines = [];

  if (contactLine) {
    lines.push(contactLine);
  }
  if (dueLine) {
    lines.push(dueLine);
  }
  if (task.assignedTo) {
    lines.push(`Assigned: ${task.assignedTo}`);
  }

  return lines;
}

function isGeneratedTaskNote(task) {
  const note = String(task.notes || "").trim().toLowerCase();
  return note === "client is on the needs reschedule list." || note === "new referral follow-up.";
}

function taskNotePreview(task) {
  const note = String(task.notes || "").trim();

  if (!note || isGeneratedTaskNote(task)) {
    return "";
  }

  if (/^prep list for/i.test(note)) {
    const lines = note.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const prepItems = lines.filter((line) => line.startsWith("-"));
    const summary = lines[0]
      .replace(/^Prep list for\s*/i, "")
      .replace(/:$/, "")
      .trim();
    const count = prepItems.length;
    return `${summary || "Prep list"} - ${count} prep item${count === 1 ? "" : "s"}.`;
  }

  return note;
}

function taskColumnKey(task) {
  const title = taskDisplayTitle(task).toLowerCase();
  const type = task.type || "";
  const record = taskRelatedRecord(task);

  if (type === "Text" || title.startsWith("text ") || (isRescheduleTask(task) && contactPrefersText(record))) {
    return "texts";
  }

  if (type === "Form" || title.includes(" form")) {
    return "forms";
  }

  if (type === "Call" || type === "Schedule" || title.startsWith("call ")) {
    return "calls";
  }

  return "tasks";
}

function taskColumnConfig(task) {
  const key = typeof task === "string" ? task : taskColumnKey(task);
  return taskFlowColumns.find((column) => column.key === key) || taskFlowColumns[taskFlowColumns.length - 1];
}

function taskPriorityRank(task) {
  const priority = task.priority || "Normal";
  if (priority === "Urgent") {
    return 0;
  }
  if (priority === "Normal") {
    return 1;
  }
  return 2;
}

function taskStatusRank(task) {
  const status = task.status || "Open";
  const rank = {
    Open: 0,
    "In Progress": 1,
    Waiting: 2,
    Done: 3,
    Canceled: 4
  };
  return rank[status] ?? 5;
}

function taskDueValue(task) {
  if (!task.dueDate) {
    return Number.MAX_SAFE_INTEGER;
  }
  return dateValue(task.dueDate);
}

function compareWorkflowTasks(first, second) {
  return (
    taskDueValue(first) - taskDueValue(second) ||
    taskPriorityRank(first) - taskPriorityRank(second) ||
    taskStatusRank(first) - taskStatusRank(second) ||
    taskDisplayTitle(first).localeCompare(taskDisplayTitle(second))
  );
}

function isActiveTask(task) {
  return ["Open", "In Progress", "Waiting"].includes(task.status || "Open");
}

function isGeneratedWorkflowTask(task) {
  return ["Start the Day", "Polish Queue"].includes(task.source || "");
}

function isArchivedTask(task) {
  return ["Done", "Canceled"].includes(task.status || "Open");
}

function formatTaskDue(task) {
  if (!task.dueDate) {
    return "";
  }

  return formatListDate(task.dueDate);
}

function renderTaskRelatedOptions(selectedId = "") {
  taskRelatedOptions.innerHTML = "";
  const isReferral = taskRelatedTypeSelect.value === "referral";
  const records = isReferral
    ? [...loadedReferrals].sort((first, second) => referralName(first).localeCompare(referralName(second)))
    : [...loadedClients].sort((first, second) => clientName(first).localeCompare(clientName(second)));

  for (const record of records) {
    const option = document.createElement("option");
    option.value = isReferral ? referralName(record) : clientName(record);
    taskRelatedOptions.append(option);
  }

  const selectedRecord = records.find((record) => record.id === selectedId);
  taskRelatedSearchInput.value = selectedRecord ? (isReferral ? referralName(selectedRecord) : clientName(selectedRecord)) : "";
}

function resolveTaskRelatedId() {
  const query = taskRelatedSearchInput.value.trim().toLowerCase();
  const isReferral = taskRelatedTypeSelect.value === "referral";
  const selectedRecord = isReferral
    ? loadedReferrals.find((referral) => referralName(referral).toLowerCase() === query)
    : loadedClients.find((client) => clientName(client).toLowerCase() === query);
  taskClientIdInput.value = !isReferral && selectedRecord ? selectedRecord.id : "";
  taskReferralIdInput.value = isReferral && selectedRecord ? selectedRecord.id : "";
  syncTaskProfileButton();
  return selectedRecord?.id || "";
}

function selectedTaskRelatedRecord() {
  if (taskRelatedTypeSelect.value === "referral") {
    return loadedReferrals.find((referral) => referral.id === taskReferralIdInput.value) || null;
  }

  return loadedClients.find((client) => client.id === taskClientIdInput.value) || null;
}

function syncTaskProfileButton() {
  const relatedRecord = selectedTaskRelatedRecord();
  openTaskProfileButton.hidden = !relatedRecord;
  openTaskProfileButton.textContent = "Profile";
}

function taskTypeForColumn(task) {
  const columnKey = taskColumnKey(task);
  return taskTypeForColumnKey(columnKey);
}

function taskTypeForColumnKey(columnKey) {
  if (columnKey === "texts") {
    return "Text";
  }
  if (columnKey === "forms") {
    return "Form";
  }
  if (columnKey === "calls") {
    return "Call";
  }
  return "Task";
}

function openTaskRelatedProfile() {
  const isReferral = taskRelatedTypeSelect.value === "referral";
  const relatedId = isReferral ? taskReferralIdInput.value : taskClientIdInput.value;

  if (!relatedId) {
    return;
  }

  closeTaskModal();
  if (isReferral) {
    setSelectedReferral(relatedId);
    return;
  }
  setSelectedClient(relatedId);
}

function openTaskModal() {
  taskModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeTaskModal() {
  const wasOpen = !taskModal.hidden;
  taskModal.hidden = true;
  if (wasOpen) {
    document.body.classList.remove("modal-open");
  }
  editingTaskId = null;
  taskForm.reset();
  renderWorkflowTasks();
}

function resetTaskForm(defaults = {}) {
  editingTaskId = null;
  taskForm.reset();
  taskFormTitle.textContent = "New Task";
  saveTaskButton.textContent = "Save Task";
  cancelTaskEditButton.hidden = false;
  deleteTaskButton.hidden = true;
  taskRelatedTypeSelect.value = defaults.referralId ? "referral" : "client";
  taskForm.elements.type.value = defaults.type || "Call";
  taskForm.elements.status.value = defaults.status || "Open";
  taskForm.elements.priority.value = defaults.priority || "Normal";
  taskForm.elements.source.value = defaults.source || "Manual";
  taskForm.elements.title.value = defaults.title || "";
  taskForm.elements.dueDate.value = defaults.dueDate || "";
  taskForm.elements.assignedTo.value = defaults.assignedTo || "";
  taskForm.elements.appointmentId.value = defaults.appointmentId || "";
  taskForm.elements.referralId.value = defaults.referralId || "";
  taskForm.elements.clientId.value = defaults.clientId || "";
  taskForm.elements.notes.value = defaults.notes || "";
  renderTaskRelatedOptions(defaults.referralId || defaults.clientId || "");
  syncTaskProfileButton();
}

function startNewTask(defaults = {}) {
  resetTaskForm(defaults);
  openTaskModal();
}

function playTaskCompleteSound() {
  try {
    if (!window.Audio) {
      return;
    }

    taskCompletionAudio = taskCompletionAudio || new Audio(taskCompleteSoundUrl);
    taskCompletionAudio.preload = "auto";

    const audio = taskCompletionAudio.cloneNode(true);
    audio.volume = 0.85;
    const stopTimer = window.setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, taskCompleteSoundDurationMs);
    audio.addEventListener("ended", () => window.clearTimeout(stopTimer), { once: true });

    const playPromise = audio.play();
    if (playPromise?.catch) {
      playPromise.catch((error) => console.warn("Could not play task complete sound.", error));
    }
  } catch (error) {
    console.warn("Could not play task complete sound.", error);
  }
}

function hideTaskUndoToast() {
  if (taskUndoTimeoutId) {
    window.clearTimeout(taskUndoTimeoutId);
    taskUndoTimeoutId = null;
  }

  pendingTaskUndo = null;
  taskUndoToast.hidden = true;
}

function showTaskUndoToast(task, previousStatus) {
  if (!taskUndoToast || !taskUndoButton) {
    return;
  }

  if (taskUndoTimeoutId) {
    window.clearTimeout(taskUndoTimeoutId);
  }

  pendingTaskUndo = {
    taskId: task.id,
    task: { ...task },
    previousStatus: previousStatus || "Open"
  };
  taskUndoMessage.textContent = `${taskDisplayTitle(task)} marked done.`;
  taskUndoToast.hidden = false;
  taskUndoTimeoutId = window.setTimeout(hideTaskUndoToast, 6000);
}

async function undoTaskCompletion() {
  if (!pendingTaskUndo) {
    return;
  }

  const undo = pendingTaskUndo;
  const task = loadedTasks.find((item) => item.id === undo.taskId) || undo.task;
  hideTaskUndoToast();
  await updateTaskStatus(task, undo.previousStatus, { statusMessage: "Task restored.", skipUndo: true });
}

function setTaskFormValues(task) {
  editingTaskId = task.id;
  taskFormTitle.textContent = "Edit Task";
  saveTaskButton.textContent = "Update Task";
  cancelTaskEditButton.hidden = false;
  deleteTaskButton.hidden = false;
  taskRelatedTypeSelect.value = task.referralId ? "referral" : "client";
  taskForm.elements.title.value = taskDisplayTitle(task);
  taskForm.elements.type.value = taskTypeForColumn(task);
  taskForm.elements.status.value = task.status || "Open";
  taskForm.elements.priority.value = task.priority || "Normal";
  taskForm.elements.dueDate.value = task.dueDate || "";
  taskForm.elements.assignedTo.value = task.assignedTo || "";
  taskForm.elements.appointmentId.value = task.appointmentId || "";
  taskForm.elements.referralId.value = task.referralId || "";
  taskForm.elements.clientId.value = task.clientId || "";
  taskForm.elements.source.value = task.source || "Manual";
  taskForm.elements.notes.value = isGeneratedTaskNote(task) ? "" : task.notes || "";
  renderTaskRelatedOptions(task.referralId || task.clientId || "");
  syncTaskProfileButton();
  openTaskModal();
}

function renderTaskSummary() {
  workflowTaskSummary.innerHTML = "";
  const today = todayDateString();
  const activeTasks = loadedTasks.filter(isActiveTask);
  const overdueCount = activeTasks.filter((task) => task.dueDate && task.dueDate < today).length;
  const dueTodayCount = activeTasks.filter((task) => task.dueDate === today).length;
  const urgentCount = activeTasks.filter((task) => task.priority === "Urgent").length;
  const totals = [
    { label: "Overdue", value: overdueCount, color: "var(--brand-red)" },
    { label: "Urgent", value: urgentCount, color: "var(--brand-orange)" },
    { label: "Due Today", value: dueTodayCount, color: "var(--brand-yellow)" },
    { label: "Active", value: activeTasks.length, color: "var(--brand-green)" }
  ];

  for (const total of totals) {
    const item = document.createElement("div");
    item.className = "summary-item task-summary-item";
    item.style.setProperty("--summary-accent", total.color);
    const value = document.createElement("strong");
    value.textContent = String(total.value);
    const label = document.createElement("span");
    label.textContent = total.label;
    item.append(value, label);
    workflowTaskSummary.append(item);
  }
}

function renderTaskBadge(text, className) {
  const badge = document.createElement("span");
  badge.className = `task-badge ${className}`;
  badge.textContent = text;
  return badge;
}

function taskColumnHeader({ label, color }, count) {
  const header = document.createElement("div");
  header.className = "task-column-header";
  header.style.setProperty("--task-column-accent", color);
  const title = document.createElement("h4");
  title.textContent = label;
  const total = document.createElement("span");
  total.textContent = String(count);
  header.append(title, total);
  return header;
}

function renderTaskCard(task, options = {}) {
  const draggable = options.draggable !== false;
  const row = document.createElement("article");
  row.className = "task-item";
  row.draggable = draggable;
  row.style.setProperty("--task-accent", taskColumnConfig(task).color);
  if (!isActiveTask(task)) {
    row.classList.add("done");
  }
  if (task.id === editingTaskId) {
    row.classList.add("selected");
  }
  if (draggable) {
    row.addEventListener("dragstart", (event) => {
      row.classList.add("is-dragging");
      row.dataset.dragging = "true";
      setSnackDragData(event, { kind: "workflow-task", id: task.id });
    });
    row.addEventListener("dragend", () => {
      row.classList.remove("is-dragging");
      clearSnackDragData();
      window.setTimeout(() => {
        delete row.dataset.dragging;
      }, 0);
    });
  }

  const checkButton = document.createElement("button");
  checkButton.className = "task-check";
  checkButton.type = "button";
  checkButton.setAttribute("aria-label", `${isActiveTask(task) ? "Complete" : "Reopen"} ${taskDisplayTitle(task)}`);
  checkButton.addEventListener("click", () => {
    const nextStatus = isActiveTask(task) ? "Done" : "Open";
    const previousStatus = task.status || "Open";
    if (nextStatus === "Done") {
      playTaskCompleteSound();
    }
    updateTaskStatus(task, nextStatus, { previousStatus, showUndo: nextStatus === "Done" });
  });

  const main = document.createElement("button");
  main.className = "task-main";
  main.type = "button";
  main.addEventListener("click", () => {
    if (row.dataset.dragging === "true") {
      return;
    }
    if (!flowArchiveModal.hidden) {
      closeFlowArchive();
    }
    setTaskFormValues(task);
  });

  const titleRow = document.createElement("span");
  titleRow.className = "task-title-row";
  const title = document.createElement("strong");
  title.textContent = taskDisplayTitle(task);
  titleRow.append(title);

  const badges = [];
  if ((task.priority || "Normal") !== "Normal") {
    badges.push(renderTaskBadge(task.priority || "Normal", `priority-${String(task.priority || "Normal").toLowerCase()}`));
  }
  if ((task.status || "Open") !== "Open") {
    badges.push(renderTaskBadge(task.status || "Open", `status-${String(task.status || "Open").toLowerCase().replace(/\s+/g, "-")}`));
  }

  main.append(titleRow);

  const detailLines = taskContactLines(task);
  if (detailLines.length) {
    const meta = document.createElement("span");
    meta.className = "task-detail-lines";
    for (const line of detailLines) {
      const lineEl = document.createElement("span");
      lineEl.textContent = line;
      meta.append(lineEl);
    }
    main.append(meta);
  }

  if (badges.length) {
    const badgeRow = document.createElement("span");
    badgeRow.className = "task-badges";
    badgeRow.append(...badges);
    main.append(badgeRow);
  }

  const notePreview = taskNotePreview(task);
  if (notePreview) {
    const notes = document.createElement("p");
    notes.textContent = notePreview;
    main.append(notes);
  }

  row.append(checkButton, main);
  return row;
}

function renderWorkflowTasks() {
  renderTaskSummary();
  workflowTaskList.innerHTML = "";

  const activeTasks = loadedTasks
    .filter(isActiveTask)
    .sort(compareWorkflowTasks);
  const archivedTasks = loadedTasks
    .filter(isArchivedTask)
    .sort(compareWorkflowTasks);

  const tasksByColumn = taskFlowColumns.reduce((groups, column) => ({ ...groups, [column.key]: [] }), {});

  for (const task of activeTasks) {
    tasksByColumn[taskColumnKey(task)].push(task);
  }

  const board = document.createElement("div");
  board.className = "task-column-board";

  for (const column of taskFlowColumns) {
    const columnTasks = tasksByColumn[column.key].sort(compareWorkflowTasks);
    const section = document.createElement("section");
    section.className = "task-column";
    bindDropZone(section, {
      kind: "workflow-task",
      onDrop: (payload) => moveTaskToColumn(payload.id, column.key)
    });
    section.append(taskColumnHeader(column, columnTasks.length));

    const body = document.createElement("div");
    body.className = "task-column-body";

    if (!columnTasks.length) {
      const empty = document.createElement("p");
      empty.className = "empty-inline";
      empty.textContent = "Nothing here.";
      body.append(empty);
    }

    for (const task of columnTasks) {
      body.append(renderTaskCard(task));
    }

    section.append(body);
    board.append(section);
  }

  workflowTaskList.append(board);
  workflowTaskList.append(renderTaskArchive(archivedTasks));
}

function renderTaskArchive(tasks) {
  const archive = document.createElement("button");
  archive.className = "flow-archive task-archive";
  archive.type = "button";
  archive.style.setProperty("--flow-accent", "var(--brand-blue)");
  archive.addEventListener("click", () => {
    openFlowArchive({
      eyebrow: "Workflow",
      title: "Closed / Canceled Tasks",
      description: "",
      records: tasks,
      accent: "var(--brand-blue)",
      cardFor: (task) => renderTaskCard(task, { draggable: false })
    });
  });

  const copy = document.createElement("div");
  const heading = document.createElement("h4");
  heading.textContent = "Closed / Canceled Tasks Archive";
  copy.append(heading);

  const count = document.createElement("span");
  count.className = "flow-archive-count";
  count.textContent = `${tasks.length} archived`;

  archive.append(copy, count);
  return archive;
}

function renderDashboardList(container, items, emptyText) {
  container.innerHTML = "";
  const heading = container.closest(".dashboard-card")?.querySelector("h3");

  if (heading) {
    heading.querySelector(".dashboard-section-count")?.remove();
    const count = document.createElement("span");
    count.className = "dashboard-section-count";
    count.textContent = String(items.length);
    heading.append(count);
  }

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = emptyText;
    container.append(empty);
    return;
  }

  for (const item of items) {
    const button = document.createElement("button");
    button.className = "dashboard-list-item";
    button.type = "button";
    button.addEventListener("click", item.action);

    const content = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = item.title;
    const detail = document.createElement("span");
    detail.textContent = item.detail;
    content.append(title, detail);

    const meta = document.createElement("span");
    meta.className = "dashboard-item-meta-wrap";
    const shortDate = formatShortDate(item.date);
    if (shortDate) {
      const date = document.createElement("span");
      date.className = "dashboard-item-date";
      date.textContent = shortDate;
      meta.append(date);
    }
    const type = document.createElement("span");
    type.className = `dashboard-item-type dashboard-item-type-${item.type.toLowerCase()}`;
    type.textContent = item.type;
    meta.append(type);

    button.append(content, meta);
    container.append(button);
  }
}

function setReferralView(view) {
  activeReferralView = view;
  saveNavigationState();
  renderReferrals();
}

function setClientView(view) {
  activeClientView = view;
  saveNavigationState();
  renderClients();
}

function updateViewToggle(listButton, flowButton, activeView) {
  const listActive = activeView === "list";
  listButton.classList.toggle("active", listActive);
  flowButton.classList.toggle("active", !listActive);
  listButton.setAttribute("aria-pressed", String(listActive));
  flowButton.setAttribute("aria-pressed", String(!listActive));
}

const snackDragMime = "application/x-snack-drag";
let activeSnackDragPayload = null;

function setSnackDragData(event, payload) {
  const serialized = JSON.stringify(payload);
  activeSnackDragPayload = payload;

  if (event.dataTransfer) {
    event.dataTransfer.setData(snackDragMime, serialized);
    event.dataTransfer.setData("text/plain", serialized);
    event.dataTransfer.effectAllowed = "move";
  }
}

function snackDragData(event) {
  const raw = event.dataTransfer?.getData(snackDragMime) || event.dataTransfer?.getData("text/plain");

  if (!raw) {
    return activeSnackDragPayload;
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return activeSnackDragPayload;
  }
}

function clearDragTargets() {
  document.querySelectorAll(".drag-over").forEach((element) => element.classList.remove("drag-over"));
}

function clearSnackDragData() {
  clearDragTargets();
  activeSnackDragPayload = null;
}

function bindDropZone(element, { kind, onDrop }) {
  element.addEventListener("dragover", (event) => {
    const payload = snackDragData(event);

    if (!payload || payload.kind !== kind) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = "move";
    element.classList.add("drag-over");
  });

  element.addEventListener("dragleave", (event) => {
    if (!element.contains(event.relatedTarget)) {
      element.classList.remove("drag-over");
    }
  });

  element.addEventListener("drop", async (event) => {
    const payload = snackDragData(event);

    if (!payload || payload.kind !== kind) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    clearSnackDragData();
    await onDrop(payload, event);
  });
}

function flowCard({ title, detail, meta, tag, accent, onOpen, dragData }) {
  const card = document.createElement("article");
  card.className = "flow-card";
  card.setAttribute("role", "button");
  card.tabIndex = 0;
  card.style.setProperty("--flow-accent", accent);
  if (dragData) {
    card.draggable = true;
    card.addEventListener("dragstart", (event) => {
      card.classList.add("is-dragging");
      card.dataset.dragging = "true";
      setSnackDragData(event, dragData);
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("is-dragging");
      clearSnackDragData();
      window.setTimeout(() => {
        delete card.dataset.dragging;
      }, 0);
    });
  }
  card.addEventListener("click", () => {
    if (card.dataset.dragging === "true") {
      return;
    }
    onOpen();
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  });

  const main = document.createElement("span");
  main.className = "flow-card-main";
  const titleEl = document.createElement("span");
  titleEl.className = "flow-card-title";
  titleEl.textContent = title;
  const detailEl = document.createElement("span");
  detailEl.className = "flow-card-detail";
  detailEl.textContent = detail;
  const metaEl = document.createElement("span");
  metaEl.className = "flow-card-meta";
  metaEl.textContent = meta;
  main.append(titleEl, detailEl, metaEl);
  card.append(main);

  if (tag) {
    const tagEl = document.createElement("span");
    tagEl.className = "flow-card-tag";
    tagEl.textContent = tag;
    card.append(tagEl);
  }

  return card;
}

function openFlowArchive({ eyebrow, title, description, records, accent, cardFor }) {
  flowArchiveEyebrow.textContent = eyebrow;
  flowArchiveTitle.textContent = title;
  flowArchiveDescription.textContent = description;
  flowArchiveDescription.hidden = !description;
  flowArchiveList.innerHTML = "";
  flowArchiveList.style.setProperty("--flow-accent", accent);

  if (!records.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Nothing archived here yet.";
    flowArchiveList.append(empty);
  } else {
    for (const record of records) {
      flowArchiveList.append(cardFor(record));
    }
  }

  flowArchiveModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeFlowArchive() {
  flowArchiveModal.hidden = true;
  flowArchiveList.innerHTML = "";
  document.body.classList.remove("modal-open");
}

function renderFlowBoard({ container, columns, records, statusFor, cardFor, dragKind, onColumnDrop }) {
  container.innerHTML = "";
  const activeColumns = columns.filter((column) => !column.archive);
  const archiveColumns = columns.filter((column) => column.archive);

  const lanes = document.createElement("div");
  lanes.className = "flow-lanes";

  for (const column of activeColumns) {
    const section = document.createElement("section");
    section.className = "flow-column";
    section.style.setProperty("--flow-accent", column.accent);
    section.style.setProperty("--flow-header-text", column.headerText || "#ffffff");
    if (dragKind && onColumnDrop && column.statuses.length) {
      bindDropZone(section, {
        kind: dragKind,
        onDrop: (payload) => onColumnDrop(payload, column)
      });
    }

    const header = document.createElement("div");
    header.className = "flow-column-header";
    const heading = document.createElement("h4");
    heading.textContent = column.label;
    const count = document.createElement("span");
    count.className = "flow-column-count";

    const columnRecords = records.filter((record) => column.statuses.includes(statusFor(record)));
    count.textContent = String(columnRecords.length);
    header.append(heading, count);
    section.append(header);

    if (!columnRecords.length) {
      const empty = document.createElement("p");
      empty.className = "empty-inline";
      empty.textContent = column.emptyText || (column.archive ? "Nothing archived here." : "Nothing in this lane.");
      section.append(empty);
    } else {
      for (const record of columnRecords) {
        section.append(cardFor(record, column));
      }
    }

    lanes.append(section);
  }

  container.append(lanes);

  if (archiveColumns.length) {
    const archiveWrap = document.createElement("div");
    archiveWrap.className = "flow-archives";

    for (const column of archiveColumns) {
      const columnRecords = records.filter((record) => column.statuses.includes(statusFor(record)));
      const archive = document.createElement("button");
      archive.className = "flow-archive";
      archive.type = "button";
      archive.style.setProperty("--flow-accent", column.accent);
      archive.addEventListener("click", () => {
        openFlowArchive({
          eyebrow: "Archive",
          title: column.label,
          description: column.description || "",
          records: columnRecords,
          accent: column.accent,
          cardFor: (record) => cardFor(record, column)
        });
      });

      const copy = document.createElement("div");
      const heading = document.createElement("h4");
      heading.textContent = column.label;
      if (column.description) {
        const description = document.createElement("p");
        description.textContent = column.description;
        copy.append(heading, description);
      } else {
        copy.append(heading);
      }

      const count = document.createElement("span");
      count.className = "flow-archive-count";
      count.textContent = `${columnRecords.length} ${column.countLabel || "archived"}`;

      archive.append(copy, count);
      archiveWrap.append(archive);
    }

    container.append(archiveWrap);
  }
}

function renderReferralFlow(referrals) {
  renderProfileV2List(referralFlowBoard, referrals, {
    name: referralName,
    status: (referral) => normalizeStatus(referral.status),
    selectedId: selectedReferralId,
    fallbackStatus: "New",
    emptyText: loadedReferrals.length ? "No referrals match the current filters." : "No referrals yet.",
    onOpen: (referral) => {
      if (!flowArchiveModal.hidden) {
        closeFlowArchive();
      }
      setSelectedReferral(referral.id);
    }
  });
}

function renderClientFlow(clients) {
  renderProfileV2List(clientFlowBoard, clients, {
    name: clientName,
    status: (client) => client.status || "Scheduled",
    selectedId: selectedClientId,
    fallbackStatus: "Scheduled",
    emptyText: loadedClients.length ? "No clients match the current search." : "No clients yet.",
    onOpen: (client) => {
      if (!flowArchiveModal.hidden) {
        closeFlowArchive();
      }
      setSelectedClient(client.id);
    }
  });
}

function renderGrantFlow(grants) {
  renderFlowBoard({
    container: grantFlowBoard,
    columns: grantFlowColumns,
    records: grants,
    statusFor: (grant) => grant.status || "Researching",
    dragKind: "grant-flow",
    onColumnDrop: (payload, column) => moveGrantToFlowColumn(payload.id, column),
    cardFor: (grant, column) =>
      flowCard({
        title: grantTitle(grant),
        detail: grantSubtitle(grant),
        meta: [grantPreviewDate(grant), grantPreviewAmount(grant)].filter(Boolean).join(" | "),
        tag: grant.status || "Researching",
        accent: column.accent,
        dragData: { kind: "grant-flow", id: grant.id },
        onOpen: () => {
          if (!flowArchiveModal.hidden) {
            closeFlowArchive();
          }
          openGrantProfile(grant.id);
        }
      })
  });
}

function renderOutreachEventFlow(events) {
  renderFlowBoard({
    container: outreachEventFlowBoard,
    columns: outreachEventFlowColumns,
    records: events,
    statusFor: outreachEventStatus,
    dragKind: "outreach-event-flow",
    onColumnDrop: (payload, column) => moveOutreachEventToFlowColumn(payload.id, column),
    cardFor: (event, column) =>
      flowCard({
        title: outreachEventName(event),
        detail: [event.type, event.location].filter(Boolean).join(" | ") || "Outreach",
        meta: [outreachEventStatus(event), formatShortDate(event.eventDate), event.repeatPattern].filter(Boolean).join(" | "),
        tag: outreachEventStatus(event),
        accent: column.accent,
        dragData: { kind: "outreach-event-flow", id: event.id },
        onOpen: () => {
          if (!flowArchiveModal.hidden) {
            closeFlowArchive();
          }
          setSelectedOutreachEvent(event.id);
        }
      })
  });
}

async function moveReferralToFlowColumn(referralId, column) {
  const referral = loadedReferrals.find((item) => item.id === referralId);
  const currentStatus = normalizeStatus(referral?.status);
  const nextStatus = column.statuses[0];

  if (!referral || !nextStatus || column.statuses.includes(currentStatus)) {
    return;
  }

  await updateReferralStatus(referral, nextStatus);
}

async function moveClientToFlowColumn(clientId, column) {
  const client = loadedClients.find((item) => item.id === clientId);
  const currentStatus = client?.status || "Scheduled";
  const nextStatus = column.statuses[0];

  if (!client || !nextStatus || column.statuses.includes(currentStatus)) {
    return;
  }

  await updateClientStatus(client, nextStatus);
}

async function moveGrantToFlowColumn(grantId, column) {
  const grant = loadedGrants.find((item) => item.id === grantId);
  const currentStatus = grant?.status || "Researching";
  const nextStatus = column.statuses[0];

  if (!grant || !nextStatus || column.statuses.includes(currentStatus)) {
    return;
  }

  await updateGrantStatus(grant, nextStatus);
}

async function moveOutreachEventToFlowColumn(eventId, column) {
  const event = loadedOutreachEvents.find((item) => item.id === eventId);
  const currentStatus = outreachEventStatus(event);
  const nextStatus = column.statuses[0];

  if (!event || !nextStatus || column.statuses.includes(currentStatus)) {
    return;
  }

  await updateOutreachEventStatus(event, nextStatus);
}

function setSelectedReferral(referralId) {
  selectedReferralId = referralId;
  referralForm.reset();
  editingReferralId = null;
  referralForm.hidden = true;
  referralDetail.hidden = false;
  syncModalCloseButton();
  openReferralModal();
  renderReferrals();
  renderReferralDetail();
}

function syncModalCloseButton() {
  closeReferralModalButton.hidden = !referralForm.hidden;
}

function openReferralModal() {
  referralModal.hidden = false;
  document.body.classList.add("modal-open");
  syncModalCloseButton();
}

function closeReferralModal() {
  referralModal.hidden = true;
  document.body.classList.remove("modal-open");
  editingReferralId = null;
  referralForm.reset();
  editingReferralProviderLinks = [];
  renderReferralProviderLinkEditor();
  referralForm.hidden = true;
  referralDetail.hidden = false;
  syncModalCloseButton();
  selectedReferralId = null;
  renderReferrals();
  setReferralsLoadedStatus();
}

function setActiveModule(moduleName) {
  if (moduleName === "crm-dashboard") {
    activeModule = "admin";
    activeAdminView = "kpi";
    saveNavigationState();
    setActiveModule("admin");
    return;
  }

  if (["referrals", "clients", "referral-network"].includes(moduleName)) {
    activeCrmView = moduleName;
    moduleName = "crm";
  }

  if (moduleName === "crm" && !["referrals", "clients", "referral-network"].includes(activeCrmView)) {
    activeCrmView = "referrals";
  }

  activeModule = moduleName;
  saveNavigationState();
  const showWorkflow = moduleName === "workflow";
  const showAdmin = moduleName === "admin";
  const showAdminSettings = showAdmin && activeAdminView === "settings";
  const showAdminDataTools = showAdmin && activeAdminView === "data-tools";
  const showAdminKpi = showAdmin && activeAdminView === "kpi";
  const showAdminWorkPlan = showAdmin && activeAdminView === "work-plan";
  const showFundraising = moduleName === "fundraising";
  const showFundraisingGrants = showFundraising && activeFundraisingView === "grants";
  const showFundraisingSales = showFundraising && activeFundraisingView === "sales";
  const showFundraisingIndividualGiving = showFundraising && activeFundraisingView === "individual-giving";
  const showFundraisingCorporatePartnerships = showFundraising && activeFundraisingView === "corporate-partnerships";
  const showFundraisingEvents = showFundraising && activeFundraisingView === "events";
  const showMarketing = moduleName === "marketing";
  const showOperations = moduleName === "operations";
  const showCrm = moduleName === "crm";
  const showReferrals = showCrm && activeCrmView === "referrals";
  const showClients = showCrm && activeCrmView === "clients";
  const showReferralNetwork = showCrm && activeCrmView === "referral-network";
  const showOutreach = moduleName === "outreach";
  const showScheduling = moduleName === "scheduling";
  workflowPanel.hidden = !showWorkflow;
  dashboardPanel.hidden = !showAdmin;
  fundraisingPanel.hidden = !showFundraising;
  marketingPanel.hidden = !showMarketing;
  operationsPanel.hidden = !showOperations;
  crmTabs.hidden = !showCrm;
  referralsPanel.hidden = !showReferrals;
  clientsPanel.hidden = !showClients;
  referralNetworkPanel.hidden = !showReferralNetwork;
  outreachPanel.hidden = !showOutreach;
  schedulingPanel.hidden = !showScheduling;
  if (!showScheduling) {
    document.body.classList.remove("scheduling-v2-preview-mode");
  }
  adminSettingsView.hidden = !showAdminSettings;
  adminDataToolsView.hidden = !showAdminDataTools;
  adminKpiView.hidden = !showAdminKpi;
  adminWorkPlanView.hidden = !showAdminWorkPlan;
  fundraisingGrantsView.hidden = !showFundraisingGrants;
  fundraisingSalesView.hidden = !showFundraisingSales;
  fundraisingIndividualGivingView.hidden = !showFundraisingIndividualGiving;
  fundraisingCorporatePartnershipsView.hidden = !showFundraisingCorporatePartnerships;
  fundraisingEventsView.hidden = !showFundraisingEvents;
  fundraisingGrantsActions.hidden = !showFundraisingGrants;
  dashboardTitle.textContent = showAdminDataTools ? "Data Tools" : showAdminKpi ? "KPI" : showAdminWorkPlan ? "Work Plan" : "Settings";
  fundraisingTitle.textContent = showFundraisingSales ? "Sales"
    : showFundraisingIndividualGiving ? "Individual Giving"
      : showFundraisingCorporatePartnerships ? "Corporate Partnerships"
        : showFundraisingEvents ? "Events"
          : "Grants";
  navWorkflowButton.classList.toggle("active", showWorkflow);
  navDashboardButton.classList.toggle("active", showAdmin);
  navCrmButton.classList.toggle("active", showCrm);
  navOutreachButton.classList.toggle("active", showOutreach);
  navFundraisingButton.classList.toggle("active", showFundraising);
  navMarketingButton.classList.toggle("active", showMarketing);
  navOperationsButton.classList.toggle("active", showOperations);
  navSchedulingButton.classList.toggle("active", showScheduling);
  navWorkflowButton.setAttribute("aria-current", showWorkflow ? "page" : "false");
  navDashboardButton.setAttribute("aria-current", showAdmin ? "page" : "false");
  navCrmButton.setAttribute("aria-current", showCrm ? "page" : "false");
  navOutreachButton.setAttribute("aria-current", showOutreach ? "page" : "false");
  navFundraisingButton.setAttribute("aria-current", showFundraising ? "page" : "false");
  navMarketingButton.setAttribute("aria-current", showMarketing ? "page" : "false");
  navOperationsButton.setAttribute("aria-current", showOperations ? "page" : "false");
  navSchedulingButton.setAttribute("aria-current", showScheduling ? "page" : "false");
  crmTabReferralsButton.classList.toggle("active", showReferrals);
  crmTabClientsButton.classList.toggle("active", showClients);
  crmTabReferralNetworkButton.classList.toggle("active", showReferralNetwork);
  adminTabSettingsButton.classList.toggle("active", showAdminSettings);
  adminTabDataToolsButton.classList.toggle("active", showAdminDataTools);
  adminTabKpiButton.classList.toggle("active", showAdminKpi);
  adminTabWorkPlanButton.classList.toggle("active", showAdminWorkPlan);
  fundraisingTabGrantsButton.classList.toggle("active", showFundraisingGrants);
  fundraisingTabSalesButton.classList.toggle("active", showFundraisingSales);
  fundraisingTabIndividualGivingButton.classList.toggle("active", showFundraisingIndividualGiving);
  fundraisingTabCorporatePartnershipsButton.classList.toggle("active", showFundraisingCorporatePartnerships);
  fundraisingTabEventsButton.classList.toggle("active", showFundraisingEvents);
  crmTabReferralsButton.setAttribute("aria-selected", String(showReferrals));
  crmTabClientsButton.setAttribute("aria-selected", String(showClients));
  crmTabReferralNetworkButton.setAttribute("aria-selected", String(showReferralNetwork));
  adminTabSettingsButton.setAttribute("aria-selected", String(showAdminSettings));
  adminTabDataToolsButton.setAttribute("aria-selected", String(showAdminDataTools));
  adminTabKpiButton.setAttribute("aria-selected", String(showAdminKpi));
  adminTabWorkPlanButton.setAttribute("aria-selected", String(showAdminWorkPlan));
  fundraisingTabGrantsButton.setAttribute("aria-selected", String(showFundraisingGrants));
  fundraisingTabSalesButton.setAttribute("aria-selected", String(showFundraisingSales));
  fundraisingTabIndividualGivingButton.setAttribute("aria-selected", String(showFundraisingIndividualGiving));
  fundraisingTabCorporatePartnershipsButton.setAttribute("aria-selected", String(showFundraisingCorporatePartnerships));
  fundraisingTabEventsButton.setAttribute("aria-selected", String(showFundraisingEvents));

  if (!showWorkflow) {
    closeTaskModal();
  }
  if (!showFundraising || !showFundraisingGrants) {
    closeGrantModal();
  }
  closeActivityLogModal();
  closeSiblingModal();

  if (showWorkflow) {
    closeReferralModal();
    closeClientModal();
    closeNetworkModal();
    closeOutreachModal();
    closeAppointmentModal();
    renderWorkflowTasks();
  } else if (showAdmin) {
    closeReferralModal();
    closeClientModal();
    closeNetworkModal();
    closeOutreachModal();
    closeAppointmentModal();
    if (showAdminDataTools) {
      renderAdminDataTools();
      loadDataToolsCounts();
    } else if (showAdminKpi) {
      renderAdminKpi();
    } else if (showAdminWorkPlan) {
      renderWorkPlan();
    }
  } else if (showFundraising) {
    closeReferralModal();
    closeClientModal();
    closeNetworkModal();
    closeOutreachModal();
    closeAppointmentModal();
    if (showFundraisingGrants) {
      renderGrants();
    }
  } else if (showMarketing || showOperations) {
    closeReferralModal();
    closeClientModal();
    closeNetworkModal();
    closeOutreachModal();
    closeAppointmentModal();
  } else if (showClients) {
    closeReferralModal();
    closeNetworkModal();
    closeOutreachModal();
    closeAppointmentModal();
    renderClients();
  } else if (showReferralNetwork) {
    closeReferralModal();
    closeClientModal();
    closeOutreachModal();
    closeAppointmentModal();
    renderReferralNetwork();
  } else if (showOutreach) {
    closeReferralModal();
    closeClientModal();
    closeNetworkModal();
    closeAppointmentModal();
    setOutreachView(activeOutreachView);
  } else if (showScheduling) {
    closeReferralModal();
    closeClientModal();
    closeNetworkModal();
    closeOutreachModal();
    renderAppointments();
  } else {
    closeClientModal();
    closeNetworkModal();
    closeOutreachModal();
    closeAppointmentModal();
    renderReferrals();
  }
}

function setCrmView(viewName) {
  activeCrmView = viewName;
  saveNavigationState();
  setActiveModule("crm");
}

function setAdminView(viewName) {
  activeAdminView = viewName;
  saveNavigationState();
  setActiveModule("admin");
}

function setFundraisingView(viewName) {
  activeFundraisingView = viewName;
  saveNavigationState();
  setActiveModule("fundraising");
}

function openClientModal() {
  clientModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeClientModal() {
  clientModal.hidden = true;
  document.body.classList.remove("modal-open");
  selectedClientId = null;
  editingClientId = null;
  clientForm.reset();
  editingClientProviderLinks = [];
  renderClientProviderLinkEditor();
  clientForm.hidden = true;
  clientDetail.hidden = false;
  renderClients();
  setClientsLoadedStatus();
}

function setSelectedClient(clientId) {
  selectedClientId = clientId;
  editingClientId = null;
  clientForm.reset();
  clientForm.hidden = true;
  clientDetail.hidden = false;
  openClientModal();
  renderClients();
  renderClientDetail();
}

function activityLogResultOptions(type) {
  return type === "Text"
    ? ["Sent", "Reply received", "Scheduled", "Requested call back", "No response", "Not interested"]
    : ["Scheduled", "Left voicemail", "No voicemail, call back", "Not interested, do not call back", "Requested call back", "Invalid number"];
}

function activityDirectionTitle(direction) {
  return direction === "Inbound" ? "Incoming" : "Outgoing";
}

function renderActivityLogResultOptions(type, selectedValue = "") {
  activityLogResultSelect.innerHTML = "";

  for (const optionText of activityLogResultOptions(type)) {
    const option = document.createElement("option");
    option.value = optionText;
    option.textContent = optionText;
    activityLogResultSelect.append(option);
  }

  activityLogResultSelect.value = selectedValue || activityLogResultSelect.options[0]?.value || "";
}

function syncActivityLogTitle() {
  const type = activityLogTypeInput.value || "Call";
  const direction = activityLogDirectionSelect.value || "Outbound";
  const relatedName = activityLogRelatedNameInput.value || "profile";
  activityLogTitleField.value = `${activityDirectionTitle(direction)} ${type} to ${relatedName}`;
}

function openActivityLogModal(record, moduleName, type) {
  const profileName = moduleName === "referrals" ? referralName(record) : clientName(record);
  const now = localDateTimeParts();
  activityLogForm.reset();
  activityLogTitle.textContent = `Log ${type}`;
  activityLogRelatedTypeInput.value = moduleName === "referrals" ? "referral" : "client";
  activityLogRelatedIdInput.value = record.id;
  activityLogRelatedNameInput.value = profileName;
  activityLogTypeInput.value = type;
  activityLogDirectionSelect.value = "Outbound";
  activityLogDateInput.value = now.date;
  activityLogTimeInput.value = formatAppointmentTime(now.time);
  renderActivityLogResultOptions(type);
  syncActivityLogTitle();
  activityLogModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeActivityLogModal() {
  activityLogModal.hidden = true;
  activityLogForm.reset();

  if (referralModal.hidden && clientModal.hidden && networkModal.hidden && outreachModal.hidden && outreachContactModal.hidden && appointmentModal.hidden && appointmentCompleteModal.hidden && appointmentCheckInModal.hidden && taskModal.hidden && siblingModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

function siblingModuleRecords(moduleName) {
  return moduleName === "clients" ? loadedClients : loadedReferrals;
}

function siblingModuleName(moduleName, record) {
  return moduleName === "clients" ? clientName(record) : referralName(record);
}

function availableSiblingCandidates(record, moduleName) {
  const siblingIds = Array.isArray(record.siblingIds) ? record.siblingIds : [];
  const linkedIds = new Set([record.id, ...siblingIds]);
  return siblingModuleRecords(moduleName)
    .filter((item) => !linkedIds.has(item.id))
    .sort((first, second) => siblingModuleName(moduleName, first).localeCompare(siblingModuleName(moduleName, second)));
}

function renderSiblingOptions(record, moduleName) {
  siblingOptions.innerHTML = "";

  for (const candidate of availableSiblingCandidates(record, moduleName)) {
    const option = document.createElement("option");
    option.value = siblingModuleName(moduleName, candidate);
    siblingOptions.append(option);
  }
}

function openSiblingModal(record, moduleName) {
  siblingForm.reset();
  siblingModuleInput.value = moduleName;
  siblingRecordIdInput.value = record.id;
  renderSiblingOptions(record, moduleName);
  siblingModal.hidden = false;
  document.body.classList.add("modal-open");
  siblingSearchInput.focus();
}

function closeSiblingModal() {
  siblingModal.hidden = true;
  siblingForm.reset();

  if (referralModal.hidden && clientModal.hidden && networkModal.hidden && outreachModal.hidden && outreachContactModal.hidden && appointmentModal.hidden && appointmentCompleteModal.hidden && appointmentCheckInModal.hidden && taskModal.hidden && activityLogModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

async function saveSiblingLink(event) {
  event.preventDefault();
  const moduleName = siblingModuleInput.value;
  const recordId = siblingRecordIdInput.value;
  const record = siblingModuleRecords(moduleName).find((item) => item.id === recordId);
  const typedName = siblingSearchInput.value.trim().toLowerCase();
  const candidate = record
    ? availableSiblingCandidates(record, moduleName).find((item) => siblingModuleName(moduleName, item).toLowerCase() === typedName)
    : null;
  const statusElement = moduleName === "clients" ? clientsStatusEl : referralsStatusEl;

  if (!record || !candidate) {
    statusElement.textContent = "Choose an existing profile from the sibling name list.";
    siblingSearchInput.focus();
    return;
  }

  saveSiblingLinkButton.disabled = true;
  try {
    await addSibling(moduleName, record.id, candidate.id);
    closeSiblingModal();
  } finally {
    saveSiblingLinkButton.disabled = false;
  }
}

function openNetworkModal() {
  networkModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeNetworkModal() {
  networkModal.hidden = true;
  document.body.classList.remove("modal-open");
  selectedNetworkEntryId = null;
  editingNetworkEntryId = null;
  networkForm.reset();
  networkForm.hidden = true;
  networkDetail.hidden = false;
  renderReferralNetwork();
}

function setSelectedNetworkEntry(entryId) {
  selectedNetworkEntryId = entryId;
  editingNetworkEntryId = null;
  networkForm.reset();
  networkForm.hidden = true;
  networkDetail.hidden = false;
  openNetworkModal();
  renderReferralNetwork();
  renderNetworkDetail();
}

function openOutreachModal() {
  outreachModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeOutreachModal() {
  outreachModal.hidden = true;
  document.body.classList.remove("modal-open");
  selectedOutreachEventId = null;
  editingOutreachEventId = null;
  outreachForm.reset();
  outreachForm.hidden = true;
  outreachDetail.hidden = false;
  renderOutreachEvents();
}

function setSelectedOutreachEvent(eventId) {
  selectedOutreachEventId = eventId;
  editingOutreachEventId = null;
  outreachForm.reset();
  outreachForm.hidden = true;
  outreachDetail.hidden = false;
  openOutreachModal();
  renderOutreachEvents();
  renderOutreachDetail();
}

function openOutreachContactModal() {
  outreachContactModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeOutreachContactModal() {
  outreachContactModal.hidden = true;
  document.body.classList.remove("modal-open");
  selectedOutreachContactId = null;
  editingOutreachContactId = null;
  outreachContactForm.reset();
  outreachContactForm.hidden = true;
  outreachContactDetail.hidden = false;
  renderOutreachContacts();
  renderOutreachDashboard();
}

function setSelectedOutreachContact(contactId) {
  selectedOutreachContactId = contactId;
  editingOutreachContactId = null;
  outreachContactForm.reset();
  outreachContactForm.hidden = true;
  outreachContactDetail.hidden = false;
  openOutreachContactModal();
  renderOutreachContacts();
  renderOutreachContactDetail();
}

function openAppointmentModal() {
  appointmentModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeAppointmentModal() {
  appointmentModal.hidden = true;
  document.body.classList.remove("modal-open");
  selectedAppointmentId = null;
  editingAppointmentId = null;
  appointmentForm.reset();
  appointmentForm.hidden = true;
  appointmentDetail.hidden = true;
  selectedAppointmentClientIds.clear();
  renderSelectedAppointmentClients();
  appointmentsStatusEl.textContent = "";
  appointmentFormStatusEl.textContent = "";
  deleteAppointmentButton.hidden = true;
  renderAppointments();
}

function setAppointmentFeedback(message) {
  appointmentsStatusEl.textContent = message;
  appointmentFormStatusEl.textContent = message;
}

function openAppointmentCompletionModal() {
  appointmentCompleteModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeAppointmentCompletionModal() {
  appointmentCompleteModal.hidden = true;
  document.body.classList.remove("modal-open");
  completingAppointmentId = null;
  appointmentCompletionMode = "complete";
  appointmentCompleteForm.reset();
  appointmentsStatusEl.textContent = "";
}

function openAppointmentCheckInModal() {
  appointmentCheckInModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeAppointmentCheckInModal() {
  appointmentCheckInModal.hidden = true;
  checkInAppointmentId = null;
  appointmentCheckInForm.reset();
  appointmentsStatusEl.textContent = "";

  if (referralModal.hidden && clientModal.hidden && networkModal.hidden && outreachModal.hidden && outreachContactModal.hidden && appointmentModal.hidden && appointmentCompleteModal.hidden && taskModal.hidden && activityLogModal.hidden && siblingModal.hidden) {
    document.body.classList.remove("modal-open");
  }
}

function setAppointmentCheckInField(name, value) {
  const field = appointmentCheckInForm.elements.namedItem(name);
  if (!field) {
    return;
  }

  field.value = [...field.options].some((option) => option.value === value) ? value : appointmentCheckInDefaults[name] || "";
}

function setAppointmentCheckInFormValues(appointment) {
  const checkIn = appointmentCheckInFields(appointment);
  setAppointmentCheckInField("caregiverMood", checkIn.caregiverMood);
  setAppointmentCheckInField("confidence", checkIn.confidence);
  setAppointmentCheckInField("participation", checkIn.participation);
  setAppointmentCheckInField("barriers", checkIn.barriers);
}

function startEditingAppointmentCheckIn(appointment) {
  if (!appointment) {
    return;
  }

  checkInAppointmentId = appointment.id;
  appointmentCheckInTitle.textContent = `Edit Check In`;
  appointmentCheckInSummary.textContent = [
    appointmentClientName(appointment),
    formatFullDate(appointment.appointmentDate),
    formatAppointmentTime(appointment.appointmentTime)
  ].filter(Boolean).join(" | ");
  setAppointmentCheckInFormValues(appointment);
  openAppointmentCheckInModal();
}

function setSelectedAppointment(appointmentId) {
  selectedAppointmentId = appointmentId;
  editingAppointmentId = null;
  const appointment = getSelectedAppointment();
  if (!appointment) {
    return;
  }
  appointmentForm.hidden = true;
  appointmentDetail.hidden = false;
  renderAppointmentDetail(appointment);
  openAppointmentModal();
  renderAppointments();
}

function appointmentDetailField(label, value) {
  const field = document.createElement("div");
  field.className = "appointment-detail-field";
  const labelEl = document.createElement("span");
  labelEl.textContent = label;
  const valueEl = document.createElement("strong");
  valueEl.textContent = value || "-";
  field.append(labelEl, valueEl);
  return field;
}

function appointmentClientsDetailField(clients, fallbackText) {
  const field = document.createElement("div");
  field.className = "appointment-detail-field appointment-clients-field";
  const labelEl = document.createElement("span");
  labelEl.textContent = "Clients";
  field.append(labelEl);

  if (!clients.length) {
    const valueEl = document.createElement("strong");
    valueEl.textContent = fallbackText || "-";
    field.append(valueEl);
    return field;
  }

  const list = document.createElement("div");
  list.className = "appointment-client-detail-list";
  for (const client of clients) {
    const row = document.createElement("div");
    row.className = "appointment-client-detail-row";
    const info = document.createElement("strong");
    info.textContent = [clientName(client), client.parentName ? `Caregiver: ${client.parentName}` : "", formatPhone(client.phone)].filter(Boolean).join(" | ");
    const profileButton = document.createElement("button");
    profileButton.className = "secondary-button compact-button";
    profileButton.type = "button";
    profileButton.textContent = "Profile";
    profileButton.addEventListener("click", () => {
      closeAppointmentModal();
      setSelectedClient(client.id);
    });
    row.append(info, profileButton);
    list.append(row);
  }
  field.append(list);
  return field;
}

function renderAppointmentDetail(appointment) {
  appointmentDetailBody.innerHTML = "";
  appointmentDetailTitle.textContent = `${appointmentClientName(appointment)} Appointment`;
  completeAppointmentDetailButton.hidden = appointment.status !== "Scheduled";

  const clientIds = appointmentClientIds(appointment);
  const clients = clientIds.map((clientId) => loadedClients.find((client) => client.id === clientId)).filter(Boolean);

  const details = document.createElement("div");
  details.className = "appointment-detail-grid";
  details.append(
    appointmentClientsDetailField(clients, appointmentClientName(appointment)),
    appointmentDetailField("Date", formatDateOnly(appointment.appointmentDate)),
    appointmentDetailField("Time", formatAppointmentTime(appointment.appointmentTime)),
    appointmentDetailField("Duration", formatDuration(appointmentDurationMinutes(appointment))),
    appointmentDetailField("Type", appointmentTypeLabel(appointment)),
    appointmentDetailField("Status", appointment.status || "Scheduled"),
    appointmentDetailField("Lesson", appointmentLessonLabel(appointment) || "-"),
    appointmentDetailField("Staff", appointment.staffMember || "-"),
    appointmentDetailField("Goal", appointmentGoalText(appointment) || "-")
  );

  const notes = document.createElement("div");
  notes.className = "appointment-detail-notes";
  const notesLabel = document.createElement("span");
  notesLabel.textContent = "Notes";
  const notesValue = document.createElement("p");
  notesValue.textContent = appointment.notes || "-";
  notes.append(notesLabel, notesValue);

  const prepItems = appointmentPrepItems(appointment);
  const prep = document.createElement("div");
  prep.className = "appointment-detail-prep";
  const prepLabel = document.createElement("span");
  prepLabel.textContent = "Prep List";
  if (prepItems.length) {
    const prepList = document.createElement("ul");
    for (const item of prepItems) {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      prepList.append(listItem);
    }
    prep.append(prepLabel, prepList);
  } else {
    const empty = document.createElement("p");
    empty.textContent = "-";
    prep.append(prepLabel, empty);
  }

  appointmentDetailBody.append(details, prep, notes);
}

function setOutreachView(viewName) {
  activeOutreachView = viewName;
  saveNavigationState();
  const showDashboard = viewName === "dashboard";
  const showEvents = viewName === "events";
  const showContacts = viewName === "contacts";

  outreachDashboardView.hidden = !showDashboard;
  outreachEventsView.hidden = !showEvents;
  outreachContactsView.hidden = !showContacts;
  outreachTabDashboardButton.classList.toggle("active", showDashboard);
  outreachTabEventsButton.classList.toggle("active", showEvents);
  outreachTabContactsButton.classList.toggle("active", showContacts);
  outreachTabDashboardButton.setAttribute("aria-selected", String(showDashboard));
  outreachTabEventsButton.setAttribute("aria-selected", String(showEvents));
  outreachTabContactsButton.setAttribute("aria-selected", String(showContacts));
  newOutreachEventButton.hidden = !(showDashboard || showEvents);
  newOutreachContactButton.hidden = !(showDashboard || showContacts);

  renderOutreachEvents();
  renderOutreachContacts();
  renderOutreachDashboard();
}

function statusBadge(status = "New") {
  const normalized = normalizeStatus(status);
  const badge = document.createElement("span");
  badge.className = `status-badge status-${cssToken(normalized)} status-group-${statusGroupKey(normalized)}`;
  badge.textContent = normalized;
  return badge;
}

function clientStatusBadge(status = "Scheduled") {
  const badge = document.createElement("span");
  badge.className = `status-badge status-${cssToken(status)} status-group-${clientStatusGroupKey(status)}`;
  badge.textContent = clientStatusDisplayLabel(status);
  return badge;
}

function appointmentStatusBadge(status = "Scheduled") {
  const statusGroups = {
    Scheduled: "scheduled",
    Completed: "new",
    "No-show": "follow-up",
    Rescheduled: "contacted",
    Blocked: "closed",
    Canceled: "closed"
  };
  const badge = document.createElement("span");
  badge.className = `status-badge status-${cssToken(status)} status-group-${statusGroups[status] || "scheduled"}`;
  badge.textContent = status;
  return badge;
}

function applyStatusSelectColor(select, status) {
  for (const key of ["new", "contacted", "in-contact", "follow-up", "scheduled", "referral-scheduled", "graduated", "closed"]) {
    select.classList.remove(`status-group-${key}`);
  }
  select.classList.add("status-select", `status-group-${statusGroupKey(status)}`);
}

function applyClientStatusSelectColor(select, status) {
  for (const key of ["new", "contacted", "in-contact", "follow-up", "scheduled", "referral-scheduled", "graduated", "closed"]) {
    select.classList.remove(`status-group-${key}`);
  }
  select.classList.add("status-select", `status-group-${clientStatusGroupKey(status)}`);
}

function renderReferrals() {
  referralsList.innerHTML = "";
  referralFlowBoard.innerHTML = "";
  renderTableHead("referrals");
  const referrals = sortReferrals(loadedReferrals.filter(referralMatchesFilters));
  const columns = visibleColumns("referrals");
  const gridTemplate = gridTemplateFor("referrals");
  const rowMinWidth = minTableWidth("referrals");
  updateViewToggle(referralsViewListButton, referralsViewFlowButton, activeReferralView);
  referralsTableView.hidden = activeReferralView !== "list";
  referralFlowBoard.hidden = activeReferralView !== "flow";

  if (selectedReferralId && !referrals.some((referral) => referral.id === selectedReferralId)) {
    selectedReferralId = null;
  }

  if (activeReferralView === "flow") {
    renderReferralFlow(referrals);
    return;
  }

  if (!referrals.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedReferrals.length ? "No referrals match the current filters." : "No referrals yet.";
    referralsList.append(empty);
    return;
  }

  for (const referral of referrals) {
    const row = document.createElement("button");
    row.className = "referral-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open ${referralName(referral)}`);
    row.style.gridTemplateColumns = gridTemplate;
    row.style.minWidth = rowMinWidth;

    if (referral.id === selectedReferralId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    row.append(...columns.map((column) => renderCell(column, referral)));
    row.addEventListener("click", () => setSelectedReferral(referral.id));
    referralsList.append(row);
  }
}

function renderClients() {
  clientsList.innerHTML = "";
  clientFlowBoard.innerHTML = "";
  renderTableHead("clients");
  const clients = sortClients(loadedClients.filter(clientMatchesSearch));
  const columns = visibleColumns("clients");
  const gridTemplate = gridTemplateFor("clients");
  const rowMinWidth = minTableWidth("clients");
  updateViewToggle(clientsViewListButton, clientsViewFlowButton, activeClientView);
  clientsTableView.hidden = activeClientView !== "list";
  clientFlowBoard.hidden = activeClientView !== "flow";

  if (selectedClientId && !clients.some((client) => client.id === selectedClientId)) {
    selectedClientId = null;
  }

  if (activeClientView === "flow") {
    renderClientFlow(clients);
    return;
  }

  if (!clients.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedClients.length ? "No clients match the current search." : "No clients yet.";
    clientsList.append(empty);
    return;
  }

  for (const client of clients) {
    const row = document.createElement("button");
    row.className = "referral-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open ${clientName(client)}`);
    row.style.gridTemplateColumns = gridTemplate;
    row.style.minWidth = rowMinWidth;

    if (client.id === selectedClientId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    row.append(...columns.map((column) => renderCell(column, client)));
    row.addEventListener("click", () => setSelectedClient(client.id));
    clientsList.append(row);
  }
}

function renderReferralNetwork() {
  networkList.innerHTML = "";
  const entries = loadedNetworkEntries
    .filter(networkEntryMatchesSearch)
    .sort(
      (first, second) =>
        displayValue(normalizeNetworkType(first.type)).localeCompare(displayValue(normalizeNetworkType(second.type))) ||
        networkEntryName(first).localeCompare(networkEntryName(second))
    );

  if (selectedNetworkEntryId && !entries.some((entry) => entry.id === selectedNetworkEntryId)) {
    selectedNetworkEntryId = null;
  }

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedNetworkEntries.length ? "No network entries match the current search." : "No referral network entries yet.";
    networkList.append(empty);
    return;
  }

  let currentType = "";

  for (const entry of entries) {
    const entryType = normalizeNetworkType(entry.type) || "Not set";
    if (entryType !== currentType) {
      currentType = entryType;
      const section = document.createElement("div");
      section.className = "network-section-heading";
      section.textContent = entryType;
      networkList.append(section);
    }

    const row = document.createElement("button");
    row.className = "referral-row network-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open ${networkEntryName(entry)}`);
    row.style.gridTemplateColumns = "minmax(190px, 1.25fr) minmax(160px, 1fr) minmax(140px, 0.9fr)";

    if (entry.id === selectedNetworkEntryId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    const providers = entry.providers || [];
    const isExpanded = expandedNetworkEntryIds.has(entry.id);
    const nameCell = document.createElement("span");
    nameCell.className = "table-cell network-name-cell";
    nameCell.setAttribute("role", "cell");

    const expandButton = document.createElement("span");
    expandButton.className = "network-expand-button";
    expandButton.setAttribute("role", "button");
    expandButton.setAttribute("tabindex", "0");
    expandButton.setAttribute("aria-expanded", String(isExpanded));
    expandButton.setAttribute("aria-label", `${isExpanded ? "Collapse" : "Expand"} ${networkEntryName(entry)} providers`);
    expandButton.textContent = isExpanded ? "-" : "+";
    expandButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (isExpanded) {
        expandedNetworkEntryIds.delete(entry.id);
      } else {
        expandedNetworkEntryIds.add(entry.id);
      }
      renderReferralNetwork();
    });
    expandButton.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        expandButton.click();
      }
    });

    const nameText = document.createElement("span");
    nameText.className = "network-name-text";
    nameText.textContent = networkEntryName(entry);
    nameCell.append(expandButton, nameText);

    for (const value of [
      `${providers.length} provider${providers.length === 1 ? "" : "s"}`,
      formatPhone(entry.phone)
    ]) {
      const cell = document.createElement("span");
      cell.className = "table-cell";
      cell.setAttribute("role", "cell");
      cell.textContent = value;
      row.append(cell);
    }

    row.prepend(nameCell);
    row.addEventListener("click", () => setSelectedNetworkEntry(entry.id));
    networkList.append(row);

    if (isExpanded) {
      if (!providers.length) {
        const emptyProviderRow = document.createElement("div");
        emptyProviderRow.className = "network-provider-inline-row";
        emptyProviderRow.textContent = "No providers added yet.";
        networkList.append(emptyProviderRow);
      }

      for (const { provider } of sortedNetworkProviders(providers)) {
        const providerRow = document.createElement("button");
        providerRow.className = "network-provider-inline-row";
        providerRow.type = "button";
        providerRow.setAttribute("role", "row");
        providerRow.setAttribute("aria-label", `Open ${networkEntryName(entry)} provider list`);
        providerRow.addEventListener("click", () => setSelectedNetworkEntry(entry.id));

        for (const value of [
          networkProviderName(provider),
          provider.email || "-",
          provider.notes || "-"
        ]) {
          const cell = document.createElement("span");
          cell.className = "table-cell";
          cell.setAttribute("role", "cell");
          cell.textContent = value;
          providerRow.append(cell);
        }

        networkList.append(providerRow);
      }
    }
  }
}

function renderOutreachSummary() {
  outreachSummary.innerHTML = "";

  const upcomingEvents = loadedOutreachEvents.filter((event) => ["Scheduled", "Planning"].includes(outreachEventStatus(event)));
  const inProgressEvents = loadedOutreachEvents.filter((event) => outreachEventStatus(event) === "In Progress");
  const totals = [
    { label: "Events", value: loadedOutreachEvents.length },
    { label: "Upcoming", value: upcomingEvents.length },
    { label: "In Progress", value: inProgressEvents.length },
    { label: "Contacts", value: loadedOutreachContacts.length },
    { label: "Referrals", value: loadedOutreachEvents.reduce((sum, event) => sum + numberValue(event.referralsCount), 0) },
    { label: "Participants", value: loadedOutreachEvents.reduce((sum, event) => sum + numberValue(event.participantListCount), 0) }
  ];

  for (const total of totals) {
    const item = document.createElement("div");
    item.className = "summary-item";
    const value = document.createElement("strong");
    value.textContent = total.value;
    const label = document.createElement("span");
    label.textContent = total.label;
    item.append(value, label);
    outreachSummary.append(item);
  }
}

function renderOutreachDashboard() {
  renderOutreachSummary();
  renderOutreachEventFlow(loadedOutreachEvents);

  const today = todayDateString();
  const upcomingItems = loadedOutreachEvents
    .filter((event) => !["Canceled", "Archived"].includes(outreachEventStatus(event)) && (!event.eventDate || event.eventDate >= today))
    .map((event) => ({
      type: outreachEventStatus(event),
      title: outreachEventName(event),
      detail: [event.type, event.location, event.repeatPattern].filter(Boolean).join(" | ") || "Outreach",
      date: event.eventDate || event.createdAt || "",
      action: () => setSelectedOutreachEvent(event.id)
    }))
    .sort((first, second) => dateValue(first.date) - dateValue(second.date) || first.title.localeCompare(second.title));

  const followupItems = loadedOutreachContacts
    .filter((contact) => ["New", "Follow Up", "Interested"].includes(contact.status || "New"))
    .map((contact) => ({
      type: "Contact",
      title: outreachContactName(contact),
      detail: outreachEventLabel(contact.eventId) || contact.interestType || displayValue(contact.status),
      date: contact.createdAt || "",
      action: () => setSelectedOutreachContact(contact.id)
    }))
    .sort((first, second) => dateTimeValue(first.date) - dateTimeValue(second.date) || first.title.localeCompare(second.title));

  renderDashboardList(outreachUpcomingList, upcomingItems, "No upcoming outreach events.");
  renderDashboardList(outreachContactFollowupList, followupItems, "No outreach contacts waiting.");
}

function renderOutreachEvents() {
  outreachList.innerHTML = "";
  renderOutreachSummary();

  const events = loadedOutreachEvents
    .filter(outreachEventMatchesSearch)
    .sort((first, second) => dateValue(second.eventDate, -1) - dateValue(first.eventDate, -1) || outreachEventName(first).localeCompare(outreachEventName(second)));

  if (selectedOutreachEventId && !events.some((event) => event.id === selectedOutreachEventId)) {
    selectedOutreachEventId = null;
  }

  if (!events.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedOutreachEvents.length ? "No outreach events match the current search." : "No outreach events tracked yet.";
    outreachList.append(empty);
    return;
  }

  for (const event of events) {
    const row = document.createElement("button");
    row.className = "referral-row outreach-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open ${outreachEventName(event)}`);
    row.style.gridTemplateColumns = "minmax(220px, 1.4fr) minmax(120px, 0.7fr) minmax(120px, 0.8fr) minmax(170px, 1fr) minmax(90px, 0.6fr)";

    if (event.id === selectedOutreachEventId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    const cells = [
      outreachEventName(event),
      outreachEventStatusPill(outreachEventStatus(event)),
      formatListDate(event.eventDate),
      event.contactName || "-",
      String(numberValue(event.referralsCount))
    ];

    for (const value of cells) {
      const cell = document.createElement("span");
      cell.className = "table-cell";
      cell.setAttribute("role", "cell");
      if (value instanceof Node) {
        cell.append(value);
      } else {
        cell.textContent = value;
      }
      row.append(cell);
    }

    row.addEventListener("click", () => setSelectedOutreachEvent(event.id));
    outreachList.append(row);
  }
}

function renderOutreachContacts() {
  outreachContactList.innerHTML = "";
  const contacts = loadedOutreachContacts
    .filter(outreachContactMatchesSearch)
    .sort((first, second) => dateTimeValue(second.createdAt, -1) - dateTimeValue(first.createdAt, -1) || outreachContactName(first).localeCompare(outreachContactName(second)));

  if (selectedOutreachContactId && !contacts.some((contact) => contact.id === selectedOutreachContactId)) {
    selectedOutreachContactId = null;
  }

  if (!contacts.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedOutreachContacts.length ? "No outreach contacts match the current search." : "No outreach interest contacts yet.";
    outreachContactList.append(empty);
    return;
  }

  for (const contact of contacts) {
    const row = document.createElement("button");
    row.className = "referral-row outreach-contact-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open ${outreachContactName(contact)}`);
    row.style.gridTemplateColumns = "minmax(200px, 1.25fr) minmax(180px, 1fr) minmax(130px, 0.75fr) minmax(140px, 0.8fr)";

    if (contact.id === selectedOutreachContactId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    for (const value of [
      outreachContactName(contact),
      outreachEventLabel(contact.eventId) || "-",
      contact.status || "New",
      formatPhone(contact.phone)
    ]) {
      const cell = document.createElement("span");
      cell.className = "table-cell";
      cell.setAttribute("role", "cell");
      cell.textContent = value;
      row.append(cell);
    }

    row.addEventListener("click", () => setSelectedOutreachContact(contact.id));
    outreachContactList.append(row);
  }
}

function renderAppointmentClientOptions(selectedClientId = "") {
  appointmentClientOptions.innerHTML = "";

  const clients = [...loadedClients].sort((first, second) => clientName(first).localeCompare(clientName(second)));
  for (const client of clients) {
    const option = document.createElement("option");
    option.value = appointmentClientOptionLabel(client);
    appointmentClientOptions.append(option);
  }

  appointmentClientSelect.value = selectedClientId || "";
  const selectedClient = loadedClients.find((client) => client.id === selectedClientId);
  appointmentClientSearchInput.value = selectedClient ? appointmentClientOptionLabel(selectedClient) : "";
}

function renderSelectedAppointmentClients() {
  appointmentClientSelected.innerHTML = "";
  const ids = [...selectedAppointmentClientIds];
  appointmentClientSelect.value = ids[0] || "";
  appointmentClientIdsInput.value = ids.join(",");

  if (!ids.length) {
    const empty = document.createElement("span");
    empty.className = "selected-client-empty";
    empty.textContent = "No clients selected.";
    appointmentClientSelected.append(empty);
    return;
  }

  for (const clientId of ids) {
    const client = loadedClients.find((item) => item.id === clientId);
    const pill = document.createElement("span");
    pill.className = "selected-client-pill";
    pill.textContent = client ? clientName(client) : clientId;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("aria-label", `Remove ${pill.textContent}`);
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      selectedAppointmentClientIds.delete(clientId);
      renderSelectedAppointmentClients();
      renderAppointmentTimeOptions();
    });

    pill.append(remove);
    appointmentClientSelected.append(pill);
  }
}

function addSelectedAppointmentClient(clientId) {
  if (!clientId) {
    return false;
  }

  selectedAppointmentClientIds.add(clientId);
  appointmentClientSearchInput.value = "";
  appointmentClientSelect.value = "";
  renderSelectedAppointmentClients();
  renderAppointmentTimeOptions();
  return true;
}

function appointmentClientOptionLabel(client) {
  return clientName(client);
}

function resolveAppointmentClientId() {
  const query = appointmentClientSearchInput.value.trim().toLowerCase();
  const exact = loadedClients.find((client) => appointmentClientOptionLabel(client).toLowerCase() === query);
  const loose = loadedClients.find((client) => clientName(client).toLowerCase() === query);
  const selected = exact || loose;
  appointmentClientSelect.value = selected?.id || "";
  return appointmentClientSelect.value;
}

function appointmentDraftClientIds() {
  const ids = [...selectedAppointmentClientIds];
  const pendingClientId = appointmentClientSelect.value;

  if (pendingClientId && !ids.includes(pendingClientId)) {
    ids.push(pendingClientId);
  }

  return ids;
}

function appointmentDraftForTime(appointmentTime, overrides = {}) {
  const clientIds = Array.isArray(overrides.clientIds) ? overrides.clientIds : appointmentDraftClientIds();
  const clients = clientIds
    .map((clientId) => loadedClients.find((client) => client.id === clientId))
    .filter(Boolean);

  return {
    id: editingAppointmentId || "",
    clientIds,
    clientId: clientIds[0] || "",
    clientNames: clients.map(clientName),
    clientName: clients[0] ? clientName(clients[0]) : "",
    appointmentDate: overrides.appointmentDate || appointmentForm.elements.appointmentDate.value || todayDateString(),
    appointmentTime,
    appointmentType: overrides.appointmentType || appointmentForm.elements.appointmentType.value || "Enrollment",
    durationMinutes: overrides.durationMinutes,
    lesson: (overrides.lesson ?? appointmentForm.elements.lesson.value) || "",
    goal: (overrides.goal ?? appointmentForm.elements.goal.value) || "",
    status: overrides.status || appointmentForm.elements.status.value || "Scheduled"
  };
}

function appointmentTimeValues(selectedTime = "", overrides = {}, options = {}) {
  const selected = normalizeAppointmentTime(selectedTime);
  const times = [];
  const includeConflicts = Boolean(options.includeConflicts);
  const excludedAppointmentId = overrides.excludedAppointmentId ?? editingAppointmentId;
  const draft = appointmentDraftForTime(
    selected || `${String(Math.floor(schedulingBookableStartMinutes / 60)).padStart(2, "0")}:${String(schedulingBookableStartMinutes % 60).padStart(2, "0")}`,
    overrides
  );
  const latestStart = schedulingBookableEndMinutes - appointmentDurationMinutes(draft);

  for (let minutes = schedulingBookableStartMinutes; minutes <= latestStart; minutes += schedulingSlotIntervalMinutes) {
    const candidateTime = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
    const candidate = appointmentDraftForTime(candidateTime, overrides);
    const conflict = appointmentSchedulingConflict(candidate, excludedAppointmentId);

    if (includeConflicts || !conflict) {
      times.push(candidateTime);
    }
  }

  if (excludedAppointmentId && selected && !times.includes(selected)) {
    const selectedCandidate = appointmentDraftForTime(selected, overrides);
    const selectedConflict = appointmentSchedulingConflict(selectedCandidate, excludedAppointmentId);
    if (appointmentFitsSchedulingWindow(selectedCandidate) && (includeConflicts || !selectedConflict)) {
      times.unshift(selected);
    }
  }

  return times;
}

function appointmentAvailableTimeValues(selectedTime = "", overrides = {}) {
  return appointmentTimeValues(selectedTime, overrides);
}

function appointmentClinicTimeValues(selectedTime = "", overrides = {}) {
  const selected = normalizeAppointmentTime(selectedTime);
  const draft = appointmentDraftForTime(
    selected || `${String(Math.floor(schedulingBookableStartMinutes / 60)).padStart(2, "0")}:${String(schedulingBookableStartMinutes % 60).padStart(2, "0")}`,
    overrides
  );
  const latestStart = schedulingBookableEndMinutes - appointmentDurationMinutes(draft);
  const times = [];

  for (let minutes = schedulingBookableStartMinutes; minutes <= latestStart; minutes += schedulingSlotIntervalMinutes) {
    times.push(`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`);
  }

  if (selected && !times.includes(selected)) {
    const selectedCandidate = appointmentDraftForTime(selected, overrides);
    if (appointmentFitsSchedulingWindow(selectedCandidate)) {
      times.push(selected);
    }
  }

  return [...new Set(times)].sort((first, second) => appointmentTimeValue(first) - appointmentTimeValue(second));
}

function appointmentValidTimeValues(selectedTime = "", overrides = {}) {
  return appointmentClinicTimeValues(selectedTime, overrides);
}

function renderAppointmentTimeOptions(selectedTime = appointmentTimeInput.value) {
  const normalizedSelected = normalizeAppointmentTime(selectedTime);
  const times = appointmentValidTimeValues(normalizedSelected);
  appointmentTimeInput.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = times.length ? "Choose time" : "No valid times";
  appointmentTimeInput.append(placeholder);

  for (const time of times) {
    const selectOption = document.createElement("option");
    selectOption.value = time;
    selectOption.textContent = formatAppointmentTime(time);
    appointmentTimeInput.append(selectOption);
  }

  appointmentTimeInput.value = times.includes(normalizedSelected) ? normalizedSelected : "";
}

function appointmentCompletionTimeContext(appointment) {
  const isRescheduleMode = appointmentCompletionMode === "reschedule";
  const nextLesson = nextLessonNumberForAppointment(appointment);
  return {
    clientIds: appointmentClientIds(appointment),
    appointmentDate: completionNextDateInput.value || defaultNextAppointmentDate(appointment),
    appointmentType: isRescheduleMode ? appointmentTypeLabel(appointment) : "Nutrition Education",
    lesson: isRescheduleMode ? appointment.lesson || "" : nextLesson ? String(nextLesson) : "",
    goal: isRescheduleMode ? appointmentGoalText(appointment) : completionNextGoalInput.value.trim(),
    status: "Scheduled",
    excludedAppointmentId: isRescheduleMode ? appointment.id : ""
  };
}

function renderCompletionAppointmentTimeOptions() {
  appointmentTimeOptions.innerHTML = "";
  const appointment = loadedAppointments.find((item) => item.id === completingAppointmentId);

  if (!appointment || completionNextTimeInput.disabled) {
    return;
  }

  const normalizedSelected = normalizeAppointmentTime(completionNextTimeInput.value);
  const times = appointmentValidTimeValues(normalizedSelected, appointmentCompletionTimeContext(appointment));

  for (const time of times) {
    const datalistOption = document.createElement("option");
    datalistOption.value = formatAppointmentTime(time);
    appointmentTimeOptions.append(datalistOption);
  }

  completionNextTimeInput.placeholder = times.length ? "3:00 PM" : "No valid times";
}

function renderAppointmentSummary() {
  appointmentSummary.innerHTML = "";
  const today = todayDateString();
  const currentWeekStart = weekStartDate(today);
  const currentWeekDayKeys = schedulingV2ClinicWeekdays.map((weekday) => toDateString(schedulingDateForWeekday(currentWeekStart, weekday)));
  const completedAppointmentCount = loadedAppointments.filter((appointment) => appointment.status === "Completed").length;
  const noShowAppointmentCount = loadedAppointments.filter((appointment) => appointment.status === "No-show").length;
  const noShowRate = percentage(noShowAppointmentCount, completedAppointmentCount + noShowAppointmentCount);
  const totals = [
    { label: "Today", value: loadedAppointments.filter((appointment) => appointment.appointmentDate === today && appointment.status !== "Canceled").length, date: "today", status: "all" },
    {
      label: "Upcoming Week",
      value: loadedAppointments.filter(
        (appointment) =>
          currentWeekDayKeys.includes(appointment.appointmentDate) &&
          appointment.appointmentDate > today &&
          appointment.status === "Scheduled"
      ).length,
      date: "upcoming",
      status: "Scheduled"
    },
    { label: "Scheduled", value: loadedAppointments.filter((appointment) => appointment.status === "Scheduled").length, date: "all", status: "Scheduled" },
    { label: "Completed", value: completedAppointmentCount, date: "all", status: "Completed" },
    { label: "No-Shows", value: noShowAppointmentCount, detail: `${noShowRate} rate`, date: "all", status: "No-show" }
  ];

  for (const total of totals) {
    const item = document.createElement("button");
    item.className = "summary-item summary-button";
    item.type = "button";
    item.addEventListener("click", () => {
      appointmentDateFilterSelect.value = total.date;
      appointmentStatusFilterSelect.value = total.status;
      renderAppointments();
    });
    const value = document.createElement("strong");
    value.textContent = total.value;
    const label = document.createElement("span");
    label.textContent = total.label;
    const copy = document.createElement("span");
    copy.className = "summary-item-copy";
    copy.append(label);
    if (total.detail) {
      const detail = document.createElement("small");
      detail.textContent = total.detail;
      copy.append(detail);
    }
    item.append(value, copy);
    appointmentSummary.append(item);
  }
}

function weekStartDate(value = todayDateString()) {
  const date = new Date(`${value}T00:00:00`);
  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  return addDays(date, mondayOffset);
}


function rememberSchedulingV2AgendaScroll() {
  const agenda = schedulingV2Preview?.querySelector(".scheduling-v2-agenda");

  if (agenda && activeSchedulingPreviewView === "day") {
    schedulingV2AgendaScrollTop = agenda.scrollTop;
  }
}

function moveSchedulingPreviewDate(dayOffset) {
  visibleSchedulingPreviewDate = toDateString(addDays(new Date(`${visibleSchedulingPreviewDate}T00:00:00`), dayOffset));
  selectedSchedulingPreviewAppointmentId = null;
  activeSchedulingV2Panel = "appointment";
  activeSchedulingV2DetailTab = "appt-note";
  schedulingV2AgendaScrollTop = 0;
  clearSchedulingV2InlineState();
  renderSchedulingV2Preview();
}

function setSchedulingPreviewDate(value) {
  if (!value) {
    return;
  }

  visibleSchedulingPreviewDate = value;
  selectedSchedulingPreviewAppointmentId = null;
  activeSchedulingV2Panel = "appointment";
  activeSchedulingV2DetailTab = "appt-note";
  schedulingV2AgendaScrollTop = 0;
  clearSchedulingV2InlineState();
  renderSchedulingV2Preview();
}

function setSchedulingPreviewView(viewName) {
  activeSchedulingPreviewView = validValue(viewName, ["day", "week", "month"], "day");
  schedulingV2AgendaScrollTop = 0;
  renderSchedulingV2Preview();
}

function schedulingPreviewAppointmentsForDate(dateKey = visibleSchedulingPreviewDate) {
  return loadedAppointments
    .filter((appointment) => appointment.appointmentDate === dateKey && appointment.status !== "Canceled")
    .sort(
      (first, second) =>
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime) ||
        appointmentClientName(first).localeCompare(appointmentClientName(second))
    );
}

function schedulingPreviewSelectedAppointment(appointments) {
  const selected = appointments.find((appointment) => appointment.id === selectedSchedulingPreviewAppointmentId);

  if (selected) {
    return selected;
  }

  selectedSchedulingPreviewAppointmentId = appointments[0]?.id || null;
  return appointments[0] || null;
}

function appointmentClientRecords(appointment) {
  return appointmentClientIds(appointment)
    .map((clientId) => loadedClients.find((client) => client.id === clientId))
    .filter(Boolean);
}

function appointmentPreviewClientRows(appointment) {
  const clients = appointmentClientRecords(appointment);

  if (clients.length) {
    return clients.map((client) => ({
      id: client.id,
      name: clientName(client),
      caregiver: client.parentName || "",
      phone: formatPhone(client.phone),
      language: client.preferredLanguage || "",
      address: formatAddress(client),
      dateOfBirth: profileDate(client.dateOfBirth)
    }));
  }

  return appointmentClientNames(appointment).map((name) => ({
    id: "",
    name,
    caregiver: "",
    phone: "",
    language: "",
    address: "-",
    dateOfBirth: "-"
  }));
}

function appointmentPreviewPrimaryClient(appointment) {
  return appointmentPreviewClientRows(appointment)[0] || {
    id: "",
    name: appointmentClientName(appointment),
    caregiver: "",
    phone: "",
    language: "",
    address: "-",
    dateOfBirth: "-"
  };
}

function schedulingPreviewCounterItems(dateAppointments) {
  return [
    { tone: "today", label: "Today", value: dateAppointments.filter((appointment) => appointment.status !== "Canceled").length },
    { tone: "completed", label: "Completed", value: dateAppointments.filter((appointment) => appointment.status === "Completed").length },
    { tone: "no-show", label: "No Show", value: dateAppointments.filter((appointment) => appointment.status === "No-show").length },
    { tone: "reschedule", label: "Reschedule", value: dateAppointments.filter((appointment) => appointment.status === "Rescheduled").length }
  ];
}

const schedulingV2Icons = {
  admin: "<svg viewBox=\"0 0 24 24\"><path d=\"M4 20h16\"/><path d=\"M6 20V9l6-4 6 4v11\"/><path d=\"M9 20v-6h6v6\"/></svg>",
  bell: "<svg viewBox=\"0 0 24 24\"><path d=\"M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9\"/><path d=\"M10 21h4\"/></svg>",
  calendar: "<svg viewBox=\"0 0 24 24\"><path d=\"M7 3v4\"/><path d=\"M17 3v4\"/><path d=\"M4 9h16\"/><rect x=\"4\" y=\"5\" width=\"16\" height=\"15\" rx=\"2\"/></svg>",
  check: "<svg viewBox=\"0 0 24 24\"><path d=\"m5 12 4 4L19 6\"/></svg>",
  chevronLeft: "<svg viewBox=\"0 0 24 24\"><path d=\"m15 6-6 6 6 6\"/></svg>",
  chevronRight: "<svg viewBox=\"0 0 24 24\"><path d=\"m9 6 6 6-6 6\"/></svg>",
  clock: "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"8\"/><path d=\"M12 8v5l3 2\"/></svg>",
  close: "<svg viewBox=\"0 0 24 24\"><path d=\"M6 6l12 12\"/><path d=\"M18 6 6 18\"/></svg>",
  file: "<svg viewBox=\"0 0 24 24\"><path d=\"M7 3h7l4 4v14H7z\"/><path d=\"M14 3v5h5\"/></svg>",
  grants: "<svg viewBox=\"0 0 24 24\"><path d=\"M12 3v18\"/><path d=\"M17 6H9.5a3 3 0 0 0 0 6H15a3 3 0 0 1 0 6H6\"/></svg>",
  help: "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M9.5 9a2.5 2.5 0 0 1 4.4 1.6c0 1.8-1.9 2.2-1.9 3.7\"/><path d=\"M12 18h.01\"/></svg>",
  history: "<svg viewBox=\"0 0 24 24\"><path d=\"M4 9V4h5\"/><path d=\"M4.5 9A8 8 0 1 1 6.4 17\"/><path d=\"M12 8v5l3 2\"/></svg>",
  home: "<svg viewBox=\"0 0 24 24\"><path d=\"M4 11 12 4l8 7\"/><path d=\"M6 10v10h12V10\"/><path d=\"M10 20v-6h4v6\"/></svg>",
  marketing: "<svg viewBox=\"0 0 24 24\"><path d=\"M5 19V5h14v14z\"/><path d=\"M8 9h8\"/><path d=\"M8 13h5\"/></svg>",
  money: "<svg viewBox=\"0 0 24 24\"><path d=\"M12 3v18\"/><path d=\"M17 7.5c-.8-1.1-2.2-1.8-4-1.8-2.4 0-4 1.1-4 2.8 0 4 8 2 8 6 0 1.7-1.6 2.8-4 2.8-2 0-3.6-.7-4.6-2\"/></svg>",
  network: "<svg viewBox=\"0 0 24 24\"><circle cx=\"8\" cy=\"8\" r=\"3\"/><circle cx=\"16\" cy=\"8\" r=\"3\"/><circle cx=\"12\" cy=\"17\" r=\"3\"/><path d=\"m10 10 2 4\"/><path d=\"m14 10-2 4\"/></svg>",
  outreach: "<svg viewBox=\"0 0 24 24\"><path d=\"M3 11v3a2 2 0 0 0 2 2h3l8 4V5L8 9H5a2 2 0 0 0-2 2z\"/><path d=\"M8 16v4\"/><path d=\"M19 9.5c.8.6 1.3 1.5 1.3 2.5s-.5 1.9-1.3 2.5\"/></svg>",
  plus: "<svg viewBox=\"0 0 24 24\"><path d=\"M12 5v14\"/><path d=\"M5 12h14\"/></svg>",
  prep: "<svg viewBox=\"0 0 24 24\"><path d=\"M8 4h8\"/><path d=\"M9 2h6v4H9z\"/><rect x=\"5\" y=\"5\" width=\"14\" height=\"16\" rx=\"2\"/><path d=\"m8 13 2 2 5-5\"/></svg>",
  print: "<svg viewBox=\"0 0 24 24\"><path d=\"M7 8V4h10v4\"/><path d=\"M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2\"/><path d=\"M7 14h10v7H7z\"/></svg>",
  referrals: "<svg viewBox=\"0 0 24 24\"><path d=\"M8 6h13\"/><path d=\"M8 12h13\"/><path d=\"M8 18h13\"/><path d=\"M3 6h.01\"/><path d=\"M3 12h.01\"/><path d=\"M3 18h.01\"/></svg>",
  scheduling: "<svg viewBox=\"0 0 24 24\"><path d=\"M7 3v4\"/><path d=\"M17 3v4\"/><rect x=\"4\" y=\"5\" width=\"16\" height=\"15\" rx=\"2\"/><path d=\"M8 12h3\"/><path d=\"M13 12h3\"/><path d=\"M8 16h3\"/></svg>",
  search: "<svg viewBox=\"0 0 24 24\"><circle cx=\"11\" cy=\"11\" r=\"7\"/><path d=\"m16 16 4 4\"/></svg>",
  settings: "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"3\"/><path d=\"M12 2.8v2.1\"/><path d=\"M12 19.1v2.1\"/><path d=\"M4.9 4.9l1.5 1.5\"/><path d=\"M17.6 17.6l1.5 1.5\"/><path d=\"M2.8 12h2.1\"/><path d=\"M19.1 12h2.1\"/><path d=\"M4.9 19.1l1.5-1.5\"/><path d=\"M17.6 6.4l1.5-1.5\"/><circle cx=\"12\" cy=\"12\" r=\"7\"/></svg>",
  users: "<svg viewBox=\"0 0 24 24\"><circle cx=\"9\" cy=\"8\" r=\"3\"/><path d=\"M3 20a6 6 0 0 1 12 0\"/><circle cx=\"17\" cy=\"9\" r=\"2\"/><path d=\"M15 15a5 5 0 0 1 6 5\"/></svg>"
};

function schedulingV2Icon(name) {
  return `<span class="scheduling-v2-icon" aria-hidden="true">${schedulingV2Icons[name] || ""}</span>`;
}

function renderSchedulingV2Sidebar() {
  const navModules = [
    { icon: "scheduling", label: "Schedule", tone: "schedule", children: ["Clinic", "Kitchen", "School"] },
    { icon: "users", label: "CRM", tone: "crm", children: ["Clients", "Referrals", "Referral Network", "Tasks", "Forms"] },
    { icon: "outreach", label: "Outreach", tone: "outreach", children: ["Events", "Contacts"] },
    { icon: "money", label: "Fundraising", tone: "fundraising", children: ["Grants", "Campaigns", "Donors", "Events", "Sales"] },
    { icon: "marketing", label: "Marketing", tone: "marketing", children: ["Newsletter", "Subscribers", "Assets"] },
    { icon: "settings", label: "Admin", tone: "admin", children: ["Data Tools", "KPI / Reports", "Settings"] }
  ];
  const quickActionsByModule = {
    Schedule: [
      { icon: "plus", label: "New Appointment", action: "new" },
      { icon: "calendar", label: "Block Time", action: "block-time" },
      { icon: "print", label: "Print Schedule", action: "print-schedule" },
      { icon: "file", label: "Print Appt Notes", action: "print-notes" },
      { icon: "users", label: "View Unscheduled", action: "view-unscheduled" }
    ],
    CRM: [
      { icon: "users", label: "New Client", action: "placeholder" },
      { icon: "referrals", label: "New Referral", action: "placeholder" },
      { icon: "file", label: "New Task", action: "placeholder" }
    ],
    Outreach: [
      { icon: "calendar", label: "New Event", action: "placeholder" },
      { icon: "users", label: "New Contact", action: "placeholder" }
    ],
    Fundraising: [
      { icon: "money", label: "New Grant", action: "placeholder" },
      { icon: "calendar", label: "New Event", action: "placeholder" }
    ],
    Marketing: [
      { icon: "marketing", label: "Placeholder Action", action: "placeholder" }
    ],
    Admin: [
      { icon: "settings", label: "Placeholder Action", action: "placeholder" }
    ]
  };
  const activeNavModule = navModules.find((module) => module.label === activeSchedulingPreviewNavModule) || navModules[0];
  const quickActions = quickActionsByModule[activeSchedulingPreviewNavModule] || quickActionsByModule.Schedule;

  return `
    <aside class="scheduling-v2-sidebar" aria-label="Scheduling preview navigation">
      <div class="scheduling-v2-brand">
        <span aria-hidden="true"><img src="./favicon.png" alt=""></span>
        <div>
          <strong>SNACK</strong>
          <small>Program Manager</small>
        </div>
        <button
          class="scheduling-v2-sidebar-toggle"
          data-scheduling-action="toggle-sidebar"
          type="button"
          aria-label="${schedulingV2SidebarCollapsed ? "Expand navigation" : "Collapse navigation"}"
          aria-pressed="${schedulingV2SidebarCollapsed ? "true" : "false"}"
        >${schedulingV2Icon(schedulingV2SidebarCollapsed ? "chevronRight" : "chevronLeft")}</button>
      </div>
      <nav class="scheduling-v2-nav" aria-label="Preview navigation">
        ${navModules.map((module) => {
    const expanded = module.label === activeSchedulingPreviewNavModule;
    return `
          <section class="scheduling-v2-nav-${escapeHtml(module.tone)} ${expanded ? "expanded" : ""}">
            <button class="${expanded ? "active" : ""}" data-scheduling-nav-module="${escapeHtml(module.label)}" type="button" aria-expanded="${expanded ? "true" : "false"}">
              ${schedulingV2Icon(module.icon)}
              ${escapeHtml(module.label)}
            </button>
            ${expanded ? `
              <div class="scheduling-v2-nav-tree">
                ${module.children.map((child, index) => `
                  <button class="${index === 0 ? "current" : ""}" type="button">${escapeHtml(child)}</button>
                `).join("")}
              </div>
            ` : ""}
          </section>
        `;
  }).join("")}
      </nav>
      <section class="scheduling-v2-quick-actions scheduling-v2-nav-${escapeHtml(activeNavModule.tone)}" aria-label="Quick actions">
        <h3>Quick Actions</h3>
        ${quickActions.map((action) => `
          <button data-scheduling-action="${escapeHtml(action.action)}" type="button">${schedulingV2Icon(action.icon)}${escapeHtml(action.label)}</button>
        `).join("")}
      </section>
      <div class="scheduling-v2-account">
        <span aria-hidden="true">SO</span>
        <div>
          <strong>Shannon Oddo</strong>
        </div>
      </div>
    </aside>
  `;
}

function renderSchedulingV2Topbar() {
  return `
    <header class="scheduling-v2-topbar">
      <div class="scheduling-v2-search">
        ${schedulingV2Icon("search")}
        <input type="search" value="" placeholder="Search clients, referrals, appointments..." aria-label="Search clients, referrals, appointments">
        <kbd>Cmd K</kbd>
      </div>
      <div class="scheduling-v2-top-actions">
        <button type="button" aria-label="Notifications">${schedulingV2Icon("bell")}<span>3</span></button>
        <button type="button" aria-label="Help">${schedulingV2Icon("help")}</button>
        <button class="scheduling-v2-user-menu" type="button">
          <span>SO</span>
          <strong>Shannon Oddo<small>Director</small></strong>
        </button>
      </div>
    </header>
  `;
}

function renderSchedulingV2PageHeader() {
  return `
    <header class="scheduling-v2-page-header">
      <h2>Clinic Schedule</h2>
      <div>
        <div class="scheduling-v2-view-switch" role="group" aria-label="Scheduling preview views">
          ${["day", "week", "month"].map((view) => `
            <button class="${activeSchedulingPreviewView === view ? "active" : ""}" data-scheduling-preview-view="${view}" type="button">${escapeHtml(titleCase(view))}</button>
          `).join("")}
        </div>
        <button class="scheduling-v2-primary" data-scheduling-action="new" type="button">${schedulingV2Icon("plus")}New Appointment</button>
      </div>
    </header>
  `;
}

function schedulingV2DateKeyOffset(dateKey, dayOffset) {
  return toDateString(addDays(new Date(`${dateKey}T00:00:00`), dayOffset));
}

function schedulingV2AppointmentsForDateKey(dateKey) {
  return schedulingPreviewAppointmentsForDate(dateKey);
}

function schedulingV2IsClinicDay(date) {
  return schedulingV2ClinicWeekdaySet.has(date.getDay());
}

function schedulingV2ClinicDaysForWeek(dateKey) {
  const start = weekStartDate(dateKey);
  return schedulingV2ClinicWeekdays.map((weekday) => {
    const date = schedulingDateForWeekday(start, weekday);
    const currentDateKey = toDateString(date);
    return {
      date,
      dateKey: currentDateKey,
      appointments: schedulingV2PreviewAgendaAppointments(schedulingV2AppointmentsForDateKey(currentDateKey))
    };
  });
}

function schedulingV2ClinicMonthDates(dateKey) {
  const visibleDate = new Date(`${dateKey}T00:00:00`);
  const monthStart = new Date(visibleDate.getFullYear(), visibleDate.getMonth(), 1);
  const monthEnd = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 0);
  const gridStart = weekStartDate(toDateString(monthStart));
  const dates = [];

  for (let weekStart = gridStart; weekStart <= monthEnd; weekStart = addDays(weekStart, 7)) {
    schedulingV2ClinicWeekdays.forEach((weekday) => {
      const date = schedulingDateForWeekday(weekStart, weekday);
      const currentDateKey = toDateString(date);
      dates.push({
        date,
        dateKey: currentDateKey,
        isCurrentMonth: date.getMonth() === visibleDate.getMonth(),
        appointments: schedulingV2PreviewAgendaAppointments(schedulingV2AppointmentsForDateKey(currentDateKey))
      });
    });
  }

  return dates;
}

function formatMonthYear(value) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(date);
}

function renderSchedulingV2MiniDatePicker() {
  const visibleDate = new Date(`${visibleSchedulingPreviewDate}T00:00:00`);
  const monthStart = new Date(visibleDate.getFullYear(), visibleDate.getMonth(), 1);
  const gridStart = addDays(monthStart, -monthStart.getDay());
  const selectedMonth = visibleDate.getMonth();
  const selectedDate = visibleSchedulingPreviewDate;

  return `
    <div class="scheduling-v2-mini-calendar" role="dialog" aria-label="Choose schedule date">
      <div class="scheduling-v2-mini-calendar-header">
        <button data-scheduling-calendar-month="-1" type="button" aria-label="Previous month">${schedulingV2Icon("chevronLeft")}</button>
        <strong>${escapeHtml(formatMonthYear(selectedDate))}</strong>
        <button data-scheduling-calendar-month="1" type="button" aria-label="Next month">${schedulingV2Icon("chevronRight")}</button>
      </div>
      <div class="scheduling-v2-mini-calendar-grid">
        ${["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => `<span>${escapeHtml(day)}</span>`).join("")}
        ${Array.from({ length: 42 }, (_, index) => {
    const day = addDays(gridStart, index);
    const dateKey = toDateString(day);
    const isCurrentMonth = day.getMonth() === selectedMonth;
    const isSelected = dateKey === selectedDate;
    return `
          <button
            class="${isSelected ? "selected" : ""} ${isCurrentMonth ? "" : "muted"}"
            data-scheduling-calendar-date="${escapeHtml(dateKey)}"
            type="button"
          >
            <span>${escapeHtml(String(day.getDate()))}</span>
          </button>
        `;
  }).join("")}
      </div>
    </div>
  `;
}

function schedulingV2PreviewAgendaAppointments(appointments) {
  return appointments.filter((appointment) => {
    const start = appointmentTimeValue(appointment.appointmentTime);
    const end = start + appointmentDurationMinutes(appointment);
    return start < schedulingOfficeEndMinutes && end > schedulingOfficeStartMinutes;
  });
}

function schedulingV2AgendaCardName(appointments) {
  if (appointments.length === 1 && appointmentIsBlockTime(appointments[0])) {
    return "Blocked Time";
  }

  const names = appointments.flatMap(appointmentClientNames);
  const uniqueNames = [...new Map(names.map((name) => [normalizedLookupKey(name), name])).values()].filter(Boolean);

  if (uniqueNames.length > 1) {
    return formatFirstNameList(uniqueNames) || uniqueNames.join(", ");
  }

  return uniqueNames[0] || "Unknown client";
}

function schedulingV2AppointmentFamilyKey(appointment) {
  const clientRows = appointmentPreviewClientRows(appointment);
  const phone = clientRows.find((client) => client.phone)?.phone || "";
  const caregiver = clientRows.find((client) => client.caregiver)?.caregiver || "";

  if (phone || caregiver) {
    return normalizedLookupKey(`${phone}|${caregiver}`);
  }

  return normalizedLookupKey(appointmentClientNames(appointment).map((name) => String(name).trim().split(/\s+/).slice(1).join(" ")).join("|"));
}

function schedulingV2AppointmentLastNameKeys(appointment) {
  const clientRecords = appointmentClientRecords(appointment);
  const recordKeys = clientRecords
    .map((client) => normalizedLookupKey(client.lastName || ""))
    .filter(Boolean);

  if (recordKeys.length) {
    return new Set(recordKeys);
  }

  return new Set(appointmentClientNames(appointment)
    .map((name) => normalizedLookupKey(String(name || "").trim().split(/\s+/).slice(1).join(" ")))
    .filter(Boolean));
}

function schedulingV2AppointmentsShareSiblingLink(first, second) {
  const firstRecords = appointmentClientRecords(first);
  const secondRecords = appointmentClientRecords(second);
  const firstIds = new Set(firstRecords.map((client) => client.id).filter(Boolean));
  const secondIds = new Set(secondRecords.map((client) => client.id).filter(Boolean));

  return firstRecords.some((client) =>
    Array.isArray(client.siblingIds) && client.siblingIds.some((siblingId) => secondIds.has(siblingId))
  ) || secondRecords.some((client) =>
    Array.isArray(client.siblingIds) && client.siblingIds.some((siblingId) => firstIds.has(siblingId))
  );
}

function schedulingV2AppointmentsShareFamilyName(first, second) {
  const firstKeys = schedulingV2AppointmentLastNameKeys(first);
  const secondKeys = schedulingV2AppointmentLastNameKeys(second);

  return [...firstKeys].some((key) => secondKeys.has(key));
}

function schedulingV2AppointmentsShareFamilySignal(first, second) {
  const firstFamilyKey = schedulingV2AppointmentFamilyKey(first);
  const secondFamilyKey = schedulingV2AppointmentFamilyKey(second);

  return schedulingV2AppointmentsShareSiblingLink(first, second) ||
    (Boolean(firstFamilyKey) && firstFamilyKey === secondFamilyKey) ||
    schedulingV2AppointmentsShareFamilyName(first, second);
}

function schedulingV2CanVisuallyGroupAppointments(first, second) {
  if (!first || !second) {
    return false;
  }

  const firstStart = appointmentTimeMinutes(first.appointmentTime);
  const secondStart = appointmentTimeMinutes(second.appointmentTime);
  const firstDuration = appointmentDurationMinutes(first);
  const secondDuration = appointmentDurationMinutes(second);

  if (firstStart === null || secondStart === null) {
    return false;
  }

  return (firstDuration <= 15 || secondDuration <= 15) &&
    secondStart === firstStart + firstDuration &&
    schedulingV2AppointmentDisplayStatus(first) === schedulingV2AppointmentDisplayStatus(second) &&
    appointmentTypeLabel(first) === appointmentTypeLabel(second) &&
    normalizedLookupKey(appointmentLessonTopicTitle(first) || "") === normalizedLookupKey(appointmentLessonTopicTitle(second) || "") &&
    schedulingV2AppointmentsShareFamilySignal(first, second);
}

function schedulingV2AgendaDisplayItems(slotAppointments) {
  const sortedAppointments = [...slotAppointments].sort((first, second) => appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime));
  const items = [];

  for (let index = 0; index < sortedAppointments.length; index += 1) {
    const appointments = [sortedAppointments[index]];

    while (index + 1 < sortedAppointments.length && schedulingV2CanVisuallyGroupAppointments(appointments[appointments.length - 1], sortedAppointments[index + 1])) {
      appointments.push(sortedAppointments[index + 1]);
      index += 1;
    }

    items.push({ appointments, primary: appointments[0] });
  }

  return items;
}

function schedulingV2GroupedDuration(appointments) {
  const starts = appointments
    .map((appointment) => appointmentTimeMinutes(appointment.appointmentTime))
    .filter((minutes) => minutes !== null);

  if (!starts.length) {
    return appointments.reduce((total, appointment) => total + appointmentDurationMinutes(appointment), 0);
  }

  const start = Math.min(...starts);
  const end = Math.max(...appointments.map((appointment) => {
    const appointmentStart = appointmentTimeMinutes(appointment.appointmentTime);
    return (appointmentStart ?? start) + appointmentDurationMinutes(appointment);
  }));

  return Math.max(15, end - start);
}

function renderSchedulingV2Controls(dateAppointments) {
  return `
    <section class="scheduling-v2-date-card" aria-label="Scheduling preview date controls">
      <div class="scheduling-v2-date-row">
        <button data-scheduling-date="today" type="button">Today</button>
        <button class="scheduling-v2-date-arrow" data-scheduling-date="previous" type="button" aria-label="Previous day">${schedulingV2Icon("chevronLeft")}</button>
        <button class="scheduling-v2-date-arrow" data-scheduling-date="next" type="button" aria-label="Next day">${schedulingV2Icon("chevronRight")}</button>
        <div class="scheduling-v2-date-picker">
          <button data-scheduling-date-picker-toggle type="button" aria-expanded="${schedulingV2DatePickerOpen ? "true" : "false"}">
            ${schedulingV2Icon("calendar")}
            <span>${escapeHtml(formatDayPickerDate(visibleSchedulingPreviewDate))}</span>
          </button>
          ${schedulingV2DatePickerOpen ? renderSchedulingV2MiniDatePicker() : ""}
        </div>
      </div>
      <div class="scheduling-v2-counters">
        ${schedulingPreviewCounterItems(dateAppointments).map((item, index) => `
          <article class="scheduling-v2-counter-${escapeHtml(item.tone)}" style="--counter-index: ${index};">
            <strong>${escapeHtml(item.value)}</strong>
            <span>${escapeHtml(item.label)}</span>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderSchedulingV2Agenda(dateAppointments) {
  const startMinutes = schedulingStartMinutes;
  const endMinutes = schedulingEndMinutes;
  const totalMinutes = endMinutes - startMinutes;
  const minuteHeight = 2.5;
  const hourStarts = [];
  const halfHourStarts = [];
  const quarterStarts = [];
  const firstHourStart = Math.ceil(startMinutes / 60) * 60;
  const firstHalfHourStart = Math.ceil(startMinutes / 30) * 30;
  const firstBookableStart = Math.max(startMinutes, schedulingBookableStartMinutes);
  const latestBookableStart = Math.min(endMinutes, schedulingBookableEndMinutes) - schedulingDefaultDurationMinutes;

  for (let mark = firstHourStart; mark <= endMinutes; mark += 60) {
    hourStarts.push(mark);
  }

  for (let mark = firstHalfHourStart; mark <= endMinutes; mark += 30) {
    halfHourStarts.push(mark);
  }

  for (let mark = firstBookableStart; mark <= latestBookableStart; mark += schedulingSlotIntervalMinutes) {
    quarterStarts.push(mark);
  }
  const agendaAppointments = dateAppointments.filter((appointment) => {
    const appointmentStart = appointmentTimeValue(appointment.appointmentTime);
    const appointmentEnd = appointmentStart + appointmentDurationMinutes(appointment);
    return appointmentStart < endMinutes && appointmentEnd > startMinutes;
  });
  const displayItems = schedulingV2AgendaDisplayItems(agendaAppointments);

  return `
    <section class="scheduling-v2-agenda-card" aria-label="Day agenda">
      <div class="scheduling-v2-agenda">
        <div class="scheduling-v2-time-grid" style="--agenda-total-height: ${totalMinutes * minuteHeight}px;">
          ${hourStarts.map((hourStart) => {
          const hour = Math.floor(hourStart / 60);
          return `
              <div class="scheduling-v2-hour-marker" style="--minute-offset-px: ${(hourStart - startMinutes) * minuteHeight}px;">
                <time>${escapeHtml(formatAppointmentTime(`${String(hour).padStart(2, "0")}:00`))}</time>
                <span></span>
              </div>
            `;
        }).join("")}
          ${halfHourStarts
            .filter((slotStart) => slotStart % 60 !== 0)
            .map((slotStart) => {
              const halfHour = Math.floor(slotStart / 60);
              return `
                <div class="scheduling-v2-half-hour-marker" style="--minute-offset-px: ${(slotStart - startMinutes) * minuteHeight}px;">
                  <time>${escapeHtml(formatAppointmentTime(`${String(halfHour).padStart(2, "0")}:30`))}</time>
                  <span></span>
                </div>
              `;
            }).join("")}
          ${quarterStarts.map((slotStart) => {
            const slotHour = Math.floor(slotStart / 60);
            const slotMinute = slotStart % 60;
            const slotCovered = agendaAppointments.some((appointment) => {
              const appointmentMinutes = appointmentTimeValue(appointment.appointmentTime);
              return appointmentMinutes <= slotStart && appointmentMinutes + appointmentDurationMinutes(appointment) > slotStart;
            });
            return slotCovered ? `
              <span class="scheduling-v2-slot-covered" style="--slot-top-px: ${(slotStart - startMinutes) * minuteHeight}px;"></span>
            ` : `
              <button class="scheduling-v2-empty-slot" style="--slot-top-px: ${(slotStart - startMinutes) * minuteHeight}px;" data-scheduling-empty-slot="${escapeHtml(`${String(slotHour).padStart(2, "0")}:${String(slotMinute).padStart(2, "0")}`)}" type="button" aria-label="Create appointment at ${escapeHtml(formatAppointmentTime(`${String(slotHour).padStart(2, "0")}:${String(slotMinute).padStart(2, "0")}`))}"></button>
            `;
          }).join("")}
          ${displayItems.map((item) => {
    const appointment = item.primary;
    const groupedDuration = schedulingV2GroupedDuration(item.appointments);
    const status = schedulingV2AppointmentDisplayStatus(appointment);
    const appointmentStart = appointmentTimeValue(appointment.appointmentTime);
    const appointmentEnd = appointmentStart + Math.max(15, groupedDuration);
    const startOffset = Math.max(0, appointmentStart - startMinutes);
    const appointmentDuration = Math.max(15, Math.min(appointmentEnd, endMinutes) - Math.max(appointmentStart, startMinutes));
    const compactClass = appointmentDuration < 30 ? "scheduling-v2-appointment-card-compact" : "";
    return `
            <button
              class="scheduling-v2-appointment-card ${compactClass} ${item.appointments.some((current) => current.id === selectedSchedulingPreviewAppointmentId) ? "selected" : ""}"
              type="button"
              data-scheduling-preview-appointment="${escapeHtml(appointment.id)}"
              style="--appointment-accent: ${escapeHtml(appointmentLessonAccent(appointment))}; --appointment-top-px: ${startOffset * minuteHeight}px; --appointment-height-px: ${appointmentDuration * minuteHeight}px;"
            >
              <span>${escapeHtml(schedulingV2AgendaCardName(item.appointments))}</span>
              <em>${escapeHtml(status)}</em>
              <small>${escapeHtml([appointmentLessonTopicTitle(appointment) || appointmentTypeLabel(appointment), formatDuration(groupedDuration)].filter(Boolean).join(" | "))}</small>
            </button>
          `;
  }).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderSchedulingV2CompactAppointment(appointment, { dateKey = "" } = {}) {
  return renderSchedulingV2CompactAppointmentGroup([appointment], { dateKey });
}

function renderSchedulingV2CompactAppointmentGroup(appointments, { dateKey = "" } = {}) {
  const appointment = appointments[0];
  const status = schedulingV2AppointmentDisplayStatus(appointment);
  const groupedDuration = schedulingV2GroupedDuration(appointments);
  return `
    <button
      class="scheduling-v2-compact-appointment"
      type="button"
      data-scheduling-preview-appointment="${escapeHtml(appointment.id)}"
      ${dateKey ? `data-scheduling-preview-date="${escapeHtml(dateKey)}"` : ""}
      style="--appointment-accent: ${escapeHtml(appointmentLessonAccent(appointment))};"
    >
      <strong>${escapeHtml(formatAppointmentTime(appointment.appointmentTime) || "Time TBD")}</strong>
      <span>${escapeHtml(schedulingV2AgendaCardName(appointments))}</span>
      <em>${escapeHtml(status)}</em>
      <small>${escapeHtml([appointmentLessonTopicTitle(appointment) || appointmentTypeLabel(appointment), formatDuration(groupedDuration)].filter(Boolean).join(" | "))}</small>
    </button>
  `;
}

function renderSchedulingV2WeekView() {
  const days = schedulingV2ClinicDaysForWeek(visibleSchedulingPreviewDate);

  return `
    <section class="scheduling-v2-agenda-card scheduling-v2-week-view" aria-label="Week view">
      ${days.map((day) => `
        <article class="${day.dateKey === visibleSchedulingPreviewDate ? "selected" : ""}">
          <button class="scheduling-v2-week-day-header" data-scheduling-calendar-date="${escapeHtml(day.dateKey)}" type="button">
            <strong>${escapeHtml(new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(day.date))}</strong>
            <span>${escapeHtml(formatDateOnly(day.dateKey))}</span>
            <em>${escapeHtml(String(day.appointments.length))}</em>
          </button>
          <div>
            ${day.appointments.length
    ? schedulingV2AgendaDisplayItems(day.appointments).map((item) => renderSchedulingV2CompactAppointmentGroup(item.appointments, { dateKey: day.dateKey })).join("")
    : `<p>Open clinic day.</p>`}
          </div>
        </article>
      `).join("")}
    </section>
  `;
}

function renderSchedulingV2MonthAppointment(appointment, dateKey) {
  return renderSchedulingV2MonthAppointmentGroup([appointment], dateKey);
}

function renderSchedulingV2MonthAppointmentGroup(appointments, dateKey) {
  const appointment = appointments[0];
  return `
    <button
      class="scheduling-v2-month-appointment"
      type="button"
      data-scheduling-preview-appointment="${escapeHtml(appointment.id)}"
      data-scheduling-preview-date="${escapeHtml(dateKey)}"
      style="--appointment-accent: ${escapeHtml(appointmentLessonAccent(appointment))};"
    >
      <span>${escapeHtml(formatAppointmentTime(appointment.appointmentTime) || "Time TBD")}</span>
      <strong>${escapeHtml(schedulingV2AgendaCardName(appointments))}</strong>
    </button>
  `;
}

function renderSchedulingV2MonthView() {
  const monthDates = schedulingV2ClinicMonthDates(visibleSchedulingPreviewDate);
  const clinicDayLabels = schedulingWeekdayLabels("short");
  const clinicDayCopy = schedulingWeekdayLabels("long").join(", ");

  return `
    <section class="scheduling-v2-agenda-card scheduling-v2-month-view" aria-label="Month view">
      <header>
        <h3>${escapeHtml(formatMonthYear(visibleSchedulingPreviewDate))}</h3>
        <p>Clinic appointments are available ${escapeHtml(clinicDayCopy)}.</p>
      </header>
      <div class="scheduling-v2-month-grid" style="--scheduling-v2-month-days: ${clinicDayLabels.length};">
        ${clinicDayLabels.map((day) => `<span>${escapeHtml(day)}</span>`).join("")}
        ${monthDates.map((day) => {
          const selected = day.dateKey === visibleSchedulingPreviewDate;
          const appointmentCount = day.appointments.length;
          return `
          <article class="${selected ? "selected" : ""} ${day.isCurrentMonth ? "" : "muted"}">
            <button class="scheduling-v2-month-day" data-scheduling-calendar-date="${escapeHtml(day.dateKey)}" type="button">
              <strong>${escapeHtml(new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(day.date))}</strong>
              <em>${appointmentCount ? escapeHtml(`${appointmentCount} appt${appointmentCount === 1 ? "" : "s"}`) : "Open"}</em>
            </button>
            <div class="scheduling-v2-month-appointments">
              ${appointmentCount ? schedulingV2AgendaDisplayItems(day.appointments).map((item) => renderSchedulingV2MonthAppointmentGroup(item.appointments, day.dateKey)).join("") : ""}
            </div>
          </article>
        `;
  }).join("")}
      </div>
    </section>
  `;
}

function renderSchedulingV2ListView() {
  const startKey = visibleSchedulingPreviewDate;
  const appointments = loadedAppointments
    .filter((appointment) => appointment.status !== "Canceled" && appointment.appointmentDate >= startKey)
    .sort(
      (first, second) =>
        dateValue(first.appointmentDate) - dateValue(second.appointmentDate) ||
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime)
    )
    .slice(0, 24);
  const grouped = appointments.reduce((groups, appointment) => {
    const key = appointment.appointmentDate || "";
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(appointment);
    return groups;
  }, new Map());

  return `
    <section class="scheduling-v2-agenda-card scheduling-v2-list-view" aria-label="List view">
      ${grouped.size ? [...grouped.entries()].map(([dateKey, dateAppointments]) => `
        <article>
          <button class="scheduling-v2-list-date" data-scheduling-calendar-date="${escapeHtml(dateKey)}" type="button">
            <strong>${escapeHtml(formatFullDate(dateKey))}</strong>
            <span>${escapeHtml(`${dateAppointments.length} appointment${dateAppointments.length === 1 ? "" : "s"}`)}</span>
          </button>
          <div>
            ${schedulingV2AgendaDisplayItems(dateAppointments).map((item) => renderSchedulingV2CompactAppointmentGroup(item.appointments, { dateKey })).join("")}
          </div>
        </article>
      `).join("") : `
        <p class="scheduling-v2-empty-list">No upcoming appointments found.</p>
      `}
    </section>
  `;
}

function renderSchedulingV2ScheduleView(dateAppointments) {
  if (activeSchedulingPreviewView === "week") {
    return renderSchedulingV2WeekView();
  }

  if (activeSchedulingPreviewView === "month") {
    return renderSchedulingV2MonthView();
  }

  return renderSchedulingV2Agenda(dateAppointments);
}

function schedulingV2InfoRow(label, value) {
  return `
    <div class="scheduling-v2-info-row">
      <span>${label}</span>
      <strong>${escapeHtml(value || "-")}</strong>
    </div>
  `;
}

function schedulingV2StackedInfoRow(label, values) {
  const visibleValues = values.map((value) => String(value || "").trim()).filter(Boolean);
  return `
    <div class="scheduling-v2-info-row scheduling-v2-info-row-stacked">
      <span>${escapeHtml(label)}</span>
      <strong>${visibleValues.length ? visibleValues.map((value) => `<span>${escapeHtml(value)}</span>`).join("") : "-"}</strong>
    </div>
  `;
}

function schedulingV2StackedClientLinks(label, clients) {
  const visibleClients = clients
    .map((client) => ({
      id: client.id || "",
      name: firstNameFromFullName(client.name || clientName(client))
    }))
    .filter((client) => client.name);

  return `
    <div class="scheduling-v2-info-row scheduling-v2-info-row-stacked scheduling-v2-info-row-links">
      <span>${escapeHtml(label)}</span>
      <div>
        ${visibleClients.length ? visibleClients.map((client) => client.id ? `
          <button class="scheduling-v2-client-link" data-scheduling-client="${escapeHtml(client.id)}" type="button">${escapeHtml(client.name)}</button>
        ` : `<span>${escapeHtml(client.name)}</span>`).join("") : "<span>-</span>"}
      </div>
    </div>
  `;
}

function schedulingV2Chevron() {
  return `<svg class="scheduling-v2-chevron" aria-hidden="true" viewBox="0 0 12 12"><path d="M3 4.7 6 7.3l3-2.6"></path></svg>`;
}

function schedulingV2CheckControl(fieldName, label, value) {
  const options = appointmentWrapUpOptions[fieldName] || [value];

  return `
    <div class="scheduling-v2-check-control">
      <span>${escapeHtml(label)}</span>
      <select name="${escapeHtml(fieldName)}" data-scheduling-wrap-field="${escapeHtml(fieldName)}" aria-label="${escapeHtml(label)}">
        ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}
      </select>
    </div>
  `;
}

function schedulingV2OptionList(options, selectedValue = "") {
  return options.map((option) => {
    const value = typeof option === "string" ? option : option.value;
    const label = typeof option === "string" ? option : option.label;
    return `<option value="${escapeHtml(value)}" ${String(value) === String(selectedValue || "") ? "selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

function storedSchedulingStaffMembers() {
  try {
    const names = JSON.parse(localStorage.getItem(schedulingStaffMembersStorageKey) || "[]");
    return Array.isArray(names) ? names.map((name) => String(name || "").trim()).filter(Boolean) : [];
  } catch (_error) {
    return [];
  }
}

function saveSchedulingStaffMember(name) {
  const normalizedName = String(name || "").trim();

  if (!normalizedName) {
    return "";
  }

  const names = new Set(storedSchedulingStaffMembers());
  names.add(normalizedName);
  localStorage.setItem(schedulingStaffMembersStorageKey, JSON.stringify([...names].sort((first, second) => first.localeCompare(second))));
  return normalizedName;
}

function normalizeSchedulingStaffSelection(value) {
  const staffValue = String(value || "").trim();
  return staffValue === "__add_staff__" ? "" : staffValue;
}

function schedulingV2StaffMembers(selectedValue = "") {
  const staffNames = new Set(defaultSchedulingStaffMembers);
  const selected = String(selectedValue || "").trim();

  storedSchedulingStaffMembers().forEach((name) => {
    if (!inactiveSchedulingStaffMembers.has(name)) {
      staffNames.add(name);
    }
  });

  if (selected) {
    staffNames.add(selected);
  }

  return [...staffNames].sort((first, second) => first.localeCompare(second));
}

function schedulingV2StaffOptions(selectedValue = "") {
  return schedulingV2OptionList([
    { value: "", label: "-" },
    ...schedulingV2StaffMembers(selectedValue).map((name) => ({ value: name, label: name })),
    { value: "__add_staff__", label: "+ Add staff member" }
  ], selectedValue);
}

function schedulingV2ClientSearchOptions() {
  return loadedClients
    .map((client) => `<option value="${escapeHtml(clientName(client))}">${escapeHtml([client.parentName, formatPhone(client.phone), client.status].filter(Boolean).join(" | "))}</option>`)
    .join("");
}

function schedulingV2ClientSearchField(primaryClientId = "") {
  const primaryClient = loadedClients.find((client) => client.id === primaryClientId);
  return `
    <input name="clientSearch" list="scheduling-v2-client-options" value="${escapeHtml(primaryClient ? clientName(primaryClient) : "")}" placeholder="Start typing a client name" autocomplete="off" required>
    <datalist id="scheduling-v2-client-options">
      ${schedulingV2ClientSearchOptions()}
    </datalist>
  `;
}

function uniqueSchedulingV2ClientNames(clientNames) {
  const seenNames = new Set();
  return (Array.isArray(clientNames) ? clientNames : [])
    .map((name) => String(name || "").trim())
    .filter((name) => {
      const key = normalizedLookupKey(name);
      if (!key || seenNames.has(key)) {
        return false;
      }
      seenNames.add(key);
      return true;
    });
}

function schedulingV2InlineClientNamesValue(clientNames) {
  return escapeHtml(JSON.stringify(uniqueSchedulingV2ClientNames(clientNames)));
}

function schedulingV2InlineClientPicker(clientIds, clientNames = []) {
  return `
    <div class="scheduling-v2-inline-client-picker">
      <div class="scheduling-v2-inline-client-add">
        <input name="clientSearch" list="scheduling-v2-client-options" value="" placeholder="Start typing a client name" autocomplete="off">
        <button data-scheduling-action="add-inline-client" type="button">Add</button>
      </div>
      <datalist id="scheduling-v2-client-options">
        ${schedulingV2ClientSearchOptions()}
      </datalist>
      <input type="hidden" name="clientIds" value="${escapeHtml(clientIds.join(","))}">
      <input type="hidden" name="clientNames" value="${schedulingV2InlineClientNamesValue(clientNames)}">
      ${schedulingV2InlineClientSummary(clientIds, { clientNames, removable: true })}
    </div>
  `;
}

function schedulingV2LessonOptions(selectedValue = "") {
  const options = [
    { value: "", label: "-" },
    ...Object.entries(appointmentLessonTitles).map(([value, label]) => ({ value, label })),
    { value: "Check In", label: "Check In" }
  ];
  return schedulingV2OptionList(options, selectedValue);
}

function schedulingV2InlineSourceAppointment() {
  return schedulingV2InlineAppointmentId
    ? loadedAppointments.find((appointment) => appointment.id === schedulingV2InlineAppointmentId) || null
    : null;
}

function schedulingV2InlineDefaultAppointment() {
  const source = schedulingV2InlineSourceAppointment();
  return {
    ...(source || {}),
    ...schedulingV2InlineDefaults
  };
}

function schedulingV2InlineTitle(mode, appointment) {
  if (mode === "complete") {
    return `Complete ${schedulingV2AgendaCardName([appointment])}`;
  }

  if (mode === "reschedule") {
    return `Reschedule ${schedulingV2AgendaCardName([appointment])}`;
  }

  if (mode === "block") {
    return appointment?.id ? "Edit Blocked Time" : "New Blocked Time";
  }

  if (mode === "edit") {
    return `Edit ${schedulingV2AgendaCardName([appointment])}`;
  }

  return "New Appointment";
}

function schedulingV2InlineClientIds(appointment, mode) {
  if (mode === "block") {
    return [];
  }

  const defaults = Array.isArray(schedulingV2InlineDefaults.clientIds)
    ? schedulingV2InlineDefaults.clientIds
    : schedulingV2InlineDefaults.clientId ? [schedulingV2InlineDefaults.clientId] : [];
  return defaults.length ? defaults : appointmentClientIds(appointment || {});
}

function schedulingV2InlineClientNames(appointment, mode) {
  if (mode === "block") {
    return [];
  }

  const defaults = Array.isArray(schedulingV2InlineDefaults.clientNames)
    ? schedulingV2InlineDefaults.clientNames
    : schedulingV2InlineDefaults.clientName ? [schedulingV2InlineDefaults.clientName] : [];
  const clientIds = schedulingV2InlineClientIds(appointment, mode);
  const selectedClientNames = schedulingV2ClientRowsFromIds(clientIds).map(clientName);
  const selectedNameKeys = new Set(selectedClientNames.map((name) => normalizedLookupKey(name)));

  return uniqueSchedulingV2ClientNames(defaults.length ? defaults : appointmentClientNames(appointment || {}))
    .filter((name) => !selectedNameKeys.has(normalizedLookupKey(name)));
}

function schedulingV2InlineClientSummary(clientIds, options = {}) {
  const clients = clientIds
    .map((clientId) => loadedClients.find((client) => client.id === clientId))
    .filter(Boolean);
  const selectedNameKeys = new Set(clients.map((client) => normalizedLookupKey(clientName(client))));
  const fallbackNames = uniqueSchedulingV2ClientNames(options.clientNames || [])
    .filter((name) => !selectedNameKeys.has(normalizedLookupKey(name)));

  if (!clients.length && !fallbackNames.length) {
    return "";
  }

  return `
    <div class="scheduling-v2-inline-selected-clients">
      ${clients.map((client) => `
        <span>
          ${escapeHtml(clientName(client))}
          ${options.removable ? `<button data-scheduling-action="remove-inline-client" data-client-id="${escapeHtml(client.id)}" type="button" aria-label="Remove ${escapeHtml(clientName(client))}">Remove</button>` : ""}
        </span>
      `).join("")}
      ${fallbackNames.map((name) => `
        <span>
          ${escapeHtml(name)}
          ${options.removable ? `<button data-scheduling-action="remove-inline-client-name" data-client-name="${escapeHtml(name)}" type="button" aria-label="Remove ${escapeHtml(name)}">Remove</button>` : ""}
        </span>
      `).join("")}
    </div>
  `;
}

function schedulingV2InlineTimeOptions(appointment, selectedTime, mode) {
  const clientIds = schedulingV2InlineClientIds(appointment, mode);
  const overrides = {
    clientIds,
    appointmentDate: appointment.appointmentDate || visibleSchedulingPreviewDate,
    appointmentType: appointment.appointmentType || (mode === "block" ? "Administrative" : "Nutrition Education"),
    durationMinutes: appointment.durationMinutes,
    lesson: appointment.lesson || "",
    status: appointment.status || (mode === "block" ? "Blocked" : "Scheduled"),
    excludedAppointmentId: appointment.id || schedulingV2InlineAppointmentId || ""
  };
  const times = appointmentValidTimeValues(selectedTime, overrides);
  const normalizedSelected = normalizeAppointmentTime(selectedTime);

  if (normalizedSelected && !times.includes(normalizedSelected)) {
    times.unshift(normalizedSelected);
  }

  return times;
}

function renderSchedulingV2InlineForm() {
  const mode = schedulingV2InlineMode || "new";
  const source = schedulingV2InlineSourceAppointment();
  const appointment = schedulingV2InlineDefaultAppointment();
  const isBlock = mode === "block" || appointmentDisplayStatus(appointment) === "Blocked";
  const isEditing = mode === "edit" || mode === "block";
  const clientIds = schedulingV2InlineClientIds(appointment, isBlock ? "block" : mode);
  const clientNames = schedulingV2InlineClientNames(appointment, isBlock ? "block" : mode);
  const selectedTime = normalizeAppointmentTime(appointment.appointmentTime || "");
  const timeOptions = schedulingV2InlineTimeOptions(appointment, selectedTime, isBlock ? "block" : mode);
  const title = schedulingV2InlineTitle(isBlock ? "block" : mode, appointment);
  const appointmentType = isBlock ? "Administrative" : appointment.appointmentType || (appointment.lesson ? "Nutrition Education" : "Enrollment");
  const status = isBlock ? "Blocked" : appointment.status || "Scheduled";
  const lessonHidden = appointmentType !== "Nutrition Education" ? "hidden" : "";

  return `
    <section class="scheduling-v2-detail-card scheduling-v2-inline-card" aria-label="${escapeHtml(title)}">
      <div class="scheduling-v2-detail-left">
        <div class="scheduling-v2-selected-status ${isBlock ? "blocked" : ""}">
          <span class="scheduling-v2-status-dot" aria-hidden="true"></span>
          <span>${escapeHtml(status)}</span>
        </div>
        <h3>${escapeHtml(title)}</h3>
        <div class="scheduling-v2-detail-meta">
	          ${schedulingV2InfoRow(`${schedulingV2Icon("calendar")}Date`, formatFullDate(appointment.appointmentDate || visibleSchedulingPreviewDate))}
	          ${schedulingV2InfoRow(`${schedulingV2Icon("clock")}Time`, formatAppointmentTime(appointment.appointmentTime || "") || "Choose time")}
	          ${isBlock
	    ? schedulingV2InfoRow(`${schedulingV2Icon("users")}Staff`, appointment.staffMember || "-")
	    : schedulingV2InfoRow(`${schedulingV2Icon("file")}Type`, appointmentType)}
	        </div>
      </div>
      <div class="scheduling-v2-detail-main">
        <form class="scheduling-v2-inline-form" data-scheduling-v2-inline-form data-mode="${escapeHtml(mode)}" data-appointment-id="${escapeHtml(source?.id || "")}">
          <div class="scheduling-v2-inline-form-header">
            <h4>${escapeHtml(isBlock ? "Blocked Time" : "Appointment")}</h4>
            <button data-scheduling-action="cancel-inline" type="button">Cancel</button>
          </div>
          <div class="scheduling-v2-inline-grid">
            ${isBlock ? "" : `
              <label class="scheduling-v2-inline-field scheduling-v2-inline-wide">
                <span>Clients</span>
                ${schedulingV2InlineClientPicker(clientIds, clientNames)}
              </label>
            `}
            <label class="scheduling-v2-inline-field">
              <span>Status</span>
              <select name="status" ${isBlock ? "disabled" : ""}>
                ${schedulingV2OptionList(appointmentStatuses.filter((item) => item !== "Blocked"), status)}
                ${isBlock ? `<option value="Blocked" selected>Blocked</option>` : ""}
              </select>
            </label>
            <label class="scheduling-v2-inline-field">
              <span>Date</span>
              <input name="appointmentDate" type="date" required value="${escapeHtml(appointment.appointmentDate || visibleSchedulingPreviewDate)}">
            </label>
            <label class="scheduling-v2-inline-field">
              <span>Time</span>
              <select name="appointmentTime" required>
                <option value="">Choose time</option>
                ${timeOptions.map((time) => `<option value="${escapeHtml(time)}" ${time === selectedTime ? "selected" : ""}>${escapeHtml(formatAppointmentTime(time))}</option>`).join("")}
              </select>
            </label>
            <label class="scheduling-v2-inline-field">
              <span>Type</span>
              <select name="appointmentType" ${isBlock ? "disabled" : ""}>
                ${schedulingV2OptionList(["Enrollment", "Nutrition Education", "Administrative"], appointmentType)}
              </select>
            </label>
            <label class="scheduling-v2-inline-field" ${lessonHidden}>
              <span>Lesson</span>
              <select name="lesson">${schedulingV2LessonOptions(appointment.lesson || "")}</select>
            </label>
            <label class="scheduling-v2-inline-field" ${lessonHidden}>
              <span>Goal</span>
              <input name="goal" value="${escapeHtml(appointment.goal || "")}">
            </label>
	            <label class="scheduling-v2-inline-field">
	              <span>Staff</span>
	              <select name="staffMember" data-scheduling-staff-select>${schedulingV2StaffOptions(appointment.staffMember || "")}</select>
	            </label>
            <label class="scheduling-v2-inline-field scheduling-v2-inline-wide">
              <span>Notes</span>
              <textarea name="notes">${escapeHtml(appointment.notes || (isBlock ? "Blocked time" : ""))}</textarea>
            </label>
          </div>
          <div class="scheduling-v2-inline-actions">
            ${isEditing && source?.id ? `<button class="danger" data-scheduling-action="delete-inline" type="button">${isBlock ? "Delete Block" : "Delete"}</button>` : ""}
            <button type="submit">${escapeHtml(isEditing ? isBlock ? "Update Block" : "Update Appointment" : isBlock ? "Save Block" : "Save Appointment")}</button>
          </div>
        </form>
      </div>
    </section>
  `;
}

function clearSchedulingV2InlineState() {
  schedulingV2InlineMode = "";
  schedulingV2InlineAppointmentId = "";
  schedulingV2InlineDefaults = {};
}

function startSchedulingV2InlineForm(mode, defaultsOrAppointment = {}) {
  const appointment = defaultsOrAppointment || {};
  schedulingV2InlineMode = mode;
  schedulingV2InlineAppointmentId = appointment.id || "";
  schedulingV2InlineDefaults = { ...appointment };

  if (mode === "new" && !schedulingV2InlineDefaults.appointmentDate) {
    schedulingV2InlineDefaults.appointmentDate = visibleSchedulingPreviewDate;
  }

  if (mode === "new" && !schedulingV2InlineDefaults.staffMember) {
    schedulingV2InlineDefaults.staffMember = defaultSchedulingStaffMembers[0] || "";
  }

  if (mode === "block") {
    schedulingV2InlineDefaults = {
      appointmentDate: visibleSchedulingPreviewDate,
      appointmentTime: "",
      staffMember: "",
      notes: "Blocked time",
      ...schedulingV2InlineDefaults,
      appointmentType: "Administrative",
      status: "Blocked",
      clientName: "Blocked Time",
      clientNames: ["Blocked Time"],
      clientIds: []
    };
  }

  if (mode === "reschedule") {
    schedulingV2InlineDefaults = {
      ...appointment,
      appointmentDate: defaultNextAppointmentDate(appointment),
      appointmentTime: normalizeAppointmentTime(appointment.appointmentTime),
      status: "Scheduled"
    };
  }

  if (mode === "complete") {
    schedulingV2InlineDefaults = { ...appointment };
  }

  activeSchedulingV2Panel = "inline";
  renderSchedulingV2Preview();
}

function startSchedulingV2AppointmentFromProfile(defaults = {}) {
  const appointmentDate = defaults.appointmentDate || visibleSchedulingPreviewDate || todayDateString();

  closeClientModal();
  closeReferralModal();
  closeAppointmentModal();
  activeSchedulingPreviewView = "day";
  visibleSchedulingPreviewDate = appointmentDate;
  selectedSchedulingPreviewAppointmentId = null;
  activeSchedulingV2Panel = "appointment";
  activeSchedulingV2DetailTab = "appt-note";
  schedulingV2AgendaScrollTop = 0;
  setActiveModule("scheduling");
  startSchedulingV2InlineForm("new", {
    appointmentType: "Nutrition Education",
    status: "Scheduled",
    ...defaults,
    appointmentDate
  });
}

function cancelSchedulingV2InlineForm() {
  clearSchedulingV2InlineState();
  activeSchedulingV2Panel = "appointment";
  renderSchedulingV2Preview();
}

function schedulingV2ClientRowsFromIds(clientIds) {
  return clientIds
    .map((clientId) => loadedClients.find((client) => client.id === clientId))
    .filter(Boolean);
}

function schedulingV2InlineAppointmentPayload(form) {
  const formData = new FormData(form);
  const source = schedulingV2InlineSourceAppointment();
  const mode = form.dataset.mode || schedulingV2InlineMode || "new";
  const isBlock = mode === "block" || appointmentDisplayStatus(source || schedulingV2InlineDefaults) === "Blocked";
  const selectedClientId = String(formData.get("clientId") || "").trim();
  const clientSearchName = String(formData.get("clientSearch") || "").trim();
  const matchedClient = clientSearchName
    ? loadedClients.find((client) => normalizedLookupKey(clientName(client)) === normalizedLookupKey(clientSearchName))
    : null;
  const preservedClientIds = String(formData.get("clientIds") || "")
    .split(",")
    .map((clientId) => clientId.trim())
    .filter(Boolean);
  const clientIds = isBlock ? [] : [...new Set([
    ...preservedClientIds,
    ...(selectedClientId ? [selectedClientId] : []),
    ...(matchedClient ? [matchedClient.id] : [])
  ])];
  const selectedClients = schedulingV2ClientRowsFromIds(clientIds);
  const selectedClientNames = selectedClients.map(clientName);
  const selectedNameKeys = new Set(selectedClientNames.map((name) => normalizedLookupKey(name)));
  const preservedClientNames = schedulingV2InlineClientNamesFromForm(form)
    .filter((name) => !selectedNameKeys.has(normalizedLookupKey(name)));
  const typedClientName = !matchedClient && clientSearchName ? clientSearchName : "";
  const clientNames = isBlock ? [] : uniqueSchedulingV2ClientNames([
    ...selectedClientNames,
    ...preservedClientNames,
    typedClientName
  ]);
  const appointmentType = isBlock ? "Administrative" : String(formData.get("appointmentType") || "Enrollment");
  const notes = stripSetmoreBookingIdFromNotes(formData.get("notes") || "");
  const appointment = {
    ...(source || {}),
    clientIds,
    clientId: clientIds[0] || "",
    clientNames,
    clientName: clientNames[0] || source?.clientName || "",
    appointmentDate: String(formData.get("appointmentDate") || visibleSchedulingPreviewDate),
    appointmentTime: normalizeAppointmentTime(formData.get("appointmentTime")),
	    appointmentType,
	    status: isBlock ? "Blocked" : String(formData.get("status") || "Scheduled"),
	    lesson: appointmentType === "Nutrition Education" ? String(formData.get("lesson") || "") : "",
	    goal: appointmentType === "Nutrition Education" ? String(formData.get("goal") || "").trim() : "",
	    staffMember: normalizeSchedulingStaffSelection(formData.get("staffMember")),
	    notes
	  };

  if (isBlock) {
    appointment.clientIds = [];
    appointment.clientId = "";
    appointment.clientNames = ["Blocked Time"];
    appointment.clientName = "Blocked Time";
    appointment.status = "Blocked";
    appointment.notes = appointment.notes || "Blocked time";
  }

  if (appointment.appointmentType === "Nutrition Education") {
    const inferred = inferAppointmentFieldsFromNotes(appointment.notes, appointment.appointmentType);
    appointment.lesson = appointment.lesson || inferred.lesson;
    appointment.goal = appointment.goal || inferred.goal;
  }

  return appointment;
}

function schedulingV2InlineClientIdsFromForm(form) {
  return String(new FormData(form).get("clientIds") || "")
    .split(",")
    .map((clientId) => clientId.trim())
    .filter(Boolean);
}

function schedulingV2InlineClientNamesFromForm(form) {
  const value = String(new FormData(form).get("clientNames") || "").trim();

  if (!value) {
    return [];
  }

  try {
    return uniqueSchedulingV2ClientNames(JSON.parse(value));
  } catch (error) {
    return uniqueSchedulingV2ClientNames(value.split(","));
  }
}

function setSchedulingV2InlineClientIds(form, clientIds) {
  const hidden = form.querySelector('input[name="clientIds"]');
  if (hidden) {
    hidden.value = [...new Set(clientIds.filter(Boolean))].join(",");
  }
}

function setSchedulingV2InlineClientNames(form, clientNames) {
  const hidden = form.querySelector('input[name="clientNames"]');
  if (hidden) {
    hidden.value = JSON.stringify(uniqueSchedulingV2ClientNames(clientNames));
  }
}

function addSchedulingV2InlineClient(form) {
  const input = form.querySelector('input[name="clientSearch"]');
  const clientSearchName = String(input?.value || "").trim();
  const matchedClient = clientSearchName
    ? loadedClients.find((client) => normalizedLookupKey(clientName(client)) === normalizedLookupKey(clientSearchName))
    : null;

  if (!matchedClient) {
    appointmentsStatusEl.textContent = "Choose a client from the list.";
    input?.focus();
    return false;
  }

  const clientIds = schedulingV2InlineClientIdsFromForm(form);
  const clientNames = schedulingV2InlineClientNamesFromForm(form)
    .filter((name) => normalizedLookupKey(name) !== normalizedLookupKey(clientName(matchedClient)));
  setSchedulingV2InlineClientIds(form, [...clientIds, matchedClient.id]);
  setSchedulingV2InlineClientNames(form, [...clientNames, clientName(matchedClient)]);
  if (input) {
    input.value = "";
  }
  syncSchedulingV2InlineDraftFromForm(form, { rerender: true });
  return true;
}

function removeSchedulingV2InlineClient(form, clientId) {
  const clientIds = schedulingV2InlineClientIdsFromForm(form).filter((id) => id !== clientId);
  setSchedulingV2InlineClientIds(form, clientIds);
  syncSchedulingV2InlineDraftFromForm(form, { rerender: true });
}

function removeSchedulingV2InlineClientName(form, clientNameValue) {
  const removeKey = normalizedLookupKey(clientNameValue);
  const clientNames = schedulingV2InlineClientNamesFromForm(form)
    .filter((name) => normalizedLookupKey(name) !== removeKey);
  setSchedulingV2InlineClientNames(form, clientNames);
  syncSchedulingV2InlineDraftFromForm(form, { rerender: true });
}

function syncSchedulingV2InlineDraftFromForm(form, options = {}) {
  if (!form) {
    return;
  }

  schedulingV2InlineDefaults = schedulingV2InlineAppointmentPayload(form);

  if (options.rerender) {
    renderSchedulingV2Preview();
  }
}

function schedulingV2ValidateInlineAppointment(appointment, excludedAppointmentId = "") {
  if (appointment.status !== "Blocked" && !appointmentClientNames(appointment).length) {
    appointmentsStatusEl.textContent = "Choose a client or type a referral name before saving.";
    return false;
  }

  if (!appointment.appointmentDate || !appointment.appointmentTime) {
    appointmentsStatusEl.textContent = "Choose a date and time before saving.";
    return false;
  }

  if (!appointmentFitsSchedulingWindow(appointment)) {
    appointmentsStatusEl.textContent = schedulingWindowError(appointment);
    return false;
  }

  const conflict = appointmentSchedulingConflict(appointment, excludedAppointmentId);

  if (conflict) {
    appointmentsStatusEl.textContent = appointmentConflictError(conflict);
    return false;
  }

  return true;
}

function schedulingV2PayloadForCreate(appointment) {
  const { id, createdAt, updatedAt, ...payload } = appointment;
  return payload;
}

async function saveSchedulingV2InlineReschedule(source, replacementAppointment) {
  rememberSchedulingV2AgendaScroll();
  const normalizedOriginalTime = normalizeAppointmentTime(source.appointmentTime);

  if (source.appointmentDate === replacementAppointment.appointmentDate && normalizedOriginalTime === replacementAppointment.appointmentTime) {
    appointmentsStatusEl.textContent = "Choose a new date or time for the rescheduled appointment.";
    return;
  }

  if (!schedulingV2ValidateInlineAppointment(replacementAppointment, source.id)) {
    return;
  }

  appointmentsStatusEl.textContent = "Rescheduling appointment...";
  let originalAppointmentRetired = false;
  let replacementAppointmentCreated = false;

  try {
    const updateResponse = await authedFetch(`/api/appointments/${encodeURIComponent(source.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...source, status: "Rescheduled" })
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Original appointment returned ${updateResponse.status}`);
    }

    originalAppointmentRetired = true;

    const createResponse = await authedFetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(schedulingV2PayloadForCreate(replacementAppointment))
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Rescheduled appointment returned ${createResponse.status}`);
    }

    replacementAppointmentCreated = true;
    const createData = await createResponse.json().catch(() => ({}));
    const savedReplacement = createData.appointment || replacementAppointment;
    await applyAppointmentClientEffects(savedReplacement, "Scheduled");
    clearSchedulingV2InlineState();
    activeSchedulingV2Panel = "appointment";
    selectedAppointmentId = savedReplacement.id || "";
    selectedSchedulingPreviewAppointmentId = savedReplacement.id || "";
    visibleSchedulingPreviewDate = savedReplacement.appointmentDate || visibleSchedulingPreviewDate;
    activeSchedulingV2DetailTab = "appt-note";
    await loadClients();
    await loadAppointments();
    await loadTasks();
    appointmentsStatusEl.textContent = Number(createData.completedRescheduleTasks || 0)
      ? "Appointment rescheduled and reschedule task completed."
      : "Appointment rescheduled.";
  } catch (error) {
    if (originalAppointmentRetired && !replacementAppointmentCreated) {
      await authedFetch(`/api/appointments/${encodeURIComponent(source.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(source)
      }).catch((restoreError) => {
        console.error("Could not restore original appointment after reschedule failure.", restoreError);
      });
    }
    appointmentsStatusEl.textContent = error.message || "Could not reschedule appointment yet.";
    console.error(error);
  }
}

async function saveSchedulingV2InlineForm(event) {
  event.preventDefault();
  rememberSchedulingV2AgendaScroll();

  if (!currentUser) {
    appointmentsStatusEl.textContent = "Sign in before saving an appointment.";
    return;
  }

  const form = event.currentTarget;
  const mode = form.dataset.mode || schedulingV2InlineMode || "new";
  const source = schedulingV2InlineSourceAppointment();
  const appointment = schedulingV2InlineAppointmentPayload(form);
  const isEditing = Boolean(source?.id && (mode === "edit" || mode === "block"));

  if (mode === "reschedule") {
    if (!source?.id) {
      appointmentsStatusEl.textContent = "Choose an appointment before rescheduling.";
      return;
    }
    await saveSchedulingV2InlineReschedule(source, appointment);
    return;
  }

  if (!schedulingV2ValidateInlineAppointment(appointment, isEditing ? source.id : "")) {
    return;
  }

  appointmentsStatusEl.textContent = isEditing ? "Updating appointment..." : "Saving appointment...";

  try {
    const response = await authedFetch(isEditing ? `/api/appointments/${encodeURIComponent(source.id)}` : "/api/appointments", {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(isEditing ? appointment : schedulingV2PayloadForCreate(appointment))
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    const savedAppointment = data.appointment || { ...appointment, id: source?.id || "" };
    await applyAppointmentClientEffects(savedAppointment, savedAppointment.status || appointment.status);
    clearSchedulingV2InlineState();
    activeSchedulingV2Panel = "appointment";
    selectedAppointmentId = savedAppointment.id || source?.id || "";
    selectedSchedulingPreviewAppointmentId = savedAppointment.id || source?.id || "";
    visibleSchedulingPreviewDate = savedAppointment.appointmentDate || visibleSchedulingPreviewDate;
    activeSchedulingV2DetailTab = "appt-note";
    await loadClients();
    await loadAppointments();
    await loadTasks();
    appointmentsStatusEl.textContent = Number(data.completedRescheduleTasks || 0)
      ? `${isEditing ? "Appointment updated" : "Appointment saved"}; reschedule task completed.`
      : isEditing ? "Appointment updated." : "Appointment saved.";
  } catch (error) {
    appointmentsStatusEl.textContent = error.message || "Could not save appointment yet.";
    console.error(error);
  }
}

function renderSchedulingV2InlineCompletionForm() {
  const appointment = schedulingV2InlineSourceAppointment() || schedulingV2InlineDefaultAppointment();
  const nextLesson = nextLessonNumberForAppointment(appointment);
  const nextLessonLabel = nextLesson ? appointmentLessonTitle(nextLesson) || `Lesson ${nextLesson}` : "";
  const selectedTime = normalizeAppointmentTime(appointment.appointmentTime || "");
  const timeOptions = appointmentValidTimeValues(selectedTime, {
    clientIds: appointmentClientIds(appointment),
    appointmentDate: defaultNextAppointmentDate(appointment),
    appointmentType: "Nutrition Education",
    lesson: nextLesson ? String(nextLesson) : "",
    status: "Scheduled"
  });
  const checkIn = appointmentCheckInFields(appointment);

  return `
    <section class="scheduling-v2-detail-card scheduling-v2-inline-card" aria-label="Complete appointment">
      <div class="scheduling-v2-detail-left">
        <div class="scheduling-v2-selected-status">
          <span class="scheduling-v2-status-dot" aria-hidden="true"></span>
          <span>Complete</span>
        </div>
        <h3>${escapeHtml(`Complete ${schedulingV2AgendaCardName([appointment])}`)}</h3>
        <div class="scheduling-v2-detail-meta">
	          ${schedulingV2InfoRow(`${schedulingV2Icon("calendar")}Date`, formatFullDate(appointment.appointmentDate))}
	          ${schedulingV2InfoRow(`${schedulingV2Icon("clock")}Time`, `${formatAppointmentTime(appointment.appointmentTime) || "Time TBD"} - ${formatDuration(appointmentDurationMinutes(appointment))}`)}
	          ${schedulingV2InfoRow(`${schedulingV2Icon("file")}Type`, appointmentTypeLabel(appointment))}
        </div>
      </div>
      <div class="scheduling-v2-detail-main">
        <form class="scheduling-v2-inline-form" data-scheduling-v2-complete-form>
          <div class="scheduling-v2-inline-form-header">
            <h4>Wrap Up</h4>
            <button data-scheduling-action="cancel-inline" type="button">Cancel</button>
          </div>
          <section class="scheduling-v2-inline-section">
            <h5>Next Appointment</h5>
            ${nextLesson ? `
              <label class="scheduling-v2-inline-check">
                <input name="scheduleNext" type="checkbox" checked>
                <span>Schedule ${escapeHtml(nextLessonLabel)} next</span>
              </label>
              <div class="scheduling-v2-inline-grid">
                <label class="scheduling-v2-inline-field">
                  <span>Date</span>
                  <input name="nextDate" type="date" value="${escapeHtml(defaultNextAppointmentDate(appointment))}">
                </label>
                <label class="scheduling-v2-inline-field">
                  <span>Time</span>
                  <select name="nextTime">
                    <option value="">Choose time</option>
                    ${timeOptions.map((time) => `<option value="${escapeHtml(time)}" ${time === selectedTime ? "selected" : ""}>${escapeHtml(formatAppointmentTime(time))}</option>`).join("")}
                  </select>
                </label>
	                <label class="scheduling-v2-inline-field">
	                  <span>Staff</span>
	                  <select name="nextStaff" data-scheduling-staff-select>${schedulingV2StaffOptions(appointment.staffMember || "")}</select>
	                </label>
                <label class="scheduling-v2-inline-field">
                  <span>Goal</span>
                  <input name="nextGoal" value="">
                </label>
                <label class="scheduling-v2-inline-field scheduling-v2-inline-wide">
                  <span>Notes</span>
                  <textarea name="nextNotes"></textarea>
                </label>
              </div>
            ` : `<p class="scheduling-v2-inline-note">No next lesson is due. Completing this appointment will leave the client active.</p>`}
          </section>
          <section class="scheduling-v2-inline-section">
            <h5>Appointment Note</h5>
            <textarea name="completedNotes" placeholder="Add the appointment note here.">${escapeHtml(appointment.notes || "")}</textarea>
          </section>
          <section class="scheduling-v2-inline-section">
            <h5>Engagement</h5>
            <div class="scheduling-v2-check-grid">
              ${schedulingV2CheckControl("caregiverMood", "Caregiver Mood", checkIn.caregiverMood)}
              ${schedulingV2CheckControl("confidence", "Confidence", checkIn.confidence)}
              ${schedulingV2CheckControl("participation", "Participation", checkIn.participation)}
              ${schedulingV2CheckControl("barriers", "Barriers", checkIn.barriers)}
            </div>
          </section>
          <div class="scheduling-v2-inline-actions">
            <button type="submit">Complete Appointment</button>
          </div>
        </form>
      </div>
    </section>
  `;
}

async function saveSchedulingV2InlineCompletion(event) {
  event.preventDefault();
  rememberSchedulingV2AgendaScroll();

  if (!currentUser) {
    appointmentsStatusEl.textContent = "Sign in before completing an appointment.";
    return;
  }

  const appointment = schedulingV2InlineSourceAppointment() ||
    loadedAppointments.find((item) => item.id === selectedAppointmentId) ||
    loadedAppointments.find((item) => item.id === selectedSchedulingPreviewAppointmentId);
  if (!appointment?.id) {
    appointmentsStatusEl.textContent = "Choose an appointment before completing it.";
    return;
  }

  const form = event.currentTarget;
  const formData = new FormData(form);
  const nextLesson = nextLessonNumberForAppointment(appointment);
  const shouldScheduleNext = Boolean(nextLesson && formData.get("scheduleNext"));
  const checkIn = {
    caregiverMood: String(formData.get("caregiverMood") || appointmentCheckInDefaults.caregiverMood),
    confidence: String(formData.get("confidence") || appointmentCheckInDefaults.confidence),
    participation: String(formData.get("participation") || appointmentCheckInDefaults.participation),
    barriers: String(formData.get("barriers") || appointmentCheckInDefaults.barriers)
  };
  let nextAppointment = null;

  if (shouldScheduleNext) {
    const nextClients = schedulingV2ClientRowsFromIds(appointmentClientIds(appointment));
    nextAppointment = {
      clientIds: appointmentClientIds(appointment),
      clientId: appointmentClientIds(appointment)[0] || "",
      clientNames: nextClients.map(clientName),
      clientName: nextClients[0] ? clientName(nextClients[0]) : appointment.clientName || "",
      appointmentDate: String(formData.get("nextDate") || ""),
      appointmentTime: normalizeAppointmentTime(formData.get("nextTime")),
      appointmentType: "Nutrition Education",
      status: "Scheduled",
      lesson: String(nextLesson),
      goal: String(formData.get("nextGoal") || "").trim(),
	      staffMember: normalizeSchedulingStaffSelection(formData.get("nextStaff")),
      notes: stripSetmoreBookingIdFromNotes(formData.get("nextNotes") || "")
    };

    if (!schedulingV2ValidateInlineAppointment(nextAppointment, appointment.id)) {
      return;
    }
  }

  appointmentsStatusEl.textContent = shouldScheduleNext ? "Completing appointment and scheduling next visit..." : "Completing appointment...";

  try {
    const completedAppointment = {
      ...appointment,
      ...checkIn,
      notes: stripSetmoreBookingIdFromNotes(formData.get("completedNotes") || appointment.notes || ""),
      status: "Completed"
    };
    const response = await authedFetch(`/api/appointments/${encodeURIComponent(appointment.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(completedAppointment)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    let savedNextAppointment = null;
    let completedRescheduleTasks = 0;

    if (shouldScheduleNext) {
      const createResponse = await authedFetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nextAppointment)
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Next appointment returned ${createResponse.status}`);
      }

      const nextData = await createResponse.json().catch(() => ({}));
      savedNextAppointment = nextData.appointment || nextAppointment;
      completedRescheduleTasks += Number(nextData.completedRescheduleTasks || 0);
    }

    await applyAppointmentClientEffects(completedAppointment, "Completed", {
      nextAppointmentScheduled: shouldScheduleNext || !nextLesson
    });
    clearSchedulingV2InlineState();
    activeSchedulingV2Panel = "appointment";
    selectedAppointmentId = savedNextAppointment?.id || appointment.id;
    selectedSchedulingPreviewAppointmentId = savedNextAppointment?.id || appointment.id;
    visibleSchedulingPreviewDate = savedNextAppointment?.appointmentDate || visibleSchedulingPreviewDate;
    activeSchedulingV2DetailTab = "appt-note";
    await loadClients();
    await loadAppointments();
    await loadTasks();
    appointmentsStatusEl.textContent = completedRescheduleTasks
      ? "Appointment completed, next visit scheduled, and reschedule task completed."
    : shouldScheduleNext ? "Appointment completed and next visit scheduled." : "Appointment completed; client marked Reschedule.";
  } catch (error) {
    appointmentsStatusEl.textContent = error.message || "Could not complete appointment yet.";
    console.error(error);
  }
}

function schedulingV2UnscheduledClients() {
  const reviewStatuses = ["Active", "Needs Reschedule", "Waiting on Family", "Needs Language Support"];
  return loadedClients
    .filter((client) => reviewStatuses.includes(client.status || "Scheduled") && !hasFutureAppointment(client))
    .sort(
      (first, second) =>
        clientStatusSortIndex(first) - clientStatusSortIndex(second) ||
        clientName(first).localeCompare(clientName(second))
    );
}

function renderSchedulingV2UnscheduledPanel() {
  const clients = schedulingV2UnscheduledClients();

  return `
    <section class="scheduling-v2-detail-card scheduling-v2-unscheduled-panel" aria-label="Unscheduled clients">
      <button class="scheduling-v2-detail-close" data-scheduling-action="close-detail" type="button" aria-label="Close unscheduled clients">${schedulingV2Icon("close")}</button>
      <div class="scheduling-v2-unscheduled-header">
        <p>Needs Scheduling</p>
        <h3>Unscheduled Clients</h3>
        <span>${escapeHtml(String(clients.length))} clients without a future appointment</span>
      </div>
      ${clients.length ? `
        <div class="scheduling-v2-unscheduled-list">
          ${clients.map((client) => `
            <article class="scheduling-v2-unscheduled-row" draggable="true" data-scheduling-unscheduled-drag="${escapeHtml(client.id)}">
              <div>
                <strong>${escapeHtml(clientName(client))}</strong>
                <span>${escapeHtml([schedulingV2DisplayStatus(client.status || "Scheduled"), client.parentName, formatPhone(client.phone), client.language].filter(Boolean).join(" | "))}</span>
              </div>
              <button data-scheduling-unscheduled-client="${escapeHtml(client.id)}" type="button">Schedule</button>
            </article>
          `).join("")}
        </div>
      ` : `
        <p class="scheduling-v2-unscheduled-empty">Everyone in the active clinic workflow has a future appointment.</p>
      `}
    </section>
  `;
}

function renderSchedulingV2DetailTabs(detailTabs) {
  const activeKey = detailTabs.some(([key]) => key === activeSchedulingV2DetailTab)
    ? activeSchedulingV2DetailTab
    : detailTabs[0]?.[0] || "appt-note";

  activeSchedulingV2DetailTab = activeKey;

  return `
    <div class="scheduling-v2-detail-tabs" role="tablist" aria-label="Appointment preview tabs">
      ${detailTabs.map(([key, tab, icon]) => `
        <button class="${key === activeKey ? "active" : ""}" data-scheduling-detail-tab="${escapeHtml(key)}" type="button" role="tab" aria-selected="${key === activeKey ? "true" : "false"}">${schedulingV2Icon(icon)}${escapeHtml(tab)}</button>
      `).join("")}
    </div>
  `;
}

function renderSchedulingV2AppointmentCard(appointment, lessonRows, title) {
  const isEditingDetail = schedulingV2InlineMode === "edit" && schedulingV2InlineAppointmentId === appointment.id;
  const appointmentType = appointmentTypeLabel(appointment);
  const carriesGoal = appointmentCarriesGoal(appointment);

  if (isEditingDetail) {
    return `
      <section class="scheduling-v2-visit-card scheduling-v2-details-card">
        <form class="scheduling-v2-inline-form scheduling-v2-detail-edit-form" data-scheduling-v2-inline-form data-mode="edit" data-appointment-id="${escapeHtml(appointment.id || "")}">
          <div class="scheduling-v2-inline-form-header">
            <h4>${escapeHtml(title)}</h4>
            <button data-scheduling-action="cancel-inline" type="button">Cancel</button>
          </div>
          <input type="hidden" name="clientIds" value="${escapeHtml(appointmentClientIds(appointment).join(","))}">
          <input type="hidden" name="clientNames" value="${schedulingV2InlineClientNamesValue(appointmentClientNames(appointment))}">
          <input type="hidden" name="status" value="${escapeHtml(appointment.status || "Scheduled")}">
          <input type="hidden" name="appointmentDate" value="${escapeHtml(appointment.appointmentDate || visibleSchedulingPreviewDate)}">
          <input type="hidden" name="appointmentTime" value="${escapeHtml(normalizeAppointmentTime(appointment.appointmentTime || ""))}">
          <div class="scheduling-v2-inline-grid">
            <label class="scheduling-v2-inline-field">
              <span>Type</span>
              <select name="appointmentType">
                ${schedulingV2OptionList(["Enrollment", "Nutrition Education"], appointmentType)}
              </select>
            </label>
	            <label class="scheduling-v2-inline-field">
	              <span>Staff</span>
	              <select name="staffMember" data-scheduling-staff-select>${schedulingV2StaffOptions(appointment.staffMember || "")}</select>
	            </label>
            ${carriesGoal ? `
              <label class="scheduling-v2-inline-field">
                <span>Lesson</span>
                <select name="lesson">${schedulingV2LessonOptions(appointment.lesson || "")}</select>
              </label>
              <label class="scheduling-v2-inline-field">
                <span>Goal</span>
                <input name="goal" value="${escapeHtml(appointment.goal || "")}">
              </label>
            ` : `
              <input type="hidden" name="lesson" value="">
              <input type="hidden" name="goal" value="">
            `}
            <label class="scheduling-v2-inline-field scheduling-v2-inline-wide">
              <span>Notes</span>
              <textarea name="notes">${escapeHtml(appointment.notes || "")}</textarea>
            </label>
          </div>
          <div class="scheduling-v2-inline-actions">
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </section>
    `;
  }

  return `
    <section class="scheduling-v2-visit-card scheduling-v2-details-card">
      <div>
        <h4>${escapeHtml(title)}</h4>
        <button data-scheduling-action="edit" type="button">Edit</button>
      </div>
      <dl>
        ${lessonRows.map(([label, value]) => {
          const detailClass = normalizedLookupKey(label).replace(/[^a-z0-9-]/g, "");
          const wideClass = ["Goal", "Notes"].includes(label) ? "scheduling-v2-detail-row-wide" : "";
          return `<div class="${wideClass} scheduling-v2-detail-row-${escapeHtml(detailClass)}"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`;
        }).join("")}
      </dl>
    </section>
  `;
}

function renderSchedulingV2PrepCard(prepItems) {
  return `
    <section class="scheduling-v2-visit-card scheduling-v2-prep-card">
      <div>
        <h4>Prep</h4>
        <button data-scheduling-action="print-prep" type="button">Print</button>
      </div>
      ${prepItems.length ? `
        <ul>
          ${prepItems.slice(0, 6).map((item) => `
            <li>
              <label>
                <input type="checkbox">
                <span>${escapeHtml(item)}</span>
              </label>
            </li>
          `).join("")}
        </ul>
      ` : "<p>No prep items for this appointment.</p>"}
    </section>
  `;
}

function renderSchedulingV2WrapUpTab(appointment) {
  const nextLesson = nextLessonNumberForAppointment(appointment);
  const nextLessonLabel = nextLesson ? appointmentLessonTitle(nextLesson) || `Lesson ${nextLesson}` : "";
  const selectedTime = normalizeAppointmentTime(appointment.appointmentTime || "");
  const timeOptions = appointmentValidTimeValues(selectedTime, {
    clientIds: appointmentClientIds(appointment),
    appointmentDate: defaultNextAppointmentDate(appointment),
    appointmentType: "Nutrition Education",
    lesson: nextLesson ? String(nextLesson) : "",
    status: "Scheduled"
  });
  const checkIn = appointmentCheckInFields(appointment);

  return `
    <form class="scheduling-v2-inline-form scheduling-v2-wrap-up-form" data-scheduling-v2-complete-form>
      <section class="scheduling-v2-inline-section">
        <h5>Next Appointment</h5>
        ${nextLesson ? `
          <label class="scheduling-v2-inline-check">
            <input name="scheduleNext" type="checkbox" checked>
            <span>Schedule ${escapeHtml(nextLessonLabel)} next</span>
          </label>
          <div class="scheduling-v2-inline-grid">
            <label class="scheduling-v2-inline-field">
              <span>Date</span>
              <input name="nextDate" type="date" value="${escapeHtml(defaultNextAppointmentDate(appointment))}">
            </label>
            <label class="scheduling-v2-inline-field">
              <span>Time</span>
              <select name="nextTime">
                <option value="">Choose time</option>
                ${timeOptions.map((time) => `<option value="${escapeHtml(time)}" ${time === selectedTime ? "selected" : ""}>${escapeHtml(formatAppointmentTime(time))}</option>`).join("")}
              </select>
            </label>
	            <label class="scheduling-v2-inline-field">
	              <span>Staff</span>
	              <select name="nextStaff" data-scheduling-staff-select>${schedulingV2StaffOptions(appointment.staffMember || "")}</select>
	            </label>
            <label class="scheduling-v2-inline-field">
              <span>Goal</span>
              <input name="nextGoal" value="">
            </label>
            <label class="scheduling-v2-inline-field scheduling-v2-inline-wide">
              <span>Notes</span>
              <textarea name="nextNotes"></textarea>
            </label>
          </div>
        ` : `<p class="scheduling-v2-inline-note">No next lesson is due. Completing this appointment will leave the client active.</p>`}
      </section>
      <section class="scheduling-v2-inline-section">
        <h5>Appointment Note</h5>
        <textarea name="completedNotes" placeholder="Add the appointment note here.">${escapeHtml(appointment.notes || "")}</textarea>
      </section>
      <section class="scheduling-v2-inline-section">
        <h5>Engagement</h5>
        <div class="scheduling-v2-check-grid">
          ${schedulingV2CheckControl("caregiverMood", "Caregiver Mood", checkIn.caregiverMood)}
          ${schedulingV2CheckControl("confidence", "Confidence", checkIn.confidence)}
          ${schedulingV2CheckControl("participation", "Participation", checkIn.participation)}
          ${schedulingV2CheckControl("barriers", "Barriers", checkIn.barriers)}
        </div>
      </section>
      <div class="scheduling-v2-inline-actions">
        <button type="submit">Complete Appointment</button>
      </div>
    </form>
  `;
}

function schedulingV2AppointmentActivityItems(appointment) {
  const clientIds = appointmentClientIds(appointment);
  const appointmentLogItems = loadedActivityLogs
    .filter((log) => log.relatedType === "client" && clientIds.includes(log.relatedId))
    .map((log) => ({
      title: log.title || `${log.direction || "Outbound"} ${log.type || "Activity"}`,
      detail: [log.result, log.description].filter(Boolean).join(" | ") || displayValue(log.type),
      date: log.activityDate || String(log.occurredAt || "").slice(0, 10),
      sortKey: activityLogTimestamp(log)
    }));
  const generatedItems = [
    {
      title: schedulingV2DisplayStatus(appointmentDisplayStatus(appointment)),
      detail: [appointmentLessonTopicTitle(appointment) || appointmentTypeLabel(appointment), appointment.staffMember].filter(Boolean).join(" | ") || "Appointment",
      date: appointment.appointmentDate,
      sortKey: `${appointment.appointmentDate || ""}T${normalizeAppointmentTime(appointment.appointmentTime) || "00:00"}`
    },
    appointment.createdAt ? {
      title: "Appointment created",
      detail: formatAppointmentTime(appointment.appointmentTime) || "Time TBD",
      date: String(appointment.createdAt).slice(0, 10),
      sortKey: appointment.createdAt
    } : null,
    appointment.updatedAt ? {
      title: "Last updated",
      detail: appointmentDisplayStatus(appointment),
      date: String(appointment.updatedAt).slice(0, 10),
      sortKey: appointment.updatedAt
    } : null
  ].filter(Boolean);

  return [...appointmentLogItems, ...generatedItems]
    .sort((first, second) => String(second.sortKey || "").localeCompare(String(first.sortKey || "")))
    .slice(0, 8);
}

function renderSchedulingV2ActivityTab(appointment) {
  const items = schedulingV2AppointmentActivityItems(appointment);

  return `
    <section class="scheduling-v2-visit-card scheduling-v2-activity-card">
      <div>
        <h4>Activity</h4>
      </div>
      ${items.length ? `
        <ol>
          ${items.map((item) => `
            <li>
              <span>${escapeHtml(formatDateOnly(item.date))}</span>
              <strong>${escapeHtml(item.title)}</strong>
              <p>${escapeHtml(item.detail || "-")}</p>
            </li>
          `).join("")}
        </ol>
      ` : "<p>No activity has been logged for this appointment yet.</p>"}
    </section>
  `;
}

const printFormPackets = Object.freeze({
  enrollment: {
    name: "Enrollment packet",
    description: "Forms 1, 2, and 3.",
    files: [
      { label: "Program Enrollment", fileName: "1. Program Enrollment - Print.docx" },
      { label: "Questionnaire", fileName: "2. Questionnaire - Print.xlsx" },
      { label: "HRSN Screener", fileName: "3. HRSN Screener.docx" }
    ]
  },
  enrollmentSpanish: {
    name: "Enrollment packet",
    description: "Spanish forms 1, 2, and 3.",
    files: [
      { label: "SP Program Enrollment", fileName: "1. SP Program Enrollment - Print.docx" },
      { label: "SP Questionnaire", fileName: "2. SP Questionnaire - Print.xlsx" },
      { label: "SP HRSN Screener", fileName: "3. HRSN Screener- Spanish.docx" }
    ]
  },
  graduation: {
    name: "Graduation packet",
    description: "Forms 2, 4, and 5.",
    files: [
      { label: "Questionnaire", fileName: "2. Questionnaire - Print.xlsx" },
      { label: "Child Feedback", fileName: "4. Child Feedback Form - Print.docx" },
      { label: "Parent Feedback", fileName: "5. Parent Feedback Form - Print.docx" }
    ]
  },
  graduationSpanish: {
    name: "Graduation packet",
    description: "Spanish forms 2, 4, and 5.",
    files: [
      { label: "SP Questionnaire", fileName: "2. SP Questionnaire - Print.xlsx" },
      { label: "SP Child Feedback", fileName: "4. SP Child Feedback Form - Print.docx" },
      { label: "SP Parent Feedback", fileName: "5. SP Parent Feedback Form - Print.docx" }
    ]
  }
});

const profileV2ClientPrintFormRows = Object.freeze([
  {
    name: "Enrollment packet",
    description: "Forms 1, 2, and 3. Use Spanish versions for Spanish-language appointments.",
    files: [...printFormPackets.enrollment.files, ...printFormPackets.enrollmentSpanish.files]
  },
  {
    name: "Graduation packet",
    description: "Forms 2, 4, and 5. Use Spanish versions for Spanish-language appointments.",
    files: [...printFormPackets.graduation.files, ...printFormPackets.graduationSpanish.files]
  }
]);

function appointmentUsesSpanishForms(appointment) {
  const clients = appointmentClientRecords(appointment);
  const values = [
    appointment.publicBookingServiceId,
    appointment.publicBookingServiceLabel,
    ...clients.map((client) => client.preferredLanguage)
  ].map(normalizedLookupKey);

  return values.some((value) => value.includes("spanish") || value.includes("espanol"));
}

function schedulingV2AppointmentPrintFormPacket(appointment) {
  const useSpanish = appointmentUsesSpanishForms(appointment);

  if (appointmentTypeLabel(appointment) === "Enrollment") {
    return useSpanish ? printFormPackets.enrollmentSpanish : printFormPackets.enrollment;
  }

  if (appointmentLessonNumber(appointment) === 7 || normalizedLookupKey(appointmentLessonTopicTitle(appointment)).includes("healthy habits")) {
    return useSpanish ? printFormPackets.graduationSpanish : printFormPackets.graduation;
  }

  return null;
}

function renderPrintFormLinksHtml(files, className) {
  const classAttribute = className ? ` class="${escapeHtml(className)}"` : "";

  return `<div${classAttribute}>${files.map((file) => `
    <a href="${escapeHtml(profileV2PrintFormHref(file.fileName))}" download="${escapeHtml(file.fileName)}">${escapeHtml(file.label)}</a>
  `).join("")}</div>`;
}

function schedulingV2AppointmentFormItems(appointment) {
  const clients = appointmentClientRecords(appointment);
  const isEnrollment = appointmentTypeLabel(appointment) === "Enrollment";
  const hasYccoClient = clients.some((client) => truthyProfileValue(client.ycco));
  const forms = isEnrollment
    ? [
      "Enrollment form",
      "Questionnaire for each child",
      ...(hasYccoClient ? ["HRSN screener"] : []),
      "SNACK sticker"
    ]
    : [
      `${appointmentLessonTopicTitle(appointment) || "Nutrition education"} note sheet`,
      "Lesson handouts",
      "Goal tracker"
    ];

  return forms;
}

function renderSchedulingV2FormsTab(appointment) {
  const forms = schedulingV2AppointmentFormItems(appointment);
  const packet = schedulingV2AppointmentPrintFormPacket(appointment);

  return `
    <section class="scheduling-v2-visit-card scheduling-v2-forms-card">
      <div>
        <h4>Forms</h4>
      </div>
      <div class="scheduling-v2-form-actions">
        <button data-scheduling-action="print-current-note" type="button">${schedulingV2Icon("print")}Print Appt Note</button>
        <button data-scheduling-action="print-current-prep" type="button">${schedulingV2Icon("print")}Print Prep</button>
        <button data-scheduling-action="print-schedule" type="button">${schedulingV2Icon("print")}Print Day Schedule</button>
      </div>
      <div class="scheduling-v2-form-list">
        <h5>Likely Needed</h5>
        ${packet ? `
          <p>${escapeHtml(packet.description)}</p>
          ${renderPrintFormLinksHtml(packet.files, "scheduling-v2-form-links")}
        ` : ""}
        ${forms.length ? `
          <ul>
            ${forms.map((formName) => `<li>${escapeHtml(formName)}</li>`).join("")}
          </ul>
        ` : "<p>No forms mapped for this appointment yet.</p>"}
      </div>
    </section>
  `;
}

function renderSchedulingV2PlaceholderTab(title, body) {
  return `
    <section class="scheduling-v2-visit-card scheduling-v2-placeholder-card">
      <div>
        <h4>${escapeHtml(title)}</h4>
      </div>
      <p>${escapeHtml(body)}</p>
    </section>
  `;
}

function renderSchedulingV2Detail(appointment) {
  if (!appointment) {
    return `
      <section class="scheduling-v2-detail-card scheduling-v2-empty-detail" aria-label="Appointment preview">
        <p class="eyebrow">Appointment</p>
        <h3>No appointment selected</h3>
      </section>
    `;
  }

  const clients = appointmentPreviewClientRows(appointment);
  const primaryClient = appointmentPreviewPrimaryClient(appointment);
  const prepItems = appointmentPrepItems(appointment);
  const goalText = appointmentGoalText(appointment);
  const appointmentTimeText = `${formatAppointmentTime(appointment.appointmentTime) || "Time TBD"} - ${formatDuration(appointmentDurationMinutes(appointment))}`;
  const status = appointmentDisplayStatus(appointment);
  const isBlockedTime = status === "Blocked";
  const carriesGoal = appointmentCarriesGoal(appointment);
  const appointmentCardTitle = isBlockedTime ? "Blocked Time" : "Details";
  const detailTabs = isBlockedTime
    ? [["details", "Details", "calendar"], ["activity", "Activity", "history"]]
    : [["appt-note", "Appt Note", "calendar"], ["wrap-up", "Wrap Up", "check"], ["activity", "Activity", "history"], ["forms", "Forms", "file"]];
  const lessonRows = [];

  if (carriesGoal) {
    lessonRows.push(["Lesson", appointmentLessonLabel(appointment) || "-"]);
  }

  lessonRows.push(["Staff", appointment.staffMember || "-"]);

  if (carriesGoal) {
    lessonRows.push(["Goal", goalText || "-"]);
  }

  lessonRows.push(["Notes", appointmentNotesText(appointment) || "-"]);

  const activeTab = detailTabs.some(([key]) => key === activeSchedulingV2DetailTab)
    ? activeSchedulingV2DetailTab
    : detailTabs[0][0];
  activeSchedulingV2DetailTab = activeTab;
  const detailContent = isBlockedTime
    ? activeTab === "activity"
      ? renderSchedulingV2ActivityTab(appointment)
      : renderSchedulingV2AppointmentCard(appointment, lessonRows, appointmentCardTitle)
    : activeTab === "wrap-up"
      ? renderSchedulingV2WrapUpTab(appointment)
      : activeTab === "activity"
        ? renderSchedulingV2ActivityTab(appointment)
        : activeTab === "forms"
          ? renderSchedulingV2FormsTab(appointment)
          : `${renderSchedulingV2AppointmentCard(appointment, lessonRows, appointmentCardTitle)}${renderSchedulingV2PrepCard(prepItems)}`;

  return `
    <section class="scheduling-v2-detail-card ${isBlockedTime ? "scheduling-v2-blocked-detail" : ""}" aria-label="Selected appointment preview">
      <div class="scheduling-v2-detail-left">
        <div class="scheduling-v2-selected-status ${isBlockedTime ? "blocked" : ""}">
          <span class="scheduling-v2-status-dot" aria-hidden="true"></span>
          <span>${escapeHtml(schedulingV2DisplayStatus(status))}</span>
        </div>
        <h3>${escapeHtml(schedulingV2AgendaCardName([appointment]))}</h3>
        <div class="scheduling-v2-detail-meta">
          ${schedulingV2InfoRow(`${schedulingV2Icon("calendar")}Date`, formatFullDate(appointment.appointmentDate))}
          ${schedulingV2InfoRow(`${schedulingV2Icon("clock")}Time`, appointmentTimeText)}
          ${isBlockedTime
    ? schedulingV2InfoRow(`${schedulingV2Icon("users")}Staff`, appointment.staffMember || "-")
    : schedulingV2InfoRow(`${schedulingV2Icon("file")}Type`, appointmentTypeLabel(appointment))}
        </div>
        ${isBlockedTime ? "" : `<section class="scheduling-v2-family-card">
          <h4>${schedulingV2Icon("users")}Family</h4>
          ${schedulingV2InfoRow("Caregiver", primaryClient.caregiver || "-")}
          ${schedulingV2StackedClientLinks("Siblings", clients)}
          ${schedulingV2InfoRow("Language", [...new Set(clients.map((client) => client.language).filter(Boolean))].join(", ") || "-")}
          ${schedulingV2InfoRow("Phone", primaryClient.phone || "-")}
          ${schedulingV2InfoRow("Address", primaryClient.address || "-")}
          ${primaryClient.id ? `<button data-scheduling-client="${escapeHtml(primaryClient.id)}" type="button">View Family Profile</button>` : ""}
        </section>`}
      </div>
      <div class="scheduling-v2-detail-main">
        ${renderSchedulingV2DetailTabs(detailTabs)}
        ${detailContent}
        ${isBlockedTime && activeTab === "details" ? `<div class="scheduling-v2-actions scheduling-v2-actions-blocked">
          <button data-scheduling-action="edit" type="button">Edit Block</button>
          <button data-scheduling-action="delete" type="button">Delete Block</button>
        </div>` : ""}
        ${!isBlockedTime && activeTab === "appt-note" ? `<div class="scheduling-v2-actions">
          <button data-scheduling-action="complete" type="button">${schedulingV2Icon("check")}Mark Complete</button>
          <button data-scheduling-action="reschedule" type="button">${schedulingV2Icon("calendar")}Reschedule</button>
          <button data-scheduling-action="no-show" type="button">No Show</button>
        </div>` : ""}
      </div>
    </section>
  `;
}

function bindSchedulingV2PreviewActions(selectedAppointment) {
  schedulingV2Preview.querySelectorAll("[data-scheduling-nav-module]").forEach((button) => {
    button.addEventListener("click", () => {
      activeSchedulingPreviewNavModule = button.dataset.schedulingNavModule || "Schedule";
      const moduleTarget = {
        Schedule: "scheduling",
        CRM: "crm",
        Outreach: "outreach",
        Fundraising: "fundraising",
        Admin: "admin"
      }[activeSchedulingPreviewNavModule];

      if (moduleTarget && moduleTarget !== "scheduling") {
        setActiveModule(moduleTarget);
        return;
      }

      renderSchedulingV2Preview();
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-date]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.schedulingDate === "today") {
        setSchedulingPreviewDate(todayDateString());
      } else if (button.dataset.schedulingDate === "previous") {
        moveSchedulingPreviewDate(-1);
      } else if (button.dataset.schedulingDate === "next") {
        moveSchedulingPreviewDate(1);
      }
    });
  });

  const dateInput = schedulingV2Preview.querySelector("[data-scheduling-date-input]");
  dateInput?.addEventListener("change", () => setSchedulingPreviewDate(dateInput.value));

  schedulingV2Preview.querySelector("[data-scheduling-date-picker-toggle]")?.addEventListener("click", () => {
    rememberSchedulingV2AgendaScroll();
    schedulingV2DatePickerOpen = !schedulingV2DatePickerOpen;
    renderSchedulingV2Preview();
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-calendar-month]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentDate = new Date(`${visibleSchedulingPreviewDate}T00:00:00`);
      currentDate.setMonth(currentDate.getMonth() + Number(button.dataset.schedulingCalendarMonth || 0));
      visibleSchedulingPreviewDate = toDateString(currentDate);
      selectedSchedulingPreviewAppointmentId = null;
      activeSchedulingV2Panel = "appointment";
      activeSchedulingV2DetailTab = "appt-note";
      clearSchedulingV2InlineState();
      schedulingV2DatePickerOpen = true;
      renderSchedulingV2Preview();
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-calendar-date]").forEach((button) => {
    button.addEventListener("click", () => {
      const dateKey = button.dataset.schedulingCalendarDate;
      if (dateKey) {
        schedulingV2DatePickerOpen = false;
        setSchedulingPreviewDate(dateKey);
      }
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-empty-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      rememberSchedulingV2AgendaScroll();
      startSchedulingV2InlineForm("new", {
        appointmentDate: visibleSchedulingPreviewDate,
        appointmentTime: button.dataset.schedulingEmptySlot || "",
        appointmentType: "Nutrition Education",
        status: "Scheduled"
      });
    });
    button.addEventListener("dragover", (event) => {
      if (Array.from(event.dataTransfer?.types || []).includes("text/plain")) {
        event.preventDefault();
      }
    });
    button.addEventListener("drop", (event) => {
      const clientId = event.dataTransfer?.getData("text/plain") || "";
      if (!clientId || !loadedClients.some((client) => client.id === clientId)) {
        return;
      }

      event.preventDefault();
      rememberSchedulingV2AgendaScroll();
      startSchedulingV2InlineForm("new", {
        appointmentDate: visibleSchedulingPreviewDate,
        appointmentTime: button.dataset.schedulingEmptySlot || "",
        appointmentType: "Nutrition Education",
        status: "Scheduled",
        clientId,
        clientIds: [clientId]
      });
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-preview-view]").forEach((button) => {
    button.addEventListener("click", () => setSchedulingPreviewView(button.dataset.schedulingPreviewView));
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-preview-appointment]").forEach((button) => {
    button.addEventListener("click", () => {
      rememberSchedulingV2AgendaScroll();
      selectedSchedulingPreviewAppointmentId = button.dataset.schedulingPreviewAppointment;
      selectedAppointmentId = selectedSchedulingPreviewAppointmentId;
      if (button.dataset.schedulingPreviewDate) {
        visibleSchedulingPreviewDate = button.dataset.schedulingPreviewDate;
      }
      activeSchedulingV2Panel = "appointment";
      activeSchedulingV2DetailTab = "appt-note";
      clearSchedulingV2InlineState();
      renderSchedulingV2Preview();
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-detail-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      rememberSchedulingV2AgendaScroll();
      activeSchedulingV2DetailTab = button.dataset.schedulingDetailTab || "appt-note";
      clearSchedulingV2InlineState();
      activeSchedulingV2Panel = "appointment";
      renderSchedulingV2Preview();
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-client]").forEach((button) => {
    button.addEventListener("click", () => setSelectedClient(button.dataset.schedulingClient));
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-unscheduled-client]").forEach((button) => {
    button.addEventListener("click", () => {
      rememberSchedulingV2AgendaScroll();
      const clientId = button.dataset.schedulingUnscheduledClient;
      startSchedulingV2InlineForm("new", {
        appointmentDate: visibleSchedulingPreviewDate,
        appointmentType: "Nutrition Education",
        status: "Scheduled",
        clientId,
        clientIds: [clientId]
      });
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-unscheduled-drag]").forEach((row) => {
    row.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("text/plain", row.dataset.schedulingUnscheduledDrag || "");
      event.dataTransfer?.setData("application/x-snack-client-id", row.dataset.schedulingUnscheduledDrag || "");
      event.dataTransfer.effectAllowed = "copy";
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-wrap-field]").forEach((field) => {
    field.addEventListener("change", () => {
      const key = field.dataset.schedulingWrapField;

      if (!key || !selectedAppointment || field.closest("[data-scheduling-v2-complete-form]")) {
        return;
      }

      saveAppointmentInlineUpdates(selectedAppointment, { [key]: field.value }, "Wrap Up saved.");
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-staff-select]").forEach((field) => {
    field.dataset.previousStaff = field.value || "";
    field.addEventListener("focus", () => {
      field.dataset.previousStaff = field.value || "";
    });
    field.addEventListener("change", () => {
      if (field.value !== "__add_staff__") {
        field.dataset.previousStaff = field.value || "";
        return;
      }

      const newStaffName = saveSchedulingStaffMember(window.prompt("Staff member name") || "");
      if (!newStaffName) {
        field.value = field.dataset.previousStaff || "";
        return;
      }

      const addOption = field.querySelector("option[value='__add_staff__']");
      if (![...field.options].some((option) => option.value === newStaffName)) {
        const option = document.createElement("option");
        option.value = newStaffName;
        option.textContent = newStaffName;
        field.insertBefore(option, addOption);
      }
      field.value = newStaffName;
      field.dataset.previousStaff = newStaffName;
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-v2-inline-form]").forEach((form) => {
    form.querySelectorAll('[name="status"], [name="appointmentDate"], [name="appointmentTime"], [name="appointmentType"], [name="lesson"], [name="goal"], [name="staffMember"], [name="notes"]').forEach((field) => {
      const syncDraftField = () => {
        if (field.name === "staffMember" && field.value === "__add_staff__") {
          return;
        }

        rememberSchedulingV2AgendaScroll();
        syncSchedulingV2InlineDraftFromForm(form, { rerender: true });
      };

      field.addEventListener("change", syncDraftField);
      if (field.name === "appointmentDate") {
        field.addEventListener("input", syncDraftField);
      }
    });

    form.querySelector('input[name="clientSearch"]')?.addEventListener("change", () => {
      const input = form.querySelector('input[name="clientSearch"]');
      const clientSearchName = String(input?.value || "").trim();
      const matchedClient = clientSearchName
        ? loadedClients.find((client) => normalizedLookupKey(clientName(client)) === normalizedLookupKey(clientSearchName))
        : null;

      if (matchedClient) {
        addSchedulingV2InlineClient(form);
      }
    });
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-v2-inline-form]").forEach((form) => {
    form.addEventListener("submit", saveSchedulingV2InlineForm);
  });
  schedulingV2Preview.querySelectorAll("[data-scheduling-v2-complete-form]").forEach((form) => {
    form.addEventListener("submit", saveSchedulingV2InlineCompletion);
  });

  schedulingV2Preview.querySelectorAll("[data-scheduling-action]").forEach((button) => {
    button.addEventListener("click", async () => {
      const action = button.dataset.schedulingAction;

      if (action === "new") {
        rememberSchedulingV2AgendaScroll();
        startSchedulingV2InlineForm("new", { appointmentDate: visibleSchedulingPreviewDate });
      } else if (action === "toggle-sidebar") {
        schedulingV2SidebarCollapsed = !schedulingV2SidebarCollapsed;
        rememberSchedulingV2AgendaScroll();
        renderSchedulingV2Preview();
      } else if (action === "print-schedule") {
        printScheduleForDate(visibleSchedulingPreviewDate);
      } else if (action === "print-notes") {
        printAppointmentNoteSheetsForDate(visibleSchedulingPreviewDate);
      } else if (action === "print-prep") {
        printPrepSheetsForDate(visibleSchedulingPreviewDate);
      } else if (action === "print-current-note" && selectedAppointment) {
        printAppointmentNoteSheetForAppointment(selectedAppointment);
      } else if (action === "print-current-prep" && selectedAppointment) {
        printPrepSheetForAppointment(selectedAppointment);
      } else if (action === "block-time") {
        rememberSchedulingV2AgendaScroll();
        startSchedulingV2InlineForm("block", { appointmentDate: visibleSchedulingPreviewDate });
      } else if (action === "view-unscheduled") {
        const agenda = schedulingV2Preview.querySelector(".scheduling-v2-agenda");
        schedulingV2AgendaScrollTop = agenda?.scrollTop || schedulingV2AgendaScrollTop;
        activeSchedulingV2Panel = "unscheduled";
        renderSchedulingV2Preview();
      } else if (action === "placeholder") {
        appointmentsStatusEl.textContent = "This quick action is a placeholder while we map the rest of the modules.";
      } else if (action === "close-detail") {
        rememberSchedulingV2AgendaScroll();
        activeSchedulingV2Panel = "appointment";
        activeSchedulingV2DetailTab = "appt-note";
        clearSchedulingV2InlineState();
        renderSchedulingV2Preview();
      } else if (action === "cancel-inline") {
        rememberSchedulingV2AgendaScroll();
        cancelSchedulingV2InlineForm();
      } else if (action === "add-inline-client") {
        const form = button.closest("[data-scheduling-v2-inline-form]");
        if (form) {
          addSchedulingV2InlineClient(form);
        }
      } else if (action === "remove-inline-client") {
        const form = button.closest("[data-scheduling-v2-inline-form]");
        if (form) {
          removeSchedulingV2InlineClient(form, button.dataset.clientId || "");
        }
      } else if (action === "remove-inline-client-name") {
        const form = button.closest("[data-scheduling-v2-inline-form]");
        if (form) {
          removeSchedulingV2InlineClientName(form, button.dataset.clientName || "");
        }
      } else if (action === "edit" && selectedAppointment) {
        rememberSchedulingV2AgendaScroll();
        selectedAppointmentId = selectedAppointment.id;
        if (appointmentDisplayStatus(selectedAppointment) === "Blocked") {
          startSchedulingV2InlineForm("block", selectedAppointment);
        } else {
          schedulingV2InlineMode = "edit";
          schedulingV2InlineAppointmentId = selectedAppointment.id;
          schedulingV2InlineDefaults = { ...selectedAppointment };
          activeSchedulingV2Panel = "appointment";
          renderSchedulingV2Preview();
        }
      } else if (action === "complete" && selectedAppointment) {
        rememberSchedulingV2AgendaScroll();
        selectedAppointmentId = selectedAppointment.id;
        activeSchedulingV2Panel = "appointment";
        activeSchedulingV2DetailTab = "wrap-up";
        clearSchedulingV2InlineState();
        renderSchedulingV2Preview();
      } else if (action === "reschedule" && selectedAppointment) {
        rememberSchedulingV2AgendaScroll();
        selectedAppointmentId = selectedAppointment.id;
        startSchedulingV2InlineForm("reschedule", selectedAppointment);
      } else if (action === "no-show" && selectedAppointment) {
        rememberSchedulingV2AgendaScroll();
        await updateAppointmentStatus(selectedAppointment, "No-show");
      } else if (action === "check-in" && selectedAppointment) {
        rememberSchedulingV2AgendaScroll();
        startEditingAppointmentCheckIn(selectedAppointment);
      } else if (action === "delete" && selectedAppointment) {
        rememberSchedulingV2AgendaScroll();
        selectedAppointmentId = selectedAppointment.id;
        deleteAppointment();
      } else if (action === "delete-inline") {
        rememberSchedulingV2AgendaScroll();
        const source = schedulingV2InlineSourceAppointment();
        if (source?.id) {
          selectedAppointmentId = source.id;
          deleteAppointment();
          clearSchedulingV2InlineState();
          activeSchedulingV2Panel = "appointment";
        }
      }
    });
  });
}

function renderSchedulingV2Preview() {
  if (!schedulingV2Preview) {
    return;
  }

  if (!["day", "week", "month"].includes(activeSchedulingPreviewView)) {
    activeSchedulingPreviewView = "day";
  }

  const dateAppointments = schedulingPreviewAppointmentsForDate();
  const agendaAppointments = schedulingV2PreviewAgendaAppointments(dateAppointments);
  const selectedAppointment = schedulingPreviewSelectedAppointment(agendaAppointments.length ? agendaAppointments : dateAppointments);
  const detailPanel = activeSchedulingV2Panel === "unscheduled"
    ? renderSchedulingV2UnscheduledPanel()
    : activeSchedulingV2Panel === "inline"
      ? schedulingV2InlineMode === "complete" ? renderSchedulingV2InlineCompletionForm() : renderSchedulingV2InlineForm()
      : renderSchedulingV2Detail(selectedAppointment);

  schedulingV2Preview.innerHTML = `
    <div class="scheduling-v2-shell ${schedulingV2SidebarCollapsed ? "sidebar-collapsed" : ""}">
      ${renderSchedulingV2Sidebar()}
      <div class="scheduling-v2-main">
        <div class="scheduling-v2-content">
          ${renderSchedulingV2PageHeader()}
          <div class="scheduling-v2-workspace">
            <div class="scheduling-v2-agenda-column">
              ${renderSchedulingV2Controls(dateAppointments)}
              ${renderSchedulingV2ScheduleView(agendaAppointments)}
            </div>
            ${detailPanel}
          </div>
        </div>
      </div>
    </div>
  `;

  bindSchedulingV2PreviewActions(selectedAppointment);
  const agenda = schedulingV2Preview.querySelector(".scheduling-v2-agenda");
  if (agenda && activeSchedulingPreviewView === "day") {
    const targetScrollTop = schedulingV2AgendaScrollTop;
    agenda.scrollTop = targetScrollTop;
    window.requestAnimationFrame(() => {
      const nextAgenda = schedulingV2Preview.querySelector(".scheduling-v2-agenda");
      if (nextAgenda && activeSchedulingPreviewView === "day") {
        nextAgenda.scrollTop = targetScrollTop;
      }
    });
  }
}

function renderSchedulingDesign() {
  const showPreview = activeModule === "scheduling";
  schedulingV2Preview.hidden = !showPreview;
  schedulingPanel.classList.toggle("scheduling-v2-active", showPreview);
  document.body.classList.toggle("scheduling-v2-preview-mode", showPreview);

  if (showPreview) {
    renderSchedulingV2Preview();
  }
}

function renderAppointments() {
  appointmentsList.innerHTML = "";
  renderAppointmentSummary();
  renderSchedulingDesign();
  const appointments = loadedAppointments
    .filter(appointmentMatchesFilters)
    .sort(
      (first, second) =>
        dateValue(first.appointmentDate) - dateValue(second.appointmentDate) ||
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime) ||
        appointmentClientName(first).localeCompare(appointmentClientName(second))
    );

  if (selectedAppointmentId && !loadedAppointments.some((appointment) => appointment.id === selectedAppointmentId)) {
    selectedAppointmentId = null;
  }

  if (!appointments.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = loadedAppointments.length ? "No appointments match the current filters." : "No appointments yet.";
    appointmentsList.append(empty);
    return;
  }

  for (const appointment of appointments) {
    const row = document.createElement("button");
    row.className = "referral-row appointment-row";
    row.type = "button";
    row.setAttribute("role", "row");
    row.setAttribute("aria-label", `Open appointment for ${appointmentClientName(appointment)}`);
    row.style.gridTemplateColumns = "minmax(150px, 0.85fr) minmax(190px, 1.15fr) minmax(130px, 0.75fr) minmax(180px, 1fr) minmax(140px, 0.8fr)";

    if (appointment.id === selectedAppointmentId) {
      row.classList.add("selected");
      row.setAttribute("aria-current", "true");
    }

    const values = [
      formatAppointmentDateTime(appointment),
      appointmentClientName(appointment),
      appointmentStatusBadge(appointment.status),
      appointmentLessonLabel(appointment) || "-",
      appointment.staffMember || "-"
    ];

    for (const value of values) {
      const cell = document.createElement("span");
      cell.className = "table-cell";
      cell.setAttribute("role", "cell");
      if (value instanceof HTMLElement) {
        cell.append(value);
      } else {
        cell.textContent = value;
      }
      row.append(cell);
    }

    row.addEventListener("click", () => setSelectedAppointment(appointment.id));
    appointmentsList.append(row);
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function titleCase(value) {
  const text = String(value || "");
  return text ? `${text.charAt(0).toUpperCase()}${text.slice(1)}` : "";
}

function printableAppointmentsForDate(dateKey, { prepOnly = false } = {}) {
  return loadedAppointments
    .filter((appointment) => appointment.appointmentDate === dateKey && appointment.status !== "Canceled")
    .filter((appointment) => !prepOnly || appointmentPrepItems(appointment).length)
    .sort(
      (first, second) =>
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime) ||
        appointmentClientName(first).localeCompare(appointmentClientName(second))
    );
}

function todayPrintableAppointments(options = {}) {
  return printableAppointmentsForDate(todayDateString(), options);
}

function appointmentPrintClientSummary(appointment) {
  const clients = appointmentClientIds(appointment)
    .map((clientId) => loadedClients.find((client) => client.id === clientId))
    .filter(Boolean);
  const clientRows = clients.map((client) => ({
    name: clientName(client),
    caregiver: client.parentName || "",
    phone: client.phone ? formatPhone(client.phone) : "",
    language: client.preferredLanguage || ""
  }));
  const matchedNames = new Set(clientRows.map((client) => normalizedLookupKey(client.name)));
  const fallbackRows = appointmentClientNames(appointment)
    .filter((name) => !matchedNames.has(normalizedLookupKey(name)))
    .map((name) => ({
      name,
      caregiver: "",
      phone: "",
      language: ""
    }));

  if (!clientRows.length && !fallbackRows.length) {
    return [
      {
        name: appointmentClientName(appointment),
        caregiver: "",
        phone: "",
        language: ""
      }
    ];
  }

  return [...clientRows, ...fallbackRows];
}

function printField(label, value) {
  return `
    <div class="print-field">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value || "-")}</strong>
    </div>
  `;
}

function formatPrintDayTitle(value) {
  if (!value) {
    return "Today";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return formatDateOnly(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function appointmentClientPrintRows(appointment) {
  const clientRows = appointmentPrintClientSummary(appointment)
    .map((client) => `
      <li>
        <strong>${escapeHtml(client.name || "Client")}</strong>
        <span>${escapeHtml([client.caregiver ? `Caregiver: ${client.caregiver}` : "", client.phone, client.language].filter(Boolean).join(" | ") || "-")}</span>
      </li>
    `)
    .join("");

  return clientRows;
}

function appointmentNoteClientSummary(appointment) {
  return appointmentPrintClientSummary(appointment)
    .map((client) => [
      client.name || "Client",
      client.caregiver ? `Caregiver: ${client.caregiver}` : "",
      client.language
    ].filter(Boolean).join(" | "))
    .join("; ");
}

function uniqueAppointmentPrintValues(appointment, key) {
  return [...new Set(appointmentPrintClientSummary(appointment).map((client) => client[key]).filter(Boolean))];
}

function ageOnDate(dateOfBirth, targetDate) {
  if (!dateOfBirth || !targetDate) {
    return "";
  }

  const birthDate = new Date(`${dateOfBirth}T00:00:00`);
  const appointmentDate = new Date(`${targetDate}T00:00:00`);

  if (Number.isNaN(birthDate.getTime()) || Number.isNaN(appointmentDate.getTime())) {
    return "";
  }

  let age = appointmentDate.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(appointmentDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  if (appointmentDate < birthdayThisYear) {
    age -= 1;
  }

  return age >= 0 ? String(age) : "";
}

function appointmentAgeText(appointment) {
  const clients = appointmentClientIds(appointment)
    .map((clientId) => loadedClients.find((item) => item.id === clientId))
    .filter(Boolean);
  const ages = clients
    .map((client) => ({
      name: clientName(client),
      age: ageOnDate(client.dateOfBirth, appointment.appointmentDate)
    }))
    .filter((item) => item.age);

  if (!ages.length) {
    return "-";
  }

  return ages.length === 1 ? ages[0].age : ages.map((item) => `${item.name}: ${item.age}`).join("; ");
}

function appointmentDateTimeSortValue(appointment) {
  return dateValue(appointment.appointmentDate, 1) + appointmentTimeValue(appointment.appointmentTime) * 60000;
}

function appointmentsShareClient(first, second) {
  const firstIds = appointmentClientIds(first);
  const secondIds = appointmentClientIds(second);

  if (firstIds.length && secondIds.length) {
    return firstIds.some((clientId) => secondIds.includes(clientId));
  }

  return normalizedLookupKey(appointmentClientName(first)) === normalizedLookupKey(appointmentClientName(second));
}

function previousAppointmentsForPrint(appointment) {
  const currentValue = appointmentDateTimeSortValue(appointment);

  return loadedAppointments
    .filter((item) => item.id !== appointment.id)
    .filter((item) => item.status !== "Canceled")
    .filter((item) => appointmentsShareClient(item, appointment))
    .filter((item) => appointmentDateTimeSortValue(item) < currentValue)
    .sort((first, second) => appointmentDateTimeSortValue(second) - appointmentDateTimeSortValue(first));
}

function appointmentIntervalText(appointment) {
  const previous = previousAppointmentsForPrint(appointment)[0];

  if (!previous?.appointmentDate || !appointment.appointmentDate) {
    return appointmentTypeLabel(appointment) === "Enrollment" ? "New enrollment" : "-";
  }

  const currentDate = new Date(`${appointment.appointmentDate}T00:00:00`);
  const previousDate = new Date(`${previous.appointmentDate}T00:00:00`);
  const dayCount = Math.max(0, Math.round((currentDate - previousDate) / 86400000));

  return `${dayCount} days since ${formatDateOnly(previous.appointmentDate)}`;
}

function appointmentPreviousGoalText(appointment) {
  const previousWithGoal = previousAppointmentsForPrint(appointment).find((item) => appointmentGoalText(item).trim());
  return previousWithGoal ? appointmentGoalText(previousWithGoal).trim() : "-";
}

function appointmentSchedulePrintCard(appointment) {
  const familySummary = appointmentPrintClientSummary(appointment)
    .map((client) => [client.caregiver, client.language].filter(Boolean).join(" | "))
    .filter(Boolean)
    .join("; ");
  const staffFirstName = String(appointment.staffMember || "").trim().split(/\s+/)[0] || "";
  const details = [familySummary, staffFirstName ? `Staff: ${staffFirstName}` : ""].filter(Boolean).join(" | ");

  return `
    <section class="print-schedule-row">
      <div class="print-schedule-time">${escapeHtml(formatAppointmentTime(appointment.appointmentTime) || "Time TBD")}</div>
      <div>
        <h2>${escapeHtml(appointmentClientName(appointment))}</h2>
        <p>${escapeHtml(details || "-")}</p>
      </div>
    </section>
  `;
}

function appointmentPrepPrintCard(appointment) {
  const prepItems = appointmentPrepItems(appointment);

  const listItem = (item, children = []) => `
    <li>
      ${escapeHtml(item)}
      ${children.length ? `<ul>${children.join("")}</ul>` : ""}
    </li>
  `;
  const prepList = appointmentTypeLabel(appointment) === "Enrollment"
    ? [
      listItem("Place paperwork at reception before the appointment.", [
        listItem("Enrollment form (file cabinet); siblings can share one form."),
        listItem("Questionnaire for each child (file cabinet); each child needs their own.", [
          listItem("Write client name in the top right corner, initial code on the back, and circle PRE.")
        ]),
        ...(prepItems.includes("HRSN screener for YCCO client (file cabinet).") ? [listItem("HRSN screener for YCCO client (file cabinet).")] : [])
      ]),
      ...prepItems
        .filter((item) => ![
          "Place paperwork at reception before the appointment.",
          "Enrollment form (file cabinet); siblings can share one form.",
          "Questionnaire for each child (file cabinet); each child needs their own.",
          "Write client name in the top right corner, initial code on the back, and circle PRE.",
          "HRSN screener for YCCO client (file cabinet)."
        ].includes(item))
        .map((item) => listItem(item))
    ].join("")
    : prepItems.map((item) => listItem(item)).join("");

  return `
    <section class="print-prep-row">
      <div class="print-prep-row-header">
        <strong>${escapeHtml(formatAppointmentTime(appointment.appointmentTime) || "Time TBD")}</strong>
        <span>${escapeHtml(appointmentLessonLabel(appointment) || appointmentTypeLabel(appointment))}</span>
        <h2>${escapeHtml(appointmentClientName(appointment))}</h2>
      </div>
      <ul>${prepList}</ul>
    </section>
  `;
}

function normalizeNotePrompt(prompt) {
  return Array.isArray(prompt)
    ? { label: prompt[0], lines: prompt[1] || 3, type: "lines" }
    : { type: "lines", lines: 3, ...prompt };
}

function printPromptBlock(prompt) {
  const item = normalizeNotePrompt(prompt);

  if (item.type === "check") {
    return `
      <div class="print-checkbox-row">
        <span>${escapeHtml(item.label)}</span>
        <strong>Yes</strong>
        <i></i>
        <strong>No</strong>
        <i></i>
      </div>
    `;
  }

  if (item.type === "nextAppointment") {
    return `
      <div class="print-next-appt-row">
        <span>Next appt scheduled</span>
        <i></i>
        <strong>Date</strong>
        <em></em>
      </div>
    `;
  }

  return `
    <div>
      <span>${escapeHtml(item.label)}</span>
      <div class="print-lines" style="--print-lines-height: ${Number(item.lines) * 22}px;"></div>
    </div>
  `;
}

function appointmentLessonTopicTitle(appointment) {
  if (String(appointment.lesson || "").toLowerCase() === "check in") {
    return "Check In";
  }

  const lesson = appointmentLessonNumber(appointment);
  return appointmentLessonTitle(lesson) || appointmentLessonLabel(appointment) || appointmentTypeLabel(appointment);
}

function appointmentNotePromptSections(appointment) {
  if (appointmentTypeLabel(appointment) === "Enrollment") {
    return [
      {
        title: "Visit Note",
        prompts: [
          ["Program interest / what they know", 3],
          ["Healthy habits and strengths", 2],
          ["Caregiver goals", 2],
          ["Foods enjoyed or avoided", 2],
          ["Goal", 2],
          ["Next lesson / next appt", 1]
        ]
      }
    ];
  }

  const lesson = appointmentLessonNumber(appointment);
  const isCheckIn = String(appointment.lesson || "").toLowerCase() === "check in" || lesson === 8;
  const retentionPrompts = {
    2: ["Nutrient dense / sometimes foods"],
    3: ["Natural sugar and added sugar", "Find added sugar on label and grams", "Nutrient dense / sometimes foods"],
    4: ["5 food groups", "Whole vs. white grains", "Food groups each meal/day", "Natural sugar and added sugar", "Nutrient dense / sometimes foods"],
    5: ["3 macro nutrients", "Fiber, protein, fat foods", "5 food groups", "Natural sugar and added sugar"],
    6: ["2 micro nutrients", "Why eat the rainbow", "3 macro nutrients", "5 food groups"],
    7: ["Mindful eating and how to do it", "Hunger and fullness cues", "2 micro nutrients", "3 macro nutrients", "5 food groups"]
  };

  if (isCheckIn) {
    return [
      {
        title: "Goal Check In",
        prompts: [
          ["How did the previous goal go? What helped or made it harder? Other updates or wins?", 3],
          ["Anything you would like to talk about today?", 3],
          ["One thing you would like help or support with", 2],
          ["New Goal", 2],
          ["Next Appt", 1]
        ]
      }
    ];
  }

  const retentionSection = retentionPrompts[lesson]?.length
    ? {
      title: "Knowledge Retention",
      prompts: retentionPrompts[lesson].map((prompt) => ({ label: prompt, type: "check" }))
    }
    : null;

  return [
    {
      title: "Goal Check In",
      prompts: [
        ["How did the previous goal go? What helped or made it harder? Other updates or wins?", 3]
      ]
    },
    retentionSection,
    {
      title: `Lesson: ${appointmentLessonTopicTitle(appointment)}`,
      prompts: [
        ["Activities practiced / client response", 4]
      ]
    },
    {
      title: "Goal & Next Steps",
      prompts: [
        ["Goal set today", 2],
        { type: "nextAppointment" },
        ["Follow-up needed?", 2]
      ]
    }
  ].filter(Boolean);
}

function appointmentNoteTitle(appointment) {
  if (appointmentTypeLabel(appointment) === "Enrollment") {
    return "Enrollment Appointment Note";
  }

  if (String(appointment.lesson || "").toLowerCase() === "check in") {
    return "Check In Appointment Note";
  }

  const lesson = appointmentLessonNumber(appointment);
  const titles = {
    1: "Nutrient Density Appointment Note",
    2: "Sugar Appointment Note",
    3: "Food Groups Appointment Note",
    4: "Macronutrients Appointment Note",
    5: "Micronutrients Appointment Note",
    6: "Mindful Eating Appointment Note",
    7: "Healthy Habits Appointment Note"
  };

  return titles[lesson] || "Appointment Note";
}

function appointmentNotePrintCard(appointment) {
  const sections = appointmentNotePromptSections(appointment)
    .map((section) => `
      <div class="print-note-prompts">
        <h2>${escapeHtml(section.title)}</h2>
        <div class="print-note-grid">
          ${section.prompts.map((prompt) => printPromptBlock(prompt)).join("")}
        </div>
      </div>
    `)
    .join("");
  const caregiverText = uniqueAppointmentPrintValues(appointment, "caregiver").join("; ") || "-";
  const languageText = uniqueAppointmentPrintValues(appointment, "language").join("; ") || "-";
  const noteMeta = [
    ["Client", appointmentClientName(appointment)],
    ["Caregiver", caregiverText],
    ["Language", languageText],
    ["Age", appointmentAgeText(appointment)],
    ["Time", formatAppointmentTime(appointment.appointmentTime) || "Time TBD"],
    ["Interval since last appointment", appointmentIntervalText(appointment)]
  ];
  const goalText = appointmentGoalText(appointment);

  return `
    <section class="print-card print-note-card">
      <div class="print-note-sheet-header">
        <p>The SNACK Program</p>
        <h2>${escapeHtml(appointmentNoteTitle(appointment))}</h2>
        <span>${escapeHtml(appointmentLessonLabel(appointment) || appointmentTypeLabel(appointment))}</span>
      </div>
      <div class="print-note-info">
        ${noteMeta.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value || "-")}</p>`).join("")}
      </div>
      <div class="print-note-goal"><strong>Goal:</strong> ${goalText ? ` ${escapeHtml(goalText)}` : ""}</div>
      ${sections}
    </section>
  `;
}

function printableDocumentContent(title, subtitle, content) {
  const header = title
    ? `
      <header class="print-header">
        <div>
          <p>The SNACK Program</p>
          <h1>${escapeHtml(title)}</h1>
        </div>
        ${subtitle ? `<div class="print-date">${escapeHtml(subtitle)}</div>` : ""}
      </header>
    `
    : "";

  return `
    ${header}
    ${content}
  `;
}

function printPreparedDocument(title, subtitle, content) {
  if (!printRoot) {
    appointmentsStatusEl.textContent = "Could not find the printable area.";
    return false;
  }

  const cleanup = () => {
    printRoot.innerHTML = "";
    printRoot.setAttribute("aria-hidden", "true");
    document.body.classList.remove("printing");
    window.removeEventListener("afterprint", cleanup);
  };

  printRoot.innerHTML = printableDocumentContent(title, subtitle, content);
  printRoot.setAttribute("aria-hidden", "false");
  document.body.classList.add("printing");
  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();
  window.setTimeout(() => {
    if (document.body.classList.contains("printing")) {
      cleanup();
    }
  }, 30000);
  return true;
}

function printScheduleForDate(dateKey = todayDateString()) {
  const appointments = printableAppointmentsForDate(dateKey);

  if (!appointments.length) {
    appointmentsStatusEl.textContent = `No appointments scheduled on ${formatDateOnly(dateKey)} to print.`;
    return;
  }

  const content = appointments.map((appointment) => appointmentSchedulePrintCard(appointment)).join("");

  if (printPreparedDocument(formatPrintDayTitle(dateKey), "", content)) {
    appointmentsStatusEl.textContent = `Print dialog opened for ${formatDateOnly(dateKey)} schedule.`;
  }
}

function printTodaySchedule() {
  printScheduleForDate(todayDateString());
}

function printPrepSheetsForDate(dateKey = todayDateString()) {
  const appointments = printableAppointmentsForDate(dateKey, { prepOnly: true });

  if (!appointments.length) {
    appointmentsStatusEl.textContent = `No appointment prep sheets needed on ${formatDateOnly(dateKey)}.`;
    return;
  }

  const subtitle = formatDateOnly(dateKey);
  const content = appointments.map((appointment) => appointmentPrepPrintCard(appointment)).join("");

  if (printPreparedDocument("Appointment Prep Sheets", subtitle, content)) {
    appointmentsStatusEl.textContent = "Print dialog opened for prep sheets.";
  }
}

function printPrepSheets() {
  printPrepSheetsForDate(todayDateString());
}

function printPrepSheetForAppointment(appointment) {
  if (!appointment) {
    appointmentsStatusEl.textContent = "Choose an appointment before printing prep.";
    return;
  }

  const prepItems = appointmentPrepItems(appointment);

  if (!prepItems.length) {
    appointmentsStatusEl.textContent = "This appointment does not have prep items yet.";
    return;
  }

  if (printPreparedDocument("Appointment Prep Sheet", formatDateOnly(appointment.appointmentDate), appointmentPrepPrintCard(appointment))) {
    appointmentsStatusEl.textContent = "Print dialog opened for this appointment prep sheet.";
  }
}

function printAppointmentNoteSheetsForDate(dateKey = todayDateString()) {
  const appointments = printableAppointmentsForDate(dateKey);

  if (!appointments.length) {
    appointmentsStatusEl.textContent = `No appointments scheduled on ${formatDateOnly(dateKey)} for note sheets.`;
    return;
  }

  const subtitle = formatDateOnly(dateKey);
  const content = appointments.map((appointment) => appointmentNotePrintCard(appointment)).join("");

  if (printPreparedDocument("", subtitle, content)) {
    appointmentsStatusEl.textContent = "Print dialog opened for appointment note sheets.";
  }
}

function printAppointmentNoteSheets() {
  printAppointmentNoteSheetsForDate(todayDateString());
}

function printAppointmentNoteSheetForAppointment(appointment) {
  if (!appointment) {
    appointmentsStatusEl.textContent = "Choose an appointment before printing a note sheet.";
    return;
  }

  if (printPreparedDocument("", formatDateOnly(appointment.appointmentDate), appointmentNotePrintCard(appointment))) {
    appointmentsStatusEl.textContent = "Print dialog opened for this appointment note.";
  }
}

function renderClientSummary() {
  clientSummary.innerHTML = "";

  for (const group of clientSummaryGroups) {
    const count = loadedClients.filter((client) => group.statuses.includes(client.status || "Scheduled")).length;
    const item = document.createElement("div");
    item.className = "summary-item";

    const countEl = document.createElement("strong");
    countEl.textContent = count;

    const labelEl = document.createElement("span");
    labelEl.textContent = group.label;

    item.append(countEl, labelEl);
    clientSummary.append(item);
  }
}

function clearClientFilters() {
  clientSearchInput.value = "";
  selectedClientId = null;
  renderClientSummary();
  renderClients();
}

function renderReferralSummary() {
  referralSummary.innerHTML = "";

  for (const group of summaryGroups) {
    const count = loadedReferrals.filter((referral) => group.statuses.includes(normalizeStatus(referral.status))).length;
    const item = document.createElement("div");
    item.className = "summary-item";

    const countEl = document.createElement("strong");
    countEl.textContent = count;

    const labelEl = document.createElement("span");
    labelEl.textContent = group.label;

    item.append(countEl, labelEl);
    referralSummary.append(item);
  }
}

function renderProfileHeader(kicker, titleText, badge, actions) {
  const heading = document.createElement("div");
  heading.className = "detail-heading profile-heading";

  const titleWrap = document.createElement("div");
  titleWrap.className = "profile-title-block";

  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = kicker;

  const titleRow = document.createElement("div");
  titleRow.className = "profile-title-row";

  const title = document.createElement("h3");
  title.textContent = titleText;

  titleRow.append(title, badge);
  titleWrap.append(eyebrow, titleRow);
  heading.append(titleWrap, actions);
  return heading;
}

function renderProfileSummaryGrid(items) {
  const grid = document.createElement("div");
  grid.className = "profile-summary-grid";

  for (const [label, value] of items) {
    const card = document.createElement("div");
    card.className = "profile-summary-card";

    const labelEl = document.createElement("span");
    labelEl.textContent = label;

    const valueEl = document.createElement("strong");
    valueEl.textContent = displayValue(value);

    card.append(labelEl, valueEl);
    grid.append(card);
  }

  return grid;
}

function renderProfileSection(titleText, fields) {
  const section = document.createElement("section");
  section.className = "profile-section";

  const title = document.createElement("h4");
  title.textContent = titleText;

  const grid = document.createElement("div");
  grid.className = "profile-field-grid";

  for (const [label, value] of fields) {
    grid.append(renderProfileField(label, value));
  }

  section.append(title, grid);
  return section;
}

function renderProfileField(label, value) {
  const field = document.createElement("div");
  field.className = "profile-field";

  const labelEl = document.createElement("span");
  labelEl.textContent = label;

  const valueEl = document.createElement("strong");
  if (value instanceof Node) {
    valueEl.append(value);
  } else {
    valueEl.textContent = displayValue(value);
  }

  field.append(labelEl, valueEl);
  return field;
}

function renderProfileDateInput(label, value, record, moduleName, fieldName) {
  const input = document.createElement("input");
  input.className = "inline-date-input profile-date-input";
  input.type = "date";
  input.value = value || "";
  input.setAttribute("aria-label", label);
  input.addEventListener("change", () => updateInlineDate(record, moduleName, fieldName, input.value));
  return input;
}

function renderProfileNotes(notesValue) {
  const notes = document.createElement("section");
  notes.className = "notes-panel profile-notes-panel";

  const notesTitle = document.createElement("h4");
  notesTitle.textContent = "Notes";

  const notesText = document.createElement("p");
  notesText.textContent = notesValue || "-";

  notes.append(notesTitle, notesText);
  return notes;
}

function recordInitials(name) {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "SN";
  }

  return parts.slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

function clientAppointments(client) {
  return loadedAppointments
    .filter((appointment) => appointmentClientIds(appointment).includes(client.id) || appointmentClientName(appointment) === clientName(client))
    .sort(
      (first, second) =>
        dateValue(first.appointmentDate, 1) - dateValue(second.appointmentDate, 1) ||
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime)
    );
}

function completedClientAppointments(client) {
  return clientAppointments(client).filter((appointment) => appointment.status === "Completed");
}

function mostRecentCompletedAppointmentDateFromAppointments(appointments, excludedAppointmentId = "") {
  const today = todayDateString();
  const datedAppointments = appointments
    .filter(
      (appointment) =>
        appointment.id !== excludedAppointmentId &&
        appointment.status === "Completed" &&
        appointment.appointmentDate &&
        appointment.appointmentDate <= today
    )
    .sort(
      (first, second) =>
        dateValue(second.appointmentDate, -1) - dateValue(first.appointmentDate, -1) ||
        appointmentTimeValue(second.appointmentTime) - appointmentTimeValue(first.appointmentTime)
    );

  return datedAppointments[0]?.appointmentDate || "";
}

function mostRecentCompletedAppointmentDateForClientId(clientId, excludedAppointmentId = "") {
  return mostRecentCompletedAppointmentDateFromAppointments(
    loadedAppointments.filter((appointment) => appointmentClientIds(appointment).includes(clientId)),
    excludedAppointmentId
  );
}

function clientManualLessonIndex(client) {
  const value = String(client.currentLesson || "").trim();

  if (value === "enrollment") {
    return 0;
  }

  const match = value.match(/^lesson-(\d)$/);
  return match ? Number(match[1]) : -1;
}

function clientCompletedLessonIndex(client) {
  const manualIndex = clientManualLessonIndex(client);

  if (manualIndex >= 0) {
    return manualIndex;
  }

  const completed = completedClientAppointments(client);
  const completedLessons = completed
    .map((appointment) => Number.parseInt(String(appointment.lesson || "").replace(/\D/g, ""), 10))
    .filter((lesson) => Number.isFinite(lesson) && lesson >= 1 && lesson <= 7);

  if (completedLessons.length) {
    return Math.max(...completedLessons);
  }

  return client.firstAppointmentDate || completed.length ? 0 : -1;
}

function currentLessonLabel(client) {
  const index = clientCompletedLessonIndex(client);

  if (index < 0) {
    return "Not started";
  }

  return index === 0 ? "Enrollment" : `Lesson ${index}`;
}

function profileDate(value, emptyText = "-") {
  return formatShortDate(value) || emptyText;
}

function mostRecentAppointmentDate(client) {
  const appointments = clientAppointments(client);

  if (appointments.length) {
    return mostRecentCompletedAppointmentDateFromAppointments(appointments);
  }

  return client.mostRecentAppointmentDate || "";
}

function clientFlowAppointmentDate(client) {
  return mostRecentAppointmentDate(client) || client.lastAppointmentDate || client.firstAppointmentDate || "";
}

function profileV2StatusAccent(status) {
  const key = String(status || "").toLowerCase();
  if (key.includes("reschedule") || key.includes("no show") || key.includes("closed") || key.includes("not interested")) {
    return "var(--brand-red)";
  }
  if (key.includes("scheduled") || key.includes("complete")) {
    return "var(--brand-green)";
  }
  if (key.includes("active")) {
    return "var(--brand-blue)";
  }
  if (key.includes("waiting") || key.includes("call back") || key.includes("watch")) {
    return "var(--brand-purple)";
  }
  if (key.includes("voicemail") || key.includes("texted") || key.includes("emailed") || key.includes("contact")) {
    return "var(--brand-orange)";
  }
  return "var(--brand-green)";
}

function profileV2StatusLabel(status, fallback = "Active") {
  return displayValue(status || fallback).replace(/^Needs Reschedule$/i, "Reschedule");
}

function renderProfileV2List(container, records, options) {
  container.innerHTML = "";
  container.classList.add("profile-v2-flow-list");

  if (!records.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = options.emptyText;
    container.append(empty);
    return;
  }

  for (const record of records) {
    const status = options.status(record);
    const row = document.createElement("button");
    row.className = "profile-v2-list-item";
    row.type = "button";
    row.style.setProperty("--profile-accent", profileV2StatusAccent(status));
    row.setAttribute("aria-label", `Open ${options.name(record)}`);

    if (record.id === options.selectedId) {
      row.classList.add("active");
      row.setAttribute("aria-current", "true");
    }

    const name = document.createElement("strong");
    name.textContent = options.name(record);
    const pill = document.createElement("span");
    pill.className = "profile-v2-pill";
    pill.textContent = profileV2StatusLabel(status, options.fallbackStatus);
    row.append(pill, name);
    row.addEventListener("click", () => options.onOpen(record));
    container.append(row);
  }
}

function profileV2Field(label, value, className = "") {
  const field = document.createElement("div");
  field.className = `profile-v2-field${className ? ` ${className}` : ""}`;
  const labelEl = document.createElement("span");
  labelEl.textContent = label;
  const valueEl = document.createElement("strong");
  if (value instanceof Node) {
    valueEl.append(value);
  } else {
    valueEl.textContent = displayValue(value);
  }
  field.append(labelEl, valueEl);
  return field;
}

function renderProfileV2Card(titleText, fields, action) {
  const card = document.createElement("section");
  card.className = "profile-v2-card";

  const header = document.createElement("div");
  header.className = "profile-v2-card-header";
  const title = document.createElement("h3");
  title.textContent = titleText;
  header.append(title);

  if (action) {
    const button = document.createElement("button");
    button.className = "profile-v2-edit";
    button.type = "button";
    button.textContent = action.label;
    button.addEventListener("click", action.onClick);
    header.append(button);
  }

  const grid = document.createElement("div");
  grid.className = "profile-v2-detail-grid";
  for (const field of fields) {
    grid.append(profileV2Field(field.label, field.value, field.className || ""));
  }

  card.append(header, grid);
  return card;
}

function profileV2Siblings(record, moduleName) {
  const records = moduleName === "clients" ? loadedClients : loadedReferrals;
  const getName = moduleName === "clients" ? clientName : referralName;
  const selectRecord = moduleName === "clients" ? setSelectedClient : setSelectedReferral;
  const siblingIds = Array.isArray(record.siblingIds) ? record.siblingIds : [];
  const siblings = siblingIds.map((id) => records.find((item) => item.id === id)).filter(Boolean);
  const list = document.createElement("div");
  list.className = "profile-v2-linked-list";

  if (!siblings.length) {
    const empty = document.createElement("strong");
    empty.textContent = "None linked yet";
    list.append(empty);
  }

  for (const sibling of siblings) {
    const button = document.createElement("button");
    button.className = "profile-v2-text-link";
    button.type = "button";
    button.textContent = firstNameFromFullName(getName(sibling)) || getName(sibling);
    button.addEventListener("click", () => selectRecord(sibling.id));
    list.append(button);
  }

  return list;
}

function profileV2SideInfo(label, value) {
  const item = document.createElement("div");
  item.className = "profile-v2-info";
  const labelEl = document.createElement("span");
  labelEl.textContent = label;
  const valueEl = document.createElement("strong");
  if (value instanceof Node) {
    valueEl.append(value);
  } else {
    valueEl.textContent = displayValue(value);
  }
  item.append(labelEl, valueEl);
  return item;
}

function profileV2MetaRow(label, value) {
  const row = document.createElement("div");
  row.className = "profile-v2-meta-row";
  const labelEl = document.createElement("span");
  labelEl.textContent = label;
  const valueEl = document.createElement("strong");
  valueEl.textContent = displayValue(value);
  row.append(labelEl, valueEl);
  return row;
}

function renderProfileV2Tabs(activeTab, onSelect) {
  const tabs = document.createElement("nav");
  tabs.className = "profile-v2-tabs";
  tabs.setAttribute("aria-label", "Profile tabs");
  const items = [
    ["overview", "Overview"],
    ["notes", "Notes"],
    ["activity", "Activity"],
    ["appointments", "Appointments"],
    ["forms", "Forms"]
  ];

  for (const [tab, label] of items) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.classList.toggle("active", activeTab === tab);
    button.dataset.profileTab = tab;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(activeTab === tab));
    button.addEventListener("click", () => onSelect(tab));
    tabs.append(button);
  }

  return tabs;
}

function renderProfileV2ActivityCard(record, moduleName, fallbackItems, onAddActivity) {
  const card = document.createElement("section");
  card.className = "profile-v2-card";
  const header = document.createElement("div");
  header.className = "profile-v2-card-header";
  const title = document.createElement("h3");
  title.textContent = "Activity";
  const button = document.createElement("button");
  button.className = "profile-v2-edit";
  button.type = "button";
  button.textContent = "Add Activity";
  button.addEventListener("click", onAddActivity);
  header.append(title, button);

  const list = document.createElement("div");
  list.className = "profile-v2-activity-list";
  const items = [...profileActivityLogs(record, moduleName), ...fallbackItems]
    .sort((first, second) => String(second.sortKey || "").localeCompare(String(first.sortKey || "")))
    .slice(0, 8);

  for (const item of items) {
    const row = document.createElement("div");
    row.className = "profile-v2-activity";
    const copy = document.createElement("div");
    const itemTitle = document.createElement("strong");
    itemTitle.textContent = item.title;
    copy.append(itemTitle);
    for (const detailValue of (Array.isArray(item.detail) ? item.detail : [item.detail]).filter(Boolean)) {
      const detail = document.createElement("span");
      detail.textContent = detailValue;
      copy.append(detail);
    }
    const date = document.createElement("span");
    date.className = "profile-v2-pill";
    date.textContent = profileDate(String(item.date || "").slice(0, 10));
    row.append(copy, date);
    list.append(row);
  }

  if (!list.children.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No activity yet.";
    list.append(empty);
  }

  card.append(header, list);
  return card;
}

function profileV2PrintFormHref(fileName) {
  return `./print-forms/${encodeURIComponent(fileName)}`;
}

function renderProfileV2FormLinks(files) {
  const links = document.createElement("div");
  links.className = "profile-v2-form-links";

  for (const file of files) {
    const anchor = document.createElement("a");
    anchor.href = profileV2PrintFormHref(file.fileName);
    anchor.download = file.fileName;
    anchor.textContent = file.label;
    links.append(anchor);
  }

  return links;
}

function renderProfileV2FormsCard(recordType = "client") {
  const card = document.createElement("section");
  card.className = "profile-v2-card";
  const header = document.createElement("div");
  header.className = "profile-v2-card-header";
  const title = document.createElement("h3");
  title.textContent = "Forms";
  header.append(title);

  const list = document.createElement("div");
  list.className = "profile-v2-form-list";
  const rows = recordType === "client"
    ? profileV2ClientPrintFormRows
    : [
      {
        name: "Referral intake",
        description: "No referral-specific packet is mapped yet. Print client packets after conversion or scheduling.",
        files: []
      }
    ];

  for (const rowData of rows) {
    const row = document.createElement("div");
    row.className = "profile-v2-form-row";
    const copy = document.createElement("div");
    const rowTitle = document.createElement("strong");
    rowTitle.textContent = rowData.name;
    const detail = document.createElement("span");
    detail.textContent = rowData.description;
    copy.append(rowTitle, detail);
    if (rowData.files.length) {
      copy.append(renderProfileV2FormLinks(rowData.files));
    }
    row.append(copy);
    list.append(row);
  }

  card.append(header, list);
  return card;
}

function referralAppointments(referral) {
  const targetName = referralName(referral).trim().toLowerCase();
  if (!targetName) {
    return [];
  }

  return loadedAppointments
    .filter((appointment) =>
      appointmentClientNames(appointment).some((name) => name.trim().toLowerCase() === targetName)
    )
    .sort(
      (first, second) =>
        dateValue(first.appointmentDate, 1) - dateValue(second.appointmentDate, 1) ||
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime)
    );
}

function renderClientProfileHero(client, statusLabel) {
  const hero = document.createElement("section");
  hero.className = "panel client-profile-hero";

  const top = document.createElement("div");
  top.className = "client-person-top";

  const avatar = document.createElement("div");
  avatar.className = "client-avatar";
  avatar.textContent = recordInitials(clientName(client));

  const copy = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = statusLabel;

  const lines = document.createElement("div");
  lines.className = "client-contact-lines";
  for (const value of [
    `Caregiver: ${displayValue(client.parentName)}`,
    `Phone: ${displayValue(formatPhone(client.phone))}`,
    `Recent Contact: ${profileDate(client.mostRecentContactDate)}`
  ]) {
    const line = document.createElement("span");
    line.textContent = value;
    lines.append(line);
  }

  copy.append(title, lines);
  top.append(avatar, copy);

  const fields = document.createElement("div");
  fields.className = "client-field-grid";
  const fieldItems = [
    ["First appointment", profileDate(client.firstAppointmentDate)],
    ["Date of birth", profileDate(client.dateOfBirth)],
    ["Graduation date", profileDate(client.lastAppointmentDate, "Not graduated")],
    ["Language", displayValue(client.preferredLanguage)]
  ];

  for (const [label, value] of fieldItems) {
    fields.append(renderClientProfileField(label, value));
  }

  hero.append(top, fields);
  return hero;
}

function renderClientProfileField(label, value) {
  const field = document.createElement("div");
  field.className = "client-profile-field";

  const labelEl = document.createElement("span");
  labelEl.textContent = label;

  const valueEl = document.createElement("strong");
  valueEl.textContent = displayValue(value);

  field.append(labelEl, valueEl);
  return field;
}

function renderClientProgramProgress(client) {
  const section = document.createElement("section");
  section.className = "panel client-program-panel";

  const header = document.createElement("div");
  header.className = "client-program-header";
  const title = document.createElement("h3");
  title.textContent = "Program Progress";
  header.append(title);

  const appointments = clientAppointments(client);
  const completedIndex = clientCompletedLessonIndex(client);

  const lessonDots = document.createElement("div");
  lessonDots.className = "lesson-dots";

  const items = [
    { key: "enrollment", label: "Enroll", done: completedIndex >= 0, value: "enrollment" },
    ...Array.from({ length: 7 }, (_, index) => {
      const lesson = index + 1;
      return { key: `lesson-${lesson}`, label: `L${lesson}`, done: completedIndex >= lesson, value: `lesson-${lesson}` };
    })
  ];
  const firstPendingIndex = items.findIndex((item) => !item.done);

  items.forEach((item, index) => {
    const dot = document.createElement("button");
    dot.className = "lesson-dot";
    dot.type = "button";
    dot.style.setProperty("--lesson-accent", profileLessonAccent(index));
    dot.title = `Set current progress to ${item.label}`;
    if (item.done) {
      dot.classList.add("done");
    } else if (index === firstPendingIndex) {
      dot.classList.add("next");
    }

    const label = document.createElement("strong");
    label.textContent = item.label;
    const state = document.createElement("span");
    state.textContent = item.done ? "Done" : index === firstPendingIndex ? "Next" : "";
    dot.append(label, state);
    dot.addEventListener("click", () => updateClientCurrentLesson(client, item.value));
    lessonDots.append(dot);
  });

  const goals = document.createElement("div");
  goals.className = "goals-list";
  const goalsTitle = document.createElement("h4");
  goalsTitle.className = "program-goals-title";
  goalsTitle.textContent = "Goals";
  const goalsByKey = new Map();
  appointments.forEach((appointment, index) => {
    const goal = appointmentGoalText(appointment).trim();
    if (!goal) {
      return;
    }

    const lessonNumber = Number(appointment.lesson);
    const hasLesson = Number.isFinite(lessonNumber) && lessonNumber > 0;
    const key = hasLesson ? `lesson-${lessonNumber}` : `appointment-${appointment.id || index}`;
    goalsByKey.set(key, {
      label: hasLesson ? `Lesson ${lessonNumber}` : `Appointment ${index + 1}`,
      goal,
      lessonSort: hasLesson ? lessonNumber : 99,
      appointmentDate: appointment.appointmentDate || "",
      appointmentTime: appointment.appointmentTime || ""
    });
  });

  const appointmentGoals = Array.from(goalsByKey.values())
    .sort(
      (first, second) =>
        first.lessonSort - second.lessonSort ||
        dateValue(first.appointmentDate, 1) - dateValue(second.appointmentDate, 1) ||
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime)
    )
    .slice(0, 8);

  if (!appointmentGoals.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No goals added yet.";
    goals.append(empty);
  }

  for (const item of appointmentGoals) {
    const row = document.createElement("div");
    row.className = "goal-row";
    const labelEl = document.createElement("span");
    labelEl.textContent = item.label;
    const goalEl = document.createElement("strong");
    goalEl.textContent = item.goal;
    row.append(labelEl, goalEl);
    goals.append(row);
  }

  section.append(header, lessonDots, goalsTitle, goals);
  return section;
}

function profileLessonAccent(index) {
  const accents = [
    "var(--muted)",
    "var(--brand-red)",
    "var(--brand-orange)",
    "var(--brand-yellow)",
    "var(--brand-green)",
    "var(--brand-teal)",
    "var(--brand-blue)",
    "var(--brand-purple)"
  ];
  return accents[index % accents.length];
}

function hasProfileValue(value) {
  const text = String(value || "").trim();
  return text !== "" && text !== "-";
}

function renderProfileDetailCard(titleText, rows, accent) {
  const card = document.createElement("div");
  card.className = "idea-card profile-detail-card";
  card.style.setProperty("--idea-accent", accent);

  const title = document.createElement("strong");
  title.textContent = titleText;
  card.append(title);

  const detailList = document.createElement("div");
  detailList.className = "profile-detail-lines";

  for (const row of rows) {
    const value = row.value;
    const hasValue = row.alwaysShow || (value instanceof Node ? true : hasProfileValue(value));

    if (!hasValue) {
      continue;
    }

    const line = document.createElement("div");
    line.className = "profile-detail-line";
    const label = document.createElement("span");
    label.textContent = row.label;
    const detail = document.createElement("strong");

    if (value instanceof Node) {
      detail.append(value);
    } else if (hasProfileValue(value)) {
      detail.textContent = value;
    } else if (row.alwaysShow) {
      detail.textContent = "-";
    } else {
      detail.textContent = "";
    }

    line.append(label, detail);
    detailList.append(line);
  }

  if (!detailList.children.length) {
    const empty = document.createElement("span");
    empty.className = "empty-inline";
    empty.textContent = "No details yet.";
    detailList.append(empty);
  }

  card.append(detailList);
  return card;
}

function renderProfileCheckboxList(items) {
  const list = document.createElement("div");
  list.className = "profile-check-list";

  for (const item of items) {
    const row = document.createElement("div");
    row.className = "profile-check-line";
    const state = document.createElement("strong");
    state.textContent = truthyProfileValue(item.value) ? "✓" : "-";
    const text = document.createElement("span");
    text.textContent = item.label;
    row.append(state, text);
    list.append(row);
  }

  return list;
}

function providerLinksForDisplay(record) {
  return Array.isArray(record.providerLinks) ? record.providerLinks : [];
}

function providerSourceMatchKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function providerLinkMatchesSource(source, link) {
  const sourceKey = providerSourceMatchKey(source);
  if (!sourceKey || !link) {
    return false;
  }

  const providerKey = providerSourceMatchKey(link.providerName);
  const organizationKey = providerSourceMatchKey(link.organizationName);
  const labelKey = providerSourceMatchKey(link.label || `${link.providerName || ""} ${link.organizationName || ""}`);
  const keys = [providerKey, organizationKey, labelKey].filter(Boolean);

  return keys.some((key) => key === sourceKey || key.includes(sourceKey) || sourceKey.includes(key));
}

function findReferralSourceProviderLink(record) {
  const source = record?.referralSource;
  const linkedMatch = providerLinksForDisplay(record).find((link) => providerLinkMatchesSource(source, link));

  if (linkedMatch) {
    return linkedMatch;
  }

  return loadedNetworkEntries.flatMap((entry) =>
    (entry.providers || []).map((provider) => ({
      networkId: entry.id,
      providerId: provider.id,
      organizationName: networkEntryName(entry),
      providerName: networkProviderName(provider),
      label: `${networkProviderName(provider)} (${networkEntryName(entry)})`
    }))
  ).find((link) => providerLinkMatchesSource(source, link)) || null;
}

function openReferralSourceProvider(link) {
  if (!link?.networkId) {
    return;
  }

  setCrmView("referral-network");
  setSelectedNetworkEntry(link.networkId);
}

function renderReferralSourceValue(record) {
  const source = record?.referralSource;
  const link = findReferralSourceProviderLink(record);

  if (!link) {
    return source;
  }

  const button = document.createElement("button");
  button.className = "link-button profile-name-button profile-source-link";
  button.type = "button";
  button.textContent = source || link.providerName || link.organizationName || "Provider profile";
  button.title = "Open provider profile";
  button.addEventListener("click", () => openReferralSourceProvider(link));
  return button;
}

function renderReferralSourceField(record) {
  const field = document.createElement("div");
  field.className = "client-profile-field profile-linked-field";

  const label = document.createElement("span");
  label.textContent = "Referral Source";

  const list = document.createElement("div");
  list.className = "profile-linked-list";
  const value = renderReferralSourceValue(record);

  if (value instanceof Node) {
    list.append(value);
  } else {
    const source = document.createElement("strong");
    source.textContent = hasProfileValue(value) ? value : "None linked yet";
    list.append(source);
  }

  field.append(label, list);
  return field;
}

function renderProfileLinkedField(record, moduleName, kind) {
  const isSiblings = kind === "siblings";
  const field = document.createElement("div");
  field.className = "client-profile-field profile-linked-field";

  const labelEl = document.createElement("span");
  labelEl.textContent = isSiblings ? "Siblings" : "Provider Profiles";
  field.append(labelEl);

  const list = document.createElement("div");
  list.className = "profile-linked-list";

  if (isSiblings) {
    const records = moduleName === "clients" ? loadedClients : loadedReferrals;
    const getName = moduleName === "clients" ? clientName : referralName;
    const selectRecord = moduleName === "clients" ? setSelectedClient : setSelectedReferral;
    const siblingIds = Array.isArray(record.siblingIds) ? record.siblingIds : [];
    const siblings = siblingIds.map((id) => records.find((item) => item.id === id)).filter(Boolean);
    const linkedIds = new Set([record.id, ...siblingIds]);
    const candidates = records
      .filter((item) => !linkedIds.has(item.id))
      .sort((first, second) => getName(first).localeCompare(getName(second)));

    if (!siblings.length) {
      const empty = document.createElement("strong");
      empty.textContent = "None linked yet";
      list.append(empty);
    }

    for (const sibling of siblings) {
      const openButton = document.createElement("button");
      openButton.className = "link-button profile-name-button";
      openButton.type = "button";
      openButton.textContent = getName(sibling);
      openButton.addEventListener("click", () => selectRecord(sibling.id));
      list.append(openButton);
    }

    const addButton = document.createElement("button");
    addButton.className = "secondary-button compact-button profile-add-button";
    addButton.type = "button";
    addButton.textContent = "Add Sibling";
    addButton.disabled = !candidates.length;
    addButton.addEventListener("click", () => openSiblingModal(record, moduleName));
    field.append(list, addButton);
    return field;
  }

  const links = providerLinksForDisplay(record);
  if (!links.length) {
    const empty = document.createElement("strong");
    empty.textContent = "None linked yet";
    list.append(empty);
  }

  for (const link of links) {
    const name = document.createElement("strong");
    name.textContent = `${link.providerName} (${link.organizationName})`;
    list.append(name);
  }

  field.append(list);
  return field;
}

function renderFormsPlaceholderField() {
  const field = document.createElement("div");
  field.className = "client-profile-field profile-linked-field";
  const label = document.createElement("span");
  label.textContent = "Forms";
  const button = document.createElement("button");
  button.className = "secondary-button compact-button profile-add-button";
  button.type = "button";
  button.textContent = "Forms";
  button.disabled = true;
  field.append(label, button);
  return field;
}

function renderProfileLinkForm(placeholderText, options, getLabel, onSubmit, getValue = (item) => item.id) {
  const form = document.createElement("form");
  form.className = "profile-linked-form";

  const select = document.createElement("select");
  select.setAttribute("aria-label", placeholderText);
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = options.length ? placeholderText : "No matches available";
  select.append(placeholder);

  for (const optionItem of options) {
    const option = document.createElement("option");
    option.value = getValue(optionItem);
    option.textContent = getLabel(optionItem);
    select.append(option);
  }

  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add";
  addButton.disabled = !options.length;
  select.disabled = !options.length;
  form.append(select, addButton);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (select.value) {
      onSubmit(select.value);
    }
  });
  return form;
}

function renderClientDetailsPanel(client) {
  const section = document.createElement("section");
  section.className = "panel client-ideas-panel";

  const title = document.createElement("h3");
  title.textContent = "Client Details";

  const list = document.createElement("div");
  list.className = "idea-list";
  const convertedDate = client.convertedAt || (client.sourceReferralId ? client.createdAt : "");
  const ideas = [
    renderProfileDetailCard("Referral", [
      { label: "Type", value: client.referralType, alwaysShow: true },
      { label: "Referral date", value: profileDate(client.referralDate) },
      { label: "Converted date", value: formatDateOnly(String(convertedDate || "").slice(0, 10)), alwaysShow: true }
    ], "var(--brand-green)"),
    renderProfileDetailCard("Contact", [
      { label: "Preferred", value: client.preferredContactMethod },
      { label: "First contact", value: profileDate(client.firstContactDate) },
      { label: "Email", value: client.email },
      { label: "Email opt out", value: truthyProfileValue(client.emailOptOut) ? "✓" : "", alwaysShow: true },
      { label: "Text opt out", value: truthyProfileValue(client.textOptOut) ? "✓" : "", alwaysShow: true },
      { label: "Address", value: formatAddress(client) }
    ], "var(--brand-teal)"),
    renderProfileDetailCard("Insurance", [
      { label: "YCCO", value: truthyProfileValue(client.ycco) ? "✓" : "", alwaysShow: true },
      { label: "HRSN", value: truthyProfileValue(client.hrsn) ? "✓" : "", alwaysShow: true }
    ], "var(--brand-yellow)"),
    renderProfileDetailCard("Assessment", [
      { label: "Assessment score", value: client.assessmentScore },
      { label: "Willingness score", value: client.willingnessScore }
    ], "var(--brand-purple)")
  ];

  for (const idea of ideas) {
    list.append(idea);
  }

  section.append(title, list);
  return section;
}

function profileActivityLogs(record, moduleName) {
  const relatedType = moduleName === "referrals" ? "referral" : "client";
  return loadedActivityLogs
    .filter((log) => log.relatedType === relatedType && log.relatedId === record.id)
    .map((log) => ({
      title: log.title || `${log.direction || "Outbound"} ${log.type || "Activity"}`,
      detail: [log.result, log.description].filter(Boolean).length
        ? [log.result, log.description].filter(Boolean)
        : displayValue(log.type),
      date: log.activityDate || String(log.occurredAt || "").slice(0, 10),
      sortKey: activityLogTimestamp(log)
    }));
}

function renderClientRecentActivity(client) {
  const section = document.createElement("section");
  section.className = "panel client-activity-panel";

  const title = document.createElement("h3");
  title.textContent = "Recent Activity";

  const list = document.createElement("div");
  list.className = "mini-list";
  const appointmentItems = [...clientAppointments(client)]
    .sort((first, second) => dateValue(second.appointmentDate, -1) - dateValue(first.appointmentDate, -1))
    .slice(0, 4)
    .map((appointment) => ({
      title: appointment.status === "Completed" ? "Appointment completed" : "Appointment scheduled",
      detail: appointmentGoalText(appointment) || appointmentLessonLabel(appointment) || "Enrollment appointment",
      date: appointment.appointmentDate,
      sortKey: `${appointment.appointmentDate || ""}T${appointment.appointmentTime || "00:00"}`
    }));

  const fallbackItems = [
    {
      title: "Status changed",
      detail: `${client.status || "Scheduled"}`,
      date: client.mostRecentContactDate || client.firstAppointmentDate || client.createdAt,
      sortKey: client.mostRecentContactDate || client.firstAppointmentDate || client.createdAt || ""
    }
  ];

  const activityItems = profileActivityLogs(client, "clients");
  const items = [...activityItems, ...appointmentItems]
    .sort((first, second) => String(second.sortKey || "").localeCompare(String(first.sortKey || "")))
    .slice(0, 5);

  for (const item of (items.length ? items : fallbackItems)) {
    list.append(renderClientActivityRow(item.title, item.detail, item.date));
  }

  section.append(title, list);
  return section;
}

function renderClientAppointmentsPanel(client) {
  return renderProfileAppointmentsPanel(clientAppointments(client));
}

function renderReferralAppointmentsPanel(referral) {
  return renderProfileAppointmentsPanel(referralAppointments(referral));
}

function renderProfileAppointmentsPanel(appointments) {
  const section = document.createElement("section");
  section.className = "panel client-appointments-panel";

  const header = document.createElement("div");
  header.className = "client-program-header";
  const title = document.createElement("h3");
  title.textContent = "Appointments";
  const count = document.createElement("span");
  count.className = "client-current-lesson";
  count.textContent = `${appointments.length} total`;
  header.append(title, count);

  const today = todayDateString();
  const upcoming = appointments
    .filter((appointment) => appointment.appointmentDate >= today && appointment.status === "Scheduled")
    .slice(0, 3);
  const past = [...appointments]
    .filter((appointment) => appointment.appointmentDate < today || appointment.status !== "Scheduled")
    .sort((first, second) => dateValue(second.appointmentDate, -1) - dateValue(first.appointmentDate, -1))
    .slice(0, 5);

  section.append(header);
  section.append(renderClientAppointmentGroup("Upcoming", upcoming, "No upcoming appointment."));
  section.append(renderClientAppointmentGroup("History", past, "No appointment history yet."));
  return section;
}

function renderClientAppointmentGroup(titleText, appointments, emptyText) {
  const group = document.createElement("div");
  group.className = "client-appointment-group";

  const title = document.createElement("h4");
  title.textContent = titleText;
  group.append(title);

  if (!appointments.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = emptyText;
    group.append(empty);
    return group;
  }

  for (const appointment of appointments) {
    const row = document.createElement("button");
    row.className = "client-appointment-row";
    row.type = "button";
    row.addEventListener("click", () => {
      closeClientModal();
      setActiveModule("scheduling");
      setSelectedAppointment(appointment.id);
    });

    const copy = document.createElement("span");
    const title = document.createElement("strong");
    title.textContent = [
      profileDate(appointment.appointmentDate),
      formatAppointmentTime(appointment.appointmentTime)
    ].filter(Boolean).join(" ");
    const detail = document.createElement("span");
    detail.textContent = [
      appointmentLessonLabel(appointment) || "Enrollment",
      appointmentGoalText(appointment) || appointment.notes || ""
    ].filter(Boolean).join(" | ");
    copy.append(title, detail);

    row.append(copy, appointmentStatusBadge(appointment.status));
    group.append(row);
  }

  return group;
}

function renderClientActivityRow(titleText, detailText, dateValueText) {
  const row = document.createElement("div");
  row.className = "mini-row";
  const copy = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = titleText;
  copy.append(title);

  for (const detailValue of (Array.isArray(detailText) ? detailText : [detailText]).filter(Boolean)) {
    const detail = document.createElement("span");
    detail.textContent = detailValue;
    copy.append(detail);
  }

  const date = document.createElement("span");
  date.className = "pill";
  date.textContent = profileDate(String(dateValueText || "").slice(0, 10));
  row.append(copy, date);
  return row;
}

function renderReferralProfileHero(referral) {
  const hero = document.createElement("section");
  hero.className = "panel client-profile-hero";

  const top = document.createElement("div");
  top.className = "client-person-top";

  const avatar = document.createElement("div");
  avatar.className = "client-avatar referral-avatar";
  avatar.textContent = recordInitials(referralName(referral));

  const copy = document.createElement("div");
  const lines = document.createElement("div");
  lines.className = "client-contact-lines";
  for (const value of [
    `Caregiver: ${displayValue(referral.parentName)}`,
    `Phone: ${displayValue(formatPhone(referral.phone))}`,
    `Recent Contact: ${profileDate(referral.mostRecentContactDate)}`
  ]) {
    const line = document.createElement("span");
    line.textContent = value;
    lines.append(line);
  }

  copy.append(lines);
  top.append(avatar, copy);

  const fields = document.createElement("div");
  fields.className = "client-field-grid";
  for (const [label, value] of [
    ["Referral date", profileDate(referral.referralDate)],
    ["Date of birth", profileDate(referral.dateOfBirth)],
    ["First appointment", profileDate(referral.firstAppointmentDate)],
    ["Language", displayValue(referral.preferredLanguage)]
  ]) {
    fields.append(renderClientProfileField(label, value));
  }

  hero.append(top, fields);
  return hero;
}

function referralProgressIndex(referral) {
  if (referral.convertedClientId) {
    return 3;
  }

  const status = normalizeStatus(referral.status);
  if (["Not Interested", "Closed / No Further Outreach"].includes(status)) {
    return 3;
  }

  if (status === "Scheduled") {
    return 2;
  }

  if (["Texted", "Left Voicemail", "Emailed", "Requested Call Back", "Caregiver Will Call Back"].includes(status)) {
    return 1;
  }

  return 0;
}

function renderReferralProgressPanel(referral) {
  const section = document.createElement("section");
  section.className = "panel client-program-panel referral-progress-panel";

  const header = document.createElement("div");
  header.className = "client-program-header";
  const title = document.createElement("h3");
  title.textContent = "Referral Progress";
  header.append(title);

  const steps = document.createElement("div");
  steps.className = "lesson-dots referral-progress-dots";
  const currentIndex = referralProgressIndex(referral);
  const items = [
    { label: "New", status: "New", accent: "var(--brand-red)" },
    { label: "Contacted", status: "Texted", accent: "var(--brand-green)" },
    { label: "Scheduled", status: "Scheduled", accent: "var(--brand-blue)" },
    { label: "Closed", status: "Closed / No Further Outreach", accent: "var(--muted)" }
  ];

  items.forEach((item, index) => {
    const dot = document.createElement("button");
    dot.className = "lesson-dot referral-progress-dot";
    dot.type = "button";
    dot.style.setProperty("--lesson-accent", item.accent);
    if (index < currentIndex || (index === currentIndex && currentIndex === items.length - 1)) {
      dot.classList.add("done");
    } else if (index === currentIndex) {
      dot.classList.add("next");
    }

    const label = document.createElement("strong");
    label.textContent = item.label;
    const state = document.createElement("span");
    state.textContent = index < currentIndex || (index === currentIndex && currentIndex === items.length - 1)
      ? "Done"
      : index === currentIndex
        ? "Current"
        : "";
    dot.append(label, state);
    dot.disabled = Boolean(referral.convertedClientId);
    dot.addEventListener("click", () => updateReferralStatus(referral, item.status));
    steps.append(dot);
  });

  section.append(header, steps);
  return section;
}

function renderReferralDetailsPanel(referral) {
  const section = document.createElement("section");
  section.className = "panel client-ideas-panel";

  const title = document.createElement("h3");
  title.textContent = "Referral Details";

  const list = document.createElement("div");
  list.className = "idea-list";
  const ideas = [
    renderProfileDetailCard("Referral", [
      { label: "Type", value: referral.referralType },
      { label: "Referral date", value: profileDate(referral.referralDate) }
    ], "var(--brand-green)"),
    renderProfileDetailCard("Contact", [
      { label: "Preferred", value: referral.preferredContactMethod },
      { label: "First contact", value: profileDate(referral.firstContactDate) },
      { label: "Email", value: referral.email },
      { label: "Email opt out", value: truthyProfileValue(referral.emailOptOut) ? "✓" : "", alwaysShow: true },
      { label: "Text opt out", value: truthyProfileValue(referral.textOptOut) ? "✓" : "", alwaysShow: true },
      { label: "Address", value: formatAddress(referral) }
    ], "var(--brand-teal)"),
    renderProfileDetailCard("Insurance", [
      { label: "YCCO", value: truthyProfileValue(referral.ycco) ? "✓" : "", alwaysShow: true },
      { label: "HRSN", value: truthyProfileValue(referral.hrsn) ? "✓" : "", alwaysShow: true }
    ], "var(--brand-yellow)"),
    renderProfileDetailCard("Assessment", [
      { label: "Assessment score", value: referral.assessmentScore },
      { label: "Willingness score", value: referral.willingnessScore }
    ], "var(--brand-purple)")
  ];

  for (const idea of ideas) {
    list.append(idea);
  }

  section.append(title, list);
  return section;
}

function renderReferralRecentActivity(referral) {
  const section = document.createElement("section");
  section.className = "panel client-activity-panel";

  const title = document.createElement("h3");
  title.textContent = "Recent Activity";

  const list = document.createElement("div");
  list.className = "mini-list";
  const appointmentItems = [...referralAppointments(referral)]
    .sort(
      (first, second) =>
        dateValue(second.appointmentDate, -1) - dateValue(first.appointmentDate, -1) ||
        appointmentTimeValue(second.appointmentTime) - appointmentTimeValue(first.appointmentTime)
    )
    .slice(0, 2)
    .map((appointment) => ({
      title: appointment.status === "Completed" ? "Appointment completed" : "Appointment scheduled",
      detail: appointmentGoalText(appointment) || appointmentLessonLabel(appointment) || "Enrollment appointment",
      date: appointment.appointmentDate,
      sortKey: `${appointment.appointmentDate || ""}T${appointment.appointmentTime || "00:00"}`
    }));
  const fallbackItems = [
    {
      title: "Referral status",
      detail: normalizeStatus(referral.status),
      date: referral.mostRecentContactDate || referral.referralDate || referral.createdAt,
      sortKey: referral.mostRecentContactDate || referral.referralDate || referral.createdAt || ""
    },
    {
      title: "Referral received",
      detail: displayValue(referral.referralSource),
      date: referral.referralDate || referral.createdAt,
      sortKey: referral.referralDate || referral.createdAt || ""
    },
    {
      title: "Appointment activity",
      detail: appointmentItems.length || referral.firstAppointmentDate ? "First appointment scheduled" : "No appointment yet",
      date: appointmentItems[0]?.date || referral.mostRecentAppointmentDate || referral.firstAppointmentDate,
      sortKey: appointmentItems[0]?.sortKey || referral.mostRecentAppointmentDate || referral.firstAppointmentDate || ""
    }
  ];
  const activityItems = profileActivityLogs(referral, "referrals");
  const items = activityItems.length
    ? [...activityItems, ...appointmentItems, ...fallbackItems].sort((first, second) => String(second.sortKey || "").localeCompare(String(first.sortKey || ""))).slice(0, 5)
    : [...fallbackItems.slice(0, 2), ...(appointmentItems.length ? appointmentItems : [fallbackItems[2]])];

  for (const item of items) {
    list.append(renderClientActivityRow(item.title, item.detail, item.date));
  }

  section.append(title, list);
  return section;
}

function renderClientProfileV2Side(client, statusSelect) {
  const side = document.createElement("aside");
  side.className = "profile-v2-side";

  const titleWrap = document.createElement("div");
  titleWrap.className = "profile-v2-title";
  const status = document.createElement("span");
  status.className = "profile-v2-status";
  status.textContent = profileV2StatusLabel(client.status, "Scheduled");
  const title = document.createElement("h2");
  title.textContent = clientName(client);
  titleWrap.append(status, title);

  const meta = document.createElement("div");
  meta.className = "profile-v2-meta";
  meta.append(
    profileV2MetaRow("First appointment", profileDate(client.firstAppointmentDate)),
    profileV2MetaRow("Recent contact", profileDate(client.mostRecentContactDate)),
    profileV2MetaRow("Caregiver", client.parentName)
  );

  const family = document.createElement("section");
  family.className = "profile-v2-side-section";
  const familyTitle = document.createElement("h3");
  familyTitle.textContent = "Family";
  family.append(
    familyTitle,
    profileV2SideInfo("Caregiver", client.parentName),
    profileV2SideInfo("Siblings", profileV2Siblings(client, "clients")),
    profileV2SideInfo("Language", client.preferredLanguage),
    profileV2SideInfo("Phone", formatPhone(client.phone)),
    profileV2SideInfo("Address", formatAddress(client))
  );

  const program = document.createElement("section");
  program.className = "profile-v2-side-section";
  const programTitle = document.createElement("h3");
  programTitle.textContent = "Program";
  program.append(
    programTitle,
    profileV2SideInfo("Status", statusSelect),
    profileV2SideInfo("Current stage", currentLessonLabel(client)),
    profileV2SideInfo("Provider profiles", providerLinksForDisplay(client).length
      ? providerLinksForDisplay(client).map((link) => `${link.providerName} (${link.organizationName})`).join(", ")
      : "None linked yet")
  );

  side.append(titleWrap, meta, family, program);
  return side;
}

function renderReferralProfileV2Side(referral, statusSelect) {
  const side = document.createElement("aside");
  side.className = "profile-v2-side";

  const titleWrap = document.createElement("div");
  titleWrap.className = "profile-v2-title";
  const status = document.createElement("span");
  status.className = "profile-v2-status";
  status.textContent = profileV2StatusLabel(normalizeStatus(referral.status), "New");
  const title = document.createElement("h2");
  title.textContent = referralName(referral);
  titleWrap.append(status, title);

  const meta = document.createElement("div");
  meta.className = "profile-v2-meta";
  meta.append(
    profileV2MetaRow("Referral date", profileDate(referral.referralDate)),
    profileV2MetaRow("Recent contact", profileDate(referral.mostRecentContactDate)),
    profileV2MetaRow("Caregiver", referral.parentName)
  );

  const family = document.createElement("section");
  family.className = "profile-v2-side-section";
  const familyTitle = document.createElement("h3");
  familyTitle.textContent = "Family";
  family.append(
    familyTitle,
    profileV2SideInfo("Caregiver", referral.parentName),
    profileV2SideInfo("Siblings", profileV2Siblings(referral, "referrals")),
    profileV2SideInfo("Language", referral.preferredLanguage),
    profileV2SideInfo("Phone", formatPhone(referral.phone)),
    profileV2SideInfo("Address", formatAddress(referral))
  );

  const referralInfo = document.createElement("section");
  referralInfo.className = "profile-v2-side-section";
  const referralTitle = document.createElement("h3");
  referralTitle.textContent = "Referral";
  referralInfo.append(
    referralTitle,
    profileV2SideInfo("Status", statusSelect),
    profileV2SideInfo("Source", renderReferralSourceValue(referral) || "None linked yet"),
    profileV2SideInfo("Type", referral.referralType)
  );

  side.append(titleWrap, meta, family, referralInfo);
  return side;
}

function renderClientLessonProgressionCard(client) {
  const card = document.createElement("section");
  card.className = "profile-v2-card";

  const header = document.createElement("div");
  header.className = "profile-v2-card-header";
  const title = document.createElement("h3");
  title.textContent = "Lesson Progression";
  const edit = document.createElement("button");
  edit.className = "profile-v2-edit";
  edit.type = "button";
  edit.textContent = "Edit";
  edit.addEventListener("click", () => startEditingClient(client));
  header.append(title, edit);

  const completedIndex = clientCompletedLessonIndex(client);
  const items = [
    { label: "Enroll", value: "enrollment", done: completedIndex >= 0 },
    ...Array.from({ length: 7 }, (_, index) => {
      const lesson = index + 1;
      return {
        label: appointmentLessonTitles[lesson],
        value: `lesson-${lesson}`,
        done: completedIndex >= lesson
      };
    })
  ];
  const firstPendingIndex = items.findIndex((item) => !item.done);
  const progress = document.createElement("div");
  progress.className = "profile-v2-progress";
  items.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "profile-v2-step";
    button.type = "button";
    button.style.setProperty("--step-color", profileLessonAccent(index));
    if (item.done) {
      button.classList.add("done");
    } else if (index === firstPendingIndex) {
      button.classList.add("next");
    }
    const label = document.createElement("strong");
    label.textContent = item.label;
    const state = document.createElement("span");
    state.textContent = item.done ? "Done" : index === firstPendingIndex ? "Next" : "-";
    button.append(label, state);
    button.addEventListener("click", () => updateClientCurrentLesson(client, item.value));
    progress.append(button);
  });

  card.append(header, progress);
  return card;
}

function renderReferralProgressV2Card(referral) {
  const card = document.createElement("section");
  card.className = "profile-v2-card";

  const header = document.createElement("div");
  header.className = "profile-v2-card-header";
  const title = document.createElement("h3");
  title.textContent = "Referral Pipeline";
  const edit = document.createElement("button");
  edit.className = "profile-v2-edit";
  edit.type = "button";
  edit.textContent = "Edit";
  edit.addEventListener("click", () => startEditingReferral(referral));
  header.append(title, edit);

  const currentIndex = referralProgressIndex(referral);
  const items = [
    { label: "New", status: "New", accent: "var(--brand-red)" },
    { label: "Contacted", status: "Texted", accent: "var(--brand-green)" },
    { label: "Scheduled", status: "Scheduled", accent: "var(--brand-blue)" },
    { label: "Closed", status: "Closed / No Further Outreach", accent: "var(--muted)" }
  ];
  const progress = document.createElement("div");
  progress.className = "profile-v2-progress profile-v2-referral-progress";
  items.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "profile-v2-step";
    button.type = "button";
    button.style.setProperty("--step-color", item.accent);
    if (index < currentIndex || (index === currentIndex && currentIndex === items.length - 1)) {
      button.classList.add("done");
    } else if (index === currentIndex) {
      button.classList.add("next");
    }
    const label = document.createElement("strong");
    label.textContent = item.label;
    const state = document.createElement("span");
    state.textContent = index < currentIndex || (index === currentIndex && currentIndex === items.length - 1)
      ? "Done"
      : index === currentIndex
        ? "Current"
        : "-";
    button.append(label, state);
    button.disabled = Boolean(referral.convertedClientId);
    button.addEventListener("click", () => updateReferralStatus(referral, item.status));
    progress.append(button);
  });

  card.append(header, progress);
  return card;
}

function renderProfileV2NotesCard(notesValue, onEdit) {
  const card = document.createElement("section");
  card.className = "profile-v2-card";
  const header = document.createElement("div");
  header.className = "profile-v2-card-header";
  const title = document.createElement("h3");
  title.textContent = "Notes";
  const edit = document.createElement("button");
  edit.className = "profile-v2-edit";
  edit.type = "button";
  edit.textContent = "Edit";
  edit.addEventListener("click", onEdit);
  header.append(title, edit);
  const note = document.createElement("div");
  note.className = "profile-v2-note";
  note.textContent = notesValue || "-";
  card.append(header, note);
  return card;
}

function renderProfileV2AppointmentsCard(appointments, onNewAppointment) {
  const card = document.createElement("section");
  card.className = "profile-v2-card";
  const header = document.createElement("div");
  header.className = "profile-v2-card-header";
  const title = document.createElement("h3");
  title.textContent = "Appointments";
  const button = document.createElement("button");
  button.className = "profile-v2-edit";
  button.type = "button";
  button.textContent = "New Appt";
  button.addEventListener("click", onNewAppointment);
  header.append(title, button);

  const list = document.createElement("div");
  list.className = "profile-v2-appointment-list";
  const sorted = [...appointments].sort(
    (first, second) =>
      dateValue(second.appointmentDate, -1) - dateValue(first.appointmentDate, -1) ||
      appointmentTimeValue(second.appointmentTime) - appointmentTimeValue(first.appointmentTime)
  );

  for (const appointment of sorted.slice(0, 10)) {
    const row = document.createElement("button");
    row.className = "profile-v2-appointment";
    row.type = "button";
    row.addEventListener("click", () => {
      closeClientModal();
      closeReferralModal();
      setActiveModule("scheduling");
      setSelectedAppointment(appointment.id);
    });
    const copy = document.createElement("div");
    const rowTitle = document.createElement("strong");
    rowTitle.textContent = [
      profileDate(appointment.appointmentDate),
      formatAppointmentTime(appointment.appointmentTime)
    ].filter(Boolean).join(" ");
    const detail = document.createElement("span");
    detail.textContent = [
      appointmentLessonLabel(appointment) || appointmentTypeLabel(appointment),
      appointmentGoalText(appointment) || appointmentNotesText(appointment)
    ].filter(Boolean).join(" | ");
    copy.append(rowTitle, detail);
    row.append(copy, appointmentStatusBadge(appointment.status));
    list.append(row);
  }

  if (!list.children.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No appointments yet.";
    list.append(empty);
  }

  card.append(header, list);
  return card;
}

function renderClientProfileV2Body(client, tab, actions) {
  const body = document.createElement("div");
  body.className = "profile-v2-tab-body";
  const convertedDate = client.convertedAt || (client.sourceReferralId ? client.createdAt : "");

  if (tab === "notes") {
    body.append(renderProfileV2NotesCard(client.notes, () => startEditingClient(client)));
    return body;
  }

  if (tab === "activity") {
    const appointmentItems = clientAppointments(client).map((appointment) => ({
      title: appointment.status === "Completed" ? "Appointment completed" : "Appointment scheduled",
      detail: appointmentGoalText(appointment) || appointmentLessonLabel(appointment) || appointmentTypeLabel(appointment),
      date: appointment.appointmentDate,
      sortKey: `${appointment.appointmentDate || ""}T${appointment.appointmentTime || "00:00"}`
    }));
    body.append(renderProfileV2ActivityCard(client, "clients", appointmentItems, () => openActivityLogModal(client, "clients", "Call")));
    return body;
  }

  if (tab === "appointments") {
    body.append(renderProfileV2AppointmentsCard(clientAppointments(client), actions.newAppointment));
    return body;
  }

  if (tab === "forms") {
    body.append(renderProfileV2FormsCard("client"));
    return body;
  }

  body.append(
    renderProfileV2Card("Snapshot", [
      { label: "Date of birth", value: profileDate(client.dateOfBirth) },
      { label: "Language", value: client.preferredLanguage },
      { label: "First appointment", value: profileDate(client.firstAppointmentDate) },
      { label: "Most recent appointment", value: profileDate(mostRecentAppointmentDate(client)) },
      { label: "Graduation date", value: profileDate(client.lastAppointmentDate, "Not graduated") },
      { label: "Insurance", value: truthyProfileValue(client.ycco) ? "YCCO" : "-" }
    ], { label: "Edit", onClick: () => startEditingClient(client) }),
    renderClientLessonProgressionCard(client),
    renderProfileV2Card("Referral", [
      { label: "Referral date", value: profileDate(client.referralDate) },
      { label: "Referral type", value: client.referralType },
      { label: "Referral source", value: renderReferralSourceValue(client) || "None linked yet" },
      { label: "Converted date", value: formatDateOnly(String(convertedDate || "").slice(0, 10)) || "-" }
    ], { label: "Edit", onClick: () => startEditingClient(client) })
  );
  return body;
}

function renderReferralProfileV2Body(referral, tab, actions) {
  const body = document.createElement("div");
  body.className = "profile-v2-tab-body";

  if (tab === "notes") {
    body.append(renderProfileV2NotesCard(referral.notes, () => startEditingReferral(referral)));
    return body;
  }

  if (tab === "activity") {
    const appointmentItems = referralAppointments(referral).map((appointment) => ({
      title: appointment.status === "Completed" ? "Appointment completed" : "Appointment scheduled",
      detail: appointmentGoalText(appointment) || appointmentLessonLabel(appointment) || appointmentTypeLabel(appointment),
      date: appointment.appointmentDate,
      sortKey: `${appointment.appointmentDate || ""}T${appointment.appointmentTime || "00:00"}`
    }));
    body.append(renderProfileV2ActivityCard(referral, "referrals", appointmentItems, () => openActivityLogModal(referral, "referrals", "Call")));
    return body;
  }

  if (tab === "appointments") {
    body.append(renderProfileV2AppointmentsCard(referralAppointments(referral), actions.newAppointment));
    return body;
  }

  if (tab === "forms") {
    body.append(renderProfileV2FormsCard("referral"));
    return body;
  }

  body.append(
    renderProfileV2Card("Snapshot", [
      { label: "Date of birth", value: profileDate(referral.dateOfBirth) },
      { label: "Language", value: referral.preferredLanguage },
      { label: "Referral date", value: profileDate(referral.referralDate) },
      { label: "First contact", value: profileDate(referral.firstContactDate) },
      { label: "Recent contact", value: profileDate(referral.mostRecentContactDate) },
      { label: "Insurance", value: truthyProfileValue(referral.ycco) ? "YCCO" : "-" }
    ], { label: "Edit", onClick: () => startEditingReferral(referral) }),
    renderReferralProgressV2Card(referral),
    renderProfileV2Card("Referral Source", [
      { label: "Referral source", value: renderReferralSourceValue(referral) || "None linked yet" },
      { label: "Referral type", value: referral.referralType },
      { label: "Preferred contact", value: referral.preferredContactMethod, className: "wide" }
    ], { label: "Edit", onClick: () => startEditingReferral(referral) })
  );
  return body;
}

function renderReferralDetail() {
  if (!referralForm.hidden) {
    referralDetail.hidden = true;
    return;
  }

  referralDetail.hidden = false;
  referralDetail.innerHTML = "";

  const referral = getSelectedReferral();

  if (!loadedReferrals.length) {
    referralDetail.append(
      emptyDetail("Create the first referral to start building the workspace.", "New Referral", startNewReferral)
    );
    return;
  }

  if (!referral) {
    referralDetail.append(
      emptyDetail("No referral matches the current list view.", "Clear filters", clearReferralFilters)
    );
    return;
  }

  const actions = document.createElement("div");
  actions.className = "detail-actions";

  const editButton = document.createElement("button");
  editButton.className = "secondary-button";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditingReferral(referral));

  const logCallButton = document.createElement("button");
  logCallButton.className = "secondary-button";
  logCallButton.type = "button";
  logCallButton.textContent = "Log Call";
  logCallButton.addEventListener("click", () => openActivityLogModal(referral, "referrals", "Call"));

  const logTextButton = document.createElement("button");
  logTextButton.className = "secondary-button";
  logTextButton.type = "button";
  logTextButton.textContent = "Log Text";
  logTextButton.addEventListener("click", () => openActivityLogModal(referral, "referrals", "Text"));

  const newAppointmentFromReferralButton = document.createElement("button");
  newAppointmentFromReferralButton.className = "secondary-button";
  newAppointmentFromReferralButton.type = "button";
  newAppointmentFromReferralButton.textContent = "New Appt";
  newAppointmentFromReferralButton.addEventListener("click", () => {
    startSchedulingV2AppointmentFromProfile({
      clientName: referralName(referral),
      clientNames: [referralName(referral)],
      appointmentType: referral.firstAppointmentDate ? "Nutrition Education" : "Enrollment"
    });
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteReferral(referral));

  if (normalizeStatus(referral.status) === "Scheduled" && !referral.convertedClientId) {
    const convertButton = document.createElement("button");
    convertButton.type = "button";
    convertButton.textContent = "Convert to Client";
    convertButton.addEventListener("click", () => convertReferralToClient(referral));
    actions.append(convertButton);
  }

  actions.append(newAppointmentFromReferralButton, logCallButton, logTextButton, editButton, deleteButton, closeReferralModalButton);
  syncModalCloseButton();

  const statusLabel = document.createElement("label");
  statusLabel.className = "status-field profile-status-field";
  statusLabel.textContent = "Status";

  const statusSelect = document.createElement("select");
  statusSelect.dataset.referralId = referral.id;

  for (const status of statuses) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    option.className = `status-group-${statusGroupKey(status)}`;
    statusSelect.append(option);
  }

  statusSelect.value = normalizeStatus(referral.status);
  applyStatusSelectColor(statusSelect, statusSelect.value);
  statusSelect.addEventListener("change", () => {
    applyStatusSelectColor(statusSelect, statusSelect.value);
    updateReferralStatus(referral, statusSelect.value);
  });
  statusLabel.append(statusSelect);

  const shell = document.createElement("div");
  shell.className = "profile-v2-detail referral-progress-profile";
  shell.style.setProperty("--profile-accent", profileV2StatusAccent(normalizeStatus(referral.status)));

  const main = document.createElement("section");
  main.className = "profile-v2-main-panel";
  main.append(
    renderProfileV2Tabs(activeReferralProfileTab, (tab) => {
      activeReferralProfileTab = tab;
      renderReferralDetail();
    }),
    renderReferralProfileV2Body(referral, activeReferralProfileTab, {
      newAppointment: () => newAppointmentFromReferralButton.click()
    })
  );

  const footer = document.createElement("footer");
  footer.className = "profile-v2-footer-actions";
  footer.append(...Array.from(actions.children));

  main.append(footer);
  shell.append(renderReferralProfileV2Side(referral, statusSelect), main);

  referralDetail.append(shell);
}

function renderClientDetail() {
  if (!clientForm.hidden) {
    clientDetail.hidden = true;
    return;
  }

  clientDetail.hidden = false;
  clientDetail.innerHTML = "";
  const client = getSelectedClient();

  if (!loadedClients.length) {
    clientDetail.append(emptyDetail("Create the first client or convert a scheduled referral.", "New Client", startNewClient));
    return;
  }

  if (!client) {
    clientDetail.append(emptyDetail("No client matches the current list view.", "Clear filters", clearClientFilters));
    return;
  }

  const actions = document.createElement("div");
  actions.className = "detail-actions";

  const logCallButton = document.createElement("button");
  logCallButton.className = "secondary-button";
  logCallButton.type = "button";
  logCallButton.textContent = "Log Call";
  logCallButton.addEventListener("click", () => openActivityLogModal(client, "clients", "Call"));

  const logTextButton = document.createElement("button");
  logTextButton.className = "secondary-button";
  logTextButton.type = "button";
  logTextButton.textContent = "Log Text";
  logTextButton.addEventListener("click", () => openActivityLogModal(client, "clients", "Text"));

  const newAppointmentFromClientButton = document.createElement("button");
  newAppointmentFromClientButton.className = "secondary-button";
  newAppointmentFromClientButton.type = "button";
  newAppointmentFromClientButton.textContent = "New Appt";
  newAppointmentFromClientButton.addEventListener("click", () => {
    startSchedulingV2AppointmentFromProfile({
      clientId: client.id,
      clientIds: [client.id],
      clientName: clientName(client),
      clientNames: [clientName(client)]
    });
  });

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditingClient(client));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteClient(client));

  const closeButton = document.createElement("button");
  closeButton.className = "secondary-button";
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", closeClientModal);
  actions.append(newAppointmentFromClientButton, logCallButton, logTextButton, editButton, deleteButton, closeButton);

  const statusLabel = document.createElement("label");
  statusLabel.className = "status-field profile-status-field";
  statusLabel.textContent = "Status";

  const statusSelect = document.createElement("select");
  statusSelect.dataset.clientId = client.id;

  for (const status of clientStatuses) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = clientStatusDisplayLabel(status);
    option.className = `status-group-${clientStatusGroupKey(status)}`;
    statusSelect.append(option);
  }

  statusSelect.value = client.status || "Scheduled";
  applyClientStatusSelectColor(statusSelect, statusSelect.value);
  statusSelect.addEventListener("change", () => {
    applyClientStatusSelectColor(statusSelect, statusSelect.value);
    updateClientStatus(client, statusSelect.value);
  });
  statusLabel.append(statusSelect);

  const shell = document.createElement("div");
  shell.className = "profile-v2-detail";
  shell.style.setProperty("--profile-accent", profileV2StatusAccent(client.status || "Scheduled"));

  const main = document.createElement("section");
  main.className = "profile-v2-main-panel";
  main.append(
    renderProfileV2Tabs(activeClientProfileTab, (tab) => {
      activeClientProfileTab = tab;
      renderClientDetail();
    }),
    renderClientProfileV2Body(client, activeClientProfileTab, {
      newAppointment: () => newAppointmentFromClientButton.click()
    })
  );

  const footer = document.createElement("footer");
  footer.className = "profile-v2-footer-actions";
  footer.append(...Array.from(actions.children));

  main.append(footer);
  shell.append(renderClientProfileV2Side(client, statusSelect), main);

  clientDetail.append(shell);
}

function renderNetworkDetail() {
  if (!networkForm.hidden) {
    networkDetail.hidden = true;
    return;
  }

  networkDetail.hidden = false;
  networkDetail.innerHTML = "";
  const entry = getSelectedNetworkEntry();

  if (!loadedNetworkEntries.length) {
    networkDetail.append(emptyDetail("Create the first referral network entry.", "New Network Entry", startNewNetworkEntry));
    return;
  }

  if (!entry) {
    networkDetail.append(emptyDetail("No network entry matches the current list view.", null, null));
    return;
  }

  const heading = document.createElement("div");
  heading.className = "detail-heading";

  const titleWrap = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Referral Network";
  const title = document.createElement("h3");
  title.textContent = networkEntryName(entry);
  titleWrap.append(eyebrow, title);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  const editButton = document.createElement("button");
  editButton.className = "secondary-button";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditingNetworkEntry(entry));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteNetworkEntry(entry));

  const closeButton = document.createElement("button");
  closeButton.className = "secondary-button";
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", closeNetworkModal);
  actions.append(editButton, deleteButton, closeButton);
  heading.append(titleWrap, actions);

  const infoGrid = document.createElement("div");
  infoGrid.className = "detail-grid";
  const leftColumn = document.createElement("dl");
  leftColumn.className = "detail-column";
  const rightColumn = document.createElement("dl");
  rightColumn.className = "detail-column";

  addDetailField(leftColumn, "Organization", networkEntryName(entry));
  addDetailField(leftColumn, "Referral Type", displayValue(normalizeNetworkType(entry.type)));
  addDetailField(leftColumn, "Main Contact", displayValue(entry.contactName));
  addDetailField(leftColumn, "Phone", displayValue(formatPhone(entry.phone)));
  addDetailField(rightColumn, "Email", displayValue(entry.email));
  addDetailField(rightColumn, "Website", displayValue(entry.website));
  addDetailField(rightColumn, "Created Date", formatDateOnly((entry.createdAt || "").slice(0, 10)));
  infoGrid.append(leftColumn, rightColumn);

  const providersSection = renderNetworkProvidersSection(entry);

  const notes = document.createElement("section");
  notes.className = "notes-panel";
  const notesTitle = document.createElement("h4");
  notesTitle.textContent = "Notes";
  const notesText = document.createElement("p");
  notesText.textContent = entry.notes || "-";
  notes.append(notesTitle, notesText);

  networkDetail.append(heading, infoGrid, providersSection, notes);
}

function renderNetworkProvidersSection(entry) {
  const section = document.createElement("section");
  section.className = "network-providers-panel";
  const title = document.createElement("h4");
  title.textContent = "Providers";
  section.append(title);

  const providers = Array.isArray(entry.providers) ? entry.providers : [];

  if (!providers.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No providers added yet.";
    section.append(empty);
  } else {
    const list = document.createElement("div");
    list.className = "network-provider-list";

    sortedNetworkProviders(providers).forEach(({ provider, originalIndex }) => {
      const providerKey = networkProviderKey(provider, originalIndex);
      const item = document.createElement("div");
      item.className = "network-provider-item";

      if (editingNetworkProviderId === providerKey) {
        item.classList.add("is-editing");
        item.append(renderNetworkProviderEditForm(entry, provider, providerKey));
        list.append(item);
        return;
      }

      const details = document.createElement("div");
      details.className = "network-provider-summary";
      const name = document.createElement("strong");
      name.textContent = networkProviderName(provider);
      const contact = document.createElement("span");
      contact.textContent = provider.email || "-";
      details.append(name, contact);
      if (provider.notes) {
        const notes = document.createElement("span");
        notes.textContent = provider.notes;
        details.append(notes);
      }

      const actions = document.createElement("div");
      actions.className = "network-provider-actions";

      const edit = document.createElement("button");
      edit.className = "secondary-button compact-button";
      edit.type = "button";
      edit.textContent = "Edit";
      edit.addEventListener("click", () => {
        editingNetworkProviderId = providerKey;
        renderNetworkDetail();
      });

      const remove = document.createElement("button");
      remove.className = "secondary-button compact-button";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => removeNetworkProvider(entry, providerKey));
      actions.append(edit, remove);
      item.append(details, actions);
      list.append(item);
    });

    section.append(list);
  }

  const form = document.createElement("form");
  form.className = "network-provider-form";
  form.innerHTML = `
    <label>
      Provider
      <input name="name" required>
    </label>
    <label>
      Email
      <input name="email" type="email" autocomplete="email">
    </label>
    <label class="network-provider-notes-field">
      Notes
      <textarea name="notes" rows="2"></textarea>
    </label>
    <button type="submit">Add Provider</button>
  `;
  form.addEventListener("submit", (event) => addNetworkProvider(event, entry));
  section.append(form);

  return section;
}

function renderNetworkProviderEditForm(entry, provider, providerKey) {
  const form = document.createElement("form");
  form.className = "network-provider-form network-provider-edit-form";
  form.innerHTML = `
    <label>
      Provider
      <input name="name" required>
    </label>
    <label>
      Email
      <input name="email" type="email" autocomplete="email">
    </label>
    <label class="network-provider-notes-field">
      Notes
      <textarea name="notes" rows="2"></textarea>
    </label>
    <div class="network-provider-edit-actions">
      <button type="submit">Save</button>
      <button class="secondary-button" type="button">Cancel</button>
    </div>
  `;

  form.elements.namedItem("name").value = provider.name || "";
  form.elements.namedItem("email").value = provider.email || "";
  form.elements.namedItem("notes").value = provider.notes || "";

  form.addEventListener("submit", (event) => updateNetworkProvider(event, entry, providerKey));
  form.querySelector("button[type='button']").addEventListener("click", () => {
    editingNetworkProviderId = null;
    renderNetworkDetail();
  });

  return form;
}

function renderOutreachDetail() {
  if (!outreachForm.hidden) {
    outreachDetail.hidden = true;
    return;
  }

  outreachDetail.hidden = false;
  outreachDetail.innerHTML = "";
  const event = getSelectedOutreachEvent();

  if (!loadedOutreachEvents.length) {
    outreachDetail.append(emptyDetail("Create the first outreach event or hosted class.", "New Event", startNewOutreachEvent));
    return;
  }

  if (!event) {
    outreachDetail.append(emptyDetail("No outreach event matches the current list view.", null, null));
    return;
  }

  const topbar = document.createElement("div");
  topbar.className = "client-profile-topbar";
  const heading = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Outreach Event Profile";
  const title = document.createElement("h3");
  title.textContent = outreachEventName(event);
  heading.append(eyebrow, title);

  const actions = document.createElement("div");
  actions.className = "detail-actions form-actions";
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditingOutreachEvent(event));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteOutreachEvent(event));

  const closeButton = document.createElement("button");
  closeButton.className = "secondary-button";
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", closeOutreachModal);
  actions.append(editButton, deleteButton, closeButton);
  topbar.append(heading, actions);

  const profileGrid = document.createElement("div");
  profileGrid.className = "grant-profile-grid outreach-profile-grid";

  const overview = document.createElement("section");
  overview.className = "grant-profile-panel";
  const overviewHeader = document.createElement("h3");
  overviewHeader.textContent = event.type || "Outreach Event";
  const overviewFields = document.createElement("div");
  overviewFields.className = "client-field-grid";
  [
    ["Status", createOutreachEventStatusSelect(event)],
    ["Date", formatDateOnly(event.eventDate)],
    ["Repeats", displayValue(event.repeatPattern || "One-time")],
    ["Location", displayValue(event.location)],
    ["Participants", numberValue(event.participantListCount)],
    ["Referrals", numberValue(event.referralsCount)]
  ].forEach(([labelText, value]) => {
    const field = document.createElement("div");
    field.className = "client-profile-field";
    const label = document.createElement("span");
    label.textContent = labelText;
    const strong = document.createElement("strong");
    if (value instanceof Node) {
      strong.append(value);
    } else {
      strong.textContent = value;
    }
    field.append(label, strong);
    overviewFields.append(field);
  });
  overview.append(overviewHeader, overviewFields);

  const details = document.createElement("div");
  details.className = "idea-list";
  details.append(
    renderProfileDetailCard("Contact", [
      { label: "Name", value: event.contactName },
      { label: "Role", value: event.contactRole },
      { label: "Phone", value: formatPhone(event.phone) },
      { label: "Email", value: event.email }
    ], "var(--brand-teal)"),
    renderProfileDetailCard("Outreach Counts", [
      { label: "Interactions", value: String(numberValue(event.interactionsCount)), alwaysShow: true },
      { label: "Interest List", value: String(numberValue(event.interestListCount)), alwaysShow: true },
      { label: "Participants", value: String(numberValue(event.participantListCount)), alwaysShow: true },
      { label: "Referrals", value: String(numberValue(event.referralsCount)), alwaysShow: true }
    ], "var(--brand-blue)"),
    renderProfileDetailCard("Schedule", [
      { label: "Date", value: formatDateOnly(event.eventDate), alwaysShow: true },
      { label: "Repeats", value: event.repeatPattern || "One-time", alwaysShow: true },
      { label: "Created", value: formatDateOnly((event.createdAt || "").slice(0, 10)) }
    ], "var(--brand-purple)"),
    renderProfileDetailCard("Notes", [
      { label: "Event", value: event.notes || "-", alwaysShow: true }
    ], "var(--brand-orange)")
  );

  profileGrid.append(overview, details);
  outreachDetail.append(topbar, profileGrid);
}

function renderOutreachEventOptions(selectedEventId = "") {
  outreachContactEventSelect.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "Not linked";
  outreachContactEventSelect.append(empty);

  for (const event of loadedOutreachEvents.sort((first, second) => outreachEventName(first).localeCompare(outreachEventName(second)))) {
    const option = document.createElement("option");
    option.value = event.id;
    option.textContent = outreachEventName(event);
    outreachContactEventSelect.append(option);
  }

  outreachContactEventSelect.value = selectedEventId || "";
}

function renderOutreachContactDetail() {
  if (!outreachContactForm.hidden) {
    outreachContactDetail.hidden = true;
    return;
  }

  outreachContactDetail.hidden = false;
  outreachContactDetail.innerHTML = "";
  const contact = getSelectedOutreachContact();

  if (!loadedOutreachContacts.length) {
    outreachContactDetail.append(emptyDetail("Create the first interest contact from an outreach event.", "New Contact", startNewOutreachContact));
    return;
  }

  if (!contact) {
    outreachContactDetail.append(emptyDetail("No outreach contact matches the current list view.", null, null));
    return;
  }

  const heading = document.createElement("div");
  heading.className = "detail-heading";

  const titleWrap = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = contact.status || "Outreach Contact";
  const title = document.createElement("h3");
  title.textContent = outreachContactName(contact);
  titleWrap.append(eyebrow, title);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  const editButton = document.createElement("button");
  editButton.className = "secondary-button";
  editButton.type = "button";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => startEditingOutreachContact(contact));

  const deleteButton = document.createElement("button");
  deleteButton.className = "danger-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteOutreachContact(contact));

  const closeButton = document.createElement("button");
  closeButton.className = "secondary-button";
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.addEventListener("click", closeOutreachContactModal);
  actions.append(editButton, deleteButton, closeButton);
  heading.append(titleWrap, actions);

  const infoGrid = document.createElement("div");
  infoGrid.className = "detail-grid";
  const leftColumn = document.createElement("dl");
  leftColumn.className = "detail-column";
  const rightColumn = document.createElement("dl");
  rightColumn.className = "detail-column";

  addDetailField(leftColumn, "Event/Class", displayValue(outreachEventLabel(contact.eventId)));
  addDetailField(leftColumn, "Contact Name", displayValue(contact.contactName));
  addDetailField(leftColumn, "Child Name", displayValue(contact.childName));
  addDetailField(leftColumn, "Phone", displayValue(formatPhone(contact.phone)));
  addDetailField(leftColumn, "Email", displayValue(contact.email));
  addDetailField(rightColumn, "Status", displayValue(contact.status));
  addDetailField(rightColumn, "Interest Type", displayValue(contact.interestType));
  addDetailField(rightColumn, "Preferred Language", displayValue(contact.preferredLanguage));
  addDetailField(rightColumn, "Created Date", formatDateOnly((contact.createdAt || "").slice(0, 10)));
  infoGrid.append(leftColumn, rightColumn);

  const notes = document.createElement("section");
  notes.className = "notes-panel";
  const notesTitle = document.createElement("h4");
  notesTitle.textContent = "Notes";
  const notesText = document.createElement("p");
  notesText.textContent = contact.notes || "-";
  notes.append(notesTitle, notesText);

  outreachContactDetail.append(heading, infoGrid, notes);
}

function renderSiblingsSection(record, moduleName) {
  const records = moduleName === "clients" ? loadedClients : loadedReferrals;
  const getName = moduleName === "clients" ? clientName : referralName;
  const selectRecord = moduleName === "clients" ? setSelectedClient : setSelectedReferral;
  const label = moduleName === "clients" ? "clients" : "referrals";
  const siblingIds = Array.isArray(record.siblingIds) ? record.siblingIds : [];
  const siblings = siblingIds.map((id) => records.find((item) => item.id === id)).filter(Boolean);
  const linkedIds = new Set([record.id, ...siblingIds]);
  const candidates = records
    .filter((item) => !linkedIds.has(item.id))
    .sort((first, second) => getName(first).localeCompare(getName(second)));

  const section = document.createElement("section");
  section.className = "siblings-panel";

  const header = document.createElement("div");
  header.className = "siblings-header";
  const title = document.createElement("h4");
  title.textContent = "Siblings";
  header.append(title);

  const list = document.createElement("div");
  list.className = "sibling-list";

  if (!siblings.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "-";
    list.append(empty);
  }

  for (const sibling of siblings) {
    const item = document.createElement("div");
    item.className = "sibling-item";

    const openButton = document.createElement("button");
    openButton.className = "link-button";
    openButton.type = "button";
    openButton.textContent = getName(sibling);
    openButton.addEventListener("click", () => selectRecord(sibling.id));

    const removeButton = document.createElement("button");
    removeButton.className = "secondary-button compact-button";
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => removeSibling(moduleName, record.id, sibling.id));

    item.append(openButton, removeButton);
    list.append(item);
  }

  const form = document.createElement("form");
  form.className = "sibling-form";

  const select = document.createElement("select");
  select.setAttribute("aria-label", "Add sibling");

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = candidates.length ? "Add sibling" : `No ${label} available`;
  select.append(placeholder);

  for (const candidate of candidates) {
    const option = document.createElement("option");
    option.value = candidate.id;
    option.textContent = getName(candidate);
    select.append(option);
  }

  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add";
  addButton.disabled = !candidates.length;

  form.append(select, addButton);
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (select.value) {
      addSibling(moduleName, record.id, select.value);
    }
  });

  section.append(header, list, form);
  return section;
}

function renderLinkedProvidersSection(record, moduleName) {
  const section = document.createElement("section");
  section.className = "linked-providers-panel";

  const title = document.createElement("h4");
  title.textContent = "Providers";
  section.append(title);

  const links = Array.isArray(record.providerLinks) ? record.providerLinks : [];

  if (!links.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No providers linked yet.";
    section.append(empty);
  } else {
    const list = document.createElement("div");
    list.className = "sibling-list";

    for (const link of links) {
      const item = document.createElement("div");
      item.className = "sibling-item";
      const name = document.createElement("span");
      name.textContent = `${link.providerName} (${link.organizationName})`;
      const remove = document.createElement("button");
      remove.className = "secondary-button compact-button";
      remove.type = "button";
      remove.textContent = "Remove";
      remove.addEventListener("click", () => removeProviderLink(record, moduleName, link));
      item.append(name, remove);
      list.append(item);
    }

    section.append(list);
  }

  const options = availableProviderLinks(record);
  const form = document.createElement("form");
  form.className = "sibling-form";
  const select = document.createElement("select");
  select.setAttribute("aria-label", "Add provider");

  if (!options.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = loadedNetworkEntries.length ? "No providers available" : "Add providers in Referral Network first";
    select.append(option);
    select.disabled = true;
  } else {
    for (const optionLink of options) {
      const option = document.createElement("option");
      option.value = `${optionLink.networkId}:${optionLink.providerId}`;
      option.textContent = optionLink.label;
      select.append(option);
    }
  }

  const add = document.createElement("button");
  add.type = "submit";
  add.textContent = "Add";
  add.disabled = !options.length;
  form.append(select, add);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = options.find((option) => `${option.networkId}:${option.providerId}` === select.value);

    if (selected) {
      addProviderLink(record, moduleName, selected);
    }
  });
  section.append(form);

  return section;
}

function emptyDetail(text, actionLabel, action) {
  const empty = document.createElement("div");
  empty.className = "detail-empty";
  const title = document.createElement("h3");
  title.textContent = "No profile selected";
  const copy = document.createElement("p");
  copy.textContent = text;
  empty.append(title, copy);

  if (actionLabel && action) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = actionLabel;
    button.addEventListener("click", action);
    empty.append(button);
  }

  return empty;
}

function clearReferralFilters() {
  referralSearchInput.value = "";
  selectedReferralId = null;
  renderReferralSummary();
  renderReferrals();
}

function formatAddress(referral) {
  return [referral.addressStreet, referral.addressCity, referral.addressState, referral.addressZip]
    .filter(Boolean)
    .join(", ") || "-";
}

function addDetailField(container, label, value) {
  const group = document.createElement("div");
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  description.textContent = value;
  group.append(term, description);
  container.append(group);
}

function addInlineDateField(container, label, value, record, moduleName, fieldName) {
  const group = document.createElement("div");
  const term = document.createElement("dt");
  term.textContent = label;
  const description = document.createElement("dd");
  const input = document.createElement("input");
  input.className = "inline-date-input";
  input.type = "date";
  input.value = value || "";
  input.setAttribute("aria-label", label);
  input.addEventListener("change", () => updateInlineDate(record, moduleName, fieldName, input.value));
  description.append(input);
  group.append(term, description);
  container.append(group);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === "\"") {
      if (inQuotes && nextChar === "\"") {
        cell += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some((value) => value.trim() !== "")) {
    rows.push(row);
  }

  return rows;
}

function csvValue(row, columnName) {
  if (Object.prototype.hasOwnProperty.call(row, columnName)) {
    return String(row[columnName] || "").trim();
  }

  const target = String(columnName || "").trim().toLowerCase();
  const matchedColumn = Object.keys(row).find((key) => key.trim().toLowerCase() === target);
  return matchedColumn ? String(row[matchedColumn] || "").trim() : "";
}

function normalizeZohoClientStatus(status) {
  return zohoClientStatusMap[status] || status || "";
}

function normalizeZohoReferralStatus(status) {
  return legacyStatusMap[status] || status || "New";
}

function mapZohoClientRow(row) {
  const phone = csvValue(row, "Mobile") || csvValue(row, "Home Phone");
  return {
    firstName: csvValue(row, "First Name"),
    lastName: csvValue(row, "Last Name"),
    parentName: csvValue(row, "Parent Name"),
    phone,
    email: csvValue(row, "Email"),
    dateOfBirth: normalizeCsvDate(csvValue(row, "Date of Birth")),
    preferredLanguage: csvValue(row, "Preferred Language"),
    status: normalizeZohoClientStatus(csvValue(row, "Status")),
    referralSource: csvValue(row, "Referring Provider"),
    referralDate: normalizeCsvDate(csvValue(row, "Referral Date")),
    firstContactDate: normalizeCsvDate(csvValue(row, "First Contact Date")),
    mostRecentContactDate: normalizeCsvDate(csvValue(row, "Most Recent Contact Date")),
    firstAppointmentDate: normalizeCsvDate(csvValue(row, "First Appt Date")),
    lastAppointmentDate: normalizeCsvDate(csvValue(row, "Last Appt Date")),
    assessmentScore: csvValue(row, "Assessment Score"),
    willingnessScore: csvValue(row, "Willingness Score"),
    gender: csvValue(row, "Gender") || "Unspecified",
    ycco: csvValue(row, "YCCO"),
    hrsn: csvValue(row, "HRSN"),
    emailOptOut: /^true|yes|1$/i.test(csvValue(row, "Email Opt Out")),
    addressStreet: csvValue(row, "Mailing Street"),
    addressCity: csvValue(row, "Mailing City"),
    addressState: csvValue(row, "Mailing State"),
    addressZip: csvValue(row, "Mailing Zip"),
    notes: csvValue(row, "Note"),
    zohoRecordId: csvValue(row, "Record Id"),
    siblingZohoRecordIds: [csvValue(row, "Sibling.id"), csvValue(row, "Sibling 2.id")].filter(Boolean),
    rawStatus: csvValue(row, "Status")
  };
}

function isAssessmentCsv(columns) {
  return columns.includes("Assessment Score") && columns.includes("Contacted?") && !columns.includes("Referral Status");
}

function mapZohoReferralRow(row, sourceType) {
  const isAssessment = sourceType === "assessment";
  const phone = csvValue(row, "Mobile") || csvValue(row, "Home Phone") || csvValue(row, "Phone");
  const rawStatus = isAssessment ? csvValue(row, "Status") : csvValue(row, "Referral Status");
  const contacted = /^true|yes|1$/i.test(csvValue(row, "Contacted?"));
  const status = isAssessment
    ? (rawStatus === "Not Interested" ? "Not Interested" : (contacted ? "Texted" : "New"))
    : normalizeZohoReferralStatus(rawStatus);
  const notes = [csvValue(row, "Note"), isAssessment && rawStatus ? `Assessment source status: ${rawStatus}` : ""]
    .filter(Boolean)
    .join("\n");

  return {
    firstName: csvValue(row, "First Name"),
    lastName: csvValue(row, "Last Name"),
    parentName: csvValue(row, "Parent Name"),
    phone,
    email: csvValue(row, "Email"),
    dateOfBirth: normalizeCsvDate(csvValue(row, "Date of Birth")),
    preferredLanguage: csvValue(row, "Preferred Language"),
    status,
    referralType: isAssessment ? "Nutrition Assessment" : "Internal Clinic Referral",
    referralSource: csvValue(row, "Referring Provider"),
    referralDate: normalizeCsvDate(csvValue(row, "Referral Date")),
    firstContactDate: normalizeCsvDate(csvValue(row, "First Contact Date")),
    mostRecentContactDate: normalizeCsvDate(csvValue(row, "Most Recent Contact Date")),
    firstAppointmentDate: normalizeCsvDate(csvValue(row, "First Appt Date")),
    lastAppointmentDate: normalizeCsvDate(csvValue(row, "Last Appt Date")),
    assessmentScore: csvValue(row, "Assessment Score"),
    willingnessScore: csvValue(row, "Willingness Score"),
    gender: csvValue(row, "Gender") || "Unspecified",
    ycco: csvValue(row, "YCCO"),
    hrsn: csvValue(row, "HRSN"),
    emailOptOut: /^true|yes|1$/i.test(csvValue(row, "Email Opt Out")),
    addressStreet: csvValue(row, "Street"),
    addressCity: csvValue(row, "City"),
    addressState: csvValue(row, "State"),
    addressZip: csvValue(row, "Zip Code"),
    notes,
    zohoRecordId: csvValue(row, "Record Id"),
    siblingZohoRecordIds: [csvValue(row, "Sibling.id"), csvValue(row, "Sibling 2.id")].filter(Boolean),
    importSource: isAssessment ? "Zoho Assessment CSV" : "Zoho Referral CSV",
    rawStatus
  };
}

function normalizeImportedNetworkName(name) {
  const cleaned = String(name || "").trim();
  const lower = cleaned.toLowerCase();

  if (lower === "pmc") {
    return "Physicians' Medical Center";
  }

  if (lower === "virginia garcia") {
    return "Virginia Garcia";
  }

  if (lower === "sunrise") {
    return "Sunrise Family Clinic";
  }

  return cleaned;
}

function inferNetworkType(name) {
  const lower = String(name || "").toLowerCase();

  if (lower.includes("ycco") || lower.includes("self referral")) {
    return "Community Org";
  }

  if (lower.includes("pmc") || lower.includes("physicians") || lower.includes("sunrise") || lower.includes("virginia garcia")) {
    return "Internal Clinic";
  }

  return "External Clinic";
}

function mapProviderImportRows(rows) {
  const groups = new Map();
  const missingRequired = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const providerName = csvValue(row, "Provider Name");
    const rawOrganization = csvValue(row, "Referring Organization") || csvValue(row, "Tag") || providerName;
    const organizationName = normalizeImportedNetworkName(rawOrganization);

    if (!organizationName) {
      missingRequired.push({
        rowNumber,
        name: providerName || "Unnamed provider",
        missing: ["Organization"]
      });
      return;
    }

    if (!groups.has(organizationName)) {
      groups.set(organizationName, {
        name: organizationName,
        type: inferNetworkType(rawOrganization || organizationName),
        contactName: "",
        phone: csvValue(row, "Phone"),
        email: "",
        website: "",
        notes: "",
        providers: []
      });
    }

    const group = groups.get(organizationName);
    if (!group.phone && csvValue(row, "Phone")) {
      group.phone = csvValue(row, "Phone");
    }

    if (!group.website && csvValue(row, "Website")) {
      group.website = csvValue(row, "Website");
    }

    if (providerName) {
      group.providers.push({
        name: providerName,
        email: csvValue(row, "Email"),
        notes: csvValue(row, "Tag")
      });
    }
  });

  return {
    entries: [...groups.values()],
    missingRequired
  };
}

function clientIdentityKeys(client) {
  return {
    email: client.email ? client.email.toLowerCase() : "",
    phone: normalizePhoneKey(client.phone).length >= 7 ? normalizePhoneKey(client.phone) : "",
    nameDob: client.firstName && client.lastName && client.dateOfBirth
      ? `${client.firstName.toLowerCase()}|${client.lastName.toLowerCase()}|${client.dateOfBirth}`
      : ""
  };
}

function addImportWarning(warnings, seenWarnings, warning) {
  const key = `${warning.rowNumber}|${warning.name}|${warning.reason}`;

  if (seenWarnings.has(key)) {
    return;
  }

  seenWarnings.add(key);
  warnings.push(warning);
}

function analyzeClientImport(rows, columns) {
  const mappedClients = rows.map(mapZohoClientRow);
  const missingRequired = [];
  const duplicateWarnings = [];
  const householdWarnings = [];
  const existingDuplicateKeys = new Map();
  const existingEmailKeys = new Map();
  const existingPhoneKeys = new Map();
  const csvDuplicateKeys = new Map();
  const csvEmailKeys = new Map();
  const csvPhoneKeys = new Map();
  const seenDuplicateWarnings = new Set();
  const seenHouseholdWarnings = new Set();
  const requiredMappings = clientCsvFieldMappings.filter((mapping) => mapping.required);

  for (const client of loadedClients) {
    const keys = clientIdentityKeys(client);

    if (keys.email && !existingEmailKeys.has(keys.email)) {
      existingEmailKeys.set(keys.email, clientName(client));
    }

    if (keys.nameDob && !existingDuplicateKeys.has(`name-dob:${keys.nameDob}`)) {
      existingDuplicateKeys.set(`name-dob:${keys.nameDob}`, clientName(client));
    }

    if (keys.phone && !existingPhoneKeys.has(keys.phone)) {
      existingPhoneKeys.set(keys.phone, clientName(client));
    }
  }

  mappedClients.forEach((client, index) => {
    const rowNumber = index + 2;
    const missing = requiredMappings
      .filter((mapping) => !client[mapping.key])
      .map((mapping) => mapping.label);

    if (missing.length) {
      missingRequired.push({
        rowNumber,
        name: clientName(client),
        missing
      });
    }

    const keys = clientIdentityKeys(client);
    const duplicateKeys = [
      keys.nameDob ? { key: `name-dob:${keys.nameDob}`, label: "same name and date of birth" } : null
    ].filter(Boolean);

    for (const { key, label } of duplicateKeys) {
      if (existingDuplicateKeys.has(key)) {
        addImportWarning(duplicateWarnings, seenDuplicateWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Possible duplicate of existing client ${existingDuplicateKeys.get(key)} (${label})`
        });
      }

      if (csvDuplicateKeys.has(key)) {
        addImportWarning(duplicateWarnings, seenDuplicateWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Possible duplicate of CSV row ${csvDuplicateKeys.get(key)} (${label})`
        });
      } else {
        csvDuplicateKeys.set(key, rowNumber);
      }
    }

    if (keys.email) {
      if (existingEmailKeys.has(keys.email)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Shares email with existing client ${existingEmailKeys.get(keys.email)}`
        });
      }

      if (csvEmailKeys.has(keys.email)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Shares email with CSV row ${csvEmailKeys.get(keys.email)}`
        });
      } else {
        csvEmailKeys.set(keys.email, rowNumber);
      }
    }

    if (keys.phone) {
      if (existingPhoneKeys.has(keys.phone)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Shares phone with existing client ${existingPhoneKeys.get(keys.phone)}`
        });
      }

      if (csvPhoneKeys.has(keys.phone)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: clientName(client),
          reason: `Shares phone with CSV row ${csvPhoneKeys.get(keys.phone)}`
        });
      } else {
        csvPhoneKeys.set(keys.phone, rowNumber);
      }
    }
  });

  return {
    columns,
    rows,
    mappedClients,
    missingRequired,
    duplicateWarnings,
    householdWarnings
  };
}

function analyzeReferralImport(rows, columns) {
  const sourceType = isAssessmentCsv(columns) ? "assessment" : "referral";
  const mappedReferrals = rows.map((row) => mapZohoReferralRow(row, sourceType));
  const missingRequired = [];
  const duplicateWarnings = [];
  const householdWarnings = [];
  const existingDuplicateKeys = new Map();
  const existingEmailKeys = new Map();
  const existingPhoneKeys = new Map();
  const csvDuplicateKeys = new Map();
  const csvEmailKeys = new Map();
  const csvPhoneKeys = new Map();
  const seenDuplicateWarnings = new Set();
  const seenHouseholdWarnings = new Set();
  const requiredMappings = referralCsvFieldMappings.filter((mapping) => mapping.required);

  for (const record of [...loadedReferrals, ...loadedClients]) {
    const keys = clientIdentityKeys(record);
    const existingName = record.id && loadedClients.some((client) => client.id === record.id) ? clientName(record) : referralName(record);

    if (keys.email && !existingEmailKeys.has(keys.email)) {
      existingEmailKeys.set(keys.email, existingName);
    }

    if (keys.nameDob && !existingDuplicateKeys.has(`name-dob:${keys.nameDob}`)) {
      existingDuplicateKeys.set(`name-dob:${keys.nameDob}`, existingName);
    }

    if (keys.phone && !existingPhoneKeys.has(keys.phone)) {
      existingPhoneKeys.set(keys.phone, existingName);
    }
  }

  mappedReferrals.forEach((referral, index) => {
    const rowNumber = index + 2;
    const missing = requiredMappings
      .filter((mapping) => !referral[mapping.key])
      .map((mapping) => mapping.label);

    if (missing.length) {
      missingRequired.push({
        rowNumber,
        name: referralName(referral),
        missing
      });
    }

    const keys = clientIdentityKeys(referral);
    if (keys.nameDob) {
      const key = `name-dob:${keys.nameDob}`;
      if (existingDuplicateKeys.has(key)) {
        addImportWarning(duplicateWarnings, seenDuplicateWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Possible duplicate of existing record ${existingDuplicateKeys.get(key)} (same name and date of birth)`
        });
      }

      if (csvDuplicateKeys.has(key)) {
        addImportWarning(duplicateWarnings, seenDuplicateWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Possible duplicate of CSV row ${csvDuplicateKeys.get(key)} (same name and date of birth)`
        });
      } else {
        csvDuplicateKeys.set(key, rowNumber);
      }
    }

    if (keys.email) {
      if (existingEmailKeys.has(keys.email)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Shares email with existing record ${existingEmailKeys.get(keys.email)}`
        });
      }

      if (csvEmailKeys.has(keys.email)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Shares email with CSV row ${csvEmailKeys.get(keys.email)}`
        });
      } else {
        csvEmailKeys.set(keys.email, rowNumber);
      }
    }

    if (keys.phone) {
      if (existingPhoneKeys.has(keys.phone)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Shares phone with existing record ${existingPhoneKeys.get(keys.phone)}`
        });
      }

      if (csvPhoneKeys.has(keys.phone)) {
        addImportWarning(householdWarnings, seenHouseholdWarnings, {
          rowNumber,
          name: referralName(referral),
          reason: `Shares phone with CSV row ${csvPhoneKeys.get(keys.phone)}`
        });
      } else {
        csvPhoneKeys.set(keys.phone, rowNumber);
      }
    }
  });

  return {
    columns,
    rows,
    sourceType,
    mappedReferrals,
    missingRequired,
    duplicateWarnings,
    householdWarnings
  };
}

function analyzeNetworkImport(rows, columns) {
  const mapped = mapProviderImportRows(rows);
  return {
    columns,
    rows,
    entries: mapped.entries,
    missingRequired: mapped.missingRequired
  };
}

function csvFirstValue(row, columnNames) {
  for (const columnName of columnNames) {
    const value = csvValue(row, columnName);

    if (value) {
      return value;
    }
  }

  return "";
}

function splitCsvList(value) {
  return String(value || "")
    .split(/;|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isSetmoreAppointmentRow(row) {
  return Boolean(
    csvFirstValue(row, ["Service/class/event", "Meeting Type", "Booking ID", "Customer name", "Booked via"])
  );
}

function setmoreAppointmentSkipReason(row) {
  if (!isSetmoreAppointmentRow(row)) {
    return "";
  }

  const service = csvFirstValue(row, ["Service/class/event", "Service"]).toLowerCase();
  const meetingType = csvFirstValue(row, ["Meeting Type"]).toLowerCase();

  if (service.includes("wellness day")) {
    return "Wellness Day will live outside appointment scheduling.";
  }

  if (meetingType === "class" || service.includes("cooking class")) {
    return "Classes will be handled in a separate classes/events workflow.";
  }

  if (service.includes("hold for reschedule")) {
    return "Calendar hold skipped.";
  }

  if (!setmoreAppointmentServices.has(service)) {
    return "Setmore service is not mapped as a client appointment.";
  }

  return "";
}

function importedAppointmentStatus(value) {
  const status = String(value || "").trim();
  const normalized = status.toLowerCase();

  if (normalized === "confirmed") {
    return "Scheduled";
  }

  if (normalized === "cancelled" || normalized === "canceled") {
    return "Canceled";
  }

  return appointmentStatuses.includes(status) ? status : "Scheduled";
}

function importedAppointmentStartTime(value) {
  return String(value || "").split(/\s+-\s+/)[0]?.trim() || "";
}

function importedAppointmentDuration(value) {
  const [startText, endText] = String(value || "").split(/\s+-\s+/);
  const start = appointmentTimeMinutes(startText);
  const end = appointmentTimeMinutes(endText);

  if (start === null || end === null || end <= start) {
    return "";
  }

  return String(end - start);
}

function canonicalSetmoreAppointmentServiceLabel(service, appointmentType) {
  const normalized = normalizedLookupKey(service);

  if (normalized.includes("cita de inscripcion")) {
    return "Cita de inscripción en español";
  }

  if (normalized.includes("cita de educacion nutricional")) {
    return "Cita de educación nutricional en español";
  }

  return appointmentType === "Nutrition Education" ? "Nutrition Education Appointment" : "Enrollment Appointment";
}

function appointmentImportStartMinutes(appointment) {
  return appointmentTimeMinutes(appointment.appointmentTime);
}

function appointmentImportEndMinutes(appointment) {
  const start = appointmentImportStartMinutes(appointment);

  if (start === null) {
    return null;
  }

  return start + appointmentDurationMinutes(appointment);
}

function setmoreAppointmentImportLooksLikeSiblingVisit(appointment) {
  return normalizedLookupKey(appointment.publicBookingServiceLabel).includes("sibling") ||
    appointmentDurationMinutes(appointment) <= 15;
}

function setmoreAppointmentImportsCanMerge(first, second) {
  if (!first || !second || first.skipReason || second.skipReason) {
    return false;
  }

  if (first.importSource !== "Setmore appointment export" || second.importSource !== "Setmore appointment export") {
    return false;
  }

  const firstEnd = appointmentImportEndMinutes(first);
  const secondStart = appointmentImportStartMinutes(second);

  if (firstEnd === null || secondStart === null || secondStart !== firstEnd) {
    return false;
  }

  return setmoreAppointmentImportLooksLikeSiblingVisit(first) &&
    setmoreAppointmentImportLooksLikeSiblingVisit(second) &&
    first.appointmentDate === second.appointmentDate &&
    first.appointmentType === second.appointmentType &&
    first.status === second.status &&
    normalizedLookupKey(first.staffMember) === normalizedLookupKey(second.staffMember) &&
    normalizedLookupKey(first.lesson || "") === normalizedLookupKey(second.lesson || "") &&
    schedulingV2AppointmentsShareFamilySignal(first, second);
}

function mergeAppointmentImportIntoGroup(existing, appointment) {
  existing.rowNumbers.push(appointment.rowNumber);
  for (const name of appointment.clientNames) {
    if (!existing.clientNames.some((currentName) => normalizedLookupKey(currentName) === normalizedLookupKey(name))) {
      existing.clientNames.push(name);
    }
  }
  existing.clientName = existing.clientNames[0] || existing.clientName;

  const start = appointmentImportStartMinutes(existing);
  const end = appointmentImportEndMinutes(appointment);
  if (start !== null && end !== null && end > start) {
    existing.durationMinutes = String(end - start);
  }

  if (appointment.notes && !existing.notes.includes(appointment.notes)) {
    existing.notes = [existing.notes, `${appointment.clientName || `Row ${appointment.rowNumber}`}: ${appointment.notes}`]
      .filter(Boolean)
      .join("\n");
  }
}

function mappedSetmoreAppointmentRow(row, index) {
  const service = csvFirstValue(row, ["Service/class/event", "Service"]);
  const appointmentType = setmoreAppointmentServices.get(service.toLowerCase()) || service;
  const comments = csvFirstValue(row, ["Comments", "Comments "]);
  const notes = stripSetmoreBookingIdFromNotes(comments);
  const inferred = inferAppointmentFieldsFromNotes(notes, appointmentType);
  const clientNames = splitCsvList(csvFirstValue(row, ["Customer name", "Customer Name", "Client Name", "Name"]));

  return {
    rowNumber: index + 2,
    clientIds: [],
    clientId: "",
    clientNames,
    clientName: clientNames[0] || "",
    appointmentDate: normalizeCsvDate(csvFirstValue(row, ["Appointment date", "Appointment Date", "Date", "Scheduled Date"])),
    appointmentTime: importedAppointmentStartTime(csvFirstValue(row, ["Appointment time", "Appointment Time", "Time", "Scheduled Time"])),
    appointmentType,
    durationMinutes: importedAppointmentDuration(csvFirstValue(row, ["Appointment time", "Appointment Time", "Time", "Scheduled Time"])),
    status: importedAppointmentStatus(csvFirstValue(row, ["Status"])),
    lesson: inferred.lesson,
    goal: inferred.goal,
    staffMember: csvFirstValue(row, ["Team member", "Team Member", "Staff", "Staff Member", "Provider"]),
    notes,
    publicBookingServiceLabel: canonicalSetmoreAppointmentServiceLabel(service, appointmentType),
    importSource: "Setmore appointment export",
    skipReason: setmoreAppointmentSkipReason(row)
  };
}

function mapAppointmentImportRow(row, index) {
  if (isSetmoreAppointmentRow(row)) {
    return mappedSetmoreAppointmentRow(row, index);
  }

  const clientIds = splitCsvList(csvFirstValue(row, ["Client IDs", "Client Ids", "Client ID", "ClientId", "clientIds", "clientId"]));
  const clientNames = splitCsvList(csvFirstValue(row, ["Client Names", "Client Name", "Child Name", "Full Name", "Name", "Client"]));
  const appointmentType = csvFirstValue(row, ["Appointment Type", "Type", "Service"]);
  const lesson = csvFirstValue(row, ["Lesson", "Lesson Number"]);

  return {
    rowNumber: index + 2,
    clientIds,
    clientId: clientIds[0] || "",
    clientNames,
    clientName: clientNames[0] || "",
    appointmentDate: normalizeCsvDate(csvFirstValue(row, ["Appointment Date", "Date", "Scheduled Date"])),
    appointmentTime: csvFirstValue(row, ["Appointment Time", "Time", "Scheduled Time"]),
    appointmentType,
    durationMinutes: csvFirstValue(row, ["Duration", "Duration Minutes", "Minutes"]),
    status: csvFirstValue(row, ["Status"]) || "Scheduled",
    lesson,
    goal: csvFirstValue(row, ["Goal", "Goals"]),
    staffMember: csvFirstValue(row, ["Staff", "Staff Member", "Provider"]),
    notes: csvFirstValue(row, ["Notes", "Note"]),
    importSource: "Appointments CSV"
  };
}

function groupedAppointmentImports(appointments) {
  const groups = new Map();
  const orderedAppointments = [...appointments].sort((first, second) => {
    const dateCompare = String(first.appointmentDate || "").localeCompare(String(second.appointmentDate || ""));
    if (dateCompare) {
      return dateCompare;
    }

    return appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime) ||
      (first.rowNumber || 0) - (second.rowNumber || 0);
  });

  for (const appointment of orderedAppointments) {
    if (appointment.skipReason) {
      continue;
    }

    const mergeTarget = [...groups.values()].find((existing) => setmoreAppointmentImportsCanMerge(existing, appointment));
    if (mergeTarget) {
      mergeAppointmentImportIntoGroup(mergeTarget, appointment);
      continue;
    }

    const key = [
      appointment.appointmentDate,
      normalizeAppointmentTime(appointment.appointmentTime),
      appointment.appointmentType,
      appointment.publicBookingServiceLabel || "",
      appointment.status,
      appointment.staffMember,
      appointment.durationMinutes || ""
    ].join("|");
    const existing = groups.get(key);

    if (!existing) {
      groups.set(key, {
        ...appointment,
        appointmentTime: normalizeAppointmentTime(appointment.appointmentTime),
        rowNumbers: [appointment.rowNumber]
      });
      continue;
    }

    mergeAppointmentImportIntoGroup(existing, appointment);
  }

  return [...groups.values()];
}

function analyzeAppointmentImport(rows, columns) {
  const mappedRows = rows.map(mapAppointmentImportRow);
  const skippedRows = mappedRows
    .filter((appointment) => appointment.skipReason)
    .map((appointment) => ({
      rowNumber: appointment.rowNumber,
      clientName: appointment.clientName,
      reason: appointment.skipReason
    }));
  const mapped = groupedAppointmentImports(mappedRows);
  const clientLookup = new Set(loadedClients.map((client) => normalizedLookupKey(clientName(client))).filter(Boolean));
  const missingRows = [];
  const unmatchedRows = [];

  for (const appointment of mapped) {
    if ((!appointment.clientIds.length && !appointment.clientNames.length) || !appointment.appointmentDate || !appointment.appointmentTime) {
      missingRows.push({
        rowNumber: appointment.rowNumber,
        reason: "Client, appointment date, and appointment time are required."
      });
      continue;
    }

    if (!appointment.clientIds.length) {
      const unmatchedNames = appointment.clientNames.filter((name) => !clientLookup.has(normalizedLookupKey(name)));

      if (unmatchedNames.length) {
        unmatchedRows.push({
          rowNumber: appointment.rowNumber,
          reason: `Will import as name-only: ${unmatchedNames.join(", ")}.`
        });
      }
    }
  }

  const blockedRows = new Set(missingRows.map((warning) => warning.rowNumber));

  return {
    columns,
    sourceRowCount: mappedRows.length,
    appointments: mapped,
    skippedRows,
    missingRows,
    unmatchedRows,
    importableAppointments: mapped.filter((appointment) => !blockedRows.has(appointment.rowNumber))
  };
}

function appendImportSection(parent, titleText) {
  const section = document.createElement("section");
  section.className = "import-preview-section";
  const title = document.createElement("h4");
  title.textContent = titleText;
  section.append(title);
  parent.append(section);
  return section;
}

function appendSimpleList(parent, items, emptyText) {
  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = emptyText;
    parent.append(empty);
    return;
  }

  const list = document.createElement("ul");
  list.className = "import-warning-list";
  for (const item of items) {
    const row = document.createElement("li");
    row.textContent = item;
    list.append(row);
  }
  parent.append(list);
}

function renderClientImportPreview(analysis, fileName) {
  clientImportDetail.innerHTML = "";
  const missingRowNumbers = new Set(analysis.missingRequired.map((warning) => warning.rowNumber));
  const importableClients = analysis.mappedClients.filter((_, index) => !missingRowNumbers.has(index + 2));
  confirmClientImportButton.hidden = false;
  confirmClientImportButton.disabled = !importableClients.length;
  confirmClientImportButton.textContent = `Import ${importableClients.length} Clients`;

  const summary = document.createElement("div");
  summary.className = "import-summary-grid";
  for (const [label, value] of [
    ["File", fileName],
    ["Total rows found", analysis.rows.length],
    ["Ready to import", importableClients.length],
    ["Columns detected", analysis.columns.length],
    ["Missing required rows", analysis.missingRequired.length],
    ["Duplicate warnings", analysis.duplicateWarnings.length],
    ["Shared contact warnings", analysis.householdWarnings.length]
  ]) {
    const item = document.createElement("div");
    item.className = "summary-item import-summary-item";
    const valueEl = document.createElement("strong");
    valueEl.textContent = value;
    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    item.append(valueEl, labelEl);
    summary.append(item);
  }
  clientImportDetail.append(summary);

  const columnsSection = appendImportSection(clientImportDetail, "Columns Detected");
  appendSimpleList(columnsSection, analysis.columns, "No columns detected.");

  const mappingSection = appendImportSection(clientImportDetail, "Field Mapping Summary");
  const mappingGrid = document.createElement("div");
  mappingGrid.className = "import-mapping-grid";
  for (const header of ["CRM Field", "Zoho Column", "Requirement"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    mappingGrid.append(cell);
  }
  for (const mapping of clientCsvFieldMappings) {
    const appField = document.createElement("span");
    appField.textContent = mapping.label;
    const sourceField = document.createElement("span");
    sourceField.textContent = mapping.source;
    const requirement = document.createElement("span");
    requirement.textContent = mapping.required ? "Required" : "Optional";
    mappingGrid.append(appField, sourceField, requirement);
  }
  mappingSection.append(mappingGrid);

  const missingSection = appendImportSection(clientImportDetail, "Rows With Missing Required Values");
  appendSimpleList(
    missingSection,
    analysis.missingRequired.map((warning) => `Row ${warning.rowNumber}: ${warning.name} missing ${warning.missing.join(", ")}`),
    "No missing required values found."
  );

  const duplicateSection = appendImportSection(clientImportDetail, "Duplicate Warnings");
  appendSimpleList(
    duplicateSection,
    analysis.duplicateWarnings.map((warning) => `Row ${warning.rowNumber}: ${warning.name} - ${warning.reason}`),
    "No duplicate warnings found."
  );

  const householdSection = appendImportSection(clientImportDetail, "Shared Contact / Household Warnings");
  appendSimpleList(
    householdSection,
    analysis.householdWarnings.map((warning) => `Row ${warning.rowNumber}: ${warning.name} - ${warning.reason}`),
    "No shared contact warnings found."
  );

  const previewSection = appendImportSection(clientImportDetail, "Preview of First 10 Clients");
  const previewTable = document.createElement("div");
  previewTable.className = "import-preview-table";
  for (const header of ["Name", "Status", "Phone", "Caregiver", "Language", "Referral Source"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    previewTable.append(cell);
  }
  for (const client of analysis.mappedClients.slice(0, 10)) {
    for (const value of [
      clientName(client),
      displayValue(client.status),
      displayValue(formatPhone(client.phone)),
      displayValue(client.parentName),
      displayValue(client.preferredLanguage),
      displayValue(client.referralSource)
    ]) {
      const cell = document.createElement("span");
      cell.textContent = value;
      previewTable.append(cell);
    }
  }
  previewSection.append(previewTable);
}

function renderReferralImportPreview(analysis, fileName) {
  referralImportDetail.innerHTML = "";
  const missingRowNumbers = new Set(analysis.missingRequired.map((warning) => warning.rowNumber));
  const importableReferrals = analysis.mappedReferrals.filter((_, index) => !missingRowNumbers.has(index + 2));
  confirmReferralImportButton.hidden = false;
  confirmReferralImportButton.disabled = !importableReferrals.length;
  confirmReferralImportButton.textContent = `Import ${importableReferrals.length} Referrals`;

  const summary = document.createElement("div");
  summary.className = "import-summary-grid";
  for (const [label, value] of [
    ["File", fileName],
    ["Import type", analysis.sourceType === "assessment" ? "Assessments as referrals" : "Referrals"],
    ["Total rows found", analysis.rows.length],
    ["Ready to import", importableReferrals.length],
    ["Columns detected", analysis.columns.length],
    ["Missing required rows", analysis.missingRequired.length],
    ["Duplicate warnings", analysis.duplicateWarnings.length],
    ["Shared contact warnings", analysis.householdWarnings.length]
  ]) {
    const item = document.createElement("div");
    item.className = "summary-item import-summary-item";
    const valueEl = document.createElement("strong");
    valueEl.textContent = value;
    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    item.append(valueEl, labelEl);
    summary.append(item);
  }
  referralImportDetail.append(summary);

  const columnsSection = appendImportSection(referralImportDetail, "Columns Detected");
  appendSimpleList(columnsSection, analysis.columns, "No columns detected.");

  const mappingSection = appendImportSection(referralImportDetail, "Field Mapping Summary");
  const mappingGrid = document.createElement("div");
  mappingGrid.className = "import-mapping-grid";
  for (const header of ["CRM Field", "Zoho Column", "Requirement"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    mappingGrid.append(cell);
  }
  for (const mapping of referralCsvFieldMappings) {
    const appField = document.createElement("span");
    appField.textContent = mapping.label;
    const sourceField = document.createElement("span");
    sourceField.textContent = mapping.source;
    const requirement = document.createElement("span");
    requirement.textContent = mapping.required ? "Required" : "Optional";
    mappingGrid.append(appField, sourceField, requirement);
  }
  mappingSection.append(mappingGrid);

  const missingSection = appendImportSection(referralImportDetail, "Rows With Missing Required Values");
  appendSimpleList(
    missingSection,
    analysis.missingRequired.map((warning) => `Row ${warning.rowNumber}: ${warning.name} missing ${warning.missing.join(", ")}`),
    "No missing required values found."
  );

  const duplicateSection = appendImportSection(referralImportDetail, "Duplicate Warnings");
  appendSimpleList(
    duplicateSection,
    analysis.duplicateWarnings.map((warning) => `Row ${warning.rowNumber}: ${warning.name} - ${warning.reason}`),
    "No duplicate warnings found."
  );

  const householdSection = appendImportSection(referralImportDetail, "Shared Contact / Household Warnings");
  appendSimpleList(
    householdSection,
    analysis.householdWarnings.map((warning) => `Row ${warning.rowNumber}: ${warning.name} - ${warning.reason}`),
    "No shared contact warnings found."
  );

  const previewSection = appendImportSection(referralImportDetail, "Preview of First 10 Referrals");
  const previewTable = document.createElement("div");
  previewTable.className = "import-preview-table";
  for (const header of ["Name", "Status", "Type", "Phone", "Caregiver", "Language"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    previewTable.append(cell);
  }
  for (const referral of analysis.mappedReferrals.slice(0, 10)) {
    for (const value of [
      referralName(referral),
      displayValue(referral.status),
      displayValue(referral.referralType),
      displayValue(formatPhone(referral.phone)),
      displayValue(referral.parentName),
      displayValue(referral.preferredLanguage)
    ]) {
      const cell = document.createElement("span");
      cell.textContent = value;
      previewTable.append(cell);
    }
  }
  previewSection.append(previewTable);
}

function renderNetworkImportPreview(analysis, fileName) {
  networkImportDetail.innerHTML = "";
  confirmNetworkImportButton.hidden = false;
  confirmNetworkImportButton.disabled = !analysis.entries.length;
  confirmNetworkImportButton.textContent = `Import ${analysis.entries.length} Organizations`;
  const providerCount = analysis.entries.reduce((total, entry) => total + entry.providers.length, 0);

  const summary = document.createElement("div");
  summary.className = "import-summary-grid";
  for (const [label, value] of [
    ["File", fileName],
    ["Total rows found", analysis.rows.length],
    ["Organizations ready", analysis.entries.length],
    ["Providers ready", providerCount],
    ["Columns detected", analysis.columns.length],
    ["Missing required rows", analysis.missingRequired.length]
  ]) {
    const item = document.createElement("div");
    item.className = "summary-item import-summary-item";
    const valueEl = document.createElement("strong");
    valueEl.textContent = value;
    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    item.append(valueEl, labelEl);
    summary.append(item);
  }
  networkImportDetail.append(summary);

  const columnsSection = appendImportSection(networkImportDetail, "Columns Detected");
  appendSimpleList(columnsSection, analysis.columns, "No columns detected.");

  const missingSection = appendImportSection(networkImportDetail, "Rows With Missing Required Values");
  appendSimpleList(
    missingSection,
    analysis.missingRequired.map((warning) => `Row ${warning.rowNumber}: ${warning.name} missing ${warning.missing.join(", ")}`),
    "No missing required values found."
  );

  const previewSection = appendImportSection(networkImportDetail, "Preview of Organizations");
  const previewTable = document.createElement("div");
  previewTable.className = "import-preview-table";
  for (const header of ["Organization", "Type", "Providers", "Phone", "Website"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    previewTable.append(cell);
  }
  for (const entry of analysis.entries.slice(0, 10)) {
    for (const value of [
      networkEntryName(entry),
      displayValue(entry.type),
      `${entry.providers.length}`,
      displayValue(formatPhone(entry.phone)),
      displayValue(entry.website)
    ]) {
      const cell = document.createElement("span");
      cell.textContent = value;
      previewTable.append(cell);
    }
  }
  previewSection.append(previewTable);
}

function renderAppointmentImportPreview(analysis, fileName) {
  appointmentImportDetail.innerHTML = "";
  confirmAppointmentImportButton.hidden = false;
  confirmAppointmentImportButton.disabled = !analysis.importableAppointments.length;
  confirmAppointmentImportButton.textContent = `Import ${analysis.importableAppointments.length} Appointments`;

  const summary = document.createElement("div");
  summary.className = "import-summary-grid";
  for (const [label, value] of [
    ["File", fileName],
    ["Total rows found", analysis.sourceRowCount || analysis.appointments.length],
    ["Grouped appointments", analysis.appointments.length],
    ["Ready to import", analysis.importableAppointments.length],
    ["Columns detected", analysis.columns.length],
    ["Skipped non-appointments", analysis.skippedRows.length],
    ["Missing required rows", analysis.missingRows.length],
    ["Unmatched clients", analysis.unmatchedRows.length]
  ]) {
    const item = document.createElement("div");
    item.className = "summary-item import-summary-item";
    const valueEl = document.createElement("strong");
    valueEl.textContent = value;
    const labelEl = document.createElement("span");
    labelEl.textContent = label;
    item.append(valueEl, labelEl);
    summary.append(item);
  }
  appointmentImportDetail.append(summary);

  const columnsSection = appendImportSection(appointmentImportDetail, "Columns Detected");
  appendSimpleList(columnsSection, analysis.columns, "No columns detected.");

  const missingSection = appendImportSection(appointmentImportDetail, "Rows With Missing Required Values");
  appendSimpleList(
    missingSection,
    analysis.missingRows.map((warning) => `Row ${warning.rowNumber}: ${warning.reason}`),
    "No missing required values found."
  );

  const skippedSection = appendImportSection(appointmentImportDetail, "Skipped Non-Appointment Rows");
  appendSimpleList(
    skippedSection,
    analysis.skippedRows.map((warning) => `Row ${warning.rowNumber}: ${warning.clientName || "Unnamed row"} - ${warning.reason}`),
    "No classes, events, or holds were skipped."
  );

  const unmatchedSection = appendImportSection(appointmentImportDetail, "Rows With Unmatched Clients");
  appendSimpleList(
    unmatchedSection,
    analysis.unmatchedRows.map((warning) => `Row ${warning.rowNumber}: ${warning.reason}`),
    "All named clients matched current client profiles."
  );

  const previewSection = appendImportSection(appointmentImportDetail, "Preview of First 10 Appointments");
  const previewTable = document.createElement("div");
  previewTable.className = "import-preview-table";
  for (const header of ["Client", "Date", "Time", "Type", "Status", "Lesson"]) {
    const cell = document.createElement("strong");
    cell.textContent = header;
    previewTable.append(cell);
  }
  for (const appointment of analysis.appointments.slice(0, 10)) {
    for (const value of [
      displayValue(appointment.clientNames.join(", ") || appointment.clientIds.join(", ")),
      displayValue(appointment.appointmentDate),
      displayValue(appointment.appointmentTime),
      displayValue(appointment.appointmentType),
      displayValue(appointment.status),
      displayValue(appointment.lesson)
    ]) {
      const cell = document.createElement("span");
      cell.textContent = value;
      previewTable.append(cell);
    }
  }
  previewSection.append(previewTable);
}

function openClientImportModal() {
  clientImportModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeClientImportModal() {
  clientImportModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function openReferralImportModal() {
  referralImportModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeReferralImportModal() {
  referralImportModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function openNetworkImportModal() {
  networkImportModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeNetworkImportModal() {
  networkImportModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function openAppointmentImportModal() {
  appointmentImportModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeAppointmentImportModal() {
  appointmentImportModal.hidden = true;
  document.body.classList.remove("modal-open");
}

function importableClientsFromAnalysis(analysis) {
  const missingRowNumbers = new Set(analysis.missingRequired.map((warning) => warning.rowNumber));
  return analysis.mappedClients
    .map((client, index) => ({
      ...client,
      rowNumber: index + 2
    }))
    .filter((_, index) => !missingRowNumbers.has(index + 2));
}

function importableReferralsFromAnalysis(analysis) {
  const missingRowNumbers = new Set(analysis.missingRequired.map((warning) => warning.rowNumber));
  return analysis.mappedReferrals
    .map((referral, index) => ({
      ...referral,
      rowNumber: index + 2
    }))
    .filter((_, index) => !missingRowNumbers.has(index + 2));
}

async function importPreviewedClients() {
  if (!latestClientImportAnalysis) {
    clientsStatusEl.textContent = "Preview a CSV before importing clients.";
    return;
  }

  const clientsToImport = importableClientsFromAnalysis(latestClientImportAnalysis);

  if (!clientsToImport.length) {
    clientsStatusEl.textContent = "No valid client rows are ready to import.";
    return;
  }

  const confirmed = window.confirm(
    `Import ${clientsToImport.length} clients now? ` +
    `${latestClientImportAnalysis.duplicateWarnings.length} duplicate warning(s) and ` +
    `${latestClientImportAnalysis.householdWarnings.length} shared contact warning(s) will not block the import.`
  );

  if (!confirmed) {
    return;
  }

  confirmClientImportButton.disabled = true;
  clientsStatusEl.textContent = "Importing clients...";

  try {
    const response = await authedFetch("/api/clients/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ clients: clientsToImport })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const result = await response.json();
    clientsStatusEl.textContent = `Imported ${result.importedCount} clients${result.skipped?.length ? `; skipped ${result.skipped.length}` : ""}.`;
    latestClientImportAnalysis = null;
    confirmClientImportButton.hidden = true;
    await loadClients();
    if (activeAdminView === "data-tools") {
      await loadDataToolsCounts();
    }
    closeClientImportModal();
  } catch (error) {
    clientsStatusEl.textContent = error.message || "Could not import clients yet.";
    console.error(error);
  } finally {
    confirmClientImportButton.disabled = false;
  }
}

async function previewClientCsv(file) {
  if (!file) {
    return;
  }

  clientsStatusEl.textContent = `Previewing ${file.name}...`;

  try {
    const text = await file.text();
    const parsed = parseCsv(text);

    if (parsed.length < 2) {
      throw new Error("The CSV does not contain any client rows.");
    }

    const columns = parsed[0].map((column) => column.trim());
    const rows = parsed.slice(1).map((values) =>
      Object.fromEntries(columns.map((column, index) => [column, values[index] || ""]))
    );
    const analysis = analyzeClientImport(rows, columns);
    latestClientImportAnalysis = analysis;
    renderClientImportPreview(analysis, file.name);
    openClientImportModal();
    clientsStatusEl.textContent = "Client import preview ready.";
  } catch (error) {
    latestClientImportAnalysis = null;
    confirmClientImportButton.hidden = true;
    clientsStatusEl.textContent = error.message || "Could not preview this CSV.";
    clientImportDetail.innerHTML = "";
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = error.message || "Could not preview this CSV.";
    clientImportDetail.append(message);
    openClientImportModal();
    console.error(error);
  } finally {
    clientCsvInput.value = "";
  }
}

async function importPreviewedReferrals() {
  if (!latestReferralImportAnalysis) {
    referralsStatusEl.textContent = "Preview a CSV before importing referrals.";
    return;
  }

  const referralsToImport = importableReferralsFromAnalysis(latestReferralImportAnalysis);

  if (!referralsToImport.length) {
    referralsStatusEl.textContent = "No valid referral rows are ready to import.";
    return;
  }

  const confirmed = window.confirm(
    `Import ${referralsToImport.length} referrals now? ` +
    `${latestReferralImportAnalysis.duplicateWarnings.length} duplicate warning(s) and ` +
    `${latestReferralImportAnalysis.householdWarnings.length} shared contact warning(s) will not block the import.`
  );

  if (!confirmed) {
    return;
  }

  confirmReferralImportButton.disabled = true;
  referralsStatusEl.textContent = "Importing referrals...";

  try {
    const response = await authedFetch("/api/referrals/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ referrals: referralsToImport })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const result = await response.json();
    referralsStatusEl.textContent = `Imported ${result.importedCount} referrals${result.skipped?.length ? `; skipped ${result.skipped.length}` : ""}.`;
    latestReferralImportAnalysis = null;
    confirmReferralImportButton.hidden = true;
    await loadReferrals();
    if (activeAdminView === "data-tools") {
      await loadDataToolsCounts();
    }
    closeReferralImportModal();
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not import referrals yet.";
    console.error(error);
  } finally {
    confirmReferralImportButton.disabled = false;
  }
}

async function previewReferralCsv(file) {
  if (!file) {
    return;
  }

  referralsStatusEl.textContent = `Previewing ${file.name}...`;

  try {
    const text = await file.text();
    const parsed = parseCsv(text);

    if (parsed.length < 2) {
      throw new Error("The CSV does not contain any referral rows.");
    }

    const columns = parsed[0].map((column) => column.trim());
    const rows = parsed.slice(1).map((values) =>
      Object.fromEntries(columns.map((column, index) => [column, values[index] || ""]))
    );
    const analysis = analyzeReferralImport(rows, columns);
    latestReferralImportAnalysis = analysis;
    renderReferralImportPreview(analysis, file.name);
    openReferralImportModal();
    referralsStatusEl.textContent = "Referral import preview ready.";
  } catch (error) {
    latestReferralImportAnalysis = null;
    confirmReferralImportButton.hidden = true;
    referralsStatusEl.textContent = error.message || "Could not preview this CSV.";
    referralImportDetail.innerHTML = "";
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = error.message || "Could not preview this CSV.";
    referralImportDetail.append(message);
    openReferralImportModal();
    console.error(error);
  } finally {
    referralCsvInput.value = "";
  }
}

async function importPreviewedNetworkEntries() {
  if (!latestNetworkImportAnalysis) {
    networkStatusEl.textContent = "Preview a CSV before importing providers.";
    return;
  }

  if (!latestNetworkImportAnalysis.entries.length) {
    networkStatusEl.textContent = "No valid provider rows are ready to import.";
    return;
  }

  const providerCount = latestNetworkImportAnalysis.entries.reduce((total, entry) => total + entry.providers.length, 0);
  const confirmed = window.confirm(
    `Import ${latestNetworkImportAnalysis.entries.length} organizations and ${providerCount} providers now? Existing organizations with the same name will be updated.`
  );

  if (!confirmed) {
    return;
  }

  confirmNetworkImportButton.disabled = true;
  networkStatusEl.textContent = "Importing providers...";

  try {
    const response = await authedFetch("/api/referral-network/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ entries: latestNetworkImportAnalysis.entries })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const result = await response.json();
    networkStatusEl.textContent = `Imported ${result.createdCount} organizations, updated ${result.updatedCount}, and added ${result.providerCount} providers.`;
    latestNetworkImportAnalysis = null;
    confirmNetworkImportButton.hidden = true;
    await loadReferralNetwork();
    if (activeAdminView === "data-tools") {
      await loadDataToolsCounts();
    }
    closeNetworkImportModal();
  } catch (error) {
    networkStatusEl.textContent = error.message || "Could not import providers yet.";
    console.error(error);
  } finally {
    confirmNetworkImportButton.disabled = false;
  }
}

async function previewNetworkCsv(file) {
  if (!file) {
    return;
  }

  networkStatusEl.textContent = `Previewing ${file.name}...`;

  try {
    const text = await file.text();
    const parsed = parseCsv(text);

    if (parsed.length < 2) {
      throw new Error("The CSV does not contain any provider rows.");
    }

    const columns = parsed[0].map((column) => column.trim());
    const rows = parsed.slice(1).map((values) =>
      Object.fromEntries(columns.map((column, index) => [column, values[index] || ""]))
    );
    const analysis = analyzeNetworkImport(rows, columns);
    latestNetworkImportAnalysis = analysis;
    renderNetworkImportPreview(analysis, file.name);
    openNetworkImportModal();
    networkStatusEl.textContent = "Provider import preview ready.";
  } catch (error) {
    latestNetworkImportAnalysis = null;
    confirmNetworkImportButton.hidden = true;
    networkStatusEl.textContent = error.message || "Could not preview this CSV.";
    networkImportDetail.innerHTML = "";
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = error.message || "Could not preview this CSV.";
    networkImportDetail.append(message);
    openNetworkImportModal();
    console.error(error);
  } finally {
    networkCsvInput.value = "";
  }
}

async function importPreviewedAppointments() {
  if (!latestAppointmentImportAnalysis) {
    dataToolsStatusEl.textContent = "Preview a CSV export before importing appointments.";
    return;
  }

  const appointmentsToImport = latestAppointmentImportAnalysis.importableAppointments;

  if (!appointmentsToImport.length) {
    dataToolsStatusEl.textContent = "No valid appointment rows are ready to import.";
    return;
  }

  const confirmed = window.confirm(`Import ${appointmentsToImport.length} appointments now? Conflicts and out-of-window rows will be skipped.`);

  if (!confirmed) {
    return;
  }

  confirmAppointmentImportButton.disabled = true;
  dataToolsStatusEl.textContent = "Importing appointments...";

  try {
    const response = await authedFetch("/api/appointments/import", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ appointments: appointmentsToImport })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const result = await response.json();
    latestAppointmentImportAnalysis = null;
    confirmAppointmentImportButton.hidden = true;
    await loadAppointments();
    await loadDataToolsCounts();
    closeAppointmentImportModal();
    dataToolsStatusEl.textContent = `Imported ${result.importedCount} appointments${result.skipped?.length ? `; skipped ${result.skipped.length}` : ""}.`;
  } catch (error) {
    dataToolsStatusEl.textContent = error.message || "Could not import appointments yet.";
    console.error(error);
  } finally {
    confirmAppointmentImportButton.disabled = false;
  }
}

async function previewAppointmentCsv(file) {
  if (!file) {
    return;
  }

  dataToolsStatusEl.textContent = `Previewing ${file.name}...`;

  try {
    const text = await file.text();
    const parsed = parseCsv(text);

    if (parsed.length < 2) {
      throw new Error("The CSV export does not contain any appointment rows.");
    }

    const columns = parsed[0].map((column) => column.trim());
    const rows = parsed.slice(1).map((values) =>
      Object.fromEntries(columns.map((column, index) => [column, values[index] || ""]))
    );
    const analysis = analyzeAppointmentImport(rows, columns);
    latestAppointmentImportAnalysis = analysis;
    renderAppointmentImportPreview(analysis, file.name);
    openAppointmentImportModal();
    dataToolsStatusEl.textContent = "Appointment import preview ready.";
  } catch (error) {
    latestAppointmentImportAnalysis = null;
    confirmAppointmentImportButton.hidden = true;
    dataToolsStatusEl.textContent = error.message || "Could not preview this appointment export.";
    appointmentImportDetail.innerHTML = "";
    const message = document.createElement("p");
    message.className = "empty-state";
    message.textContent = error.message || "Could not preview this appointment export.";
    appointmentImportDetail.append(message);
    openAppointmentImportModal();
    console.error(error);
  } finally {
    appointmentCsvInput.value = "";
  }
}

async function loadReferrals() {
  if (!currentUser) {
    referralsStatusEl.textContent = "";
    referralsList.innerHTML = "";
    referralDetail.innerHTML = "";
    return;
  }

  referralsStatusEl.textContent = "Loading referrals...";

  try {
    const response = await authedFetch("/api/referrals");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedReferrals = data.referrals.filter((referral) => !referral.convertedClientId);
    renderReferralSummary();
    renderReferrals();
    renderActiveAdminComputedViews();
    renderReferralSourceOptions();
    renderTaskRelatedOptions(taskReferralIdInput.value || taskClientIdInput.value);
    renderWorkflowTasks();
    if (!referralModal.hidden && selectedReferralId) {
      renderReferralDetail();
    }
    setReferralsLoadedStatus();
  } catch (error) {
    referralsStatusEl.textContent = "Could not load referrals yet.";
    console.error(error);
  }
}

async function loadClients() {
  if (!currentUser) {
    clientsStatusEl.textContent = "";
    clientsList.innerHTML = "";
    clientDetail.innerHTML = "";
    return;
  }

  clientsStatusEl.textContent = "Loading clients...";

  try {
    const response = await authedFetch("/api/clients");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedClients = data.clients;
    renderClientSummary();
    renderClients();
    renderActiveAdminComputedViews();
    renderAppointmentClientOptions(appointmentClientSelect.value);
    renderTaskRelatedOptions(taskReferralIdInput.value || taskClientIdInput.value);
    renderAppointments();
    renderWorkflowTasks();
    renderActiveAdminComputedViews();
    if (!clientModal.hidden && selectedClientId) {
      renderClientDetail();
    }
    setClientsLoadedStatus();
  } catch (error) {
    clientsStatusEl.textContent = "Could not load clients yet.";
    console.error(error);
  }
}

async function loadReferralNetwork() {
  if (!currentUser) {
    networkStatusEl.textContent = "";
    networkList.innerHTML = "";
    networkDetail.innerHTML = "";
    return;
  }

  networkStatusEl.textContent = "Loading referral network...";

  try {
    const response = await authedFetch("/api/referral-network");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedNetworkEntries = data.entries;
    renderReferralNetwork();
    renderReferralSourceOptions();
    renderReferralProviderLinkEditor();
    renderClientProviderLinkEditor();
    if (!networkModal.hidden && selectedNetworkEntryId) {
      renderNetworkDetail();
    }
    networkStatusEl.textContent = "";
  } catch (error) {
    networkStatusEl.textContent = "Could not load referral network yet.";
    console.error(error);
  }
}

async function loadOutreachEvents() {
  if (!currentUser) {
    outreachStatusEl.textContent = "";
    outreachList.innerHTML = "";
    outreachDetail.innerHTML = "";
    outreachSummary.innerHTML = "";
    outreachEventFlowBoard.innerHTML = "";
    return;
  }

  outreachStatusEl.textContent = "Loading outreach events...";

  try {
    const response = await authedFetch("/api/outreach-events");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedOutreachEvents = data.events;
    renderOutreachEvents();
    renderOutreachEventOptions(outreachContactEventSelect.value);
    renderOutreachDashboard();
    renderActiveAdminComputedViews();
    if (!outreachModal.hidden && selectedOutreachEventId) {
      renderOutreachDetail();
    }
    outreachStatusEl.textContent = "";
  } catch (error) {
    outreachStatusEl.textContent = "Could not load outreach events yet.";
    console.error(error);
  }
}

async function loadOutreachContacts() {
  if (!currentUser) {
    outreachContactStatusEl.textContent = "";
    outreachContactList.innerHTML = "";
    outreachContactDetail.innerHTML = "";
    return;
  }

  outreachContactStatusEl.textContent = "Loading outreach contacts...";

  try {
    const response = await authedFetch("/api/outreach-contacts");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedOutreachContacts = data.contacts;
    renderOutreachContacts();
    renderOutreachDashboard();
    if (!outreachContactModal.hidden && selectedOutreachContactId) {
      renderOutreachContactDetail();
    }
    outreachContactStatusEl.textContent = "";
  } catch (error) {
    outreachContactStatusEl.textContent = "Could not load outreach contacts yet.";
    console.error(error);
  }
}

async function loadAppointments() {
  if (!currentUser) {
    appointmentsStatusEl.textContent = "";
    appointmentsList.innerHTML = "";
    appointmentSummary.innerHTML = "";
    return;
  }

  appointmentsStatusEl.textContent = "Loading appointments...";

  try {
    const response = await authedFetch("/api/appointments");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedAppointments = data.appointments;
    renderAppointments();
    renderActiveAdminComputedViews();
    appointmentsStatusEl.textContent = "";
  } catch (error) {
    appointmentsStatusEl.textContent = "Could not load appointments yet.";
    console.error(error);
  }
}

async function loadTasks() {
  if (!currentUser) {
    tasksStatusEl.textContent = "";
    workflowTaskSummary.innerHTML = "";
    workflowTaskList.innerHTML = "";
    return;
  }

  tasksStatusEl.textContent = "Loading tasks...";

  try {
    const response = await authedFetch("/api/tasks");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedTasks = data.tasks;
    renderWorkflowTasks();
    tasksStatusEl.textContent = "";
  } catch (error) {
    tasksStatusEl.textContent = "Could not load tasks yet.";
    console.error(error);
  }
}

async function loadActivityLogs() {
  if (!currentUser) {
    loadedActivityLogs = [];
    return;
  }

  try {
    const response = await authedFetch("/api/activity-logs");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedActivityLogs = data.activityLogs || [];
    if (!clientModal.hidden && selectedClientId) {
      renderClientDetail();
    }
    if (!referralModal.hidden && selectedReferralId) {
      renderReferralDetail();
    }
  } catch (error) {
    console.error(error);
  }
}

async function loadGrants() {
  if (!currentUser) {
    loadedGrants = [];
    renderGrants();
    return;
  }

  grantsStatusEl.textContent = "Loading grants...";

  try {
    const response = await authedFetch("/api/grants");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedGrants = data.grants || [];
    renderGrants();
    grantsStatusEl.textContent = "";
  } catch (error) {
    grantsStatusEl.textContent = "Could not load grants yet.";
    console.error(error);
  }
}

async function loadGrantQuestions() {
  if (!currentUser) {
    loadedGrantQuestions = [];
    renderGrantQuestions();
    return;
  }

  try {
    const response = await authedFetch("/api/grant-questions");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedGrantQuestions = data.questions || [];
    renderGrantQuestions();
  } catch (error) {
    grantsStatusEl.textContent = "Could not load grant questions yet.";
    console.error(error);
  }
}

async function loadGrantOrganizationInfo() {
  if (!currentUser) {
    loadedGrantOrganizationInfo = null;
    return;
  }

  try {
    const response = await authedFetch("/api/grant-organization-info");

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    loadedGrantOrganizationInfo = data.organizationInfo || null;
    fillGrantOrganizationForm();
  } catch (error) {
    grantsStatusEl.textContent = "Could not load organization info yet.";
    console.error(error);
  }
}

async function saveActivityLog(event) {
  event.preventDefault();

  if (!currentUser) {
    clientsStatusEl.textContent = "Sign in before logging activity.";
    return;
  }

  const formData = new FormData(activityLogForm);
  const activityLog = Object.fromEntries(formData.entries());
  activityLog.activityTime = normalizeAppointmentTime(activityLog.activityTime);
  saveActivityLogButton.disabled = true;

  try {
    const response = await authedFetch("/api/activity-logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(activityLog)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    closeActivityLogModal();
    await loadActivityLogs();

    if (activityLog.relatedType === "referral") {
      referralsStatusEl.textContent = `${activityLog.type} logged.`;
      await loadReferrals();
    } else {
      clientsStatusEl.textContent = `${activityLog.type} logged.`;
      await loadClients();
    }
  } catch (error) {
    const statusElement = activityLog.relatedType === "referral" ? referralsStatusEl : clientsStatusEl;
    statusElement.textContent = error.message || "Could not log activity yet.";
    console.error(error);
  } finally {
    saveActivityLogButton.disabled = false;
  }
}

async function saveTask(event) {
  event.preventDefault();

  if (!currentUser) {
    tasksStatusEl.textContent = "Sign in before saving a task.";
    return;
  }

  resolveTaskRelatedId();
  const formData = new FormData(taskForm);
  const task = Object.fromEntries(formData.entries());
  task.clientId = taskClientIdInput.value;
  task.referralId = taskReferralIdInput.value;
  task.appointmentId = taskAppointmentIdInput.value;
  const client = loadedClients.find((item) => item.id === task.clientId);
  task.clientName = client ? clientName(client) : "";
  task.dueTime = "";
  const isEditing = Boolean(editingTaskId);

  if (!task.title.trim()) {
    tasksStatusEl.textContent = "Task title is required.";
    taskForm.elements.title.focus();
    return;
  }

  tasksStatusEl.textContent = isEditing ? "Updating task..." : "Saving task...";
  saveTaskButton.disabled = true;

  try {
    const path = isEditing ? `/api/tasks/${encodeURIComponent(editingTaskId)}` : "/api/tasks";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    resetTaskForm();
    closeTaskModal();
    await loadTasks();
    tasksStatusEl.textContent = isEditing ? "Task updated." : "Task saved.";
  } catch (error) {
    tasksStatusEl.textContent = error.message || "Could not save task yet.";
    console.error(error);
  } finally {
    saveTaskButton.disabled = false;
  }
}

async function updateTaskStatus(task, status, options = {}) {
  if (!currentUser) {
    tasksStatusEl.textContent = "Sign in before updating a task.";
    return;
  }

  tasksStatusEl.textContent = "Updating task...";

  try {
    const response = await authedFetch(`/api/tasks/${encodeURIComponent(task.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...task, status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    if (editingTaskId === task.id) {
      resetTaskForm();
    }
    await loadTasks();
    if (!flowArchiveModal.hidden) {
      closeFlowArchive();
    }
    if (options.showUndo) {
      showTaskUndoToast(task, options.previousStatus || task.status || "Open");
    }
    tasksStatusEl.textContent = options.statusMessage || "Task updated.";
  } catch (error) {
    tasksStatusEl.textContent = error.message || "Could not update task yet.";
    console.error(error);
  }
}

async function moveTaskToColumn(taskId, columnKey) {
  const task = loadedTasks.find((item) => item.id === taskId);
  const nextType = taskTypeForColumnKey(columnKey);

  if (!task || taskTypeForColumn(task) === nextType) {
    return;
  }

  tasksStatusEl.textContent = "Moving task...";

  try {
    const response = await authedFetch(`/api/tasks/${encodeURIComponent(task.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...task, type: nextType })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    await loadTasks();
    tasksStatusEl.textContent = "Task moved.";
  } catch (error) {
    tasksStatusEl.textContent = error.message || "Could not move task yet.";
    console.error(error);
  }
}

async function deleteTaskRecord() {
  if (!editingTaskId) {
    return;
  }

  const task = loadedTasks.find((item) => item.id === editingTaskId);
  const confirmed = window.confirm(`Delete task "${task?.title || "Untitled task"}"? This cannot be undone.`);

  if (!confirmed) {
    return;
  }

  tasksStatusEl.textContent = "Deleting task...";
  deleteTaskButton.disabled = true;

  try {
    const response = await authedFetch(`/api/tasks/${encodeURIComponent(editingTaskId)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    resetTaskForm();
    closeTaskModal();
    await loadTasks();
    tasksStatusEl.textContent = "Task deleted.";
  } catch (error) {
    tasksStatusEl.textContent = error.message || "Could not delete task yet.";
    console.error(error);
  } finally {
    deleteTaskButton.disabled = false;
  }
}

function startDayTaskExists(candidate) {
  return loadedTasks.some((task) => {
    const sameDayGeneratedTask = isGeneratedWorkflowTask(task) && task.dueDate === candidate.dueDate;
    if (!isActiveTask(task) && !sameDayGeneratedTask) {
      return false;
    }

    return startDayTaskMatchesCandidate(task, candidate);
  });
}

function startDayTaskTitleExists(title) {
  const normalizedTitle = normalizedStartDayTitle(title);
  return loadedTasks.some((task) => {
    const rawTitle = normalizedStartDayTitle(task.title || "");
    const displayTitle = normalizedStartDayTitle(taskDisplayTitle(task));
    return rawTitle === normalizedTitle || displayTitle === normalizedTitle;
  });
}

function normalizedStartDayTitle(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function startDayTaskIntent(title) {
  const normalized = normalizedStartDayTitle(title);

  if (normalized.includes("reschedule")) {
    return "reschedule";
  }

  if (normalized.includes("schedule") || normalized.includes("new referral")) {
    return "schedule";
  }

  if (normalized.startsWith("prep ")) {
    return "prep";
  }

  if (normalized.includes("update outcome")) {
    return "outcome";
  }

  return normalized.split(" ")[0] || "task";
}

function startDayTaskSubject(title) {
  return normalizedStartDayTitle(title)
    .replace(/^(call|text)\s+new referral\s+/, "")
    .replace(/^(call|text)\s+/, "")
    .replace(/^(schedule|reschedule|prep)\s+/, "")
    .replace(/^update outcome for\s+/, "")
    .replace(/\s+appointment$/, "")
    .trim();
}

function startDayTaskMatchesCandidate(task, candidate) {
  const candidateDisplayTitle = normalizedStartDayTitle(taskDisplayTitle(candidate));
  const taskDisplay = normalizedStartDayTitle(taskDisplayTitle(task));
  const rawTaskTitle = normalizedStartDayTitle(task.title || "");

  if (taskDisplay === candidateDisplayTitle || rawTaskTitle === candidateDisplayTitle) {
    return true;
  }

  const candidateIntent = startDayTaskIntent(candidateDisplayTitle);
  const taskIntent = startDayTaskIntent(taskDisplay);
  const rawTaskIntent = startDayTaskIntent(rawTaskTitle);

  if (candidate.appointmentId && task.appointmentId === candidate.appointmentId) {
    return candidateIntent === taskIntent || candidateIntent === rawTaskIntent;
  }

  if (candidate.clientId && task.clientId === candidate.clientId) {
    if (candidateIntent === "reschedule") {
      return taskIntent === "reschedule" || rawTaskIntent === "reschedule";
    }

    return candidateIntent === taskIntent || candidateIntent === rawTaskIntent;
  }

  if (candidate.referralId && task.referralId === candidate.referralId) {
    if (candidateIntent === "schedule") {
      return taskIntent === "schedule" || rawTaskIntent === "schedule";
    }

    return candidateIntent === taskIntent || candidateIntent === rawTaskIntent;
  }

  const candidateSubject = startDayTaskSubject(candidateDisplayTitle);
  const taskSubject = startDayTaskSubject(taskDisplay);
  const rawTaskSubject = startDayTaskSubject(rawTaskTitle);

  return Boolean(
    candidateSubject &&
    (taskSubject === candidateSubject || rawTaskSubject === candidateSubject) &&
    (taskIntent === candidateIntent || rawTaskIntent === candidateIntent)
  );
}

function startDayCandidateKeys(candidate) {
  const title = normalizedStartDayTitle(taskDisplayTitle(candidate));
  const intent = startDayTaskIntent(title);
  const subject = startDayTaskSubject(title);
  const keys = new Set();

  if (candidate.appointmentId) {
    keys.add(`appointment:${candidate.appointmentId}:${intent}`);
  } else {
    keys.add(`title:${title}`);
  }

  if (candidate.clientId) {
    keys.add(`client:${candidate.clientId}:${intent}`);
  }

  if (candidate.referralId) {
    keys.add(`referral:${candidate.referralId}:${intent}`);
  }

  if (subject) {
    keys.add(`subject:${intent}:${subject}`);
  }

  return [...keys];
}

function uniqueStartDayCandidates(candidates) {
  const seenKeys = new Set();
  const uniqueCandidates = [];

  for (const candidate of candidates) {
    const keys = startDayCandidateKeys(candidate);

    if (keys.some((key) => seenKeys.has(key))) {
      continue;
    }

    keys.forEach((key) => seenKeys.add(key));
    uniqueCandidates.push(candidate);
  }

  return uniqueCandidates;
}

function formatStartDayTaskSummary(tasks) {
  const visibleTasks = tasks.slice(0, 5).map((task) => `${taskTypeForColumn(task)}: ${taskDisplayTitle(task)}`);
  const hiddenCount = tasks.length - visibleTasks.length;
  const suffix = hiddenCount > 0 ? `; +${hiddenCount} more` : "";
  return `Start the Day added ${tasks.length} task${tasks.length === 1 ? "" : "s"}: ${visibleTasks.join("; ")}${suffix}.`;
}

function formatStartDayResultSummary(createdTasks, skippedTasks) {
  if (!createdTasks.length) {
    if (!skippedTasks.length) {
      return "Daily task list is already up to date.";
    }

    const visibleSkipped = skippedTasks.slice(0, 4).map(taskDisplayTitle);
    const hiddenSkipped = skippedTasks.length - visibleSkipped.length;
    const suffix = hiddenSkipped > 0 ? `; +${hiddenSkipped} more` : "";
    return `Daily task list is already up to date. Already existed: ${visibleSkipped.join("; ")}${suffix}.`;
  }

  const createdSummary = formatStartDayTaskSummary(createdTasks);

  if (!skippedTasks.length) {
    return createdSummary;
  }

  return `${createdSummary} ${skippedTasks.length} already existed.`;
}

function dailyTaskCandidates() {
  const today = todayDateString();
  const newReferralTasks = loadedReferrals
    .filter((referral) => normalizeStatus(referral.status) === "New")
    .map((referral) => ({
      title: `Schedule ${referralName(referral)}`,
      type: "Call",
      status: "Open",
      priority: "Normal",
      dueDate: today,
      assignedTo: "",
      clientId: "",
      appointmentId: "",
      referralId: referral.id,
      source: "Start the Day",
      notes: ""
    }));
  const rescheduleTasks = loadedClients
    .filter((client) => (client.status || "Scheduled") === "Needs Reschedule")
    .map((client) => {
      const action = contactActionVerb(client);
      return {
        title: `Reschedule ${clientName(client)}`,
        type: action,
        status: "Open",
        priority: "Normal",
        dueDate: today,
        assignedTo: "",
        clientId: client.id,
        appointmentId: "",
        referralId: "",
        source: "Start the Day",
        notes: ""
      };
    });
  const staleAppointmentTasks = loadedAppointments
    .filter((appointment) => (appointment.status || "Scheduled") === "Scheduled" && appointment.appointmentDate < today)
    .map((appointment) => ({
      title: `Update outcome for ${appointmentClientName(appointment)}`,
      type: "Task",
      status: "Open",
      priority: "Normal",
      dueDate: today,
      assignedTo: appointment.staffMember || "",
      clientId: appointmentClientIds(appointment)[0] || appointment.clientId || "",
      appointmentId: appointment.id || "",
      referralId: "",
      source: "Start the Day",
      notes: `Past scheduled appointment from ${formatAppointmentDateTime(appointment)} still needs an outcome: Completed, No-show, Canceled, or Rescheduled.`
    }));
  const appointmentPrepTasks = loadedAppointments
    .filter((appointment) => (appointment.status || "Scheduled") === "Scheduled" && appointment.appointmentDate === today)
    .filter((appointment) => appointmentPrepItems(appointment).length)
    .map((appointment) => ({
      title: `Prep ${appointmentClientName(appointment)} appointment`,
      type: appointmentPrepTaskType(appointment),
      status: "Open",
      priority: "Normal",
      dueDate: today,
      assignedTo: appointment.staffMember || "",
      clientId: appointmentClientIds(appointment)[0] || appointment.clientId || "",
      appointmentId: appointment.id || "",
      referralId: "",
      source: "Start the Day",
      notes: appointmentPrepTaskNotes(appointment)
    }));
  const providerSourcePolishTitle = "Test provider profile referral source sync";
  const providerSourcePolishTasks = startDayTaskTitleExists(providerSourcePolishTitle)
    ? []
    : [
        {
          title: providerSourcePolishTitle,
          type: "Task",
          status: "Open",
          priority: "Normal",
          dueDate: today,
          assignedTo: "",
          clientId: "",
          appointmentId: "",
          referralId: "",
          source: "Polish Queue",
          notes: "Add a provider profile on a referral/client and confirm the referral source updates and links to the provider profile."
        }
      ];

  return uniqueStartDayCandidates([
    ...newReferralTasks,
    ...rescheduleTasks,
    ...staleAppointmentTasks,
    ...appointmentPrepTasks,
    ...providerSourcePolishTasks
  ])
    .filter((task) => !startDayTaskExists(task));
}

async function startDayWorkflow() {
  if (!currentUser) {
    tasksStatusEl.textContent = "Sign in before starting the day.";
    return;
  }

  const candidates = dailyTaskCandidates();

  if (!candidates.length) {
    tasksStatusEl.textContent = "Daily task list is already up to date.";
    return;
  }

  tasksStatusEl.textContent = `Creating ${candidates.length} daily task${candidates.length === 1 ? "" : "s"}...`;
  startDayButton.disabled = true;

  try {
    const createdTasks = [];
    const skippedTasks = [];

    for (const task of candidates) {
      const response = await authedFetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API returned ${response.status}`);
      }

      const result = await response.json().catch(() => ({}));
      if (result.duplicate) {
        skippedTasks.push(result.task || task);
      } else {
        createdTasks.push(result.task || task);
      }
    }

    await loadTasks();
    tasksStatusEl.textContent = formatStartDayResultSummary(createdTasks, skippedTasks);
  } catch (error) {
    tasksStatusEl.textContent = error.message || "Could not start the day yet.";
    console.error(error);
  } finally {
    startDayButton.disabled = false;
  }
}

function referralFormField(name) {
  return referralForm?.elements?.namedItem(name) || null;
}

function setReferralFormFieldValue(name, value) {
  const field = referralFormField(name);
  if (field) {
    field.value = value;
  }
}

function setReferralFormFieldChecked(name, value) {
  const field = referralFormField(name);
  if (field) {
    field.checked = Boolean(value);
  }
}

function syncReferralEditAvatar() {
  if (!referralEditAvatar || !referralForm?.elements) {
    return;
  }

  const firstInitial = String(referralFormField("firstName")?.value || "").trim().charAt(0);
  const lastInitial = String(referralFormField("lastName")?.value || "").trim().charAt(0);
  referralEditAvatar.textContent = `${firstInitial}${lastInitial}`.trim().toUpperCase() || "--";
}

function syncReferralSourceDisplay() {
  if (!referralSourceDisplay || !referralForm?.elements) {
    return;
  }

  const source = String(referralFormField("referralSource")?.value || "").trim();
  setProfileSourceDisplay(referralSourceDisplay, source);
}

function syncReferralSourceFromProviderLink(link) {
  if (!link?.providerName) {
    return;
  }

  setReferralFormFieldValue("referralSource", link.providerName);
  syncReferralSourceDisplay();
}

function setProfileSourceDisplay(displayElement, source) {
  if (!displayElement) {
    return;
  }

  const value = String(source || "").trim();
  displayElement.textContent = value || "None linked yet";
  displayElement.classList.toggle("is-empty", !value);
}

function syncReferralEditStatusColor() {
  const statusField = referralFormField("status");
  if (statusField) {
    applyStatusSelectColor(statusField, statusField.value || "New");
  }
}

function referralEditStageIndex(status) {
  const normalized = normalizeStatus(status);

  if (normalized === "Scheduled") {
    return 2;
  }

  if (["Not Interested", "Closed / No Further Outreach"].includes(normalized)) {
    return 3;
  }

  if (["Texted", "Left Voicemail", "Emailed", "Requested Call Back", "Caregiver Will Call Back"].includes(normalized)) {
    return 1;
  }

  return 0;
}

function syncReferralEditProgress() {
  if (!referralEditLessonDots) {
    return;
  }

  const status = referralFormField("status")?.value || "New";
  const currentIndex = referralEditStageIndex(status);
  const steps = [
    { label: "New", accent: "var(--brand-red)" },
    { label: "Contacted", accent: "var(--brand-green)" },
    { label: "Scheduled", accent: "var(--brand-blue)" },
    { label: "Closed", accent: "var(--muted)" }
  ];

  referralEditLessonDots.innerHTML = "";

  steps.forEach((step, index) => {
    const dot = document.createElement("span");
    dot.className = `lesson-dot${index < currentIndex ? " done" : ""}${index === currentIndex ? " next" : ""}`;
    dot.style.setProperty("--lesson-accent", step.accent);

    const label = document.createElement("strong");
    label.textContent = step.label;
    const state = document.createElement("span");
    state.textContent = index < currentIndex ? "Done" : index === currentIndex ? "Next" : "";

    dot.append(label, state);
    referralEditLessonDots.append(dot);
  });
}

function syncReferralEditNotesPreview() {
  if (!referralEditNotesPreview) {
    return;
  }

  const notes = String(referralFormField("notes")?.value || "").trim();
  referralEditNotesPreview.textContent = notes || "No notes added yet.";
}

function syncReferralEditSiblingSummary(referral = {}) {
  if (!referralEditSiblingSummary) {
    return;
  }

  const siblingIds = Array.isArray(referral.siblingIds) ? referral.siblingIds : [];
  const siblingNames = siblingIds
    .map((id) => loadedReferrals.find((item) => item.id === id))
    .filter(Boolean)
    .map(referralName);
  referralEditSiblingSummary.textContent = siblingNames.length ? siblingNames.join(", ") : "None linked yet";
}

function syncReferralEditChrome(referral = {}) {
  syncReferralEditAvatar();
  syncReferralSourceDisplay();
  syncReferralEditStatusColor();
  syncReferralEditSiblingSummary(referral);
  syncReferralEditProgress();
  syncReferralEditNotesPreview();
}

function setReferralFormValues(referral = {}) {
  const providerLinks = Array.isArray(referral.providerLinks) ? [...referral.providerLinks] : [];
  const providerSource = providerLinks[0]?.providerName || "";

  setReferralFormFieldValue("firstName", referral.firstName || "");
  setReferralFormFieldValue("lastName", referral.lastName || "");
  setReferralFormFieldValue("parentName", referral.parentName || "");
  setReferralFormFieldValue("phone", referral.phone || "");
  setReferralFormFieldValue("email", referral.email || "");
  setReferralFormFieldValue("preferredLanguage", referral.preferredLanguage || "English");
  setReferralFormFieldValue("status", normalizeStatus(referral.status || "New"));
  setReferralFormFieldValue("preferredContactMethod", referral.preferredContactMethod || "");
  setReferralFormFieldValue("referralType", referral.referralType || "Internal Clinic Referral");
  setReferralFormFieldValue("referralSource", referral.referralSource || providerSource);
  setReferralFormFieldValue("dateOfBirth", referral.dateOfBirth || "");
  setReferralFormFieldValue("gender", referral.gender || "Unspecified");
  setReferralFormFieldChecked("ycco", truthyProfileValue(referral.ycco));
  setReferralFormFieldChecked("hrsn", truthyProfileValue(referral.hrsn));
  setReferralFormFieldValue("assessmentScore", referral.assessmentScore ?? "");
  setReferralFormFieldValue("willingnessScore", referral.willingnessScore ?? "");
  setReferralFormFieldValue("referralDate", referral.referralDate || "");
  setReferralFormFieldValue("firstContactDate", referral.firstContactDate || "");
  setReferralFormFieldValue("mostRecentContactDate", referral.mostRecentContactDate || "");
  setReferralFormFieldValue("firstAppointmentDate", referral.firstAppointmentDate || "");
  setReferralFormFieldValue("mostRecentAppointmentDate", referral.mostRecentAppointmentDate || "");
  setReferralFormFieldValue("lastAppointmentDate", referral.lastAppointmentDate || "");
  setReferralFormFieldValue("addressStreet", referral.addressStreet || "");
  setReferralFormFieldValue("addressCity", referral.addressCity || "");
  setReferralFormFieldValue("addressState", referral.addressState || "");
  setReferralFormFieldValue("addressZip", referral.addressZip || "");
  setReferralFormFieldChecked("emailOptOut", referral.emailOptOut);
  setReferralFormFieldChecked("textOptOut", referral.textOptOut);
  setReferralFormFieldValue("notes", referral.notes || "");
  editingReferralProviderLinks = providerLinks;
  renderReferralProviderLinkEditor();
  syncReferralEditChrome(referral);
}

async function saveReferral(event) {
  event.preventDefault();

  if (!currentUser) {
    referralsStatusEl.textContent = "Sign in before saving a referral.";
    return;
  }

  const formData = new FormData(referralForm);
  const referral = Object.fromEntries(formData.entries());
  referral.ycco = Boolean(referralFormField("ycco")?.checked);
  referral.hrsn = Boolean(referralFormField("hrsn")?.checked);
  referral.emailOptOut = Boolean(referralFormField("emailOptOut")?.checked);
  referral.textOptOut = Boolean(referralFormField("textOptOut")?.checked);
  referral.providerLinks = editingReferralProviderLinks;
  const isEditing = Boolean(editingReferralId);

  referralsStatusEl.textContent = isEditing ? "Updating referral..." : "Saving referral...";
  saveReferralButton.disabled = true;

  try {
    const path = isEditing ? `/api/referrals/${encodeURIComponent(editingReferralId)}` : "/api/referrals";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(referral)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedReferralId = data.referral?.id || editingReferralId;
    editingReferralId = null;
    referralForm.reset();
    editingReferralProviderLinks = [];
    renderReferralProviderLinkEditor();
    referralsStatusEl.textContent = isEditing ? "Referral updated." : "Referral saved.";
    await loadReferrals();
    referralForm.hidden = true;
    referralDetail.hidden = false;
    syncModalCloseButton();
    renderReferralDetail();
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not save referral yet.";
    console.error(error);
  } finally {
    saveReferralButton.disabled = false;
  }
}

function startNewReferral() {
  editingReferralId = null;
  selectedReferralId = null;
  referralForm.reset();
  setReferralFormValues({ status: "New", preferredLanguage: "English", referralType: "Internal Clinic Referral", gender: "Unspecified" });
  renderReferralSourceOptions();
  formTitle.textContent = "New Referral";
  saveReferralButton.textContent = "Save referral";
  cancelEditButton.hidden = false;
  referralForm.hidden = false;
  referralDetail.hidden = true;
  syncModalCloseButton();
  openReferralModal();
  referralsStatusEl.textContent = "Creating a new referral.";
}

function startEditingReferral(referral) {
  editingReferralId = referral.id;
  selectedReferralId = referral.id;
  setReferralFormValues(referral);
  renderReferralSourceOptions();
  formTitle.textContent = `Edit ${referralName(referral)}`;
  saveReferralButton.textContent = "Update referral";
  cancelEditButton.hidden = false;
  referralForm.hidden = false;
  referralDetail.hidden = true;
  syncModalCloseButton();
  openReferralModal();
  referralsStatusEl.textContent = `Editing ${referralName(referral)}.`;
}

function stopEditingReferral() {
  editingReferralId = null;
  formTitle.textContent = "New Referral";
  saveReferralButton.textContent = "Save referral";
  cancelEditButton.hidden = true;
  editingReferralProviderLinks = [];
  renderReferralProviderLinkEditor();
  referralForm.hidden = true;
  referralDetail.hidden = false;
  syncModalCloseButton();
  renderReferralDetail();
}

function clientProgramGoalItems(client = {}) {
  const goalsByKey = new Map();
  clientAppointments(client).forEach((appointment, index) => {
    const goal = appointmentGoalText(appointment).trim();
    if (!goal) {
      return;
    }

    const lessonNumber = Number(appointment.lesson);
    const hasLesson = Number.isFinite(lessonNumber) && lessonNumber > 0;
    const key = hasLesson ? `lesson-${lessonNumber}` : `appointment-${appointment.id || index}`;
    goalsByKey.set(key, {
      label: hasLesson ? `Lesson ${lessonNumber}` : `Appointment ${index + 1}`,
      goal,
      lessonSort: hasLesson ? lessonNumber : 99,
      appointmentDate: appointment.appointmentDate || "",
      appointmentTime: appointment.appointmentTime || ""
    });
  });

  return Array.from(goalsByKey.values())
    .sort(
      (first, second) =>
        first.lessonSort - second.lessonSort ||
        dateValue(first.appointmentDate, 1) - dateValue(second.appointmentDate, 1) ||
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime)
    )
    .slice(0, 8);
}

function syncClientEditProgramProgress(client = {}) {
  if (!clientEditLessonDots || !clientEditGoalsList) {
    return;
  }

  const completedIndex = clientCompletedLessonIndex(client);
  const items = [
    { label: "Enroll", done: completedIndex >= 0 },
    ...Array.from({ length: 7 }, (_, index) => {
      const lesson = index + 1;
      return { label: `L${lesson}`, done: completedIndex >= lesson };
    })
  ];
  const firstPendingIndex = items.findIndex((item) => !item.done);
  clientEditLessonDots.innerHTML = "";

  items.forEach((item, index) => {
    const dot = document.createElement("span");
    dot.className = "lesson-dot";
    dot.style.setProperty("--lesson-accent", profileLessonAccent(index));
    if (item.done) {
      dot.classList.add("done");
    } else if (index === firstPendingIndex) {
      dot.classList.add("next");
    }

    const label = document.createElement("strong");
    label.textContent = item.label;
    const state = document.createElement("span");
    state.textContent = item.done ? "Done" : index === firstPendingIndex ? "Next" : "";
    dot.append(label, state);
    clientEditLessonDots.append(dot);
  });

  const goals = clientProgramGoalItems(client);
  clientEditGoalsList.innerHTML = "";
  if (!goals.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = "No goals added yet.";
    clientEditGoalsList.append(empty);
    return;
  }

  for (const item of goals) {
    const row = document.createElement("div");
    row.className = "goal-row";
    const label = document.createElement("span");
    label.textContent = item.label;
    const value = document.createElement("strong");
    value.textContent = item.goal;
    row.append(label, value);
    clientEditGoalsList.append(row);
  }
}

function clientFormField(name) {
  return clientForm?.elements?.namedItem(name) || null;
}

function setClientFormFieldValue(name, value) {
  const field = clientFormField(name);
  if (field) {
    field.value = value;
  }
}

function setClientFormFieldChecked(name, value) {
  const field = clientFormField(name);
  if (field) {
    field.checked = Boolean(value);
  }
}

function syncClientEditAvatar() {
  if (!clientEditAvatar || !clientForm?.elements) {
    return;
  }

  const firstInitial = String(clientFormField("firstName")?.value || "").trim().charAt(0);
  const lastInitial = String(clientFormField("lastName")?.value || "").trim().charAt(0);
  clientEditAvatar.textContent = `${firstInitial}${lastInitial}`.trim().toUpperCase() || "--";
}

function syncClientReferralSourceDisplay() {
  if (!clientReferralSourceDisplay || !clientForm?.elements) {
    return;
  }

  const source = String(clientFormField("referralSource")?.value || "").trim();
  setProfileSourceDisplay(clientReferralSourceDisplay, source);
}

function syncClientEditStatusColor() {
  const statusField = clientFormField("status");
  if (statusField) {
    applyClientStatusSelectColor(statusField, statusField.value || "Scheduled");
  }
}

function syncClientEditSiblingSummary(client = {}) {
  if (!clientEditSiblingSummary) {
    return;
  }

  const siblingIds = Array.isArray(client.siblingIds) ? client.siblingIds : [];
  const siblingNames = siblingIds
    .map((id) => loadedClients.find((item) => item.id === id))
    .filter(Boolean)
    .map(clientName);
  clientEditSiblingSummary.textContent = siblingNames.length ? siblingNames.join(", ") : "None linked yet";
}

function syncClientEditChrome(client = {}) {
  syncClientEditAvatar();
  syncClientReferralSourceDisplay();
  syncClientEditStatusColor();
  syncClientEditSiblingSummary(client);
  syncClientEditProgramProgress(client);
}

function setClientFormValues(client = {}) {
  setClientFormFieldValue("firstName", client.firstName || "");
  setClientFormFieldValue("lastName", client.lastName || "");
  setClientFormFieldValue("parentName", client.parentName || "");
  setClientFormFieldValue("phone", client.phone || "");
  setClientFormFieldValue("email", client.email || "");
  setClientFormFieldValue("preferredLanguage", client.preferredLanguage || "English");
  setClientFormFieldValue("status", client.status || "Scheduled");
  setClientFormFieldValue("preferredContactMethod", client.preferredContactMethod || "");
  setClientFormFieldValue("referralType", client.referralType || "");
  setClientFormFieldValue("referralSource", client.referralSource || "");
  setClientFormFieldValue("dateOfBirth", client.dateOfBirth || "");
  setClientFormFieldValue("gender", client.gender || "Unspecified");
  setClientFormFieldChecked("ycco", truthyProfileValue(client.ycco));
  setClientFormFieldChecked("hrsn", truthyProfileValue(client.hrsn));
  setClientFormFieldValue("assessmentScore", client.assessmentScore ?? "");
  setClientFormFieldValue("willingnessScore", client.willingnessScore ?? "");
  setClientFormFieldValue("referralDate", client.referralDate || "");
  setClientFormFieldValue("firstContactDate", client.firstContactDate || "");
  setClientFormFieldValue("mostRecentContactDate", client.mostRecentContactDate || "");
  setClientFormFieldValue("firstAppointmentDate", client.firstAppointmentDate || "");
  setClientFormFieldValue("mostRecentAppointmentDate", client.mostRecentAppointmentDate || "");
  setClientFormFieldValue("lastAppointmentDate", client.lastAppointmentDate || "");
  setClientFormFieldValue("addressStreet", client.addressStreet || "");
  setClientFormFieldValue("addressCity", client.addressCity || "");
  setClientFormFieldValue("addressState", client.addressState || "");
  setClientFormFieldValue("addressZip", client.addressZip || "");
  setClientFormFieldChecked("emailOptOut", client.emailOptOut);
  setClientFormFieldChecked("textOptOut", client.textOptOut);
  setClientFormFieldValue("notes", client.notes || "");
  editingClientProviderLinks = Array.isArray(client.providerLinks) ? [...client.providerLinks] : [];
  renderClientProviderLinkEditor();
  syncClientEditChrome(client);
}

async function saveClient(event) {
  event.preventDefault();

  if (!currentUser) {
    clientsStatusEl.textContent = "Sign in before saving a client.";
    return;
  }

  const formData = new FormData(clientForm);
  const client = Object.fromEntries(formData.entries());
  client.ycco = Boolean(clientFormField("ycco")?.checked);
  client.hrsn = Boolean(clientFormField("hrsn")?.checked);
  client.emailOptOut = Boolean(clientFormField("emailOptOut")?.checked);
  client.textOptOut = Boolean(clientFormField("textOptOut")?.checked);
  client.providerLinks = editingClientProviderLinks;
  const isEditing = Boolean(editingClientId);

  clientsStatusEl.textContent = isEditing ? "Updating client..." : "Saving client...";
  saveClientButton.disabled = true;

  try {
    const path = isEditing ? `/api/clients/${encodeURIComponent(editingClientId)}` : "/api/clients";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(client)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedClientId = data.client?.id || editingClientId;
    editingClientId = null;
    clientForm.reset();
    editingClientProviderLinks = [];
    renderClientProviderLinkEditor();
    clientsStatusEl.textContent = isEditing ? "Client updated." : "Client saved.";
    await loadClients();
    clientForm.hidden = true;
    clientDetail.hidden = false;
    renderClientDetail();
  } catch (error) {
    clientsStatusEl.textContent = error.message || "Could not save client yet.";
    console.error(error);
  } finally {
    saveClientButton.disabled = false;
  }
}

async function saveNetworkEntry(event) {
  event.preventDefault();

  if (!currentUser) {
    networkStatusEl.textContent = "Sign in before saving a network entry.";
    return;
  }

  const formData = new FormData(networkForm);
  const entry = Object.fromEntries(formData.entries());
  entry.type = normalizeNetworkType(entry.type);
  const isEditing = Boolean(editingNetworkEntryId);

  networkStatusEl.textContent = isEditing ? "Updating network entry..." : "Saving network entry...";
  saveNetworkEntryButton.disabled = true;

  try {
    const path = isEditing ? `/api/referral-network/${encodeURIComponent(editingNetworkEntryId)}` : "/api/referral-network";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedNetworkEntryId = data.entry?.id || editingNetworkEntryId;
    networkForm.reset();
    networkStatusEl.textContent = isEditing ? "Network entry updated." : "Network entry saved.";
    await loadReferralNetwork();
    networkForm.hidden = true;
    networkDetail.hidden = false;
    renderNetworkDetail();
  } catch (error) {
    networkStatusEl.textContent = error.message || "Could not save network entry yet.";
    console.error(error);
  } finally {
    saveNetworkEntryButton.disabled = false;
  }
}

async function saveOutreachEvent(event) {
  event.preventDefault();

  if (!currentUser) {
    outreachStatusEl.textContent = "Sign in before saving an outreach event.";
    return;
  }

  const formData = new FormData(outreachForm);
  const outreachEvent = Object.fromEntries(formData.entries());
  const isEditing = Boolean(editingOutreachEventId);

  outreachStatusEl.textContent = isEditing ? "Updating outreach event..." : "Saving outreach event...";
  saveOutreachEventButton.disabled = true;

  try {
    const path = isEditing ? `/api/outreach-events/${encodeURIComponent(editingOutreachEventId)}` : "/api/outreach-events";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(outreachEvent)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedOutreachEventId = data.event?.id || editingOutreachEventId;
    editingOutreachEventId = null;
    outreachForm.reset();
    outreachStatusEl.textContent = isEditing ? "Outreach event updated." : "Outreach event saved.";
    await loadOutreachEvents();
    outreachForm.hidden = true;
    outreachDetail.hidden = false;
    renderOutreachDetail();
  } catch (error) {
    outreachStatusEl.textContent = error.message || "Could not save outreach event yet.";
    console.error(error);
  } finally {
    saveOutreachEventButton.disabled = false;
  }
}

async function saveOutreachContact(event) {
  event.preventDefault();

  if (!currentUser) {
    outreachContactStatusEl.textContent = "Sign in before saving an outreach contact.";
    return;
  }

  const formData = new FormData(outreachContactForm);
  const contact = Object.fromEntries(formData.entries());
  const isEditing = Boolean(editingOutreachContactId);

  outreachContactStatusEl.textContent = isEditing ? "Updating outreach contact..." : "Saving outreach contact...";
  saveOutreachContactButton.disabled = true;

  try {
    const path = isEditing ? `/api/outreach-contacts/${encodeURIComponent(editingOutreachContactId)}` : "/api/outreach-contacts";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(contact)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedOutreachContactId = data.contact?.id || editingOutreachContactId;
    editingOutreachContactId = null;
    outreachContactForm.reset();
    outreachContactStatusEl.textContent = isEditing ? "Outreach contact updated." : "Outreach contact saved.";
    await loadOutreachContacts();
    outreachContactForm.hidden = true;
    outreachContactDetail.hidden = false;
    renderOutreachContactDetail();
  } catch (error) {
    outreachContactStatusEl.textContent = error.message || "Could not save outreach contact yet.";
    console.error(error);
  } finally {
    saveOutreachContactButton.disabled = false;
  }
}

async function saveAppointment(event) {
  event.preventDefault();

  if (!currentUser) {
    setAppointmentFeedback("Sign in before saving an appointment.");
    return;
  }

  const formData = new FormData(appointmentForm);
  const appointment = Object.fromEntries(formData.entries());
  const resolvedClientId = resolveAppointmentClientId();
  if (resolvedClientId) {
    addSelectedAppointmentClient(resolvedClientId);
  }
  appointment.clientIds = [...selectedAppointmentClientIds];
  appointment.clientId = appointment.clientIds[0] || "";
  appointment.appointmentTime = normalizeAppointmentTime(appointment.appointmentTime);
  appointment.notes = stripSetmoreBookingIdFromNotes(appointment.notes);
  const typedClientName = appointmentClientSearchInput.value.trim();

  if (appointment.appointmentType === "Nutrition Education") {
    const inferred = inferAppointmentFieldsFromNotes(appointment.notes, appointment.appointmentType);
    appointment.lesson = appointment.lesson || inferred.lesson;
    appointment.goal = appointment.goal || inferred.goal;
  } else {
    appointment.lesson = "";
    appointment.goal = "";
  }

  if (!appointment.clientIds.length && !typedClientName) {
    setAppointmentFeedback("Add a client or type a referral name before saving.");
    appointmentClientSearchInput.focus();
    return;
  }

  if (appointment.clientIds.length) {
    const selectedClients = appointment.clientIds
      .map((clientId) => loadedClients.find((client) => client.id === clientId))
      .filter(Boolean);
    appointment.clientNames = selectedClients.map(clientName);
    appointment.clientName = appointment.clientNames[0] || "";
  } else {
    appointment.clientNames = [typedClientName];
    appointment.clientName = typedClientName;
  }
  const isEditing = Boolean(editingAppointmentId);

  if (!appointmentFitsSchedulingWindow(appointment)) {
    setAppointmentFeedback(schedulingWindowError(appointment));
    appointmentTimeInput.focus();
    return;
  }

  const conflict = appointmentSchedulingConflict(appointment, editingAppointmentId);

  if (conflict) {
    setAppointmentFeedback(appointmentConflictError(conflict));
    appointmentTimeInput.focus();
    return;
  }

  setAppointmentFeedback(isEditing ? "Updating appointment..." : "Saving appointment...");
  saveAppointmentButton.disabled = true;

  try {
    const path = isEditing ? `/api/appointments/${encodeURIComponent(editingAppointmentId)}` : "/api/appointments";
    const response = await authedFetch(path, {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    const savedAppointment = data.appointment || { ...appointment, id: editingAppointmentId };
    const completedRescheduleTasks = Number(data.completedRescheduleTasks || 0);
    await applyAppointmentClientEffects(savedAppointment, savedAppointment.status || appointment.status);
    selectedAppointmentId = savedAppointment.id || editingAppointmentId;
    editingAppointmentId = null;
    appointmentForm.reset();
    closeAppointmentModal();
    setAppointmentFeedback(completedRescheduleTasks
      ? `${isEditing ? "Appointment updated" : "Appointment saved"}; reschedule task completed.`
      : isEditing ? "Appointment updated." : "Appointment saved.");
    await loadClients();
    await loadAppointments();
    await loadTasks();
  } catch (error) {
    setAppointmentFeedback(error.message || "Could not save appointment yet.");
    console.error(error);
  } finally {
    saveAppointmentButton.disabled = false;
  }
}

async function saveAppointmentCheckIn(event) {
  event.preventDefault();

  if (!currentUser) {
    appointmentsStatusEl.textContent = "Sign in before saving check-in details.";
    return;
  }

  const appointment = loadedAppointments.find((item) => item.id === checkInAppointmentId);
  if (!appointment) {
    appointmentsStatusEl.textContent = "Choose an appointment before saving check-in details.";
    return;
  }

  const formData = new FormData(appointmentCheckInForm);
  const checkIn = {
    caregiverMood: String(formData.get("caregiverMood") || appointmentCheckInDefaults.caregiverMood),
    confidence: String(formData.get("confidence") || appointmentCheckInDefaults.confidence),
    participation: String(formData.get("participation") || appointmentCheckInDefaults.participation),
    barriers: String(formData.get("barriers") || appointmentCheckInDefaults.barriers)
  };

  saveAppointmentCheckInButton.disabled = true;
  appointmentsStatusEl.textContent = "Saving check-in...";

  try {
    const response = await authedFetch(`/api/appointments/${encodeURIComponent(appointment.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...appointment, ...checkIn })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedAppointmentId = appointment.id;
    selectedSchedulingPreviewAppointmentId = appointment.id;
    closeAppointmentCheckInModal();
    appointmentsStatusEl.textContent = "Check-in saved.";
    await loadAppointments();
  } catch (error) {
    appointmentsStatusEl.textContent = error.message || "Could not save check-in details yet.";
    console.error(error);
  } finally {
    saveAppointmentCheckInButton.disabled = false;
  }
}

async function saveAppointmentInlineUpdates(appointment, updates, successMessage = "Appointment updated.") {
  if (!currentUser) {
    appointmentsStatusEl.textContent = "Sign in before updating the appointment.";
    return;
  }

  if (!appointment?.id) {
    appointmentsStatusEl.textContent = "Choose an appointment before updating it.";
    return;
  }

  appointmentsStatusEl.textContent = "Saving appointment...";

  try {
    const response = await authedFetch(`/api/appointments/${encodeURIComponent(appointment.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...appointment, ...updates })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedAppointmentId = appointment.id;
    selectedSchedulingPreviewAppointmentId = appointment.id;
    appointmentsStatusEl.textContent = successMessage;
    await loadAppointments();
  } catch (error) {
    appointmentsStatusEl.textContent = error.message || "Could not update appointment yet.";
    console.error(error);
    await loadAppointments();
  }
}

function nextLessonNumberForAppointment(appointment) {
  if (appointmentTypeLabel(appointment) === "Administrative") {
    return null;
  }

  if (appointmentTypeLabel(appointment) === "Enrollment") {
    return 1;
  }

  const lesson = Number.parseInt(String(appointment.lesson || "").replace(/\D/g, ""), 10);

  if (!Number.isFinite(lesson) || lesson < 1) {
    return 1;
  }

  return lesson < 7 ? lesson + 1 : null;
}

function defaultNextAppointmentDate(appointment) {
  const baseDate = appointment.appointmentDate || todayDateString();
  return toDateString(addDays(new Date(`${baseDate}T00:00:00`), 7));
}

function completionScheduleFields() {
  return [
    completionNextDateInput,
    completionNextTimeInput,
    completionNextStaffInput,
    completionNextNotesInput
  ];
}

function syncCompletionScheduleFields() {
  const appointment = loadedAppointments.find((item) => item.id === completingAppointmentId);
  const isRescheduleMode = appointmentCompletionMode === "reschedule";
  const hasNextLesson = appointment ? Boolean(nextLessonNumberForAppointment(appointment)) : true;
  const shouldSchedule = isRescheduleMode || (hasNextLesson && completionScheduleNextInput.checked);
  completionScheduleNextInput.disabled = isRescheduleMode || !hasNextLesson;
  completionNextGoalInput.closest("label").hidden = isRescheduleMode
    ? !appointment || !appointmentCarriesGoal(appointment)
    : !shouldSchedule;
  completionScheduleNextInput.closest("label").hidden = isRescheduleMode || !hasNextLesson;

  for (const field of completionScheduleFields()) {
    const label = field.closest("label");
    if (label) {
      label.hidden = !shouldSchedule;
    }
    field.disabled = !shouldSchedule;
    field.required = shouldSchedule && (field === completionNextDateInput || field === completionNextTimeInput);
  }

  saveAppointmentCompletionButton.textContent = isRescheduleMode
    ? "Reschedule Appointment"
    : shouldSchedule ? "Complete & Schedule" : "Complete Appointment";
  renderCompletionAppointmentTimeOptions();
}

function startCompletingAppointment(appointment) {
  appointmentCompletionMode = "complete";
  completingAppointmentId = appointment.id;
  appointmentCompleteForm.reset();
  const nextLesson = nextLessonNumberForAppointment(appointment);
  const nextLabel = nextLesson ? appointmentLessonTitle(nextLesson) || `Lesson ${nextLesson}` : "Program complete";
  appointmentCompleteTitle.textContent = `Complete ${appointmentClientName(appointment)}`;
  appointmentCompleteSummary.textContent = [
    formatAppointmentDateTime(appointment),
    appointmentTypeLabel(appointment),
    appointmentLessonLabel(appointment)
  ].filter(Boolean).join(" | ");
  completionNextLessonInput.value = nextLabel;
  completionScheduleNextInput.checked = Boolean(nextLesson);
  completionNextDateInput.value = nextLesson ? defaultNextAppointmentDate(appointment) : "";
  completionNextTimeInput.value = nextLesson ? formatAppointmentTime(appointment.appointmentTime) : "";
  completionNextStaffInput.value = appointment.staffMember || "";
  syncCompletionScheduleFields();
  openAppointmentCompletionModal();
}

function startReschedulingAppointment(appointment) {
  appointmentCompletionMode = "reschedule";
  completingAppointmentId = appointment.id;
  appointmentCompleteForm.reset();
  const visitLabel = appointmentLessonLabel(appointment) || appointmentTypeLabel(appointment);
  appointmentCompleteTitle.textContent = `Reschedule ${appointmentClientName(appointment)}`;
  appointmentCompleteSummary.textContent = [
    formatAppointmentDateTime(appointment),
    appointmentTypeLabel(appointment),
    appointmentLessonLabel(appointment)
  ].filter(Boolean).join(" | ");
  completionNextLessonInput.value = visitLabel;
  completionNextGoalInput.value = appointmentGoalText(appointment);
  completionScheduleNextInput.checked = true;
  completionNextDateInput.value = defaultNextAppointmentDate(appointment);
  completionNextTimeInput.value = formatAppointmentTime(appointment.appointmentTime);
  completionNextStaffInput.value = appointment.staffMember || "";
  completionNextNotesInput.value = appointment.notes || "";
  syncCompletionScheduleFields();
  openAppointmentCompletionModal();
}

async function saveAppointmentCompletion(event) {
  event.preventDefault();

  if (!currentUser) {
    appointmentsStatusEl.textContent = "Sign in before completing an appointment.";
    return;
  }

  const appointment = loadedAppointments.find((item) => item.id === completingAppointmentId);

  if (!appointment) {
    appointmentsStatusEl.textContent = "Could not find that appointment.";
    closeAppointmentCompletionModal();
    return;
  }

  if (appointmentCompletionMode === "reschedule") {
    await saveAppointmentReschedule(appointment);
    return;
  }

  const nextLesson = nextLessonNumberForAppointment(appointment);
  const shouldScheduleNext = Boolean(nextLesson && completionScheduleNextInput.checked);
  const nextGoal = completionNextGoalInput.value.trim();
  let nextAppointment = null;

  if (shouldScheduleNext && (!completionNextDateInput.value || !completionNextTimeInput.value)) {
    appointmentsStatusEl.textContent = "Add a date and time for the next appointment.";
    return;
  }

  if (shouldScheduleNext) {
    const nextClients = appointmentClientIds(appointment)
      .map((clientId) => loadedClients.find((client) => client.id === clientId))
      .filter(Boolean);
    nextAppointment = {
      clientIds: appointmentClientIds(appointment),
      clientId: appointmentClientIds(appointment)[0] || "",
      clientNames: nextClients.map(clientName),
      clientName: nextClients[0] ? clientName(nextClients[0]) : appointment.clientName || "",
      appointmentDate: completionNextDateInput.value,
      appointmentTime: normalizeAppointmentTime(completionNextTimeInput.value),
      appointmentType: "Nutrition Education",
      status: "Scheduled",
      lesson: String(nextLesson),
      goal: nextGoal,
      staffMember: completionNextStaffInput.value.trim(),
      notes: completionNextNotesInput.value.trim()
    };

    if (!appointmentFitsSchedulingWindow(nextAppointment)) {
      appointmentsStatusEl.textContent = schedulingWindowError(nextAppointment);
      completionNextTimeInput.focus();
      return;
    }

    const conflict = appointmentSchedulingConflict(nextAppointment);

    if (conflict) {
      appointmentsStatusEl.textContent = appointmentConflictError(conflict);
      completionNextTimeInput.focus();
      return;
    }
  }

  appointmentsStatusEl.textContent = shouldScheduleNext ? "Completing appointment and scheduling next visit..." : "Completing appointment...";
  saveAppointmentCompletionButton.disabled = true;

  try {
    let completedRescheduleTasks = 0;
    const completedAppointment = { ...appointment, status: "Completed" };
    const response = await authedFetch(`/api/appointments/${encodeURIComponent(appointment.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(completedAppointment)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    if (shouldScheduleNext) {
      const createResponse = await authedFetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nextAppointment)
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Next appointment returned ${createResponse.status}`);
      }
      const nextData = await createResponse.json().catch(() => ({}));
      completedRescheduleTasks += Number(nextData.completedRescheduleTasks || 0);
    }

    await applyAppointmentClientEffects(completedAppointment, "Completed", {
      nextAppointmentScheduled: shouldScheduleNext || !nextLesson
    });
    closeAppointmentCompletionModal();
    await loadClients();
    await loadAppointments();
    await loadTasks();
    appointmentsStatusEl.textContent = completedRescheduleTasks
      ? "Appointment completed, next visit scheduled, and reschedule task completed."
      : shouldScheduleNext ? "Appointment completed and next visit scheduled." : "Appointment completed; client marked Reschedule.";
  } catch (error) {
    appointmentsStatusEl.textContent = error.message || "Could not complete appointment yet.";
    console.error(error);
  } finally {
    saveAppointmentCompletionButton.disabled = false;
  }
}

async function saveAppointmentReschedule(appointment) {
  if (!completionNextDateInput.value || !completionNextTimeInput.value) {
    appointmentsStatusEl.textContent = "Add a date and time for the rescheduled appointment.";
    return;
  }

  const normalizedTime = normalizeAppointmentTime(completionNextTimeInput.value);
  const originalTime = normalizeAppointmentTime(appointment.appointmentTime);

  if (appointment.appointmentDate === completionNextDateInput.value && originalTime === normalizedTime) {
    appointmentsStatusEl.textContent = "Choose a new date or time for the rescheduled appointment.";
    completionNextTimeInput.focus();
    return;
  }

  const nextClients = appointmentClientIds(appointment)
    .map((clientId) => loadedClients.find((client) => client.id === clientId))
    .filter(Boolean);
  const rescheduledAppointment = {
    ...appointment,
    status: "Rescheduled"
  };
  const replacementAppointment = {
    clientIds: appointmentClientIds(appointment),
    clientId: appointmentClientIds(appointment)[0] || "",
    clientNames: nextClients.map(clientName),
    clientName: nextClients[0] ? clientName(nextClients[0]) : appointment.clientName || "",
    appointmentDate: completionNextDateInput.value,
    appointmentTime: normalizedTime,
    appointmentType: appointmentTypeLabel(appointment),
    status: "Scheduled",
    lesson: appointment.lesson || "",
    goal: appointmentCarriesGoal(appointment) ? completionNextGoalInput.value.trim() : "",
    staffMember: completionNextStaffInput.value.trim(),
    notes: completionNextNotesInput.value.trim()
  };

  if (!appointmentFitsSchedulingWindow(replacementAppointment)) {
    appointmentsStatusEl.textContent = schedulingWindowError(replacementAppointment);
    completionNextTimeInput.focus();
    return;
  }

  const conflict = appointmentSchedulingConflict(replacementAppointment, appointment.id);

  if (conflict) {
    appointmentsStatusEl.textContent = appointmentConflictError(conflict);
    completionNextTimeInput.focus();
    return;
  }

  appointmentsStatusEl.textContent = "Rescheduling appointment...";
  saveAppointmentCompletionButton.disabled = true;

  let originalAppointmentRetired = false;
  let replacementAppointmentCreated = false;

  try {
    const updateResponse = await authedFetch(`/api/appointments/${encodeURIComponent(appointment.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rescheduledAppointment)
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Original appointment returned ${updateResponse.status}`);
    }

    originalAppointmentRetired = true;

    const createResponse = await authedFetch("/api/appointments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(replacementAppointment)
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({}));
      throw new Error(errorData.error || `Rescheduled appointment returned ${createResponse.status}`);
    }

    replacementAppointmentCreated = true;
    const createData = await createResponse.json().catch(() => ({}));
    const completedRescheduleTasks = Number(createData.completedRescheduleTasks || 0);
    const savedReplacement = createData.appointment || replacementAppointment;
    await applyAppointmentClientEffects(savedReplacement, "Scheduled");
    closeAppointmentCompletionModal();
    await loadClients();
    await loadAppointments();
    await loadTasks();
    appointmentsStatusEl.textContent = completedRescheduleTasks
      ? "Appointment rescheduled and reschedule task completed."
      : "Appointment rescheduled.";
  } catch (error) {
    if (originalAppointmentRetired && !replacementAppointmentCreated) {
      await authedFetch(`/api/appointments/${encodeURIComponent(appointment.id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(appointment)
      }).catch((restoreError) => {
        console.error("Could not restore original appointment after reschedule failure.", restoreError);
      });
    }
    appointmentsStatusEl.textContent = error.message || "Could not reschedule appointment yet.";
    console.error(error);
  } finally {
    saveAppointmentCompletionButton.disabled = false;
  }
}

async function updateAppointmentStatus(appointment, status) {
  rememberSchedulingV2AgendaScroll();

  if (status === "Completed") {
    startCompletingAppointment(appointment);
    return;
  }

  appointmentsStatusEl.textContent = "Updating appointment...";

  try {
    const response = await authedFetch(`/api/appointments/${encodeURIComponent(appointment.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...appointment, status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    await applyAppointmentClientEffects(appointment, status);
    selectedAppointmentId = appointment.id;
    selectedSchedulingPreviewAppointmentId = appointment.id;
    appointmentsStatusEl.textContent = "Appointment updated.";
    await loadClients();
    await loadAppointments();
  } catch (error) {
    appointmentsStatusEl.textContent = error.message || "Could not update appointment yet.";
    console.error(error);
    await loadAppointments();
  }
}

async function applyAppointmentClientEffects(appointment, status, options = {}) {
  const clientIds = appointmentClientIds(appointment);

  if (!clientIds.length) {
    return;
  }

  const sharedUpdates = {};

  if (status === "Completed") {
    sharedUpdates.mostRecentAppointmentDate = appointment.appointmentDate;
    sharedUpdates.status = options.nextAppointmentScheduled === false ? "Needs Reschedule" : "Active";
    const lesson = Number.parseInt(String(appointment.lesson || "").replace(/\D/g, ""), 10);
    if (Number.isFinite(lesson) && lesson >= 1 && lesson <= 7) {
      sharedUpdates.currentLesson = `lesson-${lesson}`;
    } else {
      sharedUpdates.currentLesson = "enrollment";
    }
  }

  if (status === "No-show" || status === "Canceled") {
    sharedUpdates.status = "Needs Reschedule";
  }

  if (status === "Scheduled") {
    sharedUpdates.status = appointmentTypeLabel(appointment) === "Enrollment" ? "Scheduled" : "Active";
  }

  if (!Object.keys(sharedUpdates).length) {
    return;
  }

  for (const clientId of clientIds) {
    const updates = { ...sharedUpdates };

    if (status === "No-show" || status === "Canceled") {
      updates.mostRecentAppointmentDate = mostRecentCompletedAppointmentDateForClientId(clientId, appointment.id);
    }

    const response = await authedFetch(`/api/clients/${encodeURIComponent(clientId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Client update returned ${response.status}`);
    }
  }
}

function providerPayloadForSave(provider) {
  return {
    id: provider.id,
    name: provider.name || "",
    email: provider.email || "",
    notes: provider.notes || ""
  };
}

async function saveNetworkProviders(entry, providers) {
  networkStatusEl.textContent = "Updating providers...";

  try {
    const response = await authedFetch(`/api/referral-network/${encodeURIComponent(entry.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ providers: providers.map(providerPayloadForSave) })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedNetworkEntryId = entry.id;
    editingNetworkProviderId = null;
    networkStatusEl.textContent = "Providers updated.";
    await loadReferralNetwork();
    renderNetworkDetail();
  } catch (error) {
    networkStatusEl.textContent = error.message || "Could not update providers yet.";
    console.error(error);
    await loadReferralNetwork();
  }
}

function addNetworkProvider(event, entry) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const provider = Object.fromEntries(formData.entries());
  const providers = [...(entry.providers || []), provider];
  event.currentTarget.reset();
  saveNetworkProviders(entry, providers);
}

function updateNetworkProvider(event, entry, providerKey) {
  event.preventDefault();
  const formData = new FormData(event.currentTarget);
  const updates = Object.fromEntries(formData.entries());
  const providers = (entry.providers || []).map((provider, index) => {
    if (networkProviderKey(provider, index) !== providerKey) {
      return provider;
    }

    return {
      ...provider,
      ...updates,
      id: provider.id
    };
  });

  saveNetworkProviders(entry, providers);
}

function removeNetworkProvider(entry, providerKey) {
  const providers = (entry.providers || []).filter((provider, index) => networkProviderKey(provider, index) !== providerKey);
  saveNetworkProviders(entry, providers);
}

function startNewNetworkEntry() {
  editingNetworkEntryId = null;
  selectedNetworkEntryId = null;
  networkForm.reset();
  networkFormTitle.textContent = "New Organization";
  saveNetworkEntryButton.textContent = "Save entry";
  cancelNetworkEditButton.hidden = false;
  networkForm.hidden = false;
  networkDetail.hidden = true;
  openNetworkModal();
  networkStatusEl.textContent = "Creating a new network entry.";
}

function startEditingNetworkEntry(entry) {
  editingNetworkEntryId = entry.id;
  selectedNetworkEntryId = entry.id;
  networkForm.elements.name.value = entry.name || "";
  networkForm.elements.type.value = normalizeNetworkType(entry.type);
  networkForm.elements.contactName.value = entry.contactName || "";
  networkForm.elements.phone.value = entry.phone || "";
  networkForm.elements.email.value = entry.email || "";
  networkForm.elements.website.value = entry.website || "";
  networkForm.elements.notes.value = entry.notes || "";
  networkFormTitle.textContent = `Edit ${networkEntryName(entry)}`;
  saveNetworkEntryButton.textContent = "Update entry";
  cancelNetworkEditButton.hidden = false;
  networkForm.hidden = false;
  networkDetail.hidden = true;
  openNetworkModal();
  networkStatusEl.textContent = `Editing ${networkEntryName(entry)}.`;
}

function stopEditingNetworkEntry() {
  editingNetworkEntryId = null;
  networkForm.reset();
  networkForm.hidden = true;
  networkDetail.hidden = false;
  renderNetworkDetail();
}

async function deleteNetworkEntry(entry) {
  const confirmed = window.confirm(`Delete ${networkEntryName(entry)}? This cannot be undone.`);

  if (!confirmed) {
    return;
  }

  networkStatusEl.textContent = "Deleting network entry...";

  try {
    const response = await authedFetch(`/api/referral-network/${encodeURIComponent(entry.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedNetworkEntryId = null;
    closeNetworkModal();
    networkStatusEl.textContent = "Network entry deleted.";
    await loadReferralNetwork();
  } catch (error) {
    networkStatusEl.textContent = error.message || "Could not delete network entry yet.";
    console.error(error);
  }
}

function setOutreachFormValues(event = {}) {
  outreachForm.elements.name.value = event.name || "";
  outreachForm.elements.type.value = event.type || "Outreach Event";
  outreachForm.elements.status.value = outreachEventStatus(event);
  applyOutreachStatusSelectColor(outreachForm.elements.status, outreachForm.elements.status.value);
  outreachForm.elements.eventDate.value = event.eventDate || "";
  outreachForm.elements.repeatPattern.value = event.repeatPattern || "";
  outreachForm.elements.location.value = event.location || "";
  outreachForm.elements.contactName.value = event.contactName || "";
  outreachForm.elements.contactRole.value = event.contactRole || "";
  outreachForm.elements.phone.value = event.phone || "";
  outreachForm.elements.email.value = event.email || "";
  outreachForm.elements.interactionsCount.value = event.interactionsCount ?? "";
  outreachForm.elements.referralsCount.value = event.referralsCount ?? "";
  outreachForm.elements.interestListCount.value = event.interestListCount ?? "";
  outreachForm.elements.participantListCount.value = event.participantListCount ?? "";
  outreachForm.elements.notes.value = event.notes || "";
}

function startNewOutreachEvent() {
  editingOutreachEventId = null;
  selectedOutreachEventId = null;
  outreachForm.reset();
  setOutreachFormValues({ type: "Outreach Event", status: "Scheduled" });
  outreachFormTitle.textContent = "New Event";
  saveOutreachEventButton.textContent = "Save event";
  cancelOutreachEditButton.hidden = false;
  outreachForm.hidden = false;
  outreachDetail.hidden = true;
  openOutreachModal();
  outreachStatusEl.textContent = "Creating a new outreach event.";
}

function startEditingOutreachEvent(event) {
  editingOutreachEventId = event.id;
  selectedOutreachEventId = event.id;
  setOutreachFormValues(event);
  outreachFormTitle.textContent = `Edit ${outreachEventName(event)}`;
  saveOutreachEventButton.textContent = "Update event";
  cancelOutreachEditButton.hidden = false;
  outreachForm.hidden = false;
  outreachDetail.hidden = true;
  openOutreachModal();
  outreachStatusEl.textContent = `Editing ${outreachEventName(event)}.`;
}

function stopEditingOutreachEvent() {
  editingOutreachEventId = null;
  outreachFormTitle.textContent = "New Event";
  saveOutreachEventButton.textContent = "Save event";
  cancelOutreachEditButton.hidden = true;
  outreachForm.hidden = true;
  outreachDetail.hidden = false;
  renderOutreachDetail();
}

async function deleteOutreachEvent(event) {
  const confirmed = window.confirm(`Delete ${outreachEventName(event)}? This cannot be undone.`);

  if (!confirmed) {
    return;
  }

  outreachStatusEl.textContent = "Deleting outreach event...";

  try {
    const response = await authedFetch(`/api/outreach-events/${encodeURIComponent(event.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedOutreachEventId = null;
    closeOutreachModal();
    outreachStatusEl.textContent = "Outreach event deleted.";
    await loadOutreachEvents();
  } catch (error) {
    outreachStatusEl.textContent = error.message || "Could not delete outreach event yet.";
    console.error(error);
  }
}

function setOutreachContactFormValues(contact = {}) {
  renderOutreachEventOptions(contact.eventId || "");
  outreachContactForm.elements.eventId.value = contact.eventId || "";
  outreachContactForm.elements.contactName.value = contact.contactName || "";
  outreachContactForm.elements.childName.value = contact.childName || "";
  outreachContactForm.elements.phone.value = contact.phone || "";
  outreachContactForm.elements.email.value = contact.email || "";
  outreachContactForm.elements.preferredLanguage.value = contact.preferredLanguage || "";
  outreachContactForm.elements.interestType.value = contact.interestType || "";
  outreachContactForm.elements.status.value = contact.status || "New";
  outreachContactForm.elements.notes.value = contact.notes || "";
}

function startNewOutreachContact() {
  editingOutreachContactId = null;
  selectedOutreachContactId = null;
  outreachContactForm.reset();
  setOutreachContactFormValues({ status: "New", eventId: selectedOutreachEventId || "" });
  outreachContactFormTitle.textContent = "New Contact";
  saveOutreachContactButton.textContent = "Save contact";
  cancelOutreachContactEditButton.hidden = false;
  outreachContactForm.hidden = false;
  outreachContactDetail.hidden = true;
  openOutreachContactModal();
  outreachContactStatusEl.textContent = "Creating a new outreach contact.";
}

function startEditingOutreachContact(contact) {
  editingOutreachContactId = contact.id;
  selectedOutreachContactId = contact.id;
  setOutreachContactFormValues(contact);
  outreachContactFormTitle.textContent = `Edit ${outreachContactName(contact)}`;
  saveOutreachContactButton.textContent = "Update contact";
  cancelOutreachContactEditButton.hidden = false;
  outreachContactForm.hidden = false;
  outreachContactDetail.hidden = true;
  openOutreachContactModal();
  outreachContactStatusEl.textContent = `Editing ${outreachContactName(contact)}.`;
}

function stopEditingOutreachContact() {
  editingOutreachContactId = null;
  outreachContactFormTitle.textContent = "New Contact";
  saveOutreachContactButton.textContent = "Save contact";
  cancelOutreachContactEditButton.hidden = true;
  outreachContactForm.hidden = true;
  outreachContactDetail.hidden = false;
  renderOutreachContactDetail();
}

async function deleteOutreachContact(contact) {
  const confirmed = window.confirm(`Delete ${outreachContactName(contact)}? This cannot be undone.`);

  if (!confirmed) {
    return;
  }

  outreachContactStatusEl.textContent = "Deleting outreach contact...";

  try {
    const response = await authedFetch(`/api/outreach-contacts/${encodeURIComponent(contact.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedOutreachContactId = null;
    closeOutreachContactModal();
    outreachContactStatusEl.textContent = "Outreach contact deleted.";
    await loadOutreachContacts();
  } catch (error) {
    outreachContactStatusEl.textContent = error.message || "Could not delete outreach contact yet.";
    console.error(error);
  }
}

async function grantPayloadFromForm() {
  const formData = new FormData(grantForm);
  const payload = Object.fromEntries(formData.entries());
  payload.pastGrantReceived = Boolean(grantForm.elements.pastGrantReceived?.checked);
  const existingGrant = loadedGrants.find((grant) => grant.id === editingGrantId);
  payload.documents = await documentsFromFixedFields(
    grantForm,
    grantDocumentFields,
    grantForm.elements.documentNotes?.value || "",
    existingGrant?.documents || []
  );
  payload.brandingNotes = grantForm.elements.brandingNotes?.value || "";
  payload.portalLoginNotes = "";
  payload.pastGrantNotes = "";
  return payload;
}

function setGrantSelectValue(name, value) {
  const select = grantForm.elements[name];
  if (!select) {
    return;
  }

  const text = String(value || "");
  if (text && !Array.from(select.options).some((option) => option.value === text)) {
    const option = document.createElement("option");
    option.value = text;
    option.textContent = text;
    select.append(option);
  }
  select.value = text;
}

function setGrantFormValues(grant = {}) {
  grantForm.reset();

  for (const name of [
    "foundationName",
    "grantName",
    "openDate",
    "deadlineDate",
    "deadlineTime",
    "awardExpectedDate",
    "focusAreas",
    "contactName",
    "contactEmail",
    "secondaryContactName",
    "secondaryContactEmail",
    "websiteUrl",
    "portalUrl",
    "portalLoginEmail",
    "portalLoginPassword",
    "amountRequested",
    "amountMin",
    "amountMax",
    "reportingRequirements",
    "pastGrantAmount",
    "previousAwardDate",
    "brandingNotes",
    "notes"
  ]) {
    if (grantForm.elements[name]) {
      grantForm.elements[name].value = grant[name] ?? "";
    }
  }

  setGrantSelectValue("status", grant.status || "Researching");
  setGrantSelectValue("recurrence", grant.recurrence || "");
  if (grantForm.elements.portalLoginEmail) {
    grantForm.elements.portalLoginEmail.value = grantPortalLoginEmail(grant);
  }
  if (grantForm.elements.portalLoginPassword) {
    grantForm.elements.portalLoginPassword.value = grantPortalLoginPassword(grant);
  }
  grantForm.elements.pastGrantReceived.checked = Boolean(grant.pastGrantReceived);
  grantForm.elements.documentNotes.value = fillFixedDocumentFields(grantForm, grantDocumentFields, grant.documents || []);
}

function openGrantModal() {
  grantModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeGrantModal() {
  const wasOpen = grantModal && !grantModal.hidden;
  if (grantModal) {
    grantModal.hidden = true;
  }
  if (wasOpen) {
    document.body.classList.remove("modal-open");
  }
  editingGrantId = null;
  selectedGrantId = null;
  grantDetail.hidden = true;
  grantForm.hidden = false;
  grantForm?.reset();
}

function openGrantProfile(grantId) {
  const grant = loadedGrants.find((item) => item.id === grantId);
  if (!grant) {
    return;
  }

  selectedGrantId = grant.id;
  editingGrantId = null;
  grantForm.hidden = true;
  grantDetail.hidden = false;
  renderGrantDetail();
  openGrantModal();
}

function startNewGrant() {
  editingGrantId = null;
  selectedGrantId = null;
  setGrantFormValues({ status: "Researching" });
  grantFormTitle.textContent = "New Grant";
  saveGrantButton.textContent = "Save Grant";
  deleteGrantButton.hidden = true;
  grantDetail.hidden = true;
  grantForm.hidden = false;
  openGrantModal();
}

function startEditGrant(grantId) {
  const grant = loadedGrants.find((item) => item.id === grantId);
  if (!grant) {
    return;
  }

  editingGrantId = grant.id;
  selectedGrantId = grant.id;
  setGrantFormValues(grant);
  grantFormTitle.textContent = `Edit ${grantTitle(grant)}`;
  saveGrantButton.textContent = "Update Grant";
  deleteGrantButton.hidden = false;
  grantDetail.hidden = true;
  grantForm.hidden = false;
  openGrantModal();
}

async function saveGrant(event) {
  event.preventDefault();

  const isEditing = Boolean(editingGrantId);
  grantsStatusEl.textContent = isEditing ? "Uploading documents and updating grant..." : "Uploading documents and saving grant...";
  saveGrantButton.disabled = true;

  try {
    const payload = await grantPayloadFromForm();
    grantsStatusEl.textContent = isEditing ? "Updating grant..." : "Saving grant...";
    const response = await authedFetch(isEditing ? `/api/grants/${encodeURIComponent(editingGrantId)}` : "/api/grants", {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    grantsStatusEl.textContent = isEditing ? "Grant updated." : "Grant saved.";
    closeGrantModal();
    await loadGrants();
  } catch (error) {
    grantsStatusEl.textContent = error.message || "Could not save grant yet.";
    console.error(error);
  } finally {
    saveGrantButton.disabled = false;
  }
}

async function deleteCurrentGrant(grantId = editingGrantId || selectedGrantId) {
  if (!grantId) {
    return;
  }

  const grant = loadedGrants.find((item) => item.id === grantId);
  const confirmed = window.confirm(`Delete ${grant ? grantTitle(grant) : "this grant"}? This cannot be undone.`);

  if (!confirmed) {
    return;
  }

  grantsStatusEl.textContent = "Deleting grant...";

  try {
    const response = await authedFetch(`/api/grants/${encodeURIComponent(grantId)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    closeGrantModal();
    grantsStatusEl.textContent = "Grant deleted.";
    await loadGrants();
  } catch (error) {
    grantsStatusEl.textContent = error.message || "Could not delete grant yet.";
    console.error(error);
  }
}

async function updateGrantStatus(grant, status) {
  grantsStatusEl.textContent = "Updating grant status...";

  try {
    const response = await authedFetch(`/api/grants/${encodeURIComponent(grant.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...grant,
        status
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedGrantId = grant.id;
    grantsStatusEl.textContent = "Grant status updated.";
    await loadGrants();
  } catch (error) {
    grantsStatusEl.textContent = error.message || "Could not update grant status yet.";
    console.error(error);
    await loadGrants();
  }
}

async function updateOutreachEventStatus(event, status) {
  outreachStatusEl.textContent = "Updating event status...";

  try {
    const response = await authedFetch(`/api/outreach-events/${encodeURIComponent(event.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...event,
        status
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedOutreachEventId = event.id;
    outreachStatusEl.textContent = "Event status updated.";
    await loadOutreachEvents();
  } catch (error) {
    outreachStatusEl.textContent = error.message || "Could not update event status yet.";
    console.error(error);
    await loadOutreachEvents();
  }
}

function setGrantQuestionFormValues(question = {}) {
  grantQuestionForm.reset();

  for (const name of ["category", "prompt", "answer", "targetLimit", "notes"]) {
    if (grantQuestionForm.elements[name]) {
      grantQuestionForm.elements[name].value = question[name] || "";
    }
  }
}

function openGrantQuestionModal() {
  grantQuestionModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeGrantQuestionModal() {
  const wasOpen = grantQuestionModal && !grantQuestionModal.hidden;
  if (grantQuestionModal) {
    grantQuestionModal.hidden = true;
  }
  if (wasOpen) {
    document.body.classList.remove("modal-open");
  }
  editingGrantQuestionId = null;
  grantQuestionForm?.reset();
}

function startNewGrantQuestion() {
  editingGrantQuestionId = null;
  setGrantQuestionFormValues();
  grantQuestionFormTitle.textContent = "New Answer";
  saveGrantQuestionButton.textContent = "Save Answer";
  openGrantQuestionModal();
}

function startEditGrantQuestion(questionId) {
  const question = loadedGrantQuestions.find((item) => item.id === questionId);
  if (!question) {
    return;
  }

  editingGrantQuestionId = question.id;
  setGrantQuestionFormValues(question);
  grantQuestionFormTitle.textContent = "Edit Answer";
  saveGrantQuestionButton.textContent = "Update Answer";
  openGrantQuestionModal();
}

async function saveGrantQuestion(event) {
  event.preventDefault();

  const payload = Object.fromEntries(new FormData(grantQuestionForm).entries());
  const isEditing = Boolean(editingGrantQuestionId);
  grantsStatusEl.textContent = isEditing ? "Updating reusable answer..." : "Saving reusable answer...";
  saveGrantQuestionButton.disabled = true;

  try {
    const response = await authedFetch(isEditing ? `/api/grant-questions/${encodeURIComponent(editingGrantQuestionId)}` : "/api/grant-questions", {
      method: isEditing ? "PATCH" : "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    closeGrantQuestionModal();
    grantsStatusEl.textContent = isEditing ? "Reusable answer updated." : "Reusable answer saved.";
    await loadGrantQuestions();
  } catch (error) {
    grantsStatusEl.textContent = error.message || "Could not save reusable answer yet.";
    console.error(error);
  } finally {
    saveGrantQuestionButton.disabled = false;
  }
}

async function deleteGrantQuestion(questionId) {
  const confirmed = window.confirm("Delete this reusable answer?");

  if (!confirmed) {
    return;
  }

  grantsStatusEl.textContent = "Deleting reusable answer...";

  try {
    const response = await authedFetch(`/api/grant-questions/${encodeURIComponent(questionId)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    grantsStatusEl.textContent = "Reusable answer deleted.";
    await loadGrantQuestions();
  } catch (error) {
    grantsStatusEl.textContent = error.message || "Could not delete reusable answer yet.";
    console.error(error);
  }
}

async function copyGrantAnswer(answer) {
  try {
    await navigator.clipboard.writeText(answer);
    grantsStatusEl.textContent = "Answer copied.";
  } catch (error) {
    grantsStatusEl.textContent = "Could not copy answer automatically.";
    console.error(error);
  }
}

async function grantOrganizationPayloadFromForm() {
  const payload = Object.fromEntries(new FormData(grantOrgForm).entries());
  payload.documents = await documentsFromFixedFields(
    grantOrgForm,
    grantOrgDocumentFields,
    grantOrgForm.elements.dataNotes?.value || "",
    loadedGrantOrganizationInfo?.documents || []
  );
  payload.copyBlocks = [];
  return payload;
}

async function saveGrantOrganizationInfo(event) {
  event.preventDefault();

  grantsStatusEl.textContent = "Uploading documents and saving organization info...";
  saveGrantOrgButton.disabled = true;

  try {
    const payload = await grantOrganizationPayloadFromForm();
    grantsStatusEl.textContent = "Saving organization info...";
    const response = await authedFetch("/api/grant-organization-info", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    loadedGrantOrganizationInfo = data.organizationInfo || null;
    fillGrantOrganizationForm();
    grantsStatusEl.textContent = "Organization info saved.";
  } catch (error) {
    grantsStatusEl.textContent = error.message || "Could not save organization info yet.";
    console.error(error);
  } finally {
    saveGrantOrgButton.disabled = false;
  }
}

function setAppointmentFormValues(appointment = {}) {
  const clientIds = appointmentClientIds(appointment);
  selectedAppointmentClientIds.clear();
  clientIds.forEach((clientId) => selectedAppointmentClientIds.add(clientId));
  renderAppointmentClientOptions(clientIds[0] || "");
  renderSelectedAppointmentClients();
  appointmentClientSearchInput.value = clientIds.length ? "" : appointmentClientNames(appointment)[0] || "";
  appointmentForm.elements.appointmentDate.value = appointment.appointmentDate || todayDateString();
  appointmentForm.elements.appointmentType.value = appointment.appointmentType || (appointment.lesson ? "Nutrition Education" : "Enrollment");
  appointmentForm.elements.status.value = appointment.status || "Scheduled";
  appointmentForm.elements.lesson.value = appointment.lesson || "";
  appointmentForm.elements.goal.value = appointment.goal || "";
  appointmentForm.elements.staffMember.value = appointment.staffMember || "";
  appointmentForm.elements.notes.value = appointment.notes || "";
  syncAppointmentGoalField();
  renderAppointmentTimeOptions(appointment.appointmentTime || "");
}

function syncAppointmentGoalField() {
  const isNutritionEducation = appointmentForm.elements.appointmentType.value === "Nutrition Education";
  const goalLabel = appointmentForm.elements.goal.closest("label");
  const lessonLabel = appointmentForm.elements.lesson.closest("label");
  if (lessonLabel) {
    lessonLabel.hidden = !isNutritionEducation;
  }
  if (goalLabel) {
    goalLabel.hidden = !isNutritionEducation;
  }

  if (!isNutritionEducation) {
    appointmentForm.elements.lesson.value = "";
    appointmentForm.elements.goal.value = "";
  }
  appointmentForm.elements.lesson.disabled = !isNutritionEducation;
  appointmentForm.elements.goal.disabled = !isNutritionEducation;
}

function startNewAppointment(defaults = {}) {
  editingAppointmentId = null;
  selectedAppointmentId = null;
  appointmentForm.reset();
  setAppointmentFormValues({ status: "Scheduled", ...defaults });
  appointmentFormTitle.textContent = "New Appointment";
  saveAppointmentButton.textContent = "Save appointment";
  deleteAppointmentButton.hidden = true;
  appointmentDetail.hidden = true;
  appointmentForm.hidden = false;
  openAppointmentModal();
  setAppointmentFeedback("");
}

function startBlockTimeAppointment() {
  startNewAppointment({
    appointmentDate: visibleSchedulingPreviewDate,
    appointmentType: "Administrative",
    status: "Blocked",
    clientName: "Blocked Time",
    clientNames: ["Blocked Time"],
    notes: "Blocked time"
  });
  appointmentFormTitle.textContent = "Block Time";
}

function startEditingAppointment(appointment) {
  editingAppointmentId = appointment.id;
  selectedAppointmentId = appointment.id;
  setAppointmentFormValues(appointment);
  appointmentFormTitle.textContent = `Edit ${appointmentClientName(appointment)}`;
  saveAppointmentButton.textContent = "Update appointment";
  deleteAppointmentButton.hidden = false;
  appointmentDetail.hidden = true;
  appointmentForm.hidden = false;
  openAppointmentModal();
  setAppointmentFeedback("");
}

async function deleteAppointment() {
  const appointment = getSelectedAppointment();

  if (!appointment) {
    return;
  }

  const confirmed = window.confirm(`Delete appointment for ${appointmentClientName(appointment)}? This cannot be undone.`);

  if (!confirmed) {
    return;
  }

  appointmentsStatusEl.textContent = "Deleting appointment...";

  try {
    const response = await authedFetch(`/api/appointments/${encodeURIComponent(appointment.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    closeAppointmentModal();
    appointmentsStatusEl.textContent = "Appointment deleted.";
    await loadAppointments();
  } catch (error) {
    appointmentsStatusEl.textContent = error.message || "Could not delete appointment yet.";
    console.error(error);
  }
}

function startNewClient() {
  editingClientId = null;
  selectedClientId = null;
  clientForm.reset();
  setClientFormValues({ status: "Scheduled", preferredLanguage: "English", gender: "Unspecified" });
  clientFormTitle.textContent = "New Client";
  saveClientButton.textContent = "Save client";
  cancelClientEditButton.hidden = false;
  clientForm.hidden = false;
  clientDetail.hidden = true;
  openClientModal();
  clientsStatusEl.textContent = "Creating a new client.";
}

function startEditingClient(client) {
  editingClientId = client.id;
  selectedClientId = client.id;
  setClientFormValues(client);
  clientFormTitle.textContent = `Edit ${clientName(client)}`;
  saveClientButton.textContent = "Update client";
  cancelClientEditButton.hidden = false;
  clientForm.hidden = false;
  clientDetail.hidden = true;
  openClientModal();
  clientsStatusEl.textContent = `Editing ${clientName(client)}.`;
}

function stopEditingClient() {
  editingClientId = null;
  clientFormTitle.textContent = "New Client";
  saveClientButton.textContent = "Save client";
  cancelClientEditButton.hidden = true;
  clientForm.hidden = true;
  clientDetail.hidden = false;
  renderClientDetail();
}

async function deleteClient(client) {
  const name = clientName(client);
  const confirmed = window.confirm(`Delete client ${name}?`);

  if (!confirmed) {
    return;
  }

  clientsStatusEl.textContent = "Deleting client...";

  try {
    const response = await authedFetch(`/api/clients/${encodeURIComponent(client.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    if (selectedClientId === client.id) {
      selectedClientId = null;
    }

    await loadClients();
    closeClientModal();
    clientsStatusEl.textContent = "Client deleted.";
  } catch (error) {
    clientsStatusEl.textContent = error.message || "Could not delete client yet.";
    console.error(error);
  }
}

async function deleteReferral(referral) {
  const name = referralName(referral);
  const confirmed = window.confirm(`Delete referral for ${name}?`);

  if (!confirmed) {
    return;
  }

  referralsStatusEl.textContent = "Deleting referral...";

  try {
    const response = await authedFetch(`/api/referrals/${encodeURIComponent(referral.id)}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    if (selectedReferralId === referral.id) {
      selectedReferralId = null;
    }

    await loadReferrals();
    closeReferralModal();
    referralsStatusEl.textContent = "Referral deleted.";
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not delete referral yet.";
    console.error(error);
  }
}

async function updateReferralStatus(referral, status) {
  referralsStatusEl.textContent = "Updating referral status...";

  try {
    const response = await authedFetch(`/api/referrals/${encodeURIComponent(referral.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedReferralId = referral.id;

    if (status === "Scheduled" && !data.referral?.convertedClientId) {
      const shouldConvert = window.confirm("This referral is now Scheduled. Convert this referral to a Client now?");

      if (shouldConvert) {
        await convertReferralToClient(data.referral);
        return;
      }
    }

    referralsStatusEl.textContent = "Referral status updated.";
    await loadReferrals();
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not update referral status yet.";
    console.error(error);
    await loadReferrals();
  }
}

async function updateClientStatus(client, status) {
  clientsStatusEl.textContent = "Updating client status...";

  try {
    const response = await authedFetch(`/api/clients/${encodeURIComponent(client.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedClientId = client.id;
    clientsStatusEl.textContent = "Client status updated.";
    await loadClients();
  } catch (error) {
    clientsStatusEl.textContent = error.message || "Could not update client status yet.";
    console.error(error);
    await loadClients();
  }
}

async function updateClientCurrentLesson(client, currentLesson) {
  clientsStatusEl.textContent = "Updating program progress...";

  try {
    const response = await authedFetch(`/api/clients/${encodeURIComponent(client.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ currentLesson })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    selectedClientId = client.id;
    clientsStatusEl.textContent = "Program progress updated.";
    await loadClients();
    renderClientDetail();
  } catch (error) {
    clientsStatusEl.textContent = error.message || "Could not update program progress yet.";
    console.error(error);
    await loadClients();
    renderClientDetail();
  }
}

async function updateInlineDate(record, moduleName, fieldName, value) {
  const isClient = moduleName === "clients";
  const statusElement = isClient ? clientsStatusEl : referralsStatusEl;
  statusElement.textContent = "Updating date...";

  try {
    const response = await authedFetch(`/api/${moduleName}/${encodeURIComponent(record.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ [fieldName]: value })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    if (isClient) {
      selectedClientId = record.id;
      statusElement.textContent = "Client date updated.";
      await loadClients();
      return;
    }

    selectedReferralId = record.id;
    statusElement.textContent = "Referral date updated.";
    await loadReferrals();
  } catch (error) {
    statusElement.textContent = error.message || "Could not update date yet.";
    console.error(error);

    if (isClient) {
      await loadClients();
      return;
    }

    await loadReferrals();
  }
}

async function saveProviderLinks(record, moduleName, providerLinks) {
  const isClient = moduleName === "clients";
  const statusElement = isClient ? clientsStatusEl : referralsStatusEl;
  statusElement.textContent = "Updating providers...";

  try {
    const response = await authedFetch(`/api/${moduleName}/${encodeURIComponent(record.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ providerLinks })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    if (isClient) {
      selectedClientId = record.id;
      statusElement.textContent = "Providers updated.";
      await loadClients();
      return;
    }

    selectedReferralId = record.id;
    statusElement.textContent = "Providers updated.";
    await loadReferrals();
  } catch (error) {
    statusElement.textContent = error.message || "Could not update providers yet.";
    console.error(error);
    if (isClient) {
      await loadClients();
      return;
    }
    await loadReferrals();
  }
}

function addProviderLink(record, moduleName, link) {
  saveProviderLinks(record, moduleName, [...(record.providerLinks || []), link]);
}

function removeProviderLink(record, moduleName, link) {
  const providerLinks = (record.providerLinks || []).filter(
    (item) => item.networkId !== link.networkId || item.providerId !== link.providerId
  );
  saveProviderLinks(record, moduleName, providerLinks);
}

async function addSibling(moduleName, recordId, siblingId) {
  const statusElement = moduleName === "clients" ? clientsStatusEl : referralsStatusEl;
  statusElement.textContent = "Linking siblings...";

  try {
    const response = await authedFetch(`/api/${moduleName}/${encodeURIComponent(recordId)}/siblings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ siblingId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    statusElement.textContent = "Sibling linked.";

    if (moduleName === "clients") {
      selectedClientId = recordId;
      await loadClients();
      renderClientDetail();
    } else {
      selectedReferralId = recordId;
      await loadReferrals();
      renderReferralDetail();
    }
  } catch (error) {
    statusElement.textContent = error.message || "Could not link siblings yet.";
    console.error(error);
  }
}

async function removeSibling(moduleName, recordId, siblingId) {
  const statusElement = moduleName === "clients" ? clientsStatusEl : referralsStatusEl;
  statusElement.textContent = "Removing sibling link...";

  try {
    const response = await authedFetch(
      `/api/${moduleName}/${encodeURIComponent(recordId)}/siblings/${encodeURIComponent(siblingId)}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    statusElement.textContent = "Sibling link removed.";

    if (moduleName === "clients") {
      selectedClientId = recordId;
      await loadClients();
      renderClientDetail();
    } else {
      selectedReferralId = recordId;
      await loadReferrals();
      renderReferralDetail();
    }
  } catch (error) {
    statusElement.textContent = error.message || "Could not remove sibling link yet.";
    console.error(error);
  }
}

async function convertReferralToClient(referral) {
  referralsStatusEl.textContent = "Converting referral to client...";

  try {
    const response = await authedFetch(`/api/referrals/${encodeURIComponent(referral.id)}/convert`, {
      method: "POST"
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    selectedReferralId = null;
    selectedClientId = data.client?.id || null;
    referralsStatusEl.textContent = "Referral converted to client.";
    await loadReferrals();
    await loadClients();
    closeReferralModal();
    setActiveModule("clients");

    if (selectedClientId) {
      openClientModal();
      renderClientDetail();
    }
  } catch (error) {
    referralsStatusEl.textContent = error.message || "Could not convert referral yet.";
    console.error(error);
    await loadReferrals();
  }
}

async function signIn() {
  try {
    statusEl.textContent = "Opening Google sign-in...";
    await signInWithPopup(auth, provider);
  } catch (error) {
    statusEl.textContent = "Sign-in did not finish.";
    messageEl.textContent = "Check that Google sign-in is enabled in Firebase Authentication.";
    console.error(error);
  }
}

async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    statusEl.textContent = "Could not sign out yet.";
    console.error(error);
  }
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  const signedIn = Boolean(user);

  signInButton.hidden = signedIn;
  signOutButton.hidden = !signedIn;
  refreshButton.disabled = !signedIn;
  signedOutPanel.hidden = signedIn;
  workflowPanel.hidden = !signedIn;
  dashboardPanel.hidden = true;
  crmTabs.hidden = true;
  referralsPanel.hidden = true;
  clientsPanel.hidden = true;
  referralNetworkPanel.hidden = true;
  outreachPanel.hidden = true;
  fundraisingPanel.hidden = true;
  marketingPanel.hidden = true;
  operationsPanel.hidden = true;
  schedulingPanel.hidden = true;
  userEl.textContent = signedIn ? `Signed in as ${user.email}` : "Please sign in with your SNACK Google account.";

  if (signedIn) {
    setActiveModule(activeModule);
    loadMessage();
    loadReferrals();
    loadClients();
    loadReferralNetwork();
    loadOutreachEvents();
    loadOutreachContacts();
    loadSchedulingSettings().finally(() => loadAppointments());
    loadTasks();
    loadActivityLogs();
    loadGrants();
    loadGrantQuestions();
    loadGrantOrganizationInfo();
  } else {
    messageEl.textContent = "";
    statusEl.textContent = "Sign in to load the database message.";
    referralsStatusEl.textContent = "";
    clientsStatusEl.textContent = "";
    networkStatusEl.textContent = "";
    outreachStatusEl.textContent = "";
    outreachContactStatusEl.textContent = "";
    appointmentsStatusEl.textContent = "";
    tasksStatusEl.textContent = "";
    grantsStatusEl.textContent = "";
    dataToolsStatusEl.textContent = "";
    referralsList.innerHTML = "";
    clientsList.innerHTML = "";
    networkList.innerHTML = "";
    outreachList.innerHTML = "";
    outreachContactList.innerHTML = "";
    appointmentsList.innerHTML = "";
    workflowTaskSummary.innerHTML = "";
    workflowTaskList.innerHTML = "";
    grantsSummary.innerHTML = "";
    grantFlowBoard.innerHTML = "";
    grantDeadlineList.innerHTML = "";
    grantsList.innerHTML = "";
    grantQuestionList.innerHTML = "";
    clearElement(kpiSummary);
    clearElement(clinicSnapshotSummary);
    clearElement(clinicSnapshotMetrics);
    clearElement(clinicSnapshotNoNext);
    clearElement(kpiProgressList);
    clearElement(programKpiList);
    clearElement(organizationKpiTable);
    clearElement(revenueKpiTable);
    clearElement(workPlanSummary);
    clearElement(workPlanList);
    clearElement(dataToolsList);
    clearElement(dashboardSummary);
    clearElement(dashboardFollowups);
    clearElement(dashboardNewReferrals);
    clearElement(dashboardScheduled);
    clearElement(dashboardNoNext);
    clearElement(dashboardAppointmentsWeek);
    clearElement(dashboardAttention);
    clearElement(dashboardWorkflow);
    workflowPanel.hidden = true;
    referralSummary.innerHTML = "";
    clientSummary.innerHTML = "";
    referralDetail.innerHTML = "";
    clientDetail.innerHTML = "";
    networkDetail.innerHTML = "";
    outreachDetail.innerHTML = "";
    outreachContactDetail.innerHTML = "";
    outreachSummary.innerHTML = "";
    outreachEventFlowBoard.innerHTML = "";
    appointmentSummary.innerHTML = "";
    selectedReferralId = null;
    selectedClientId = null;
    selectedNetworkEntryId = null;
    selectedOutreachEventId = null;
    selectedOutreachContactId = null;
    selectedAppointmentId = null;
    editingTaskId = null;
    loadedReferrals = [];
    loadedClients = [];
    loadedNetworkEntries = [];
    loadedOutreachEvents = [];
    loadedOutreachContacts = [];
    loadedAppointments = [];
    loadedTasks = [];
    loadedActivityLogs = [];
    loadedGrants = [];
    loadedGrantQuestions = [];
    loadedGrantOrganizationInfo = null;
    dataToolsCounts = null;
    latestAppointmentImportAnalysis = null;
    referralForm.reset();
    appointmentForm.reset();
    taskForm.reset();
    closeReferralModal();
    closeReferralImportModal();
    closeClientModal();
    closeAppointmentImportModal();
    closeNetworkImportModal();
    closeNetworkModal();
    closeOutreachModal();
    closeOutreachContactModal();
    closeAppointmentModal();
    closeAppointmentCompletionModal();
    closeTaskModal();
    closeGrantModal();
    closeGrantQuestionModal();
    closeActivityLogModal();
    closeSiblingModal();
    closeFlowArchive();
  }
});

renderAppointmentTimeOptions();
setSchedulingSettingsFormValues(defaultSchedulingSettings);
bindGrantDisclosureState(grantOrgCard, "organization-info");
bindGrantDisclosureState(grantQuestionCard, "reusable-answers");
bindGrantDocumentFileStatus(grantForm, grantDocumentFields);
bindGrantDocumentFileStatus(grantOrgForm, grantOrgDocumentFields);

signInButton.addEventListener("click", signIn);
signOutButton.addEventListener("click", signOutUser);
refreshButton.addEventListener("click", loadMessage);
navWorkflowButton.addEventListener("click", () => setActiveModule("workflow"));
navDashboardButton.addEventListener("click", () => setActiveModule("admin"));
navCrmButton.addEventListener("click", () => setActiveModule("crm"));
navOutreachButton.addEventListener("click", () => setActiveModule("outreach"));
navFundraisingButton.addEventListener("click", () => setActiveModule("fundraising"));
navMarketingButton.addEventListener("click", () => setActiveModule("marketing"));
navOperationsButton.addEventListener("click", () => setActiveModule("operations"));
navSchedulingButton.addEventListener("click", () => setActiveModule("scheduling"));
adminTabSettingsButton.addEventListener("click", () => setAdminView("settings"));
adminTabDataToolsButton.addEventListener("click", () => setAdminView("data-tools"));
adminTabKpiButton.addEventListener("click", () => setAdminView("kpi"));
adminTabWorkPlanButton.addEventListener("click", () => setAdminView("work-plan"));
adminSchedulingSettingsForm?.addEventListener("submit", saveSchedulingSettings);
fundraisingTabGrantsButton.addEventListener("click", () => setFundraisingView("grants"));
fundraisingTabSalesButton.addEventListener("click", () => setFundraisingView("sales"));
fundraisingTabIndividualGivingButton.addEventListener("click", () => setFundraisingView("individual-giving"));
fundraisingTabCorporatePartnershipsButton.addEventListener("click", () => setFundraisingView("corporate-partnerships"));
fundraisingTabEventsButton.addEventListener("click", () => setFundraisingView("events"));
crmTabReferralsButton.addEventListener("click", () => setCrmView("referrals"));
crmTabClientsButton.addEventListener("click", () => setCrmView("clients"));
crmTabReferralNetworkButton.addEventListener("click", () => setCrmView("referral-network"));
outreachTabDashboardButton.addEventListener("click", () => setOutreachView("dashboard"));
outreachTabEventsButton.addEventListener("click", () => setOutreachView("events"));
outreachTabContactsButton.addEventListener("click", () => setOutreachView("contacts"));
referralsViewListButton.addEventListener("click", () => setReferralView("list"));
referralsViewFlowButton.addEventListener("click", () => setReferralView("flow"));
clientsViewListButton.addEventListener("click", () => setClientView("list"));
clientsViewFlowButton.addEventListener("click", () => setClientView("flow"));
closeFlowArchiveButton.addEventListener("click", closeFlowArchive);
startDayButton.addEventListener("click", startDayWorkflow);
newReferralButton.addEventListener("click", startNewReferral);
newClientButton.addEventListener("click", startNewClient);
importReferralsButton.addEventListener("click", () => referralCsvInput.click());
referralCsvInput.addEventListener("change", () => previewReferralCsv(referralCsvInput.files?.[0]));
confirmReferralImportButton.addEventListener("click", importPreviewedReferrals);
importClientsButton.addEventListener("click", () => clientCsvInput.click());
clientCsvInput.addEventListener("change", () => previewClientCsv(clientCsvInput.files?.[0]));
confirmClientImportButton.addEventListener("click", importPreviewedClients);
importNetworkButton.addEventListener("click", () => networkCsvInput.click());
networkCsvInput.addEventListener("change", () => previewNetworkCsv(networkCsvInput.files?.[0]));
confirmNetworkImportButton.addEventListener("click", importPreviewedNetworkEntries);
appointmentCsvInput.addEventListener("change", () => previewAppointmentCsv(appointmentCsvInput.files?.[0]));
confirmAppointmentImportButton.addEventListener("click", importPreviewedAppointments);
refreshDataToolsButton.addEventListener("click", loadDataToolsCounts);
newNetworkEntryButton.addEventListener("click", startNewNetworkEntry);
newOutreachEventButton.addEventListener("click", startNewOutreachEvent);
newOutreachContactButton.addEventListener("click", startNewOutreachContact);
newAppointmentButton.addEventListener("click", startNewAppointment);
printTodayScheduleButton.addEventListener("click", printTodaySchedule);
printPrepSheetsButton.addEventListener("click", printPrepSheets);
printNoteSheetsButton.addEventListener("click", printAppointmentNoteSheets);
newTaskButton.addEventListener("click", () => startNewTask());
newGrantButton.addEventListener("click", startNewGrant);
grantSearchInput.addEventListener("input", renderGrantList);
grantForm.addEventListener("submit", saveGrant);
cancelGrantEditButton.addEventListener("click", closeGrantModal);
deleteGrantButton.addEventListener("click", () => deleteCurrentGrant());
newGrantQuestionButton.addEventListener("click", startNewGrantQuestion);
grantQuestionForm.addEventListener("submit", saveGrantQuestion);
cancelGrantQuestionEditButton.addEventListener("click", closeGrantQuestionModal);
grantOrgForm.addEventListener("submit", saveGrantOrganizationInfo);
grantModal.addEventListener("click", (event) => {
  if (event.target === grantModal) {
    closeGrantModal();
  }
});
grantQuestionModal.addEventListener("click", (event) => {
  if (event.target === grantQuestionModal) {
    closeGrantQuestionModal();
  }
});
editAppointmentDetailButton.addEventListener("click", () => {
  const appointment = getSelectedAppointment();
  if (appointment) {
    startEditingAppointment(appointment);
  }
});
completeAppointmentDetailButton.addEventListener("click", () => {
  const appointment = getSelectedAppointment();
  if (appointment) {
    closeAppointmentModal();
    startCompletingAppointment(appointment);
  }
});
deleteAppointmentDetailButton.addEventListener("click", deleteAppointment);
closeAppointmentDetailButton.addEventListener("click", closeAppointmentModal);
appointmentCompleteForm.addEventListener("submit", saveAppointmentCompletion);
cancelAppointmentCompletionButton.addEventListener("click", closeAppointmentCompletionModal);
appointmentCheckInForm.addEventListener("submit", saveAppointmentCheckIn);
closeAppointmentCheckInButtons.forEach((button) => button.addEventListener("click", closeAppointmentCheckInModal));
referralForm.addEventListener("submit", saveReferral);
referralFormField("firstName")?.addEventListener("input", syncReferralEditAvatar);
referralFormField("lastName")?.addEventListener("input", syncReferralEditAvatar);
referralFormField("status")?.addEventListener("change", () => {
  syncReferralEditStatusColor();
  syncReferralEditProgress();
});
referralFormField("referralSource")?.addEventListener("input", syncReferralSourceDisplay);
referralFormField("notes")?.addEventListener("input", syncReferralEditNotesPreview);
clientForm.addEventListener("submit", saveClient);
clientFormField("firstName")?.addEventListener("input", syncClientEditAvatar);
clientFormField("lastName")?.addEventListener("input", syncClientEditAvatar);
clientFormField("status")?.addEventListener("change", syncClientEditStatusColor);
networkForm.addEventListener("submit", saveNetworkEntry);
outreachForm.addEventListener("submit", saveOutreachEvent);
outreachForm.elements.status?.addEventListener("change", () => {
  applyOutreachStatusSelectColor(outreachForm.elements.status, outreachForm.elements.status.value);
});
outreachContactForm.addEventListener("submit", saveOutreachContact);
appointmentForm.addEventListener("submit", saveAppointment);
taskForm.addEventListener("submit", saveTask);
activityLogForm.addEventListener("submit", saveActivityLog);
cancelActivityLogButton.addEventListener("click", closeActivityLogModal);
activityLogDirectionSelect.addEventListener("change", syncActivityLogTitle);
siblingForm.addEventListener("submit", saveSiblingLink);
cancelSiblingLinkButton.addEventListener("click", closeSiblingModal);
referralSourceInput.addEventListener("focus", renderReferralSourceOptions);
referralSourceInput.addEventListener("input", renderReferralSourceOptions);
clientReferralSourceInput.addEventListener("focus", renderReferralSourceOptions);
clientReferralSourceInput.addEventListener("input", renderReferralSourceOptions);
referralSearchInput.addEventListener("input", () => {
  renderReferralSummary();
  renderReferrals();
});
clientSearchInput.addEventListener("input", () => {
  renderClientSummary();
  renderClients();
});
networkSearchInput.addEventListener("input", renderReferralNetwork);
outreachSearchInput.addEventListener("input", renderOutreachEvents);
outreachContactSearchInput.addEventListener("input", renderOutreachContacts);
appointmentSearchInput.addEventListener("input", renderAppointments);
appointmentDateFilterSelect.addEventListener("change", renderAppointments);
appointmentStatusFilterSelect.addEventListener("change", renderAppointments);
taskRelatedTypeSelect.addEventListener("change", () => {
  taskClientIdInput.value = "";
  taskReferralIdInput.value = "";
  taskRelatedSearchInput.value = "";
  renderTaskRelatedOptions();
  syncTaskProfileButton();
});
taskRelatedSearchInput.addEventListener("input", resolveTaskRelatedId);
taskRelatedSearchInput.addEventListener("change", resolveTaskRelatedId);
openTaskProfileButton.addEventListener("click", openTaskRelatedProfile);
taskUndoButton.addEventListener("click", undoTaskCompletion);
appointmentClientSearchInput.addEventListener("input", () => {
  resolveAppointmentClientId();
  renderAppointmentTimeOptions();
});
appointmentClientSearchInput.addEventListener("change", () => {
  resolveAppointmentClientId();
  renderAppointmentTimeOptions();
});
addAppointmentClientButton.addEventListener("click", () => {
  const clientId = resolveAppointmentClientId();
  if (!addSelectedAppointmentClient(clientId)) {
    appointmentsStatusEl.textContent = "Choose a client from the search results first.";
  } else {
    appointmentsStatusEl.textContent = "";
  }
});
appointmentForm.elements.lesson.addEventListener("change", () => {
  if (appointmentForm.elements.lesson.value) {
    appointmentForm.elements.appointmentType.value = "Nutrition Education";
  }
  syncAppointmentGoalField();
});
appointmentForm.elements.appointmentDate.addEventListener("change", () => renderAppointmentTimeOptions());
appointmentForm.elements.status.addEventListener("change", () => renderAppointmentTimeOptions());
appointmentForm.elements.appointmentType.addEventListener("change", () => {
  syncAppointmentGoalField();
  renderAppointmentTimeOptions();
});
appointmentTimeInput.addEventListener("invalid", (event) => {
  event.preventDefault();
  setAppointmentFeedback(
    appointmentTimeInput.options.length <= 1
      ? "No open appointment times are available for that date and duration."
      : "Choose an open appointment time."
  );
});
appointmentTimeInput.addEventListener("change", () => setAppointmentFeedback(""));
completionScheduleNextInput.addEventListener("change", syncCompletionScheduleFields);
completionNextDateInput.addEventListener("change", renderCompletionAppointmentTimeOptions);
completionNextGoalInput.addEventListener("change", renderCompletionAppointmentTimeOptions);
completionNextTimeInput.addEventListener("focus", renderCompletionAppointmentTimeOptions);
completionNextTimeInput.addEventListener("blur", () => {
  completionNextTimeInput.value = formatAppointmentTime(completionNextTimeInput.value) || completionNextTimeInput.value;
  renderCompletionAppointmentTimeOptions();
});
cancelTaskEditButton.addEventListener("click", () => {
  resetTaskForm();
  closeTaskModal();
  tasksStatusEl.textContent = "";
});
deleteTaskButton.addEventListener("click", deleteTaskRecord);
cancelEditButton.addEventListener("click", () => {
  referralForm.reset();
  if (selectedReferralId) {
    stopEditingReferral();
    setReferralsLoadedStatus();
    return;
  }
  closeReferralModal();
});
cancelClientEditButton.addEventListener("click", () => {
  clientForm.reset();
  if (selectedClientId) {
    stopEditingClient();
    setClientsLoadedStatus();
    return;
  }
  closeClientModal();
});
cancelNetworkEditButton.addEventListener("click", () => {
  networkForm.reset();
  if (selectedNetworkEntryId) {
    stopEditingNetworkEntry();
    networkStatusEl.textContent = "";
    return;
  }
  closeNetworkModal();
});
cancelOutreachEditButton.addEventListener("click", () => {
  outreachForm.reset();
  if (selectedOutreachEventId) {
    stopEditingOutreachEvent();
    outreachStatusEl.textContent = "";
    return;
  }
  closeOutreachModal();
});
cancelOutreachContactEditButton.addEventListener("click", () => {
  outreachContactForm.reset();
  if (selectedOutreachContactId) {
    stopEditingOutreachContact();
    outreachContactStatusEl.textContent = "";
    return;
  }
  closeOutreachContactModal();
});
cancelAppointmentEditButton.addEventListener("click", closeAppointmentModal);
deleteAppointmentButton.addEventListener("click", deleteAppointment);
closeReferralModalButton.addEventListener("click", closeReferralModal);
closeReferralImportButton.addEventListener("click", closeReferralImportModal);
closeClientImportButton.addEventListener("click", closeClientImportModal);
closeNetworkImportButton.addEventListener("click", closeNetworkImportModal);
closeAppointmentImportButton.addEventListener("click", closeAppointmentImportModal);

function bindBackdropClose(modal, closeFn) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeFn();
    }
  });
}

[
  [referralModal, closeReferralModal],
  [clientModal, closeClientModal],
  [clientImportModal, closeClientImportModal],
  [referralImportModal, closeReferralImportModal],
  [networkImportModal, closeNetworkImportModal],
  [appointmentImportModal, closeAppointmentImportModal],
  [networkModal, closeNetworkModal],
  [outreachModal, closeOutreachModal],
  [outreachContactModal, closeOutreachContactModal],
  [appointmentModal, closeAppointmentModal],
  [appointmentCompleteModal, closeAppointmentCompletionModal],
  [appointmentCheckInModal, closeAppointmentCheckInModal],
  [taskModal, closeTaskModal],
  [activityLogModal, closeActivityLogModal],
  [siblingModal, closeSiblingModal],
  [flowArchiveModal, closeFlowArchive]
].forEach(([modal, closeFn]) => bindBackdropClose(modal, closeFn));

document.addEventListener("click", (event) => {
  for (const menu of document.querySelectorAll(".columns-menu[open], .header-search-menu[open]")) {
    if (!menu.contains(event.target)) {
      menu.open = false;
    }
  }
});
