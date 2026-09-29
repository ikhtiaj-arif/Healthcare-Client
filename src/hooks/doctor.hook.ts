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
  verifyDoctorAccount,
} from "@/api/doctor.api";
import type { DoctorParams, DoctorVerificationStatus, PublicDoctorParams } from "@/types";

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
// admin only
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

export function useGetAllPublicDoctors(params: PublicDoctorParams) {
  return useQuery({
    queryKey: ["doctor", "public", params],
    queryFn: () => getAllPublicDoctors(params),
  });
}

export function useSuspenseGetPublicDoctors(params: PublicDoctorParams) {
  return useSuspenseQuery({
    queryKey: ["doctors", "public", params],
    queryFn: () => getAllPublicDoctors(params),
  });
}

export function usePublicDoctorProfile(doctorId: string) {
  return useQuery({
    queryKey: ["doctor", "public", doctorId],
    queryFn: () => getPublicDoctorProfile(doctorId),
    enabled: !!doctorId,
  });
}

export function useSuspenseGetAllDoctors(params: DoctorParams) {
  return useSuspenseQuery({
    queryKey: ["doctors", params],
    queryFn: () => getAllDoctors(params),
  });
}
