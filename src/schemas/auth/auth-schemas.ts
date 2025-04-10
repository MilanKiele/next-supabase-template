import * as z from "zod";

// RegisterSchemaData is the type of data that RegisterSchema will validate
export type RegisterSchemaData = z.infer<typeof RegisterSchema>;
export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  // Password Requirements
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100, {
      message: "Password must be at most 100 characters long",
    })
    .regex(/^[a-zA-Z0-9]*$/, {
      message: "Password cannot contain special symbols",
    })
    .regex(/[a-z].*[a-z]/, {
      message: "Password must contain at least two lowercase letters",
    })
    .regex(/[A-Z].*[A-Z]/, {
      message: "Password must contain at least two uppercase letters",
    })
    .regex(/[0-9].*[0-9]/, {
      message: "Password must contain at least two numbers",
    }),
});

// LoginSchemaData is the type of data that LoginSchema will validate
export type LoginSchemaData = z.infer<typeof LoginSchema>;
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  // no extra password validation check because of possible updated requirements -> no need here
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

// Email where the new user email will be
export type EmailSchemaData = z.infer<typeof EmailSchema>;
export const EmailSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

// For setting a new Password
export type PasswordSchemaData = z.infer<typeof PasswordSchema>;
export const PasswordSchema = z.object({
  // Definition of Password Requirements
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .max(100, {
      message: "Password must be at most 100 characters long",
    })
    .regex(/^[a-zA-Z0-9]*$/, {
      message: "Password cannot contain special symbols",
    })
    .regex(/[a-z].*[a-z]/, {
      message: "Password must contain at least two lowercase letters",
    })
    .regex(/[A-Z].*[A-Z]/, {
      message: "Password must contain at least two uppercase letters",
    })
    .regex(/[0-9].*[0-9]/, {
      message: "Password must contain at least two numbers",
    }),
});
