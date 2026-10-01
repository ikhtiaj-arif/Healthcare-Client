import type { PaginatedData } from "./api-response.type";
import type { ScheduleSortField } from "./schedule.types";

export interface DoctorApplicationData {
  user: {
    name: string;
    email: string;
  };
  doctor: {
    specialization: string;
    licenseNumber: string;
    qualifications: string;
    experienceYears: number;
    contactNumber: string | undefined;
    address: string | undefined;
    consultationFee: number | undefined;
    bio: string;
  };
}

export interface DoctorApplicationPayload {
  resume: File;
  additionalFiles: File[];
  data: DoctorApplicationData;
}

export type DoctorVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type DoctorApprovalStatus = Extract<
  DoctorVerificationStatus,
  "APPROVED" | "REJECTED"
>;

export interface DoctorApprovalPayload {
  doctorId: string;
  verificationStatus: DoctorApprovalStatus;
  rejectionReason?: string;
}

export interface DoctorAdditionalFile {
  url: string;
  publicId: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  address: string | null;
  contactNumber: string | null;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  bio: string | null;
  consultationFee: string | null;
  verificationStatus: DoctorVerificationStatus;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  resumeUrl: string | null;
  resumePublicId: string | null;
  additionalFiles: DoctorAdditionalFile[] | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
    googleId: string | null;
    authProvider: string;
    emailVerified: boolean;
    role: string;
    status: string;
    imageUrl: string;
    image_public_id: string;
    needPasswordChange: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export type GetAllDoctorsResponse = PaginatedData<Doctor>;

/**
 * Mirrors DOCTOR_SORTABLE_FIELDS in Healthcare-Backend/src/app/utils/sort.ts.
 *
 * Kept as a union rather than `string` so the backend's allow-list is enforced
 * at compile time here too: naming a column the backend rejects becomes a type
 * error instead of a 400. Keep the two in sync.
 */
export type DoctorSortField =
  | "createdAt"
  | "updatedAt"
  | "name"
  | "specialization"
  | "experienceYears"
  | "consultationFee"
  | "verificationStatus";

export interface DoctorParams {
  page?: number;
  limit?: number;
  verificationStatus?: DoctorVerificationStatus;
  searchTerm?: string;
  sortBy?: DoctorSortField;
  sortOrder?: "desc" | "asc";
}

export interface PublicDoctorProfile {
  id: string;
  name: string;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  bio?: string | null;
  consultationFee?: number | string | null;
  createdAt: string;
}

export interface PublicDoctorParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  specialization?: string;
  sortBy?: string;
  sortOrder?: "desc" | "asc";
}

/**
 * Body of `PATCH /doctor/update-my-profile`.
 *
 * Every field is optional and the server's zod strips unknown keys, so `{}` is a
 * valid no-op. `specialization`, `name`, `qualifications`, `experienceYears` and
 * `licenseNumber` are deliberately absent — the backend does not accept them
 * here, and zod would strip them silently rather than error.
 *
 * `consultationFee` must be a real JSON **number**. `"500"` fails `z.number()` on
 * the server, so this is deliberately not typed as `number | string` the way the
 * response is.
 */
export interface UpdateDoctorProfilePayload {
  address?: string;
  bio?: string;
  consultationFee?: number;
  contactNumber?: string;
}

/**
 * A nested schedule on `GET /doctor/public/available-today`.
 *
 * Narrower than `Schedule`: this select omits `meetingLink` and `status`, so a
 * booking dialog that needs the meeting URL has to also call
 * `GET /schedule/todays-schedule?doctorId=…`. It is not modelled as `Schedule`
 * with two optional fields because these two are never present on this endpoint.
 */
export interface AvailableDoctorSchedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  availableSlots: number;
  totalSlots: number;
}

/**
 * One row of `GET /doctor/public/available-today`.
 *
 * The backend hard-filters to `verificationStatus: APPROVED`, `isDeleted: false`
 * and schedules that are PUBLISHED, not deleted, today, with at least one slot
 * free and that have not started — none of that is parameterisable.
 */
export interface AvailableDoctorToday {
  id: string;
  name: string;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  bio: string | null;
  consultationFee: string | null;
  createdAt: string;
  schedules: AvailableDoctorSchedule[];
}

/**
 * This endpoint sorts through `parseRelationSort`, which accepts the **union** of
 * the two allow-lists: a doctor column orders the doctors, a schedule column
 * orders the nested `schedules` array. Three fields (`createdAt`, `updatedAt`,
 * `status`) exist on both models and apply to both.
 */
export type AvailableDoctorSortField = DoctorSortField | ScheduleSortField;

/** Query params for `GET /doctor/public/available-today`. */
export interface AvailableDoctorsParams {
  page?: number;
  limit?: number;
  /** `contains` + `insensitive` on the doctor's name **or** specialization. */
  searchTerm?: string;
  /** `equals` + `insensitive`. */
  specialization?: string;
  sortBy?: AvailableDoctorSortField;
  sortOrder?: "desc" | "asc";
}
