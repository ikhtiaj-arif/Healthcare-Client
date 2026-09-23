import apiClient from "@/lib/apiClient";
import type {
  DoctorApplicationPayload,
  GetAllDoctorsResponse,
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

export function getAllDoctors(): Promise<GetAllDoctorsResponse> {
  return apiClient(`/doctor/all-doctors`);
}
