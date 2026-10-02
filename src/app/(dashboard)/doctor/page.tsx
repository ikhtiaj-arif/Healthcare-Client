import { DoctorAnalyticsCards } from "@/components/modules/analytics/doctor-analytics-cards";
import { PageHeader } from "@/components/ui/page-header";

export default function DoctorDashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Dashboard"
        description="Your schedules and consultations. Earnings are already net of refunds."
      />
      <DoctorAnalyticsCards />
    </div>
  );
}
