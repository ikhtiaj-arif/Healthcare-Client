import { z } from "zod";
import type { CreateSchedulePayload } from "@/types";

export const MINUTES_PER_SLOT = 20;

export const CreateScheduleSchema = z
  .object({
    startDateTime: z
      .string()
      .min(1, "Start date and time is required")
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: "Invalid start date and time",
      }),
    endDateTime: z
      .string()
      .min(1, "End date and time is required")
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: "Invalid end date and time",
      }),
    meetingLink: z.url("Please enter a valid meeting link").trim(),
  })
  // The server rejects a start after the end, a window that crosses midnight,
  // and any window too short to hold a single slot, so mirror those rules here
  // instead of waiting for a round trip.
  .superRefine((value, ctx) => {
    const start = new Date(value.startDateTime);
    const end = new Date(value.endDateTime);

    if (start.getTime() >= end.getTime()) {
      ctx.addIssue({
        code: "custom",
        path: ["endDateTime"],
        message: "End date and time must be after start date and time",
      });
      return;
    }

    if (start.toDateString() !== end.toDateString()) {
      ctx.addIssue({
        code: "custom",
        path: ["endDateTime"],
        message: "Start and end must be on the same day",
      });
      return;
    }

    if (end.getTime() - start.getTime() < MINUTES_PER_SLOT * 60_000) {
      ctx.addIssue({
        code: "custom",
        path: ["endDateTime"],
        message: `Schedule must be at least ${MINUTES_PER_SLOT} minutes long to fit one slot`,
      });
    }
  });

export type CreateScheduleFormValues = z.infer<typeof CreateScheduleSchema>;

export function toCreateSchedulePayload(
  values: CreateScheduleFormValues,
): CreateSchedulePayload {
  return {
    startDateTime: new Date(values.startDateTime).toISOString(),
    endDateTime: new Date(values.endDateTime).toISOString(),
    meetingLink: values.meetingLink,
  };
}
