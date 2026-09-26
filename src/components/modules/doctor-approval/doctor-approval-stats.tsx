"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDoctorCounts } from "@/hooks";

export function DoctorApprovalStats() {
  const { data, isPending } = useGetDoctorCounts();

  const counts = data?.byStatus;

  const stats = [
    { label: "Pending", value: counts?.PENDING ?? 0 },
    { label: "Approved", value: counts?.APPROVED ?? 0 },
    { label: "Rejected", value: counts?.REJECTED ?? 0 },
    { label: "Total", value: data?.total ?? 0 },
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
