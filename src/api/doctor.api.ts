import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Doctor,
  DoctorApplicationPayload,
  DoctorApprovalPayload,
  DoctorParams,
  PaginatedData,
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
  const response = await apiClient<ApiResponse<PaginatedData<Doctor>>>(
    `/doctor/all-doctors`,
    {
      params,
    },
  );
  return response.data;
}
