import { z } from "zod";
import { taskSchema } from "../entities/task.ts";
import { prioritySchema } from "../entities/priority.ts";
import { projectSchema } from "../entities/project.ts";
import { assigneeSchema } from "../entities/assignee.ts";

// GET /v1/tasks
export const getTasksResponseSchema = z.object({
  tasks: z.array(taskSchema),
});

export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>;

// GET /v1/tasks/form-options
export const getFormOptionsResponseSchema = z.object({
  priorities: z.array(prioritySchema),
  projects: z.array(projectSchema),
  assignees: z.array(assigneeSchema),
});

export type GetFormOptionsResponse = z.infer<
  typeof getFormOptionsResponseSchema
>;

// POST /v1/tasks
export const createTaskResponseSchema = z.object({
  task: taskSchema,
});

export type CreateTaskResponse = z.infer<typeof createTaskResponseSchema>;
