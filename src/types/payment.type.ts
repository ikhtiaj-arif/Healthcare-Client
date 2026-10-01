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

/**
 * A row in the admin list of every payment on the platform.
 *
 * An alias rather than a copy: `getAllPayments` selects the same relations as
 * `my-payments` — the appointment with its doctor and full schedule, and **no
 * patient** — so the shapes are identical. It keeps its own name because the two
 * endpoints differ in role and filters, and E2 should not quietly widen it by
 * assuming a patient relation is there.
 *
 * `gatewayResponse` is deliberately absent from `Payment`. The column is
 * `Json?` on the model and the query does not select it away, so it does arrive
 * on the wire holding the whole raw bKash payload — it is simply never declared,
 * which keeps it out of rendered detail views. Do not add it to satisfy a type
 * error; see E2.
 */
export type AllPaymentItem = PaymentListItem;

/**
 * Query params for `GET /payment/all-payments`.
 *
 * `patientEmail` is `contains` + `insensitive`, matched through the appointment
 * relation — not an exact match like `doctorEmail` is on the appointment admin
 * list.
 *
 * There is **no** `status` filter on this endpoint: the service reads only
 * `patientEmail`, so a status param would be silently ignored and the table
 * would look filtered while showing everything.
 */
export interface AllPaymentsParams {
  page?: number;
  limit?: number;
  patientEmail?: string;
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
