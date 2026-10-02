"use client";

import {
  AnalyticsCards,
  formatCount,
  formatMoney,
} from "@/components/modules/analytics/analytics-cards";
import { useGetAdminAnalytics } from "@/hooks";

export function AdminAnalyticsCards() {
  const { data, isPending, isError } = useGetAdminAnalytics();

  return (
    <AnalyticsCards
      isPending={isPending}
      isError={isError || !data}
      items={
        data
          ? [
              { label: "Doctors", value: formatCount(data.totalDoctors) },
              {
                label: "Pending applications",
                value: formatCount(data.totalPendingDoctorApplications),
              },
              {
                label: "Approved doctors",
                value: formatCount(data.totalApprovedDoctors),
              },
              {
                label: "Rejected doctors",
                value: formatCount(data.totalRejectedDoctors),
              },
              { label: "Patients", value: formatCount(data.totalPatients) },
              {
                label: "Appointments",
                value: formatCount(data.totalAppointments),
              },
              {
                label: "Completed appointments",
                value: formatCount(data.totalCompletedAppointments),
              },
              {
                label: "Cancelled appointments",
                value: formatCount(data.totalCancelledAppointments),
              },
              {
                label: "Revenue",
                value: formatMoney(data.totalRevenue),
                hint: "Paid amount minus refunds",
              },
              { label: "Refunded", value: formatMoney(data.totalRefunded) },
            ]
          : []
      }
    />
  );
}
