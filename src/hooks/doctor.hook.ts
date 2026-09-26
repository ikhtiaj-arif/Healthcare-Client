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
  verifyDoctorAccount,
} from "@/api/doctor.api";
import type { DoctorParams, DoctorVerificationStatus } from "@/types";

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
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
}

export function useGetAllDoctors(params: DoctorParams) {
  return useQuery({
    queryKey: ["doctors", params],
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
    queryKey: ["doctors", "counts"],
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

export function useSuspenseGetAllDoctors(params: DoctorParams) {
  return useSuspenseQuery({
    queryKey: ["doctors"],
    queryFn: () => getAllDoctors(params),
  });
}
