"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCancelAppointment } from "@/hooks";
import type { Appointment } from "@/types";
import { getApiErrorMessage } from "@/utils";
import { cancelAppointmentSchema, isRefundExpected } from "@/validation";

/**
 * Cancel an appointment, with a required reason.
 *
 * The reason is not decoration: the backend forwards it to bKash as the refund
 * narrative and requires 3-500 characters, so the dialog validates against the
 * same schema before sending rather than letting the server reject it.
 *
 * Whether a refund is expected is computed client-side to warn before the user
 * commits, but phrased as "expected" because the server re-checks against its own
 * clock and the cut-off is a hard boundary: cancelling 61 minutes before the
 * start refunds, 59 does not.
 */
export function CancelAppointmentDialog({
  appointment,
  trigger,
}: {
  appointment: Appointment;
  /**
   * A React element rather than ReactNode: Base UI's `render` prop composes the
   * trigger by cloning the element, so a string or fragment is not accepted.
   */
  trigger?: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | null>(null);

  const { mutate, isPending } = useCancelAppointment();

  const refundExpected =
    appointment.payment?.status === "PAID" &&
    isRefundExpected(appointment.schedule?.startDateTime);

  const wasPaid = appointment.payment?.status === "PAID";

  const handleConfirm = () => {
    const parsed = cancelAppointmentSchema.safeParse({ refundReason: reason });

    if (!parsed.success) {
      setReasonError(
        parsed.error.issues[0]?.message ??
          "Please give a reason for cancelling",
      );
      return;
    }

    setReasonError(null);
    mutate(
      {
        appointmentId: appointment.id,
        // Send the trimmed value the schema produced, not the raw input.
        refundReason: parsed.data.refundReason,
      },
      {
        onSuccess: (result) => {
          setOpen(false);
          setReason("");
          toast.add({
            title: "Appointment cancelled",
            description:
              result.payment?.status === "REFUNDED"
                ? "Your payment is being refunded to your bKash account."
                : wasPaid
                  ? "The appointment was cancelled. It is past the refund cut-off, so no refund was issued."
                  : "The slot has been released.",
            type: "success",
          });
        },
        onError: (error) => {
          toast.add({
            title: "Could not cancel",
            description: getApiErrorMessage(
              error,
              "Please try again in a moment.",
            ),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          trigger ?? (
            <Button variant="destructive" size="sm">
              Cancel appointment
            </Button>
          )
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
          <AlertDialogDescription>
            {refundExpected
              ? "Cancelling now releases the slot and starts a refund to your bKash account. This cannot be undone."
              : wasPaid
                ? "Cancelling releases the slot, but it is within an hour of the start time, so no refund will be issued. This cannot be undone."
                : "Cancelling releases the slot back to the doctor. This cannot be undone."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2">
          <Label htmlFor={`cancel-reason-${appointment.id}`}>
            Reason for cancelling
          </Label>
          <Textarea
            id={`cancel-reason-${appointment.id}`}
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              if (reasonError) {
                setReasonError(null);
              }
            }}
            placeholder="A short explanation is sent with the refund request."
            rows={3}
            maxLength={500}
            aria-invalid={Boolean(reasonError)}
            aria-describedby={
              reasonError ? `cancel-reason-error-${appointment.id}` : undefined
            }
          />
          {reasonError ? (
            <p
              id={`cancel-reason-error-${appointment.id}`}
              className="text-sm text-destructive"
            >
              {reasonError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Between 3 and 500 characters. Currently {reason.trim().length}.
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Keep appointment
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Cancelling…" : "Yes, cancel it"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
