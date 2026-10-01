export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  patient: {
    contactNumber?: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}
export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

/** Body of `POST /auth/forgot-password`. */
export interface ForgotPasswordPayload {
  email: string;
}

/**
 * Body of `POST /auth/reset-password`.
 *
 * `otp` is the 6-digit code from the recovery email, not the account-verification
 * one — the backend keys them separately in Redis.
 */
export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}
