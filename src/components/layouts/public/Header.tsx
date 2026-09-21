"use client";
import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGetMe, useLogout } from "@/hooks";
import { UserRole } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

const Header = () => {
  const routes = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const dashboardRoutes: Record<UserRole, string> = {
    SUPER_ADMIN: "/admin",
    ADMIN: "/admin",
    DOCTOR: "/doctor",
    PATIENT: "/patient",
  };

  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const role: UserRole = !!data?.data && data?.data?.role;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.add({
          title: "Logout Successful",
          description: "You have been logged out successfully.",
          type: "success",
        });
        queryClient.removeQueries({ queryKey: ["user"] });
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
          {!isLoading && !data ? (
            <Button variant="outline" size="xs">
              <Link href="/login">Login</Link>
            </Button>
          ) : (
            <Button onClick={handleLogout} variant="destructive" size="xs">
              <Link href="/login">Logout</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
