import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Appointment,
  AppointmentParams,
  BookAppointmentPayload,
  BookAppointmentResponse,
  CancelAppointmentPayload,
  CancelAppointmentResponse,
  PaginatedApiResponse,
  PaginatedData,
  PayAppointmentPayload,
  PayAppointmentResponse,
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
