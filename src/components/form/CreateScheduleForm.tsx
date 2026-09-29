"use client";

import { useForm, useStore } from "@tanstack/react-form";
import { CalendarClock, ChevronDownIcon, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useCreateSchedule } from "@/hooks";
import { getApiErrorMessage } from "@/utils";
import {
  type CreateScheduleFormValues,
  CreateScheduleSchema,
  formatDateInput,
  MINUTES_PER_SLOT,
  parseDateOnly,
  resolveScheduleWindow,
  toCreateSchedulePayload,
} from "@/validation";

const defaultValues: CreateScheduleFormValues = {
  date: "",
  startTime: "",
  endTime: "",
  meetingLink: "",
};

const TIME_INPUT_STEP = 300;

function formatDuration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  if (!rest) return `${hours} hr`;
  return `${hours} hr ${rest} min`;
}

/**
 * Live preview of what the picked pieces resolve to. It reads the same
 * `resolveScheduleWindow` helper the submit mapper uses, so the summary can
 * never promise a window the payload will not contain.
 */
function ScheduleSummary({ values }: { values: CreateScheduleFormValues }) {
  const scheduleWindow = useMemo(() => resolveScheduleWindow(values), [values]);

  if (!scheduleWindow) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
        Pick a date, a start time and an end time to preview the booking window.
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Date</dt>
          <dd className="text-right font-medium">
            {scheduleWindow.start.toLocaleDateString(undefined, {
              dateStyle: "full",
            })}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Window</dt>
          <dd className="text-right font-medium">
            {scheduleWindow.start.toLocaleTimeString(undefined, {
              timeStyle: "short",
            })}
            {" – "}
            {scheduleWindow.end.toLocaleTimeString(undefined, {
              timeStyle: "short",
            })}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Duration</dt>
          <dd className="text-right font-medium">
            {formatDuration(scheduleWindow.durationMinutes)}
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap gap-2 border-t pt-3">
        <span className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-2.5 py-1 text-sm text-primary">
          <CalendarClock className="size-3.5" />
          {scheduleWindow.slotCount}{" "}
          {scheduleWindow.slotCount === 1 ? "slot" : "slots"} ·{" "}
          {MINUTES_PER_SLOT} min each
        </span>
      </div>
    </div>
  );
}

export function CreateScheduleForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutateAsync: createSchedule, isPending } = useCreateSchedule();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm({
    defaultValues,
    validators: {
      onChange: CreateScheduleSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await toast.promise(createSchedule(toCreateSchedulePayload(value)), {
          loading: {
            title: "Creating schedule",
            description: "Hold tight while we set up your slots.",
          },
          success: {
            title: "Schedule created",
            description:
              "It is saved as a draft. Publish it when you are ready to take bookings.",
          },
          error: (err) => ({
            title: "Schedule creation failed",
            description: getApiErrorMessage(
              err,
              "We couldn't create this schedule. Please try again.",
            ),
          }),
        });

        form.reset();
        setCalendarOpen(false);
        onSuccess?.();
      } catch {
        // toast.promise already surfaces the error message.
      }
    },
  });

  // `values` keeps a stable identity while only field meta changes, so this
  // re-renders the summary on real edits instead of every keystroke's meta churn.
  const values = useStore(form.store, (state) => state.values);

  return (
    <form
      className="flex min-h-0 flex-col"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="flex min-h-0 flex-col gap-6 overflow-y-auto px-6 py-6">
        <FieldGroup className="gap-5">
          <form.Field name="date">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const selected = parseDateOnly(field.state.value);

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger
                      render={
                        <Button
                          id={field.name}
                          variant="outline"
                          aria-invalid={isInvalid}
                          data-empty={!selected}
                          className="h-10 w-full justify-between font-normal tracking-normal normal-case data-[empty=true]:text-muted-foreground"
                        />
                      }
                    >
                      {selected ? (
                        selected.toLocaleDateString(undefined, {
                          dateStyle: "full",
                        })
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <ChevronDownIcon data-icon="inline-end" />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selected}
                        defaultMonth={selected}
                        onSelect={(next) => {
                          field.handleChange(next ? formatDateInput(next) : "");
                          field.handleBlur();
                          if (next) setCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <div className="grid grid-cols-2 gap-4">
            <form.Field name="startTime">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Starts at</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="time"
                      step={TIME_INPUT_STEP}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="endTime">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Ends at</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="time"
                      step={TIME_INPUT_STEP}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>

          <form.Field name="meetingLink">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Meeting link</FieldLabel>
                  <div className="relative">
                    <Video className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      className="pl-9"
                      autoComplete="url"
                    />
                  </div>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  {!isInvalid && (
                    <FieldDescription>
                      Shared with patients once the schedule is published.
                    </FieldDescription>
                  )}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>

        <ScheduleSummary values={values} />

        <FieldDescription>
          One schedule per day. The window must be at least {MINUTES_PER_SLOT}{" "}
          minutes long to fit a single slot.
        </FieldDescription>
      </div>

      <DialogFooter className="shrink-0 gap-3 border-t bg-muted/30 pt-4">
        <DialogClose render={<Button type="button" variant="outline" />}>
          Cancel
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Creating...
            </>
          ) : (
            "Create schedule"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
