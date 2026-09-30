import { Suspense } from "react";
import AppointmentList from "@/components/modules/my-appointments/appointment-list";
import { PageHeader } from "@/components/ui/page-header";

const page = () => {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="My Appointments"
        description="Every consultation you have booked, with its payment and current status."
      />

      {/* AppointmentList reads the status tab, page and sort from the query
          string, and also the bKash return params. Under output: "export" that
          opts this route into client rendering, so it needs a boundary or the
          build fails. */}
      <Suspense fallback={null}>
        <AppointmentList />
      </Suspense>
    </div>
  );
};

export default page;
