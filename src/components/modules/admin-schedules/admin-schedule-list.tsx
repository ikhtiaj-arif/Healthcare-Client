"use client";

import { CalendarX2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { EmptyTableRow } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { useAllSchedules, useDebounce, useListState, useScheduleById } from "@/hooks";
import type { AppointmentStatus, ScheduleSortField, ScheduleStatus } from "@/types";

type StatusFilter = "all" | ScheduleStatus;

const PAGE_SIZE = 10;

const DEFAULTS: {
  status: StatusFilter;
  searchTerm: string;
  doctorId: string;
  email: string;
  sortBy: ScheduleSortField;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
} = {
  status: "all",
  searchTerm: "",
  doctorId: "",
  email: "",
  sortBy: "startDateTime",
  sortOrder: "desc",
  page: 1,
  limit: PAGE_SIZE,
};

const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "PUBLISHED", label: "Published" },
];

const appointmentFilters: { value: "all" | AppointmentStatus; label: string }[] = [
  { value: "all", label: "All visits" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function formatDateTime(value?: string | null) {
  if (!value) return "Not set";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AdminScheduleList() {
  const { state, setState } = useListState({ defaults: DEFAULTS });
  const searchTerm = useDebounce(state.searchTerm, 400);
  const [openId, setOpenId] = useState<string | null>(null);
  const [visitStatus, setVisitStatus] = useState<"all" | AppointmentStatus>("all");
  const { data, isPending, isError } = useAllSchedules({
    page: state.page,
    limit: state.limit,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    ...(state.status === "all" ? {} : { status: state.status }),
    ...(searchTerm ? { searchTerm } : {}),
    ...(state.doctorId ? { doctorId: state.doctorId } : {}),
    ...(state.email ? { email: state.email } : {}),
  });
  const detail = useScheduleById(openId ?? undefined);
  const schedules = data?.data ?? [];
  const appointments = (detail.data?.appointments ?? []).filter((appointment) =>
    visitStatus === "all" ? true : appointment.status === visitStatus,
  );

  return (
    <div className="space-y-4">
      <DataTableToolbar
        statusTabs={statusTabs}
        activeStatus={state.status}
        onStatusChange={(status) => setState({ status })}
        searchValue={state.searchTerm}
        onSearchChange={(searchTerm) => setState({ searchTerm })}
        searchPlaceholder="Doctor name, email, or specialization"
        total={data?.meta?.total}
        totalPages={data?.meta?.totalPages}
      />
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          value={state.doctorId}
          placeholder="Doctor id"
          onChange={(event) => setState({ doctorId: event.target.value })}
        />
        <Input
          value={state.email}
          placeholder="Doctor email (exact)"
          onChange={(event) => setState({ email: event.target.value })}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              field="startDateTime"
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSortChange={(sortBy, sortOrder) => setState({ sortBy, sortOrder })}
            >
              Starts
            </SortableTableHead>
            <SortableTableHead
              field="availableSlots"
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSortChange={(sortBy, sortOrder) => setState({ sortBy, sortOrder })}
            >
              Slots
            </SortableTableHead>
            <SortableTableHead
              field="status"
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSortChange={(sortBy, sortOrder) => setState({ sortBy, sortOrder })}
            >
              Status
            </SortableTableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isError ? (
            <EmptyTableRow
              colSpan={4}
              icon={CalendarX2}
              title="Could not load schedules"
              description="Please try again."
            />
          ) : isPending && !data ? (
            <EmptyTableRow colSpan={4} title="Loading schedules" />
          ) : schedules.length === 0 ? (
            <EmptyTableRow
              colSpan={4}
              icon={CalendarX2}
              title="No schedules match"
              description="The email filter is an exact match. Search matches name, email, or specialization."
            />
          ) : (
            schedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell>{formatDateTime(schedule.startDateTime)}</TableCell>
                <TableCell>
                  {schedule.availableSlots} / {schedule.totalSlots}
                </TableCell>
                <TableCell>
                  <StatusBadge status={schedule.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setVisitStatus("all");
                      setOpenId(schedule.id);
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        totalPages={data?.meta?.totalPages ?? 0}
        page={state.page}
        handlePageChange={(page) => setState({ page })}
      />
      <Sheet open={Boolean(openId)} onOpenChange={(open) => !open && setOpenId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Schedule</SheetTitle>
            <SheetDescription>
              {detail.data
                ? `${detail.data.doctor.name} · ${detail.data.doctor.specialization}`
                : "Loading the doctor and their visits."}
            </SheetDescription>
          </SheetHeader>
          {detail.isError ? (
            <p className="mt-4 text-sm text-muted-foreground">
              This schedule could not be loaded.
            </p>
          ) : detail.data ? (
            <div className="mt-4 flex flex-col gap-4 text-sm">
              <p className="text-muted-foreground">{detail.data.doctor.email}</p>
              <p>{formatDateTime(detail.data.startDateTime)}</p>
              <div className="flex flex-wrap gap-2">
                {appointmentFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    size="sm"
                    variant={visitStatus === filter.value ? "default" : "outline"}
                    onClick={() => setVisitStatus(filter.value)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
              <ul className="flex flex-col gap-2">
                {appointments.length === 0 ? (
                  <li className="text-muted-foreground">No visits in this filter.</li>
                ) : (
                  appointments.map((appointment) => (
                    <li key={appointment.id} className="border p-3">
                      <p className="font-medium">{appointment.patient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.patient.email}
                        {appointment.patient.contactNumber
                          ? ` · ${appointment.patient.contactNumber}`
                          : ""}
                      </p>
                      <StatusBadge status={appointment.status} />
                    </li>
                  ))
                )}
              </ul>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
