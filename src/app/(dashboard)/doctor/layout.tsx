/** biome-ignore-all lint/a11y/useValidAriaRole: <explanation> */
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboars-shell";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return <RoleGuard roles={[  "DOCTOR"]}>
    <DashboardShell role="DOCTOR">{children}</DashboardShell>
    </RoleGuard>;
};

export default layout;
