"use client";

import { ReceiptText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { useGetMyPayments, useListState } from "@/hooks";
import type { PaymentListItem, PaymentSortField } from "@/types";
import { PAYMENT_DETAIL_PARAM } from "./payment-detail-sheet";

const PAGE_SIZE = 10;

/**
 * Typed explicitly rather than `as const`: a const assertion would narrow
 * `sortBy` to the literal "createdAt", so writing any other value would not
 * typecheck. Module-level, so identity is stable.
 */
const DEFAULTS: {
  sortBy: PaymentSortField;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
} = {
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: PAGE_SIZE,
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not set";
  }
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * A patient's payment history.
 *
 * No status tabs and no search box, unlike the other two lists, because
 * `GET /payment/my-payments` accepts neither: it only takes paging and sorting.
 * Adding the controls would mean filtering client-side across pages, which would
 * silently show a page of 10 that does not match the tab.
 */
export default function PaymentList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state, setState } = useListState({ defaults: DEFAULTS });

  const params = {
    page: state.page,
    limit: state.limit,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
  };

  const { data, isPending, isError } = useGetMyPayments(params);

  const payments: PaymentListItem[] = data?.data ?? [];
  const meta = data?.meta;

  const openDetail = (paymentId: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set(PAYMENT_DETAIL_PARAM, paymentId);
    // `push` so the back button closes the sheet, matching its own close button.
    router.push(`/dashboard/payment-history?${next.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {meta
            ? `Showing ${payments.length} of ${meta.total} payment${
                meta.total === 1 ? "" : "s"
              }`
            : "Loading your payments…"}
        </p>
      </div>

      {!isPending && !isError && payments.length === 0 ? (
        <EmptyState
          icon={ReceiptText}
          title="No payments yet"
          description="Payments show up here once you book and pay for a consultation."
          className="h-64"
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appointment</TableHead>
                <TableHead>Doctor</TableHead>
                <SortableTableHead
                  field="amount"
                  sortBy={state.sortBy}
                  sortOrder={state.sortOrder}
                  onSortChange={(sortBy, sortOrder) =>
                    setState({ sortBy, sortOrder }, { keepPage: true })
                  }
                >
                  Amount
                </SortableTableHead>
                <SortableTableHead
                  field="createdAt"
                  sortBy={state.sortBy}
                  sortOrder={state.sortOrder}
                  onSortChange={(sortBy, sortOrder) =>
                    setState({ sortBy, sortOrder }, { keepPage: true })
                  }
                >
                  Booked
                </SortableTableHead>
                <SortableTableHead
                  field="status"
                  sortBy={state.sortBy}
                  sortOrder={state.sortOrder}
                  onSortChange={(sortBy, sortOrder) =>
                    setState({ sortBy, sortOrder }, { keepPage: true })
                  }
                >
                  Status
                </SortableTableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-sm text-muted-foreground"
                  >
                    Loading your payments…
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-sm text-destructive"
                  >
                    Could not load your payments. Please refresh and try again.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">
                          #{payment.appointment?.serialNumber ?? "–"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(
                            payment.appointment?.schedule?.startDateTime ??
                              payment.appointment?.joiningTime,
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">
                          {payment.appointment?.doctor?.name ??
                            "Unknown doctor"}
                        </span>
                        {payment.appointment?.doctor?.specialization ? (
                          <span className="text-xs text-muted-foreground">
                            {payment.appointment.doctor.specialization}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">
                          {payment.amount} {payment.currency}
                        </span>
                        {payment.refundAmount ? (
                          <span className="text-xs text-muted-foreground">
                            Refunded {payment.refundAmount} {payment.currency}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(payment.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <StatusBadge status={payment.status} />
                        {payment.paidAt ? (
                          <span className="text-xs text-muted-foreground">
                            Paid {formatDateTime(payment.paidAt)}
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetail(payment.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Renders nothing on its own when there is a single page. */}
      <TablePagination
        totalPages={meta?.totalPages ?? 0}
        page={state.page}
        handlePageChange={(page) => setState({ page })}
      />
    </div>
  );
}
