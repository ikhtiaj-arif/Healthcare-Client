"use client";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import TablePagination from "@/components/ui/table-pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllDoctors } from "@/hooks";
import useDebounce from "@/hooks/debounce.hook";
import type { DoctorParams } from "@/types";
import {
  type ApplicationStatus,
  mapDoctorToApplication,
} from "./doctor-approval.data";
import { DoctorApprovalTable } from "./doctor-approval-table";

type TabValue = "all" | ApplicationStatus;

const PAGE_SIZE = 10;

const tabs: { value: TabValue; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "all", label: "All" },
];

export function DoctorApprovalTabs() {
  const [tab, setTab] = useState<TabValue>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);

  const activeStatus = tab === "all" ? undefined : tab;

  const params: DoctorParams = {
    page,
    limit: PAGE_SIZE,
    verificationStatus: activeStatus,
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
  };

  const { data, isPending } = useGetAllDoctors(params);

  const applications = (data?.data ?? []).map(mapDoctorToApplication);
  const meta = data?.meta;

  return (
    <>
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-6"
        />
      </div>
      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value as TabValue);
          setPage(1);
        }}
      >
        <TabsList variant="line">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <DoctorApprovalTable
              applications={applications}
              isPending={isPending}
            />
          </TabsContent>
        ))}
      </Tabs>
      <TablePagination
        totalPages={meta?.totalPages ?? 0}
        handlePageChange={setPage}
        page={page}
      />
    </>
  );
}
