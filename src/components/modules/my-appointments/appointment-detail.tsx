"use client";

import { CalendarX2, Video } from "lucide-react";
import Link from "next/link";
import { PrescriptionForm } from "@/components/form/PrescriptionForm";
import { CancelAppointmentDialog } from "@/components/modules/my-appointments/cancel-appointment-dialog";
import { PayAppointmentButton } from "@/components/modules/my-appointments/pay-appointment-button";
import { PrescriptionViewer } from "@/components/modules/prescriptions/prescription-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import { toast } from "@/components/ui/toast";
import { useGetAppointment, useGetMe, useUpdateAppointmentStatus } from "@/hooks";
import type { AppointmentStatus } from "@/types";
import { getApiErrorMessage } from "@/utils";

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not set";
  }
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-44 shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

/**
 * The body of the detail view, driven by an explicit id.
 *
 * Takes the id as a prop rather than reading it from `useParams` because this
 * cannot live on a `[appointmentId]` route: the app is a static export, and Next
 * 16 requires a dynamic route to prerender at least one path, which is
 * impossible for records that only exist for a signed-in patient. So the id
 * travels in the query string of the list route instead and the parent decides
 * how to present it.
 */
export function AppointmentDetail({
  appointmentId,
  onClose,
}: {
  appointmentId: string;
  /** Provided when hosted in the sheet; a standalone view falls back to a link. */
  onClose?: () => void;
}) {
  const { data: me } = useGetMe();
  const role = me?.data?.role;
  const {
    data: appointment,
    isPending,
    isError,
  } = useGetAppointment(appointmentId);

  if (isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  // The backend answers 403 for someone else's appointment and 404 for a deleted
  // one. Both are the same thing to a patient, so do not distinguish them.
  if (isError || !appointment) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="Appointment not found"
        description="It may have been removed, or it belongs to another account."
        action={
          onClose ? (
            <Button size="sm" onClick={onClose}>
              Close
            </Button>
          ) : (
            <Link
              href="/dashboard/my-appointments"
              className="text-sm font-medium underline"
            >
              Back to my appointments
            </Link>
          )
        }
      />
    );
  }

  const canCancel =
    appointment.status === "PENDING" || appointment.status === "CONFIRMED";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-base">
            Appointment #{appointment.serialNumber ?? "–"}
          </CardTitle>
          <StatusBadge status={appointment.status} />
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            <Row
              label="Doctor"
              value={
                <Link
                  href={`/doctors/${appointment.doctorId}`}
                  className="font-medium underline"
                >
                  {appointment.doctor?.name ?? "Unknown"}
                </Link>
              }
            />
            <Row
              label="Specialization"
              value={appointment.doctor?.specialization ?? "–"}
            />
            <Row
              label="Scheduled for"
              value={formatDateTime(
                appointment.schedule?.startDateTime ?? appointment.joiningTime,
              )}
            />
            <Row
              label="Ends"
              value={formatDateTime(appointment.schedule?.endDateTime)}
            />
            <Row
              label="Booked on"
              value={formatDateTime(appointment.createdAt)}
            />
            <Row
              label="Amount"
              value={
                appointment.payment
                  ? `${appointment.payment.amount} ${appointment.payment.currency}`
                  : "Not set"
              }
            />
            <Row
              label="Payment"
              value={
                appointment.payment ? (
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={appointment.payment.status} />
                    {appointment.payment.paidAt ? (
                      <span className="text-xs text-muted-foreground">
                        Paid {appointment.payment.paidAt}
                      </span>
                    ) : null}
                    {appointment.payment.refundAmount ? (
                      <span className="text-xs text-muted-foreground">
                        Refunded {appointment.payment.refundAmount}{" "}
                        {appointment.payment.currency}
                        {appointment.payment.refundedAt
                          ? ` on ${appointment.payment.refundedAt}`
                          : null}
                      </span>
                    ) : null}
                    {appointment.payment.refundReason ? (
                      <span className="text-xs text-muted-foreground">
                        Reason: {appointment.payment.refundReason}
                      </span>
                    ) : null}
                  </div>
                ) : (
                  "No payment record"
                )
              }
            />
          </dl>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        {/*
          The meeting link lives on the schedule, not the appointment, and the
          doctor can leave it blank when creating one. Only offer it once the
          appointment is CONFIRMED and a link actually exists, rather than
          rendering a control that goes nowhere.
        */}
        {appointment.status === "CONFIRMED" &&
        appointment.schedule?.meetingLink ? (
          <Button
            variant="outline"
            render={
              <a
                href={appointment.schedule.meetingLink}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <Video />
            Join meeting
          </Button>
        ) : null}
        {role === "PATIENT" ? (
          <PayAppointmentButton appointment={appointment} />
        ) : null}
        {canCancel && role !== "DOCTOR" ? (
          <CancelAppointmentDialog appointment={appointment} />
        ) : null}
        {role === "DOCTOR" ? (
          <AppointmentStatusAction
            appointmentId={appointment.id}
            status={appointment.status}
          />
        ) : null}
      </div>

      {appointment.status === "COMPLETED" ? (
        role === "DOCTOR" && !appointment.prescriptionUrl ? (
          <PrescriptionForm appointmentId={appointment.id} />
        ) : (
          <PrescriptionViewer appointmentId={appointment.id} />
        )
      ) : null}
    </div>
  );
}

function AppointmentStatusAction({
  appointmentId,
  status,
}: {
  appointmentId: string;
  status: AppointmentStatus;
}) {
  const { mutateAsync, isPending } = useUpdateAppointmentStatus();
  const next =
    status === "CONFIRMED"
      ? "ONGOING"
      : status === "ONGOING"
        ? "COMPLETED"
        : null;

  if (!next) {
    return null;
  }

  const advance = async () => {
    try {
      await toast.promise(
        mutateAsync({ appointmentId, status: next }),
        {
          loading: {
            title: "Updating status",
            description:
              next === "ONGOING"
                ? "Moving this visit to ongoing."
                : "Marking this visit completed.",
          },
          success: {
            title: "Status updated",
            description:
              next === "ONGOING"
                ? "The visit is now ongoing."
                : "The visit is completed. You can write a prescription.",
          },
          error: (err) => ({
            title: "Could not update status",
            description: getApiErrorMessage(
              err,
              "The visit may already have moved, or it belongs to another doctor.",
            ),
          }),
        },
      );
    } catch {
      // toast.promise has already surfaced the message.
    }
  };

  return (
    <Button onClick={advance} disabled={isPending}>
      {isPending ? <Spinner /> : null}
      {next === "ONGOING" ? "Mark ongoing" : "Mark completed"}
    </Button>
  );
}
