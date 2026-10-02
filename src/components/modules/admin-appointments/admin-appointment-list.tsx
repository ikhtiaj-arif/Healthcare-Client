"use client";

import { CalendarX2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { APPOINTMENT_DETAIL_PARAM } from "@/components/modules/my-appointments/appointment-detail-sheet";
import { Button } from "@/components/ui/button";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { EmptyTableRow } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
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
import { useGetAllAppointments, useListState } from "@/hooks";
import type { AppointmentSortField, AppointmentStatus } from "@/types";

type StatusFilter = "all" | AppointmentStatus;

const PAGE_SIZE = 10;

const DEFAULTS: {
  status: StatusFilter;
  doctorId: string;
  patientId: string;
  doctorEmail: string;
  patientEmail: string;
  sortBy: AppointmentSortField;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
} = {
  status: "all",
  doctorId: "",
  patientId: "",
  doctorEmail: "",
  patientEmail: "",
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

export function AdminAppointmentList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { state, setState } = useListState({ defaults: DEFAULTS });
  const { data, isPending, isError } = useGetAllAppointments({
    page: state.page,
    limit: state.limit,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    ...(state.status === "all" ? {} : { status: state.status }),
    ...(state.doctorId ? { doctorId: state.doctorId } : {}),
    ...(state.patientId ? { patientId: state.patientId } : {}),
    ...(state.doctorEmail ? { doctorEmail: state.doctorEmail } : {}),
    ...(state.patientEmail ? { patientEmail: state.patientEmail } : {}),
  });

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
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          value={state.doctorEmail}
          placeholder="Doctor email (exact)"
          onChange={(event) => setState({ doctorEmail: event.target.value })}
        />
        <Input
          value={state.patientEmail}
          placeholder="Patient email (exact)"
          onChange={(event) => setState({ patientEmail: event.target.value })}
        />
        <Input
          value={state.doctorId}
          placeholder="Doctor id"
          onChange={(event) => setState({ doctorId: event.target.value })}
        />
        <Input
          value={state.patientId}
          placeholder="Patient id"
          onChange={(event) => setState({ patientId: event.target.value })}
        />
      </div>
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
            <TableHead>Doctor</TableHead>
            <TableHead>Patient</TableHead>
            <SortableTableHead
              field="status"
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSortChange={(sortBy, sortOrder) => setState({ sortBy, sortOrder })}
            >
              Status
            </SortableTableHead>
            <SortableTableHead
              field="joiningTime"
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSortChange={(sortBy, sortOrder) => setState({ sortBy, sortOrder })}
            >
              Joining time
            </SortableTableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isError ? (
            <EmptyTableRow
              colSpan={6}
              icon={CalendarX2}
              title="Could not load appointments"
              description="Please try again."
            />
          ) : isPending && !data ? (
            <EmptyTableRow colSpan={6} title="Loading appointments" />
          ) : appointments.length === 0 ? (
            <EmptyTableRow
              colSpan={6}
              icon={CalendarX2}
              title="No appointments match"
              description="Email filters are exact. Clear a field if the table looks empty."
            />
          ) : (
            appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>{appointment.serialNumber ?? "–"}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{appointment.doctor.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {appointment.doctor.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{appointment.patient.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {appointment.patient.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={appointment.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(appointment.joiningTime)}
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
