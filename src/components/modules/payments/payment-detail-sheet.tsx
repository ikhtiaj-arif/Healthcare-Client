"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useGetPayment } from "@/hooks";

/** The query key that holds the payment the detail sheet is showing. */
export const PAYMENT_DETAIL_PARAM = "payment";

/**
 * Reads the id out of the query string, tolerating junk.
 *
 * This value comes from a URL a person can edit, so anything that is not a
 * plausible id reads as "no payment selected" rather than being sent to the API.
 */
export function readPaymentDetail(
  searchParams: Readonly<URLSearchParams>,
): string | null {
  const value = searchParams.get(PAYMENT_DETAIL_PARAM);
  if (!value) {
    return null;
  }

  return /^[\w-]+$/.test(value) ? value : null;
}

/**
 * Hosts the payment detail over the list, selected by `?payment=<id>`.
 *
 * A sheet rather than a `[paymentId]` route for the same reason as the
 * appointment detail: the export cannot prerender a path only the signed-in
 * patient knows.
 */
export function PaymentDetailSheet() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = readPaymentDetail(searchParams);

  const close = () => {
    // Replace rather than push, so opening the sheet does not add a history
    // entry the back button has to walk through. Goes through the router so
    // Next's own state stays in sync.
    const next = new URLSearchParams(searchParams.toString());
    next.delete(PAYMENT_DETAIL_PARAM);
    const query = next.toString();
    router.replace(
      query
        ? `/dashboard/payment-history?${query}`
        : "/dashboard/payment-history",
      { scroll: false },
    );
  };

  return (
    <Sheet open={Boolean(paymentId)} onOpenChange={(open) => !open && close()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Payment details</SheetTitle>
          <SheetDescription>
            The transaction record for this consultation.
          </SheetDescription>
        </SheetHeader>
        {paymentId ? <PaymentDetailBody paymentId={paymentId} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function PaymentDetailBody({ paymentId }: { paymentId: string }) {
  const { data: payment, isPending, isError } = useGetPayment(paymentId);

  if (isPending) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Loading payment…
      </p>
    );
  }

  // 403 for someone else's payment and 404 for a missing one read the same to a
  // patient, so do not distinguish them.
  if (isError || !payment) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        This payment could not be found. It may have been removed, or it belongs
        to another account.
      </p>
    );
  }

  const appointment = payment.appointment;

  return (
    <dl className="divide-y text-sm">
      <Row label="Amount">
        {payment.amount} {payment.currency}
      </Row>
      <Row label="Booked on">{format(payment.createdAt)}</Row>
      <Row label="Paid on">{format(payment.paidAt)}</Row>
      {payment.refundAmount ? (
        <>
          <Row label="Refunded">
            {payment.refundAmount} {payment.currency}
          </Row>
          <Row label="Refunded on">{format(payment.refundedAt)}</Row>
          {payment.refundReason ? (
            <Row label="Refund reason">{payment.refundReason}</Row>
          ) : null}
        </>
      ) : null}
      <Row label="Appointment">
        {appointment ? `#${appointment.serialNumber ?? "–"}` : "Not available"}
      </Row>
      <Row label="Scheduled for">
        {format(
          appointment?.schedule?.startDateTime ?? appointment?.joiningTime,
        )}
      </Row>
      <Row label="Doctor">
        {appointment?.doctor ? (
          <>
            {appointment.doctor.name}
            {appointment.doctor.specialization
              ? ` — ${appointment.doctor.specialization}`
              : ""}
          </>
        ) : (
          "Not available"
        )}
      </Row>
      {payment.bkashTrxId ? (
        <Row label="bKash TrxID">{payment.bkashTrxId}</Row>
      ) : null}
      {payment.refundTrxId ? (
        <Row label="Refund TrxID">{payment.refundTrxId}</Row>
      ) : null}
      {payment.payerReference ? (
        <Row label="Payer reference">{payment.payerReference}</Row>
      ) : null}
    </dl>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-40 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="break-words">{children}</dd>
    </div>
  );
}

function format(value?: string | null) {
  if (!value) {
    return "Not set";
  }
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
