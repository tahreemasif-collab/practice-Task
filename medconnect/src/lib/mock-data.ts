// All data in this module is fabricated for UI demonstration purposes only.
// No real patient records, no network calls, no live integrations.

export type Discipline = "GP" | "Dental" | "Physio";
export type RiskLevel = "low" | "medium" | "high";
export type ReminderStatus = "sent" | "pending" | "confirmed" | "failed" | "no-response";
export type ApptStatus = "booked" | "arrived" | "in-consultation" | "completed" | "dna" | "cancelled";

export interface Clinician {
  id: string;
  name: string;
  role: string;
  discipline: Discipline;
  initials: string;
  room: string;
}

export interface Patient {
  id: string;
  nhsNumber: string;
  name: string;
  dob: string;
  age: number;
  sex: "Female" | "Male";
  phone: string;
  email: string;
  address: string;
  postcode: string;
  gpSurgery: string;
  registered: string;
  discipline: Discipline;
  risk: RiskLevel;
  flags: string[];
  conditions: string[];
  allergies: string[];
  medications: { name: string; dose: string; frequency: string; lastIssued: string }[];
  lastSeen: string;
  nextAppointment: string | null;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  clinicianId: string;
  discipline: Discipline;
  date: string;
  start: string;
  durationMins: number;
  type: string;
  mode: "In person" | "Video" | "Telephone";
  status: ApptStatus;
  noShowRisk: number;
  reminder: ReminderStatus;
  notes: string;
}

export const practice = {
  name: "Ashgrove Health Group",
  odsCode: "P81234",
  address: "14 Ashgrove Lane, Leeds LS6 2QT",
  disciplines: ["GP", "Dental", "Physio"] as Discipline[],
  listSize: 9412,
};

export const clinicians: Clinician[] = [
  { id: "c1", name: "Dr Amara Nwosu", role: "GP Partner", discipline: "GP", initials: "AN", room: "Consulting 1" },
  { id: "c2", name: "Dr Ravi Chandra", role: "Salaried GP", discipline: "GP", initials: "RC", room: "Consulting 2" },
  { id: "c3", name: "Nurse Bethan Price", role: "Practice Nurse", discipline: "GP", initials: "BP", room: "Treatment A" },
  { id: "c4", name: "Mr Owen Hartley", role: "Dentist", discipline: "Dental", initials: "OH", room: "Surgery 1" },
  { id: "c5", name: "Ms Ines Duarte", role: "Dental Hygienist", discipline: "Dental", initials: "ID", room: "Surgery 2" },
  { id: "c6", name: "Ms Kirsty Lomax", role: "Physiotherapist", discipline: "Physio", initials: "KL", room: "Gym Studio" },
  { id: "c7", name: "Mr Dev Patel", role: "MSK Physio", discipline: "Physio", initials: "DP", room: "Studio 2" },
];

export const patients: Patient[] = [
  {
    id: "p1",
    nhsNumber: "443 812 5591",
    name: "Margaret Ellison",
    dob: "1948-03-11",
    age: 78,
    sex: "Female",
    phone: "07700 900112",
    email: "m.ellison@example.co.uk",
    address: "22 Kirkstall Road",
    postcode: "LS4 2AB",
    gpSurgery: "Ashgrove Health Group",
    registered: "1998-06-02",
    discipline: "GP",
    risk: "high",
    flags: ["Housebound", "Carer present", "Frailty score 6"],
    conditions: ["Type 2 diabetes", "Atrial fibrillation", "Osteoarthritis"],
    allergies: ["Penicillin", "Codeine"],
    medications: [
      { name: "Metformin", dose: "500 mg", frequency: "Twice daily", lastIssued: "2026-07-28" },
      { name: "Apixaban", dose: "5 mg", frequency: "Twice daily", lastIssued: "2026-08-02" },
      { name: "Atorvastatin", dose: "20 mg", frequency: "Nightly", lastIssued: "2026-07-14" },
    ],
    lastSeen: "2026-08-04",
    nextAppointment: "2026-08-21 09:20",
  },
  {
    id: "p2",
    nhsNumber: "512 660 3184",
    name: "Tomasz Kaminski",
    dob: "1991-11-24",
    age: 34,
    sex: "Male",
    phone: "07700 900338",
    email: "t.kaminski@example.co.uk",
    address: "8 Headingley Mount",
    postcode: "LS6 3EL",
    gpSurgery: "Ashgrove Health Group",
    registered: "2016-09-19",
    discipline: "Physio",
    risk: "medium",
    flags: ["Interpreter offered (Polish)"],
    conditions: ["Lumbar disc prolapse"],
    allergies: ["None recorded"],
    medications: [{ name: "Naproxen", dose: "250 mg", frequency: "As required", lastIssued: "2026-08-11" }],
    lastSeen: "2026-08-11",
    nextAppointment: "2026-08-21 11:00",
  },
  {
    id: "p3",
    nhsNumber: "607 221 4478",
    name: "Aisha Rahman",
    dob: "2019-04-30",
    age: 7,
    sex: "Female",
    phone: "07700 900771",
    email: "parent.rahman@example.co.uk",
    address: "3 Burley Grove",
    postcode: "LS4 2QT",
    gpSurgery: "Ashgrove Health Group",
    registered: "2019-05-20",
    discipline: "Dental",
    risk: "low",
    flags: ["Paediatric", "Parental consent on file"],
    conditions: ["Mild asthma"],
    allergies: ["None recorded"],
    medications: [{ name: "Salbutamol inhaler", dose: "100 mcg", frequency: "As required", lastIssued: "2026-06-30" }],
    lastSeen: "2026-02-18",
    nextAppointment: "2026-08-21 14:40",
  },
  {
    id: "p4",
    nhsNumber: "298 774 1052",
    name: "Derek Ainsworth",
    dob: "1962-01-08",
    age: 64,
    sex: "Male",
    phone: "07700 900254",
    email: "d.ainsworth@example.co.uk",
    address: "41 Meanwood Road",
    postcode: "LS7 2BX",
    gpSurgery: "Ashgrove Health Group",
    registered: "2004-03-15",
    discipline: "GP",
    risk: "high",
    flags: ["3 missed appointments in 12 months", "Prefers SMS"],
    conditions: ["COPD", "Hypertension"],
    allergies: ["Ibuprofen"],
    medications: [
      { name: "Tiotropium", dose: "18 mcg", frequency: "Once daily", lastIssued: "2026-08-01" },
      { name: "Amlodipine", dose: "5 mg", frequency: "Once daily", lastIssued: "2026-07-19" },
    ],
    lastSeen: "2026-06-22",
    nextAppointment: "2026-08-21 10:10",
  },
  {
    id: "p5",
    nhsNumber: "731 095 6620",
    name: "Priya Venkatesan",
    dob: "1985-07-19",
    age: 41,
    sex: "Female",
    phone: "07700 900487",
    email: "p.venkatesan@example.co.uk",
    address: "12 Cardigan Lane",
    postcode: "LS6 1LJ",
    gpSurgery: "Ashgrove Health Group",
    registered: "2011-01-11",
    discipline: "GP",
    risk: "low",
    flags: ["Pregnancy — 22 weeks"],
    conditions: ["Iron deficiency anaemia"],
    allergies: ["Latex"],
    medications: [{ name: "Ferrous fumarate", dose: "210 mg", frequency: "Twice daily", lastIssued: "2026-08-09" }],
    lastSeen: "2026-08-09",
    nextAppointment: "2026-08-21 09:40",
  },
  {
    id: "p6",
    nhsNumber: "184 552 9037",
    name: "Callum Fraser",
    dob: "2003-09-02",
    age: 22,
    sex: "Male",
    phone: "07700 900620",
    email: "c.fraser@example.co.uk",
    address: "77 Woodhouse Street",
    postcode: "LS6 2PH",
    gpSurgery: "Ashgrove Health Group",
    registered: "2021-10-04",
    discipline: "Physio",
    risk: "medium",
    flags: ["Student", "Mobile number unverified"],
    conditions: ["ACL reconstruction — post-op week 9"],
    allergies: ["None recorded"],
    medications: [],
    lastSeen: "2026-08-14",
    nextAppointment: "2026-08-21 15:20",
  },
  {
    id: "p7",
    nhsNumber: "922 408 7731",
    name: "Eleanor Whitcombe",
    dob: "1976-12-05",
    age: 49,
    sex: "Female",
    phone: "07700 900945",
    email: "e.whitcombe@example.co.uk",
    address: "5 Hyde Park Terrace",
    postcode: "LS6 1BJ",
    gpSurgery: "Ashgrove Health Group",
    registered: "2008-08-27",
    discipline: "Dental",
    risk: "low",
    flags: ["Nervous patient — extra time"],
    conditions: ["Bruxism"],
    allergies: ["Adhesive plasters"],
    medications: [],
    lastSeen: "2026-05-30",
    nextAppointment: "2026-08-21 13:20",
  },
  {
    id: "p8",
    nhsNumber: "356 118 2249",
    name: "Joseph Mbeki",
    dob: "1955-05-16",
    age: 71,
    sex: "Male",
    phone: "07700 900018",
    email: "j.mbeki@example.co.uk",
    address: "19 Brudenell Avenue",
    postcode: "LS6 1HQ",
    gpSurgery: "Ashgrove Health Group",
    registered: "1994-11-30",
    discipline: "GP",
    risk: "medium",
    flags: ["Shielding history", "Hearing loss — telephone unsuitable"],
    conditions: ["Chronic kidney disease stage 3", "Gout"],
    allergies: ["Sulfonamides"],
    medications: [
      { name: "Allopurinol", dose: "100 mg", frequency: "Once daily", lastIssued: "2026-07-25" },
      { name: "Ramipril", dose: "2.5 mg", frequency: "Once daily", lastIssued: "2026-08-06" },
    ],
    lastSeen: "2026-07-30",
    nextAppointment: null,
  },
];

export const appointments: Appointment[] = [
  { id: "a1", patientId: "p1", patientName: "Margaret Ellison", clinicianId: "c1", discipline: "GP", date: "2026-08-21", start: "09:20", durationMins: 20, type: "Diabetic review", mode: "In person", status: "arrived", noShowRisk: 71, reminder: "confirmed", notes: "Bring blood glucose diary. Carer attending." },
  { id: "a2", patientId: "p5", patientName: "Priya Venkatesan", clinicianId: "c1", discipline: "GP", date: "2026-08-21", start: "09:40", durationMins: 15, type: "Antenatal check", mode: "In person", status: "booked", noShowRisk: 12, reminder: "confirmed", notes: "Midwife notes attached." },
  { id: "a3", patientId: "p4", patientName: "Derek Ainsworth", clinicianId: "c2", discipline: "GP", date: "2026-08-21", start: "10:10", durationMins: 20, type: "COPD annual review", mode: "Telephone", status: "booked", noShowRisk: 88, reminder: "no-response", notes: "Two prior DNAs. Consider text-and-call escalation." },
  { id: "a4", patientId: "p2", patientName: "Tomasz Kaminski", clinicianId: "c6", discipline: "Physio", date: "2026-08-21", start: "11:00", durationMins: 30, type: "Lower back follow-up", mode: "Video", status: "booked", noShowRisk: 44, reminder: "sent", notes: "Interpreter link offered in reminder." },
  { id: "a5", patientId: "p8", patientName: "Joseph Mbeki", clinicianId: "c3", discipline: "GP", date: "2026-08-21", start: "11:30", durationMins: 15, type: "Bloods — CKD monitoring", mode: "In person", status: "booked", noShowRisk: 33, reminder: "pending", notes: "Do not phone — hearing loss. SMS only." },
  { id: "a6", patientId: "p7", patientName: "Eleanor Whitcombe", clinicianId: "c4", discipline: "Dental", date: "2026-08-21", start: "13:20", durationMins: 40, type: "Crown fit", mode: "In person", status: "booked", noShowRisk: 18, reminder: "confirmed", notes: "Nervous patient — longer slot booked." },
  { id: "a7", patientId: "p3", patientName: "Aisha Rahman", clinicianId: "c5", discipline: "Dental", date: "2026-08-21", start: "14:40", durationMins: 20, type: "Fluoride varnish", mode: "In person", status: "booked", noShowRisk: 26, reminder: "sent", notes: "Parent consent recorded 12 Aug." },
  { id: "a8", patientId: "p6", patientName: "Callum Fraser", clinicianId: "c7", discipline: "Physio", date: "2026-08-21", start: "15:20", durationMins: 30, type: "ACL rehab week 9", mode: "Video", status: "booked", noShowRisk: 62, reminder: "failed", notes: "SMS bounced — mobile unverified." },
  { id: "a9", patientId: "p1", patientName: "Margaret Ellison", clinicianId: "c3", discipline: "GP", date: "2026-08-21", start: "16:00", durationMins: 15, type: "Blood pressure check", mode: "In person", status: "booked", noShowRisk: 39, reminder: "sent", notes: "Same-day double booking with 09:20 review." },
  { id: "a10", patientId: "p4", patientName: "Derek Ainsworth", clinicianId: "c2", discipline: "GP", date: "2026-08-20", start: "09:00", durationMins: 20, type: "Spirometry", mode: "In person", status: "dna", noShowRisk: 84, reminder: "no-response", notes: "Did not attend. Third in 12 months." },
  { id: "a11", patientId: "p6", patientName: "Callum Fraser", clinicianId: "c6", discipline: "Physio", date: "2026-08-20", start: "14:00", durationMins: 30, type: "Rehab progression", mode: "In person", status: "completed", noShowRisk: 55, reminder: "confirmed", notes: "Progressed to single-leg loading." },
  { id: "a12", patientId: "p2", patientName: "Tomasz Kaminski", clinicianId: "c7", discipline: "Physio", date: "2026-08-22", start: "10:30", durationMins: 30, type: "MSK reassessment", mode: "In person", status: "booked", noShowRisk: 30, reminder: "pending", notes: "" },
];

export const riskFactors = [
  { label: "Previous DNA history", weight: 34 },
  { label: "Booked more than 21 days ahead", weight: 22 },
  { label: "No reminder confirmation", weight: 19 },
  { label: "Monday morning slot", weight: 13 },
  { label: "Unverified contact number", weight: 12 },
];

export const weeklyAttendance = [
  { day: "Mon", attended: 132, dna: 14, cancelled: 8 },
  { day: "Tue", attended: 148, dna: 9, cancelled: 6 },
  { day: "Wed", attended: 141, dna: 11, cancelled: 7 },
  { day: "Thu", attended: 155, dna: 7, cancelled: 5 },
  { day: "Fri", attended: 138, dna: 12, cancelled: 9 },
  { day: "Sat", attended: 62, dna: 5, cancelled: 3 },
];

export const demandByDiscipline = [
  { month: "Mar", GP: 820, Dental: 310, Physio: 260 },
  { month: "Apr", GP: 795, Dental: 322, Physio: 288 },
  { month: "May", GP: 861, Dental: 341, Physio: 301 },
  { month: "Jun", GP: 904, Dental: 356, Physio: 318 },
  { month: "Jul", GP: 889, Dental: 372, Physio: 344 },
  { month: "Aug", GP: 932, Dental: 388, Physio: 361 },
];

export interface IntakeForm {
  id: string;
  title: string;
  discipline: Discipline;
  submittedBy: string;
  patientId: string;
  submittedAt: string;
  status: "awaiting-review" | "reviewed" | "action-needed" | "draft";
  completion: number;
  sections: number;
  flagged: string[];
}

export const intakeForms: IntakeForm[] = [
  { id: "f1", title: "New patient health questionnaire", discipline: "GP", submittedBy: "Priya Venkatesan", patientId: "p5", submittedAt: "2026-08-20 18:42", status: "awaiting-review", completion: 100, sections: 6, flagged: ["Pregnancy declared"] },
  { id: "f2", title: "MSK self-assessment", discipline: "Physio", submittedBy: "Tomasz Kaminski", patientId: "p2", submittedAt: "2026-08-20 20:15", status: "action-needed", completion: 100, sections: 5, flagged: ["Red flag: night pain", "Interpreter requested"] },
  { id: "f3", title: "Dental medical history update", discipline: "Dental", submittedBy: "Eleanor Whitcombe", patientId: "p7", submittedAt: "2026-08-19 09:03", status: "reviewed", completion: 100, sections: 4, flagged: [] },
  { id: "f4", title: "Paediatric consent & history", discipline: "Dental", submittedBy: "Parent of Aisha Rahman", patientId: "p3", submittedAt: "2026-08-18 16:20", status: "reviewed", completion: 100, sections: 5, flagged: ["Asthma declared"] },
  { id: "f5", title: "COPD annual review pre-questions", discipline: "GP", submittedBy: "Derek Ainsworth", patientId: "p4", submittedAt: "2026-08-17 11:55", status: "draft", completion: 40, sections: 5, flagged: ["Incomplete — 3 of 5 sections"] },
  { id: "f6", title: "Post-op rehab progress diary", discipline: "Physio", submittedBy: "Callum Fraser", patientId: "p6", submittedAt: "2026-08-16 21:30", status: "awaiting-review", completion: 100, sections: 3, flagged: [] },
];

export interface PrescriptionRequest {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  medication: string;
  dose: string;
  quantity: string;
  lastIssued: string;
  requestedAt: string;
  requesterChannel: "Patient app" | "Pharmacy" | "Reception";
  pharmacy: string;
  status: "pending" | "approved" | "declined" | "query";
  interactionWarnings: string[];
  overdueReview: boolean;
}

export const prescriptions: PrescriptionRequest[] = [
  { id: "rx1", patientId: "p1", patientName: "Margaret Ellison", age: 78, medication: "Apixaban", dose: "5 mg", quantity: "56 tablets", lastIssued: "2026-08-02", requestedAt: "2026-08-21 07:12", requesterChannel: "Patient app", pharmacy: "Ashgrove Pharmacy, LS6", status: "pending", interactionWarnings: ["Bleeding risk — check recent U&E", "Penicillin allergy recorded"], overdueReview: false },
  { id: "rx2", patientId: "p4", patientName: "Derek Ainsworth", age: 64, medication: "Tiotropium", dose: "18 mcg", quantity: "30 capsules", lastIssued: "2026-08-01", requestedAt: "2026-08-21 07:40", requesterChannel: "Pharmacy", pharmacy: "Boots, Headingley", status: "pending", interactionWarnings: [], overdueReview: true },
  { id: "rx3", patientId: "p8", patientName: "Joseph Mbeki", age: 71, medication: "Ramipril", dose: "2.5 mg", quantity: "28 tablets", lastIssued: "2026-08-06", requestedAt: "2026-08-20 16:05", requesterChannel: "Patient app", pharmacy: "Ashgrove Pharmacy, LS6", status: "query", interactionWarnings: ["CKD stage 3 — renal function due"], overdueReview: true },
  { id: "rx4", patientId: "p5", patientName: "Priya Venkatesan", age: 41, medication: "Ferrous fumarate", dose: "210 mg", quantity: "84 tablets", lastIssued: "2026-08-09", requestedAt: "2026-08-20 12:30", requesterChannel: "Patient app", pharmacy: "Well Pharmacy, Burley", status: "approved", interactionWarnings: [], overdueReview: false },
  { id: "rx5", patientId: "p2", patientName: "Tomasz Kaminski", age: 34, medication: "Naproxen", dose: "250 mg", quantity: "28 tablets", lastIssued: "2026-08-11", requestedAt: "2026-08-20 09:18", requesterChannel: "Reception", pharmacy: "Ashgrove Pharmacy, LS6", status: "pending", interactionWarnings: ["NSAID — gastroprotection not co-prescribed"], overdueReview: false },
  { id: "rx6", patientId: "p1", patientName: "Margaret Ellison", age: 78, medication: "Metformin", dose: "500 mg", quantity: "56 tablets", lastIssued: "2026-07-28", requestedAt: "2026-08-19 15:44", requesterChannel: "Patient app", pharmacy: "Ashgrove Pharmacy, LS6", status: "declined", interactionWarnings: ["HbA1c overdue — review before further issue"], overdueReview: true },
];

export interface RotaEntry {
  clinicianId: string;
  shifts: { day: string; label: string; kind: "clinic" | "admin" | "leave" | "on-call" | "off" }[];
}

export const rotaDays = ["Mon 24", "Tue 25", "Wed 26", "Thu 27", "Fri 28"];

export const rota: RotaEntry[] = [
  { clinicianId: "c1", shifts: [
    { day: "Mon 24", label: "08:00–17:00 Clinic", kind: "clinic" },
    { day: "Tue 25", label: "08:00–13:00 Clinic", kind: "clinic" },
    { day: "Wed 26", label: "Admin & referrals", kind: "admin" },
    { day: "Thu 27", label: "08:00–17:00 Clinic", kind: "clinic" },
    { day: "Fri 28", label: "Duty doctor", kind: "on-call" },
  ] },
  { clinicianId: "c2", shifts: [
    { day: "Mon 24", label: "Duty doctor", kind: "on-call" },
    { day: "Tue 25", label: "08:00–17:00 Clinic", kind: "clinic" },
    { day: "Wed 26", label: "08:00–17:00 Clinic", kind: "clinic" },
    { day: "Thu 27", label: "Annual leave", kind: "leave" },
    { day: "Fri 28", label: "Annual leave", kind: "leave" },
  ] },
  { clinicianId: "c3", shifts: [
    { day: "Mon 24", label: "08:30–16:30 Treatment", kind: "clinic" },
    { day: "Tue 25", label: "08:30–16:30 Treatment", kind: "clinic" },
    { day: "Wed 26", label: "Immunisation clinic", kind: "clinic" },
    { day: "Thu 27", label: "08:30–12:30 Treatment", kind: "clinic" },
    { day: "Fri 28", label: "Non-working day", kind: "off" },
  ] },
  { clinicianId: "c4", shifts: [
    { day: "Mon 24", label: "09:00–17:00 Surgery 1", kind: "clinic" },
    { day: "Tue 25", label: "09:00–17:00 Surgery 1", kind: "clinic" },
    { day: "Wed 26", label: "09:00–13:00 Surgery 1", kind: "clinic" },
    { day: "Thu 27", label: "Lab & admin", kind: "admin" },
    { day: "Fri 28", label: "09:00–17:00 Surgery 1", kind: "clinic" },
  ] },
  { clinicianId: "c5", shifts: [
    { day: "Mon 24", label: "Hygiene list", kind: "clinic" },
    { day: "Tue 25", label: "Non-working day", kind: "off" },
    { day: "Wed 26", label: "Hygiene list", kind: "clinic" },
    { day: "Thu 27", label: "Hygiene list", kind: "clinic" },
    { day: "Fri 28", label: "Paediatric clinic", kind: "clinic" },
  ] },
  { clinicianId: "c6", shifts: [
    { day: "Mon 24", label: "Gym rehab classes", kind: "clinic" },
    { day: "Tue 25", label: "1:1 caseload", kind: "clinic" },
    { day: "Wed 26", label: "1:1 caseload", kind: "clinic" },
    { day: "Thu 27", label: "Video clinic", kind: "clinic" },
    { day: "Fri 28", label: "Caseload admin", kind: "admin" },
  ] },
  { clinicianId: "c7", shifts: [
    { day: "Mon 24", label: "MSK triage", kind: "clinic" },
    { day: "Tue 25", label: "MSK triage", kind: "clinic" },
    { day: "Wed 26", label: "Study leave", kind: "leave" },
    { day: "Thu 27", label: "1:1 caseload", kind: "clinic" },
    { day: "Fri 28", label: "1:1 caseload", kind: "clinic" },
  ] },
];

export const staffPerformance = [
  { clinicianId: "c1", seen: 148, avgMins: 12.4, dnaRate: 4.1, satisfaction: 96, utilisation: 91 },
  { clinicianId: "c2", seen: 131, avgMins: 14.1, dnaRate: 6.8, satisfaction: 92, utilisation: 87 },
  { clinicianId: "c3", seen: 176, avgMins: 9.2, dnaRate: 3.4, satisfaction: 97, utilisation: 94 },
  { clinicianId: "c4", seen: 94, avgMins: 27.5, dnaRate: 5.2, satisfaction: 94, utilisation: 89 },
  { clinicianId: "c5", seen: 108, avgMins: 21.0, dnaRate: 4.7, satisfaction: 95, utilisation: 82 },
  { clinicianId: "c6", seen: 121, avgMins: 28.3, dnaRate: 7.9, satisfaction: 93, utilisation: 90 },
  { clinicianId: "c7", seen: 116, avgMins: 26.7, dnaRate: 8.6, satisfaction: 90, utilisation: 85 },
];

export const activityFeed = [
  { id: "n1", time: "07:12", text: "Repeat request received — Apixaban for Margaret Ellison", kind: "prescription" },
  { id: "n2", time: "07:40", text: "Pharmacy request — Tiotropium for Derek Ainsworth", kind: "prescription" },
  { id: "n3", time: "08:02", text: "SMS reminder delivery failed — Callum Fraser (unverified mobile)", kind: "reminder" },
  { id: "n4", time: "08:15", text: "Intake form flagged red — MSK self-assessment, Tomasz Kaminski", kind: "form" },
  { id: "n5", time: "08:31", text: "Margaret Ellison checked in at reception kiosk", kind: "arrival" },
  { id: "n6", time: "08:44", text: "Dr Chandra opened duty triage list (11 items)", kind: "triage" },
];

export const waitingRoom = [
  { patientId: "p2", patientName: "Tomasz Kaminski", appointmentId: "a4", waitingMins: 3, device: "iPhone · Safari", connection: "Good", consentRecorded: true },
  { patientId: "p6", patientName: "Callum Fraser", appointmentId: "a8", waitingMins: 11, device: "Windows · Chrome", connection: "Fair", consentRecorded: true },
];

export const riskBand = (score: number): RiskLevel => (score >= 65 ? "high" : score >= 35 ? "medium" : "low");

export const clinicianById = (id: string) => clinicians.find((c) => c.id === id);
export const patientById = (id: string) => patients.find((p) => p.id === id);
