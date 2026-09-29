import type { DoctorVerificationStatus } from "./doctor.types";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export type AuthProvider = "CREDENTIAL" | "GOOGLE";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

/** Mirrors the `doctor` select on the backend's `getMe` query. */
export interface DoctorProfileSummary {
  id: string;
  name: string;
  specialization: string;
  verificationStatus: DoctorVerificationStatus;
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
  patient?: Record<string, unknown> | null;
  /**
   * Null for a DOCTOR whose profile row is missing. Doctor-only screens read
   * this to explain the state instead of failing a request and showing a 403.
   */
  doctor?: DoctorProfileSummary | null;
}
