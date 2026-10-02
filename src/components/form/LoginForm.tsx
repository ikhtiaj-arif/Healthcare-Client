"use client";

import { useForm } from "@tanstack/react-form";
import { cn } from "cn";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
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
import { useLogin } from "@/hooks";
import { LoginSchema } from "@/validation";
import { Spinner } from "../ui/spinner";
import { toast } from "../ui/toast";
import { GoogleLoginButton } from "./GoogleLogin";

/**
 * Reads `?redirect=` and returns a destination that is safe to navigate to.
 *
 * Only same-origin absolute paths are accepted. Without this check the param
 * would be an open redirect: /login?redirect=https://evil.example would send a
 * freshly authenticated user off-site.
 */
function useSafeRedirectParam(fallback: string) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  if (!redirect) return fallback;
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return fallback;

  return redirect;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();
  const redirectTo = useSafeRedirectParam("/");
  const { mutate: login, isPending: loginPending } = useLogin();
  const form = useForm({
    defaultValues: {
      // Left empty deliberately. These fields used to ship the super-admin's
      // credentials as `defaultValues`, which put a working super-admin login in
      // the production bundle for anyone to read in the JS source. Never seed
      // real credentials into a client component — if you need a test account,
      // put it in a git-ignored env var.
      email: "",
      password: "",
    },
    validators: {
      onSubmit: LoginSchema,
    },
    onSubmit: ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password,
      };

      login(loginData, {
        onSuccess: (_res) => {
          toast.add({
            title: "Login Successful",
            description: "Welcome Back",
            type: "success",
          });
          router.push(redirectTo);
        },
        onError: (err) => {
          toast.add({
            title: "Login Failed",
            description: err.message || "An error occurred",
            type: "error",
          });
        },
      });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
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
                      <div className="flex items-center">
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Link
                          href="/forgot-password"
                          className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
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

              <Field>
                <Button disabled={loginPending} type="submit">
                  {loginPending ? (
                    <>
                      <Spinner />
                      Submitting...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

                <FieldDescription className="text-center">
                  Don&apos;t have an account?{" "}
                  <Link href="/register">Sign up</Link>
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
