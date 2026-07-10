import { z } from "zod";

export const statusSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  /** Lowercase name without spaces, e.g. "in-progress" */
  slug: z.string().min(1),
  /** HTML hex colour, e.g. "#f97316" */
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex colour"),
});

export type Status = z.infer<typeof statusSchema>;
