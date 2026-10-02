"use client";

import { ReceiptText } from "lucide-react";
import { useState } from "react";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { EmptyTableRow } from "@/components/ui/empty-state";
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
import { useDebounce, useGetAllPayments, useListState } from "@/hooks";
import type { AllPaymentItem, PaymentSortField } from "@/types";

const PAGE_SIZE = 10;

const DEFAULTS: {
  patientEmail: string;
  sortBy: PaymentSortField;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
} = {
  patientEmail: "",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: PAGE_SIZE,
};

export function AdminPaymentList() {
  const { state, setState } = useListState({ defaults: DEFAULTS });
  const [selected, setSelected] = useState<AllPaymentItem | null>(null);
  const patientEmail = useDebounce(state.patientEmail, 400);
  const { data, isPending, isError } = useGetAllPayments({
    page: state.page,
    limit: state.limit,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    ...(patientEmail ? { patientEmail } : {}),
  });
  const payments = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <DataTableToolbar
        searchValue={state.patientEmail}
        onSearchChange={(patientEmail) => setState({ patientEmail })}
        searchPlaceholder="Patient email contains…"
        total={meta?.total}
        totalPages={meta?.totalPages}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              field="amount"
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSortChange={(sortBy, sortOrder) => setState({ sortBy, sortOrder })}
            >
              Amount
            </SortableTableHead>
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
              field="paidAt"
              sortBy={state.sortBy}
              sortOrder={state.sortOrder}
              onSortChange={(sortBy, sortOrder) => setState({ sortBy, sortOrder })}
            >
              Paid at
            </SortableTableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isError ? (
            <EmptyTableRow
              colSpan={5}
              icon={ReceiptText}
              title="Could not load payments"
              description="Please try again."
            />
          ) : isPending && !data ? (
            <EmptyTableRow colSpan={5} title="Loading payments" />
          ) : payments.length === 0 ? (
            <EmptyTableRow
              colSpan={5}
              icon={ReceiptText}
              title="No payments match"
              description="The email filter matches any part of the address, ignoring case."
            />
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {payment.amount} {payment.currency}
                </TableCell>
                <TableCell>
                  {payment.appointment?.patient?.email ?? "Unknown"}
                </TableCell>
                <TableCell>
                  <StatusBadge status={payment.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {payment.paidAt || "Not paid"}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    className="text-sm font-medium underline"
                    onClick={() => setSelected(payment)}
                  >
                    View
                  </button>
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
      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Payment</SheetTitle>
            <SheetDescription>
              bKash timing is shown as the gateway sent it.
            </SheetDescription>
          </SheetHeader>
          {selected ? (
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Amount</dt>
                <dd>
                  {selected.amount} {selected.currency}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <StatusBadge status={selected.status} />
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Transaction</dt>
                <dd>{selected.bkashTrxId || "None"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Paid at</dt>
                <dd>{selected.paidAt || "Not paid"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Refund</dt>
                <dd>
                  {selected.refundAmount
                    ? `${selected.refundAmount} ${selected.currency}`
                    : "None"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Refunded at</dt>
                <dd>{selected.refundedAt || "Not refunded"}</dd>
              </div>
            </dl>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
