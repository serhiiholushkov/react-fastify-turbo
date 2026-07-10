import { z } from "zod";

export const assigneeSchema = z.object({
  id: z.number().int().positive(),
  /** Lowercase name without spaces, e.g. "emmajones" */
  slug: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
});

export type Assignee = z.infer<typeof assigneeSchema>;
