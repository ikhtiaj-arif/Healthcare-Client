import { z } from "zod";

export const MAX_FILE_SIZE = 6;
export const MAX_ADDITIONAL_FILES = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE * 1024 * 1024;
export const ACCEPTED_FILES_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];
export const MAX_BIO_LENGTH = 1000;

export function isAcceptedFileSize(fileSize: number) {
  return fileSize <= MAX_FILE_SIZE_BYTES;
}
export function isAcceptedTotalFiles(files: File[]) {
  return files.length <= MAX_ADDITIONAL_FILES;
}

export function isAcceptedFileTypes(fileType: string) {
  return ACCEPTED_FILES_TYPES.includes(fileType);
}

export const getCustomFileSchema = <T>(message: string) =>
  z.custom<T>(
    (value) =>
      value === null ||
      (value instanceof File &&
        isAcceptedFileSize(value.size) &&
        isAcceptedFileTypes(value.type)),
    {
      message: message,
    },
  );
export const doctorApplicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters long")
    .max(50, "Full name cannot exceed 50 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .refine((value) => value === "" || value.length >= 5, {
      message: "Contact number must be at least 5 characters",
    }),
  address: z
    .string()
    .trim()
    .refine((value) => value === "" || value.length >= 5, {
      message: "Address must be at least 5 characters",
    })
    .refine((value) => value.length <= 255, {
      message: "Address cannot exceed 255 characters",
    }),
  specialization: z.string().trim().min(2, "Specialization is required"),
  licenseNumber: z.string().trim().min(3, "License number is required"),
  qualifications: z.string().trim().min(2, "Qualifications are required"),
  experienceYears: z
    .string()
    .trim()
    .refine((value) => /^\d+$/.test(value), {
      message: "Years of experience must be whole value",
    })
    .refine((value) => Number(value) >= 0 && Number(value) <= 60, {
      message: "Years of experience must be between 0 and 60",
    }),
  consultationFee: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (/^\d+$/.test(value) && Number(value) >= 0),
      {
        message: "Consultation fee must be a non-zero whole number",
      },
    ),
  bio: z
    .string()
    .trim()
    .max(MAX_BIO_LENGTH, `Bio cannot exceed ${MAX_BIO_LENGTH} characters`),
  resume: getCustomFileSchema<File | null>(
    `Resume must be a PDF, DOC, DOCX or an image file under ${MAX_FILE_SIZE}MB`,
  ).refine((value) => value instanceof File, {
    message: "A resume of cv is required",
  }),
  additionalFiles: z
    .array(z.custom<File>((value) => value instanceof File))
    .max(
      MAX_ADDITIONAL_FILES,
      `You can attach at most ${MAX_ADDITIONAL_FILES} supporting documents`,
    )
    .refine(
      (files) =>
        files.every(
          (file) =>
            isAcceptedFileSize(file.size) && isAcceptedFileTypes(file.type),
        ),
      {
        message: `Each file must be a PDF, DOC, DOCX or an image file under ${MAX_FILE_SIZE}MB`,
      },
    ),
});
