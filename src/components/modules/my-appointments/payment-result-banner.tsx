"use client";

import type { LucideIcon } from "lucide-react";
import { AlertCircle, Ban, CircleCheck, CircleX, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The bKash return banner.
 *
 * The backend redirects the browser to
 * `/dashboard/my-appointments?status=…` with one of FOUR outcomes, and the
 * page this replaced only handled two of them:
 *
 *   ?status=success   payment executed
 *   ?status=failure   payment did not execute
 *   ?status=cancel    the customer backed out at the gateway
 *   ?error=payment-failed   the gateway call itself failed
 *
 * A cancelled or errored payment therefore landed on a page that silently
 * showed the ordinary list, with nothing indicating the payment had failed.
 * `PAYMENT_RESULTS` below is the complete set, kept next to the copy so the two
 * cannot drift apart again.
 *
 * `?status=` is not the appointment status filter, even though it shares a name.
 * The value sets are disjoint (success/failure/cancel versus
 * PENDING/CONFIRMED/…), so the filter can own `status` and this can key off the
 * lowercase gateway values.
 */
const PAYMENT_RESULTS: Record<
  string,
  { title: string; description: string; icon: LucideIcon; className: string }
> = {
  success: {
    title: "Payment successful",
    description:
      "Your appointment is confirmed. Please be ready to join at the scheduled time.",
    icon: CircleCheck,
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  },
  failure: {
    title: "Payment failed",
    description:
      "bKash could not complete the payment. Your appointment is still unpaid and you can try again from it.",
    icon: CircleX,
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  cancel: {
    title: "Payment cancelled",
    description:
      "You cancelled the payment before it completed. Nothing was charged and the appointment is still unpaid.",
    icon: Ban,
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  },
  "payment-failed": {
    title: "Payment could not be reached",
    description:
      "The payment gateway did not respond. Nothing was charged. Please try again in a moment.",
    icon: AlertCircle,
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
};

export function PaymentResultBanner({
  outcome,
  onDismiss,
}: {
  outcome: string;
  onDismiss: () => void;
}) {
  const result = PAYMENT_RESULTS[outcome];

  if (!result) {
    return null;
  }

  const Icon = result.icon;

  return (
    // <output> carries an implicit role="status", so the gateway return is
    // announced rather than merely shown: it arrives as the result of an action
    // the user took a page navigation ago.
    <output
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        result.className,
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="font-medium">{result.title}</p>
        <p className="text-sm opacity-90">{result.description}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="shrink-0 rounded-sm p-1 opacity-60 transition-opacity hover:opacity-100"
      >
        <X className="size-4" />
      </button>
    </output>
  );
}

/**
 * Reads the gateway outcome out of the query string.
 *
 * The two params are separate on purpose: `error=payment-failed` is the shape
 * the backend uses for a gateway call that never returned, while the other three
 * arrive as `status=`.
 */
export function readPaymentOutcome(params: URLSearchParams): string | null {
  const error = params.get("error");
  if (error === "payment-failed") {
    return error;
  }

  const status = params.get("status");
  if (status && status in PAYMENT_RESULTS) {
    return status;
  }

  return null;
}
