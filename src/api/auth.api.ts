import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  ForgotPasswordPayload,
  LoginPayload,
  RegistrationPayload,
  ResetPasswordPayload,
  User,
  VerifyAccountPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}
export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}
export function userRegistration(payload: RegistrationPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}
export function userLogout() {
  return apiClient("/auth/logout", { method: "POST" });
}

/**
 * Starts password recovery.
 *
 * The backend mints a 6-digit OTP, stores it in Redis under
 * `forgot_password-otp:<email>` with a 300 second TTL, emails it, and answers
 * `data: null`. The `message` echoes the submitted address back, so it is not a
 * static string and must not be rendered as one.
 *
 * Deliberately not typed as `ApiResponse<null>` at the call site: the caller
 * only needs to know it succeeded, and several of the guards here are 404/403
 * (`User does not exist!`, `User is Blocked!`, `User Has account with google`)
 * that `getApiErrorMessage` surfaces as a message.
 */
export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient("/auth/forgot-password", { method: "POST", body: payload });
}

/**
 * Completes password recovery with the emailed OTP.
 *
 * The backend deletes the Redis key on success, so a code is single-use. It does
 * **not** clear the accessToken/refreshToken cookies or revoke tokens issued
 * before the change, so the UI sends the user back to /login rather than
 * treating this as a completed sign-in.
 */
export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
}

export function getMe() {
  return apiClient<ApiResponse<User>>("/auth/me", { method: "GET" });
}
