const legacyClinicKnowledgeInstrument = Object.freeze({
  id: "clinic-knowledge-2026-1",
  name: "Clinic Knowledge Assessment",
  version: "2026.1",
  effectiveDate: "2026-07-29",
  programArea: "Clinic",
  status: "Retired",
  description: "Legacy child-focused knowledge assessment administered separately at Enrollment and Graduation.",
  administrationPoints: ["Enrollment", "Graduation"],
  languages: ["English"],
  notes: "Preserved for historical records. Each lesson contributes equally; Yes = 1 and No = 0."
});

const clinicKnowledgeInstrument = Object.freeze({
  id: "clinic-knowledge-2026-2",
  name: "Clinic Knowledge Assessment",
  version: "2026.2",
  effectiveDate: "2026-07-29",
  programArea: "Clinic",
  status: "Active",
  description: "Retrospective child-focused knowledge assessment completed once at Graduation with Before SNACK and Now responses.",
  administrationPoints: ["Graduation"],
  languages: ["English"],
  notes: "Each lesson contributes equally. Before SNACK and Now use Yes = 1 and No = 0."
});

const clinicHealthInstrument = Object.freeze({
  id: "clinic-health-2026-1",
  name: "Nutrition & Healthy Habits Questionnaire",
  nameEs: "Cuestionario de Nutrición y Hábitos Saludables",
  version: "2026.1",
  effectiveDate: "2026-07-29",
  programArea: "Clinic",
  status: "Active",
  description: "Seven-day food and healthy-habit questionnaire completed at Enrollment and Graduation.",
  descriptionEs: "Cuestionario sobre alimentación y hábitos saludables de los últimos siete días, completado durante la inscripción y la graduación.",
  administrationPoints: ["Enrollment", "Graduation"],
  languages: ["English", "Spanish"],
  instructions: "Think about the past 7 days. There are no right or wrong answers. Choose the answer that fits best. Select I don't know only if you truly do not know.",
  instructionsEs: "Piense en los últimos 7 días. No hay respuestas correctas o incorrectas. Elija la respuesta que mejor corresponda. Seleccione No sé solamente si realmente no lo sabe.",
  notes: "Uses the Dietary Guidelines for Americans, 2020-2025 and the approved SNACK scoring rules. I don't know is missing data, never zero."
});

const clinicEnrollmentInstrument = Object.freeze({
  id: "clinic-enrollment-2026-1",
  name: "Program Enrollment",
  nameEs: "Inscripción al Programa SNACK",
  version: "2026.1",
  effectiveDate: "2026-07-31",
  programArea: "Clinic",
  status: "Active",
  formType: "Enrollment",
  respondentType: "Caregiver",
  description: "Participant information, reporting questions, and program consent completed at Enrollment.",
  descriptionEs: "Información del participante, preguntas para informes y consentimiento del programa completados durante la inscripción.",
  administrationPoints: ["Enrollment"],
  languages: ["English", "Spanish"],
  instructions: "Please complete this information about the child participating in SNACK. Reporting answers do not affect enrollment.",
  instructionsEs: "Complete esta información sobre el niño que participa en SNACK. Las respuestas para informes no afectan la inscripción.",
  notes: "Administrative enrollment record. Demographic answers are used only for de-identified reporting."
});

const legacyClinicHrsnScreenerInstrument = Object.freeze({
  id: "clinic-hrsn-screener-2026-1",
  name: "HRSN Screener",
  nameEs: "Evaluación de HRSN",
  version: "2026.1",
  effectiveDate: "2026-07-31",
  programArea: "Clinic",
  status: "Retired",
  formType: "HRSN Screener",
  respondentType: "Caregiver",
  description: "YCCO eligibility, food access, and consent screening completed when HRSN services may apply.",
  descriptionEs: "Evaluación de elegibilidad de YCCO, acceso a alimentos y consentimiento cuando los servicios HRSN pueden aplicar.",
  administrationPoints: ["Enrollment"],
  languages: ["English", "Spanish"],
  instructions: "SNACK does not charge for nutrition services. These questions help determine whether YCCO may reimburse SNACK and whether additional food support may be helpful.",
  instructionsEs: "SNACK no cobra por sus servicios de nutrición. Estas preguntas ayudan a determinar si YCCO puede reembolsar a SNACK y si puede ser útil recibir apoyo adicional para alimentos.",
  notes: "Content preserved from the approved HRSN screener. Name, date, birthdate, and YCCO number are prefilled when available."
});

const clinicHrsnScreenerInstrument = Object.freeze({
  ...legacyClinicHrsnScreenerInstrument,
  id: "clinic-hrsn-screener-2026-2",
  version: "2026.2",
  effectiveDate: "2026-08-04",
  status: "Active",
  instructions: "SNACK does not charge for its nutrition services, but we do have the opportunity to get reimbursed by YCCO for certain clients. This does not affect your ability to participate in the program.",
  instructionsEs: "SNACK no cobra por sus servicios de nutrición, pero tenemos la oportunidad de recibir un reembolso de YCCO por ciertos clientes. Esto no afecta su capacidad para participar en el programa.",
  notes: "Matches the original approved HRSN screener wording. Name, date, birthdate, and YCCO number are prefilled when available; the provider phone field was removed."
});

const legacyClinicChildFeedbackInstrument = Object.freeze({
  id: "clinic-child-feedback-2026-1",
  name: "Child Feedback",
  nameEs: "Comentarios del Niño",
  version: "2026.1",
  effectiveDate: "2026-07-31",
  programArea: "Clinic",
  status: "Retired",
  formType: "Child Feedback",
  respondentType: "Child",
  description: "Child-reported program experience, confidence, perceived change, and open-ended feedback.",
  descriptionEs: "Experiencia del programa, confianza, cambios percibidos y comentarios abiertos informados por el niño.",
  administrationPoints: ["Graduation"],
  languages: ["English", "Spanish"],
  instructions: "Please answer openly and honestly. Your answers help SNACK improve the program.",
  instructionsEs: "Responde con sinceridad. Tus respuestas ayudan a SNACK a mejorar el programa.",
  notes: "Respondent type is recorded automatically as Child."
});

const clinicChildFeedbackInstrument = Object.freeze({
  ...legacyClinicChildFeedbackInstrument,
  id: "clinic-child-feedback-2026-2",
  version: "2026.2",
  effectiveDate: "2026-08-04",
  status: "Active",
  instructions: "Please answer openly and honestly. Your answers help SNACK improve the program. Use this scale: 1 = Not at all, 2 = A little, 3 = Mostly, and 4 = Completely.",
  instructionsEs: "Responde con sinceridad. Tus respuestas ayudan a SNACK a mejorar el programa. Usa esta escala: 1 = Nada, 2 = Un poco, 3 = Mayormente y 4 = Completamente.",
  notes: "Respondent type is recorded automatically as Child. Uses the approved 1-4 response scale."
});

const legacyClinicCaregiverFeedbackInstrument = Object.freeze({
  id: "clinic-caregiver-feedback-2026-1",
  name: "Caregiver Feedback",
  nameEs: "Comentarios del Padre, Madre o Tutor",
  version: "2026.1",
  effectiveDate: "2026-07-31",
  programArea: "Clinic",
  status: "Retired",
  formType: "Caregiver Feedback",
  respondentType: "Caregiver",
  description: "Caregiver-reported program experience, confidence, perceived change, and open-ended feedback.",
  descriptionEs: "Experiencia del programa, confianza, cambios percibidos y comentarios abiertos informados por el padre, madre o tutor.",
  administrationPoints: ["Graduation"],
  languages: ["English", "Spanish"],
  instructions: "Please answer openly and honestly. Your answers help SNACK improve the program.",
  instructionsEs: "Responda con sinceridad. Sus respuestas ayudan a SNACK a mejorar el programa.",
  notes: "Respondent type is recorded automatically as Caregiver."
});

const clinicCaregiverFeedbackInstrument = Object.freeze({
  ...legacyClinicCaregiverFeedbackInstrument,
  id: "clinic-caregiver-feedback-2026-2",
  version: "2026.2",
  effectiveDate: "2026-08-04",
  status: "Active",
  instructions: "Please answer openly and honestly. Your answers help SNACK improve the program. Use this scale: 1 = Not at all, 2 = A little, 3 = Mostly, and 4 = Completely.",
  instructionsEs: "Responda con sinceridad. Sus respuestas ayudan a SNACK a mejorar el programa. Use esta escala: 1 = Nada, 2 = Un poco, 3 = Mayormente y 4 = Completamente.",
  notes: "Respondent type is recorded automatically as Caregiver. Uses the approved 1-4 response scale."
});

const clinicKnowledgeLessons = Object.freeze([
  Object.freeze({
    number: 1,
    name: "Nutrient Density",
    color: "#e23a4d",
    questions: Object.freeze([
      "I know what nutrient dense foods are and can identify examples.",
      "I know how often to choose nutrient dense foods.",
      "I know how to make a meal or snack more nutrient dense.",
      "I know what \"sometimes\" foods are and can identify examples.",
      "I understand why nutrients can tell me more about a food than calories alone."
    ])
  }),
  Object.freeze({
    number: 2,
    name: "Sugar",
    color: "#d27354",
    questions: Object.freeze([
      "I know the difference between natural sugar and added sugar and can identify examples of each.",
      "I know which type of sugar to choose most often.",
      "I know extra added sugar can affect my health.",
      "I know where to find added sugar on a nutrition label.",
      "I know the recommended daily limit for added sugar."
    ])
  }),
  Object.freeze({
    number: 3,
    name: "Food Groups",
    color: "#f4c753",
    questions: Object.freeze([
      "I can name the five food groups.",
      "I can identify foods in each food group.",
      "I know the difference between whole grains and refined grains.",
      "I know how many different food groups to include in a meal.",
      "I know how many different food groups to include throughout the day."
    ])
  }),
  Object.freeze({
    number: 4,
    name: "Macronutrients",
    color: "#078b4d",
    questions: Object.freeze([
      "I know what carbohydrates, proteins, and fats are and what they do for my body.",
      "I know what fiber is and how it helps digestion.",
      "I can identify carbohydrates, protein, and fat in foods and meals.",
      "I know how to create a balanced snack with fiber, protein, and fat."
    ])
  }),
  Object.freeze({
    number: 5,
    name: "Micronutrients",
    color: "#039cbb",
    questions: Object.freeze([
      "I know what micronutrients, vitamins, and minerals are and what they do for my body.",
      "I know what \"eat the rainbow\" means and why it is helpful.",
      "I know what calcium and iron do for my body.",
      "I can identify foods that provide calcium and iron."
    ])
  }),
  Object.freeze({
    number: 6,
    name: "Mindful Eating",
    color: "#004aad",
    questions: Object.freeze([
      "I know what mindful eating is and how to practice it.",
      "I know how mindful eating can support my health.",
      "I can recognize hunger and fullness cues in my body.",
      "I know that choosing foods I enjoy can be part of mindful eating.",
      "I know it can take time for my brain to notice when my stomach is full."
    ])
  }),
  Object.freeze({
    number: 7,
    name: "Healthy Habits",
    color: "#7a33c2",
    questions: Object.freeze([
      "I know how much physical activity is recommended each day.",
      "I know the recommended limits of screen time for fun each day.",
      "I know how much sleep is recommended for my age.",
      "I know strategies that can help me be more physically active.",
      "I know strategies that can help me limit screen time for fun.",
      "I know habits that can help me sleep well."
    ])
  })
]);

function knowledgeQuestionDefinitions(instrument, idPrefix, options = {}) {
  return clinicKnowledgeLessons.flatMap((lesson) => lesson.questions.map((question, lessonIndex) => {
    const sortOrder = clinicKnowledgeLessons
      .filter((candidate) => candidate.number < lesson.number)
      .reduce((sum, candidate) => sum + candidate.questions.length, 0) + lessonIndex + 1;
    const retrospective = options.retrospective === true;
    return Object.freeze({
      id: `${idPrefix}-${String(sortOrder).padStart(2, "0")}`,
      instrumentId: instrument.id,
      instrument: instrument.name,
      version: instrument.version,
      question,
      topic: `Lesson ${lesson.number}: ${lesson.name}`,
      respondentType: "",
      administrationPoint: retrospective ? "Graduation" : "Enrollment / Graduation",
      responseType: retrospective
        ? "Retrospective Before SNACK / Now Yes / No self-report"
        : "Yes / No self-report (Yes = 1, No = 0)",
      logicModelOutcome: "Increased nutrition knowledge and food literacy",
      metricKeys: ["clinic.knowledge-gain"],
      mappingStatus: "Mapped",
      recordStatus: options.recordStatus || "Active",
      required: true,
      sortOrder,
      scoringRule: retrospective
        ? "Before SNACK and Now: Yes = 1; No = 0; lessons weighted equally"
        : "Yes = 1; No = 0; lessons weighted equally",
      responseOptions: ["Yes", "No"],
      note: retrospective
        ? "Approved for the 2026.2 retrospective Clinic Knowledge Assessment."
        : "Legacy 2026.1 item retained for historical scoring."
    });
  }));
}

const legacyClinicKnowledgeQuestionDefinitions = Object.freeze(knowledgeQuestionDefinitions(
  legacyClinicKnowledgeInstrument,
  "CKA",
  { recordStatus: "Retired" }
));

const clinicKnowledgeQuestionDefinitions = Object.freeze(knowledgeQuestionDefinitions(
  clinicKnowledgeInstrument,
  "CKA2",
  { retrospective: true }
));

const dayOptions = Object.freeze(["0", "1", "2", "3", "4", "5", "6", "7", "I don't know"]);
const dayOptionsEs = Object.freeze(["0", "1", "2", "3", "4", "5", "6", "7", "No sé"]);
const timesOptions = Object.freeze(["1", "2", "3", "4+", "I don't know"]);
const timesOptionsEs = Object.freeze(["1", "2", "3", "4+", "No sé"]);

const clinicHealthQuestionDefinitions = Object.freeze([
  {
    id: "CHQ-01",
    topic: "Vegetables",
    topicEs: "Verduras",
    question: "During the past 7 days, on how many days did [Child] eat vegetables?",
    questionEs: "Durante los últimos 7 días, ¿cuántos días comió [Child] verduras?",
    helperText: "Include fresh, frozen, or canned vegetables.",
    helperTextEs: "Incluya verduras frescas, congeladas o enlatadas.",
    responseOptions: dayOptions,
    responseOptionsEs: dayOptionsEs,
    domainKey: "vegetables"
  },
  {
    id: "CHQ-02",
    topic: "Vegetables",
    topicEs: "Verduras",
    question: "On a day when [Child] ate vegetables, about how many times did they eat them?",
    questionEs: "En un día en que [Child] comió verduras, aproximadamente ¿cuántas veces las comió?",
    helperText: "Count each meal or snack once.",
    helperTextEs: "Cuente cada comida o refrigerio una vez.",
    responseOptions: timesOptions,
    responseOptionsEs: timesOptionsEs,
    domainKey: "vegetables",
    conditionalQuestionId: "CHQ-01"
  },
  {
    id: "CHQ-03",
    topic: "Fruit",
    topicEs: "Fruta",
    question: "During the past 7 days, on how many days did [Child] eat fruit?",
    questionEs: "Durante los últimos 7 días, ¿cuántos días comió [Child] fruta?",
    helperText: "Include fresh, frozen, canned, or dried fruit. Do not count fruit juice.",
    helperTextEs: "Incluya fruta fresca, congelada, enlatada o seca. No cuente el jugo de fruta.",
    responseOptions: dayOptions,
    responseOptionsEs: dayOptionsEs,
    domainKey: "fruit"
  },
  {
    id: "CHQ-04",
    topic: "Fruit",
    topicEs: "Fruta",
    question: "On a day when [Child] ate fruit, about how many times did they eat it?",
    questionEs: "En un día en que [Child] comió fruta, aproximadamente ¿cuántas veces la comió?",
    helperText: "Count each meal or snack once.",
    helperTextEs: "Cuente cada comida o refrigerio una vez.",
    responseOptions: timesOptions,
    responseOptionsEs: timesOptionsEs,
    domainKey: "fruit",
    conditionalQuestionId: "CHQ-03"
  },
  {
    id: "CHQ-05",
    topic: "Whole Grains",
    topicEs: "Granos Integrales",
    question: "During the past 7 days, on how many days did [Child] eat a whole-grain food?",
    questionEs: "Durante los últimos 7 días, ¿cuántos días comió [Child] un alimento de grano integral?",
    helperText: "Examples include oatmeal, whole-grain cereal or bread, brown rice, quinoa, whole-grain pasta, or tortillas made with whole corn or whole wheat.",
    helperTextEs: "Algunos ejemplos son avena, cereal o pan integral, arroz integral, quinoa, pasta integral o tortillas hechas con maíz o trigo integral.",
    responseOptions: dayOptions,
    responseOptionsEs: dayOptionsEs,
    domainKey: "wholeGrains"
  },
  {
    id: "CHQ-06",
    topic: "Whole Grains",
    topicEs: "Granos Integrales",
    question: "Thinking about all the grain foods [Child] ate during the past 7 days, about how many were whole-grain foods?",
    questionEs: "Pensando en todos los alimentos de grano que [Child] comió durante los últimos 7 días, aproximadamente ¿cuántos eran de grano integral?",
    helperText: "",
    responseOptions: ["None", "Less than half", "About half", "More than half", "All or almost all", "Did not eat grain foods", "I don't know"],
    responseOptionsEs: ["Ninguno", "Menos de la mitad", "Aproximadamente la mitad", "Más de la mitad", "Todos o casi todos", "No comió alimentos de grano", "No sé"],
    domainKey: "wholeGrains"
  },
  {
    id: "CHQ-07",
    topic: "Drinks With Added Sugar",
    topicEs: "Bebidas con Azúcar Añadida",
    question: "During the past 7 days, on how many days did [Child] have a drink with added sugar?",
    questionEs: "Durante los últimos 7 días, ¿cuántos días tomó [Child] una bebida con azúcar añadida?",
    helperText: "Examples include soda, fruit drinks, sports drinks, energy drinks, sweet tea, lemonade, or flavored milk such as chocolate or strawberry milk. Do not count plain milk or 100% fruit juice.",
    helperTextEs: "Algunos ejemplos son refrescos, bebidas de fruta, bebidas deportivas, bebidas energéticas, té dulce, limonada o leche saborizada, como leche con chocolate o fresa. No cuente la leche sin sabor ni el jugo 100% de fruta.",
    responseOptions: dayOptions,
    responseOptionsEs: dayOptionsEs,
    domainKey: "addedSugarDrinks"
  },
  {
    id: "CHQ-08",
    topic: "Drinks With Added Sugar",
    topicEs: "Bebidas con Azúcar Añadida",
    question: "On a day when [Child] had a drink with added sugar, about how many times did they have one?",
    questionEs: "En un día en que [Child] tomó una bebida con azúcar añadida, aproximadamente ¿cuántas veces tomó una?",
    helperText: "",
    responseOptions: timesOptions,
    responseOptionsEs: timesOptionsEs,
    domainKey: "addedSugarDrinks",
    conditionalQuestionId: "CHQ-07"
  },
  {
    id: "CHQ-09",
    topic: "Foods With Added Sugar",
    topicEs: "Alimentos con Azúcar Añadida",
    question: "During the past 7 days, on how many days did [Child] eat a food with added sugar?",
    questionEs: "Durante los últimos 7 días, ¿cuántos días comió [Child] un alimento con azúcar añadida?",
    helperText: "Examples include candy, cookies, cake, pastries, doughnuts, ice cream, sweetened yogurt, or sweetened cereal.",
    helperTextEs: "Algunos ejemplos son dulces, galletas, pastel, pasteles, donas, helado, yogur endulzado o cereal endulzado.",
    responseOptions: dayOptions,
    responseOptionsEs: dayOptionsEs,
    domainKey: "addedSugarFoods"
  },
  {
    id: "CHQ-10",
    topic: "Foods With Added Sugar",
    topicEs: "Alimentos con Azúcar Añadida",
    question: "On a day when [Child] ate a food with added sugar, about how many times did they eat one?",
    questionEs: "En un día en que [Child] comió un alimento con azúcar añadida, aproximadamente ¿cuántas veces comió uno?",
    helperText: "",
    responseOptions: timesOptions,
    responseOptionsEs: timesOptionsEs,
    domainKey: "addedSugarFoods",
    conditionalQuestionId: "CHQ-09"
  },
  {
    id: "CHQ-11",
    topic: "Healthy Habits",
    topicEs: "Hábitos Saludables",
    question: "During the past 7 days, on how many days was [Child] physically active for a total of at least 60 minutes?",
    questionEs: "Durante los últimos 7 días, ¿cuántos días estuvo [Child] físicamente activo/a por un total de al menos 60 minutos?",
    helperText: "Add together activities that made their heart beat faster or made them breathe harder.",
    helperTextEs: "Sume las actividades que hicieron que su corazón latiera más rápido o que respirara con más esfuerzo.",
    responseOptions: dayOptions,
    responseOptionsEs: dayOptionsEs,
    domainKey: "physicalActivity"
  },
  {
    id: "CHQ-12",
    topic: "Healthy Habits",
    topicEs: "Hábitos Saludables",
    question: "During the past 7 days, about how many hours per day did [Child] use screens for fun?",
    questionEs: "Durante los últimos 7 días, aproximadamente ¿cuántas horas al día usó [Child] pantallas por diversión?",
    helperText: "Do not count time for school or homework.",
    helperTextEs: "No cuente el tiempo de escuela o tarea.",
    responseOptions: ["None", "Less than 1 hour", "1 hour", "2 hours", "3 hours", "4 hours", "5 or more hours", "I don't know"],
    responseOptionsEs: ["Ninguna", "Menos de 1 hora", "1 hora", "2 horas", "3 horas", "4 horas", "5 horas o más", "No sé"],
    domainKey: "screenTime"
  },
  {
    id: "CHQ-13",
    topic: "Healthy Habits",
    topicEs: "Hábitos Saludables",
    question: "During the past 7 days, about how many hours of sleep did [Child] get on most nights?",
    questionEs: "Durante los últimos 7 días, aproximadamente ¿cuántas horas durmió [Child] la mayoría de las noches?",
    helperText: "",
    responseOptions: ["5 or fewer hours", "6 hours", "7 hours", "8 hours", "9 hours", "10 hours", "11 hours", "12 hours", "13 or more hours", "I don't know"],
    responseOptionsEs: ["5 horas o menos", "6 horas", "7 horas", "8 horas", "9 horas", "10 horas", "11 horas", "12 horas", "13 horas o más", "No sé"],
    domainKey: "sleep"
  }
].map((definition, index) => Object.freeze({
  ...definition,
  instrumentId: clinicHealthInstrument.id,
  instrument: clinicHealthInstrument.name,
  version: clinicHealthInstrument.version,
  respondentType: "Child or Caregiver",
  administrationPoint: "Enrollment / Graduation",
  responseType: "Single choice",
  logicModelOutcome: definition.domainKey === "physicalActivity" || definition.domainKey === "screenTime" || definition.domainKey === "sleep"
    ? "Sustainable healthy habits and positive behavior change"
    : "Greater alignment with recommended dietary patterns",
  metricKeys: definition.domainKey === "physicalActivity" || definition.domainKey === "screenTime" || definition.domainKey === "sleep"
    ? ["clinic.behavior-change"]
    : ["clinic.guideline-improvement", "clinic.behavior-change"],
  mappingStatus: "Mapped",
  recordStatus: "Active",
  required: true,
  sortOrder: index + 1,
  scoringRule: "Normalized to a 0-100 behavior-domain score; I don't know is missing data.",
  note: "Approved for the 2026.1 Nutrition & Healthy Habits Questionnaire."
})));

function nativeFormQuestion(instrument, id, sortOrder, definition = {}) {
  return Object.freeze({
    id,
    instrumentId: instrument.id,
    instrument: instrument.name,
    version: instrument.version,
    question: definition.question || "",
    questionEs: definition.questionEs || "",
    topic: definition.topic || "",
    topicEs: definition.topicEs || definition.topic || "",
    respondentType: instrument.respondentType,
    administrationPoint: instrument.administrationPoints.join(" / "),
    responseType: definition.responseType || "Short text",
    logicModelOutcome: definition.logicModelOutcome || "Program access and participant experience",
    metricKeys: definition.metricKeys || [],
    mappingStatus: definition.mappingStatus || (definition.metricKeys?.length ? "Mapped" : "Administrative"),
    recordStatus: "Active",
    required: definition.required !== false,
    sortOrder,
    scoringRule: definition.scoringRule || "Not scored",
    responseOptions: definition.responseOptions || [],
    responseOptionsEs: definition.responseOptionsEs || [],
    helperText: definition.helperText || "",
    helperTextEs: definition.helperTextEs || "",
    prefillKey: definition.prefillKey || "",
    profileField: definition.profileField || "",
    domainKey: definition.domainKey || "",
    conditionalQuestionId: definition.conditionalQuestionId || "",
    note: definition.note || ""
  });
}

const yesNoPreferOptions = Object.freeze(["Yes", "No", "Prefer not to answer"]);
const yesNoPreferOptionsEs = Object.freeze(["Sí", "No", "Prefiero no responder"]);
const yesNoUnsureOptions = Object.freeze(["Yes", "No", "Unsure"]);
const yesNoUnsureOptionsEs = Object.freeze(["Sí", "No", "No está seguro/a"]);
const zeroToFiveOptions = Object.freeze(["0", "1", "2", "3", "4", "5"]);
const oneToFourOptions = Object.freeze(["1", "2", "3", "4"]);

const clinicEnrollmentQuestionDefinitions = Object.freeze([
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-01", 1, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "Participant name",
    questionEs: "Nombre del participante",
    prefillKey: "clientName"
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-02", 2, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "Participant birthdate",
    questionEs: "Fecha de nacimiento del participante",
    responseType: "Date",
    prefillKey: "dateOfBirth",
    profileField: "dateOfBirth"
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-03", 3, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "Participant gender identity",
    questionEs: "Identidad de género del participante",
    responseType: "Single choice",
    responseOptions: ["Male", "Gender neutral/non-binary", "Female", "Prefer not to answer"],
    responseOptionsEs: ["Masculino", "Género neutro/no binario", "Femenino", "Prefiero no responder"],
    prefillKey: "gender",
    profileField: "gender"
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-04", 4, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "Preferred language",
    questionEs: "Idioma preferido",
    responseType: "Single choice",
    responseOptions: ["English", "Spanish", "Other"],
    responseOptionsEs: ["Inglés", "Español", "Otro"],
    prefillKey: "preferredLanguage",
    profileField: "preferredLanguage"
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-05", 5, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "Does the child have any food allergies, medical conditions, or anything else you think we should know about?",
    questionEs: "¿Tiene el niño alergias alimentarias, afecciones médicas u otra información que debamos conocer?",
    responseType: "Long text",
    required: false
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-06", 6, {
    topic: "Parent or Guardian Information",
    topicEs: "Información del Padre, Madre o Tutor",
    question: "Parent or guardian name",
    questionEs: "Nombre del padre, madre o tutor",
    prefillKey: "parentName",
    profileField: "parentName"
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-07", 7, {
    topic: "Parent or Guardian Information",
    topicEs: "Información del Padre, Madre o Tutor",
    question: "Email address",
    questionEs: "Dirección de correo electrónico",
    responseType: "Email",
    required: false,
    prefillKey: "email",
    profileField: "email"
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-08", 8, {
    topic: "Parent or Guardian Information",
    topicEs: "Información del Padre, Madre o Tutor",
    question: "Phone number",
    questionEs: "Número de teléfono",
    responseType: "Phone",
    prefillKey: "phone",
    profileField: "phone"
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-09", 9, {
    topic: "Parent or Guardian Information",
    topicEs: "Información del Padre, Madre o Tutor",
    question: "Preferred contact method",
    questionEs: "Método de contacto preferido",
    responseType: "Single choice",
    responseOptions: ["Phone Call", "Text", "Email"],
    responseOptionsEs: ["Llamada", "Mensaje de texto", "Correo electrónico"],
    prefillKey: "preferredContactMethod",
    profileField: "preferredContactMethod"
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-10", 10, {
    topic: "Parent or Guardian Information",
    topicEs: "Información del Padre, Madre o Tutor",
    question: "How did you hear about SNACK?",
    questionEs: "¿Cómo se enteró de SNACK?",
    responseType: "Single choice",
    responseOptions: ["Provider or clinic", "Family or friend", "Community flyer or event", "SNACK staff", "Parks & Recreation", "Previously participated", "Other"],
    responseOptionsEs: ["Proveedor o clínica", "Familiar o amigo", "Folleto o evento comunitario", "Personal de SNACK", "Parques y Recreación", "Participó anteriormente", "Otro"],
    prefillKey: "referralSource",
    profileField: "referralSource"
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-11", 11, {
    topic: "Parent or Guardian Information",
    topicEs: "Información del Padre, Madre o Tutor",
    question: "Has the child participated in the SNACK program before?",
    questionEs: "¿Ha participado el niño anteriormente en el programa SNACK?",
    responseType: "Single choice",
    responseOptions: ["Yes", "No", "I don't know"],
    responseOptionsEs: ["Sí", "No", "No lo sé"]
  }),
  ...[
    ["ENR-12", "Does the participant have YCCO insurance coverage?", "¿El participante tiene cobertura de seguro YCCO?", "ycco", "ycco"],
    ["ENR-14", "Does the participant identify as a person of color?", "¿El participante se identifica como una persona de color?", "", ""],
    ["ENR-15", "Does the participant identify as Hispanic?", "¿El participante se identifica como hispano/a?", "", ""],
    ["ENR-16", "Does the participant identify as Native American?", "¿El participante se identifica como nativo/a americano/a?", "", ""],
    ["ENR-17", "Does the participant have any physical, mental, learning, emotional, or other disabilities?", "¿Tiene el participante alguna discapacidad física, mental, de aprendizaje, emocional o de otro tipo?", "", ""],
    ["ENR-18", "Does the participant consider themselves part of a household living on low income?", "¿El participante se considera parte de un hogar con bajos ingresos?", "", ""],
    ["ENR-19", "Does the participant consider themselves part of a family that is homeless?", "¿El participante se considera parte de una familia sin hogar?", "", ""],
    ["ENR-20", "In the last 30 days, did the participant's family run out of food before you were able to get more?", "En los últimos 30 días, ¿la familia del participante se quedó sin alimentos antes de que usted pudiera conseguir más?", "", ""],
    ["ENR-21", "In the last 30 days, did the participant's family worry that they would run out of food before you were able to get more?", "En los últimos 30 días, ¿la familia del participante se preocupó de que se quedarían sin alimentos antes de poder conseguir más?", "", ""]
  ].map(([id, question, questionEs, prefillKey, profileField], index) => nativeFormQuestion(
    clinicEnrollmentInstrument,
    id,
    12 + index + (index > 0 ? 1 : 0),
    {
      topic: "Reporting Information",
      topicEs: "Información para Informes",
      question,
      questionEs,
      responseType: "Single choice",
      responseOptions: yesNoPreferOptions,
      responseOptionsEs: yesNoPreferOptionsEs,
      prefillKey,
      profileField,
      logicModelOutcome: "Equitable program reach and access",
      metricKeys: ["organization.priority-population-participation"]
    }
  )),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-13", 13, {
    topic: "Reporting Information",
    topicEs: "Información para Informes",
    question: "YCCO member number",
    questionEs: "Número de miembro de YCCO",
    helperText: "Complete when YCCO coverage is available.",
    helperTextEs: "Complete cuando haya cobertura de YCCO.",
    required: false,
    prefillKey: "yccoId",
    profileField: "yccoId"
  }),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-22", 22, {
    topic: "Reporting Information",
    topicEs: "Información para Informes",
    question: "If you answered Yes to either food-access question, are you interested in further support?",
    questionEs: "Si respondió Sí a cualquiera de las preguntas sobre acceso a alimentos, ¿está interesado/a en recibir más apoyo?",
    responseType: "Single choice",
    responseOptions: ["Yes", "No"],
    responseOptionsEs: ["Sí", "No"],
    required: false,
    logicModelOutcome: "Improved access to nutrition and community resources"
  }),
  ...[
    ["ENR-23", "I consent to the child's participation in SNACK nutrition education. I understand that I assume the risk of any accident or injury sustained during participation and release SNACK, WOCTLC, PMC, and associated staff from liability for such accident or injury.", "Doy mi consentimiento para que el niño participe en la educación nutricional de SNACK. Entiendo que asumo el riesgo de cualquier accidente o lesión durante su participación y libero a SNACK, WOCTLC, PMC y al personal asociado de responsabilidad por dicho accidente o lesión.", true],
    ["ENR-24", "I consent to the child's appointment information being discussed for supervision using only non-identifying information. All information will remain confidential and be used only for supervision and professional development.", "Doy mi consentimiento para que la información de las citas del niño se discuta con fines de supervisión usando solamente información no identificativa. Toda la información permanecerá confidencial y se utilizará únicamente para supervisión y desarrollo profesional.", true],
    ["ENR-25", "I understand that the SNACK Program is an independent organization that is not legally affiliated with Physicians' Medical Center.", "Entiendo que el Programa SNACK es una organización independiente que no está afiliada legalmente a Physicians' Medical Center.", true],
    ["ENR-26", "I understand that the child and family will not become patients of Physicians' Medical Center by enrolling in SNACK.", "Entiendo que el niño y la familia no se convertirán en pacientes de Physicians' Medical Center al inscribirse en SNACK.", true],
    ["ENR-27", "I will continue to seek medical care from the child's primary care provider.", "Continuaré buscando atención médica del proveedor de atención primaria del niño.", true],
    ["ENR-28", "The SNACK Program has my permission to use my child's photograph publicly to promote the organization in print, online, presentations, websites, and social media without compensation.", "El Programa SNACK tiene mi permiso para usar públicamente la fotografía de mi hijo/a para promover la organización en publicaciones impresas y en línea, presentaciones, sitios web y redes sociales sin compensación.", false]
  ].map(([id, question, questionEs, required], index) => nativeFormQuestion(
    clinicEnrollmentInstrument,
    id,
    23 + index,
    {
      topic: "Consent and Agreement",
      topicEs: "Consentimiento y Acuerdo",
      question,
      questionEs,
      responseType: "Agreement",
      responseOptions: ["I agree"],
      responseOptionsEs: ["Estoy de acuerdo"],
      required
    }
  )),
  nativeFormQuestion(clinicEnrollmentInstrument, "ENR-29", 29, {
    topic: "Consent and Agreement",
    topicEs: "Consentimiento y Acuerdo",
    question: "Parent or legal guardian signature",
    questionEs: "Firma del padre, madre o tutor legal",
    helperText: "Type your full name as your electronic signature.",
    helperTextEs: "Escriba su nombre completo como firma electrónica."
  })
].flat().sort((first, second) => first.sortOrder - second.sortOrder));

const legacyClinicHrsnScreenerQuestionDefinitions = Object.freeze([
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-01", 1, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "Participant name",
    questionEs: "Nombre del participante",
    prefillKey: "clientName"
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-02", 2, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "Today's date",
    questionEs: "Fecha de hoy",
    responseType: "Date",
    prefillKey: "currentDate"
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-03", 3, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "YCCO insurance ID number",
    questionEs: "Número de identificación del seguro YCCO",
    prefillKey: "yccoId"
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-04", 4, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "Date of birth",
    questionEs: "Fecha de nacimiento",
    responseType: "Date",
    prefillKey: "dateOfBirth"
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-05", 5, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "Primary care provider",
    questionEs: "Proveedor de atención primaria",
    required: false
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-06", 6, {
    topic: "Participant Information",
    topicEs: "Información del Participante",
    question: "Primary care provider phone number",
    questionEs: "Número de teléfono del proveedor de atención primaria",
    responseType: "Phone",
    required: false
  }),
  ...[
    ["Recently discharged from a behavioral health facility", "Dado/a de alta recientemente de un centro de salud conductual"],
    ["Recently released from incarceration", "Liberado/a recientemente de encarcelamiento"],
    ["Currently or previously involved in the Oregon Child Welfare System", "Actualmente o anteriormente involucrado/a en el Sistema de Bienestar Infantil de Oregón"],
    ["At risk of being unhoused", "En riesgo de quedarse sin vivienda"],
    ["A young adult with special health care needs", "Adulto joven con necesidades especiales de atención médica"],
    ["Complex behavioral health needs", "Necesidades complejas de salud conductual"],
    ["Complex physical health needs", "Necesidades complejas de salud física"],
    ["Developmental disability", "Discapacidad del desarrollo"],
    ["Interpersonal violence experience", "Experiencia de violencia interpersonal"],
    ["Pregnant or postpartum", "Embarazada o en período posparto"],
    ["Repeated emergency department use and crisis encounters", "Uso repetido del departamento de emergencias y encuentros de crisis"]
  ].map(([question, questionEs], index) => nativeFormQuestion(
    legacyClinicHrsnScreenerInstrument,
    `HRSN-${String(index + 7).padStart(2, "0")}`,
    index + 7,
    {
      topic: "Covered Population",
      topicEs: "Población Cubierta",
      question,
      questionEs,
      responseType: "Single choice",
      responseOptions: yesNoUnsureOptions,
      responseOptionsEs: yesNoUnsureOptionsEs,
      logicModelOutcome: "Improved access to nutrition and community resources",
      mappingStatus: "Eligibility"
    }
  )),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-18", 18, {
    topic: "Food Access",
    topicEs: "Acceso a los Alimentos",
    question: "In the last 12 months, was this statement often true, sometimes true, or never true for your household: “The food that we bought just didn't last, and we didn't have money to get more.”",
    questionEs: "En los últimos 12 meses, ¿esta afirmación fue frecuentemente cierta, a veces cierta o nunca cierta para su hogar?: “La comida que compramos simplemente no duraba y no teníamos dinero para comprar más.”",
    responseType: "Single choice",
    responseOptions: ["Often", "Sometimes", "Never", "Don't know / Prefer not to answer"],
    responseOptionsEs: ["Frecuentemente", "A veces", "Nunca", "No sé / Prefiero no responder"],
    logicModelOutcome: "Improved access to nutrition and community resources",
    mappingStatus: "Eligibility"
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-19", 19, {
    topic: "Food Access",
    topicEs: "Acceso a los Alimentos",
    question: "In the last 12 months, was this statement often true, sometimes true, or never true for your household: “We couldn't afford to eat balanced meals.”",
    questionEs: "En los últimos 12 meses, ¿esta afirmación fue frecuentemente cierta, a veces cierta o nunca cierta para su hogar?: “No podíamos pagar comidas balanceadas.”",
    responseType: "Single choice",
    responseOptions: ["Often", "Sometimes", "Never", "Don't know / Prefer not to answer"],
    responseOptionsEs: ["Frecuentemente", "A veces", "Nunca", "No sé / Prefiero no responder"],
    logicModelOutcome: "Improved access to nutrition and community resources",
    mappingStatus: "Eligibility"
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-20", 20, {
    topic: "Food Access",
    topicEs: "Acceso a los Alimentos",
    question: "In the last 12 months, did you or other adults in your household ever cut the size of meals or skip meals because there wasn't enough money for food?",
    questionEs: "En los últimos 12 meses, ¿usted u otros adultos en su hogar redujeron el tamaño de sus comidas o se saltaron comidas porque no había suficiente dinero para alimentos?",
    responseType: "Single choice",
    responseOptions: ["Yes", "No", "Don't know / Prefer not to answer"],
    responseOptionsEs: ["Sí", "No", "No sé / Prefiero no responder"],
    logicModelOutcome: "Improved access to nutrition and community resources",
    mappingStatus: "Eligibility"
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-21", 21, {
    topic: "Food Access",
    topicEs: "Acceso a los Alimentos",
    question: "If Yes, how often did this happen?",
    questionEs: "Si respondió Sí, ¿con qué frecuencia ocurrió esto?",
    responseType: "Single choice",
    responseOptions: ["Almost every month", "Some months but not every month", "Only 1 or 2 months", "Don't know / Prefer not to answer"],
    responseOptionsEs: ["Casi todos los meses", "Algunos meses, pero no todos", "Solo 1 o 2 meses", "No sé / Prefiero no responder"],
    required: false,
    conditionalQuestionId: "HRSN-20",
    logicModelOutcome: "Improved access to nutrition and community resources",
    mappingStatus: "Eligibility"
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-22", 22, {
    topic: "Food Access",
    topicEs: "Acceso a los Alimentos",
    question: "In the last 12 months, did you ever eat less than you felt you should because there wasn't enough money for food?",
    questionEs: "En los últimos 12 meses, ¿alguna vez comió menos de lo que pensaba que debía porque no había suficiente dinero para alimentos?",
    responseType: "Single choice",
    responseOptions: ["Yes", "No", "Don't know / Prefer not to answer"],
    responseOptionsEs: ["Sí", "No", "No sé / Prefiero no responder"],
    logicModelOutcome: "Improved access to nutrition and community resources",
    mappingStatus: "Eligibility"
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-23", 23, {
    topic: "Food Access",
    topicEs: "Acceso a los Alimentos",
    question: "In the last 12 months, were you hungry but didn't eat because there wasn't enough money for food?",
    questionEs: "En los últimos 12 meses, ¿tuvo hambre pero no comió porque no había suficiente dinero para alimentos?",
    responseType: "Single choice",
    responseOptions: ["Yes", "No", "Don't know / Prefer not to answer"],
    responseOptionsEs: ["Sí", "No", "No sé / Prefiero no responder"],
    logicModelOutcome: "Improved access to nutrition and community resources",
    mappingStatus: "Eligibility"
  }),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-24", 24, {
    topic: "Food Access",
    topicEs: "Acceso a los Alimentos",
    question: "If you answered Yes to any food-access question, are you interested in further support?",
    questionEs: "Si respondió Sí a alguna pregunta sobre acceso a alimentos, ¿está interesado/a en recibir apoyo adicional?",
    responseType: "Single choice",
    responseOptions: ["Yes", "No"],
    responseOptionsEs: ["Sí", "No"],
    required: false,
    logicModelOutcome: "Improved access to nutrition and community resources",
    mappingStatus: "Eligibility"
  }),
  ...[
    ["I agree that the participant is not receiving duplicative services (medical nutrition therapy) through other programs.", "Estoy de acuerdo en que el participante no está recibiendo servicios duplicados (terapia nutricional médica) a través de otros programas."],
    ["I agree to be contacted by phone, email, or text by YCCO staff to get more information.", "Estoy de acuerdo en ser contactado/a por teléfono, correo electrónico o mensaje de texto por el personal de YCCO para obtener más información."],
    ["I agree to the use of information technology methods of personal data sharing.", "Estoy de acuerdo con el uso de métodos tecnológicos para compartir datos personales."],
    ["I agree that, to the best of my knowledge, all information I provided is true, correct, and complete.", "Estoy de acuerdo en que, según mi mejor conocimiento, toda la información proporcionada es verdadera, correcta y completa."]
  ].map(([question, questionEs], index) => nativeFormQuestion(
    legacyClinicHrsnScreenerInstrument,
    `HRSN-${index + 25}`,
    index + 25,
    {
      topic: "Consent and Agreement",
      topicEs: "Consentimiento y Acuerdo",
      question,
      questionEs,
      responseType: "Agreement",
      responseOptions: ["I agree"],
      responseOptionsEs: ["Estoy de acuerdo"],
      mappingStatus: "Eligibility"
    }
  )),
  nativeFormQuestion(legacyClinicHrsnScreenerInstrument, "HRSN-29", 29, {
    topic: "Consent and Agreement",
    topicEs: "Consentimiento y Acuerdo",
    question: "Parent or legal guardian signature",
    questionEs: "Firma del padre, madre o tutor legal",
    helperText: "Type your full name as your electronic signature.",
    helperTextEs: "Escriba su nombre completo como firma electrónica."
  })
].flat());

const clinicHrsnScreenerQuestionDefinitions = Object.freeze(
  legacyClinicHrsnScreenerQuestionDefinitions
    .filter((question) => question.id !== "HRSN-06")
    .map((question) => {
      const questionOverrides = {
        "HRSN-18": {
          question: "“The food that we bought just didn't last, and we didn't have money to get more.” Was that often, sometimes, or never true for your household in the last 12 months?"
        },
        "HRSN-19": {
          question: "“We couldn't afford to eat balanced meals.” Was that often, sometimes, or never true for your household in the last 12 months?"
        },
        "HRSN-20": {
          question: "In the last 12 months, did you or other adults in your household ever cut the size of your meals or skip meals because there wasn't enough money for food?"
        },
        "HRSN-21": {
          question: "If yes above, how often did this happen?"
        },
        "HRSN-24": {
          question: "If you marked yes on any of the above questions, are you interested in further support?"
        }
      }[question.id] || {};
      return Object.freeze({
        ...question,
        ...questionOverrides,
        id: question.id.replace("HRSN-", "HRSN2-"),
        instrumentId: clinicHrsnScreenerInstrument.id,
        instrument: clinicHrsnScreenerInstrument.name,
        version: clinicHrsnScreenerInstrument.version,
        conditionalQuestionId: question.conditionalQuestionId
          ? question.conditionalQuestionId.replace("HRSN-", "HRSN2-")
          : "",
        sortOrder: question.sortOrder > 6 ? question.sortOrder - 1 : question.sortOrder
      });
    })
);

function feedbackQuestionDefinitions(instrument, options = {}) {
  const caregiver = options.caregiver === true;
  const legacyScale = options.legacyScale === true;
  const topic = "Your Experience";
  const topicEs = "Su Experiencia";
  const ratingHelper = legacyScale ? "Choose 0 for Not at all and 5 for Extremely." : "";
  const ratingHelperEs = legacyScale ? "Elija 0 para Nada y 5 para Extremadamente." : "";
  const statements = caregiver
    ? [
      ["I feel supported during my child's appointments.", "Me siento apoyado/a durante las citas de mi hijo/a.", [], "Not scored", "Mapped"],
      ["I feel satisfied with my child's appointments.", "Me siento satisfecho/a con las citas de mi hijo/a.", ["clinic.participant-satisfaction"], legacyScale ? "Positive = 4 or 5" : "Positive = 3 or 4", "Mapped"],
      ["The information was relevant to my child and family.", "La información fue relevante para mi hijo/a y mi familia.", [], "Not scored", "Mapped"],
      ["My child's food choices have changed since starting SNACK.", "Las elecciones de alimentos de mi hijo/a han cambiado desde que comenzó SNACK.", ["clinic.behavior-change"], "Supplemental perceived-change item; does not replace the behavior questionnaire score", "Supplemental"],
      ["I feel confident supporting my child's healthy habits after SNACK.", "Me siento seguro/a apoyando los hábitos saludables de mi hijo/a después de SNACK.", [], "Not scored", "Mapped"],
      ["Since starting SNACK, healthy habits feel easier to fit into our everyday life.", "Desde que comenzó SNACK, los hábitos saludables son más fáciles de incorporar en nuestra vida diaria.", ["clinic.quality-of-life"], legacyScale ? "Exploratory 0-5 quality-of-life item" : "Exploratory 1-4 quality-of-life item", "Mapped"],
      ["Since starting SNACK, my child has more energy for the things they want to do.", "Desde que comenzó SNACK, mi hijo/a tiene más energía para hacer las cosas que quiere hacer.", ["clinic.quality-of-life"], legacyScale ? "Exploratory 0-5 quality-of-life item" : "Exploratory 1-4 quality-of-life item", "Mapped"]
    ]
    : [
      ["I feel supported during my appointments.", "Me siento apoyado/a durante mis citas.", [], "Not scored", "Mapped"],
      ["I feel satisfied with my appointments.", "Me siento satisfecho/a con mis citas.", ["clinic.participant-satisfaction"], legacyScale ? "Positive = 4 or 5" : "Positive = 3 or 4", "Mapped"],
      ["The information was relevant to me.", "La información fue relevante para mí.", [], "Not scored", "Mapped"],
      ["My food choices have changed since starting SNACK.", "Mis elecciones de alimentos han cambiado desde que comencé SNACK.", ["clinic.behavior-change"], "Supplemental perceived-change item; does not replace the behavior questionnaire score", "Supplemental"],
      ["I feel confident using what I learned at SNACK to make healthy choices.", "Me siento seguro/a usando lo que aprendí en SNACK para tomar decisiones saludables.", [], "Not scored", "Mapped"],
      ["Since starting SNACK, healthy habits feel easier to fit into my everyday life.", "Desde que comencé SNACK, los hábitos saludables son más fáciles de incorporar en mi vida diaria.", ["clinic.quality-of-life"], legacyScale ? "Exploratory 0-5 quality-of-life item" : "Exploratory 1-4 quality-of-life item", "Mapped"],
      ["Since starting SNACK, I have more energy for the things I want to do.", "Desde que comencé SNACK, tengo más energía para hacer las cosas que quiero hacer.", ["clinic.quality-of-life"], legacyScale ? "Exploratory 0-5 quality-of-life item" : "Exploratory 1-4 quality-of-life item", "Mapped"]
    ];
  const openQuestions = caregiver
    ? [
      ["What was your favorite part of your child's SNACK appointments?", "¿Cuál fue su parte favorita de las citas de SNACK de su hijo/a?"],
      ["What do you think could have gone better?", "¿Qué cree que podría haber sido mejor?"],
      ["What is one thing you learned from the appointments?", "¿Qué aprendió de las citas?"],
      ["What is something you still want to learn?", "¿Qué le gustaría aprender todavía?"]
    ]
    : [
      ["What was your favorite part of your SNACK appointments?", "¿Cuál fue tu parte favorita de las citas de SNACK?"],
      ["What do you think could have gone better?", "¿Qué crees que podría haber sido mejor?"],
      ["What is one thing you learned from the appointments?", "¿Qué aprendiste de las citas?"],
      ["What is something you still want to learn?", "¿Qué te gustaría aprender todavía?"]
    ];
  const prefix = `${caregiver ? "CFB" : "CHFB"}${legacyScale ? "" : "2"}`;
  return [
    ...statements.map(([question, questionEs, metricKeys, scoringRule, mappingStatus], index) => nativeFormQuestion(
      instrument,
      `${prefix}-${String(index + 1).padStart(2, "0")}`,
      index + 1,
      {
        topic,
        topicEs,
        question,
        questionEs,
        helperText: ratingHelper,
        helperTextEs: ratingHelperEs,
        responseType: "Rating",
        responseOptions: legacyScale ? zeroToFiveOptions : oneToFourOptions,
        responseOptionsEs: legacyScale ? zeroToFiveOptions : oneToFourOptions,
        logicModelOutcome: metricKeys.includes("clinic.quality-of-life")
          ? "Improved child and family health and well-being"
          : "Positive, family-centered program experience",
        metricKeys,
        scoringRule,
        mappingStatus
      }
    )),
    ...openQuestions.map(([question, questionEs], index) => nativeFormQuestion(
      instrument,
      `${prefix}-${String(index + 8).padStart(2, "0")}`,
      index + 8,
      {
        topic: "Open Feedback",
        topicEs: "Comentarios Abiertos",
        question,
        questionEs,
        responseType: "Long text",
        required: false,
        logicModelOutcome: "Continuous program learning and improvement",
        mappingStatus: "Qualitative"
      }
    ))
  ];
}

const legacyClinicChildFeedbackQuestionDefinitions = Object.freeze(feedbackQuestionDefinitions(
  legacyClinicChildFeedbackInstrument,
  { legacyScale: true }
));
const legacyClinicCaregiverFeedbackQuestionDefinitions = Object.freeze(feedbackQuestionDefinitions(
  legacyClinicCaregiverFeedbackInstrument,
  { caregiver: true, legacyScale: true }
));
const clinicChildFeedbackQuestionDefinitions = Object.freeze(feedbackQuestionDefinitions(
  clinicChildFeedbackInstrument
));
const clinicCaregiverFeedbackQuestionDefinitions = Object.freeze(feedbackQuestionDefinitions(
  clinicCaregiverFeedbackInstrument,
  { caregiver: true }
));

function mergeEvaluationDefaults(defaultItems = [], savedItems = []) {
  const savedById = new Map(savedItems.map((item) => [item.id, item]));
  const defaults = defaultItems.map((item) => {
    const saved = savedById.get(item.id);
    savedById.delete(item.id);
    if (!saved) return { ...item };
    const merged = { ...item, ...saved, id: item.id };
    for (const field of ["nameEs", "descriptionEs", "instructionsEs", "questionEs", "topicEs", "helperTextEs"]) {
      if (!String(merged[field] || "").trim() && String(item[field] || "").trim()) merged[field] = item[field];
    }
    if ((!Array.isArray(merged.responseOptionsEs) || !merged.responseOptionsEs.length) && item.responseOptionsEs?.length) {
      merged.responseOptionsEs = item.responseOptionsEs;
    }
    if (item.languages?.length) {
      merged.languages = [...new Set([...item.languages, ...(Array.isArray(saved.languages) ? saved.languages : [])])];
    }
    return merged;
  });
  return [...defaults, ...savedById.values()];
}

function mergeClinicEvaluationInstruments(savedInstruments = []) {
  return mergeEvaluationDefaults([
    legacyClinicKnowledgeInstrument,
    clinicKnowledgeInstrument,
    clinicHealthInstrument,
    clinicEnrollmentInstrument,
    legacyClinicHrsnScreenerInstrument,
    clinicHrsnScreenerInstrument,
    legacyClinicChildFeedbackInstrument,
    clinicChildFeedbackInstrument,
    legacyClinicCaregiverFeedbackInstrument,
    clinicCaregiverFeedbackInstrument
  ], savedInstruments).map((instrument) => [
    legacyClinicKnowledgeInstrument.id,
    legacyClinicHrsnScreenerInstrument.id,
    legacyClinicChildFeedbackInstrument.id,
    legacyClinicCaregiverFeedbackInstrument.id
  ].includes(instrument.id)
    ? { ...instrument, status: "Retired" }
    : instrument);
}

function mergeClinicEvaluationQuestions(savedQuestions = []) {
  return mergeEvaluationDefaults([
    ...legacyClinicKnowledgeQuestionDefinitions,
    ...clinicKnowledgeQuestionDefinitions,
    ...clinicHealthQuestionDefinitions,
    ...clinicEnrollmentQuestionDefinitions,
    ...legacyClinicHrsnScreenerQuestionDefinitions,
    ...clinicHrsnScreenerQuestionDefinitions,
    ...legacyClinicChildFeedbackQuestionDefinitions,
    ...clinicChildFeedbackQuestionDefinitions,
    ...legacyClinicCaregiverFeedbackQuestionDefinitions,
    ...clinicCaregiverFeedbackQuestionDefinitions
  ], savedQuestions).map((question) => [
    legacyClinicKnowledgeInstrument.id,
    legacyClinicHrsnScreenerInstrument.id,
    legacyClinicChildFeedbackInstrument.id,
    legacyClinicCaregiverFeedbackInstrument.id
  ].includes(question.instrumentId)
    ? { ...question, recordStatus: "Retired" }
    : question);
}

function normalizedAnswerValue(value) {
  if (value === true) return 1;
  if (value === false) return 0;
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "yes" || normalized === "1" || normalized === "true") return 1;
  if (normalized === "no" || normalized === "0" || normalized === "false") return 0;
  return null;
}

function roundedPercent(value) {
  return Math.round(value * 10) / 10;
}

function questionsForInstrument(questions, instrumentId) {
  return questions
    .filter((question) => question.instrumentId === instrumentId && question.recordStatus !== "Draft")
    .sort((first, second) => Number(first.sortOrder || 0) - Number(second.sortOrder || 0));
}

function scoreKnowledgeColumn(response, questions, answerField) {
  const activeQuestions = questionsForInstrument(questions, response.instrumentId);
  const answersByQuestion = new Map((response.answers || []).map((answer) => [answer.questionId, answer]));
  const lessonGroups = new Map();
  activeQuestions.forEach((question) => {
    if (!lessonGroups.has(question.topic)) lessonGroups.set(question.topic, []);
    lessonGroups.get(question.topic).push(normalizedAnswerValue(answersByQuestion.get(question.id)?.[answerField]));
  });
  const lessonScores = [...lessonGroups.entries()].map(([lesson, values]) => {
    const scoredValues = values.filter((value) => value !== null);
    return {
      lesson,
      answeredCount: scoredValues.length,
      questionCount: values.length,
      percent: scoredValues.length === values.length && values.length
        ? roundedPercent((scoredValues.reduce((sum, value) => sum + value, 0) / values.length) * 100)
        : null
    };
  });
  const complete = activeQuestions.length > 0 && lessonScores.every((lesson) => lesson.percent !== null);
  return {
    score: complete
      ? roundedPercent(lessonScores.reduce((sum, lesson) => sum + lesson.percent, 0) / lessonScores.length)
      : null,
    lessonScores,
    complete
  };
}

function legacyClinicKnowledgeResponseScore(
  response = {},
  questions = legacyClinicKnowledgeQuestionDefinitions
) {
  const activeQuestions = questionsForInstrument(questions, response.instrumentId);
  const answersByQuestion = new Map((response.answers || []).map((answer) => [answer.questionId, answer.value]));
  const unansweredQuestionIds = activeQuestions
    .filter((question) => question.required && normalizedAnswerValue(answersByQuestion.get(question.id)) === null)
    .map((question) => question.id);
  const lessonGroups = new Map();

  activeQuestions.forEach((question) => {
    if (!lessonGroups.has(question.topic)) lessonGroups.set(question.topic, []);
    lessonGroups.get(question.topic).push(normalizedAnswerValue(answersByQuestion.get(question.id)));
  });

  const lessonScores = [...lessonGroups.entries()].map(([lesson, values]) => {
    const scoredValues = values.filter((value) => value !== null);
    return {
      lesson,
      answeredCount: scoredValues.length,
      questionCount: values.length,
      percent: scoredValues.length === values.length && values.length
        ? roundedPercent((scoredValues.reduce((sum, value) => sum + value, 0) / values.length) * 100)
        : null
    };
  });
  const complete = activeQuestions.length > 0 && unansweredQuestionIds.length === 0;
  const score = complete && lessonScores.every((lesson) => lesson.percent !== null)
    ? roundedPercent(lessonScores.reduce((sum, lesson) => sum + lesson.percent, 0) / lessonScores.length)
    : null;

  return {
    score,
    complete,
    answeredCount: activeQuestions.length - unansweredQuestionIds.length,
    questionCount: activeQuestions.length,
    unansweredQuestionIds,
    lessonScores
  };
}

function clinicKnowledgeResponseScore(response = {}, questions = []) {
  const scoringQuestions = questions.length
    ? questions
    : response.instrumentId === legacyClinicKnowledgeInstrument.id
      ? legacyClinicKnowledgeQuestionDefinitions
      : clinicKnowledgeQuestionDefinitions;
  if (response.instrumentId === legacyClinicKnowledgeInstrument.id) {
    return legacyClinicKnowledgeResponseScore(response, scoringQuestions);
  }
  const activeQuestions = questionsForInstrument(scoringQuestions, response.instrumentId);
  const answersByQuestion = new Map((response.answers || []).map((answer) => [answer.questionId, answer]));
  const unansweredQuestionIds = activeQuestions
    .filter((question) => {
      const answer = answersByQuestion.get(question.id) || {};
      return normalizedAnswerValue(answer.beforeValue) === null || normalizedAnswerValue(answer.nowValue) === null;
    })
    .map((question) => question.id);
  const before = scoreKnowledgeColumn(response, activeQuestions, "beforeValue");
  const now = scoreKnowledgeColumn(response, activeQuestions, "nowValue");
  const lessonScores = before.lessonScores.map((lesson, index) => ({
    lesson: lesson.lesson,
    questionCount: lesson.questionCount,
    beforePercent: lesson.percent,
    nowPercent: now.lessonScores[index]?.percent ?? null,
    gain: lesson.percent === null || now.lessonScores[index]?.percent === null
      ? null
      : roundedPercent(now.lessonScores[index].percent - lesson.percent)
  }));
  const complete = activeQuestions.length > 0 && unansweredQuestionIds.length === 0;
  const beforeScore = complete ? before.score : null;
  const nowScore = complete ? now.score : null;
  const gain = beforeScore === null || nowScore === null ? null : roundedPercent(nowScore - beforeScore);

  return {
    score: nowScore,
    beforeScore,
    nowScore,
    gain,
    complete,
    answeredCount: activeQuestions.length - unansweredQuestionIds.length,
    questionCount: activeQuestions.length,
    unansweredQuestionIds,
    lessonScores
  };
}

function normalizedChoice(value) {
  return String(value ?? "").trim();
}

function isUnknown(value) {
  return normalizedChoice(value).toLowerCase() === "i don't know";
}

function daysScore(value) {
  if (isUnknown(value) || normalizedChoice(value) === "") return null;
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 && number <= 7 ? (number / 7) * 100 : null;
}

function frequencyScore(daysValue, timesValue) {
  const days = Number(daysValue);
  if (isUnknown(daysValue) || normalizedChoice(daysValue) === "") return null;
  if (days === 0) return 0;
  if (!Number.isInteger(days) || days < 0 || days > 7 || isUnknown(timesValue)) return null;
  const timesMap = { "1": 1, "2": 2, "3": 3, "4+": 4 };
  const times = timesMap[normalizedChoice(timesValue)];
  return times ? (days / 7) * (times / 4) * 100 : null;
}

function wholeGrainShareScore(value) {
  const scores = {
    None: 0,
    "Less than half": 25,
    "About half": 50,
    "More than half": 75,
    "All or almost all": 100,
    "Did not eat grain foods": 0
  };
  return Object.hasOwn(scores, normalizedChoice(value)) ? scores[normalizedChoice(value)] : null;
}

function screenTimeScore(value) {
  const scores = {
    None: 100,
    "Less than 1 hour": 90,
    "1 hour": 80,
    "2 hours": 60,
    "3 hours": 40,
    "4 hours": 20,
    "5 or more hours": 0
  };
  return Object.hasOwn(scores, normalizedChoice(value)) ? scores[normalizedChoice(value)] : null;
}

function ageOnDate(dateOfBirth, responseDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth || "") || !/^\d{4}-\d{2}-\d{2}$/.test(responseDate || "")) return null;
  const [birthYear, birthMonth, birthDay] = dateOfBirth.split("-").map(Number);
  const [year, month, day] = responseDate.split("-").map(Number);
  let age = year - birthYear;
  if (month < birthMonth || (month === birthMonth && day < birthDay)) age -= 1;
  return age >= 0 ? age : null;
}

function sleepHours(value) {
  const normalized = normalizedChoice(value);
  if (normalized === "5 or fewer hours") return 5;
  if (normalized === "13 or more hours") return 13;
  const match = normalized.match(/^(\d+) hours?$/);
  return match ? Number(match[1]) : null;
}

function sleepScore(value, dateOfBirth, responseDate) {
  const hours = sleepHours(value);
  const age = ageOnDate(dateOfBirth, responseDate);
  if (hours === null || age === null || age < 6 || age > 18) return null;
  const minimum = age <= 12 ? 9 : 8;
  const maximum = age <= 12 ? 12 : 10;
  if (hours >= minimum && hours <= maximum) return 100;
  const distance = hours < minimum ? minimum - hours : hours - maximum;
  return Math.max(0, 100 - distance * 25);
}

function expectedHealthQuestionIds(response = {}, questions = clinicHealthQuestionDefinitions) {
  const activeQuestions = questionsForInstrument(questions, response.instrumentId);
  return activeQuestions.map((question) => question.id);
}

function clinicHealthResponseScore(response = {}, questions = clinicHealthQuestionDefinitions, options = {}) {
  const activeQuestions = questionsForInstrument(questions, response.instrumentId);
  const answers = new Map((response.answers || []).map((answer) => [answer.questionId, answer.value]));
  const expectedQuestionIds = expectedHealthQuestionIds(response, activeQuestions);
  const unansweredQuestionIds = expectedQuestionIds.filter((questionId) => normalizedChoice(answers.get(questionId)) === "");
  const value = (questionId) => answers.get(questionId);
  const vegetableScore = frequencyScore(value("CHQ-01"), value("CHQ-02"));
  const fruitScore = frequencyScore(value("CHQ-03"), value("CHQ-04"));
  const wholeGrainDays = daysScore(value("CHQ-05"));
  const wholeGrainShare = wholeGrainShareScore(value("CHQ-06"));
  const wholeGrainScore = wholeGrainDays === null || wholeGrainShare === null
    ? null
    : (wholeGrainDays + wholeGrainShare) / 2;
  const sugarDrinkExposure = frequencyScore(value("CHQ-07"), value("CHQ-08"));
  const sugarFoodExposure = frequencyScore(value("CHQ-09"), value("CHQ-10"));
  const addedSugarScore = sugarDrinkExposure === null || sugarFoodExposure === null
    ? null
    : 100 - ((sugarDrinkExposure + sugarFoodExposure) / 2);
  const domainScores = {
    vegetables: vegetableScore,
    fruit: fruitScore,
    wholeGrains: wholeGrainScore,
    addedSugar: addedSugarScore,
    physicalActivity: daysScore(value("CHQ-11")),
    screenTime: screenTimeScore(value("CHQ-12")),
    sleep: sleepScore(
      value("CHQ-13"),
      options.dateOfBirth || response.clientBirthdate || "",
      response.responseDate || ""
    )
  };
  Object.keys(domainScores).forEach((key) => {
    if (domainScores[key] !== null) domainScores[key] = roundedPercent(domainScores[key]);
  });
  const foodDomainKeys = ["vegetables", "fruit", "wholeGrains", "addedSugar"];
  const availableDomainKeys = Object.keys(domainScores).filter((key) => domainScores[key] !== null);
  const foodComplete = foodDomainKeys.every((key) => domainScores[key] !== null);
  const foodScore = foodComplete
    ? roundedPercent(foodDomainKeys.reduce((sum, key) => sum + domainScores[key], 0) / foodDomainKeys.length)
    : null;

  return {
    score: foodScore,
    foodScore,
    domainScores,
    foodComplete,
    behaviorComparable: availableDomainKeys.length >= 5,
    availableDomainCount: availableDomainKeys.length,
    complete: activeQuestions.length > 0 && unansweredQuestionIds.length === 0,
    answeredCount: expectedQuestionIds.length - unansweredQuestionIds.length,
    questionCount: expectedQuestionIds.length,
    unansweredQuestionIds
  };
}

function clinicEvaluationResponseScore(response = {}, questions = [], options = {}) {
  const scoringQuestions = questions.length
    ? questions
    : response.instrumentId === clinicHealthInstrument.id
      ? clinicHealthQuestionDefinitions
      : response.instrumentId === legacyClinicKnowledgeInstrument.id
        ? legacyClinicKnowledgeQuestionDefinitions
        : clinicKnowledgeQuestionDefinitions;
  if (response.instrumentId === legacyClinicKnowledgeInstrument.id) {
    return legacyClinicKnowledgeResponseScore(response, scoringQuestions);
  }
  if (response.instrumentId === clinicKnowledgeInstrument.id) {
    return clinicKnowledgeResponseScore(response, scoringQuestions);
  }
  if (response.instrumentId === clinicHealthInstrument.id) {
    return clinicHealthResponseScore(response, scoringQuestions, options);
  }
  return null;
}

function clinicEvaluationResponseValidationError(response = {}, instrument, questions = [], options = {}) {
  if (!instrument) return "Choose an existing evaluation instrument version.";
  if (!instrument.administrationPoints.includes(response.administrationPoint)) {
    return "Choose an administration point supported by this instrument.";
  }
  if (response.status !== "Complete") return "";
  const result = clinicEvaluationResponseScore(response, questions, options);
  if (!result) return "";
  if (!result.complete) {
    const count = result.unansweredQuestionIds.length;
    return `Answer all ${result.questionCount} questions before completing this form (${count} remaining).`;
  }
  return "";
}

function clinicKnowledgeResponseValidationError(response = {}, instrument = clinicKnowledgeInstrument, questions = clinicKnowledgeQuestionDefinitions) {
  return clinicEvaluationResponseValidationError(response, instrument, questions);
}

function responseSortKey(response = {}) {
  return `${response.responseDate || ""}|${response.updatedAt || response.createdAt || ""}|${response.id || ""}`;
}

function clinicKnowledgeGainForPeriod(
  responses = [],
  questions = [...legacyClinicKnowledgeQuestionDefinitions, ...clinicKnowledgeQuestionDefinitions],
  startDate = "",
  endDate = ""
) {
  const gainsByClient = new Map();
  responses
    .filter((response) => (
      response.instrumentId === clinicKnowledgeInstrument.id
      && response.status === "Complete"
      && response.clientId
      && (!startDate || response.responseDate >= startDate)
      && (!endDate || response.responseDate <= endDate)
    ))
    .forEach((response) => {
      const result = clinicKnowledgeResponseScore(response, questions);
      if (result.gain === null) return;
      const current = gainsByClient.get(response.clientId);
      if (!current || responseSortKey(response) > responseSortKey(current.response)) {
        gainsByClient.set(response.clientId, { response, gain: result.gain, design: "Retrospective" });
      }
    });

  const latestLegacyByClientAndPoint = new Map();
  responses
    .filter((response) => response.instrumentId === legacyClinicKnowledgeInstrument.id && response.status === "Complete")
    .forEach((response) => {
      const result = legacyClinicKnowledgeResponseScore(response, questions);
      if (result.score === null || !response.clientId) return;
      const key = `${response.clientId}|${response.administrationPoint}`;
      const current = latestLegacyByClientAndPoint.get(key);
      if (!current || responseSortKey(response) > responseSortKey(current.response)) {
        latestLegacyByClientAndPoint.set(key, { response, score: result.score });
      }
    });
  latestLegacyByClientAndPoint.forEach((graduation, key) => {
    if (!key.endsWith("|Graduation")) return;
    if (startDate && graduation.response.responseDate < startDate) return;
    if (endDate && graduation.response.responseDate > endDate) return;
    const clientId = key.slice(0, -"|Graduation".length);
    if (gainsByClient.has(clientId)) return;
    const enrollment = latestLegacyByClientAndPoint.get(`${clientId}|Enrollment`);
    if (!enrollment) return;
    gainsByClient.set(clientId, {
      response: graduation.response,
      gain: roundedPercent(graduation.score - enrollment.score),
      design: "Legacy Prospective"
    });
  });

  const gains = [...gainsByClient.values()].map((item) => item.gain);
  return {
    value: gains.length ? roundedPercent(gains.reduce((sum, value) => sum + value, 0) / gains.length) : null,
    matchedChildCount: gains.length
  };
}

function clinicHealthChangeForPeriod(
  responses = [],
  questions = clinicHealthQuestionDefinitions,
  clients = [],
  startDate = "",
  endDate = ""
) {
  const clientsById = new Map(clients.map((client) => [client.id, client]));
  const latestByClientAndPoint = new Map();
  responses
    .filter((response) => response.instrumentId === clinicHealthInstrument.id && response.status === "Complete")
    .forEach((response) => {
      if (!response.clientId) return;
      const key = `${response.clientId}|${response.administrationPoint}`;
      const current = latestByClientAndPoint.get(key);
      if (!current || responseSortKey(response) > responseSortKey(current)) latestByClientAndPoint.set(key, response);
    });

  let behaviorEligibleCount = 0;
  let behaviorImprovedCount = 0;
  const foodChanges = [];
  latestByClientAndPoint.forEach((graduation, key) => {
    if (!key.endsWith("|Graduation")) return;
    if (startDate && graduation.responseDate < startDate) return;
    if (endDate && graduation.responseDate > endDate) return;
    const clientId = key.slice(0, -"|Graduation".length);
    const enrollment = latestByClientAndPoint.get(`${clientId}|Enrollment`);
    if (!enrollment) return;
    const dateOfBirth = graduation.clientBirthdate || enrollment.clientBirthdate || clientsById.get(clientId)?.dateOfBirth || "";
    const enrollmentScore = clinicHealthResponseScore(enrollment, questions, { dateOfBirth });
    const graduationScore = clinicHealthResponseScore(graduation, questions, { dateOfBirth });
    const comparableDomainKeys = Object.keys(enrollmentScore.domainScores).filter((domain) => (
      enrollmentScore.domainScores[domain] !== null && graduationScore.domainScores[domain] !== null
    ));
    if (comparableDomainKeys.length >= 5) {
      behaviorEligibleCount += 1;
      if (comparableDomainKeys.some((domain) => graduationScore.domainScores[domain] > enrollmentScore.domainScores[domain])) {
        behaviorImprovedCount += 1;
      }
    }
    if (enrollmentScore.foodComplete && graduationScore.foodComplete) {
      foodChanges.push(graduationScore.foodScore - enrollmentScore.foodScore);
    }
  });

  return {
    behaviorChangeValue: behaviorEligibleCount
      ? roundedPercent((behaviorImprovedCount / behaviorEligibleCount) * 100)
      : null,
    behaviorEligibleCount,
    behaviorImprovedCount,
    guidelineImprovementValue: foodChanges.length
      ? roundedPercent(foodChanges.reduce((sum, value) => sum + value, 0) / foodChanges.length)
      : null,
    guidelineMatchedChildCount: foodChanges.length
  };
}

function clinicFeedbackSummaryForPeriod(
  responses = [],
  questions = [
    ...legacyClinicChildFeedbackQuestionDefinitions,
    ...clinicChildFeedbackQuestionDefinitions,
    ...legacyClinicCaregiverFeedbackQuestionDefinitions,
    ...clinicCaregiverFeedbackQuestionDefinitions
  ],
  startDate = "",
  endDate = ""
) {
  const feedbackInstrumentIds = new Set([
    legacyClinicChildFeedbackInstrument.id,
    clinicChildFeedbackInstrument.id,
    legacyClinicCaregiverFeedbackInstrument.id,
    clinicCaregiverFeedbackInstrument.id
  ]);
  const satisfactionQuestionIds = new Set(questions
    .filter((question) => (
      feedbackInstrumentIds.has(question.instrumentId)
      && question.metricKeys?.includes("clinic.participant-satisfaction")
    ))
    .map((question) => question.id));
  const ratings = responses
    .filter((response) => (
      feedbackInstrumentIds.has(response.instrumentId)
      && response.status === "Complete"
      && (!startDate || response.responseDate >= startDate)
      && (!endDate || response.responseDate <= endDate)
    ))
    .flatMap((response) => (response.answers || [])
      .filter((answer) => satisfactionQuestionIds.has(answer.questionId))
      .map((answer) => ({
        value: Number(answer.value),
        positiveMinimum: [
          legacyClinicChildFeedbackInstrument.id,
          legacyClinicCaregiverFeedbackInstrument.id
        ].includes(response.instrumentId) ? 4 : 3
      })))
    .filter(({ value }) => Number.isInteger(value) && value >= 0 && value <= 5);

  return {
    participantSatisfactionValue: ratings.length
      ? roundedPercent((ratings.filter(({ value, positiveMinimum }) => value >= positiveMinimum).length / ratings.length) * 100)
      : null,
    respondentCount: ratings.length
  };
}

export {
  clinicCaregiverFeedbackInstrument,
  clinicCaregiverFeedbackQuestionDefinitions,
  clinicChildFeedbackInstrument,
  clinicChildFeedbackQuestionDefinitions,
  clinicEnrollmentInstrument,
  clinicEnrollmentQuestionDefinitions,
  clinicEvaluationResponseScore,
  clinicEvaluationResponseValidationError,
  clinicFeedbackSummaryForPeriod,
  clinicHealthChangeForPeriod,
  clinicHealthInstrument,
  clinicHealthQuestionDefinitions,
  clinicHealthResponseScore,
  clinicKnowledgeGainForPeriod,
  clinicKnowledgeInstrument,
  clinicKnowledgeLessons,
  clinicKnowledgeQuestionDefinitions,
  clinicKnowledgeResponseScore,
  clinicKnowledgeResponseValidationError,
  clinicHrsnScreenerInstrument,
  clinicHrsnScreenerQuestionDefinitions,
  legacyClinicCaregiverFeedbackInstrument,
  legacyClinicCaregiverFeedbackQuestionDefinitions,
  legacyClinicChildFeedbackInstrument,
  legacyClinicChildFeedbackQuestionDefinitions,
  legacyClinicHrsnScreenerInstrument,
  legacyClinicHrsnScreenerQuestionDefinitions,
  legacyClinicKnowledgeInstrument,
  legacyClinicKnowledgeQuestionDefinitions,
  legacyClinicKnowledgeResponseScore,
  mergeClinicEvaluationInstruments,
  mergeClinicEvaluationQuestions
};
