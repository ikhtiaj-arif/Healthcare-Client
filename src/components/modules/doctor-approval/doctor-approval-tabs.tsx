"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllDoctors } from "@/hooks";
import type { DoctorParams } from "@/types";
import {
  type ApplicationStatus,
  mapDoctorToApplication,
} from "./doctor-approval.data";
import { DoctorApprovalTable } from "./doctor-approval-table";
import useDebounce from "@/hooks/debounce.hook";
import TablePagination from "@/components/ui/table-pagination";

type TabValue = "all" | ApplicationStatus;

const tabs: { value: TabValue; label: string; status?: ApplicationStatus }[] = [
  { value: "PENDING", label: "Pending", status: "PENDING" },
  { value: "APPROVED", label: "Approved", status: "APPROVED" },
  { value: "REJECTED", label: "Rejected", status: "REJECTED" },
  { value: "all", label: "All" },
];

export function DoctorApprovalTabs() {
  const [tab, setTab] = useState<TabValue>("all");
  const [search, setSearch] = useState("");
  // const [debouncedSearch, setDebouncedSearch] = useState("");

  // useEffect(() => {
  //   const timer = setTimeout(() => setDebouncedSearch(search.trim()), 500);
  //   return () => clearTimeout(timer);
  // }, [search]);

  const debouncedSearch =  useDebounce(search)

  const params: DoctorParams = debouncedSearch
    ? { searchTerm: debouncedSearch }
    : {};
  const { data, isPending } = useGetAllDoctors(params);

  const applications = (data?.data ?? []).map(mapDoctorToApplication);

  return (
    <>
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-6"
        />
      </div>
      <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)}>
        <TabsList variant="line">
          {tabs.map((tab) => {
            const count = tab.status
              ? applications.filter((a) => a.status === tab.status).length
              : applications.length;
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
                <span className="ml-1.5 rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                  {count}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {tabs.map((tab) => {
          const applicationsForTab = tab.status
            ? applications.filter((a) => a.status === tab.status)
            : applications;
          return (
            <TabsContent key={tab.value} value={tab.value}>
              <DoctorApprovalTable
                applications={applicationsForTab}
                isPending={isPending}
              />
            </TabsContent>
          );
        })}
      </Tabs>
      <TablePagination />
    </>
  );
}
