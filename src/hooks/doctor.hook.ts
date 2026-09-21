import { applyDoctor, verifyDoctorAccount } from "@/api/doctor.api";
import { useMutation } from "@tanstack/react-query";
import { multipleOf } from "zod";

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
