import type { DoctorVerificationStatus } from "./doctor.types";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

/** Mirrors the `patient` include on the backend's `getMe` query. */
export interface PatientProfileSummary {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  address: string | null;
}

/**
 * Mirrors the `doctor` select on the backend's `getMe` query.
 *
 * `consultationFee` is a decimal string (`"500.00"`). The profile form parses
 * it with `Number()` and sends a JSON number back — a string fails `z.number()`.
 */
export interface DoctorProfileSummary {
  id: string;
  name: string;
  specialization: string;
  verificationStatus: DoctorVerificationStatus;
  address: string | null;
  bio: string | null;
  consultationFee: string | null;
  contactNumber: string | null;
}

/** Shape of `GET /auth/me` (`ApiResponse<User>`). */
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  googleId?: string | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  imageUrl?: string | null;
  image_public_id?: string | null;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  patient?: PatientProfileSummary | null;
  /**
   * Null for a DOCTOR whose profile row is missing. Doctor-only screens read
   * this to explain the state instead of failing a request and showing a 403.
   */
  doctor?: DoctorProfileSummary | null;
}
