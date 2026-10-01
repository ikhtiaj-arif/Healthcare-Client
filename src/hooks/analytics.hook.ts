import { useQuery } from "@tanstack/react-query";
import {
  getAdminAnalytics,
  getDoctorAnalytics,
  getPatientAnalytics,
} from "@/api/analytics.api";

/**
 * Shared prefix for all analytics queries. Invalidate with this if the
 * underlying data changes — mutations that affect appointments, schedules,
 * payments or approvals can make these numbers stale.
 */
export const ANALYTICS_QUERY_KEY = ["analytics"] as const;

export function useGetPatientAnalytics() {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, "patient"],
    queryFn: getPatientAnalytics,
  });
}

export function useGetDoctorAnalytics() {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, "doctor"],
    queryFn: getDoctorAnalytics,
  });
}

export function useGetAdminAnalytics() {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, "admin"],
    queryFn: getAdminAnalytics,
  });
}
