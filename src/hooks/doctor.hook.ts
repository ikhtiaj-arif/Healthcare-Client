import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  applyDoctor,
  doctorAccountApprovalRejection,
  getAllDoctors,
  getAllPublicDoctors,
  getPublicDoctorProfile,
  getTodayScheduleByDoctor,
  verifyDoctorAccount,
} from "@/api/doctor.api";
import type {
  DoctorParams,
  DoctorVerificationStatus,
  PublicDoctorParams,
} from "@/types";
import { SCHEDULES_QUERY_KEY } from "./schedule.hook";

/**
 * Prefix for every doctor query, so a mutation can invalidate the whole family
 * with `invalidateQueries({ queryKey: DOCTORS_QUERY_KEY })`.
 *
 * This file previously mixed `["doctors"]`, `["doctor"]` and `["schedule"]`
 * across its own hooks, which meant invalidate-by-prefix silently missed some of
 * them. The worst case was today-schedule keyed `["schedule"]` while
 * SCHEDULES_QUERY_KEY is `["schedules"]`: booking an appointment invalidated
 * `["schedules"]` and left the day's slot counts stale on screen.
 */
export const DOCTORS_QUERY_KEY = ["doctors"] as const;

export function useApplyAsDoctor() {
  return useMutation({
    mutationFn: applyDoctor,
  });
}

export function useVerifyDoctorAccount() {
  return useMutation({
    mutationFn: verifyDoctorAccount,
  });
}
export function useApproveRejectDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: doctorAccountApprovalRejection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
    },
  });
}
// admin only
export function useGetAllDoctors(params: DoctorParams) {
  return useQuery({
    queryKey: [...DOCTORS_QUERY_KEY, "list", params],
    queryFn: () => getAllDoctors(params),
  });
}

const COUNT_STATUSES: DoctorVerificationStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export function useGetDoctorCounts() {
  return useQuery({
    queryKey: [...DOCTORS_QUERY_KEY, "counts"],
    queryFn: async () => {
      const [total, ...byStatus] = await Promise.all([
        getAllDoctors({ page: 1, limit: 1 }),
        ...COUNT_STATUSES.map((verificationStatus) =>
          getAllDoctors({ page: 1, limit: 1, verificationStatus }),
        ),
      ]);

      return {
        total: total.meta.total,
        byStatus: Object.fromEntries(
          COUNT_STATUSES.map((status, index) => [
            status,
            byStatus[index].meta.total,
          ]),
        ) as Record<DoctorVerificationStatus, number>,
      };
    },
  });
}

export function useGetAllPublicDoctors(params: PublicDoctorParams) {
  return useQuery({
    queryKey: [...DOCTORS_QUERY_KEY, "public", params],
    queryFn: () => getAllPublicDoctors(params),
  });
}

export function useSuspenseGetPublicDoctors(params: PublicDoctorParams) {
  return useSuspenseQuery({
    queryKey: [...DOCTORS_QUERY_KEY, "public", params],
    queryFn: () => getAllPublicDoctors(params),
  });
}

export function usePublicDoctorProfile(doctorId: string) {
  return useQuery({
    queryKey: [...DOCTORS_QUERY_KEY, "public", "detail", doctorId],
    queryFn: () => getPublicDoctorProfile(doctorId),
    enabled: !!doctorId,
  });
}

export function useSuspenseGetAllDoctors(params: DoctorParams) {
  return useSuspenseQuery({
    queryKey: [...DOCTORS_QUERY_KEY, "list", params],
    queryFn: () => getAllDoctors(params),
  });
}

export function useGetTodayScheduleByDoctor(params: {
  doctorId?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...SCHEDULES_QUERY_KEY, "today", params],
    queryFn: () => getTodayScheduleByDoctor(params),
  });
}
