import apiClient from "@/lib/apiClient";
import type {
  AllAppointment,
  AllAppointmentsParams,
  ApiResponse,
  Appointment,
  AppointmentParams,
  BookAppointmentPayload,
  BookAppointmentResponse,
  CancelAppointmentPayload,
  CancelAppointmentResponse,
  DoctorAppointment,
  DoctorAppointmentsParams,
  PaginatedApiResponse,
  PaginatedData,
  PayAppointmentPayload,
  PayAppointmentResponse,
  UpdateAppointmentStatusPayload,
} from "@/types";

export async function bookAppointment(payload: BookAppointmentPayload) {
  const response = await apiClient<ApiResponse<BookAppointmentResponse>>(
    "/appointment/book-appointment",
    {
      method: "POST",
      body: payload,
    },
  );
  return response.data;
}

export async function getMyAppointments(
  params: AppointmentParams,
): Promise<PaginatedData<Appointment>> {
  const response = await apiClient<PaginatedApiResponse<Appointment>>(
    "/appointment/my-appointments",
    {
      params,
    },
  );
  return { data: response.data, meta: response.meta };
}

export async function getAppointmentById(
  appointmentId: string,
): Promise<Appointment> {
  const response = await apiClient<ApiResponse<Appointment>>(
    `/appointment/${appointmentId}`,
  );
  return response.data;
}

/**
 * Starts a bKash checkout for an appointment that is still PENDING.
 *
 * The backend answers with a `bkashURL`; the caller has to send the browser
 * there, so this deliberately does not navigate. Nothing is charged until the
 * customer completes payment on the gateway and it calls back to
 * `/book-appointment/payment/callback`, which is what flips the payment row to
 * PAID and the appointment to CONFIRMED.
 */
export async function payAppointment(
  payload: PayAppointmentPayload,
): Promise<PayAppointmentResponse> {
  const response = await apiClient<ApiResponse<PayAppointmentResponse>>(
    "/appointment/pay-appointment",
    { method: "POST", body: payload },
  );
  return response.data;
}

/**
 * Cancels an appointment and, if it was paid and cancelled more than an hour
 * before the scheduled start, refunds it through bKash.
 */
export async function cancelAppointment(
  payload: CancelAppointmentPayload,
): Promise<CancelAppointmentResponse> {
  const response = await apiClient<ApiResponse<CancelAppointmentResponse>>(
    "/appointment/cancel-appointment",
    { method: "POST", body: payload },
  );
  return response.data;
}

/**
 * The signed-in doctor's own appointments.
 *
 * Scoped by the token, not by a query param — there is no `doctorId` here. Each
 * row carries the patient including their contact number, and no doctor
 * relation, because the caller is the doctor.
 */
export async function getDoctorAppointments(
  params: DoctorAppointmentsParams,
): Promise<PaginatedData<DoctorAppointment>> {
  const response = await apiClient<PaginatedApiResponse<DoctorAppointment>>(
    "/appointment/doctor-appointments",
    { params },
  );
  return { data: response.data, meta: response.meta };
}

/**
 * Every appointment on the platform, for admins.
 *
 * Carries both the patient and the doctor, but the patient projection omits
 * `contactNumber` — only the doctor's own list includes it.
 */
export async function getAllAppointments(
  params: AllAppointmentsParams,
): Promise<PaginatedData<AllAppointment>> {
  const response = await apiClient<PaginatedApiResponse<AllAppointment>>(
    "/appointment/all-appointments",
    { params },
  );
  return { data: response.data, meta: response.meta };
}

/**
 * Advances an appointment through its lifecycle. Doctor-only.
 *
 * The backend enforces the transitions, not the UI: CONFIRMED may only go to
 * ONGOING, ONGOING may only go to COMPLETED, and skipping a step is a 400
 * (`"Confirmed appointment must be ongoing at first"`). Completed and cancelled
 * rows are 403.
 *
 * Returns the bare updated appointment row with no relations, so it is of no use
 * for refreshing a detail view — invalidate the list instead.
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  payload: UpdateAppointmentStatusPayload,
): Promise<Appointment> {
  const response = await apiClient<ApiResponse<Appointment>>(
    `/appointment/update-status/${appointmentId}`,
    { method: "PATCH", body: payload },
  );
  return response.data;
}
