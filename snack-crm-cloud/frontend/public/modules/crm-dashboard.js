function cleanText(value) {
  return String(value ?? "").trim();
}

function dateKey(value) {
  const match = cleanText(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] || "";
}

function todayKey(referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, "0");
  const day = String(referenceDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function clientName(client = {}) {
  return [cleanText(client.firstName), cleanText(client.lastName)].filter(Boolean).join(" ") || "Unnamed client";
}

function referralName(referral = {}) {
  return [cleanText(referral.firstName), cleanText(referral.lastName)].filter(Boolean).join(" ") || "Unnamed referral";
}

function appointmentClientIds(appointment = {}) {
  if (Array.isArray(appointment.clientIds)) return appointment.clientIds.map(cleanText).filter(Boolean);
  return cleanText(appointment.clientId) ? [cleanText(appointment.clientId)] : [];
}

function hasNextAppointment(clientId, appointments = [], referenceDate = new Date()) {
  const cutoff = todayKey(referenceDate);
  return appointments.some((appointment) =>
    appointmentClientIds(appointment).includes(cleanText(clientId))
    && (cleanText(appointment.status) || "Scheduled") === "Scheduled"
    && dateKey(appointment.appointmentDate) >= cutoff
  );
}

function activeTask(task = {}) {
  return !["Done", "Canceled"].includes(cleanText(task.status) || "Open");
}

function taskDueBucket(task = {}, referenceDate = new Date()) {
  const dueDate = dateKey(task.dueDate);
  const today = todayKey(referenceDate);
  if (!dueDate) return "No Date";
  if (dueDate < today) return "Overdue";
  if (dueDate === today) return "Due Today";
  return "Upcoming";
}

function taskStatusTone(task = {}, referenceDate = new Date()) {
  const bucket = taskDueBucket(task, referenceDate);
  if (bucket === "Overdue") return "red";
  if (bucket === "Due Today") return "yellow";
  if (bucket === "Upcoming") return "blue";
  return "navy";
}

function taskDestination(task = {}) {
  if (cleanText(task.referralId)) {
    return { section: "Referrals", recordId: cleanText(task.referralId) };
  }
  if (cleanText(task.clientId)) {
    return { section: "Clients", recordId: cleanText(task.clientId) };
  }
  if (cleanText(task.appointmentId)) {
    return { section: "Schedule", recordId: cleanText(task.appointmentId) };
  }
  return { section: "", recordId: "" };
}

function dashboardItem({ id, queue, title, subtitle, status, statusTone, section, recordId, taskId, dueBucket, source }) {
  return {
    id,
    queue,
    title,
    subtitle,
    status,
    statusTone,
    section,
    recordId,
    taskId,
    dueBucket,
    source
  };
}

function crmDashboardItems({ clients = [], referrals = [], appointments = [], tasks = [], referenceDate = new Date() } = {}) {
  const items = [];

  referrals
    .filter((referral) => !cleanText(referral.convertedClientId) && (cleanText(referral.status) || "New") === "New")
    .forEach((referral) => items.push(dashboardItem({
      id: `referral:${cleanText(referral.id)}`,
      queue: "New Referrals",
      title: referralName(referral),
      subtitle: cleanText(referral.referralType) || "New referral",
      status: "New",
      statusTone: "red",
      section: "Referrals",
      recordId: cleanText(referral.id),
      source: referral
    })));

  clients
    .filter((client) => cleanText(client.status) === "Waiting on Family")
    .forEach((client) => items.push(dashboardItem({
      id: `waiting:${cleanText(client.id)}`,
      queue: "Waiting on Family",
      title: clientName(client),
      subtitle: cleanText(client.preferredContactMethod) || cleanText(client.phone) || "Client profile",
      status: "Waiting",
      statusTone: "purple",
      section: "Clients",
      recordId: cleanText(client.id),
      source: client
    })));

  clients
    .filter((client) => cleanText(client.status) === "Needs Reschedule")
    .forEach((client) => items.push(dashboardItem({
      id: `reschedule:${cleanText(client.id)}`,
      queue: "Reschedule",
      title: clientName(client),
      subtitle: "No-show or canceled appointment needs a new time",
      status: "Reschedule",
      statusTone: "red",
      section: "Clients",
      recordId: cleanText(client.id),
      source: client
    })));

  clients
    .filter((client) => cleanText(client.status) === "Active" && !hasNextAppointment(client.id, appointments, referenceDate))
    .forEach((client) => items.push(dashboardItem({
      id: `no-next:${cleanText(client.id)}`,
      queue: "No Next Appointment",
      title: clientName(client),
      subtitle: cleanText(client.currentLesson) ? `Current lesson: ${cleanText(client.currentLesson)}` : "Active client",
      status: "Active",
      statusTone: "blue",
      section: "Clients",
      recordId: cleanText(client.id),
      source: client
    })));

  tasks
    .filter(activeTask)
    .sort((first, second) => (dateKey(first.dueDate) || "9999-99-99").localeCompare(dateKey(second.dueDate) || "9999-99-99"))
    .forEach((task) => {
      const destination = taskDestination(task);
      const dueBucket = taskDueBucket(task, referenceDate);
      items.push(dashboardItem({
        id: `task:${cleanText(task.id)}`,
        queue: "Workflow Tasks",
        title: cleanText(task.title) || "Untitled task",
        subtitle: [cleanText(task.assignedTo), dateKey(task.dueDate) ? `Due ${dateKey(task.dueDate)}` : ""].filter(Boolean).join(" | ") || "Open task",
        status: dueBucket,
        statusTone: taskStatusTone(task, referenceDate),
        section: destination.section,
        recordId: destination.recordId,
        taskId: cleanText(task.id),
        dueBucket,
        source: task
      }));
    });

  return items;
}

function crmCompletedTaskItems(tasks = []) {
  return tasks
    .filter((task) => cleanText(task.status) === "Done")
    .sort((first, second) => cleanText(second.completedAt || second.updatedAt)
      .localeCompare(cleanText(first.completedAt || first.updatedAt)))
    .map((task) => {
      const destination = taskDestination(task);
      const completedDate = dateKey(task.completedAt || task.updatedAt);
      return dashboardItem({
        id: `completed-task:${cleanText(task.id)}`,
        queue: "Completed Tasks",
        title: cleanText(task.title) || "Untitled task",
        subtitle: [cleanText(task.assignedTo), completedDate ? `Completed ${completedDate}` : ""].filter(Boolean).join(" | ") || "Completed task",
        status: "Completed",
        statusTone: "green",
        section: destination.section,
        recordId: destination.recordId,
        taskId: cleanText(task.id),
        source: task
      });
    });
}

function crmDashboardSummary(items = []) {
  const count = (queue) => items.filter((item) => item.queue === queue).length;
  const dueTasks = items.filter((item) => item.queue === "Workflow Tasks" && ["Overdue", "Due Today"].includes(item.dueBucket)).length;
  return [
    [String(count("New Referrals")), "New Referrals"],
    [String(count("Reschedule")), "Reschedule"],
    [String(count("No Next Appointment")), "No Next Appt"],
    [String(dueTasks), "Due Tasks"]
  ];
}

function crmDashboardTaskSummary(items = []) {
  const tasks = items.filter((item) => item.queue === "Workflow Tasks");
  const count = (bucket) => tasks.filter((item) => item.dueBucket === bucket).length;
  return {
    overdue: count("Overdue"),
    dueToday: count("Due Today"),
    upcoming: count("Upcoming"),
    noDate: count("No Date"),
    total: tasks.length
  };
}

export {
  crmCompletedTaskItems,
  crmDashboardItems,
  crmDashboardSummary,
  crmDashboardTaskSummary,
  hasNextAppointment,
  taskDueBucket
};
