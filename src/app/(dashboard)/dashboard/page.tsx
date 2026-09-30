import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

/**
 * Patient landing page.
 *
 * This is the target of the post-login redirect for PATIENT in Header.tsx, so
 * it cannot be a bare text stub: signing in has to land somewhere real.
 *
 * Deliberately just links rather than a stats grid. The numbers are available
 * from GET /analytics/patient, which is Phase 3 work, and faking them here
 * would mean writing them twice.
 */
const PatientDashboardPage = () => {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Dashboard"
        description="Your appointments, payments and profile in one place."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          variant="outline"
          size="lg"
          className="h-auto justify-start p-5 text-left"
          render={<Link href={`${"/dashboard"}/my-appointments`} />}
        >
          <span className="flex flex-col gap-1">
            <span className="text-sm">My Appointments</span>
            <span className="text-xs font-normal text-muted-foreground">
              Review, pay for and track your consultations
            </span>
          </span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-auto justify-start p-5 text-left"
          render={<Link href="/doctors" />}
        >
          <span className="flex flex-col gap-1">
            <span className="text-sm">Find a Doctor</span>
            <span className="text-xs font-normal text-muted-foreground">
              Browse specialists and book a slot
            </span>
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PatientDashboardPage;
