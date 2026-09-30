"use client";
import { Eye, Inbox, SearchX } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import type { DoctorSortField } from "@/types";
import type { DoctorApplication } from "./doctor-approval.data";
import DoctorApprovalTableLoading from "./doctor-approval-table-loading";
import { DoctorPreviewSheets } from "./doctor-preview-sheets";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getInitialsClassName(name: string) {
  const code = name.charCodeAt(0) % 5;
  const variants = [
    "bg-primary/10 text-primary",
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  ];
  return variants[code];
}

export function DoctorApprovalTable({
  applications,
  isPending = false,
  sortBy,
  sortOrder,
  onSortChange,
  isFiltered = false,
  onClearFilters,
}: {
  applications: DoctorApplication[];
  isPending: boolean;
  sortBy?: DoctorSortField;
  sortOrder?: "asc" | "desc";
  onSortChange?: (field: DoctorSortField, order: "asc" | "desc") => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}) {
  const [selected, setSelected] = useState<DoctorApplication | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              field="name"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onSortChange}
              className="w-[280px]"
            >
              Doctor
            </SortableTableHead>
            <SortableTableHead
              field="specialization"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onSortChange}
            >
              Specialization
            </SortableTableHead>
            <TableHead>License</TableHead>
            <SortableTableHead
              field="experienceYears"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onSortChange}
            >
              Experience
            </SortableTableHead>
            <SortableTableHead
              field="consultationFee"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onSortChange}
            >
              Fee
            </SortableTableHead>
            <SortableTableHead
              field="createdAt"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onSortChange}
            >
              Applied
            </SortableTableHead>
            <SortableTableHead
              field="verificationStatus"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onSortChange}
            >
              Status
            </SortableTableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            <DoctorApprovalTableLoading />
          ) : applications.length === 0 ? (
            <EmptyTableRow
              colSpan={8}
              icon={isFiltered ? SearchX : Inbox}
              title={
                isFiltered
                  ? "No applications match these filters"
                  : "No applications here yet."
              }
              description={
                isFiltered
                  ? "Try a different search term, or clear the filters to see every application."
                  : undefined
              }
              action={
                isFiltered && onClearFilters ? (
                  <Button variant="outline" size="sm" onClick={onClearFilters}>
                    Clear filters
                  </Button>
                ) : undefined
              }
            />
          ) : (
            applications.map((application) => {
              return (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center text-xs font-semibold ${getInitialsClassName(application.name)}`}
                      >
                        {getInitials(application.name)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground">
                          {application.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {application.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{application.specialization}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {application.licenseNumber}
                  </TableCell>
                  <TableCell>
                    {application.experienceYears}{" "}
                    <span className="text-muted-foreground">yrs</span>
                  </TableCell>
                  <TableCell>
                    {application.consultationFee !== undefined ? (
                      `${application.consultationFee} BDT`
                    ) : (
                      <span className="text-muted-foreground">Not set</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {application.appliedAt}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {application.user.emailVerified ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelected(application)}
                      >
                        <Eye />
                        Review
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">
                        Email unverified
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <DoctorPreviewSheets
        application={selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
      />
    </>
  );
}
