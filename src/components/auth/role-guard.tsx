"use client";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { useGetMe } from "@/hooks";
import { UserRole } from "@/types";
import AccessDenied from "./access-denied";
import AuthLoading from "./auth-loading";
import ProfileMissing from "./profile-missing";

interface IProps {
  children: ReactNode;
  roles: UserRole[];
}
const RoleGuard = ({ children, roles }: IProps) => {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();
  const user = data?.data;

  const isAuthorized = !!user && roles.includes(user.role);

  // A DOCTOR without a doctors row passes the role check but has nothing to
  // show, so explain it here instead of letting every request 403.
  const isDoctorWithoutProfile =
    !!user && user.role === "DOCTOR" && !user.doctor;

  useEffect(() => {
    if (isPending) {
      return;
    } else if (isError || !user) {
      router.replace("/login");
    }
  }, [isError, isPending, user, router]);

  if (isPending) {
    return <AuthLoading />;
  }
  if (isError || !user) {
    return <AuthLoading label="Redirecting..." />;
  }

  if (isAuthorized && isDoctorWithoutProfile) {
    return <ProfileMissing />;
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return <AccessDenied />;
};

export default RoleGuard;
