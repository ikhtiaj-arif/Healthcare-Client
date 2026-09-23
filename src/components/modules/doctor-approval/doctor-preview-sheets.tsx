"use client";
import { useQueryClient } from "@tanstack/react-query";
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
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useApproveRejectDoctor } from "@/hooks";
import type { DoctorApprovalStatus } from "@/types";
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
  const queryClient = useQueryClient();
  const { mutate, isPending } = useApproveRejectDoctor();
  const [confirmAction, setConfirmAction] =
    useState<DoctorApprovalStatus | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  if (!application) {
    return null;
  }

  const status = statusMeta[application.status];
  const isPendingDoctor = application.status === "PENDING";

  const closeConfirm = () => {
    setConfirmAction(null);
    setRejectReason("");
  };

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction === "REJECTED" && !rejectReason.trim()) return;

    mutate(
      {
        doctorId: application.id,
        verificationStatus: confirmAction,
        ...(confirmAction === "REJECTED" && {
          rejectionReason: rejectReason.trim(),
        }),
      },
      {
        onSuccess: () => {
          const message =
            confirmAction === "APPROVED"
              ? "Doctor account approved successfully."
              : "Doctor account rejected successfully.";
          closeConfirm();
          onOpenChange(false);
          queryClient.invalidateQueries({ queryKey: ["doctors"] });
          toast.add({
            title:
              confirmAction === "APPROVED"
                ? "Doctor Approved"
                : "Doctor Rejected",
            description: message,
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Action Failed",
            description:
              (error as Error)?.message || "Unable to complete the action.",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <>
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

          {isPendingDoctor && (
            <SheetFooter>
              <Button
                variant="outline"
                className="text-destructive"
                onClick={() => setConfirmAction("REJECTED")}
                disabled={isPending}
              >
                Reject
              </Button>
              <Button
                onClick={() => setConfirmAction("APPROVED")}
                disabled={isPending}
              >
                Approve
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <Dialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) closeConfirm();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "APPROVED"
                ? "Approve doctor"
                : "Reject doctor"}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === "APPROVED"
                ? `You are about to approve ${application.name}. This will activate their doctor account.`
                : `You are about to reject ${application.name}. This cannot be undone.`}
            </DialogDescription>
          </DialogHeader>

          {confirmAction === "REJECTED" && (
            <div className="flex flex-col gap-2 px-6">
              <Label htmlFor="reject-reason">Rejection reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="Explain why this application is being rejected..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <DialogClose
              render={<Button variant="outline" disabled={isPending} />}
            >
              Cancel
            </DialogClose>
            <Button
              variant={confirmAction === "REJECTED" ? "destructive" : "default"}
              onClick={handleConfirm}
              disabled={
                isPending ||
                (confirmAction === "REJECTED" && !rejectReason.trim())
              }
            >
              {isPending && <Spinner />}
              {confirmAction === "APPROVED" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
