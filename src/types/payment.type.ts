import type {
  AppointmentStatus,
  Payment,
  PaymentStatus,
} from "./appointment.type";

/**
 * The slice of the appointment that comes back with a payment.
 *
 * The backend selects it per endpoint, so this is deliberately narrower than
 * the full `Appointment`: `my-payments` returns doctor plus schedule, and the
 * single-payment endpoint adds the patient. Anything not selected is `undefined`
 * at runtime rather than null, so the optional markers here are load-bearing.
 */
export interface PaymentAppointmentSummary {
  id: string;
  status?: AppointmentStatus;
  joiningTime?: string | null;
  serialNumber?: number | null;
  doctor?: {
    id: string;
    name: string;
    specialization: string;
  } | null;
  schedule?: {
    id: string;
    startDateTime: string;
    endDateTime: string;
    meetingLink?: string | null;
  } | null;
  patient?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

/** A row in the patient's payment history. */
export interface PaymentListItem extends Payment {
  appointment?: PaymentAppointmentSummary | null;
}

/** The single-payment endpoint, which also includes the patient. */
export interface PaymentDetail extends Payment {
  appointment?: PaymentAppointmentSummary | null;
}

/**
 * The backend has no status filter on `my-payments`, only paging and sorting, so
 * this has no `status`. Sortable fields mirror PAYMENT_SORTABLE_FIELDS in
 * Healthcare-Backend/src/app/utils/sort.ts.
 */
export interface PaymentParams {
  page?: number;
  limit?: number;
  sortBy?: PaymentSortField;
  sortOrder?: "asc" | "desc";
}

export type PaymentSortField =
  | "createdAt"
  | "updatedAt"
  | "status"
  | "amount"
  | "currency"
  | "paidAt"
  | "refundAmount";
