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
  sortBy?: string;
  sortOrder?: "desc" | "asc";
}

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
