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
  getAvailableDoctorsToday,
  getTodayScheduleByDoctor,
  updateMyDoctorProfile,
  verifyDoctorAccount,
} from "@/api/doctor.api";
import type {
  AvailableDoctorsParams,
  DoctorParams,
  DoctorVerificationStatus,
  PublicDoctorParams,
} from "@/types";
import { USER_QUERY_KEY } from "./auth.hook";
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

/**
 * The public directory list, used by `doctor-list.tsx` via suspense so a failure
 * reaches the segment's `error.tsx` rather than rendering an empty table.
 *
 * A non-suspense twin of this was removed: it had no callers, and on a static
 * export `useQuery` is the wrong shape here anyway — the doctor pages need the
 * data at build time, not in the browser.
 */
export function useSuspenseGetPublicDoctors(params: PublicDoctorParams) {
  return useSuspenseQuery({
    queryKey: [...DOCTORS_QUERY_KEY, "public", params],
    queryFn: () => getAllPublicDoctors(params),
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

/**
 * Keyed under `"public"` alongside the other public doctor lists rather than
 * under a new segment, because it is the same audience: an anonymous visitor
 * browsing doctors. A future change to the public directory can invalidate all
 * three with one prefix.
 */
export function useGetAvailableDoctorsToday(params: AvailableDoctorsParams) {
  return useQuery({
    queryKey: [...DOCTORS_QUERY_KEY, "public", "available-today", params],
    queryFn: () => getAvailableDoctorsToday(params),
  });
}

/**
 * Invalidates both key families on success.
 *
 * `USER_QUERY_KEY` because `/auth/me` is what the dashboard shell reads, and it
 * carries the `doctor` summary — so a saved bio or consultation fee has to
 * reappear in the sidebar without a reload. The doctors prefix covers the public
 * directory and available-today lists, which show the same fields.
 */
export function useUpdateMyDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyDoctorProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
    },
  });
}
