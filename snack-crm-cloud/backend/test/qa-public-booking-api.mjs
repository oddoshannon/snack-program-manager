import http from "node:http";

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
    label: "Cita de inscripción en ESPAÑOL",
    appointmentType: "Enrollment",
    durationMinutes: 30,
    defaultLanguage: "Spanish"
  },
  {
    id: "spanish-nutrition-education",
    label: "Cita de educación nutricional en ESPAÑOL",
    appointmentType: "Nutrition Education",
    durationMinutes: 30,
    defaultLanguage: "Spanish"
  },
  {
    id: "sibling-enrollment",
    label: "Sibling Enrollment Appointment",
    appointmentType: "Enrollment",
    durationMinutes: 15,
    defaultLanguage: "English",
    siblingVisit: true
  },
  {
    id: "sibling-nutrition-education",
    label: "Sibling Nutrition Education Appointment",
    appointmentType: "Nutrition Education",
    durationMinutes: 15,
    defaultLanguage: "English",
    siblingVisit: true
  }
];

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
        startTime: "1:00 PM",
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
            { value: "13:00", label: "1:00 PM" },
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
    const clientName = [body.firstName, body.lastName].filter(Boolean).join(" ") || "Test Client";

    sendJson(response, 201, {
      booking: {
        clientName,
        serviceLabel: service.label,
        appointmentDate: body.appointmentDate,
        appointmentTime: body.appointmentTime,
        appointmentTimeLabel: "1:00 PM",
        durationMinutes: service.durationMinutes
      }
    });
    return;
  }

  sendJson(response, 404, {
    error: "Not found"
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Public booking QA mock API listening on http://127.0.0.1:${port}`);
});
