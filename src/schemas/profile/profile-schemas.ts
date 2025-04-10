import { z } from "zod";

// Reusable username schema
export const usernameSchema = z
  .string()
  .min(3)
  .max(24)
  .regex(/^[a-zA-Z0-9]+$/, "Only letters and numbers allowed")
  .transform((val) => val.toLowerCase());

// Profile schema using the reusable one
export const profileSchema = z.object({
  username: usernameSchema,
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;
