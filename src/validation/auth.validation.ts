import z from "zod";

/**
 * The password policy, in one place for routes that *choose* a password
 * (register, reset). Login only checks that a password was typed — the server
 * already accepts any non-empty string so seeded / older accounts are not
 * locked out by client-side complexity rules.
 */
const PasswordSchema = z
  .string()
  .min(8, "Password Must Minimum 8 Characters Long.")
  .regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
  .regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")
  .regex(/[0-9]/, "Password must contain atleast 1 Number")
  .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character");

export const PatientRegistrationZodSchema = z
  .object({
    name: z
      .string("Not A String!!!!!")
      .min(3, "Name must atleast 3 characters long!!!")
      .max(50, "Name must be at most 50 characters long"),
    email: z.email("Not email!"),
    password: PasswordSchema,
    confirmPassword: z.string().min(1, "please confirm your password"),

    contactNumber: z
      .string()
      .refine(
        (val) => val === "" || /^(?:\+?880|0)1[3-9]\d{8}$/.test(val),
        "Please provide valid Bangladeshi number",
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

//* Mobile Operator Prefixes in Bangladesh
//* Grameenphone (GP): 017, 013
//* Banglalink (BL): 019, 014
//* Robi: 018
//* Airtel: 016
//* Teletalk: 015
//! Citycell: 011 (Defunct / Closed)
//! Invalid / Unassigned: 010, 012
//* The regex above is `1[3-9]`: GP 013/017, Banglalink 014/019, Robi 018,
//* Airtel 016, Teletalk 015. 010 and 012 are unassigned.

//? Either +880, 880, 0

export const PatientVerifyEmailZodSchema = z.object({
  email: z.email("Not email!!"),
  otp: z.string().length(6),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password is required"),
});

/** Mirrors the server's `ForgotPasswordZodSchema` — email only. */
export const ForgotPasswordSchema = z.object({
  email: z.email("Not email!!"),
});

/**
 * Mirrors the server's `ResetPasswordZodSchema`.
 *
 * `confirmPassword` is client-only: the backend never receives it, and the
 * server zod strips unknown keys, so including it here cannot change what is
 * sent. The OTP is exactly 6 characters — the server generates it with
 * `crypto.randomInt(100000, 1000000)`, so it is always zero-padded to 6.
 */
export const ResetPasswordSchema = z
  .object({
    email: z.email("Not email!!"),
    otp: z.string().length(6, "OTP must be 6 characters long"),
    newPassword: PasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });
