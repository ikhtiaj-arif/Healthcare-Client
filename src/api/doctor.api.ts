import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AvailableDoctorsParams,
  AvailableDoctorToday,
  Doctor,
  DoctorApplicationPayload,
  DoctorApprovalPayload,
  DoctorParams,
  PaginatedApiResponse,
  PaginatedData,
  PublicDoctorParams,
  PublicDoctorProfile,
  Schedule,
  UpdateDoctorProfilePayload,
  VerifyAccountPayload,
} from "@/types";

export function applyDoctor(payload: DoctorApplicationPayload) {
  const formData = new FormData();

  formData.append("data", JSON.stringify(payload.data));
  formData.append("resume", payload.resume);

  for (const file of payload.additionalFiles) {
    formData.append("additionalFiles", file);
  }
  return apiClient("/doctor/apply-as-doctor", {
    method: "POST",
    body: formData,
  });
}

export function verifyDoctorAccount(payload: VerifyAccountPayload) {
  return apiClient("/doctor/apply-as-doctor/verify-email", {
    method: "POST",
    body: payload,
  });
}
export async function doctorAccountApprovalRejection(
  payload: DoctorApprovalPayload,
): Promise<Doctor> {
  const response = await apiClient<ApiResponse<Doctor>>(
    "/doctor/approve-doctor",
    {
      method: "POST",
      body: payload,
    },
  );
  return response.data;
}

export async function getAllDoctors(
  params: DoctorParams,
): Promise<PaginatedData<Doctor>> {
  const response = await apiClient<PaginatedApiResponse<Doctor>>(
    `/doctor/all-doctors`,
    {
      params,
    },
  );
  return { data: response.data, meta: response.meta };
}

export function getAllPublicDoctors(params: PublicDoctorParams) {
  return apiClient<ApiResponse<PublicDoctorProfile[]>>(
    "/doctor/public/all-doctors",
    {
      params,
    },
  );
}

export function getPublicDoctorProfile(doctorId: string) {
  return apiClient<ApiResponse<PublicDoctorProfile>>(
    `/doctor/public/${doctorId}`,
  );
}

export function getTodayScheduleByDoctor(params: {
  doctorId?: string;
  page?: number;
  limit?: number;
}) {
  return apiClient<ApiResponse<Schedule[]>>("/schedule/todays-schedule", {
    params,
  });
}

/**
 * Public list of doctors with a bookable slot left today.
 *
 * Unauthenticated, so it is safe to call from a marketing page. The backend
 * hard-filters to approved, non-deleted doctors with a PUBLISHED schedule today
 * that still has free slots and has not started — none of that is filterable
 * from the client, so an empty page means the filter matched nothing rather than
 * that the caller forgot a parameter.
 *
 * The nested schedules come back **without** `meetingLink` or `status`; see
 * `AvailableDoctorSchedule`.
 */
export async function getAvailableDoctorsToday(
  params: AvailableDoctorsParams,
): Promise<PaginatedData<AvailableDoctorToday>> {
  const response = await apiClient<PaginatedApiResponse<AvailableDoctorToday>>(
    "/doctor/public/available-today",
    { params },
  );
  return { data: response.data, meta: response.meta };
}

/**
 * Updates the signed-in doctor's own profile.
 *
 * Doctor-only and self-scoped — there is no doctorId in the path or body. Only
 * the four fields on `UpdateDoctorProfilePayload` are accepted; zod strips
 * anything else, so sending `specialization` would be silently ignored rather
 * than rejected.
 *
 * Returns the full doctor row, which carries **no** `imageUrl` — that lives on
 * the `User`, not the `Doctor`. Refetch `/auth/me` if the avatar is on screen.
 */
export async function updateMyDoctorProfile(
  payload: UpdateDoctorProfilePayload,
): Promise<Doctor> {
  const response = await apiClient<ApiResponse<Doctor>>(
    "/doctor/update-my-profile",
    { method: "PATCH", body: payload },
  );
  return response.data;
}
