import { useMutation, useQuery } from "@tanstack/react-query";
import {
  applyDoctor,
  getAllDoctors,
  verifyDoctorAccount,
} from "@/api/doctor.api";
import type { GetAllDoctorsResponse } from "@/types";

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

export function useGetAllDoctors() {
  return useQuery<GetAllDoctorsResponse>({
    queryKey: ["doctors"],
    queryFn: getAllDoctors,
  });
}
