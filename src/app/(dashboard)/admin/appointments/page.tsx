import { Suspense } from "react";
import { AdminAppointmentList } from "@/components/modules/admin-appointments/admin-appointment-list";
import { AppointmentDetailSheet } from "@/components/modules/my-appointments/appointment-detail-sheet";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Appointments"
        description="Every consultation on the platform. Email filters match the full address."
      />
      <Suspense fallback={<Skeleton className="h-[32rem] w-full" />}>
        <AdminAppointmentList />
        <AppointmentDetailSheet />
      </Suspense>
    </div>
  );
}
