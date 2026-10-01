"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForgotPassword } from "@/hooks";
import { getApiErrorMessage } from "@/utils";
import { ForgotPasswordSchema } from "@/validation";
import { toast } from "../ui/toast";

/**
 * Matches the Redis TTL the backend sets on `forgot_password-otp:<email>`:
 * `EX 300`. Surfaced so the user knows how long the code stays valid — the
 * window is invisible from the response, which carries no expiry.
 */
const OTP_LIFETIME_MINUTES = 5;

export function ForgotPasswordForm({ className }: React.ComponentProps<"div">) {
  const router = useRouter();
  const { mutateAsync: requestOtp, isPending } = useForgotPassword();

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: ForgotPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await toast.promise(requestOtp({ email: value.email }), {
          loading: {
            title: "Sending code",
            description: `Checking ${value.email}`,
          },
          success: {
            title: "Code sent",
            description: `We emailed a 6-digit code to ${value.email}. It is valid for ${OTP_LIFETIME_MINUTES} minutes.`,
          },
          error: (err) => ({
            title: "Could not send the code",
            description: getApiErrorMessage(
              err,
              "Please try again in a moment.",
            ),
          }),
        });

        // The email is carried in the query string because the reset form has no
        // other way to know which account the OTP belongs to, and the backend
        // requires the email alongside it.
        router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
      } catch {
        // toast.promise has already surfaced the message.
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            Enter the email on your account and we&apos;ll send you a code to
            set a new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        id={field.name}
                        type="email"
                        value={field.state.value}
                        placeholder="m@example.com"
                        required
                        autoComplete="email"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <Field>
                <Button
                  type="submit"
                  disabled={isPending}
                  aria-busy={isPending}
                >
                  {isPending ? (
                    <>
                      <Spinner />
                      Sending code...
                    </>
                  ) : (
                    "Send code"
                  )}
                </Button>

                <FieldDescription className="text-center">
                  Remembered it? <Link href="/login">Back to login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
