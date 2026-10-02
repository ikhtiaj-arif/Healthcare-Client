/** biome-ignore-all lint/a11y/useValidAriaRole: `role` is DashboardShell's own UserRole prop, not an ARIA role. */
import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <RoleGuard roles={["ADMIN", "SUPER_ADMIN"]}>
      <DashboardShell role="ADMIN">{children}</DashboardShell>
    </RoleGuard>
  );
};

export default layout;
