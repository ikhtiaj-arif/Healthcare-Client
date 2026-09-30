import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Doctor,
  DoctorApplicationPayload,
  DoctorApprovalPayload,
  DoctorParams,
  PaginatedApiResponse,
  PaginatedData,
  PublicDoctorParams,
  PublicDoctorProfile,
  Schedule,
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
