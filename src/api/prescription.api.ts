import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  CreatedPrescription,
  CreatePrescriptionPayload,
  PrescriptionResult,
} from "@/types";

/**
 * Writes a prescription for a completed appointment.
 *
 * Doctor-only. Three things happen server-side that the caller has to know about,
 * because none of them are visible in the response:
 *
 * - the appointment must be COMPLETED, else 400
 * - one prescription per appointment, else 409 — there is no edit or re-issue
 * - a PDF is generated, uploaded to Cloudinary, and **emailed to the patient**;
 *   the only persisted trace is `prescriptionUrl`
 *
 * The medicines array is not retrievable afterwards, so a caller must not offer
 * to show "the current prescription" from this response.
 */
export async function createPrescription(
  payload: CreatePrescriptionPayload,
): Promise<CreatedPrescription> {
  const response = await apiClient<ApiResponse<CreatedPrescription>>(
    "/prescription/create-prescription",
    { method: "POST", body: payload },
  );
  return response.data;
}

/**
 * The prescription for one appointment, as a Cloudinary PDF URL.
 *
 * Open to patient, doctor, admin and super admin; the backend still scopes a
 * patient or doctor to their own appointment and answers 403 otherwise.
 *
 * A missing prescription is a 404 with "No Prescription Has Been Written Yet",
 * which is a normal empty state rather than an error — the viewer should render
 * an empty state and not a failure.
 */
export async function getPrescriptionByAppointmentId(
  appointmentId: string,
): Promise<PrescriptionResult> {
  const response = await apiClient<ApiResponse<PrescriptionResult>>(
    `/prescription/${appointmentId}`,
  );
  return response.data;
}
