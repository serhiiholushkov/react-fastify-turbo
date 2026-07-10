import { z } from "zod";

export const projectSchema = z.object({
  id: z.number().int().positive(),
  /** Lowercase version of key, e.g. "core" */
  slug: z.string().min(1),
  /** Short uppercase prefix used in task slugs, e.g. "CORE" */
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
