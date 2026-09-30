/** biome-ignore-all lint/a11y/useValidAriaRole: `role` is DashboardShell's own UserRole prop, not an ARIA role; doctor and admin layouts carry the same suppression. */
import type { ReactNode } from "react";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboars-shell";

/**
 * Patient area, renamed from /patient to /dashboard.
 *
 * RoleGuard is what makes this route safe: without it committed alongside the
 * pages under it, `/dashboard/my-appointments` would render with no auth check
 * at all, because AuthGuard lives in the parent `(dashboard)` layout but
 * nothing here would restrict the role.
 */
const layout = ({ children }: { children: ReactNode }) => {
  return (
    <RoleGuard roles={["PATIENT"]}>
      <DashboardShell role="PATIENT">{children}</DashboardShell>
    </RoleGuard>
  );
};

export default layout;
