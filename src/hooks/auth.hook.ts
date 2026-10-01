import {
  forgotPassword,
  getMe,
  resetPassword,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
} from "@/api";
import { googleOAuth } from "@/providers/google-auth.provider";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}
export function useVerifyAccount() {
  return useMutation({
    mutationFn: verifyAccount,
  });
}
export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}
export function useLogout() {
  return useMutation({
    mutationFn: userLogout,
  });
}

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}

/**
 * Both password-recovery steps are plain mutations with no cache to
 * invalidate: neither endpoint reads or writes anything the `["user"]` query
 * holds, and neither establishes a session.
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPassword,
  });
}
export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}
