"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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
import { useResetPassword } from "@/hooks";
import { getApiErrorMessage } from "@/utils";
import { ResetPasswordSchema } from "@/validation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { toast } from "../ui/toast";

export function ResetPasswordForm({ className }: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const form = useForm({
    defaultValues: {
      email,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: ResetPasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await toast.promise(
          resetPassword({
            email: value.email,
            otp: value.otp,
            newPassword: value.newPassword,
          }),
          {
            loading: { title: "Updating your password" },
            success: {
              title: "Password updated",
              description: "Sign in again with your new password.",
            },
            error: (err) => ({
              title: "Could not update your password",
              description: getApiErrorMessage(
                err,
                "That code doesn't look right, or it has expired.",
              ),
            }),
          },
        );

        // Deliberately not treated as a completed sign-in: the backend deletes
        // the Redis OTP key but never revokes the accessToken/refreshToken
        // cookies, so a session opened before the reset is still live. Sending
        // the user to /login makes them prove the new password works.
        router.push("/login");
      } catch {
        // toast.promise has already surfaced the message.
      }
    },
  });

  // The email is only ever known from ?email=, and the backend requires it
  // alongside the OTP. Without it there is nothing to reset, so send them back
  // to the step that can produce it.
  if (!email) {
    router.replace("/forgot-password");
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>
            Enter the 6-digit code we emailed to {email}, then choose a new
            password
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
                {(field) => (
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      required
                      readOnly
                      aria-readonly
                      autoComplete="email"
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="otp">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="otp">Code</FieldLabel>
                      <InputOTP
                        maxLength={6}
                        value={field.state.value}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        id={field.name}
                        name={field.name}
                        pattern={REGEXP_ONLY_DIGITS}
                        autoComplete="one-time-code"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="newPassword">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="newPassword">
                        New password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          value={field.state.value}
                          placeholder="••••••••"
                          required
                          autoComplete="new-password"
                          aria-invalid={isInvalid}
                        />
                        <ShowPasswordButton
                          isVisible={showPassword}
                          onToggle={() => setShowPassword((prev) => !prev)}
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="confirmPassword">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm new password
                      </FieldLabel>
                      <Input
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        id={field.name}
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        placeholder="••••••••"
                        required
                        autoComplete="new-password"
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
                      Updating...
                    </>
                  ) : (
                    "Update password"
                  )}
                </Button>

                <FieldDescription className="text-center">
                  Did not get a code?{" "}
                  <Link href="/forgot-password">Send it again</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ShowPasswordButton({
  isVisible,
  onToggle,
}: {
  isVisible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition hover:text-gray-600 focus:outline-none"
      type="button"
      onClick={onToggle}
      // The icon is the only content, so it needs an accessible name that says
      // which way the toggle currently points.
      aria-label={isVisible ? "Hide password" : "Show password"}
      aria-pressed={isVisible}
    >
      {isVisible ? (
        <EyeClosed className="size-4" />
      ) : (
        <Eye className="size-4" />
      )}
    </button>
  );
}
