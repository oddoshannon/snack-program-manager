const snackPhone = "(971) 202-0232";
const clinicAddress = "2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128";
const clinicArrivalInstructions = "The SNACK Program office is inside Physicians' Medical Center (PMC). When you arrive, head to the left and check in at Reception A. Let staff know you have a SNACK appointment, have a seat in the waiting area, and SNACK staff will call you back to our office.";
const kitchenAddress = "YCAP, 1317 NE Dustin Ct, McMinnville, OR 97128";
const kitchenArrivalInstructions = "Enter the YCAP parking lot from NE Dustin Ct and follow the signs in the parking lot to the Training Room.";
const kitchenParkingMapUrl = "https://hub.snackprogram.org/ycap-parking.png";

const clientMessageDeliveryPolicy = Object.freeze({
  appointmentEmailReminderHoursBefore: 48,
  appointmentTextReminderHoursBefore: 6,
  earliestTextHourLocal: 8,
  waitlistReplyHours: 24,
  waitlistClosesHoursBeforeClass: 24,
  nextClassEarlyAccessHours: 48,
  automaticDeliveryEnabled: false
});

function cleanMessageValue(value) {
  return String(value || "").trim();
}

function escapeMessageHtml(value) {
  return cleanMessageValue(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function greeting(caregiverName) {
  return `Hello${cleanMessageValue(caregiverName) ? ` ${cleanMessageValue(caregiverName)}` : ""},`;
}

function appointmentDetails(details = {}) {
  return [
    `Children: ${cleanMessageValue(details.clientNames) || "[Child or Children First Names]"}`,
    `Date: ${cleanMessageValue(details.dateLabel) || "[Weekday, Month Day]"}`,
    `Time: ${cleanMessageValue(details.timeLabel) || "[Time]"}`
  ].join("\n");
}

function clinicLocationBlock() {
  return `Location: ${clinicAddress}\n\n${clinicArrivalInstructions}`;
}

function kitchenLocationBlock() {
  return `Class location: ${kitchenAddress}\n\nImportant arrival directions: ${kitchenArrivalInstructions}\nParking map: ${kitchenParkingMapUrl}`;
}

function textToHtml(text, { includeKitchenMap = false } = {}) {
  const detailLabelPattern = /^(Children|Date|Time|Location|Class location|Important arrival directions|Parking map|Service|Message Type|Family Record|Attempted At|Reason|Niños|Fecha|Hora|Ubicación|Ubicación de la clase|Instrucciones importantes para llegar|Mapa del estacionamiento):\s*/i;
  const html = text.split("\n").map((line) => {
    if (!line) return "<br>";
    const escaped = escapeMessageHtml(line);
    return `<p>${escaped.replace(detailLabelPattern, "<strong>$1:</strong> ")}</p>`;
  }).join("");
  if (!includeKitchenMap) return html;
  return `${html}<p><img src="${kitchenParkingMapUrl}" alt="YCAP parking and Training Room entrance map" style="max-width:100%;height:auto;border:1px solid #d9dee7;border-radius:8px"></p>`;
}

function clientMessageTemplates(details = {}) {
  const caregiver = greeting(details.caregiverName);
  const children = cleanMessageValue(details.clientNames) || "[Child or Children First Names]";
  const appointment = appointmentDetails(details);
  const manageUrl = cleanMessageValue(details.manageUrl) || "[Private Management Link]";
  const offerUrl = cleanMessageValue(details.offerUrl) || "[Private Offer Link]";
  const className = cleanMessageValue(details.className) || "[Class Name]";
  const classDate = cleanMessageValue(details.dateLabel) || "[Weekday, Month Day]";
  const classStartTime = cleanMessageValue(details.startTimeLabel) || "[Start Time]";
  const classEndTime = cleanMessageValue(details.endTimeLabel) || "[End Time]";
  const waitlistDeadline = cleanMessageValue(details.waitlistDeadline) || "[Deadline]";

  const templates = {
    referralReceived: {
      subject: "We received your SNACK referral",
      text: `${caregiver}\n\nThe SNACK Program received a referral for your family. Our team will contact you within one week to answer questions and discuss next steps.\n\nSNACK provides free nutrition education for children and families through family appointments and Kids Cooking + Nutrition Classes. Receiving this message does not mean an appointment has been scheduled yet.\n\nIf you would like to contact us first, call or text ${snackPhone}.\n\nThe SNACK Program`
    },
    referralConvertedWelcome: {
      subject: "Welcome to The SNACK Program",
      text: `${caregiver}\n\nWelcome to The SNACK Program. ${children} is ready for the next step: [Next Step or Appointment Details].\n\nSNACK offers a series of family nutrition appointments and monthly kids cooking classes.\n\n${clinicLocationBlock()}\n\nIf you have questions, call or text ${snackPhone}.\n\nThe SNACK Program`
    },
    appointmentBooked: {
      subject: "Your SNACK appointment is scheduled",
      text: `${caregiver}\n\nYour SNACK appointment is scheduled.\n\n${appointment}\n\n${clinicLocationBlock()}\n\nUse this private link to reschedule or cancel: ${manageUrl}\n\nQuestions? Call or text ${snackPhone}.`
    },
    appointmentRescheduled: {
      subject: "Your SNACK appointment has been rescheduled",
      text: `${caregiver}\n\nYour SNACK appointment has been moved.\n\n${appointment}\n\n${clinicLocationBlock()}\n\nUse this private link if you need another change: ${manageUrl}\n\nQuestions? Call or text ${snackPhone}.`
    },
    appointmentReminder: {
      subject: `Reminder: SNACK appointment on ${classDate}`,
      text: `${caregiver}\n\nThis is a reminder about your upcoming SNACK appointment.\n\n${appointment}\n\n${clinicLocationBlock()}\n\nUse this private link to reschedule or cancel: ${manageUrl}\n\nQuestions? Call or text ${snackPhone}.`
    },
    kitchenWaitlistOffer: {
      subject: "A spot may be available in the SNACK cooking class",
      text: `${caregiver}\n\nA spot may be available for ${children} in ${className} on ${classDate} from ${classStartTime} to ${classEndTime}.\n\n${kitchenLocationBlock()}\n\nPlease accept this offer by ${waitlistDeadline}. The offer expires automatically at that time and no later than 24 hours before class. Your family is not registered until you accept and receive a confirmation.\n\nAccept or decline: ${offerUrl}\n\nQuestions? Call or text ${snackPhone}.`
    },
    kitchenRegistrationConfirmation: {
      subject: "Your SNACK cooking class registration is confirmed",
      text: `${caregiver}\n\nRegistration is confirmed for ${children} in ${className} on ${classDate} from ${classStartTime} to ${classEndTime}.\n\n${kitchenLocationBlock()}\n\nPlease tell us about any food allergies or dietary needs before class: ${manageUrl}\n\nIf your plans change, call or text ${snackPhone} so another family can attend.`
    },
    kitchenClassReminder: {
      subject: `Reminder: SNACK cooking class on ${classDate}`,
      text: `${caregiver}\n\nThis is a reminder that ${children} is registered for ${className} on ${classDate} from ${classStartTime} to ${classEndTime}.\n\n${kitchenLocationBlock()}\n\nIf your plans change, call or text ${snackPhone} so another family can attend.`
    },
    staffDeliveryFailure: {
      subject: "SNACK message delivery needs review",
      text: `A service message could not be delivered.\n\nService: [Email or Text Provider]\nMessage Type: [Template Name]\nFamily Record: [CRM Record Link]\nAttempted At: [Date and Time]\nReason: [Safe Provider Error Summary]\n\nNo message contents, form answers, insurance identifiers, or secret credentials are included in this alert. Review the contact method and consent record before trying again.`
    }
  };

  return Object.fromEntries(Object.entries(templates).map(([key, template]) => [key, {
    ...template,
    html: textToHtml(template.text, { includeKitchenMap: key.startsWith("kitchen") })
  }]));
}

const clientMessageTemplateNames = Object.freeze({
  referralReceived: "Referral Received",
  referralConvertedWelcome: "Referral Converted / Welcome",
  appointmentBooked: "Appointment Booked",
  appointmentRescheduled: "Appointment Rescheduled",
  appointmentReminder: "Appointment Reminder",
  kitchenWaitlistOffer: "Kitchen Waitlist Offer",
  kitchenRegistrationConfirmation: "Kitchen Registration Confirmation",
  kitchenClassReminder: "Kitchen Class Reminder",
  staffDeliveryFailure: "Staff Delivery-Failure Alert"
});

const clientMessageSmsDrafts = Object.freeze({
  referralReceived: "The SNACK Program received your family referral. Our team will contact you within one week. Questions? Call or text (971) 202-0232.",
  referralConvertedWelcome: "Welcome to The SNACK Program! [Child or Children First Names] is ready for the next step. Questions? Call or text (971) 202-0232.",
  appointmentBooked: "Your SNACK appointment is scheduled for [Short Date] at [Time]. Manage it here: [Private Management Link]. Call or text (971) 202-0232 with questions.",
  appointmentRescheduled: "Your SNACK appointment has moved to [Short Date] at [Time]. Manage it here: [Private Management Link]. Call or text (971) 202-0232 with questions.",
  appointmentReminder: "Reminder: Your SNACK appointment is [Short Date] at [Time]. Manage it here: [Private Management Link]. Call or text (971) 202-0232 with questions.",
  kitchenWaitlistOffer: "A spot may be available in [Class Name] on [Short Date] from [Start Time] to [End Time]. Reply by [Deadline]: [Private Offer Link]. Registration is not final until confirmed.",
  kitchenRegistrationConfirmation: "Confirmed: [Child or Children First Names] is registered for [Class Name] on [Short Date] from [Start Time] to [End Time] at YCAP. Questions? (971) 202-0232.",
  kitchenClassReminder: "Reminder: [Child or Children First Names] is registered for [Class Name] on [Short Date] from [Start Time] to [End Time] at YCAP. Questions? (971) 202-0232.",
  staffDeliveryFailure: ""
});

function defaultClientMessageTemplateRecords() {
  const templates = clientMessageTemplates({ caregiverName: "[Caregiver First Name]" });
  const englishTemplates = Object.entries(templates).map(([id, template]) => ({
    id,
    baseTemplateId: id,
    name: clientMessageTemplateNames[id] || id,
    category: id.startsWith("kitchen")
      ? "Kitchen"
      : id.startsWith("appointment")
        ? "Appointments"
        : id.startsWith("referral")
          ? "Referrals"
          : "Staff",
    language: "English",
    status: "Draft",
    version: 1,
    emailSubject: template.subject,
    emailBody: template.text,
    smsBody: clientMessageSmsDrafts[id] || "",
    versions: [],
    approvedAt: "",
    approvedBy: "",
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: ""
  }));

  const spanishContent = {
    referralReceived: {
      subject: "Referencia al Programa SNACK",
      body: `Hola [Caregiver First Name],\n\n[Referring Organization] compartió una referencia para [Child or Children First Names] con el Programa SNACK porque pensó que su familia podría estar interesada en nuestros servicios gratuitos de educación nutricional para niños y familias. A veces recibimos las referencias antes de que las familias tengan la oportunidad de hablar sobre ellas, por eso queríamos presentarnos.\n\nSNACK ofrece educación nutricional para niños y familias del condado de Yamhill. Cualquier niño de 6 a 18 años puede participar sin costo. Utilizamos un currículo centrado en los niños y basado en evidencia para enseñar a los niños y a sus familias los fundamentos de la nutrición, cómo establecer metas y cómo desarrollar hábitos saludables que puedan mantener.\n\nLa participación es completamente opcional. Con gusto responderemos sus preguntas antes de que decida si le interesa participar. Alguien de nuestro equipo se comunicará por teléfono dentro de una semana. Si prefiere comunicarse primero, puede llamar o enviar un mensaje de texto al (971) 202-0232.\n\nShannon Oddo, MScN, CNWE\nDirectora Ejecutiva, Programa SNACK`,
      sms: "¡Hola! Soy Shannon del Programa SNACK. Recibimos una referencia para su familia. Nuestro equipo se comunicará dentro de una semana. ¿Preguntas? Llame o envíe un mensaje de texto al (971) 202-0232."
    },
    referralConvertedWelcome: {
      subject: "Bienvenidos al Programa SNACK",
      body: `Hola [Caregiver First Name],\n\n¡Bienvenidos al Programa SNACK! Programó una cita de inscripción para [Child or Children First Names]. Esto es lo que sigue:\n\nLlegue unos minutos antes de la cita para completar los formularios de inscripción. Si prefiere, puede completarlos por internet con anticipación aquí: [Private Enrollment Forms Link].\n\nNuestra oficina del Programa SNACK está dentro de Physicians' Medical Center (PMC), en 2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128.\n\nCuando llegue, diríjase a la izquierda y regístrese en Recepción A. Dígale al personal que tiene una cita con SNACK, tome asiento en la sala de espera y el personal de SNACK le llamará para pasar a nuestra oficina.\n\nSi tiene preguntas, puede llamar o enviar un mensaje de texto al (971) 202-0232.\n\nShannon Oddo, MScN, CNWE\nDirectora Ejecutiva, Programa SNACK`,
      sms: ""
    },
    appointmentBooked: {
      subject: "Su cita con SNACK está programada",
      body: `Hola [Caregiver First Name],\n\nSu cita con SNACK está programada.\n\nNiños: [Child or Children First Names]\nFecha: [Weekday, Month Day]\nHora: [Time]\n\nUbicación: 2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128\n\nLa oficina del Programa SNACK está dentro de Physicians' Medical Center (PMC). Cuando llegue, diríjase a la izquierda y regístrese en Recepción A. Dígale al personal que tiene una cita con SNACK, tome asiento en la sala de espera y el personal de SNACK le llamará para pasar a nuestra oficina.\n\nUse este enlace privado para cambiar o cancelar la cita: [Private Management Link]\n\n¿Preguntas? Llame o envíe un mensaje de texto al (971) 202-0232.`,
      sms: "Su cita con SNACK está programada para el [Short Date] a las [Time]. Adminístrela aquí: [Private Management Link]. ¿Preguntas? (971) 202-0232."
    },
    appointmentRescheduled: {
      subject: "Su cita con SNACK fue reprogramada",
      body: `Hola [Caregiver First Name],\n\nSu cita con SNACK fue reprogramada.\n\nNiños: [Child or Children First Names]\nFecha: [Weekday, Month Day]\nHora: [Time]\n\nUbicación: 2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128\n\nLa oficina del Programa SNACK está dentro de Physicians' Medical Center (PMC). Cuando llegue, diríjase a la izquierda y regístrese en Recepción A. Dígale al personal que tiene una cita con SNACK, tome asiento en la sala de espera y el personal de SNACK le llamará para pasar a nuestra oficina.\n\nUse este enlace privado si necesita hacer otro cambio: [Private Management Link]\n\n¿Preguntas? Llame o envíe un mensaje de texto al (971) 202-0232.`,
      sms: "Su cita con SNACK cambió al [Short Date] a las [Time]. Adminístrela aquí: [Private Management Link]. ¿Preguntas? (971) 202-0232."
    },
    appointmentReminder: {
      subject: "Recordatorio: cita con SNACK el [Weekday, Month Day]",
      body: `Hola [Caregiver First Name],\n\nEste es un recordatorio sobre la próxima cita con SNACK para [Child or Children First Names].\n\nFecha: [Weekday, Month Day]\nHora: [Time]\n\nUbicación: 2435 NE Cumulus Ave, Suite A, McMinnville, OR 97128\n\nLa oficina del Programa SNACK está dentro de Physicians' Medical Center (PMC). Cuando llegue, diríjase a la izquierda y regístrese en Recepción A. Dígale al personal que tiene una cita con SNACK, tome asiento en la sala de espera y el personal de SNACK le llamará para pasar a nuestra oficina.\n\nUse este enlace privado para cambiar o cancelar la cita: [Private Management Link]\n\n¿Preguntas? Llame o envíe un mensaje de texto al (971) 202-0232.`,
      sms: "Recordatorio: su cita con SNACK es el [Short Date] a las [Time]. Adminístrela aquí: [Private Management Link]. ¿Preguntas? (971) 202-0232."
    },
    kitchenWaitlistOffer: {
      subject: "Puede haber un lugar disponible en la clase de cocina de SNACK",
      body: `Hola [Caregiver First Name],\n\nHay un lugar disponible para [Child or Children First Names] en [Class Name] el [Weekday, Month Day] de [Start Time] a [End Time].\n\nAcepte esta oferta antes de [Deadline]. La oferta vence automáticamente a esa hora y nunca después de 24 horas antes de la clase. Su familia no está inscrita hasta que acepte y reciba una confirmación.\n\nAceptar o rechazar: [Private Offer Link]\n\n¿Preguntas? Llame o envíe un mensaje de texto al (971) 202-0232.`,
      sms: "Puede haber un lugar disponible en [Class Name] el [Short Date] de [Start Time] a [End Time]. Responda antes de [Deadline]: [Private Offer Link]. La inscripción no es final hasta recibir la confirmación."
    },
    kitchenRegistrationConfirmation: {
      subject: "Su inscripción en la clase de cocina de SNACK está confirmada",
      body: `Hola [Caregiver First Name],\n\nLa inscripción de [Child or Children First Names] en [Class Name] está confirmada para el [Weekday, Month Day] de [Start Time] a [End Time].\n\nUbicación de la clase: YCAP, 1317 NE Dustin Ct, McMinnville, OR 97128\n\nInstrucciones importantes para llegar: Entre al estacionamiento de YCAP por NE Dustin Ct y siga los letreros en el estacionamiento hacia el Training Room.\n\nMapa del estacionamiento: https://hub.snackprogram.org/ycap-parking.png\n\nSi cambian sus planes, llame o envíe un mensaje de texto al (971) 202-0232 para que otra familia pueda asistir.`,
      sms: ""
    },
    kitchenClassReminder: {
      subject: "Recordatorio: clase de cocina de SNACK el [Weekday, Month Day]",
      body: `Hola [Caregiver First Name],\n\nEste es un recordatorio de que nuestra clase Kids Cooking + Nutrition Class es el [Weekday, Month Day], de [Start Time] a [End Time]. Los adultos pueden quedarse, pero no es obligatorio. La clase será en YCAP; vea los detalles a continuación.\n\nPor seguridad en la cocina, asegúrese de que su niño use zapatos cerrados y lleve el cabello largo recogido. Si tiene delantal, ¡puede traerlo!\n\nUbicación de la clase: YCAP, 1317 NE Dustin Ct, McMinnville, OR 97128\n\nInstrucciones importantes para llegar: Entre al estacionamiento de YCAP por NE Dustin Ct y siga los letreros en el estacionamiento hacia el Training Room.\n\nMapa del estacionamiento: https://hub.snackprogram.org/ycap-parking.png\n\nSi no puede asistir, llame o envíe un mensaje de texto al (971) 202-0232 para que otra familia pueda participar.`,
      sms: "Recordatorio: [Class Name] de SNACK es el [Short Date] de [Start Time] a [End Time] en YCAP. ¿Preguntas? (971) 202-0232."
    }
  };

  const spanishTemplates = englishTemplates
    .filter((template) => spanishContent[template.id])
    .map((template) => ({
      ...template,
      id: `${template.id}-es`,
      baseTemplateId: template.id,
      language: "Spanish",
      status: "Draft",
      emailSubject: spanishContent[template.id].subject,
      emailBody: spanishContent[template.id].body,
      smsBody: spanishContent[template.id].sms
    }));

  return [...englishTemplates, ...spanishTemplates];
}

export {
  clientMessageDeliveryPolicy,
  clientMessageTemplates,
  defaultClientMessageTemplateRecords,
  clinicAddress,
  clinicArrivalInstructions,
  kitchenAddress,
  kitchenArrivalInstructions,
  kitchenParkingMapUrl,
  snackPhone
};
