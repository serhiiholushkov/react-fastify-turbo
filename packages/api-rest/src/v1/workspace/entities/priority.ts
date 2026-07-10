import { z } from "zod";

export const prioritySchema = z.object({
  id: z.number().int().positive(),
  /** Lowercase name without spaces, e.g. "no-priority" */
  slug: z.string().min(1),
  name: z.string().min(1),
  order: z.number().int().nonnegative(),
});

export type Priority = z.infer<typeof prioritySchema>;
