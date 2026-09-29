import { z } from "zod";
import type { CreateSchedulePayload } from "@/types";

export const MINUTES_PER_SLOT = 20;

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function timeToMinutes(time: string): number | null {
  const match = TIME_PATTERN.exec(time);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

/**
 * `date` is a `yyyy-MM-dd` string, the shape the calendar hands back. Build it
 * with the local constructor instead of `new Date(string)`, which reads a bare
 * date as UTC midnight and lands on the previous day west of Greenwich.
 */
export function parseDateOnly(value: string): Date | undefined {
  const match = DATE_PATTERN.exec(value);
  if (!match) return undefined;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * The inverse of `parseDateOnly`, and the same `yyyy-MM-dd` shape
 * `<input type="date">` speaks. Reads the local calendar fields so the day
 * never drifts across a timezone boundary.
 */
export function formatDateInput(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export interface ScheduleWindow {
  start: Date;
  end: Date;
  durationMinutes: number;
  slotCount: number;
}

/**
 * The single place the picked date and times become real timestamps. The live
 * summary in the form and `toCreateSchedulePayload` both go through this, so the
 * preview can never disagree with what actually gets sent. Returns null until
 * every part is filled in and the window is usable.
 */
export function resolveScheduleWindow(values: {
  date: string;
  startTime: string;
  endTime: string;
}): ScheduleWindow | null {
  const day = parseDateOnly(values.date);
  const startMinutes = timeToMinutes(values.startTime);
  const endMinutes = timeToMinutes(values.endTime);

  if (!day || startMinutes === null || endMinutes === null) return null;
  if (endMinutes <= startMinutes) return null;

  const start = new Date(day);
  start.setHours(0, startMinutes, 0, 0);
  const end = new Date(day);
  end.setHours(0, endMinutes, 0, 0);

  const durationMinutes = endMinutes - startMinutes;

  return {
    start,
    end,
    durationMinutes,
    slotCount: Math.floor(durationMinutes / MINUTES_PER_SLOT),
  };
}

export const CreateScheduleSchema = z
  .object({
    date: z.string().min(1, "Pick a date"),
    startTime: z.string().regex(TIME_PATTERN, "Pick a start time"),
    endTime: z.string().regex(TIME_PATTERN, "Pick an end time"),
    meetingLink: z.url("Please enter a valid meeting link").trim(),
  })
  // A single date field makes "same day" structural, so the only server rules
  // left to mirror are ordering and the minimum window that holds one slot.
  .superRefine((value, ctx) => {
    const start = timeToMinutes(value.startTime);
    const end = timeToMinutes(value.endTime);
    if (start === null || end === null) return;

    if (end <= start) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "End time must be after start time",
      });
      return;
    }

    if (end - start < MINUTES_PER_SLOT) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: `Schedule must be at least ${MINUTES_PER_SLOT} minutes long to fit one slot`,
      });
    }
  });

export type CreateScheduleFormValues = z.infer<typeof CreateScheduleSchema>;

export function toCreateSchedulePayload(
  values: CreateScheduleFormValues,
): CreateSchedulePayload {
  const scheduleWindow = resolveScheduleWindow(values);

  // `handleSubmit` already refuses to run onSubmit while the schema fails, so
  // this is a guard against a caller reaching the mapper directly.
  if (!scheduleWindow) {
    throw new Error(
      "Cannot build a schedule payload from an incomplete window",
    );
  }

  return {
    startDateTime: scheduleWindow.start.toISOString(),
    endDateTime: scheduleWindow.end.toISOString(),
    meetingLink: values.meetingLink,
  };
}
