"use client";
import { Eye, Inbox } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type DoctorApplication, statusMeta } from "./doctor-approval.data";
import { DoctorPreviewSheets } from "./doctor-preview-sheets";
import DoctorApprovalTableLoading from "./doctor-approval-table-loading";

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
}: {
  applications: DoctorApplication[];
  isPending: boolean;
}) {
  const [selected, setSelected] = useState<DoctorApplication | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[280px]">Doctor</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
              <DoctorApprovalTableLoading />
          ) : applications.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-40 text-center text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Inbox className="size-6" />
                  <span className="text-sm">No applications here yet.</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            applications.map((application) => {
              const status = statusMeta[application.status];
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
                    <span
                      className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold tracking-wider uppercase ${status.badgeClassName}`}
                    >
                      {status.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelected(application)}
                    >
                      <Eye />
                      Review
                    </Button>
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
