import express from "express";
import {
  appointmentTimeMinutes,
  cleanString,
  cleanVolunteerOpportunityPayload,
  cleanVolunteerProfilePayload,
  fetchAllDocuments,
  publicSubmissionRateLimit,
  requireAuth,
  toVolunteerOpportunity,
  toVolunteerProfile,
  volunteerOpportunities,
  volunteerProfiles
} from "../lib/core.js";

const router = express.Router();
const volunteerProfileStatuses = new Set(["Applicant", "Pending Review", "Approved", "Active", "Inactive", "Declined"]);
const volunteerOpportunityStatuses = new Set(["Draft", "Open", "Filled", "Completed", "Canceled"]);
const publicVolunteerPreferredContacts = new Set(["Email", "Phone Call", "Text"]);
const publicVolunteerFrequencies = new Set(["One time", "Ongoing", "Other"]);
const publicVolunteerGroupChoices = new Set(["Yes", "No", "Open to either"]);
const publicVolunteerApplicationRateLimit = publicSubmissionRateLimit(
  "volunteer-application",
  6,
  "Too many volunteer applications were submitted. Please try again later or call us at (971) 202-0232."
);

function limitedText(value, maxLength) {
  return cleanString(value).slice(0, maxLength);
}

function limitedList(value, maxItems = 20, maxLength = 100) {
  const values = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(values.map((item) => limitedText(item, maxLength)).filter(Boolean))].slice(0, maxItems);
}

function publicVolunteerApplicationPayload(body = {}, now = new Date().toISOString()) {
  const fullName = limitedText(body.fullName, 160);
  const email = limitedText(body.email, 180).toLowerCase();
  const phone = limitedText(body.phone, 40);
  const preferredContact = limitedText(body.preferredContact, 40) || "Email";
  const permissionToContact = body.permissionToContact === true || body.permissionToContact === "on";
  const volunteerFrequency = limitedText(body.volunteerFrequency, 40);
  const groupVolunteering = limitedText(body.groupVolunteering, 40);
  const availabilityDays = limitedText(body.availabilityDays, 300);
  const availabilityTimes = limitedText(body.availabilityTimes, 300);
  const availabilitySeasons = limitedText(body.availabilitySeasons, 300);
  const motivation = limitedText(body.motivation, 2000);
  const spamTrap = limitedText(body.website, 200);

  if (spamTrap) return { spam: true, error: "" };
  if (!fullName || !email) return { error: "Name and email are required." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address." };
  if (!publicVolunteerPreferredContacts.has(preferredContact)) return { error: "Choose a valid preferred contact method." };
  if (!publicVolunteerFrequencies.has(volunteerFrequency)) return { error: "Choose how often you would like to volunteer." };
  if (!publicVolunteerGroupChoices.has(groupVolunteering)) return { error: "Choose whether you are interested in group volunteering." };
  if (!availabilityDays || !availabilityTimes || !availabilitySeasons) return { error: "Enter your available days, times, and seasons." };
  if (!motivation) return { error: "Tell us why you would like to volunteer with SNACK." };
  if (!permissionToContact) return { error: "Permission to contact you is required." };

  return {
    error: "",
    record: {
      fullName,
      email,
      phone,
      preferredContact,
      status: "Applicant",
      applicationDate: now.slice(0, 10),
      approvalDate: "",
      approvedBy: "",
      snackEmail: "",
      interests: limitedList(body.interests),
      skills: [],
      availability: [availabilityDays, availabilityTimes, availabilitySeasons].filter(Boolean).join("; "),
      volunteerFrequency,
      volunteerFrequencyOther: limitedText(body.volunteerFrequencyOther, 300),
      groupVolunteering,
      groupDetails: limitedText(body.groupDetails, 300),
      availabilityDays,
      availabilityTimes,
      availabilitySeasons,
      experience: limitedText(body.experience, 2000),
      motivation,
      questions: limitedText(body.questions, 2000),
      languages: limitedList(body.languages, 10, 80),
      backgroundCheckStatus: "Not Started",
      emergencyContact: "",
      notes: "",
      submissionSource: "Public volunteer application"
    }
  };
}

function profileValidationError(payload) {
  if (!payload.fullName) return "Volunteer name is required.";
  if (!payload.email && !payload.phone) return "A volunteer email address or phone number is required.";
  if (!volunteerProfileStatuses.has(payload.status)) return "Choose a valid volunteer status.";
  return "";
}

function opportunityValidationError(payload) {
  if (!payload.title) return "Opportunity title is required.";
  if (!volunteerOpportunityStatuses.has(payload.status)) return "Choose a valid opportunity status.";
  const start = appointmentTimeMinutes(payload.startTime);
  const end = appointmentTimeMinutes(payload.endTime);
  if ((start === null) !== (end === null)) return "Enter both a start and end time, or leave both blank.";
  if (start !== null && end <= start) return "Opportunity end time must be after the start time.";
  return "";
}

async function duplicateVolunteerEmail(email, excludedId = "") {
  if (!email) return false;
  const documents = await fetchAllDocuments(volunteerProfiles.where("email", "==", email));
  return documents.some((document) => document.id !== excludedId);
}

router.post("/api/public/volunteer-applications", publicVolunteerApplicationRateLimit, async (request, response, next) => {
  try {
    const payload = publicVolunteerApplicationPayload(request.body);
    if (payload.spam) {
      response.status(201).json({ received: true });
      return;
    }
    if (payload.error) {
      response.status(400).json({ error: payload.error });
      return;
    }
    if (await duplicateVolunteerEmail(payload.record.email)) {
      response.status(409).json({
        error: "An application already uses this email address. Please call or text (971) 202-0232 if you need to update it."
      });
      return;
    }
    const now = new Date().toISOString();
    await volunteerProfiles.add({
      ...payload.record,
      createdAt: now,
      updatedAt: now,
      createdBy: "public-volunteer-application"
    });
    response.status(201).json({ received: true });
  } catch (error) {
    next(error);
  }
});

router.get("/api/volunteer-profiles", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(volunteerProfiles.orderBy("fullName"));
    response.json({ profiles: documents.map(toVolunteerProfile) });
  } catch (error) {
    next(error);
  }
});

router.post("/api/volunteer-profiles", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanVolunteerProfilePayload(request.body);
    const validationError = profileValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    if (await duplicateVolunteerEmail(payload.email)) {
      response.status(409).json({ error: "A volunteer profile already uses this email address." });
      return;
    }
    const now = new Date().toISOString();
    const docRef = await volunteerProfiles.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    response.status(201).json({ profile: toVolunteerProfile(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/volunteer-profiles/:profileId", requireAuth, async (request, response, next) => {
  try {
    const profileId = cleanString(request.params.profileId);
    const docRef = volunteerProfiles.doc(profileId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Volunteer profile was not found." });
      return;
    }
    const payload = cleanVolunteerProfilePayload(request.body);
    const validationError = profileValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    if (await duplicateVolunteerEmail(payload.email, profileId)) {
      response.status(409).json({ error: "Another volunteer profile already uses this email address." });
      return;
    }
    await docRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    response.json({ profile: toVolunteerProfile(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/volunteer-profiles/:profileId", requireAuth, async (request, response, next) => {
  try {
    const docRef = volunteerProfiles.doc(cleanString(request.params.profileId));
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Volunteer profile was not found." });
      return;
    }
    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/api/volunteer-opportunities", requireAuth, async (_request, response, next) => {
  try {
    const documents = await fetchAllDocuments(volunteerOpportunities.orderBy("opportunityDate", "desc"));
    response.json({ opportunities: documents.map(toVolunteerOpportunity) });
  } catch (error) {
    next(error);
  }
});

router.post("/api/volunteer-opportunities", requireAuth, async (request, response, next) => {
  try {
    const payload = cleanVolunteerOpportunityPayload(request.body);
    const validationError = opportunityValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    const now = new Date().toISOString();
    const docRef = await volunteerOpportunities.add({
      ...payload,
      createdAt: now,
      updatedAt: now,
      createdBy: request.user.email
    });
    response.status(201).json({ opportunity: toVolunteerOpportunity(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.patch("/api/volunteer-opportunities/:opportunityId", requireAuth, async (request, response, next) => {
  try {
    const docRef = volunteerOpportunities.doc(cleanString(request.params.opportunityId));
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Volunteer opportunity was not found." });
      return;
    }
    const payload = cleanVolunteerOpportunityPayload(request.body);
    const validationError = opportunityValidationError(payload);
    if (validationError) {
      response.status(400).json({ error: validationError });
      return;
    }
    await docRef.update({
      ...payload,
      updatedAt: new Date().toISOString(),
      updatedBy: request.user.email
    });
    response.json({ opportunity: toVolunteerOpportunity(await docRef.get()) });
  } catch (error) {
    next(error);
  }
});

router.delete("/api/volunteer-opportunities/:opportunityId", requireAuth, async (request, response, next) => {
  try {
    const docRef = volunteerOpportunities.doc(cleanString(request.params.opportunityId));
    const snapshot = await docRef.get();
    if (!snapshot.exists) {
      response.status(404).json({ error: "Volunteer opportunity was not found." });
      return;
    }
    await docRef.delete();
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

export {
  opportunityValidationError,
  profileValidationError,
  publicVolunteerApplicationPayload,
  publicVolunteerApplicationRateLimit,
  volunteerOpportunityStatuses,
  volunteerProfileStatuses
};
export default router;
