import http from "node:http";
import assert from "node:assert/strict";

const port = Number(process.env.PORT || 8080);
const services = [
  {
    id: "enrollment",
    label: "Enrollment Appointment",
    appointmentType: "Enrollment",
    durationMinutes: 30,
    defaultLanguage: "English"
  },
  {
    id: "nutrition-education",
    label: "Nutrition Education Appointment",
    appointmentType: "Nutrition Education",
    durationMinutes: 30,
    defaultLanguage: "English"
  },
  {
    id: "spanish-enrollment",
    label: "Cita de inscripción en español",
    appointmentType: "Enrollment",
    durationMinutes: 30,
    defaultLanguage: "Spanish"
  },
  {
    id: "spanish-nutrition-education",
    label: "Cita de educación nutricional en español",
    appointmentType: "Nutrition Education",
    durationMinutes: 30,
    defaultLanguage: "Spanish"
  }
];
let mockManagedBooking = null;

function upcomingWeekdays(days, count = days.length) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const dates = [];

  while (dates.length < count) {
    if (days.includes(date.getDay())) {
      dates.push(date.toISOString().slice(0, 10));
    }
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json"
  });
  response.end(JSON.stringify(body));
}

async function readBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);

  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/public/booking-options") {
    sendJson(response, 200, {
      services,
      scheduling: {
        startTime: "1:30 PM",
        endTime: "6:00 PM",
        weekdays: [2, 3, 4]
      }
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/public/availability") {
    const [firstDate, secondDate] = upcomingWeekdays([2, 3]);

    sendJson(response, 200, {
      service: services.find((service) => service.id === url.searchParams.get("serviceId")) || services[0],
      dates: [
        {
          date: firstDate,
          slots: [
            { value: "13:30", label: "1:30 PM" },
            { value: "14:00", label: "2:00 PM" }
          ]
        },
        {
          date: secondDate,
          slots: [
            { value: "14:30", label: "2:30 PM" },
            { value: "15:00", label: "3:00 PM" }
          ]
        }
      ]
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/public/bookings") {
    const body = JSON.parse((await readBody(request)) || "{}");
    const service = services.find((item) => item.id === body.serviceId) || services[0];
    const childNames = Array.isArray(body.children)
      ? body.children.map((child) => child.childName || [child.firstName, child.lastName].filter(Boolean).join(" ")).filter(Boolean)
      : [];
    const clientName = childNames[0] || [body.firstName, body.lastName].filter(Boolean).join(" ") || "Test Client";
    mockManagedBooking = {
      id: "appt-public-1",
      appointmentId: "appt-public-1",
      manageToken: "mock-manage-token",
      clientName,
      clientNames: childNames.length ? childNames : [clientName],
      serviceId: service.id,
      serviceLabel: service.label,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      appointmentTimeLabel: "1:30 PM",
      durationMinutes: service.durationMinutes,
      status: "Scheduled",
      canCancel: true,
      canReschedule: true
    };

    sendJson(response, 201, {
      booking: mockManagedBooking
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/public/bookings/appt-public-1") {
    if (!mockManagedBooking || url.searchParams.get("token") !== mockManagedBooking.manageToken) {
      sendJson(response, 404, {
        error: "Not found"
      });
      return;
    }

    sendJson(response, 200, {
      booking: mockManagedBooking
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/public/bookings/appt-public-1/reschedule") {
    const body = JSON.parse((await readBody(request)) || "{}");

    if (!mockManagedBooking || body.token !== mockManagedBooking.manageToken) {
      sendJson(response, 404, {
        error: "Not found"
      });
      return;
    }

    mockManagedBooking = {
      ...mockManagedBooking,
      appointmentDate: body.appointmentDate,
      appointmentTime: body.appointmentTime,
      appointmentTimeLabel: "2:30 PM"
    };
    sendJson(response, 200, {
      booking: mockManagedBooking
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/public/bookings/appt-public-1/cancel") {
    const body = JSON.parse((await readBody(request)) || "{}");

    if (!mockManagedBooking || body.token !== mockManagedBooking.manageToken) {
      sendJson(response, 404, {
        error: "Not found"
      });
      return;
    }

    mockManagedBooking = {
      ...mockManagedBooking,
      status: "Canceled",
      canCancel: false,
      canReschedule: false
    };
    sendJson(response, 200, {
      booking: mockManagedBooking
    });
    return;
  }

  sendJson(response, 404, {
    error: "Not found"
  });
});

function requestJson(pathname, options = {}) {
  return fetch(`http://127.0.0.1:${port}${pathname}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
}

async function runSmokeQa() {
  const optionsResponse = await requestJson("/api/public/booking-options");
  assert.equal(optionsResponse.status, 200);
  const options = await optionsResponse.json();
  assert.deepEqual(options.services.map((service) => service.label), services.map((service) => service.label));
  assert.deepEqual(options.scheduling.weekdays, [2, 3, 4]);

  const availabilityResponse = await requestJson("/api/public/availability?serviceId=spanish-enrollment");
  assert.equal(availabilityResponse.status, 200);
  const availability = await availabilityResponse.json();
  assert.equal(availability.service.id, "spanish-enrollment");
  assert.ok(availability.dates.length >= 2);
  assert.ok(availability.dates[0].slots.length >= 1);

  const bookingResponse = await requestJson("/api/public/bookings", {
    method: "POST",
    body: JSON.stringify({
      serviceId: "nutrition-education",
      appointmentDate: availability.dates[0].date,
      appointmentTime: availability.dates[0].slots[0].value,
      children: [
        { childName: "Milo Exampleton" },
        { childName: "Tessa Exampleton" }
      ],
      caregiverName: "Jordan",
      mobilePhone: "(971) 447-2646",
      email: "family@example.com",
      consentReminders: true
    })
  });
  assert.equal(bookingResponse.status, 201);
  const booking = await bookingResponse.json();
  assert.equal(booking.booking.serviceLabel, "Nutrition Education Appointment");
  assert.deepEqual(booking.booking.clientNames, ["Milo Exampleton", "Tessa Exampleton"]);
  assert.equal(booking.booking.durationMinutes, 30);
  assert.equal(booking.booking.appointmentId, "appt-public-1");
  assert.equal(booking.booking.manageToken, "mock-manage-token");

  const managedResponse = await requestJson(
    `/api/public/bookings/${booking.booking.appointmentId}?token=${booking.booking.manageToken}`
  );
  assert.equal(managedResponse.status, 200);
  const managed = await managedResponse.json();
  assert.equal(managed.booking.status, "Scheduled");

  const rescheduleResponse = await requestJson(`/api/public/bookings/${booking.booking.appointmentId}/reschedule`, {
    method: "POST",
    body: JSON.stringify({
      token: booking.booking.manageToken,
      appointmentDate: availability.dates[1].date,
      appointmentTime: availability.dates[1].slots[0].value
    })
  });
  assert.equal(rescheduleResponse.status, 200);
  const rescheduled = await rescheduleResponse.json();
  assert.equal(rescheduled.booking.appointmentDate, availability.dates[1].date);

  const cancelResponse = await requestJson(`/api/public/bookings/${booking.booking.appointmentId}/cancel`, {
    method: "POST",
    body: JSON.stringify({
      token: booking.booking.manageToken
    })
  });
  assert.equal(cancelResponse.status, 200);
  const canceled = await cancelResponse.json();
  assert.equal(canceled.booking.status, "Canceled");
}

server.listen(port, "127.0.0.1", async () => {
  console.log(`Public booking QA mock API listening on http://127.0.0.1:${port}`);

  if (process.env.QA_PUBLIC_BOOKING_KEEP_ALIVE === "1") {
    return;
  }

  try {
    await runSmokeQa();
    console.log("Public booking QA smoke passed.");
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
