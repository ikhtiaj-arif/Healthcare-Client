"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import type z from "zod";
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
import { useRegistration } from "@/hooks";
import { getApiErrorMessage } from "@/utils";
import { PatientRegistrationZodSchema } from "@/validation";
import { toast } from "../ui/toast";
import { GoogleLoginButton } from "./GoogleLogin";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const { mutateAsync: registration, isPending: registrationPending } =
    useRegistration();
  const router = useRouter();

  type PatientDefaultValues = z.infer<typeof PatientRegistrationZodSchema>;

  const defaultValues: PatientDefaultValues = {
    name: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: PatientRegistrationZodSchema,
    },
    onSubmit: async ({ value }) => {
      const registrationData = {
        name: value.name,
        email: value.email,
        password: value.password,
        patient: {
          contactNumber: value.contactNumber,
        },
      };

      try {
        await toast.promise(registration(registrationData), {
          loading: {
            title: "Creating your account",
            description: "This will only take a moment.",
          },
          success: {
            title: "Registration successful",
            description: "Please verify your account",
          },
          error: (err) => ({
            title: "Registration failed",
            description: getApiErrorMessage(
              err,
              "We couldn't create your account. Please try again.",
            ),
          }),
        });

        const params = new URLSearchParams({
          email: registrationData.email,
        });
        router.push(`/register/verify-account?${params.toString()}`);
      } catch {
        // toast.promise already surfaces the error message.
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
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
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                      <Input
                        onChange={(e) => field.handleChange(e.target.value)}
                        id={field.name}
                        type="text"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        placeholder="John Doe"
                        required
                        autoComplete="off"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="contactNumber">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Phone</FieldLabel>
                      <Input
                        onChange={(e) => field.handleChange(e.target.value)}
                        id={field.name}
                        type="tel"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        placeholder="+8801XXXXXXXXX"
                        // required
                        autoComplete="off"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        onChange={(e) => field.handleChange(e.target.value)}
                        id={field.name}
                        type={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        placeholder="m@example.com"
                        required
                        autoComplete="off"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <div className="relative">
                        <Input
                          onChange={(e) => field.handleChange(e.target.value)}
                          id={field.name}
                          type={showPassword ? "text" : "password"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          placeholder="••••••••"
                          required
                          autoComplete="off"
                          aria-invalid={isInvalid}
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1
                       text-gray-400 transition hover:text-gray-600 focus:outline-none
                       disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeClosed className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
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
                      <FieldLabel htmlFor={field.name}>
                        Confirm Password
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          onChange={(e) => field.handleChange(e.target.value)}
                          id={field.name}
                          type={showConfirmPassword ? "text" : "password"}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          placeholder="••••••••"
                          required
                          autoComplete="off"
                          aria-invalid={isInvalid}
                        />
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1
                       text-gray-400 transition hover:text-gray-600 focus:outline-none
                       disabled:cursor-not-allowed disabled:opacity-50"
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeClosed className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
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
                  disabled={registrationPending}
                  aria-busy={registrationPending}
                >
                  {registrationPending ? (
                    <>
                      <Spinner />
                      Registering
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>

                <FieldDescription className="text-center">
                  Already have an account? <Link href="/login">Login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>

          <GoogleLoginButton />
        </CardContent>
      </Card>
    </div>
  );
}
