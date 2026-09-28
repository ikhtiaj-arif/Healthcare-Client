"use client";

import { useForm } from "@tanstack/react-form";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useCreateSchedule } from "@/hooks";
import { getApiErrorMessage } from "@/utils";
import {
  type CreateScheduleFormValues,
  CreateScheduleSchema,
  MINUTES_PER_SLOT,
  toCreateSchedulePayload,
} from "@/validation";

const defaultValues: CreateScheduleFormValues = {
  startDateTime: "",
  endDateTime: "",
  meetingLink: "",
};

export function CreateScheduleForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutateAsync: createSchedule, isPending } = useCreateSchedule();

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
        onSuccess?.();
      } catch {
        // toast.promise already surfaces the error message.
      }
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="startDateTime">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Starts at</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="datetime-local"
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

        <form.Field name="endDateTime">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Ends at</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="datetime-local"
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
                {isInvalid && (
                  <FieldError errors={field.state.meta.errors} />
                )}
                {!isInvalid && (
                  <FieldDescription>
                    Shared with patients once the schedule is published.
                  </FieldDescription>
                )}
              </Field>
            );
          }}
        </form.Field>

        <Field>
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
          <FieldDescription>
            Start and end must fall on the same day, and the window needs to be
            at least {MINUTES_PER_SLOT} minutes to fit a single slot. One
            schedule per day.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
