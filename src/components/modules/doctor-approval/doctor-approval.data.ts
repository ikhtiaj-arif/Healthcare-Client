import type { Doctor, DoctorApplication } from "@/types";

export type { DoctorApplication } from "@/types";

export function mapDoctorToApplication(doctor: Doctor) {
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
    user: {
      emailVerified: doctor.user?.emailVerified ?? false,
    },
  } satisfies DoctorApplication;
}
