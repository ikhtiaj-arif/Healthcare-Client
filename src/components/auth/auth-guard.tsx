"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetMe } from "@/hooks";
import AuthLoading from "./auth-loading";

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();
  const user = data?.data;

  useEffect(() => {
    if (isPending) {
      return;
    } else if (isError && !user) {
      // The api client deliberately does not redirect on 401, so this is the
      // only place a session loss turns into a navigation. Read the current URL
      // from window rather than useSearchParams: this layout is statically
      // exported, and useSearchParams would force a Suspense boundary around the
      // whole dashboard just to save the query string. It runs in an effect, so
      // window is always defined here.
      const { pathname, search } = window.location;
      const target = `${pathname}${search}`;
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
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
