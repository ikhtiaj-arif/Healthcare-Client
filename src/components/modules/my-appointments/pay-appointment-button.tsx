"use client";

import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { usePayAppointment } from "@/hooks";
import type { Appointment } from "@/types";
import { getApiErrorMessage } from "@/utils";

/**
 * Sends the patient to bKash to pay for a PENDING appointment.
 *
 * The backend creates a checkout and answers with a `bkashURL`; nothing is
 * charged until the customer completes payment on the gateway and it calls back
 * to `/book-appointment/payment/callback`, which is what marks the payment PAID
 * and confirms the appointment. So this navigates away immediately and the
 * result is only visible after the return trip, which lands on
 * /dashboard/my-appointments?status=success.
 *
 * The gateway URL is trusted as-is because it comes from our own backend, not
 * from anything a user can influence.
 */
export function PayAppointmentButton({
  appointment,
}: {
  appointment: Appointment;
}) {
  const { mutate, isPending } = usePayAppointment();

  if (appointment.status !== "PENDING") {
    return null;
  }

  // Already settled: the backend rejects a second attempt with "Appointment is
  // Already CONFIRMED", so do not offer a control that can only fail.
  if (appointment.payment && appointment.payment.status !== "UNPAID") {
    return null;
  }

  const handlePay = () => {
    mutate(
      { appointmentId: appointment.id },
      {
        onSuccess: ({ paymentUrl }) => {
          if (!paymentUrl) {
            toast.add({
              title: "Payment could not be started",
              description: "The gateway did not return a checkout URL.",
              type: "error",
            });
            return;
          }

          // Full navigation, not router.push: bkashURL is on another origin and
          // must not be fetched by the client router.
          window.location.href = paymentUrl;
        },
        onError: (error) => {
          toast.add({
            title: "Could not start payment",
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
    <Button size="sm" onClick={handlePay} disabled={isPending}>
      {isPending ? <Spinner /> : <CreditCard />}
      {isPending ? "Redirecting…" : "Pay now"}
    </Button>
  );
}
