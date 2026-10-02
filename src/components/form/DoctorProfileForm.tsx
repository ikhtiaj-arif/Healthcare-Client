"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useUpdateMyDoctorProfile } from "@/hooks";
import type { DoctorProfileSummary, UpdateDoctorProfilePayload } from "@/types";
import { getApiErrorMessage } from "@/utils";
import { doctorProfileSchema } from "@/validation";

export function DoctorProfileForm({
  doctor,
}: {
  doctor: DoctorProfileSummary;
}) {
  const { mutateAsync, isPending } = useUpdateMyDoctorProfile();

  const form = useForm({
    defaultValues: {
      address: doctor.address ?? "",
      bio: doctor.bio ?? "",
      consultationFee: doctor.consultationFee ?? "",
      contactNumber: doctor.contactNumber ?? "",
    },
    validators: {
      onSubmit: doctorProfileSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: UpdateDoctorProfilePayload = {
        address: value.address.trim(),
        bio: value.bio.trim(),
        contactNumber: value.contactNumber.trim(),
      };
      const fee = value.consultationFee.trim();
      if (fee !== "") {
        payload.consultationFee = Number(fee);
      }

      try {
        await toast.promise(mutateAsync(payload), {
          loading: {
            title: "Saving profile",
            description: "Updating your doctor details.",
          },
          success: {
            title: "Profile saved",
            description: "Your public details have been updated.",
          },
          error: (err) => ({
            title: "Could not save",
            description: getApiErrorMessage(
              err,
              "Please check the fields and try again.",
            ),
          }),
        });
      } catch {
        // toast.promise has already surfaced the message.
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="contactNumber">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Contact number</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  autoComplete="tel"
                  aria-invalid={isInvalid}
                />
                {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="address">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  autoComplete="street-address"
                  aria-invalid={isInvalid}
                />
                {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="consultationFee">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Consultation fee</FieldLabel>
                <Input
                  id={field.name}
                  inputMode="decimal"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="bio">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  rows={5}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
              </Field>
            );
          }}
        </form.Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Saving
            </>
          ) : (
            "Save doctor profile"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
