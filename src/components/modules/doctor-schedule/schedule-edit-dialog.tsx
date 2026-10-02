"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useUpdateSchedule } from "@/hooks";
import type { Schedule } from "@/types";
import { getApiErrorMessage } from "@/utils";
import {
  CreateScheduleSchema,
  formatDateInput,
  MINUTES_PER_SLOT,
  toCreateSchedulePayload,
} from "@/validation";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function valuesFromSchedule(schedule: Schedule) {
  const start = new Date(schedule.startDateTime);
  const end = new Date(schedule.endDateTime);
  return {
    date: formatDateInput(start),
    startTime: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
    endTime: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
    meetingLink: schedule.meetingLink,
  };
}

export function ScheduleEditDialog({
  schedule,
  onClose,
}: {
  schedule: Schedule | null;
  onClose: () => void;
}) {
  const { mutateAsync, isPending } = useUpdateSchedule();
  const form = useForm({
    defaultValues: schedule
      ? valuesFromSchedule(schedule)
      : { date: "", startTime: "", endTime: "", meetingLink: "" },
    validators: { onChange: CreateScheduleSchema },
    onSubmit: async ({ value }) => {
      if (!schedule) return;
      const payload = toCreateSchedulePayload(value);
      try {
        await toast.promise(
          mutateAsync({ scheduleId: schedule.id, ...payload }),
          {
            loading: {
              title: "Saving schedule",
              description: `Windows are split into ${MINUTES_PER_SLOT}-minute slots.`,
            },
            success: {
              title: "Schedule updated",
              description:
                "Open slots were reset to the full window, including any that were already booked.",
            },
            error: (err) => ({
              title: "Could not update the schedule",
              description: getApiErrorMessage(
                err,
                "The window may already be published and booked, overlap another day, or be shorter than 20 minutes.",
              ),
            }),
          },
        );
        onClose();
      } catch {
        // toast.promise has already surfaced the message.
      }
    },
  });

  return (
    <Dialog open={Boolean(schedule)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit schedule</DialogTitle>
          <DialogDescription>
            Saving resets available slots to the full window. A published
            schedule that already has bookings cannot be changed.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="date">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="edit-date">Date</FieldLabel>
                  <Input
                    id="edit-date"
                    type="date"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="startTime">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="edit-start">Start</FieldLabel>
                  <Input
                    id="edit-start"
                    type="time"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="endTime">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="edit-end">End</FieldLabel>
                  <Input
                    id="edit-end"
                    type="time"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
            <form.Field name="meetingLink">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="edit-link">Meeting link</FieldLabel>
                  <Input
                    id="edit-link"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : null}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
