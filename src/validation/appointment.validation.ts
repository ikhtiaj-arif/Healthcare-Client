import { z } from "zod";

/**
 * Mirrors CancelAppointmentValidationZodSchema on the backend.
 *
 * The reason is sent to bKash as the refund narrative, so the server trims and
 * bounds it. Repeating the rule here means the 3-character minimum is caught
 * before a round trip rather than after, and the trim means the length check
 * runs against what will actually be sent: three spaces would otherwise pass a
 * naive `min(3)` locally and fail on the server.
 */
export const cancelAppointmentSchema = z.object({
  refundReason: z
    .string()
    .trim()
    .min(3, "Please give a reason for cancelling")
    .max(500, "Refund reason cannot exceed 500 characters"),
});

export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;

/**
 * Whether cancelling is still expected to refund, for the confirmation copy.
 *
 * The backend's rule is `now < startDateTime - 1 hour`, checked server-side
 * against the server clock. This is the same arithmetic on the client so the
 * dialog can warn before the user commits, but the server stays authoritative:
 * the copy says "expected", not "guaranteed", because a clock skew or a request
 * that lands after the cut-off will still cancel without a refund.
 */
export const REFUND_CUTOFF_HOURS = 1;

export function isRefundExpected(startDateTime?: string | null): boolean {
  if (!startDateTime) {
    return false;
  }

  const start = new Date(startDateTime).getTime();
  if (Number.isNaN(start)) {
    return false;
  }

  const cutoff = start - REFUND_CUTOFF_HOURS * 60 * 60 * 1000;
  return Date.now() < cutoff;
}
