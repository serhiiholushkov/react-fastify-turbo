import { z } from "zod";
import { assigneeSchema } from "./assignee.js";
import { prioritySchema } from "./priority.js";
import { projectSchema } from "./project.js";
import { statusSchema } from "./status.js";

export const taskSchema = z.object({
  id: z.number().int().positive(),
  /** Human-friendly identifier combining project key and task id, e.g. "CORE-1" */
  slug: z.string().min(1),
  project: projectSchema,
  status: statusSchema,
  priority: prioritySchema,
  assignee: assigneeSchema.nullable(),
  title: z.string().min(1),
  description: z.string(),
  createdAt: z.string().datetime(),
});

export type Task = z.infer<typeof taskSchema>;
