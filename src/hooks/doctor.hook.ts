import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  applyDoctor,
  doctorAccountApprovalRejection, 
  getAllDoctors,
  verifyDoctorAccount,
} from "@/api/doctor.api";
import type { DoctorParams, GetAllDoctorsResponse } from "@/types";

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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: doctorAccountApprovalRejection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors']})
    }
  });
}

export function useGetAllDoctors(params: DoctorParams) {
  return useQuery({
    queryKey: ["doctors", params],
    queryFn: () => getAllDoctors(params),
  });
}

export function useSuspenseGetAllDoctors(params: DoctorParams) {
  return useSuspenseQuery({
    queryKey: ["doctors"],
    queryFn: () => getAllDoctors(params),
  });
}
