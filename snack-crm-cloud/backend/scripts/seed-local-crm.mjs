import { Firestore } from "@google-cloud/firestore";

const projectId = process.env.GOOGLE_CLOUD_PROJECT || "snack-crm-local";
const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST || "";

function localEmulatorAddress(value) {
  const match = String(value).match(/^(localhost|127\.0\.0\.1):(\d+)$/);
  if (!match) {
    throw new Error("FIRESTORE_EMULATOR_HOST must point to a local Firestore emulator.");
  }

  return { host: match[1], port: Number(match[2]) };
}

function localDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

async function deletePreviousFixtures(firestore) {
  const collections = ["referrals", "clients", "appointments", "activityLogs", "referralNetwork"];

  for (const collectionName of collections) {
    const snapshot = await firestore.collection(collectionName).get();
    const fixtureDocuments = snapshot.docs.filter((document) => {
      const data = document.data();
      return document.id.startsWith("qa-")
        || String(data.relatedId || "").startsWith("qa-")
        || String(data.sourceReferralId || "").startsWith("qa-")
        || data.qaFixture === true;
    });

    for (let index = 0; index < fixtureDocuments.length; index += 400) {
      const batch = firestore.batch();
      fixtureDocuments.slice(index, index + 400).forEach((document) => batch.delete(document.ref));
      await batch.commit();
    }
  }
}

async function main() {
  if (projectId === "snack-crm") {
    throw new Error("Local CRM fixtures cannot run against the production project.");
  }

  const address = localEmulatorAddress(emulatorHost);
  delete process.env.FIRESTORE_EMULATOR_HOST;
  const firestore = new Firestore({
    projectId,
    host: address.host,
    port: address.port,
    ssl: false
  });

  try {
    await deletePreviousFixtures(firestore);

    const today = process.env.QA_DATE || localDate();
    const now = new Date().toISOString();
    const networkClinicId = "qa-network-clinic";
    const networkSchoolId = "qa-network-school";
    const providerClinicId = "qa-provider-riverbend";
    const providerSchoolId = "qa-provider-school";
    const clientMiloId = "qa-client-milo";
    const clientTessaId = "qa-client-tessa";
    const referralLuciaId = "qa-referral-lucia";
    const referralMateoId = "qa-referral-mateo";
    const clinicProviderLink = {
      networkId: networkClinicId,
      providerId: providerClinicId,
      organizationName: "Riverbend Pediatric and Family Health Center",
      providerName: "Dr. Maya Thompson"
    };

    const records = [
      ["referralNetwork", networkClinicId, {
        name: "Riverbend Pediatric and Family Health Center",
        type: "Clinic",
        contactName: "Jordan Lee",
        phone: "503-555-0144",
        email: "referrals@riverbend.example",
        website: "https://riverbend.example",
        providers: [
          {
            id: providerClinicId,
            name: "Dr. Maya Thompson",
            email: "maya.thompson@riverbend.example",
            notes: "Pediatric referrals; prefers secure email."
          },
          {
            id: "qa-provider-riverbend-2",
            name: "Alexis Nguyen, LCSW",
            email: "alexis.nguyen@riverbend.example",
            notes: "Family resource referrals."
          }
        ],
        notes: "Monthly referral check-in. Spanish interpretation available.",
        qaFixture: true,
        createdAt: now,
        updatedAt: now
      }],
      ["referralNetwork", networkSchoolId, {
        name: "McMinnville Community Learning and Family Resource Academy",
        type: "School",
        contactName: "Elena Ruiz",
        phone: "503-555-0199",
        email: "",
        website: "https://school.example",
        providers: [
          {
            id: providerSchoolId,
            name: "Elena Ruiz",
            email: "",
            notes: "Family liaison; call or text."
          }
        ],
        notes: "",
        qaFixture: true,
        createdAt: now,
        updatedAt: now
      }],
      ["clients", clientMiloId, {
        firstName: "Milo",
        lastName: "Exampleton Garcia",
        parentName: "Jordan",
        dateOfBirth: "2016-04-12",
        gender: "Male",
        phone: "971-555-0101",
        email: "jordan@example.com",
        preferredLanguage: "Spanish",
        preferredContactMethod: "Text",
        referralType: "External Clinic Referral",
        referralSource: "Riverbend Pediatric and Family Health Center",
        referralDate: "2026-06-15",
        firstContactDate: "2026-06-16",
        mostRecentContactDate: today,
        firstAppointmentDate: "2026-06-23",
        mostRecentAppointmentDate: today,
        addressStreet: "1230 SW 2nd Street",
        addressCity: "McMinnville",
        addressState: "OR",
        addressZip: "97128",
        emailOptOut: false,
        textOptOut: false,
        ycco: true,
        hrsn: true,
        currentLesson: "2",
        status: "Active",
        notes: "Caregiver prefers Spanish materials.",
        siblingIds: [clientTessaId],
        providerLinks: [clinicProviderLink],
        qaFixture: true,
        createdAt: now,
        updatedAt: now
      }],
      ["clients", clientTessaId, {
        firstName: "Tessa",
        lastName: "Exampleton Garcia",
        parentName: "Jordan",
        dateOfBirth: "2018-09-03",
        gender: "Female",
        phone: "971-555-0101",
        email: "jordan@example.com",
        preferredLanguage: "Spanish",
        preferredContactMethod: "Text",
        referralType: "External Clinic Referral",
        referralSource: "Riverbend Pediatric and Family Health Center",
        referralDate: "2026-06-15",
        firstContactDate: "2026-06-16",
        mostRecentContactDate: "2026-07-10",
        firstAppointmentDate: "2026-06-23",
        mostRecentAppointmentDate: today,
        addressStreet: "1230 SW 2nd Street",
        addressCity: "McMinnville",
        addressState: "OR",
        addressZip: "97128",
        emailOptOut: false,
        textOptOut: false,
        ycco: true,
        hrsn: false,
        currentLesson: "2",
        status: "Scheduled",
        notes: "",
        siblingIds: [clientMiloId],
        providerLinks: [clinicProviderLink],
        qaFixture: true,
        createdAt: now,
        updatedAt: now
      }],
      ["referrals", referralLuciaId, {
        firstName: "Lucia",
        lastName: "Martinez de la Cruz",
        parentName: "Ana",
        dateOfBirth: "2017-11-22",
        gender: "Female",
        phone: "971-555-0122",
        email: "ana.martinez@example.com",
        preferredLanguage: "Spanish",
        preferredContactMethod: "Text",
        referralType: "Community Org Referral",
        referralSource: "Unidos Family Resource Center",
        referralDate: today,
        firstContactDate: "",
        mostRecentContactDate: "",
        firstAppointmentDate: "",
        mostRecentAppointmentDate: "",
        addressStreet: "998 NE Long Address Lane, Apartment 204",
        addressCity: "McMinnville",
        addressState: "OR",
        addressZip: "97128",
        emailOptOut: true,
        textOptOut: false,
        ycco: false,
        hrsn: true,
        status: "New",
        notes: "Needs an evening call. Child is comfortable speaking English; caregiver prefers Spanish.",
        siblingIds: [referralMateoId],
        providerLinks: [],
        qaFixture: true,
        createdAt: now,
        updatedAt: now
      }],
      ["referrals", referralMateoId, {
        firstName: "Mateo",
        lastName: "Martinez de la Cruz",
        parentName: "Ana",
        dateOfBirth: "2014-02-08",
        gender: "Male",
        phone: "971-555-0122",
        email: "",
        preferredLanguage: "Spanish",
        preferredContactMethod: "Text",
        referralType: "Community Org Referral",
        referralSource: "Unidos Family Resource Center",
        referralDate: "2026-07-15",
        firstContactDate: "2026-07-16",
        mostRecentContactDate: "2026-07-16",
        firstAppointmentDate: "",
        mostRecentAppointmentDate: "",
        addressStreet: "998 NE Long Address Lane, Apartment 204",
        addressCity: "McMinnville",
        addressState: "OR",
        addressZip: "97128",
        emailOptOut: false,
        textOptOut: false,
        ycco: false,
        hrsn: false,
        status: "Texted",
        notes: "",
        siblingIds: [referralLuciaId],
        providerLinks: [clinicProviderLink],
        qaFixture: true,
        createdAt: now,
        updatedAt: now
      }],
      ["appointments", "qa-appointment-family", {
        clientId: clientMiloId,
        clientIds: [clientMiloId, clientTessaId],
        clientName: "Milo Exampleton Garcia",
        clientNames: ["Milo Exampleton Garcia", "Tessa Exampleton Garcia"],
        appointmentDate: today,
        appointmentTime: "14:30",
        appointmentType: "Nutrition Education",
        durationMinutes: 30,
        status: "Scheduled",
        lesson: "2",
        goal: "Add one colorful vegetable at dinner.",
        staffMember: "Cynthia Esparza",
        notes: "Review vegetable tracker.",
        appointmentNote: "",
        prepChecklist: {
          prize: false,
          foodSnack: true
        },
        qaFixture: true,
        createdAt: now,
        updatedAt: now
      }],
      ["appointments", "qa-appointment-completed", {
        clientId: clientMiloId,
        clientIds: [clientMiloId],
        clientName: "Milo Exampleton Garcia",
        clientNames: ["Milo Exampleton Garcia"],
        appointmentDate: "2026-06-23",
        appointmentTime: "14:00",
        appointmentType: "Enrollment",
        durationMinutes: 30,
        status: "Completed",
        lesson: "",
        goal: "",
        staffMember: "Cynthia Esparza",
        notes: "Enrollment complete.",
        appointmentNote: "Family completed enrollment.",
        prepChecklist: {},
        qaFixture: true,
        createdAt: now,
        updatedAt: now
      }],
      ["activityLogs", "qa-activity-client", {
        type: "Text",
        direction: "Outbound",
        title: "Outbound Text",
        result: "Confirmed",
        description: "Confirmed today's appointment.",
        activityDate: today,
        activityTime: "10:15",
        occurredAt: `${today}T10:15:00-07:00`,
        relatedType: "client",
        relatedId: clientMiloId,
        relatedName: "Milo Exampleton Garcia",
        qaFixture: true,
        createdAt: now,
        updatedAt: now
      }],
      ["activityLogs", "qa-activity-referral", {
        type: "Text",
        direction: "Outbound",
        title: "Outbound Text",
        result: "Awaiting Reply",
        description: "Sent Spanish scheduling information.",
        activityDate: "2026-07-16",
        activityTime: "15:30",
        occurredAt: "2026-07-16T15:30:00-07:00",
        relatedType: "referral",
        relatedId: referralMateoId,
        relatedName: "Mateo Martinez de la Cruz",
        qaFixture: true,
        createdAt: now,
        updatedAt: now
      }]
    ];

    for (let index = 0; index < records.length; index += 400) {
      const batch = firestore.batch();
      records.slice(index, index + 400).forEach(([collectionName, id, data]) => {
        batch.set(firestore.collection(collectionName).doc(id), data);
      });
      await batch.commit();
    }

    console.log(`Local CRM fixtures ready for ${today}.`);
    console.log("Created 2 clients, 2 referrals, 2 referral-network entries, 2 appointments, and 2 activity logs.");
  } finally {
    await firestore.terminate();
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
