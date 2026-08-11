function volunteerText(value) {
  return String(value ?? "").trim();
}

function volunteerList(value) {
  const values = Array.isArray(value) ? value : volunteerText(value).split(",");
  return [...new Set(values.map(volunteerText).filter(Boolean))];
}

function formatVolunteerDate(value) {
  const match = volunteerText(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return volunteerText(value) || "-";
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(date);
}

function formatVolunteerTime(value) {
  const match = volunteerText(value).match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return volunteerText(value);
  const hour = Number(match[1]);
  const period = hour >= 12 ? "PM" : "AM";
  return `${hour % 12 || 12}:${match[2]} ${period}`;
}

function volunteerProfilePayload(values = {}) {
  return {
    fullName: volunteerText(values.fullName),
    email: volunteerText(values.email).toLowerCase(),
    phone: volunteerText(values.phone),
    preferredContact: volunteerText(values.preferredContact) || "Email",
    status: volunteerText(values.status) || "Applicant",
    applicationDate: volunteerText(values.applicationDate),
    approvalDate: volunteerText(values.approvalDate),
    approvedBy: volunteerText(values.approvedBy),
    snackEmail: volunteerText(values.snackEmail).toLowerCase(),
    interests: volunteerList(values.interests),
    skills: volunteerList(values.skills),
    availability: volunteerText(values.availability),
    volunteerFrequency: volunteerText(values.volunteerFrequency),
    volunteerFrequencyOther: volunteerText(values.volunteerFrequencyOther),
    groupVolunteering: volunteerText(values.groupVolunteering),
    groupDetails: volunteerText(values.groupDetails),
    availabilityDays: volunteerText(values.availabilityDays),
    availabilityTimes: volunteerText(values.availabilityTimes),
    availabilitySeasons: volunteerText(values.availabilitySeasons),
    experience: volunteerText(values.experience),
    motivation: volunteerText(values.motivation),
    questions: volunteerText(values.questions),
    languages: volunteerList(values.languages),
    backgroundCheckStatus: volunteerText(values.backgroundCheckStatus) || "Not Started",
    emergencyContact: volunteerText(values.emergencyContact),
    notes: volunteerText(values.notes)
  };
}

function volunteerOpportunityPayload(values = {}) {
  const capacity = Number(values.capacity);
  return {
    title: volunteerText(values.title),
    program: volunteerText(values.program) || "Outreach",
    status: volunteerText(values.status) || "Draft",
    opportunityDate: volunteerText(values.opportunityDate),
    startTime: volunteerText(values.startTime),
    endTime: volunteerText(values.endTime),
    location: volunteerText(values.location),
    capacity: Number.isFinite(capacity) && capacity > 0 ? Math.round(capacity) : null,
    coordinator: volunteerText(values.coordinator),
    description: volunteerText(values.description),
    requirements: volunteerList(values.requirements),
    notes: volunteerText(values.notes)
  };
}

function mapVolunteerProfile(profile = {}) {
  const interests = volunteerList(profile.interests);
  const skills = volunteerList(profile.skills);
  const languages = volunteerList(profile.languages);
  return {
    id: volunteerText(profile.id),
    kind: "volunteer-profile",
    title: volunteerText(profile.fullName) || "Unnamed volunteer",
    subtitle: [volunteerText(profile.email), interests.slice(0, 2).join(", ")].filter(Boolean).join(" | ") || "No contact details",
    status: volunteerText(profile.status) || "Applicant",
    email: volunteerText(profile.email) || "-",
    phone: volunteerText(profile.phone) || "-",
    preferredContact: volunteerText(profile.preferredContact) || "-",
    applicationDate: formatVolunteerDate(profile.applicationDate),
    applicationDateValue: volunteerText(profile.applicationDate),
    approvalDate: formatVolunteerDate(profile.approvalDate),
    approvalDateValue: volunteerText(profile.approvalDate),
    approvedBy: volunteerText(profile.approvedBy) || "-",
    snackEmail: volunteerText(profile.snackEmail) || "Not created",
    interests,
    interestsLabel: interests.join(", ") || "-",
    skills,
    skillsLabel: skills.join(", ") || "-",
    availability: volunteerText(profile.availability) || "-",
    volunteerFrequency: volunteerText(profile.volunteerFrequency) || "-",
    volunteerFrequencyOther: volunteerText(profile.volunteerFrequencyOther) || "-",
    groupVolunteering: volunteerText(profile.groupVolunteering) || "-",
    groupDetails: volunteerText(profile.groupDetails) || "-",
    availabilityDays: volunteerText(profile.availabilityDays) || volunteerText(profile.availability) || "-",
    availabilityTimes: volunteerText(profile.availabilityTimes) || "-",
    availabilitySeasons: volunteerText(profile.availabilitySeasons) || "-",
    experience: volunteerText(profile.experience) || "-",
    motivation: volunteerText(profile.motivation) || "-",
    questions: volunteerText(profile.questions) || "-",
    languages,
    languagesLabel: languages.join(", ") || "-",
    backgroundCheckStatus: volunteerText(profile.backgroundCheckStatus) || "Not Started",
    emergencyContact: volunteerText(profile.emergencyContact) || "-",
    notes: volunteerText(profile.notes) || "-",
    source: profile
  };
}

function mapVolunteerOpportunity(opportunity = {}) {
  const requirements = volunteerList(opportunity.requirements);
  const date = formatVolunteerDate(opportunity.opportunityDate);
  const time = [formatVolunteerTime(opportunity.startTime), formatVolunteerTime(opportunity.endTime)].filter(Boolean).join("–");
  return {
    id: volunteerText(opportunity.id),
    kind: "volunteer-opportunity",
    title: volunteerText(opportunity.title) || "Unnamed opportunity",
    subtitle: [date === "-" ? "" : date, time, volunteerText(opportunity.program)].filter(Boolean).join(" | ") || "Date not set",
    status: volunteerText(opportunity.status) || "Draft",
    program: volunteerText(opportunity.program) || "Outreach",
    opportunityDate: date,
    opportunityDateValue: volunteerText(opportunity.opportunityDate),
    startTime: volunteerText(opportunity.startTime),
    endTime: volunteerText(opportunity.endTime),
    timeLabel: time || "-",
    location: volunteerText(opportunity.location) || "-",
    capacity: Number(opportunity.capacity) > 0 ? String(Math.round(Number(opportunity.capacity))) : "Not set",
    coordinator: volunteerText(opportunity.coordinator) || "-",
    description: volunteerText(opportunity.description) || "-",
    requirements,
    requirementsLabel: requirements.join(", ") || "-",
    notes: volunteerText(opportunity.notes) || "-",
    source: opportunity
  };
}

function mapVolunteerProfiles(profiles = []) {
  return profiles.map(mapVolunteerProfile).sort((first, second) => first.title.localeCompare(second.title));
}

function mapVolunteerOpportunities(opportunities = []) {
  return opportunities.map(mapVolunteerOpportunity).sort((first, second) => {
    const firstDate = first.opportunityDateValue || "9999-12-31";
    const secondDate = second.opportunityDateValue || "9999-12-31";
    return firstDate.localeCompare(secondDate) || first.title.localeCompare(second.title);
  });
}

function volunteerMatches(item = {}, query = "") {
  const needle = volunteerText(query).toLowerCase();
  if (!needle) return true;
  return [
    item.title,
    item.subtitle,
    item.status,
    item.email,
    item.phone,
    item.program,
    item.location,
    item.interestsLabel,
    item.skillsLabel,
    item.requirementsLabel,
    item.coordinator
  ].some((value) => volunteerText(value).toLowerCase().includes(needle));
}

function volunteerSummary(profiles = [], opportunities = []) {
  return [
    [String(profiles.filter((profile) => ["Approved", "Active"].includes(profile.status)).length), "Approved Volunteers"],
    [String(profiles.filter((profile) => ["Applicant", "Pending Review"].includes(profile.status)).length), "Applications to Review"],
    [String(opportunities.filter((opportunity) => opportunity.status === "Open").length), "Open Opportunities"],
    [String(opportunities.filter((opportunity) => opportunity.status === "Filled").length), "Filled Opportunities"]
  ];
}

export {
  formatVolunteerDate,
  formatVolunteerTime,
  mapVolunteerOpportunities,
  mapVolunteerOpportunity,
  mapVolunteerProfile,
  mapVolunteerProfiles,
  volunteerMatches,
  volunteerOpportunityPayload,
  volunteerProfilePayload,
  volunteerSummary
};
