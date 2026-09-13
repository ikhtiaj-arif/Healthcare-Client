"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { FieldSeparator } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks";

export function GoogleLoginButton({
  redirectTo = "/",
}: {
  redirectTo?: string;
}) {
  const router = useRouter();
  const { mutate: googleLogin } = useGoogleOAuth();

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.add({
        title: "Google OAuth Failed",
        description: "Something went wrong, please try again.",
        type: "error",
      });
      return;
    }
    googleLogin(
      { idToken },
      {
        onSuccess: () => {
          toast.add({
            title: "Logged in successfully",
            description: "Welcome back.",
            type: "success",
          });
          router.push(redirectTo);
        },
        onError: (err) => {
          toast.add({
            title: "Google OAuth Failed",
            description:
              err.message || "Something went wrong, please try again.",
            type: "error",
          });
        },
      },
    );
  };

  const handleGoogleError = () => {
    toast.add({
      title: "Google OAuth Failed",
      description: "Something went wrong, please try again.",
    });
  };

  return (
    <>
      <FieldSeparator className="my-2">Or</FieldSeparator>
      <GoogleLogin
        theme="outline"
        shape="rectangular"
        text="continue_with"
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
    </>
  );
}
