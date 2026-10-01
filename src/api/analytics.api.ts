import apiClient from "@/lib/apiClient";
import type {
  AdminAnalytics,
  ApiResponse,
  DoctorAnalytics,
  PatientAnalytics,
} from "@/types";

/**
 * Patient analytics.
 *
 * Keys: totalAppointments, upcomingAppointments (counts **CONFIRMED only**),
 * completedAppointments, cancelledAppointments, totalAmountSpent, totalRefunded.
 * No pendingAppointments key exists.
 */
export async function getPatientAnalytics(): Promise<PatientAnalytics> {
  const response = await apiClient<ApiResponse<PatientAnalytics>>(
    "/analytics/patient-analytics",
  );
  return response.data;
}

/**
 * Doctor analytics.
 *
 * Keys: totalSchedules, publishedSchedules, totalAppointments,
 * upcomingAppointments, ongoingAppointments, completedAppointments,
 * cancelledAppointments, totalDoctorEarnings (net of refunds), totalDoctorRefunded.
 * No draftSchedules or pendingAppointments key exists.
 */
export async function getDoctorAnalytics(): Promise<DoctorAnalytics> {
  const response = await apiClient<ApiResponse<DoctorAnalytics>>(
    "/analytics/doctor-analytics",
  );
  return response.data;
}

/**
 * Admin analytics.
 *
 * Keys: totalDoctors, totalPendingDoctorApplications, totalApprovedDoctors,
 * totalRejectedDoctors, totalPatients, totalAppointments, totalCompletedAppointments,
 * totalCancelledAppointments, totalRevenue, totalRefunded.
 */
export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  const response = await apiClient<ApiResponse<AdminAnalytics>>(
    "/analytics/admin-analytics",
  );
  return response.data;
}
