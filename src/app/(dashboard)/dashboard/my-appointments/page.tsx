import { Suspense } from "react";
import AppointmentList from "@/components/modules/my-appointments/appointment-list";
import { AppointmentDetailSheet } from "@/components/modules/my-appointments/appointment-detail-sheet";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";

const page = () => {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="My Appointments"
        description="Every consultation you have booked, with its payment and current status."
      />

      {/* Both components read the status tab, page and sort from the query
          string, and also the bKash return params. Under output: "export" that
          opts this route into client rendering, so it needs a boundary or the
          build fails.

          The sheet must be mounted here as well as the list: AppointmentList
          pushes `?appointment=<id>` on click, but nothing read that param, so
          every row looked inert. */}
      <Suspense fallback={<Skeleton className="h-[32rem] w-full" />}>
        <AppointmentList />
        <AppointmentDetailSheet />
      </Suspense>
    </div>
  );
};

export default page;
