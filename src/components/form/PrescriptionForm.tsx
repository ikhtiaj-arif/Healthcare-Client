"use client";

import { useForm } from "@tanstack/react-form";
import { Plus, Trash2 } from "lucide-react";
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
import { useCreatePrescription } from "@/hooks";
import { getApiErrorMessage } from "@/utils";
import { EMPTY_MEDICINE, prescriptionSchema } from "@/validation";

export function PrescriptionForm({ appointmentId }: { appointmentId: string }) {
  const { mutateAsync, isPending } = useCreatePrescription();

  const form = useForm({
    defaultValues: {
      appointmentId,
      findings: "",
      medicines: [{ ...EMPTY_MEDICINE }],
    },
    validators: {
      onSubmit: prescriptionSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await toast.promise(
          mutateAsync({
            appointmentId: value.appointmentId,
            findings: value.findings.trim(),
            medicines: value.medicines.map((medicine) => ({
              name: medicine.name.trim(),
              dosage: medicine.dosage.trim(),
              duration: medicine.duration.trim(),
              instructions: medicine.instructions?.trim() || undefined,
            })),
          }),
          {
            loading: {
              title: "Writing prescription",
              description: "Building the PDF and emailing it to the patient.",
            },
            success: {
              title: "Prescription sent",
              description: "The patient can open the PDF from this appointment.",
            },
            error: (err) => ({
              title: "Could not write the prescription",
              description: getApiErrorMessage(
                err,
                "This visit may not be completed, or a prescription already exists.",
              ),
            }),
          },
        );
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
      className="flex flex-col gap-4"
    >
      <div>
        <h3 className="text-sm font-semibold">Write a prescription</h3>
        <p className="text-xs text-muted-foreground">
          This creates a PDF. It cannot be edited after it is sent.
        </p>
      </div>
      <FieldGroup>
        <form.Field name="findings">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Findings</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  rows={4}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="medicines" mode="array">
          {(field) => (
            <div className="flex flex-col gap-3">
              {field.state.value.map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 border p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold tracking-wider uppercase">
                      Medicine {index + 1}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={field.state.value.length === 1}
                      onClick={() => field.removeValue(index)}
                    >
                      <Trash2 />
                      Remove
                    </Button>
                  </div>
                  {(
                    [
                      ["name", "Name"],
                      ["dosage", "Dosage"],
                      ["duration", "Duration"],
                      ["instructions", "Instructions"],
                    ] as const
                  ).map(([key, label]) => (
                    <form.Field
                      key={key}
                      name={`medicines[${index}].${key}`}
                    >
                      {(medicineField) => {
                        const isInvalid =
                          medicineField.state.meta.isTouched &&
                          !medicineField.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={`${key}-${index}`}>
                              {label}
                            </FieldLabel>
                            <Input
                              id={`${key}-${index}`}
                              value={medicineField.state.value ?? ""}
                              onBlur={medicineField.handleBlur}
                              onChange={(event) =>
                                medicineField.handleChange(event.target.value)
                              }
                              aria-invalid={isInvalid}
                            />
                            {isInvalid ? (
                              <FieldError
                                errors={medicineField.state.meta.errors}
                              />
                            ) : null}
                          </Field>
                        );
                      }}
                    </form.Field>
                  ))}
                </div>
              ))}
              {field.state.meta.errors.length > 0 ? (
                <FieldError errors={field.state.meta.errors} />
              ) : null}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => field.pushValue({ ...EMPTY_MEDICINE })}
              >
                <Plus />
                Add medicine
              </Button>
            </div>
          )}
        </form.Field>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Sending
            </>
          ) : (
            "Send prescription"
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
