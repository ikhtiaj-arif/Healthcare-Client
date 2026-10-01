import type { Schedule } from "./schedule.types";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "ONGOING"
  | "COMPLETED";

export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface Payment {
  id: string;
  status: PaymentStatus;
  amount: number | string;
  currency: string;
  bkashPaymentId?: string | null;
  bkashTrxId?: string | null;
  payerReference?: string | null;
  paidAt?: string | null;
  refundTrxId?: string | null;
  refundAmount?: number | string | null;
  refundReason?: string | null;
  refundedAt?: string | null;
  appointmentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentDoctor {
  id: string;
  name: string;
  specialization: string;
  email?: string;
  userId?: string;
}

export interface AppointmentPatient {
  id: string;
  name: string;
  email: string;
  contactNumber?: string | null;
  userId?: string;
}

export interface Appointment {
  id: string;
  status: AppointmentStatus;
  joiningTime?: string | null;
  serialNumber?: number | null;
  recordUrl?: string | null;
  prescriptionUrl?: string | null;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  createdAt: string;
  updatedAt: string;
  patient?: AppointmentPatient;
  doctor?: AppointmentDoctor;
  schedule?: Schedule;
  payment?: Payment | null;
}

export interface AppointmentParams {
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
  sortBy?: AppointmentSortField;
  sortOrder?: "desc" | "asc";
}

/**
 * The `sortBy` allow-list shared by every appointment list.
 *
 * Mirrors `APPOINTMENT_SORTABLE_FIELDS` in the backend's `src/app/utils/sort.ts`.
 * A value outside it is a 400 from `parseSort`, not a silent fallback, so this
 * union is the only thing standing between a typo and a failed request — the
 * server does no enum validation of its own here.
 *
 * Was a private type inside `appointment-list.tsx`, which the admin and doctor
 * lists would each have had to copy.
 */
export type AppointmentSortField =
  | "createdAt"
  | "updatedAt"
  | "status"
  | "joiningTime"
  | "serialNumber";

export interface BookAppointmentPayload {
  scheduleId: string;
}

export interface PayAppointmentPayload {
  appointmentId: string;
}

export interface CancelAppointmentPayload {
  appointmentId: string;
  /**
   * Mirrors CancelAppointmentValidationZodSchema on the backend, which trims and
   * requires 3-500 characters. It was missing here, so a cancel built from this
   * type could not be sent.
   */
  refundReason: string;
}

/** `pay-appointment` hands back a bKash URL to send the browser to. */
export interface PayAppointmentResponse {
  paymentUrl: string;
}

/**
 * `cancel-appointment` returns the updated appointment and the payment row it
 * touched. `payment` is null when the appointment was never paid, and carries a
 * REFUNDED row when the cancellation happened more than an hour before the
 * scheduled start, which is the backend's refund cut-off.
 */
export interface CancelAppointmentResponse {
  appointment: Appointment;
  payment: Payment | null;
}

export interface BookAppointmentResponse {
  paymentUrl: string;
}

/**
 * Pairs the bKash payment URL with the schedule it was booked against, so the
 * confirmation dialog can show both without a second lookup.
 */
export interface BookingConfirmation {
  paymentUrl: string;
  schedule: Schedule;
}

/**
 * The patient projection on `GET /appointment/doctor-appointments`.
 *
 * This endpoint includes the contact number; the admin list below does not, so
 * the field is promoted from optional to required only here.
 */
export interface DoctorAppointmentPatient extends AppointmentPatient {
  contactNumber: string | null;
}

/**
 * One row of `GET /appointment/doctor-appointments` — the signed-in doctor's
 * own bookings.
 *
 * Carries the patient but **no** doctor relation: the caller *is* the doctor, so
 * the backend does not select it back. That is the mirror image of the admin
 * list, which carries the doctor but no contact number.
 */
export interface DoctorAppointment extends Appointment {
  patient: DoctorAppointmentPatient;
  schedule: Schedule;
  payment: Payment | null;
}

/** One row of `GET /appointment/all-appointments` — the platform-wide admin list. */
export interface AllAppointment extends Appointment {
  patient: AppointmentPatient;
  doctor: AppointmentDoctor;
  schedule: Schedule;
  payment: Payment | null;
}

/** Query params for `GET /appointment/doctor-appointments`. */
export interface DoctorAppointmentsParams {
  status?: AppointmentStatus;
  page?: number;
  limit?: number;
  sortBy?: AppointmentSortField;
  sortOrder?: "desc" | "asc";
}

/**
 * Query params for `GET /appointment/all-appointments`.
 *
 * The email filters are **exact and case-sensitive** here, because the backend
 * passes them straight to Prisma `equals` with no `mode: "insensitive"`. This is
 * not the same as `patientEmail` on `GET /payment/all-payments`, which is a
 * `contains` + `insensitive` substring match — so the two are deliberately not
 * unified behind one shared param type.
 */
export interface AllAppointmentsParams extends DoctorAppointmentsParams {
  doctorId?: string;
  patientId?: string;
  doctorEmail?: string;
  patientEmail?: string;
}

/**
 * Body of `PATCH /appointment/update-status/:appointmentId`.
 *
 * Only ONGOING and COMPLETED are accepted; the backend rejects anything else with
 * `"Status Must Be Either ONGOING Or COMPLETED"`.
 */
export interface UpdateAppointmentStatusPayload {
  status: "ONGOING" | "COMPLETED";
}
