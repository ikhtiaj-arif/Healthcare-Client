import apiClient from "@/lib/apiClient";
import type { ApiResponse, User } from "@/types";

/**
 * Uploads a new profile picture.
 *
 * `multipart/form-data` with one part named `profileImage`. The field name is not
 * configurable — the backend route is `upload.single("profileImage")` — so a
 * mismatch surfaces as `400 No file provided`.
 *
 * The URL is always regenerated server-side and the old Cloudinary asset is
 * destroyed afterwards, but only when both `imageUrl` and `image_public_id` were
 * already set. There is no way to set `imageUrl` directly.
 *
 * Answers 201, not 200. The response is the user row with `password` omitted and
 * **no** `patient` / `doctor` relation, which `User` already models as optional —
 * so it is reused here rather than duplicated into a near-identical type that
 * would drift.
 *
 * No client-side file size or MIME restriction is applied, because the backend
 * has none either: multer is configured with bare `memoryStorage()` and no
 * limits, and the buffer goes to Cloudinary as `resource_type: "auto"`. Adding a
 * check here would be a UX nicety, not a mirror of the server, so it belongs with
 * the upload component in B3 rather than here.
 */
export async function uploadProfileImage(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("profileImage", file);

  const response = await apiClient<ApiResponse<User>>("/user/profile-image", {
    method: "PATCH",
    body: formData,
  });
  return response.data;
}
