import * as z from "zod";

// Reusable password schema
const passwordSchema = z
  .string()
  .min(8, {
    message: "Password must be at least 8 characters long",
  })
  .max(100, {
    message: "Password must be at most 100 characters long",
  })
  .regex(/[a-z].*[a-z]/, {
    message: "Password must contain at least two lowercase letters",
  })
  .regex(/[A-Z].*[A-Z]/, {
    message: "Password must contain at least two uppercase letters",
  })
  .regex(/[0-9].*[0-9]/, {
    message: "Password must contain at least two numbers",
  });

// Shared email schema (cleaner message)
const emailSchema = z.string().email({
  message: "Invalid email address",
});

// =================== SCHEMAS ===================

// Registration Form
export const RegisterSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type RegisterSchemaData = z.infer<typeof RegisterSchema>;

// Login Form
export const LoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, {
    message: "Password is required",
  }),
});
export type LoginSchemaData = z.infer<typeof LoginSchema>;

// Email-only form (e.g. forgot password)
export const EmailSchema = z.object({
  email: emailSchema,
});
export type EmailSchemaData = z.infer<typeof EmailSchema>;

// New Password Form
export const PasswordSchema = z.object({
  password: passwordSchema,
});
export type PasswordSchemaData = z.infer<typeof PasswordSchema>;
