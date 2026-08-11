const controlledCountingQaFixtureSet = "controlled-counting-revenue-qa";
const controlledCountingQaPeriod = Object.freeze({
  startDate: "2026-07-01",
  endDate: "2026-09-30"
});

const controlledCountingQaCollections = Object.freeze([
  "clients",
  "referrals",
  "appointments",
  "programSessions",
  "programRegistrations",
  "outreachEvents",
  "fundraisingDonors",
  "fundraisingGifts",
  "earnedIncome",
  "hrsnClaims",
  "performanceMeasurements"
]);

const controlledCountingQaExpected = Object.freeze({
  operations: Object.freeze({
    organizationEstimatedChildrenServed: 22,
    organizationProgramEngagements: 25,
    clinicAppointmentsDelivered: 2,
    clinicReferralsReceived: 1,
    clinicReferralContactDays: 2,
    clinicReferralAppointmentDays: 10,
    clinicNoShowRate: 33.3,
    clinicGoalAchievement: 33.3,
    clinicGoalPartlyAchieved: 33.3,
    schoolSchoolsReached: 1,
    schoolClassesDelivered: 1,
    schoolStudentsReached: 20,
    cookingClassesDelivered: 1,
    cookingParticipantsServed: 2,
    cookingTotalAttendance: 2,
    cookingAttendanceRate: 66.7,
    cookingAverageAttendance: 2,
    cookingRepeatParticipation: 0,
    communityEventsCompleted: 1,
    communityFamiliesReached: 8,
    communityEventParticipants: 12,
    communityReferralsGenerated: 3,
    financialGrantRevenue: 1000,
    financialHrsnRevenue: 250,
    financialGiftRevenue: 700,
    financialIndividualGiving: 700,
    financialOtherEarnedIncome: 100,
    financialWorkbookSales: 100,
    financialEarnedIncomeReceived: 350,
    financialNewDonors: 1,
    financialRepeatDonors: 1,
    financialMonthlyDonors: 1,
    financialAverageGiftSize: 350,
    financialTotalRevenue: 2050,
    financialGrantConcentration: 48.8
  }),
  financialActivity: Object.freeze({
    quarterTotal: 2050,
    quarterTransactions: 5,
    yearToDateTotal: 2150,
    yearToDateTransactions: 6,
    yearToDateGrantRevenue: 1000
  })
});

function controlledFixture(data, now) {
  return {
    ...data,
    qaFixture: true,
    qaFixtureSet: controlledCountingQaFixtureSet,
    createdAt: data.createdAt || now,
    updatedAt: now
  };
}

function buildControlledCountingQaRecords(now = "2026-07-29T12:00:00.000Z") {
  const ids = {
    avery: "qa-counting-client-avery",
    jordan: "qa-counting-client-jordan",
    casey: "qa-counting-client-casey",
    kitchen: "qa-counting-kitchen-class",
    school: "qa-counting-school-class",
    donorRepeat: "qa-counting-donor-repeat",
    donorNew: "qa-counting-donor-new"
  };

  return [
    ["clients", ids.avery, controlledFixture({
      firstName: "QA Count Avery",
      lastName: "Rivera",
      dateOfBirth: "2014-05-10",
      caregiverName: "Morgan Rivera",
      phone: "503-555-0201",
      email: "qa.counting.rivera@example.org",
      preferredLanguage: "English",
      preferredContactMethod: "Email",
      status: "Active",
      siblingIds: [ids.jordan]
    }, now)],
    ["clients", ids.jordan, controlledFixture({
      firstName: "QA Count Jordan",
      lastName: "Rivera",
      dateOfBirth: "2016-08-12",
      caregiverName: "Morgan Rivera",
      phone: "503-555-0201",
      email: "qa.counting.rivera@example.org",
      preferredLanguage: "English",
      preferredContactMethod: "Email",
      status: "Active",
      siblingIds: [ids.avery]
    }, now)],
    ["clients", ids.casey, controlledFixture({
      firstName: "QA Count Casey",
      lastName: "Morgan",
      dateOfBirth: "2015-02-15",
      caregiverName: "Taylor Morgan",
      phone: "503-555-0202",
      email: "qa.counting.casey@example.org",
      preferredLanguage: "English",
      preferredContactMethod: "Phone Call",
      status: "Needs Reschedule",
      siblingIds: []
    }, now)],
    ["referrals", "qa-counting-referral", controlledFixture({
      firstName: "QA Count Referral",
      lastName: "Child",
      parentName: "QA Count Caregiver",
      phone: "503-555-0203",
      preferredLanguage: "English",
      referralType: "Self Referral",
      referralDate: "2026-07-01",
      firstContactDate: "2026-07-03",
      firstAppointmentDate: "2026-07-11",
      status: "Scheduled"
    }, now)],
    ["appointments", "qa-counting-appointment-siblings", controlledFixture({
      clientId: ids.avery,
      clientIds: [ids.avery, ids.jordan],
      clientName: "QA Count Avery Rivera",
      clientNames: ["QA Count Avery Rivera", "QA Count Jordan Rivera"],
      appointmentDate: "2026-07-10",
      appointmentTime: "14:00",
      appointmentType: "Nutrition Education",
      durationMinutes: 30,
      status: "Completed",
      lesson: "3",
      goal: "Try one new fruit.",
      goalResult: "Achieved",
      participantGoals: [
        {
          clientId: ids.avery,
          clientName: "QA Count Avery Rivera",
          goal: "Try one new fruit.",
          goalResult: "Achieved"
        },
        {
          clientId: ids.jordan,
          clientName: "QA Count Jordan Rivera",
          goal: "Add one vegetable at dinner.",
          goalResult: "Not Achieved"
        }
      ],
      staffMember: "QA Staff Member",
      notes: "Controlled sibling counting record."
    }, now)],
    ["appointments", "qa-counting-appointment-repeat", controlledFixture({
      clientId: ids.avery,
      clientIds: [ids.avery],
      clientName: "QA Count Avery Rivera",
      clientNames: ["QA Count Avery Rivera"],
      appointmentDate: "2026-07-17",
      appointmentTime: "15:00",
      appointmentType: "Nutrition Education",
      durationMinutes: 30,
      status: "Completed",
      lesson: "4",
      goal: "Plan one balanced snack.",
      goalResult: "Partly Achieved",
      participantGoals: [
        {
          clientId: ids.avery,
          clientName: "QA Count Avery Rivera",
          goal: "Plan one balanced snack.",
          goalResult: "Partly Achieved"
        }
      ],
      staffMember: "QA Staff Member",
      notes: "A repeat child adds an engagement but not another unique child."
    }, now)],
    ["appointments", "qa-counting-appointment-no-show", controlledFixture({
      clientId: ids.casey,
      clientIds: [ids.casey],
      clientName: "QA Count Casey Morgan",
      clientNames: ["QA Count Casey Morgan"],
      appointmentDate: "2026-07-20",
      appointmentTime: "16:00",
      appointmentType: "Nutrition Education",
      durationMinutes: 30,
      status: "No-show",
      lesson: "2",
      staffMember: "QA Staff Member",
      notes: "No-show denominator record."
    }, now)],
    ["appointments", "qa-counting-appointment-validation", controlledFixture({
      clientId: ids.avery,
      clientIds: [ids.avery, ids.jordan],
      clientName: "QA Count Avery Rivera",
      clientNames: ["QA Count Avery Rivera", "QA Count Jordan Rivera"],
      appointmentDate: "2026-09-10",
      appointmentTime: "14:00",
      appointmentType: "Nutrition Education",
      durationMinutes: 30,
      status: "Scheduled",
      lesson: "5",
      staffMember: "QA Staff Member",
      notes: "Use only for the missing sibling result validation check."
    }, now)],
    ["programSessions", ids.kitchen, controlledFixture({
      program: "Kitchen",
      title: "QA Counting Kitchen Class",
      classTypeId: "qa-counting-kitchen",
      classTypeLabel: "QA Counting Kitchen Class",
      sessionDate: "2026-07-15",
      startTime: "13:00",
      durationMinutes: 120,
      capacity: 8,
      status: "Completed",
      location: "1317 NE Dustin Ct, McMinnville, OR 97128",
      staffMember: "QA Staff Member",
      participantCount: 3
    }, now)],
    ["programRegistrations", "qa-counting-kitchen-attended", controlledFixture({
      sessionId: ids.kitchen,
      program: "Kitchen",
      caregiverName: "Morgan Rivera",
      clientIds: [ids.avery, ids.jordan],
      clientNames: ["QA Count Avery Rivera", "QA Count Jordan Rivera"],
      attendeeCount: 2,
      status: "Attended",
      foodRestrictions: "None"
    }, now)],
    ["programRegistrations", "qa-counting-kitchen-absent", controlledFixture({
      sessionId: ids.kitchen,
      program: "Kitchen",
      caregiverName: "Taylor Morgan",
      clientIds: [ids.casey],
      clientNames: ["QA Count Casey Morgan"],
      attendeeCount: 1,
      status: "Absent",
      foodRestrictions: "None"
    }, now)],
    ["programSessions", ids.school, controlledFixture({
      program: "School",
      title: "QA Counting School Class",
      sessionDate: "2026-07-16",
      startTime: "10:00",
      durationMinutes: 60,
      status: "Completed",
      location: "QA Counting Elementary",
      schoolName: "QA Counting Elementary",
      gradeGroup: "Grade 4",
      participantCount: 20,
      staffMember: "QA Staff Member"
    }, now)],
    ["outreachEvents", "qa-counting-outreach-event", controlledFixture({
      name: "QA Counting Community Event",
      type: "Community Event",
      status: "Completed",
      eventDate: "2026-07-18",
      interactionsCount: 8,
      participantListCount: 12,
      referralsCount: 3,
      interestListCount: 4,
      location: "QA Community Center"
    }, now)],
    ["fundraisingDonors", ids.donorRepeat, controlledFixture({
      name: "QA Counting Repeat Donor",
      donorType: "Individual",
      status: "Active",
      email: "qa.counting.repeat@example.org"
    }, now)],
    ["fundraisingDonors", ids.donorNew, controlledFixture({
      name: "QA Counting New Donor",
      donorType: "Individual",
      status: "Active",
      email: "qa.counting.new@example.org"
    }, now)],
    ["fundraisingGifts", "qa-counting-gift-prior", controlledFixture({
      donorId: ids.donorRepeat,
      donorName: "QA Counting Repeat Donor",
      giftDate: "2026-06-15",
      amount: 100,
      giftType: "Individual",
      recurring: false,
      paymentMethod: "Check"
    }, now)],
    ["fundraisingGifts", "qa-counting-gift-repeat", controlledFixture({
      donorId: ids.donorRepeat,
      donorName: "QA Counting Repeat Donor",
      giftDate: "2026-07-07",
      amount: 500,
      giftType: "Individual",
      recurring: false,
      paymentMethod: "Check"
    }, now)],
    ["fundraisingGifts", "qa-counting-gift-new", controlledFixture({
      donorId: ids.donorNew,
      donorName: "QA Counting New Donor",
      giftDate: "2026-07-08",
      amount: 200,
      giftType: "Individual",
      recurring: true,
      recurringFrequency: "Monthly",
      paymentMethod: "Online"
    }, now)],
    ["fundraisingGifts", "qa-counting-gift-in-kind", controlledFixture({
      donorId: ids.donorNew,
      donorName: "QA Counting New Donor",
      giftDate: "2026-07-09",
      amount: 200,
      giftType: "In-Kind",
      recurring: false,
      paymentMethod: "In-Kind",
      notes: "Must not increase revenue."
    }, now)],
    ["earnedIncome", "qa-counting-income-grant", controlledFixture({
      name: "QA Counting Grant Payment",
      activityType: "Grant Revenue",
      paymentDate: "2026-07-05",
      periodStart: "2026-07-01",
      periodEnd: "2026-09-30",
      amountBilled: 1000,
      amountReceived: 1000,
      status: "Received",
      source: "QA Counting Foundation"
    }, now)],
    ["earnedIncome", "qa-counting-income-workbook", controlledFixture({
      name: "QA Counting Workbook Sale",
      activityType: "Workbook Sale",
      paymentDate: "2026-07-06",
      periodStart: "2026-07-01",
      periodEnd: "2026-07-31",
      quantity: 10,
      unitPrice: 10,
      amountBilled: 100,
      amountReceived: 100,
      status: "Received",
      source: "QA Workbook Customer"
    }, now)],
    ["earnedIncome", "qa-counting-income-legacy-hrsn", controlledFixture({
      name: "QA Legacy HRSN Duplicate",
      activityType: "HRSN Revenue",
      paymentDate: "2026-07-09",
      periodStart: "2026-07-01",
      periodEnd: "2026-07-31",
      amountBilled: 250,
      amountReceived: 250,
      status: "Received",
      source: "Legacy Manual Entry",
      notes: "Must be visible as excluded and must not duplicate the approved HRSN claim."
    }, now)],
    ["earnedIncome", "qa-counting-income-outside-period", controlledFixture({
      name: "QA Prior-Year Grant",
      activityType: "Grant Revenue",
      paymentDate: "2025-12-31",
      periodStart: "2025-12-01",
      periodEnd: "2025-12-31",
      amountBilled: 9999,
      amountReceived: 9999,
      status: "Received",
      source: "QA Prior-Year Foundation"
    }, now)],
    ["hrsnClaims", "qa-counting-hrsn-approved", controlledFixture({
      clientId: ids.casey,
      name: "QA Count Casey Morgan",
      dateOfBirth: "2015-02-15",
      medicaidNumber: "QA-COUNT-0001",
      address: "100 QA Street, McMinnville, OR 97128",
      serviceDate: "2026-07-07",
      durationMinutes: 30,
      amount: 250,
      coveredPopulations: ["Physical Health Need"],
      foodSecurityScore: 2,
      descriptions: ["Identifying and verifying the Member's CCO enrollment"],
      outcomes: ["HRSN Referral"],
      invoiceNumber: "QA-COUNT-INVOICE-1",
      submitted: true,
      approved: true,
      approvalDate: "2026-07-08"
    }, now)],
    ["hrsnClaims", "qa-counting-hrsn-submitted", controlledFixture({
      clientId: ids.avery,
      name: "QA Count Avery Rivera",
      dateOfBirth: "2014-05-10",
      medicaidNumber: "QA-COUNT-0002",
      address: "101 QA Street, McMinnville, OR 97128",
      serviceDate: "2026-07-08",
      durationMinutes: 45,
      amount: 400,
      coveredPopulations: ["Physical Health Need"],
      foodSecurityScore: 3,
      descriptions: ["Verifying the Member is Presumed HRSN Eligible through screening questionnaire & conversational questions"],
      outcomes: ["O&E Invoice"],
      invoiceNumber: "QA-COUNT-INVOICE-2",
      submitted: true,
      approved: false,
      approvalDate: ""
    }, now)],
    ["hrsnClaims", "qa-counting-hrsn-prior-year", controlledFixture({
      clientId: ids.jordan,
      name: "QA Count Jordan Rivera",
      dateOfBirth: "2016-08-12",
      medicaidNumber: "QA-COUNT-0003",
      address: "102 QA Street, McMinnville, OR 97128",
      serviceDate: "2025-12-20",
      durationMinutes: 30,
      amount: 777,
      coveredPopulations: ["Physical Health Need"],
      foodSecurityScore: 1,
      descriptions: ["Engaging Members who may be eligible for HRSN Services - in person (office) meeting"],
      outcomes: ["NE Invoice"],
      invoiceNumber: "QA-COUNT-INVOICE-3",
      submitted: true,
      approved: true,
      approvalDate: "2025-12-31"
    }, now)]
  ];
}

function controlledCountingQaData(records = buildControlledCountingQaRecords()) {
  const data = Object.fromEntries(controlledCountingQaCollections.map((collectionName) => [collectionName, []]));
  records.forEach(([collectionName, id, record]) => {
    if (!data[collectionName]) data[collectionName] = [];
    data[collectionName].push({ id, ...record });
  });
  return data;
}

export {
  buildControlledCountingQaRecords,
  controlledCountingQaCollections,
  controlledCountingQaData,
  controlledCountingQaExpected,
  controlledCountingQaFixtureSet,
  controlledCountingQaPeriod
};
