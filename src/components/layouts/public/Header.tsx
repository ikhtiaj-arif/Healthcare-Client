"use client";
import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { USER_QUERY_KEY, useGetMe, useLogout } from "@/hooks";
import { UserRole } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const routes = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Today", path: "/doctors/available-today" },
    { name: "About", path: "/about-us" },
    { name: "Contact", path: "/contact" },
  ];

  const dashboardRoutes: Record<UserRole, string> = {
    SUPER_ADMIN: "/admin",
    ADMIN: "/admin",
    DOCTOR: "/doctor",
    PATIENT: "/dashboard",
  };

  const { data, isLoading } = useGetMe();
  const { mutate: logout, isPending } = useLogout();
  const queryClient = useQueryClient();
  const router = useRouter();

  const role: UserRole | undefined = data?.data?.role;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: USER_QUERY_KEY });
        toast.add({
          title: "Logout Successful",
          description: "You have been logged out successfully.",
          type: "success",
        });
        router.push("/login");
      },
      onError: () => {
        toast.add({
          title: "Logout failed",
          description: "Something went wrong.",
          type: "error",
        });
      },
    });
  };

  return (
    <header className="w-full h-16  border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 h-full ">
        <h1 className="text-lg flex items-center  font-bold">
          <Logo />
          HealthCare Service
        </h1>
        <div className="flex gap-4 items-center justify-center">
          {routes.map((route) => (
            <Link href={route.path} key={route.path}>
              {route.name}
            </Link>
          ))}
          {role && <Link href={dashboardRoutes[role]}>Dashboard</Link>}
        </div>
        <div>
          {isLoading ? (
            <Button variant="outline" size="xs" disabled>
              Login
            </Button>
          ) : data ? (
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="xs"
              disabled={isPending}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              size="xs"
              render={<Link href="/login" />}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
