import { z } from "zod";

export type ProfileSchemaType = z.infer<typeof profileSchema>;
export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(24, "Username must be at most 24 characters")
    .or(z.literal("")),
});
