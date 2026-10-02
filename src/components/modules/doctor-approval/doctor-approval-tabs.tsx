"use client";

import { useEffect, useState } from "react";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import TablePagination from "@/components/ui/table-pagination";
import { useDebounce, useGetAllDoctors, useListState } from "@/hooks";
import type { ApplicationStatus, DoctorParams, DoctorSortField } from "@/types";
import { mapDoctorToApplication } from "./doctor-approval.data";
import { DoctorApprovalTable } from "./doctor-approval-table";

type TabValue = "all" | ApplicationStatus;

const PAGE_SIZE = 10;

/**
 * Defaults double as the URL param names, so a link can carry any of them.
 *
 * Typed explicitly rather than `as const`: a const assertion would narrow
 * `tab` to the literal "all" and `sortBy` to "createdAt", so reading state back
 * would claim they can only ever hold those values and writing a different one
 * would not typecheck.
 *
 * Module-level, so the object identity is stable across renders.
 */
const DEFAULTS: {
  tab: TabValue;
  searchTerm: string;
  sortBy: DoctorSortField;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
} = {
  tab: "all",
  searchTerm: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: PAGE_SIZE,
};

const tabs: { value: TabValue; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "all", label: "All" },
];

export function DoctorApprovalTabs() {
  const { state, setState } = useListState({ defaults: DEFAULTS });
  const activeStatus = state.tab === "all" ? undefined : state.tab;

  // The search box keeps its own state and only writes to the URL once the
  // keystrokes settle. Typing straight into the query string would fire a
  // request per character; the local copy also keeps the input responsive
  // between the keystroke and the round trip.
  const [searchInput, setSearchInput] = useState(state.searchTerm);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Push the settled value into the URL. setState and state.searchTerm are both
  // dependencies, so this also re-runs when the URL changes; the equality guard
  // makes that a no-op, which is what stops the write and the read from
  // ping-ponging.
  useEffect(() => {
    if (debouncedSearch !== state.searchTerm) {
      setState({ searchTerm: debouncedSearch });
    }
  }, [debouncedSearch, state.searchTerm, setState]);

  // Follow the URL when it changes from somewhere else, i.e. the back button, so
  // the box does not drift out of sync with the results underneath it.
  useEffect(() => {
    setSearchInput(state.searchTerm);
  }, [state.searchTerm]);

  const params: DoctorParams = {
    page: state.page,
    limit: state.limit,
    verificationStatus: activeStatus,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    ...(debouncedSearch ? { searchTerm: debouncedSearch } : {}),
  };

  const { data, isPending, isError } = useGetAllDoctors(params);

  const applications = (data?.data ?? []).map(mapDoctorToApplication);
  const meta = data?.meta;

  return (
    <>
      <DataTableToolbar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Search by name or email"
        statusTabs={tabs}
        activeStatus={state.tab}
        onStatusChange={(tab) => setState({ tab })}
        statusTabsVariant="line"
        total={meta?.total}
        totalPages={meta?.totalPages}
      />

      <DoctorApprovalTable
        applications={applications}
        isPending={isPending}
        isError={isError}
        onSortChange={(sortBy, sortOrder) => setState({ sortBy, sortOrder })}
        sortBy={state.sortBy}
        sortOrder={state.sortOrder}
        isFiltered={Boolean(debouncedSearch) || state.tab !== "all"}
        onClearFilters={() => {
          setSearchInput("");
          setState({ tab: "all", searchTerm: "" });
        }}
      />

      <TablePagination
        totalPages={meta?.totalPages ?? 0}
        page={state.page}
        handlePageChange={(page) => setState({ page })}
      />
    </>
  );
}
