"use client";

import { cn } from "cn";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useVerifyAccount, useVerifyDoctorAccount } from "@/hooks";
import { getApiErrorMessage } from "@/utils";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { toast } from "../ui/toast";

const RESEND_COOLDOWN = 120;

export function VerifyAccountForm({
  mode = "patient",
}: {
  mode: "doctor" | "patient";
}) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const { mutateAsync: verifyPatient, isPending: verifyPatientPending } =
    useVerifyAccount();
  const { mutateAsync: verifyDoctor, isPending: verifyDoctorPending } =
    useVerifyDoctorAccount();

  const verify = mode === "doctor" ? verifyDoctor : verifyPatient;
  const isVerifying =
    mode === "doctor" ? verifyDoctorPending : verifyPatientPending;

  const router = useRouter();

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }
    const verifyData = {
      email,
      otp,
    };

    try {
      await toast.promise(verify(verifyData), {
        loading: {
          title: "Verifying your account",
        },
        success: {
          title: "Verification successful",
          description:
            mode === "doctor"
              ? "Welcome! An admin will review your application. Watch your email for the result."
              : "Welcome to the healthcare service",
        },
        error: (err) => ({
          title: "Verification failed",
          description: getApiErrorMessage(
            err,
            "That code doesn't look right. Please try again.",
          ),
        }),
      });

      router.push("/");
    } catch {
      // toast.promise already surfaces the error message.
    }
  };

  if (!email) {
    router.push("/");
    return null;
  }
  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Verify your account</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to your email to verify your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="otp-form" onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  aria-disabled
                  id={email}
                  type="email"
                  value={email}
                  placeholder="m@example.com"
                  required
                  disabled
                  autoComplete="off"
                />
              </Field>

              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor="otp">OTP</FieldLabel>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                    setOtp(value);
                    if (isInvalid) {
                      setIsInvalid(false);
                    }
                  }}
                  autoComplete="off"
                  id="otp"
                  name="otp"
                  pattern={REGEXP_ONLY_DIGITS}
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
                  <FieldError
                    errors={[{ message: "Invalid Code, Please try again" }]}
                  />
                )}
              </Field>
              <Field>
                <Button
                  type="submit"
                  form="otp-form"
                  disabled={isVerifying}
                  aria-busy={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Spinner />
                      Verifying
                    </>
                  ) : (
                    "Verify Account"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
          <Field>
            <FieldDescription>Resend OTP in {resendTimer}</FieldDescription>
            <Button disabled={resendTimer > 0} type="submit">
              Resend OTP
            </Button>
          </Field>
        </CardContent>
      </Card>
    </div>
  );
}
