import type { AppointmentStatus } from "./appointment.type";

export type ScheduleStatus = "DRAFT" | "PUBLISHED";

export interface ScheduleAppointment {
  id: string;
  status: AppointmentStatus;
  joiningTime: string | null;
  serialNumber: number | null;
  patient: {
    id: string;
    name: string;
    email: string;
    contactNumber: string | null;
  };
}

export interface Schedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  totalSlots: number;
  availableSlots: number;
  meetingLink: string;
  status: ScheduleStatus;
  doctorId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  /**
   * Only the list, admin and detail endpoints include appointments. Create,
   * update, publish, delete and today's-schedule responses omit them entirely,
   * so this stays optional.
   */
  appointments?: ScheduleAppointment[];
}

export interface CreateSchedulePayload {
  startDateTime: string;
  endDateTime: string;
  meetingLink: string;
}

/**
 * Mirrors SCHEDULE_SORTABLE_FIELDS in Healthcare-Backend/src/app/utils/sort.ts.
 *
 * A value outside it is a 400 from `parseSort`, so this union is the only
 * enforcement — the backend does no validation of its own here.
 */
export type ScheduleSortField =
  | "createdAt"
  | "updatedAt"
  | "startDateTime"
  | "endDateTime"
  | "totalSlots"
  | "availableSlots"
  | "status";

export interface ScheduleParams {
  status?: ScheduleStatus;
  page?: number;
  limit?: number;
  sortBy?: ScheduleSortField;
  sortOrder?: "desc" | "asc";
}

/**
 * The patient row on `GET /schedule/all-schedules` and `GET /schedule/:scheduleId`.
 *
 * Wider than the `patient` inside `ScheduleAppointment`: these two endpoints
 * select the whole patient model, so `address` and the deletion fields come
 * along. The doctor's own `my-schedules` list only selects four fields, which is
 * why the two are separate types rather than one with optional extras.
 */
export interface ScheduleDetailPatient {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  address: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

/** An appointment inside a schedule, with its full patient row. */
export interface ScheduleDetailAppointment {
  id: string;
  status: AppointmentStatus;
  joiningTime: string | null;
  serialNumber: number | null;
  recordUrl: string | null;
  recordPublicId: string | null;
  prescriptionUrl: string | null;
  prescriptionPublicId: string | null;
  createdAt: string;
  updatedAt: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  patient: ScheduleDetailPatient;
}

/**
 * A schedule together with its appointments. Always present on the admin list and
 * the single-schedule detail; optional on `Schedule` because the create, update,
 * publish, delete and today's-schedule responses omit the relation entirely.
 */
export interface ScheduleWithAppointments extends Schedule {
  appointments: ScheduleDetailAppointment[];
}

/**
 * One row of `GET /schedule/all-schedules`.
 *
 * `appointments` is **not** filtered by the backend — PENDING, CANCELLED,
 * ONGOING and COMPLETED all appear. Any filtering has to be client-side, or the
 * row count will not match the appointment count shown beside it.
 */
export interface AllScheduleItem extends ScheduleWithAppointments {}

/** Response of `GET /schedule/:scheduleId`. */
export interface ScheduleDetail extends ScheduleWithAppointments {
  /**
   * A fourth distinct doctor projection: `{id, name, email, specialization,
   * userId}`, with no contact number.
   */
  doctor: {
    id: string;
    name: string;
    email: string;
    specialization: string;
    userId: string;
  };
}

/**
 * Response of `POST /schedule/create-schedule`.
 *
 * Was typed as a bare `Schedule`, which understated the payload: the backend also
 * returns a doctor summary.
 */
export interface CreatedSchedule extends Schedule {
  doctor: {
    name: string;
    email: string;
    contactNumber: string | null;
    bio: string | null;
    consultationFee: string | null;
    experienceYears: number;
  };
}

/**
 * Response of `PATCH /schedule/update-schedule/:scheduleId`.
 *
 * A third doctor projection — the same three fields as create but **no** bio,
 * fee or experience years.
 */
export interface UpdatedSchedule extends Schedule {
  doctor: {
    name: string;
    email: string;
    contactNumber: string | null;
  };
}

/**
 * Body of `PATCH /schedule/update-schedule/:scheduleId`.
 *
 * Every field is optional; an empty object is a valid no-op because the service
 * back-fills all three from the existing row.
 *
 * Note the server recomputes `totalSlots` from the window and **resets**
 * `availableSlots = totalSlots`, so an edit to a schedule that already has
 * bookings silently refills it.
 */
export interface UpdateSchedulePayload {
  startDateTime?: string;
  endDateTime?: string;
  meetingLink?: string;
}

/**
 * Query params for `GET /schedule/all-schedules`.
 *
 * The doctor-email filter here is named `email`, not `doctorEmail` as it is on
 * `GET /appointment/all-appointments`, and it is an **exact** match. Only
 * `searchTerm` is case-insensitive here: `contains` across the doctor's name,
 * email and specialization.
 */
export interface AllSchedulesParams {
  page?: number;
  limit?: number;
  doctorId?: string;
  email?: string;
  status?: ScheduleStatus;
  searchTerm?: string;
  sortBy?: ScheduleSortField;
  sortOrder?: "desc" | "asc";
}
