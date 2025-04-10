import * as z from "zod";

export type PostSchemaData = z.infer<typeof PostSchema>;

export const PostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters long")
    .max(2000, "Content must be at most 2000 characters long"),
});
