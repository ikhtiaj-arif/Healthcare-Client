import { z } from "zod";
import type { MedicineInput } from "@/types";

/**
 * Mirrors CreatePrescriptionValidationZodSchema in the backend's
 * `prescription.validation.ts`. Every rule below is there so the doctor is told
 * what is wrong without a round trip, and the messages match the server's wording
 * to keep the two from disagreeing on screen.
 *
 * The backend also applies two rules that are **not** zod and so cannot be
 * mirrored here — they depend on the appointment, not on the submitted values:
 *
 * - the appointment must be COMPLETED, else 400 "Prescription Can Only Be Written
 *   For A Completed Appointment"
 * - one prescription per appointment, else 409 "A Prescription Already Exists For
 *   This Appointment"
 *
 * Both belong in the UI as disabled states on the action, not as validation.
 */
export const medicineSchema = z.object({
  name: z.string().trim().min(1, "Medicine Name Is Required"),
  dosage: z.string().trim().min(1, "Dosage Is Required"),
  duration: z.string().trim().min(1, "Duration Is Required"),
  instructions: z.string().trim().optional(),
});

export const prescriptionSchema = z.object({
  appointmentId: z.string().min(1, "Appointment Id Is Required"),
  findings: z
    .string()
    .trim()
    .min(5, "Findings Must Be At Least 5 Characters Long"),
  medicines: z
    .array(medicineSchema)
    .min(1, "At Least One Medicine Is Required"),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

/**
 * The empty row a fresh dynamic `medicines[]` array starts from.
 *
 * Shared rather than inlined at the call site, so an "add" button and a form
 * reset cannot disagree about the starting shape. `instructions` is included as
 * an empty string rather than left off, because a controlled input needs the key
 * to exist to stay editable after an add.
 */
export const EMPTY_MEDICINE: MedicineInput = {
  name: "",
  dosage: "",
  duration: "",
  instructions: "",
};
