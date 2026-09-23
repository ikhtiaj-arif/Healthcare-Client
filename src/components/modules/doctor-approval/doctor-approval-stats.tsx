"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllDoctors } from "@/hooks";
import { mapDoctorToApplication } from "./doctor-approval.data";

export function DoctorApprovalStats() {
  const { data, isPending } = useGetAllDoctors();
  const applications = (data?.data ?? []).map(mapDoctorToApplication);

  const stats = [
    {
      label: "Pending",
      value: applications.filter((a) => a.status === "PENDING").length,
    },
    {
      label: "Approved",
      value: applications.filter((a) => a.status === "APPROVED").length,
    },
    {
      label: "Rejected",
      value: applications.filter((a) => a.status === "REJECTED").length,
    },
    { label: "Total", value: applications.length },
  ];

  return (
    <div className="grid auto-rows-min gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent className="flex flex-col gap-1.5 py-4">
            <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {stat.label}
            </span>
            {isPending ? (
              <Skeleton className="h-7 w-12" />
            ) : (
              <span className="font-heading text-2xl font-semibold text-foreground">
                {stat.value}
              </span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
