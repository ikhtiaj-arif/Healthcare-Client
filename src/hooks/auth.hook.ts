import { getMe, userLogin, userLogout } from "@/api";
import { googleOAuth } from "@/providers/google-auth.provider";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
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
