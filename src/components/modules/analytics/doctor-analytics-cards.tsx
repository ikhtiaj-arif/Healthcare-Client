"use client";

import {
  AnalyticsCards,
  formatCount,
  formatMoney,
} from "@/components/modules/analytics/analytics-cards";
import { useGetDoctorAnalytics } from "@/hooks";

export function DoctorAnalyticsCards() {
  const { data, isPending, isError } = useGetDoctorAnalytics();

  return (
    <AnalyticsCards
      isPending={isPending}
      isError={isError || !data}
      items={
        data
          ? [
              { label: "Schedules", value: formatCount(data.totalSchedules) },
              {
                label: "Published schedules",
                value: formatCount(data.publishedSchedules),
              },
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
                label: "Ongoing",
                value: formatCount(data.ongoingAppointments),
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
                label: "Earnings",
                value: formatMoney(data.totalDoctorEarnings),
                hint: "Already net of refunds",
              },
              {
                label: "Refunded",
                value: formatMoney(data.totalDoctorRefunded),
              },
            ]
          : []
      }
    />
  );
}
