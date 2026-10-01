import type { Appointment } from "./appointment.type";

/** One row of the dynamic `medicines[]` array in the doctor's form. */
export interface MedicineInput {
  name: string;
  dosage: string;
  duration: string;
  instructions?: string;
}

export interface CreatePrescriptionPayload {
  appointmentId: string;
  findings: string;
  medicines: MedicineInput[];
}

/**
 * Response of `POST /prescription/create-prescription`.
 *
 * This is **not** a `{ appointment, prescription }` pair — the service returns
 * the updated `Appointment` row on its own, which only helps because the update
 * sets `prescriptionUrl`. There is no medicines array in any response, anywhere:
 * the entries are rendered into a PDF, uploaded to Cloudinary, emailed, and then
 * discarded. Nothing is queryable after the fact, which is why C2 renders the PDF
 * rather than a list.
 */
export type CreatedPrescription = Appointment;

/**
 * Response of `GET /prescription/:appointmentId` — the only endpoint with a
 * named shape.
 *
 * `prescription` is a **Cloudinary URL to a PDF**, not the data. The appointment
 * beside it selects the full row plus a narrow `{id, name, userId}` projection of
 * both patient and doctor, so there is no contact number, email or schedule here.
 */
export interface PrescriptionResult {
  appointment: Appointment & {
    patient: { id: string; name: string; userId: string };
    doctor: { id: string; name: string; userId: string };
  };
  prescription: string;
}
