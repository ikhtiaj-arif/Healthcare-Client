import type { PaginatedData } from "./api-response.type";

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

export interface DoctorParams {
  page?: number;
  limit?: number;
  verificationStatus?: DoctorVerificationStatus;
  searchTerm?: string;
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