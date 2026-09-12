import { getMe, userLogin, userLogout, userRegistration } from "@/api";
import { googleOAuth } from "@/providers/google-auth.provider";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
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

export function useGoogleOAuth()
{
 return useMutation({
  mutationFn: googleOAuth
 }) 
}
export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false
  });
}
