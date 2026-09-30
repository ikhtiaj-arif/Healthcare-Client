import type {
  ApplicationStatus,
  AppointmentStatus,
  PaymentStatus,
  ScheduleStatus,
} from "@/types";

type Status =
  | ApplicationStatus
  | ScheduleStatus
  | AppointmentStatus
  | PaymentStatus;

export interface StatusMeta {
  label: string;
  className: string;
}

/**
 * One source of truth for how every status reads.
 *
 * This replaces three hand-rolled variants: a `statusMeta` map in
 * doctor-approval.data.ts, a bare `text-green-600`/`text-amber-600` ternary in
 * schedule-table.tsx, and raw uppercase status text elsewhere. They disagreed
 * on both colour and whether PENDING meant "amber" in one table and "blue" in
 * another.
 *
 * Semantics, not rainbow:
 *   amber    waiting on someone
 *   emerald  done / successful / live
 *   blue     in progress
 *   red      failed or cancelled
 *   neutral  not started, or nothing to say
 */
const AMBER = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
const EMERALD = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
const BLUE = "bg-blue-500/10 text-blue-600 dark:text-blue-400";
const RED = "bg-destructive/10 text-destructive";
const NEUTRAL = "bg-muted text-muted-foreground";

export const STATUS_META: Record<Status, StatusMeta> = {
  // Doctor verification
  PENDING: { label: "Pending", className: AMBER },
  APPROVED: { label: "Approved", className: EMERALD },
  REJECTED: { label: "Rejected", className: RED },

  // Schedules
  DRAFT: { label: "Draft", className: NEUTRAL },
  PUBLISHED: { label: "Published", className: EMERALD },

  // Appointments
  CONFIRMED: { label: "Confirmed", className: EMERALD },
  ONGOING: { label: "Ongoing", className: BLUE },
  COMPLETED: { label: "Completed", className: EMERALD },
  // CANCELLED is shared by appointments and payments; red reads correctly for
  // both, so one entry serves each.
  CANCELLED: { label: "Cancelled", className: RED },

  // Payments
  UNPAID: { label: "Unpaid", className: AMBER },
  PAID: { label: "Paid", className: EMERALD },
  FAILED: { label: "Failed", className: RED },
  REFUNDED: { label: "Refunded", className: NEUTRAL },
};

/**
 * Looks up a status by its raw string.
 *
 * `Record<Status, ...>` keeps the compile-time map exhaustive, so adding a
 * backend enum value without a colour is a type error. The runtime fallback is
 * for the case where the backend sends a status this union has not caught up
 * with yet: it renders in neutral with the raw value as the label rather than
 * crashing the table.
 */
export function getStatusMeta(status: string): StatusMeta {
  return STATUS_META[status as Status] ?? { label: status, className: NEUTRAL };
}
