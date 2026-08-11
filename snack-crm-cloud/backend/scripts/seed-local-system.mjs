import { Firestore } from "@google-cloud/firestore";
import {
  clinicKnowledgeInstrument,
  clinicKnowledgeQuestionDefinitions
} from "../lib/clinic-evaluation.js";
import {
  assertFullSystemFixtureCoverage,
  fullSystemFixtureCollectionNames
} from "./lib/full-system-fixtures.mjs";
import { assertSafeLocalTarget, isLocalFixtureRecord } from "./lib/local-data-safety.mjs";

const projectId = process.env.GOOGLE_CLOUD_PROJECT || "snack-crm-local";
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || "";
const fixtureSet = "full-system-test";
const fixtureCollections = fullSystemFixtureCollectionNames;

function pacificDateParts() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function dateAtOffset(offset = 0) {
  const { year, month, day } = pacificDateParts();
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day) + offset));
  return date.toISOString().slice(0, 10);
}

function nextWeekday(weekday, minimumOffset = 1) {
  for (let offset = minimumOffset; offset < minimumOffset + 14; offset += 1) {
    const date = new Date(`${dateAtOffset(offset)}T12:00:00Z`);
    if (date.getUTCDay() === weekday) return dateAtOffset(offset);
  }
  return dateAtOffset(minimumOffset);
}

async function deletePreviousFixtures(firestore) {
  for (const collectionName of fixtureCollections) {
    const snapshot = await firestore.collection(collectionName).get();
    const fixtures = snapshot.docs.filter((document) =>
      isLocalFixtureRecord(document.id, document.data(), fixtureSet));
    for (let index = 0; index < fixtures.length; index += 400) {
      const batch = firestore.batch();
      fixtures.slice(index, index + 400).forEach((document) => batch.delete(document.ref));
      await batch.commit();
    }
  }
}

function fixture(data, now) {
  return {
    ...data,
    qaFixture: true,
    qaFixtureSet: fixtureSet,
    createdAt: data.createdAt || now,
    updatedAt: now
  };
}

async function main() {
  const target = assertSafeLocalTarget({ projectId, emulatorHost });
  delete process.env.FIRESTORE_EMULATOR_HOST;
  const firestore = new Firestore({
    projectId: target.projectId,
    host: target.host,
    port: target.port,
    ssl: false
  });

  try {
    await deletePreviousFixtures(firestore);

    const now = new Date().toISOString();
    const today = dateAtOffset(0);
    const yesterday = dateAtOffset(-1);
    const lastWeek = dateAtOffset(-7);
    const nextTuesday = nextWeekday(2);
    const nextWednesday = nextWeekday(3);
    const nextThursday = nextWeekday(4);
    const nextMonth = dateAtOffset(35);
    const currentYear = Number(today.slice(0, 4));

    const ids = {
      avery: "qa-system-client-avery",
      jordan: "qa-system-client-jordan",
      remy: "qa-system-client-remy",
      sky: "qa-system-client-sky",
      waiting: "qa-system-client-waiting",
      graduated: "qa-system-client-graduated",
      referralNew: "qa-system-referral-new",
      referralContacted: "qa-system-referral-contacted",
      referralScheduled: "qa-system-referral-scheduled",
      referralClosed: "qa-system-referral-closed",
      network: "qa-system-network-clinic",
      kitchenUpcoming: "qa-system-kitchen-upcoming",
      kitchenCompleted: "qa-system-kitchen-completed",
      schoolUpcoming: "qa-system-school-upcoming",
      schoolCompleted: "qa-system-school-completed",
      outreachCompleted: "qa-system-outreach-completed",
      outreachUpcoming: "qa-system-outreach-upcoming",
      grant: "qa-system-grant-family-health",
      grantPlanning: "qa-system-grant-community",
      donorA: "qa-system-donor-alex",
      donorB: "qa-system-donor-market",
      campaign: "qa-system-campaign-fall"
    };
    const providerLink = {
      networkId: ids.network,
      providerId: "qa-system-provider-maya",
      organizationName: "QA Riverbend Family Health",
      providerName: "Dr. Maya Thompson"
    };
    const budgetCategorySeeds = [
      ["Organizational", "Rent", 24000],
      ["Organizational", "Utilities", 0],
      ["Organizational", "Insurance", 0],
      ["Organizational", "Marketing", 0],
      ["Organizational", "Accounting / Tax Prep", 0],
      ["Organizational", "Training / CE", 0],
      ["Organizational", "Membership Fees", 0],
      ["Organizational", "Computer Supplies / Software", 3600],
      ["Organizational", "General Supplies", 0],
      ["Payroll", "ED Salary", 48000],
      ["Payroll", "ED Healthcare", 0],
      ["Payroll", "CNC", 0],
      ["Payroll", "Interns", 0],
      ["Clinic", "Workbooks", 2500],
      ["Clinic", "Incentives", 0],
      ["Clinic", "Supplies", 0],
      ["Kitchen", "Groceries", 4800],
      ["Kitchen", "Supplies", 0],
      ["Kitchen", "Home Improvement", 0],
      ["School", "Workbooks", 0],
      ["School", "Incentives", 0],
      ["School", "Supplies", 1800],
      ["Events", "Outreach Giveaways", 0],
      ["Events", "Outreach Fees", 0],
      ["Events", "Outreach Supplies", 1200],
      ["Events", "FHFD", 0]
    ];
    const budgetCategoryRecords = budgetCategorySeeds.map(([groupName, name, annualBudget], index) => {
      const slug = `${groupName}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return ["budgetCategories", `qa-system-budget-${slug}`, fixture({
        budgetYear: currentYear,
        groupName,
        name,
        annualBudget,
        active: true,
        sortOrder: (index + 1) * 10,
        ynabCategoryId: "",
        notes: index === 0 ? "Editable QA category imported from Shannon's initial YNAB category list." : ""
      }, now)];
    });
    const evaluationQuestionRecords = clinicKnowledgeQuestionDefinitions.map((question) => (
      ["performanceEvaluationQuestions", question.id, fixture({ ...question }, now)]
    ));
    const evaluationAnswers = () => clinicKnowledgeQuestionDefinitions.map((question) => {
      const lessonNumber = Number(question.topic.match(/^Lesson (\d+):/)?.[1] || 0);
      return {
        questionId: question.id,
        beforeValue: lessonNumber === 1 ? "Yes" : "No",
        nowValue: lessonNumber <= 5 ? "Yes" : "No"
      };
    });
    const records = [
      ["staffUsers", "qa.staff@snackprogram.org", fixture({
        email: "qa.staff@snackprogram.org",
        displayName: "QA Staff Member",
        title: "Nutrition Educator",
        phone: "(503) 555-0161",
        programs: ["Clinic", "Kitchen"],
        role: "Staff",
        active: true
      }, now)],
      ["staffUsers", "qa.intern@snackprogram.org", fixture({
        email: "qa.intern@snackprogram.org",
        displayName: "QA Intern Member",
        title: "Outreach Intern",
        phone: "(503) 555-0162",
        programs: ["Kitchen", "School", "Outreach"],
        role: "Intern",
        active: true
      }, now)],
      ["adminSettings", "staffAccess", fixture({
        accessLevels: [
          {
            id: "Admin",
            name: "Admin",
            modules: ["schedule", "crm", "outreach", "fundraising", "marketing", "operations", "admin"],
            system: true,
            admin: true
          },
          {
            id: "Staff",
            name: "Staff",
            modules: ["schedule", "crm", "outreach"],
            system: true,
            admin: false
          },
          {
            id: "Intern",
            name: "Intern",
            modules: ["schedule", "outreach"],
            system: true,
            admin: false
          }
        ]
      }, now)],
      ["adminSettings", "grantOrganizationInfo", fixture({
        legalName: "Student Nutrition & Activity Clinic for Kids",
        dbaName: "The SNACK Program",
        ein: "00-0000000",
        mailingAddress: "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128",
        yearFounded: 2023,
        websiteUrl: "https://www.snackprogram.org",
        socialMediaLinks: "Facebook: https://www.facebook.com/thesnackprogram\nInstagram: https://www.instagram.com/thesnackprogram",
        fundingStructure: "QA example: grants, HRSN reimbursement, individual giving, and earned income.",
        mission: "Improve the health and wellness of children and youth in Yamhill County.",
        vision: "Children and families have equitable access to practical nutrition education and lifelong healthy habits.",
        guidingPrinciples: "Inclusive, child-centered, practical, culturally responsive, and free from food or weight stigma.",
        organizationDescription: "The SNACK Program provides free family nutrition education, cooking classes, school classes, and community wellness outreach.",
        populationServed: "Children, youth, and families in Yamhill County, Oregon.",
        annualBudget: "$100,000 QA example",
        copyBlocks: [
          {
            id: "qa-system-copy-mission",
            title: "Short Mission",
            content: "The SNACK Program helps children and families build sustainable, lifelong healthy habits through free nutrition education and wellness activities.",
            notes: "QA reusable grant copy."
          }
        ],
        documents: [
          {
            id: "qa-system-org-document",
            type: "IRS Determination Letter",
            category: "Organization",
            title: "QA IRS Determination Letter",
            url: "https://example.org/qa-irs-letter.pdf",
            fileName: "qa-irs-letter.pdf",
            mimeType: "application/pdf",
            uploadedAt: now,
            uploadedBy: "director@snackprogram.org",
            notes: "QA document link for the full-system test."
          }
        ],
        dataNotes: "All values marked QA example are local test data and are not production records."
      }, now)],
      ["referralNetwork", ids.network, fixture({
        name: "QA Riverbend Family Health",
        type: "Clinic",
        contactName: "Jordan Lee",
        phone: "503-555-0144",
        email: "referrals@example.org",
        website: "https://example.org/riverbend",
        providers: [
          { id: "qa-system-provider-maya", name: "Dr. Maya Thompson", email: "maya@example.org", notes: "Pediatric referrals" },
          { id: "qa-system-provider-alexis", name: "Alexis Nguyen, LCSW", email: "alexis@example.org", notes: "Family resource referrals" }
        ],
        notes: "QA referral network profile."
      }, now)],
      ["clients", ids.avery, fixture({
        firstName: "QA Avery",
        lastName: "Rivera",
        parentName: "Morgan Rivera",
        dateOfBirth: "2015-05-14",
        gender: "Female",
        phone: "503-555-0101",
        email: "morgan.rivera@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Text",
        referralType: "External Clinic Referral",
        referralSource: "QA Riverbend Family Health",
        referralDate: dateAtOffset(-30),
        firstContactDate: dateAtOffset(-29),
        mostRecentContactDate: yesterday,
        firstAppointmentDate: dateAtOffset(-21),
        mostRecentAppointmentDate: lastWeek,
        addressStreet: "120 NE Sample Street",
        addressCity: "McMinnville",
        addressState: "OR",
        addressZip: "97128",
        ycco: true,
        hrsn: true,
        currentLesson: "3",
        status: "Scheduled",
        notes: "QA family with two children.",
        siblingIds: [ids.jordan],
        providerLinks: [providerLink]
      }, now)],
      ["clients", ids.jordan, fixture({
        firstName: "QA Jordan",
        lastName: "Rivera",
        parentName: "Morgan Rivera",
        dateOfBirth: "2017-09-02",
        gender: "Male",
        phone: "503-555-0101",
        email: "morgan.rivera@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Text",
        referralType: "External Clinic Referral",
        referralSource: "QA Riverbend Family Health",
        referralDate: dateAtOffset(-30),
        firstContactDate: dateAtOffset(-29),
        mostRecentContactDate: yesterday,
        firstAppointmentDate: dateAtOffset(-21),
        mostRecentAppointmentDate: lastWeek,
        addressStreet: "120 NE Sample Street",
        addressCity: "McMinnville",
        addressState: "OR",
        addressZip: "97128",
        ycco: true,
        hrsn: false,
        currentLesson: "3",
        status: "Scheduled",
        notes: "Sibling appointment QA.",
        siblingIds: [ids.avery],
        providerLinks: [providerLink]
      }, now)],
      ["clients", ids.remy, fixture({
        firstName: "QA Remy",
        lastName: "Chen",
        parentName: "Taylor Chen",
        dateOfBirth: "2014-11-20",
        gender: "Nonbinary",
        phone: "971-555-0110",
        email: "taylor.chen@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Phone Call",
        referralDate: dateAtOffset(-60),
        firstContactDate: dateAtOffset(-58),
        mostRecentContactDate: lastWeek,
        firstAppointmentDate: dateAtOffset(-50),
        mostRecentAppointmentDate: dateAtOffset(-14),
        status: "Active",
        currentLesson: "5",
        siblingIds: [],
        providerLinks: []
      }, now)],
      ["clients", ids.sky, fixture({
        firstName: "QA Sky",
        lastName: "Martinez",
        parentName: "Casey Martinez",
        dateOfBirth: "2016-03-09",
        gender: "Female",
        phone: "971-555-0118",
        email: "casey.martinez@example.org",
        preferredLanguage: "Spanish",
        preferredContactMethod: "Text",
        referralDate: dateAtOffset(-80),
        firstContactDate: dateAtOffset(-79),
        mostRecentContactDate: dateAtOffset(-10),
        firstAppointmentDate: dateAtOffset(-70),
        mostRecentAppointmentDate: dateAtOffset(-10),
        status: "Needs Reschedule",
        currentLesson: "4",
        siblingIds: [],
        providerLinks: []
      }, now)],
      ["clients", ids.waiting, fixture({
        firstName: "QA Rowan",
        lastName: "Nguyen",
        parentName: "Alex Nguyen",
        dateOfBirth: "2018-06-12",
        gender: "Unspecified",
        phone: "503-555-0119",
        email: "alex.nguyen@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Email",
        referralDate: dateAtOffset(-18),
        firstContactDate: dateAtOffset(-17),
        mostRecentContactDate: dateAtOffset(-4),
        status: "Waiting on Family",
        currentLesson: "1",
        siblingIds: [],
        providerLinks: [],
        notes: "QA client waiting for the family to choose a new date."
      }, now)],
      ["clients", ids.graduated, fixture({
        firstName: "QA Morgan",
        lastName: "Diaz",
        parentName: "Jamie Diaz",
        dateOfBirth: "2012-10-04",
        gender: "Male",
        phone: "971-555-0120",
        email: "jamie.diaz@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Phone Call",
        referralDate: dateAtOffset(-180),
        firstContactDate: dateAtOffset(-178),
        mostRecentContactDate: dateAtOffset(-8),
        firstAppointmentDate: dateAtOffset(-160),
        mostRecentAppointmentDate: dateAtOffset(-8),
        graduationDate: dateAtOffset(-8),
        status: "Graduated",
        currentLesson: "7",
        siblingIds: [],
        providerLinks: [],
        notes: "QA graduate with a completed final Healthy Habits appointment."
      }, now)],
      ["referrals", ids.referralNew, fixture({
        firstName: "QA Lucia",
        lastName: "Santos",
        parentName: "Ana Santos",
        dateOfBirth: "2017-11-22",
        gender: "Female",
        phone: "971-555-0122",
        email: "ana.santos@example.org",
        preferredLanguage: "Spanish",
        preferredContactMethod: "Text",
        referralType: "Community Organization",
        referralSource: "QA Community Resource Center",
        referralDate: today,
        status: "New",
        notes: "Needs an evening call.",
        siblingIds: [],
        providerLinks: []
      }, now)],
      ["referrals", ids.referralContacted, fixture({
        firstName: "QA Mateo",
        lastName: "Brooks",
        parentName: "Riley Brooks",
        dateOfBirth: "2013-02-08",
        gender: "Male",
        phone: "503-555-0129",
        email: "riley.brooks@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Email",
        referralType: "External Clinic Referral",
        referralSource: "QA Riverbend Family Health",
        referralDate: lastWeek,
        firstContactDate: yesterday,
        mostRecentContactDate: yesterday,
        status: "Texted",
        notes: "Waiting for preferred appointment time.",
        siblingIds: [],
        providerLinks: [providerLink]
      }, now)],
      ["referrals", ids.referralScheduled, fixture({
        firstName: "QA Harper",
        lastName: "Wilson",
        parentName: "Cameron Wilson",
        dateOfBirth: "2016-01-15",
        gender: "Female",
        phone: "503-555-0130",
        email: "cameron.wilson@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Phone Call",
        referralType: "Self Referral",
        referralSource: "Public booking",
        referralDate: dateAtOffset(-9),
        firstContactDate: dateAtOffset(-8),
        firstAppointmentDate: nextWednesday,
        mostRecentContactDate: dateAtOffset(-2),
        status: "Scheduled",
        notes: "QA referral with a scheduled first appointment.",
        siblingIds: [],
        providerLinks: []
      }, now)],
      ["referrals", ids.referralClosed, fixture({
        firstName: "QA Ellis",
        lastName: "Reed",
        parentName: "Parker Reed",
        dateOfBirth: "2015-12-01",
        gender: "Male",
        phone: "971-555-0131",
        email: "parker.reed@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Email",
        referralType: "Community Org Referral",
        referralSource: "QA Community Resource Center",
        referralDate: dateAtOffset(-40),
        firstContactDate: dateAtOffset(-39),
        mostRecentContactDate: dateAtOffset(-34),
        status: "Closed / No Further Outreach",
        notes: "QA referral retained for history after outreach ended.",
        siblingIds: [],
        providerLinks: []
      }, now)],
      ["appointments", "qa-system-appointment-family", fixture({
        clientId: ids.avery,
        clientIds: [ids.avery, ids.jordan],
        clientName: "QA Avery Rivera",
        clientNames: ["QA Avery Rivera", "QA Jordan Rivera"],
        appointmentDate: nextTuesday,
        appointmentTime: "14:00",
        appointmentType: "Nutrition Education",
        durationMinutes: 30,
        status: "Scheduled",
        lesson: "3",
        goal: "Try one new fruit together.",
        participantGoals: [
          { clientId: ids.avery, clientName: "QA Avery Rivera", goal: "Try one new fruit.", goalResult: "" },
          { clientId: ids.jordan, clientName: "QA Jordan Rivera", goal: "Add one vegetable at dinner.", goalResult: "" }
        ],
        staffMember: "Cynthia Esparza",
        notes: "Bring family workbook.",
        appointmentNote: "",
        prepChecklist: { prize: true, foodSnack: true },
        location: "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128"
      }, now)],
      ["appointments", "qa-system-appointment-completed", fixture({
        clientId: ids.remy,
        clientIds: [ids.remy],
        clientName: "QA Remy Chen",
        clientNames: ["QA Remy Chen"],
        appointmentDate: lastWeek,
        appointmentTime: "15:00",
        appointmentType: "Nutrition Education",
        durationMinutes: 30,
        status: "Completed",
        lesson: "4",
        goal: "Plan two balanced snacks.",
        goalResult: "Achieved",
        participantGoals: [
          { clientId: ids.remy, clientName: "QA Remy Chen", goal: "Plan two balanced snacks.", goalResult: "Achieved" }
        ],
        staffMember: "Shannon Oddo",
        notes: "QA completed appointment.",
        appointmentNote: "Participant identified two balanced snack ideas.",
        prepChecklist: {},
        location: "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128"
      }, now)],
      ["appointments", "qa-system-appointment-no-show", fixture({
        clientId: ids.sky,
        clientIds: [ids.sky],
        clientName: "QA Sky Martinez",
        clientNames: ["QA Sky Martinez"],
        appointmentDate: dateAtOffset(-10),
        appointmentTime: "16:00",
        appointmentType: "Nutrition Education",
        durationMinutes: 30,
        status: "No-show",
        lesson: "4",
        staffMember: "Cynthia Esparza",
        notes: "QA no-show tied to a Reschedule client.",
        appointmentNote: "",
        prepChecklist: {},
        location: "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128"
      }, now)],
      ["appointments", "qa-system-appointment-canceled", fixture({
        clientId: ids.waiting,
        clientIds: [ids.waiting],
        clientName: "QA Rowan Nguyen",
        clientNames: ["QA Rowan Nguyen"],
        appointmentDate: dateAtOffset(-4),
        appointmentTime: "14:30",
        appointmentType: "Enrollment",
        durationMinutes: 30,
        status: "Canceled",
        staffMember: "Shannon Oddo",
        notes: "QA canceled appointment retained in history.",
        appointmentNote: "Family will call when ready.",
        prepChecklist: {},
        location: "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128"
      }, now)],
      ["appointments", "qa-system-appointment-final", fixture({
        clientId: ids.graduated,
        clientIds: [ids.graduated],
        clientName: "QA Morgan Diaz",
        clientNames: ["QA Morgan Diaz"],
        appointmentDate: dateAtOffset(-8),
        appointmentTime: "13:30",
        appointmentType: "Nutrition Education",
        durationMinutes: 30,
        status: "Completed",
        lesson: "Healthy Habits",
        goal: "Choose one healthy habit to continue after graduation.",
        goalResult: "Achieved",
        participantGoals: [
          { clientId: ids.graduated, clientName: "QA Morgan Diaz", goal: "Choose one healthy habit to continue after graduation.", goalResult: "Achieved" }
        ],
        staffMember: "Shannon Oddo",
        notes: "QA final appointment used to verify graduation counting.",
        appointmentNote: "Completed the final appointment in the series.",
        prepChecklist: {},
        location: "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128"
      }, now)],
      ["appointments", "qa-system-appointment-blocked", fixture({
        clientId: "",
        clientIds: [],
        clientName: "Blocked Time",
        clientNames: [],
        appointmentDate: nextThursday,
        appointmentTime: "17:00",
        appointmentType: "Blocked Time",
        durationMinutes: 30,
        status: "Blocked",
        staffMember: "Shannon Oddo",
        notes: "QA schedule block.",
        prepChecklist: {}
      }, now)],
      ["tasks", "qa-system-task-overdue", fixture({
        title: "Call QA Lucia Santos",
        type: "Call",
        status: "Open",
        priority: "Urgent",
        dueDate: yesterday,
        assignedTo: "Shannon Oddo",
        referralId: ids.referralNew,
        source: "Manual",
        notes: "First outreach attempt."
      }, now)],
      ["tasks", "qa-system-task-today", fixture({
        title: "Schedule QA Sky Martinez",
        type: "Schedule",
        status: "Open",
        priority: "Normal",
        dueDate: today,
        clientId: ids.sky,
        clientName: "QA Sky Martinez",
        source: "Start the Day",
        notes: "Client needs a new appointment time."
      }, now)],
      ["tasks", "qa-system-task-completed", fixture({
        title: "Send QA Avery family reminder",
        type: "Text",
        status: "Done",
        priority: "Normal",
        dueDate: yesterday,
        completedDate: yesterday,
        assignedTo: "Cynthia Esparza",
        clientId: ids.avery,
        clientName: "QA Avery Rivera",
        source: "Manual",
        notes: "QA completed task for history and restore testing."
      }, now)],
      ["activityLogs", "qa-system-activity-avery", fixture({
        type: "Text",
        direction: "Outbound",
        title: "Outbound Text",
        result: "Confirmed",
        description: "Confirmed the QA family appointment.",
        activityDate: yesterday,
        activityTime: "10:15",
        occurredAt: `${yesterday}T10:15:00-07:00`,
        relatedType: "client",
        relatedId: ids.avery,
        relatedName: "QA Avery Rivera"
      }, now)],
      ["activityLogs", "qa-system-activity-referral", fixture({
        type: "Call",
        direction: "Outbound",
        title: "Outbound Call",
        result: "Left Voicemail",
        description: "Left a QA scheduling voicemail.",
        activityDate: yesterday,
        activityTime: "15:30",
        occurredAt: `${yesterday}T15:30:00-07:00`,
        relatedType: "referral",
        relatedId: ids.referralContacted,
        relatedName: "QA Mateo Brooks"
      }, now)],
      ["programSessions", ids.kitchenUpcoming, fixture({
        program: "Kitchen",
        title: "Kids Cooking + Nutrition Class - Ages 8-12",
        classTypeId: "kids-cooking-ages-8-12",
        classTypeLabel: "Kids Cooking + Nutrition Class - Ages 8-12",
        sessionDate: nextThursday,
        startTime: "13:00",
        durationMinutes: 120,
        capacity: 8,
        status: "Scheduled",
        location: "1317 NE Dustin Ct, McMinnville, OR 97128",
        staffMember: "Shannon Oddo",
        participantCount: 0,
        notes: "QA public cooking class."
      }, now)],
      ["programSessions", ids.kitchenCompleted, fixture({
        program: "Kitchen",
        title: "Kids Cooking + Nutrition Class - Ages 6-9",
        classTypeId: "kids-cooking-ages-6-9",
        classTypeLabel: "Kids Cooking + Nutrition Class - Ages 6-9",
        sessionDate: dateAtOffset(-14),
        startTime: "13:00",
        durationMinutes: 120,
        capacity: 8,
        status: "Completed",
        location: "1317 NE Dustin Ct, McMinnville, OR 97128",
        staffMember: "Shannon Oddo",
        participantCount: 6,
        notes: "QA completed cooking class."
      }, now)],
      ["programSessions", ids.schoolUpcoming, fixture({
        program: "School",
        title: "Healthy Snacks Classroom Visit",
        sessionDate: nextWednesday,
        startTime: "10:00",
        durationMinutes: 60,
        status: "Scheduled",
        location: "QA Memorial Elementary",
        staffMember: "Shannon Oddo",
        schoolName: "QA Memorial Elementary",
        gradeGroup: "Grade 4",
        participantCount: 24,
        notes: "QA internal school class."
      }, now)],
      ["programSessions", ids.schoolCompleted, fixture({
        program: "School",
        title: "Food Groups Classroom Class",
        sessionDate: dateAtOffset(-20),
        startTime: "09:30",
        durationMinutes: 60,
        status: "Completed",
        location: "QA Newby Elementary",
        staffMember: "Cynthia Esparza",
        schoolName: "QA Newby Elementary",
        gradeGroup: "Grade 5",
        participantCount: 27,
        notes: "QA completed school class."
      }, now)],
      ["programRegistrations", "qa-system-registration-family", fixture({
        sessionId: ids.kitchenUpcoming,
        program: "Kitchen",
        caregiverName: "Morgan Rivera",
        clientIds: [ids.avery, ids.jordan],
        clientNames: ["QA Avery Rivera", "QA Jordan Rivera"],
        attendeeCount: 2,
        phone: "503-555-0101",
        email: "morgan.rivera@example.org",
        address: "120 NE Sample Street, McMinnville, OR 97128",
        preferredLanguage: "English",
        preferredContactMethod: "Text",
        yccoMember: true,
        consentReminders: true,
        foodRestrictions: "Peanut allergy",
        status: "Registered",
        notes: "QA family registration.",
        createdVia: "Staff"
      }, now)],
      ["programRegistrations", "qa-system-registration-completed", fixture({
        sessionId: ids.kitchenCompleted,
        program: "Kitchen",
        caregiverName: "Taylor Chen",
        clientIds: [ids.remy],
        clientNames: ["QA Remy Chen"],
        attendeeCount: 1,
        phone: "971-555-0110",
        email: "taylor.chen@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Email",
        consentReminders: true,
        foodRestrictions: "None",
        status: "Attended",
        notes: "QA attendance record.",
        createdVia: "Public Booking"
      }, now)],
      ["programRegistrations", "qa-system-registration-completed-group", fixture({
        sessionId: ids.kitchenCompleted,
        program: "Kitchen",
        caregiverName: "QA Community Group",
        clientIds: [],
        clientNames: ["QA Kai Green", "QA Rowan Green", "QA Mina Ortiz", "QA Theo Ortiz", "QA Nia Reed"],
        attendeeCount: 5,
        phone: "503-555-0135",
        email: "qa.group@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Email",
        consentReminders: false,
        foodRestrictions: "One dairy-free meal",
        status: "Attended",
        notes: "QA group attendance record.",
        createdVia: "Staff"
      }, now)],
      ["programRegistrations", "qa-system-registration-waitlist", fixture({
        sessionId: ids.kitchenUpcoming,
        program: "Kitchen",
        caregiverName: "QA Riley Foster",
        clientIds: [],
        clientNames: ["QA Quinn Foster"],
        attendeeCount: 1,
        phone: "503-555-0136",
        email: "riley.foster@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Text",
        consentReminders: true,
        foodRestrictions: "Vegetarian",
        status: "Waitlisted",
        notes: "QA waitlist registration.",
        createdVia: "Public Booking"
      }, now)],
      ["programRegistrations", "qa-system-registration-absent", fixture({
        sessionId: ids.kitchenCompleted,
        program: "Kitchen",
        caregiverName: "QA Devon Park",
        clientIds: [],
        clientNames: ["QA Sage Park"],
        attendeeCount: 1,
        phone: "971-555-0137",
        email: "devon.park@example.org",
        preferredLanguage: "English",
        preferredContactMethod: "Email",
        consentReminders: true,
        foodRestrictions: "None",
        status: "Absent",
        notes: "QA absent registration retained for attendance-rate testing.",
        createdVia: "Staff"
      }, now)],
      ["outreachEvents", ids.outreachCompleted, fixture({
        name: "QA Community Nutrition Night",
        type: "Community Event",
        status: "Completed",
        eventDate: dateAtOffset(-12),
        repeatPattern: "One-time",
        location: "QA Community Center",
        contactName: "Sam Patel",
        contactRole: "Community Liaison",
        phone: "503-555-0170",
        email: "sam.patel@example.org",
        deadline: dateAtOffset(-20),
        registration: "Drop-in",
        setup: "Table, prize wheel, and recipe cards",
        mainActivity: "Family nutrition prize wheel",
        giveaways: "SNACK stickers and recipe cards",
        costAmount: 125,
        costNotes: "Booth fee and printing",
        interactionsCount: 90,
        referralsCount: 5,
        interestListCount: 18,
        participantListCount: 130,
        notes: "QA completed outreach event."
      }, now)],
      ["outreachEvents", ids.outreachUpcoming, fixture({
        name: "QA Back-to-School Resource Fair",
        type: "Resource Fair",
        status: "Scheduled",
        eventDate: nextMonth,
        repeatPattern: "Annual",
        location: "QA Civic Center",
        contactName: "Jamie Wilson",
        contactRole: "Event Coordinator",
        phone: "503-555-0178",
        email: "jamie.wilson@example.org",
        deadline: dateAtOffset(21),
        registration: "Confirmed",
        setup: "Six-foot table and banner",
        mainActivity: "Recipe matching activity",
        giveaways: "Recipe cards",
        costAmount: 75,
        interactionsCount: 0,
        referralsCount: 0,
        interestListCount: 0,
        participantListCount: 0,
        notes: "QA upcoming outreach event."
      }, now)],
      ["outreachContacts", "qa-system-lead-cooking", fixture({
        eventId: ids.outreachCompleted,
        contactName: "QA Jamie Cole",
        childName: "QA Finley Cole",
        organizationName: "",
        phone: "971-555-0181",
        email: "jamie.cole@example.org",
        preferredLanguage: "English",
        interestType: "Cooking Classes",
        status: "New",
        audienceGroups: ["Cooking Classes"],
        marketingConsent: true,
        consentSource: "Outreach signup",
        consentDate: dateAtOffset(-12),
        notes: "Interested in the next ages 8-12 class."
      }, now)],
      ["outreachContacts", "qa-system-lead-converted", fixture({
        eventId: ids.outreachCompleted,
        contactName: "QA Taylor Morgan",
        childName: "QA Casey Morgan",
        organizationName: "",
        phone: "503-555-0182",
        email: "taylor.morgan@example.org",
        preferredLanguage: "English",
        interestType: "Family Nutrition Appointment",
        status: "Referral Created",
        audienceGroups: ["Newsletter"],
        marketingConsent: true,
        consentSource: "Outreach signup",
        consentDate: dateAtOffset(-12),
        referralId: ids.referralScheduled,
        conversionType: "Referral",
        convertedAt: yesterday,
        convertedRecordId: ids.referralScheduled,
        notes: "QA converted lead retained in lead history."
      }, now)],
      ["tasks", "qa-system-outreach-task", fixture({
        title: "Confirm QA resource fair supplies",
        type: "Task",
        status: "Open",
        priority: "Normal",
        dueDate: dateAtOffset(14),
        assignedTo: "Shannon Oddo",
        outreachEventId: ids.outreachUpcoming,
        outreachEventName: "QA Back-to-School Resource Fair",
        source: "Outreach",
        notes: "Check banner and recipe card inventory."
      }, now)],
      ["grants", ids.grant, fixture({
        foundationName: "QA Family Health Foundation",
        grantName: "Healthy Families Initiative",
        status: "Awarded",
        openDate: dateAtOffset(-90),
        deadlineDate: dateAtOffset(-45),
        awardExpectedDate: dateAtOffset(-10),
        amountMin: 15000,
        amountMax: 30000,
        amountRequested: 25000,
        focusAreas: "Child nutrition and family wellness",
        recurrence: "Annual",
        applicationFrequency: "Once per year",
        contactName: "Robin Grant",
        contactRole: "Program Officer",
        contactEmail: "robin.grant@example.org",
        contactPhone: "503-555-0190",
        websiteUrl: "https://example.org/foundation",
        reportingRequirements: "Quarterly narrative and final budget report",
        notes: "QA awarded grant with linked revenue.",
        documents: [
          {
            id: "qa-system-grant-document",
            type: "Application",
            category: "Application",
            title: "QA Healthy Families Application",
            url: "https://example.org/qa-grant-application.pdf",
            fileName: "qa-grant-application.pdf",
            mimeType: "application/pdf",
            uploadedAt: now,
            uploadedBy: "director@snackprogram.org",
            notes: "QA grant document link."
          }
        ]
      }, now)],
      ["grants", ids.grantPlanning, fixture({
        foundationName: "QA Community Trust",
        grantName: "Youth Wellness Fund",
        status: "Planning",
        openDate: nextTuesday,
        deadlineDate: nextMonth,
        deadlineTime: "17:00",
        amountMin: 5000,
        amountMax: 15000,
        amountRequested: 10000,
        focusAreas: "Youth wellness",
        contactName: "Dana Fields",
        contactEmail: "dana.fields@example.org",
        reportingRequirements: "Annual outcome report",
        notes: "QA pipeline grant.",
        documents: []
      }, now)],
      ["grantQuestions", "qa-system-grant-answer", fixture({
        prompt: "Describe the population your organization serves.",
        answer: "The SNACK Program serves children, youth, and families in Yamhill County with free nutrition education and wellness activities.",
        category: "Organization",
        tags: ["population", "mission"],
        notes: "QA reusable answer."
      }, now)],
      ["fundraisingDonors", ids.donorA, fixture({
        name: "QA Alex Smith",
        status: "Recurring",
        donorType: "Individual",
        email: "alex.smith@example.org",
        phone: "503-555-0201",
        address: "44 NW Sample Ave, McMinnville, OR 97128",
        preferredContact: "Email",
        recurringAmount: 25,
        recurringFrequency: "Monthly",
        campaignId: ids.campaign,
        campaignName: "QA Fall Family Nutrition Fund",
        acknowledgementStatus: "Sent",
        notes: "QA recurring donor."
      }, now)],
      ["fundraisingDonors", ids.donorB, fixture({
        name: "QA Riverbend Market",
        status: "Active",
        donorType: "Business",
        email: "giving@example.org",
        phone: "503-555-0208",
        preferredContact: "Email",
        acknowledgementStatus: "Pending",
        notes: "QA business sponsor."
      }, now)],
      ["fundraisingCampaigns", ids.campaign, fixture({
        name: "QA Fall Family Nutrition Fund",
        status: "Active",
        campaignType: "Annual Appeal",
        startDate: dateAtOffset(-30),
        endDate: nextMonth,
        goalAmount: 10000,
        raisedAmount: 0,
        audience: "Community donors and partners",
        channels: "Email, social media, and events",
        owner: "Shannon Oddo",
        contactName: "Shannon Oddo",
        contactEmail: "director@snackprogram.org",
        notes: "QA active fundraising campaign."
      }, now)],
      ["fundraisingGifts", "qa-system-gift-recurring", fixture({
        donorId: ids.donorA,
        donorName: "QA Alex Smith",
        campaignId: ids.campaign,
        campaignName: "QA Fall Family Nutrition Fund",
        giftDate: dateAtOffset(-25),
        amount: 25,
        giftType: "Individual Gift",
        paymentMethod: "Online",
        recurring: true,
        recurringFrequency: "Monthly",
        acknowledgementStatus: "Sent",
        externalTransactionId: "QA-GIFT-001",
        notes: "QA recurring gift."
      }, now)],
      ["fundraisingGifts", "qa-system-gift-sponsor", fixture({
        donorId: ids.donorB,
        donorName: "QA Riverbend Market",
        campaignId: ids.campaign,
        campaignName: "QA Fall Family Nutrition Fund",
        giftDate: dateAtOffset(-5),
        amount: 1000,
        giftType: "Sponsorship",
        paymentMethod: "Check",
        recurring: false,
        acknowledgementStatus: "Pending",
        externalTransactionId: "QA-GIFT-002",
        notes: "QA business sponsorship."
      }, now)],
      ["earnedIncome", "qa-system-income-grant", fixture({
        name: "QA Healthy Families Grant Payment",
        activityType: "Grant Revenue",
        status: "Received",
        source: "QA Family Health Foundation",
        serviceType: "Grant Revenue",
        paymentDate: dateAtOffset(-10),
        amountBilled: 25000,
        amountReceived: 25000,
        payerName: "QA Family Health Foundation",
        grantId: ids.grant,
        grantName: "Healthy Families Initiative",
        notes: "QA grant payment."
      }, now)],
      ["earnedIncome", "qa-system-income-workbook", fixture({
        name: "QA Workbook Sales",
        activityType: "Workbook Sale",
        status: "Received",
        source: "Workbook sales",
        serviceType: "Workbook Sale",
        paymentDate: dateAtOffset(-3),
        amountBilled: 675,
        amountReceived: 675,
        payerName: "Online store",
        notes: "QA workbook sales total."
      }, now)],
      ["earnedIncome", "qa-system-income-toolkit", fixture({
        name: "QA Toolkit Sales",
        activityType: "Toolkit Sale",
        status: "Received",
        source: "Toolkit sales",
        serviceType: "Toolkit Sale",
        paymentDate: dateAtOffset(-2),
        amountBilled: 320,
        amountReceived: 320,
        payerName: "Online store",
        notes: "QA toolkit sales total."
      }, now)],
      ["earnedIncome", "qa-system-income-merch", fixture({
        name: "QA Merchandise Sales",
        activityType: "Merchandise Sale",
        status: "Received",
        source: "Merchandise sales",
        serviceType: "Merchandise Sale",
        paymentDate: today,
        amountBilled: 210,
        amountReceived: 210,
        payerName: "Community events",
        notes: "QA merchandise sales total."
      }, now)],
      ["hrsnClaims", "qa-system-hrsn-draft", fixture({
        submitted: false,
        approved: false,
        clientId: ids.avery,
        name: "QA Avery Rivera",
        dateOfBirth: "2015-05-14",
        medicaidId: "QA-MED-0001",
        address: "120 NE Sample Street, McMinnville, OR 97128",
        serviceDate: today,
        durationMinutes: 30,
        amount: 0,
        coveredPopulations: ["Physical Health Need"],
        foodSecurityScore: 2,
        descriptions: ["Engaging Members who may be eligible for HRSN Services - in person (office) meeting"],
        outcomes: ["HRSN Referral"],
        invoiceNumber: "",
        notes: "QA draft billing record. This is not a real Medicaid identifier."
      }, now)],
      ["hrsnClaims", "qa-system-hrsn-submitted", fixture({
        submitted: true,
        approved: false,
        clientId: ids.remy,
        name: "QA Remy Chen",
        dateOfBirth: "2014-02-18",
        medicaidId: "QA-MED-0002",
        address: "88 SE Example Avenue, McMinnville, OR 97128",
        serviceDate: yesterday,
        durationMinutes: 45,
        amount: 112.5,
        coveredPopulations: ["Physical Health Need", "Young Adult With Special Healthcare Needs"],
        foodSecurityScore: 4,
        descriptions: [
          "Engaging Members who may be eligible for HRSN Services - in person (office) meeting",
          "Identifying and verifying the Member's CCO enrollment"
        ],
        outcomes: ["O&E Invoice", "HRSN Referral"],
        invoiceNumber: "QA-INVOICE-0002",
        notes: "QA submitted billing record."
      }, now)],
      ["hrsnClaims", "qa-system-hrsn-approved", fixture({
        submitted: true,
        approved: true,
        approvalDate: lastWeek,
        clientId: ids.sky,
        name: "QA Sky Martinez",
        dateOfBirth: "2016-11-07",
        medicaidId: "QA-MED-0003",
        address: "305 NW Demo Court, McMinnville, OR 97128",
        serviceDate: lastWeek,
        durationMinutes: 60,
        amount: 150,
        coveredPopulations: ["Behavioral Health Need"],
        foodSecurityScore: 5,
        descriptions: [
          "Identifying and verifying the Member's CCO enrollment",
          "Verifying the Member is Presumed HRSN Eligible through screening questionnaire & conversational questions"
        ],
        outcomes: ["NE Invoice"],
        invoiceNumber: "QA-INVOICE-0003",
        notes: "QA approved billing record."
      }, now)],
      ...budgetCategoryRecords,
      ["marketingCampaigns", "qa-system-marketing-newsletter", fixture({
        name: "QA Summer Newsletter",
        status: "Draft",
        campaignType: "Newsletter",
        channel: "Email",
        owner: "Shannon Oddo",
        startDate: today,
        sendDate: nextTuesday,
        subject: "Summer at The SNACK Program",
        preheader: "Classes, family nutrition, and community updates",
        goal: "Share program updates and fill upcoming classes",
        callToAction: "View Upcoming Classes",
        language: "English",
        audience: "Newsletter, Cooking Classes",
        audienceCount: 78,
        audienceSource: "Marketing Contacts",
        consentRule: "Active contacts with documented consent",
        deliveryTool: "MailerLite",
        sendWindow: "Tuesday morning",
        metric: "Clicks to class registration",
        nextStep: "Complete draft in MailerLite",
        notes: "QA draft campaign."
      }, now)],
      ["marketingCampaigns", "qa-system-marketing-results", fixture({
        name: "QA Spring Cooking Class Email",
        status: "Complete",
        campaignType: "Email",
        channel: "Email",
        owner: "Shannon Oddo",
        startDate: dateAtOffset(-60),
        sendDate: dateAtOffset(-45),
        endDate: dateAtOffset(-30),
        subject: "New Cooking Classes Are Open",
        goal: "Register families for cooking classes",
        callToAction: "Register",
        language: "English",
        audience: "Cooking Classes",
        audienceCount: 62,
        audienceSource: "Marketing Contacts",
        consentRule: "Active contacts with documented consent",
        deliveryTool: "MailerLite",
        metric: "Class registrations",
        notes: "QA completed campaign with results.",
        sentCount: 62,
        openCount: 41,
        clickCount: 18,
        conversionCount: 6
      }, now)],
      ["marketingCampaigns", "qa-system-marketing-scheduled", fixture({
        name: "QA Cooking Class Reminder",
        status: "Scheduled",
        campaignType: "Email",
        channel: "Email",
        owner: "Shannon Oddo",
        startDate: today,
        sendDate: nextThursday,
        subject: "Your Cooking Class Is Coming Up",
        preheader: "Location, time, and what to bring",
        goal: "Reduce cooking class absences",
        callToAction: "View Registration",
        language: "English",
        audience: "Cooking Classes",
        audienceCount: 12,
        audienceSource: "Marketing Contacts",
        consentRule: "Active Cooking Classes contacts with documented consent",
        deliveryTool: "MailerLite",
        sendWindow: "Two days before class",
        metric: "Attendance",
        nextStep: "Review in MailerLite before send",
        notes: "QA scheduled campaign. No local action sends email."
      }, now)],
      ["performanceEvaluationInstruments", clinicKnowledgeInstrument.id, fixture({
        ...clinicKnowledgeInstrument,
        notes: `${clinicKnowledgeInstrument.notes} The local sample responses provide a controlled scoring example.`
      }, now)],
      ...evaluationQuestionRecords,
      ["performanceEvaluationResponses", "qa-system-evaluation-graduation", fixture({
        instrumentId: clinicKnowledgeInstrument.id,
        instrumentName: clinicKnowledgeInstrument.name,
        instrumentVersion: clinicKnowledgeInstrument.version,
        instrumentEffectiveDate: clinicKnowledgeInstrument.effectiveDate,
        programArea: "Clinic",
        clientId: ids.graduated,
        appointmentId: "qa-system-appointment-final",
        administrationPoint: "Graduation",
        responseDate: dateAtOffset(-8),
        status: "Complete",
        respondentType: "",
        respondentName: "",
        language: "English",
        answers: evaluationAnswers(),
        notes: "Controlled retrospective sample: Before SNACK is 14.3%; Now is 71.4%; gain is 57.1 percentage points."
      }, now)],
      ["marketingSubscribers", "qa-system-marketing-volunteer", fixture({
        fullName: "QA Taylor Volunteer",
        firstName: "QA Taylor",
        lastName: "Volunteer",
        email: "taylor.volunteer@example.org",
        normalizedEmail: "taylor.volunteer@example.org",
        phone: "503-555-0220",
        preferredLanguage: "English",
        communicationPreference: "Email",
        status: "Active",
        audienceGroups: ["Newsletter", "Volunteers"],
        tags: ["Newsletter", "Volunteers"],
        emailOptOut: false,
        signupSource: "Website form",
        consentSource: "Website signup",
        consentDate: dateAtOffset(-40),
        dateSubscribed: dateAtOffset(-40),
        notes: "QA volunteer contact.",
        totalEmailsSent: 2,
        totalOpens: 2,
        totalClicks: 1
      }, now)]
    ];
    assertFullSystemFixtureCoverage(records);

    for (let index = 0; index < records.length; index += 400) {
      const batch = firestore.batch();
      records.slice(index, index + 400).forEach(([collectionName, id, data]) => {
        batch.set(firestore.collection(collectionName).doc(id), data);
      });
      await batch.commit();
    }

    const counts = records.reduce((totals, [collectionName]) => {
      totals[collectionName] = (totals[collectionName] || 0) + 1;
      return totals;
    }, {});
    console.log(`Local full-system fixtures ready for ${today}.`);
    Object.entries(counts).forEach(([collectionName, count]) => console.log(`${collectionName}: ${count}`));
  } finally {
    await firestore.terminate();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
