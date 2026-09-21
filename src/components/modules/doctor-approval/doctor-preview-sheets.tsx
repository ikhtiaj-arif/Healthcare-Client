"use client";
import {
  BadgeCheck,
  Banknote,
  BriefcaseMedical,
  FileText,
  GraduationCap,
  MapPin,
  Phone,
  Stethoscope,
} from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type DoctorApplication, statusMeta } from "./doctor-approval.data";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          {label}
        </span>
        <span className="text-sm leading-relaxed text-foreground break-words">
          {value}
        </span>
      </div>
    </div>
  );
}

export function DoctorPreviewSheets({
  application,
  onOpenChange,
}: {
  application: DoctorApplication | null;
  onOpenChange: (open: boolean) => void;
}) {
  if (!application) {
    return null;
  }

  const status = statusMeta[application.status];

  return (
    <Sheet open={application !== null} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-lg sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle>{application.name}</SheetTitle>
            <span
              className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold tracking-wider uppercase ${status.badgeClassName}`}
            >
              {status.label}
            </span>
          </div>
          <SheetDescription>
            {application.email} · Applied {application.appliedAt}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-8">
          <section className="flex flex-col gap-4">
            <h3 className="border-b pb-2 text-xs font-semibold tracking-widest text-foreground uppercase">
              Contact
            </h3>
            <div className="flex flex-col gap-4">
              <InfoRow
                icon={<Phone className="size-4" />}
                label="Contact number"
                value={application.contactNumber}
              />
              <InfoRow
                icon={<MapPin className="size-4" />}
                label="Practice address"
                value={application.address}
              />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="border-b pb-2 text-xs font-semibold tracking-widest text-foreground uppercase">
              Credentials
            </h3>
            <div className="flex flex-col gap-4">
              <InfoRow
                icon={<BriefcaseMedical className="size-4" />}
                label="Specialization"
                value={application.specialization}
              />
              <InfoRow
                icon={<BadgeCheck className="size-4" />}
                label="License number"
                value={application.licenseNumber}
              />
              <InfoRow
                icon={<GraduationCap className="size-4" />}
                label="Qualifications"
                value={application.qualifications}
              />
              <InfoRow
                icon={<Stethoscope className="size-4" />}
                label="Experience"
                value={`${application.experienceYears} years`}
              />
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="border-b pb-2 text-xs font-semibold tracking-widest text-foreground uppercase">
              Practice
            </h3>
            <div className="flex flex-col gap-4">
              <InfoRow
                icon={<Banknote className="size-4" />}
                label="Consultation fee"
                value={
                  application.consultationFee !== undefined
                    ? `${application.consultationFee} BDT`
                    : "Not set"
                }
              />
              <InfoRow
                icon={<FileText className="size-4" />}
                label="Professional bio"
                value={application.bio}
              />
            </div>
          </section>
        </div>

        <SheetFooter>
          <Button variant="outline" className="text-destructive">
            Reject
          </Button>
          <Button>Approve</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
