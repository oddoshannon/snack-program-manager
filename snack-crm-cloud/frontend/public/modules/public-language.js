const languageStorageKey = "snack-public-language";
const originalText = new WeakMap();
const originalAttributes = new WeakMap();

const spanishText = {
  "Appointment Types": "Tipos de citas",
  "Cooking Classes": "Clases de cocina",
  "Team": "Equipo",
  "About": "Acerca de",
  "Gallery": "Galería",
  "Reviews": "Reseñas",
  "Policies": "Políticas",
  "Contact": "Contacto",
  "Call Us": "Llámenos",
  "Free, child-centered nutrition education for children and families in Yamhill County.": "Educación nutricional gratuita y centrada en los niños para niños y familias del condado de Yamhill.",
  "Book an Appointment": "Reservar una cita",
  "Family Nutrition Appointments": "Citas de nutrición familiar",
  "Choose an Appointment Type": "Elija un tipo de cita",
  "Appointments in English": "Citas en inglés",
  "Enrollment Appointment": "Cita de inscripción",
  "Nutrition Education Appointment": "Cita de educación nutricional",
  "For families who are new to the SNACK Program.": "Para familias nuevas en el Programa SNACK.",
  "For returning families continuing nutrition lessons.": "Para familias que continúan las lecciones de nutrición.",
  "30 minutes · Free": "30 minutos · Gratis",
  "Book": "Reservar",
  "Before You Book": "Antes de reservar",
  "List every child who will attend the appointment.": "Incluya a todos los niños que asistirán a la cita.",
  "Appointments are free and held at the SNACK Program office.": "Las citas son gratuitas y se realizan en la oficina del Programa SNACK.",
  "Appointments may be booked up to three months in advance.": "Las citas se pueden reservar con hasta tres meses de anticipación.",
  "Read booking and cancellation policies": "Leer las políticas de reservación y cancelación",
  "Appointment Availability": "Disponibilidad de citas",
  "Location": "Ubicación",
  "Inside Physicians' Medical Center": "Dentro de Physicians' Medical Center",
  "Get directions": "Cómo llegar",
  "Kids and Teen Cooking Classes": "Clases de cocina para niños y adolescentes",
  "Upcoming Cooking Classes": "Próximas clases de cocina",
  "Loading upcoming classes...": "Cargando próximas clases...",
  "No cooking classes are currently open for registration.": "No hay clases de cocina abiertas para inscripción en este momento.",
  "Waitlist available": "Lista de espera disponible",
  "Class full": "Clase llena",
  "Join Waitlist": "Unirse a la lista de espera",
  "Register": "Inscribirse",
  "Full": "Llena",
  "Meet Your Nutrition Educators": "Conozca a sus educadoras de nutrición",
  "Executive Director": "Directora Ejecutiva",
  "Nutrition Coordinator": "Coordinadora de Nutrición",
  "Shannon has a Master's degree in Nutrition and specializes in adapting nutrition education for children and teens.": "Shannon tiene una maestría en Nutrición y se especializa en adaptar la educación nutricional para niños y adolescentes.",
  "Cynthia has a Doctorate in Clinical Nutrition and focuses on making nutrition practical, engaging, and easy to apply.": "Cynthia tiene un doctorado en Nutrición Clínica y se enfoca en hacer que la nutrición sea práctica, atractiva y fácil de aplicar.",
  "Read full bio": "Leer biografía completa",
  "Our Mission": "Nuestra misión",
  "About The SNACK Program": "Acerca del Programa SNACK",
  "English": "Inglés",
  "Our mission is simple: improve the health and wellness of children and youth in Yamhill County. SNACK offers free nutrition education and wellness activities designed to empower children and families to build sustainable, lifelong healthy habits. We strive to maintain equitable access to our services and address the diverse cultural and socioeconomic needs of the families we serve.": "Nuestra misión es simple: mejorar la salud y el bienestar de los niños y jóvenes del condado de Yamhill. SNACK ofrece educación nutricional gratuita y actividades de bienestar diseñadas para empoderar a niños y familias a desarrollar hábitos saludables sostenibles para toda la vida. Nos esforzamos por mantener un acceso equitativo a nuestros servicios y atender las diversas necesidades culturales y socioeconómicas de las familias a las que servimos.",
  "Inside The Program": "Dentro del programa",
  "What Families Say": "Lo que dicen las familias",
  "Read reviews from SNACK families": "Lea reseñas de familias de SNACK",
  "Loading reviews...": "Cargando reseñas...",
  "No reviews have been shared yet.": "Aún no se han compartido reseñas.",
  "Good to Know": "Información importante",
  "Booking & Cancellation Policies": "Políticas de reservación y cancelación",
  "Booking Policy": "Política de reservación",
  "Cancellation Policy": "Política de cancelación",
  "Please list every child who will attend the appointment. The SNACK office is inside Physicians' Medical Center. When you enter, head to the left and check in at Reception A. Appointments may be booked up to three months in advance.": "Por favor, incluya a todos los niños que asistirán a la cita. La oficina de SNACK está dentro de Physicians' Medical Center. Al entrar, diríjase a la izquierda y regístrese en la Recepción A. Las citas se pueden reservar con hasta tres meses de anticipación.",
  "You can cancel or reschedule anytime before the appointment time. If you need to cancel or reschedule an appointment within 24 hours of the appointment time, please call or text": "Puede cancelar o reprogramar en cualquier momento antes de la cita. Si necesita cancelar o reprogramar dentro de las 24 horas previas a la cita, llame o envíe un mensaje de texto al",
  "Your booking confirmation includes a private link you can use to cancel or choose a new time.": "La confirmación de su cita incluye un enlace privado que puede usar para cancelar o elegir una nueva hora.",
  "Questions?": "¿Preguntas?",
  "Contact Us": "Contáctenos",
  "SNACK Office": "Oficina de SNACK",
  "Located inside Physicians' Medical Center": "Ubicada dentro de Physicians' Medical Center",
  "Back to top": "Volver arriba",
  "Select a Time": "Seleccione una hora",
  "Appointment": "Cita",
  "Loading appointment...": "Cargando cita...",
  "Loading dates...": "Cargando fechas...",
  "Time Zone": "Zona horaria",
  "Pacific Time - Los Angeles": "Hora del Pacífico - Los Ángeles",
  "Available Times": "Horas disponibles",
  "Choose a Date": "Elija una fecha",
  "Pacific Time": "Hora del Pacífico",
  "Loading available times...": "Cargando horas disponibles...",
  "Continue": "Continuar",
  "Family Information": "Información familiar",
  "Add each child who will attend this appointment.": "Agregue a cada niño que asistirá a esta cita.",
  "Add Another Child": "Agregar otro niño",
  "Caregiver Name": "Nombre del cuidador",
  "Mobile Phone": "Teléfono móvil",
  "Email": "Correo electrónico",
  "Preferred Contact": "Contacto preferido",
  "Phone Call": "Llamada telefónica",
  "Text": "Mensaje de texto",
  "Address": "Dirección",
  "Preferred Language": "Idioma preferido",
  "Spanish": "Español",
  "YCCO Insurance?": "¿Seguro de YCCO?",
  "No": "No",
  "Yes": "Sí",
  "SNACK nutrition education appointments are free, though we are able to receive insurance reimbursement for YCCO members. Sharing your child's ID number helps us keep our services free and accessible to the community.": "Las citas de educación nutricional de SNACK son gratuitas, aunque podemos recibir reembolso del seguro para miembros de YCCO. Compartir el número de identificación de su hijo nos ayuda a mantener nuestros servicios gratuitos y accesibles para la comunidad.",
  "YCCO ID Number": "Número de identificación de YCCO",
  "Optional": "Opcional",
  "Food Restrictions": "Restricciones alimentarias",
  "Notes": "Notas",
  "I consent to service emails about appointments, registrations, and schedule changes.": "Acepto recibir correos electrónicos de servicio sobre citas, inscripciones y cambios de horario.",
  "I consent to service texts about appointments, registrations, and schedule changes.": "Acepto recibir mensajes de texto de servicio sobre citas, inscripciones y cambios de horario.",
  "Choose email reminders, text reminders, or both. Marketing email is a separate choice.": "Elija recordatorios por correo electrónico, mensajes de texto o ambos. Los correos de mercadotecnia son una opción separada.",
  "I would like occasional SNACK news and program announcements by email.": "Me gustaría recibir ocasionalmente noticias de SNACK y anuncios del programa por correo electrónico.",
  "Website": "Sitio web",
  "Back": "Atrás",
  "Review Appointment": "Revisar cita",
  "Review": "Revisar",
  "Confirm Your Appointment": "Confirme su cita",
  "Check the details below before booking.": "Revise los detalles antes de reservar.",
  "Book Appointment": "Reservar cita",
  "Confirmed": "Confirmada",
  "Appointment Booked": "Cita reservada",
  "Save the private link below if you need to cancel or choose a new time.": "Guarde el enlace privado a continuación si necesita cancelar o elegir una nueva hora.",
  "Manage This Appointment": "Administrar esta cita",
  "Return to The SNACK Program": "Volver al Programa SNACK",
  "Your Booking": "Su reservación",
  "Manage Your Appointment": "Administrar su cita",
  "Choose a New Time": "Elegir una nueva hora",
  "Cancel Appointment": "Cancelar cita",
  "For changes within 24 hours of the appointment, call or text": "Para cambios dentro de las 24 horas previas a la cita, llame o envíe un mensaje de texto al",
  "Leave a Review": "Dejar una reseña",
  "Your review will appear on the SNACK booking page.": "Su reseña aparecerá en la página de reservaciones de SNACK.",
  "Your Name": "Su nombre",
  "Rating": "Calificación",
  "Review of Your Experience": "Reseña de su experiencia",
  "Submit Review": "Enviar reseña",
  "Thank you for sharing your experience.": "Gracias por compartir su experiencia.",
  "Free family nutrition appointments": "Citas gratuitas de nutrición familiar",
  "Summary": "Resumen",
  "Duration": "Duración",
  "Date": "Fecha",
  "Time": "Hora",
  "Availability": "Disponibilidad",
  "First and Last Name": "Nombre y apellido",
  "Street, City, State, ZIP": "Calle, ciudad, estado y código postal",
  "Allergies, Dietary Restrictions, or Other Food Needs": "Alergias, restricciones alimentarias u otras necesidades alimentarias",
  "Anything You Would Like Us to Know Before the Appointment": "Cualquier información que quiera compartir antes de la cita",
  "Choose": "Elija",
  "Female": "Femenino",
  "Male": "Masculino",
  "Nonbinary": "No binario",
  "Prefer Not to Say": "Prefiero no decir",
  "Remove": "Eliminar",
  "Child Name": "Nombre del niño",
  "Date of Birth": "Fecha de nacimiento",
  "Gender": "Género",
  "Child": "Niño",
  "Loading...": "Cargando...",
  "30 minutes": "30 minutos",
  "Day": "Día",
  "Class": "Clase",
  "your child": "su hijo",
  "Cooking classes are free. The location will be confirmed before class.": "Las clases de cocina son gratuitas. Confirmaremos la ubicación antes de la clase.",
  "Add each child who will attend this class.": "Agregue a cada niño que asistirá a esta clase.",
  "Review Registration": "Revisar inscripción",
  "Confirm Your Registration": "Confirme su inscripción",
  "Check the details below before registering.": "Revise los detalles antes de inscribirse.",
  "Register Family": "Inscribir a la familia",
  "Loading Dates...": "Cargando fechas...",
  "No open times remain on this date.": "No quedan horarios disponibles en esta fecha.",
  "Choose an available date from the calendar.": "Elija una fecha disponible en el calendario.",
  "No open appointment times are available right now. Please call or text (971) 202-0232.": "No hay horarios de citas disponibles en este momento. Llame o envíe un mensaje de texto al (971) 202-0232.",
  "Available times could not be loaded.": "No se pudieron cargar los horarios disponibles.",
  "Choose an appointment time.": "Elija una hora para la cita.",
  "Reschedule Appointment": "Reprogramar cita",
  "Your Details": "Sus datos",
  "Children": "Niños",
  "Caregiver": "Cuidador",
  "None shared": "Ninguna compartida",
  "Saving registration...": "Guardando la inscripción...",
  "Booking appointment...": "Reservando la cita...",
  "Added to the Waitlist": "Agregado a la lista de espera",
  "Registration Confirmed": "Inscripción confirmada",
  "The SNACK Program will contact you if space becomes available.": "El Programa SNACK se comunicará con usted si hay un lugar disponible.",
  "The SNACK Program will contact you if any class details change.": "El Programa SNACK se comunicará con usted si cambia algún detalle de la clase.",
  "Waitlist Confirmed": "Lista de espera confirmada",
  "Appointment Confirmed": "Cita confirmada",
  "We could not load this appointment.": "No pudimos cargar esta cita.",
  "We could not load that appointment.": "No pudimos cargar esa cita.",
  "Submitting review...": "Enviando reseña...",
  "Your review could not be submitted yet.": "Aún no se pudo enviar su reseña.",
  "Cancel this appointment?": "¿Desea cancelar esta cita?",
  "Choose language": "Elegir idioma",
  "Language": "Idioma",
  "Go back": "Volver",
  "Appointment booking": "Reservación de cita",
  "Change month": "Cambiar mes",
  "Previous month": "Mes anterior",
  "Next month": "Mes siguiente",
  "Choose a date": "Elegir una fecha",
  "Choose an appointment time": "Elegir una hora para la cita",
  "Booking summary": "Resumen de la reservación",
  "1 out of 5 stars": "1 de 5 estrellas",
  "2 out of 5 stars": "2 de 5 estrellas",
  "3 out of 5 stars": "3 de 5 estrellas",
  "4 out of 5 stars": "4 de 5 estrellas",
  "5 out of 5 stars": "5 de 5 estrellas",
  "Tuesday": "martes",
  "Wednesday": "miércoles",
  "Thursday": "jueves",
  "The SNACK Program booking page": "Página de reservaciones del Programa SNACK",
  "Booking page sections": "Secciones de la página de reservaciones",
  "SNACK social media": "Redes sociales de SNACK",
  "The SNACK Program appointment office": "La oficina de citas del Programa SNACK",
  "Children and caregivers participating in a SNACK nutrition lesson": "Niños y cuidadores participando en una lección de nutrición de SNACK",
  "Children participating in a SNACK cooking class": "Niños participando en una clase de cocina de SNACK",
  "SNACK participants and staff outdoors together": "Participantes y personal de SNACK juntos al aire libre",
  "Nutrition Workbook for Kids cover by Shannon Oddo": "Portada del libro de nutrición para niños de Shannon Oddo"
};

export function currentPublicLanguage() {
  const requested = new URLSearchParams(window.location.search).get("lang");
  if (requested === "es" || requested === "en") return requested;
  return window.localStorage.getItem(languageStorageKey) === "es" ? "es" : "en";
}

export function publicLocale() {
  return currentPublicLanguage() === "es" ? "es-MX" : "en-US";
}

export function publicText(value) {
  const source = String(value || "");
  return currentPublicLanguage() === "es" ? spanishText[source] || source : source;
}

export function publicUrl(value) {
  const url = new URL(value, window.location.href);
  url.searchParams.set("lang", currentPublicLanguage());
  return `${url.pathname}${url.search}${url.hash}`;
}

function rememberAttribute(element, name) {
  let values = originalAttributes.get(element);
  if (!values) {
    values = new Map();
    originalAttributes.set(element, values);
  }
  if (!values.has(name)) values.set(name, element.getAttribute(name));
  return values.get(name);
}

export function applyPublicLanguage(root = document) {
  const language = currentPublicLanguage();
  document.documentElement.lang = language === "es" ? "es-MX" : "en-US";
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    if (node.parentElement?.closest("script, style")) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    const trimmed = source.trim();
    if (!trimmed) return;
    const translated = language === "es" ? spanishText[trimmed] : null;
    node.nodeValue = translated
      ? source.replace(trimmed, translated)
      : source;
  });

  root.querySelectorAll?.("[placeholder], [aria-label], [title], [alt]").forEach((element) => {
    ["placeholder", "aria-label", "title", "alt"].forEach((name) => {
      if (!element.hasAttribute(name)) return;
      const source = rememberAttribute(element, name);
      element.setAttribute(name, language === "es" ? spanishText[source] || source : source);
    });
  });

  root.querySelectorAll?.("[lang]").forEach((element) => {
    if (!element.closest(".language-switcher")) {
      element.hidden = element.lang.startsWith("es") ? language !== "es" : language === "es";
    }
  });

  document.querySelectorAll("[data-language-current]").forEach((element) => {
    element.textContent = language === "es" ? "Español" : "English";
  });
  document.querySelectorAll("[data-language-option]").forEach((element) => {
    const selected = element.dataset.languageOption === language;
    element.setAttribute("aria-checked", String(selected));
    element.classList.toggle("is-selected", selected);
  });
}

export function initializePublicLanguage({ onChange } = {}) {
  applyPublicLanguage();
  document.querySelectorAll("[data-language-switcher]").forEach((switcher) => {
    const toggle = switcher.querySelector("[data-language-toggle]");
    const menu = switcher.querySelector("[data-language-menu]");
    toggle?.addEventListener("click", () => {
      const open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
    switcher.querySelectorAll("[data-language-option]").forEach((option) => {
      option.addEventListener("click", () => {
        const language = option.dataset.languageOption === "es" ? "es" : "en";
        window.localStorage.setItem(languageStorageKey, language);
        const url = new URL(window.location.href);
        url.searchParams.set("lang", language);
        history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
        menu.hidden = true;
        toggle?.setAttribute("aria-expanded", "false");
        applyPublicLanguage();
        onChange?.(language);
      });
    });
  });
  document.addEventListener("click", (event) => {
    document.querySelectorAll("[data-language-switcher]").forEach((switcher) => {
      if (switcher.contains(event.target)) return;
      const menu = switcher.querySelector("[data-language-menu]");
      const toggle = switcher.querySelector("[data-language-toggle]");
      if (menu) menu.hidden = true;
      toggle?.setAttribute("aria-expanded", "false");
    });
  });
}
