"use client";

import { CalendarX2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
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
import { useGetMyAppointments, useListState } from "@/hooks";
import type {
  Appointment,
  AppointmentSortField,
  AppointmentStatus,
} from "@/types";
import { APPOINTMENT_DETAIL_PARAM } from "./appointment-detail-sheet";
import { CancelAppointmentDialog } from "./cancel-appointment-dialog";
import { PayAppointmentButton } from "./pay-appointment-button";
import {
  PaymentResultBanner,
  readPaymentOutcome,
} from "./payment-result-banner";

type StatusFilter = "all" | AppointmentStatus;

const PAGE_SIZE = 10;

/**
 * Typed explicitly rather than `as const`: a const assertion would narrow
 * `status` to the literal "all" and `sortBy` to "createdAt", so writing any
 * other value would not typecheck. Module-level, so identity is stable.
 */
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

/**
 * `?status` does double duty on this route: the bKash callback returns
 * `?status=success|failure|cancel`, and the status tab uses the uppercase
 * `AppointmentStatus` values. `useListState` copies whatever is in the URL into
 * its state without validating, so after a payment return `state.status` is
 * literally "success" and would be sent to the API as a status filter, where
 * Prisma rejects it as an unknown enum. Narrowing it here means the banner shows
 * and the request asks for the unfiltered list.
 */
const STATUS_FILTER_VALUES = new Set<string>(statusTabs.map((t) => t.value));

function toStatusFilter(value: string): StatusFilter {
  return STATUS_FILTER_VALUES.has(value) ? (value as StatusFilter) : "all";
}

/** Mirrors APPOINTMENT_SORTABLE_FIELDS in Healthcare-Backend/src/app/utils/sort.ts. */

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not set";
  }
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AppointmentList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, setState } = useListState({ defaults: DEFAULTS });

  const outcome = readPaymentOutcome(searchParams);
  const statusFilter = toStatusFilter(state.status);

  const params = {
    page: state.page,
    limit: state.limit,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    ...(statusFilter === "all" ? {} : { status: statusFilter }),
  };

  const { data, isPending, isError } = useGetMyAppointments(params);

  const appointments: Appointment[] = data?.data ?? [];
  const meta = data?.meta;
  const isFiltered = statusFilter !== "all";

  /**
   * Drops the gateway params from the URL. Without this, reloading or sharing
   * the link re-shows a payment banner for a transaction that finished minutes
   * ago, and the URL stays polluted.
   */
  const dismissOutcome = () => {
    const next = new URLSearchParams(searchParams.toString());
    next.delete("status");
    next.delete("error");
    const query = next.toString();
    router.replace(
      query
        ? `/dashboard/my-appointments?${query}`
        : "/dashboard/my-appointments",
    );
  };

  /**
   * Opens the detail sheet by putting the id in the query string.
   *
   * Not `setState`: that helper owns the list's page/filter/sort keys and
   * resets the page on any change it does not recognise, which would drop the
   * reader back to page 1 every time they inspect a row on page 4.
   */
  const openDetail = (appointmentId: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set(APPOINTMENT_DETAIL_PARAM, appointmentId);
    // `push` so the back button closes the sheet, matching what the sheet's
    // own close button does.
    router.push(`/dashboard/my-appointments?${next.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="space-y-4">
      {outcome ? (
        <PaymentResultBanner outcome={outcome} onDismiss={dismissOutcome} />
      ) : null}

      <DataTableToolbar
        statusTabs={statusTabs}
        activeStatus={statusFilter}
        onStatusChange={(status) => setState({ status })}
        statusTabsVariant="line"
        total={meta?.total}
        totalPages={meta?.totalPages}
      />

      {isError ? (
        <EmptyState
          icon={CalendarX2}
          title="Could not load your appointments"
          description="Please try again. If it keeps failing, your session may have expired."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                field="serialNumber"
                sortBy={state.sortBy}
                sortOrder={state.sortOrder}
                onSortChange={(sortBy, sortOrder) =>
                  setState({ sortBy, sortOrder })
                }
              >
                #
              </SortableTableHead>
              <TableHead>Doctor</TableHead>
              <SortableTableHead
                field="joiningTime"
                sortBy={state.sortBy}
                sortOrder={state.sortOrder}
                onSortChange={(sortBy, sortOrder) =>
                  setState({ sortBy, sortOrder })
                }
              >
                Joining time
              </SortableTableHead>
              <TableHead>Payment</TableHead>
              <SortableTableHead
                field="status"
                sortBy={state.sortBy}
                sortOrder={state.sortOrder}
                onSortChange={(sortBy, sortOrder) =>
                  setState({ sortBy, sortOrder })
                }
              >
                Status
              </SortableTableHead>
              <SortableTableHead
                field="createdAt"
                sortBy={state.sortBy}
                sortOrder={state.sortOrder}
                onSortChange={(sortBy, sortOrder) =>
                  setState({ sortBy, sortOrder })
                }
              >
                Booked
              </SortableTableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <tr>
                <td
                  colSpan={7}
                  className="h-40 text-center text-muted-foreground"
                >
                  Loading your appointments…
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-0">
                  <EmptyState
                    icon={CalendarX2}
                    title={
                      isFiltered
                        ? `No ${statusFilter.toLowerCase()} appointments`
                        : "You have no appointments yet"
                    }
                    description={
                      isFiltered
                        ? "Try a different status tab to see your other appointments."
                        : "Book a consultation with a doctor and it will show up here."
                    }
                    action={
                      isFiltered ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setState({ status: "all" })}
                        >
                          Show all
                        </Button>
                      ) : (
                        <Button size="sm" render={<Link href="/doctors" />}>
                          Browse doctors
                        </Button>
                      )
                    }
                    className="h-40"
                  />
                </td>
              </tr>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="text-muted-foreground">
                    {/*
                      The row's one navigation target, and the detail sheet
                      keeps the current filters, sort and page behind it rather
                      than reloading the list from page 1.
                    */}
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 font-medium"
                      onClick={() => openDetail(appointment.id)}
                    >
                      {appointment.serialNumber ?? "–"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium">
                        {appointment.doctor?.name ?? "Unknown doctor"}
                      </span>
                      {appointment.doctor?.specialization ? (
                        <span className="text-xs text-muted-foreground">
                          {appointment.doctor.specialization}
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
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(appointment.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/*
                        Pay and Cancel are the two things a patient can do to an
                        appointment. Each renders only where the backend would
                        accept it, so no row offers a control that can only come
                        back as a 400.
                      */}
                      <PayAppointmentButton appointment={appointment} />
                      {appointment.status === "PENDING" ||
                      appointment.status === "CONFIRMED" ? (
                        <CancelAppointmentDialog appointment={appointment} />
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <TablePagination
        totalPages={meta?.totalPages ?? 0}
        page={state.page}
        handlePageChange={(page) => setState({ page })}
      />
    </div>
  );
}
