function text(value) {
  return String(value ?? "").trim();
}

function dateKey(value) {
  return text(value).match(/^(\d{4}-\d{2}-\d{2})/)?.[1] || "";
}

function localDateKey(referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, "0");
  const day = String(referenceDate.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  result.setDate(result.getDate() + days);
  return localDateKey(result);
}

function openTask(task = {}) {
  return !["Done", "Completed", "Closed", "Canceled"].includes(text(task.status) || "Open");
}

function appointmentTitle(appointment = {}) {
  if (Array.isArray(appointment.clientNames) && appointment.clientNames.length) {
    return appointment.clientNames.map(text).filter(Boolean).join(", ");
  }
  return text(appointment.clientName)
    || text(appointment.childName)
    || text(appointment.title)
    || "Clinic appointment";
}

function appointmentTime(appointment = {}) {
  return text(appointment.appointmentTime) || text(appointment.startTime) || text(appointment.time);
}

function homeDashboardData({ appointments = [], tasks = [], sessions = [], events = [] } = {}, referenceDate = new Date()) {
  const today = localDateKey(referenceDate);
  const horizon = addDays(referenceDate, 14);

  const todayAppointments = appointments
    .filter((appointment) => {
      const status = text(appointment.status);
      return dateKey(appointment.appointmentDate || appointment.date) === today
        && !["Canceled", "Cancelled"].includes(status);
    })
    .map((appointment) => ({
      id: text(appointment.id),
      kind: "appointment",
      title: appointmentTitle(appointment),
      subtitle: text(appointment.appointmentType || appointment.type) || "Clinic appointment",
      date: today,
      time: appointmentTime(appointment),
      status: text(appointment.status) || "Scheduled",
      source: appointment
    }))
    .sort((first, second) => (first.time || "99:99").localeCompare(second.time || "99:99"));

  const activeTasks = tasks
    .filter(openTask)
    .map((task) => {
      const dueDate = dateKey(task.dueDate);
      const dueBucket = !dueDate ? "No Date" : dueDate < today ? "Overdue" : dueDate === today ? "Due Today" : "Upcoming";
      return {
        id: text(task.id),
        kind: "task",
        title: text(task.title) || "Untitled task",
        subtitle: text(task.assignedTo),
        date: dueDate,
        dueBucket,
        status: text(task.status) || "Open",
        source: task
      };
    })
    .sort((first, second) => {
      const rank = { Overdue: 0, "Due Today": 1, Upcoming: 2, "No Date": 3 };
      return rank[first.dueBucket] - rank[second.dueBucket]
        || (first.date || "9999-99-99").localeCompare(second.date || "9999-99-99")
        || first.title.localeCompare(second.title);
    });

  const upcomingSessions = sessions
    .filter((session) => {
      const date = dateKey(session.sessionDate);
      return date >= today
        && date <= horizon
        && !["Canceled", "Cancelled", "Completed"].includes(text(session.status));
    })
    .map((session) => ({
      id: text(session.id),
      kind: text(session.program) === "School" ? "school" : "kitchen",
      title: text(session.title || session.classTypeLabel) || `${text(session.program) || "Program"} class`,
      subtitle: text(session.location || session.schoolName),
      date: dateKey(session.sessionDate),
      time: text(session.startTime),
      status: text(session.status) || "Scheduled",
      source: session
    }));

  const upcomingEvents = events
    .filter((event) => {
      const date = dateKey(event.eventDate);
      return date >= today
        && date <= horizon
        && !["Canceled", "Cancelled", "Completed", "Archived"].includes(text(event.status));
    })
    .map((event) => ({
      id: text(event.id),
      kind: "outreach",
      title: text(event.name) || "Outreach event",
      subtitle: text(event.location || event.type),
      date: dateKey(event.eventDate),
      time: text(event.startTime || event.time),
      status: text(event.status) || "Scheduled",
      source: event
    }));

  const upcoming = [...upcomingSessions, ...upcomingEvents]
    .sort((first, second) => `${first.date}T${first.time || "99:99"}`.localeCompare(`${second.date}T${second.time || "99:99"}`));

  return {
    today,
    todayAppointments,
    activeTasks,
    dueTasks: activeTasks.filter((task) => ["Overdue", "Due Today"].includes(task.dueBucket)),
    overdueTaskCount: activeTasks.filter((task) => task.dueBucket === "Overdue").length,
    dueTodayTaskCount: activeTasks.filter((task) => task.dueBucket === "Due Today").length,
    upcoming
  };
}

export {
  homeDashboardData,
  localDateKey
};
