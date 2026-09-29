import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Appointment,
  AppointmentParams,
  BookAppointmentPayload,
  BookAppointmentResponse,
  PaginatedApiResponse,
  PaginatedData,
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
