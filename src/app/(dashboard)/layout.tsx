import type { ReactNode } from "react";
import AuthGuard from "@/components/auth/auth-guard";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default DashboardLayout;
