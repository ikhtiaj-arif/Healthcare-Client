"use client";

import { CalendarX2, Video } from "lucide-react";
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
import type { Appointment, AppointmentStatus } from "@/types";
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

/** Mirrors APPOINTMENT_SORTABLE_FIELDS in Healthcare-Backend/src/app/utils/sort.ts. */
type AppointmentSortField =
  | "createdAt"
  | "updatedAt"
  | "status"
  | "joiningTime"
  | "serialNumber";

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

export default function AppointmentList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, setState } = useListState({ defaults: DEFAULTS });

  const outcome = readPaymentOutcome(searchParams);

  const params = {
    page: state.page,
    limit: state.limit,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    ...(state.status === "all" ? {} : { status: state.status }),
  };

  const { data, isPending, isError } = useGetMyAppointments(params);

  const appointments: Appointment[] = data?.data ?? [];
  const meta = data?.meta;
  const isFiltered = state.status !== "all";

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

  return (
    <div className="space-y-4">
      {outcome ? (
        <PaymentResultBanner outcome={outcome} onDismiss={dismissOutcome} />
      ) : null}

      <DataTableToolbar
        statusTabs={statusTabs}
        activeStatus={state.status}
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
                        ? `No ${state.status.toLowerCase()} appointments`
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
                    {appointment.serialNumber ?? "–"}
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
                    {/*
                      The old row had a bare <Button>Join</Button> with no
                      handler, so it did nothing. There is no meeting URL on the
                      appointment record, so rather than leave a dead control
                      this only renders for a CONFIRMED appointment and points
                      at the doctor page.
                    */}
                    {appointment.status === "CONFIRMED" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        render={
                          <Link href={`/doctors/${appointment.doctorId}`} />
                        }
                      >
                        <Video />
                        Details
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">–</span>
                    )}
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
