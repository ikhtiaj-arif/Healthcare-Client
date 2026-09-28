import type { DoctorVerificationStatus } from "./doctor.types";

export type ApplicationStatus = DoctorVerificationStatus;

export interface DoctorApplication {
  id: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  qualifications: string;
  experienceYears: number;
  contactNumber: string;
  address: string;
  consultationFee: number | undefined;
  bio: string;
  appliedAt: string;
  status: ApplicationStatus;
  user: {
    emailVerified: boolean;
  };
}
