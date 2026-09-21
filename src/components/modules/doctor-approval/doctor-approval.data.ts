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

export const doctorApplications: DoctorApplication[] = [
  {
    id: "APP-001",
    name: "Dr. Sarah Jenkins",
    email: "dr.sarah.jenkins@example.com",
    specialization: "Cardiology",
    licenseNumber: "MED-2026-98765",
    qualifications: "MD, FACC - Harvard Medical School",
    experienceYears: 12,
    contactNumber: "+1-555-0199",
    address: "123 Medical Plaza, Suite 400, New York, NY",
    consultationFee: 150,
    bio: "Dedicated cardiologist with over a decade of experience specializing in non-invasive cardiovascular imaging and preventative heart care.",
    appliedAt: "2026-09-18",
    status: "PENDING",
  },
  {
    id: "APP-002",
    name: "Dr. Mir Hussain",
    email: "drmir@gmail.com",
    specialization: "Internal Medicine",
    licenseNumber: "BMDC-A-54321",
    qualifications: "MBBS, FCPS (Medicine)",
    experienceYears: 9,
    contactNumber: "+880 1712 345678",
    address: "House 12, Road 5, Dhanmondi, Dhaka",
    consultationFee: 1000,
    bio: "Internal medicine specialist focused on chronic disease management and preventive care for adult patients.",
    appliedAt: "2026-09-17",
    status: "PENDING",
  },
  {
    id: "APP-003",
    name: "Dr. Alicia Ramirez",
    email: "alicia.ramirez@example.com",
    specialization: "Pediatrics",
    licenseNumber: "PED-2025-33210",
    qualifications: "MD, FAAP - Johns Hopkins",
    experienceYears: 8,
    contactNumber: "+1-555-0142",
    address: "88 Children's Way, Chicago, IL",
    consultationFee: 120,
    bio: "Pediatrician passionate about early childhood development and accessible primary care for underserved communities.",
    appliedAt: "2026-09-15",
    status: "APPROVED",
  },
  {
    id: "APP-004",
    name: "Dr. Omar Faruq",
    email: "omar.faruq@example.com",
    specialization: "Orthopedics",
    licenseNumber: "BMDC-B-77112",
    qualifications: "MBBS, MS (Ortho)",
    experienceYears: 15,
    contactNumber: "+880 1811 223344",
    address: "Lane 3, Gulshan Avenue, Dhaka",
    consultationFee: 1500,
    bio: "Orthopedic surgeon with a focus on sports injuries, joint replacement, and minimally invasive procedures.",
    appliedAt: "2026-09-10",
    status: "REJECTED",
  },
  {
    id: "APP-005",
    name: "Dr. Emily Chen",
    email: "emily.chen@example.com",
    specialization: "Dermatology",
    licenseNumber: "DER-2024-11908",
    qualifications: "MD, PhD - Stanford University",
    experienceYears: 6,
    contactNumber: "+1-555-0177",
    address: "450 Sunset Blvd, Los Angeles, CA",
    consultationFee: undefined,
    bio: "Board-certified dermatologist interested in medical dermatology, skin cancer screening, and cosmetic procedures.",
    appliedAt: "2026-09-08",
    status: "PENDING",
  },
  {
    id: "APP-006",
    name: "Dr. Tanvir Ahmed",
    email: "tanvir.ahmed@example.com",
    specialization: "Neurology",
    licenseNumber: "BMDC-C-90813",
    qualifications: "MBBS, MD (Neurology)",
    experienceYears: 11,
    contactNumber: "+880 1512 778899",
    address: "Plot 4, Block C, Banani, Dhaka",
    consultationFee: 2000,
    bio: "Neurologist specializing in epilepsy, stroke rehabilitation, and headache disorders.",
    appliedAt: "2026-09-05",
    status: "APPROVED",
  },
];
