"use client";

import {
  AnalyticsCards,
  formatCount,
  formatMoney,
} from "@/components/modules/analytics/analytics-cards";
import { useGetPatientAnalytics } from "@/hooks";

export function PatientAnalyticsCards() {
  const { data, isPending, isError } = useGetPatientAnalytics();

  return (
    <AnalyticsCards
      isPending={isPending}
      isError={isError || !data}
      items={
        data
          ? [
              {
                label: "Appointments",
                value: formatCount(data.totalAppointments),
              },
              {
                label: "Upcoming",
                value: formatCount(data.upcomingAppointments),
                hint: "Confirmed visits only",
              },
              {
                label: "Completed",
                value: formatCount(data.completedAppointments),
              },
              {
                label: "Cancelled",
                value: formatCount(data.cancelledAppointments),
              },
              {
                label: "Amount spent",
                value: formatMoney(data.totalAmountSpent),
              },
              {
                label: "Refunded",
                value: formatMoney(data.totalRefunded),
              },
            ]
          : []
      }
    />
  );
}
