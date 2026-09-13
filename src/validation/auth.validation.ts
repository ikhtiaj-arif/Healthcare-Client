import z from "zod";

export const PatientRegistrationZodSchema = z
  .object({
    name: z
      .string("Not A String!!!!!")
      .min(3, "Name must atleast 3 characters long!!!")
      .max(50, "Name must be at most 50 characters long"),
    email: z.email("Not email!"),
    password: z
      .string()
      .min(8, "Password Must Minimum 8 Characters Long.")
      .regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
      .regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")

      .regex(/[0-9]/, "Password must contain atleast 1 Number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain atleast 1 Special Character",
      ),
    confirmPassword: z.string().min(1, "please confirm your password"),

    contactNumber: z
      .string()
      .refine((val) => val === "" || /^(?:\+?880|0)1[3-9]\d{8}$/.test(val)
        ,
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
//todo we need to confirm from [3-9]

//? Either +880, 880, 0

export const PatientVerifyEmailZodSchema = z.object({
  email: z.email("Not email!!"),
  otp: z.string().length(6),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password Must Minimum 8 Characters Long.")
    .regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
    .regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")

    .regex(/[0-9]/, "Password must contain atleast 1 Number")
    .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
});
