import { uploadProfileImage } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USER_QUERY_KEY } from "./auth.hook";

/**
 * Replaces the signed-in user's profile picture.
 *
 * Invalidates `USER_QUERY_KEY` on success rather than writing the returned row
 * into the cache: `GET /auth/me` returns a richer shape (it includes the
 * `doctor` and `patient` relations) than the upload response does, so patching
 * the cached user with it could strip fields the rest of the dashboard reads.
 */
export function useUploadProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
}
