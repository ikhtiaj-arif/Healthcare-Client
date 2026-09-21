"use client";

import { useGetMe } from "@/hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();
  const user = data?.data;

  useEffect(() => {
    if (isPending) {
      return;
    } else if (isError && !user) {
      router.replace("/login");
    }
  }, [isError, isPending, user, router]);

  if (isPending) {
    return <AuthLoading />;
  }
  if (isError && !user) {
    return <AuthLoading label="Redirecting..." />;
  }

  return <>{children}</>;
};

export default AuthGuard;
