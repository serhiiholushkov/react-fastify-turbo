import { z } from "zod";

// GET /v1/tasks - no request body

// GET /v1/tasks/form-options - no request body

// POST /v1/tasks
export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(10_000),
  projectId: z.number().int().positive(),
  priorityId: z.number().int().positive(),
  assigneeId: z.number().int().positive().nullable().optional(),
});

export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
