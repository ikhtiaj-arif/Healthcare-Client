import { Suspense } from "react";
import { AdminScheduleList } from "@/components/modules/admin-schedules/admin-schedule-list";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Schedules"
        description="Every doctor's booking window. Visit status is filtered here, not by the API."
      />
      <Suspense fallback={<Skeleton className="h-[32rem] w-full" />}>
        <AdminScheduleList />
      </Suspense>
    </div>
  );
}
