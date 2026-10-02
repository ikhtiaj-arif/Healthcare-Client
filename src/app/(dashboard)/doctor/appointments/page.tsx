import { Suspense } from "react";
import { DoctorAppointmentList } from "@/components/modules/doctor-appointments/doctor-appointment-list";
import { AppointmentDetailSheet } from "@/components/modules/my-appointments/appointment-detail-sheet";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Appointments"
        description="Consultations booked with you. Status can move from confirmed to ongoing, then to completed."
      />
      <Suspense fallback={<Skeleton className="h-[32rem] w-full" />}>
        <DoctorAppointmentList />
        <AppointmentDetailSheet />
      </Suspense>
    </div>
  );
}
