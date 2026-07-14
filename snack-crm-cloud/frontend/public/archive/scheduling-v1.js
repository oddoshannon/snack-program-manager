/*
 * ARCHIVED: Scheduling v1 ("Classic" design)
 *
 * This file is NOT loaded by the app. It preserves the original scheduling UI
 * (week calendar, today board, card columns, and the Classic/V2 design toggle)
 * that was removed from app.js when the app committed to the v2 design.
 *
 * These functions reference globals that live in app.js (loadedAppointments,
 * loadedClients, DOM element constants, shared helpers like weekStartDate,
 * appointmentTimeValue, bindDropZone, etc.). To revive any of this code it
 * must be reconnected inside app.js (or a module that imports those helpers).
 *
 * Removed from index.html when this was archived:
 *
 *   <div class="view-toggle scheduling-design-toggle" role="group" aria-label="Scheduling design preview">
 *     <button id="scheduling-classic-view-button" class="active" type="button">Classic</button>
 *     <button id="scheduling-v2-view-button" type="button">V2 Preview</button>
 *   </div>
 *
 *   <section id="scheduling-calendar" class="scheduling-calendar" aria-label="Scheduling calendar"></section>
 *   <section id="scheduling-today-board" class="scheduling-today-board" aria-label="Today's appointment workflow"></section>
 *
 * Removed from app.js (element constants, state, and listeners):
 *
 *   const schedulingCalendar = document.querySelector("#scheduling-calendar");
 *   const schedulingTodayBoard = document.querySelector("#scheduling-today-board");
 *   const schedulingClassicView = document.querySelector("#scheduling-classic-view");
 *   const schedulingClassicViewButton = document.querySelector("#scheduling-classic-view-button");
 *   const schedulingV2ViewButton = document.querySelector("#scheduling-v2-view-button");
 *   let activeSchedulingDesign = "v2"; // persisted in navigation state as "classic" | "v2"
 *   schedulingClassicViewButton.addEventListener("click", () => setSchedulingDesign("classic"));
 *   schedulingV2ViewButton.addEventListener("click", () => setSchedulingDesign("v2"));
 *
 * The v1-era CSS (`.scheduling-calendar`, `.calendar-grid`, `.scheduling-column`,
 * `.scheduling-card*`, `.scheduling-design-toggle`) still exists in styles.css
 * and can be pruned separately.
 */

let visibleSchedulingWeekStart = null;

function appointmentDurationSlots(appointment) {
  return Math.ceil(appointmentDurationMinutes(appointment) / 15);
}

function appointmentStartSlotIndex(appointment) {
  return Math.floor((appointmentTimeValue(appointment.appointmentTime) % 60) / 15);
}

function renderSchedulingTodayBoard() {
  schedulingTodayBoard.innerHTML = "";
  const today = todayDateString();
  const todayAppointments = loadedAppointments
    .filter((appointment) => appointment.appointmentDate === today && appointment.status !== "Canceled")
    .sort(
      (first, second) =>
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime) ||
        appointmentClientName(first).localeCompare(appointmentClientName(second))
    );
  const futureScheduledAppointments = loadedAppointments
    .filter((appointment) => appointment.appointmentDate > today && appointment.status === "Scheduled")
    .sort(
      (first, second) =>
        dateValue(first.appointmentDate) - dateValue(second.appointmentDate) ||
        appointmentTimeValue(first.appointmentTime) - appointmentTimeValue(second.appointmentTime)
    );
  const nextAppointmentDate = futureScheduledAppointments[0]?.appointmentDate || "";
  const nextAppointments = nextAppointmentDate
    ? futureScheduledAppointments.filter((appointment) => appointment.appointmentDate === nextAppointmentDate)
    : [];
  schedulingTodayBoard.append(
    renderSchedulingColumn("Today", formatDateOnly(today), todayAppointments, "No appointments scheduled today.", true),
    renderSchedulingColumn("Next Scheduled Day", nextAppointmentDate ? formatDateOnly(nextAppointmentDate) : "", nextAppointments, "No upcoming scheduled appointments.", true)
  );
}

function schedulingWeekStartDate() {
  if (!visibleSchedulingWeekStart) {
    visibleSchedulingWeekStart = toDateString(weekStartDate());
  }

  return new Date(`${visibleSchedulingWeekStart}T00:00:00`);
}

function moveSchedulingWeek(dayOffset) {
  visibleSchedulingWeekStart = toDateString(addDays(schedulingWeekStartDate(), dayOffset));
  renderSchedulingCalendar();
}

function resetSchedulingWeek() {
  visibleSchedulingWeekStart = toDateString(weekStartDate());
  renderSchedulingCalendar();
}

function calendarStartMinutes(hour) {
  const minutes = [];

  for (let minute = 0; minute < 60; minute += schedulingSlotIntervalMinutes) {
    minutes.push(minute);
  }

  return minutes.filter((minute) => {
    const start = hour * 60 + minute;
    return start >= schedulingBookableStartMinutes && start <= schedulingBookableEndMinutes - schedulingDefaultDurationMinutes;
  });
}

function calendarSlotTimeFromDrop(event, cell, hour) {
  const minutes = calendarStartMinutes(hour);

  if (!minutes.length) {
    return null;
  }

  const rect = cell.getBoundingClientRect();
  const slotHeight = rect.height / 4;
  const rawIndex = Math.floor((event.clientY - rect.top) / slotHeight);
  const index = Math.max(0, Math.min(minutes.length - 1, rawIndex));
  return `${String(hour).padStart(2, "0")}:${String(minutes[index]).padStart(2, "0")}`;
}

function renderSchedulingCalendar() {
  schedulingCalendar.innerHTML = "";
  const start = schedulingWeekStartDate();
  const days = schedulingV2ClinicWeekdays.map((weekday) => schedulingDateForWeekday(start, weekday));
  const dayKeys = days.map(toDateString);
  const calendarAppointments = loadedAppointments.filter(appointmentBlocksSchedule);
  const startHour = Math.floor(schedulingStartMinutes / 60);
  const endHour = Math.floor((schedulingEndMinutes - 1) / 60);

  const header = document.createElement("div");
  header.className = "calendar-header";

  const titleBlock = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = "Week Calendar";
  const range = document.createElement("p");
  range.textContent = `${formatShortDate(dayKeys[0])} - ${formatShortDate(dayKeys[dayKeys.length - 1])}`;
  titleBlock.append(title, range);

  const controls = document.createElement("div");
  controls.className = "calendar-controls";
  const previousButton = document.createElement("button");
  previousButton.className = "secondary-button compact-button";
  previousButton.type = "button";
  previousButton.textContent = "Previous";
  previousButton.addEventListener("click", () => moveSchedulingWeek(-7));
  const todayButton = document.createElement("button");
  todayButton.className = "secondary-button compact-button";
  todayButton.type = "button";
  todayButton.textContent = "Today";
  todayButton.disabled = visibleSchedulingWeekStart === toDateString(weekStartDate());
  todayButton.addEventListener("click", resetSchedulingWeek);
  const nextButton = document.createElement("button");
  nextButton.className = "secondary-button compact-button";
  nextButton.type = "button";
  nextButton.textContent = "Next";
  nextButton.addEventListener("click", () => moveSchedulingWeek(7));
  controls.append(previousButton, todayButton, nextButton);
  header.append(titleBlock, controls);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";
  grid.style.setProperty("--calendar-days", String(days.length));

  const corner = document.createElement("div");
  corner.className = "calendar-corner";
  corner.textContent = "Time";
  grid.append(corner);

  for (const day of days) {
    const dayHeader = document.createElement("div");
    dayHeader.className = "calendar-day-header";
    const weekday = document.createElement("strong");
    weekday.textContent = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(day);
    const date = document.createElement("span");
    date.textContent = new Intl.DateTimeFormat("en-US", { month: "numeric", day: "numeric" }).format(day);
    dayHeader.append(weekday, date);
    grid.append(dayHeader);
  }

  for (let hour = startHour; hour <= endHour; hour += 1) {
    const timeLabel = document.createElement("div");
    timeLabel.className = "calendar-time-label";
    timeLabel.textContent = formatAppointmentTime(`${String(hour).padStart(2, "0")}:00`);
    grid.append(timeLabel);

    for (const dayKey of dayKeys) {
      const cell = document.createElement("div");
      cell.className = "calendar-hour-cell";
      const hourAppointments = calendarAppointments.filter(
        (appointment) =>
          appointment.appointmentDate === dayKey &&
          Math.floor(appointmentTimeValue(appointment.appointmentTime) / 60) === hour
      );
      if (hourAppointments.length) {
        cell.classList.add("has-appointment");
      }
      bindDropZone(cell, {
        kind: "calendar-appointment",
        onDrop: (payload, event) => {
          const slotTime = calendarSlotTimeFromDrop(event, cell, hour);

          if (!slotTime) {
            return null;
          }

          return moveAppointmentToCalendarSlot(payload.id, dayKey, slotTime);
        }
      });

      for (const minute of calendarStartMinutes(hour)) {
        const slotTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        const matchingAppointments = calendarAppointments.filter(
          (appointment) =>
            appointment.appointmentDate === dayKey &&
            normalizeAppointmentTime(appointment.appointmentTime) === slotTime
        );

        const slot = document.createElement("button");
        slot.className = "calendar-slot";
        slot.type = "button";
        slot.setAttribute("aria-label", `Schedule appointment on ${formatDateOnly(dayKey)} at ${formatAppointmentTime(slotTime)}`);
        slot.addEventListener("click", () => startNewAppointment({ appointmentDate: dayKey, appointmentTime: slotTime }));
        bindDropZone(slot, {
          kind: "calendar-appointment",
          onDrop: (payload) => moveAppointmentToCalendarSlot(payload.id, dayKey, slotTime)
        });
        cell.append(slot);

        if (matchingAppointments.length) {
          matchingAppointments.forEach((appointment, index) => {
            cell.append(renderCalendarAppointment(appointment, { overlapIndex: index, overlapCount: matchingAppointments.length }));
          });
        }
      }

      grid.append(cell);
    }
  }

  schedulingCalendar.append(header, grid);
}

function renderCalendarAppointment(appointment, options = {}) {
  const overlapCount = Math.max(1, options.overlapCount || 1);
  const overlapIndex = Math.max(0, options.overlapIndex || 0);
  const item = document.createElement("button");
  item.className = "calendar-appointment";
  item.style.setProperty("--appointment-accent", appointmentLessonAccent(appointment));
  item.style.setProperty("--duration-slots", String(appointmentDurationSlots(appointment)));
  item.style.setProperty("--slot-index", String(appointmentStartSlotIndex(appointment)));
  if (overlapCount > 1) {
    item.style.left = `calc(${(overlapIndex / overlapCount) * 100}% + 3px)`;
    item.style.right = "auto";
    item.style.width = `calc(${100 / overlapCount}% - 6px)`;
  }
  item.type = "button";
  item.draggable = appointment.status === "Scheduled";
  item.setAttribute(
    "aria-label",
    `Open ${appointmentClientName(appointment)} appointment at ${formatAppointmentTime(appointment.appointmentTime)} for ${formatDuration(appointmentDurationMinutes(appointment))}`
  );
  item.addEventListener("dragstart", (event) => {
    item.classList.add("is-dragging");
    item.dataset.dragging = "true";
    setSnackDragData(event, { kind: "calendar-appointment", id: appointment.id });
  });
  item.addEventListener("dragend", () => {
    item.classList.remove("is-dragging");
    clearSnackDragData();
    window.setTimeout(() => {
      delete item.dataset.dragging;
    }, 0);
  });
  item.addEventListener("click", () => {
    if (item.dataset.dragging === "true") {
      return;
    }
    setSelectedAppointment(appointment.id);
  });

  const summary = document.createElement("span");
  summary.textContent = [
    formatAppointmentTime(appointment.appointmentTime),
    appointmentClientName(appointment),
    appointmentLessonLabel(appointment) || appointmentTypeLabel(appointment),
    formatDuration(appointmentDurationMinutes(appointment)),
    appointment.status
  ].filter(Boolean).join(" | ");
  item.append(summary);
  return item;
}

function renderSchedulingColumn(titleText, noteText, appointments, emptyText, showActions) {
  const column = document.createElement("section");
  column.className = "scheduling-column";

  const header = document.createElement("div");
  header.className = "scheduling-column-header";
  const copy = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = titleText;
  copy.append(title);
  if (noteText) {
    const note = document.createElement("p");
    note.textContent = noteText;
    copy.append(note);
  }
  const count = document.createElement("span");
  count.className = "scheduling-count";
  count.textContent = String(appointments.length);
  header.append(copy, count);
  column.append(header);

  if (!appointments.length) {
    const empty = document.createElement("p");
    empty.className = "empty-inline";
    empty.textContent = emptyText;
    column.append(empty);
    return column;
  }

  const list = document.createElement("div");
  list.className = "scheduling-card-list";

  for (const appointment of appointments) {
    list.append(renderSchedulingCard(appointment, showActions));
  }

  column.append(list);
  return column;
}

function renderSchedulingCard(appointment, showActions) {
  const card = document.createElement("article");
  card.className = "scheduling-card";
  card.style.setProperty("--appointment-accent", appointmentLessonAccent(appointment));
  const appointmentClients = appointmentClientIds(appointment)
    .map((clientId) => loadedClients.find((item) => item.id === clientId))
    .filter(Boolean);
  const client = appointmentClients[0];

  const main = document.createElement("button");
  main.className = "scheduling-card-main";
  main.type = "button";
  main.addEventListener("click", () => setSelectedAppointment(appointment.id));

  const top = document.createElement("span");
  top.className = "scheduling-card-top";
  const time = document.createElement("strong");
  time.textContent = formatAppointmentTime(appointment.appointmentTime) || formatShortDate(appointment.appointmentDate);
  const status = appointmentStatusBadge(appointment.status);
  top.append(time, status);

  const name = document.createElement("span");
  name.className = "scheduling-card-name";
  name.textContent = appointmentClientName(appointment);

  const detail = document.createElement("span");
  detail.className = "scheduling-card-detail";
  detail.textContent = [
    appointmentTypeLabel(appointment),
    appointmentLessonLabel(appointment),
    appointmentGoalText(appointment),
    client?.parentName ? `Caregiver: ${client.parentName}` : ""
  ].filter(Boolean).join(" | ");

  const contact = document.createElement("span");
  contact.className = "scheduling-card-detail";
  contact.textContent = [
    client?.phone ? formatPhone(client.phone) : "",
    client?.preferredLanguage ? `Language: ${client.preferredLanguage}` : "",
    appointment.staffMember ? `Staff: ${appointment.staffMember}` : ""
  ].filter(Boolean).join(" | ");

  main.append(top, name, detail, contact);

  if (appointment.notes) {
    const notes = document.createElement("span");
    notes.className = "scheduling-card-notes";
    notes.textContent = appointment.notes;
    main.append(notes);
  }

  card.append(main);

  if (showActions && appointmentClients.length) {
    const actions = document.createElement("div");
    actions.className = "scheduling-card-actions";
    for (const profileClient of appointmentClients) {
      const profileButton = document.createElement("button");
      profileButton.className = "secondary-button compact-button";
      profileButton.type = "button";
      profileButton.textContent = appointmentClients.length > 1 ? `${clientName(profileClient).split(" ")[0]} Profile` : "Profile";
      profileButton.addEventListener("click", () => {
        setSelectedClient(profileClient.id);
      });
      actions.append(profileButton);
    }

    if (appointment.status === "Scheduled") {
      const completeButton = document.createElement("button");
      completeButton.className = "secondary-button compact-button";
      completeButton.type = "button";
      completeButton.textContent = "Complete";
      completeButton.addEventListener("click", () => startCompletingAppointment(appointment));
      actions.append(completeButton);
      const noShowButton = document.createElement("button");
      noShowButton.className = "secondary-button compact-button";
      noShowButton.type = "button";
      noShowButton.textContent = "No-show";
      noShowButton.addEventListener("click", () => updateAppointmentStatus(appointment, "No-show"));
      actions.append(noShowButton);

      const rescheduleButton = document.createElement("button");
      rescheduleButton.className = "secondary-button compact-button";
      rescheduleButton.type = "button";
      rescheduleButton.textContent = "Reschedule";
      rescheduleButton.addEventListener("click", () => startReschedulingAppointment(appointment));
      actions.append(rescheduleButton);

      const canceledButton = document.createElement("button");
      canceledButton.className = "secondary-button compact-button";
      canceledButton.type = "button";
      canceledButton.textContent = "Canceled";
      canceledButton.addEventListener("click", () => updateAppointmentStatus(appointment, "Canceled"));
      actions.append(canceledButton);
    }
    card.append(actions);
  }

  return card;
}

function setSchedulingDesign(design) {
  activeSchedulingDesign = validValue(design, ["classic", "v2"], "classic");
  saveNavigationState();
  renderAppointments();
}

async function moveAppointmentToCalendarSlot(appointmentId, appointmentDate, appointmentTime) {
  rememberSchedulingV2AgendaScroll();
  const appointment = loadedAppointments.find((item) => item.id === appointmentId);

  if (!appointment) {
    appointmentsStatusEl.textContent = "Could not find that appointment.";
    return;
  }

  const normalizedTime = normalizeAppointmentTime(appointmentTime);
  const movedAppointment = {
    ...appointment,
    appointmentDate,
    appointmentTime: normalizedTime
  };

  if (appointment.appointmentDate === appointmentDate && normalizeAppointmentTime(appointment.appointmentTime) === normalizedTime) {
    return;
  }

  if (!appointmentFitsSchedulingWindow(movedAppointment)) {
    appointmentsStatusEl.textContent = schedulingWindowError(movedAppointment);
    return;
  }

  const conflict = appointmentSchedulingConflict(movedAppointment, appointment.id);

  if (conflict) {
    appointmentsStatusEl.textContent = appointmentConflictError(conflict);
    return;
  }

  appointmentsStatusEl.textContent = "Moving appointment...";

  try {
    const response = await authedFetch(`/api/appointments/${encodeURIComponent(appointment.id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(movedAppointment)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();
    const savedAppointment = data.appointment || movedAppointment;
    const completedRescheduleTasks = Number(data.completedRescheduleTasks || 0);
    await applyAppointmentClientEffects(savedAppointment, savedAppointment.status || movedAppointment.status);
    selectedAppointmentId = appointment.id;
    await loadClients();
    await loadAppointments();
    await loadTasks();
    appointmentsStatusEl.textContent = completedRescheduleTasks
      ? "Appointment moved; reschedule task completed."
      : "Appointment moved.";
  } catch (error) {
    appointmentsStatusEl.textContent = error.message || "Could not move appointment yet.";
    console.error(error);
    await loadAppointments();
  }
}
