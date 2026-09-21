"use client"
import React, { ReactNode, useEffect } from "react";
import AuthLoading from "./auth-loading";

import { useGetMe } from "@/hooks";
import { UserRole } from "@/types";
import AccessDenied from "./access-denied";
import { useRouter } from "next/navigation";

interface IProps {
  children: ReactNode;
  roles: UserRole[];
}
const RoleGuard = ({ children, roles }: IProps) => {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();
  const user = data?.data;

  const isAuthorized = !!user && roles.includes(user.role);

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
  
  if (isAuthorized) {
    return <>{children}</>;
  }

  return <AccessDenied />;
};

export default RoleGuard;
