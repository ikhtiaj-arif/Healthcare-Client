import { AdminAnalyticsCards } from "@/components/modules/analytics/admin-analytics-cards";
import { PageHeader } from "@/components/ui/page-header";

export default function AdminDashboardPage() {
  return (
    <div className="flex w-full flex-col gap-6 p-4 md:p-6">
      <PageHeader
        title="Dashboard"
        description="Doctors, patients, and what the platform has collected."
      />
      <AdminAnalyticsCards />
    </div>
  );
}
