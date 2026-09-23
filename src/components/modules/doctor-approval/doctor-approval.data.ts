import type { Doctor } from "@/types";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

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
}

export const statusMeta: Record<
  ApplicationStatus,
  { label: string; badgeClassName: string }
> = {
  PENDING: {
    label: "Pending",
    badgeClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  APPROVED: {
    label: "Approved",
    badgeClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  REJECTED: {
    label: "Rejected",
    badgeClassName: "bg-destructive/10 text-destructive",
  },
};

export function mapDoctorToApplication(doctor: Doctor): DoctorApplication {
  return {
    id: doctor.id,
    name: doctor.name,
    email: doctor.email,
    specialization: doctor.specialization,
    licenseNumber: doctor.licenseNumber,
    qualifications: doctor.qualifications,
    experienceYears: doctor.experienceYears,
    contactNumber: doctor.contactNumber ?? "Not provided",
    address: doctor.address ?? "Not provided",
    consultationFee:
      doctor.consultationFee != null
        ? Number(doctor.consultationFee)
        : undefined,
    bio: doctor.bio ?? "Not provided",
    appliedAt: new Date(doctor.createdAt).toISOString().slice(0, 10),
    status: doctor.verificationStatus,
  };
}
