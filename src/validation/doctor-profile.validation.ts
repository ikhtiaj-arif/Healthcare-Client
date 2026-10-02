import { z } from "zod";

/**
 * Mirrors `UpdateDoctorProfileValidationZodSchema`. Every field is optional on
 * the server, but the form always submits the current values, so address and
 * contact number are required here once the doctor chooses to save.
 *
 * `consultationFee` is a string in the input and a number on the wire. An empty
 * field means "leave the stored fee alone".
 */
export const doctorProfileSchema = z.object({
  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters long"),
  bio: z.string().trim().max(1000, "Bio cannot exceed 1000 characters"),
  consultationFee: z
    .string()
    .trim()
    .refine((value) => {
      if (value === "") {
        return true;
      }
      const amount = Number(value);
      return Number.isFinite(amount) && amount >= 0;
    }, "Consultation fee cannot be negative"),
  contactNumber: z.string().trim().min(5, "Contact number is invalid"),
});

export type DoctorProfileFormValues = z.infer<typeof doctorProfileSchema>;
