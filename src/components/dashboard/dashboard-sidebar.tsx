"use client";

import Logo from "@/assets/svg/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { USER_QUERY_KEY, useGetMe, useLogout } from "@/hooks";
import { adminRoutes, doctorRoutes, patientRoutes } from "@/routes";
import type { UserRole } from "@/types";
import type { SidebarItems } from "@/types/sidebar.type";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const sidebarRoutes: Record<UserRole, SidebarItems> = {
  ADMIN: adminRoutes,
  SUPER_ADMIN: adminRoutes,
  DOCTOR: doctorRoutes,
  PATIENT: patientRoutes,
};

/**
 * Section roots (`/admin`, `/doctor`, `/dashboard`) are exact matches so the
 * overview stays unselected on a nested page. Every other real path highlights
 * on itself and on anything beneath it. `#` is never a destination.
 */
function isNavActive(pathname: string, url: string) {
  if (url === "#" || url.length === 0) {
    return false;
  }
  if (url === "/admin" || url === "/doctor" || url === "/dashboard") {
    return pathname === url;
  }
  return pathname === url || pathname.startsWith(`${url}/`);
}

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathName = usePathname();
  const router = useRouter();
  const routes = sidebarRoutes[role];
  const { data } = useGetMe();
  const user = data?.data;
  const { mutate: logout, isPending } = useLogout();
  const queryClient = useQueryClient();

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
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <h1 className="flex items-center text-lg font-bold">
            <Logo />
            HealthCare Service
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {routes.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((navItem) => (
                  <SidebarMenuItem key={navItem.title}>
                    <SidebarMenuButton
                      render={<Link href={navItem.url} />}
                      isActive={isNavActive(pathName, navItem.url)}
                    >
                      {navItem.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-2 px-2 py-2 text-left text-sm hover:bg-sidebar-accent">
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">
                {user?.name ?? "Account"}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {user?.email ?? role}
              </span>
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel>{user?.email ?? "Signed in"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={isPending}
              onClick={handleLogout}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
