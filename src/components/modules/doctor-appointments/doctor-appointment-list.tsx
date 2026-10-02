"use client";

import { CalendarX2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { EmptyTableRow } from "@/components/ui/empty-state";
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
import { useGetDoctorAppointments, useListState } from "@/hooks";
import type { AppointmentSortField, AppointmentStatus } from "@/types";
import { APPOINTMENT_DETAIL_PARAM } from "@/components/modules/my-appointments/appointment-detail-sheet";

type StatusFilter = "all" | AppointmentStatus;

const PAGE_SIZE = 10;

const DEFAULTS: {
  status: StatusFilter;
  sortBy: AppointmentSortField;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
} = {
  status: "all",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: PAGE_SIZE,
};

const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not set";
  }
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function DoctorAppointmentList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, setState } = useListState({ defaults: DEFAULTS });

  const params = {
    page: state.page,
    limit: state.limit,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    ...(state.status === "all" ? {} : { status: state.status }),
  };

  const { data, isPending, isError } = useGetDoctorAppointments(params);
  const appointments = data?.data ?? [];
  const meta = data?.meta;

  const openDetail = (appointmentId: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set(APPOINTMENT_DETAIL_PARAM, appointmentId);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar
        statusTabs={statusTabs}
        activeStatus={state.status}
        onStatusChange={(status) => setState({ status })}
        statusTabsVariant="line"
        total={meta?.total}
        totalPages={meta?.totalPages}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              field="serialNumber"
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSortChange={(sortBy, sortOrder) => setState({ sortBy, sortOrder })}
            >
              #
            </SortableTableHead>
            <TableHead>Patient</TableHead>
            <SortableTableHead
              field="joiningTime"
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSortChange={(sortBy, sortOrder) => setState({ sortBy, sortOrder })}
            >
              Joining time
            </SortableTableHead>
            <TableHead>Payment</TableHead>
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
              colSpan={6}
              icon={CalendarX2}
              title="Could not load your appointments"
              description="Please try again. If it keeps failing, your session may have expired."
            />
          ) : isPending && !data ? (
            <EmptyTableRow colSpan={6} title="Loading appointments" />
          ) : appointments.length === 0 ? (
            <EmptyTableRow
              colSpan={6}
              icon={CalendarX2}
              title={
                state.status === "all"
                  ? "No appointments yet"
                  : `No ${state.status.toLowerCase()} appointments`
              }
              description="Patients appear here after they book one of your published slots."
              action={
                state.status === "all" ? undefined : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setState({ status: "all" })}
                  >
                    Show all
                  </Button>
                )
              }
            />
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.serialNumber ?? "–"}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{appointment.patient.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {appointment.patient.email}
                    </span>
                    {appointment.patient.contactNumber ? (
                      <span className="text-xs text-muted-foreground">
                        {appointment.patient.contactNumber}
                      </span>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(appointment.joiningTime)}
                </TableCell>
                <TableCell>
                  {appointment.payment ? (
                    <StatusBadge status={appointment.payment.status} />
                  ) : (
                    <span className="text-muted-foreground">–</span>
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={appointment.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openDetail(appointment.id)}
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
        totalPages={meta?.totalPages ?? 0}
        page={state.page}
        handlePageChange={(page) => setState({ page })}
      />
    </div>
  );
}
