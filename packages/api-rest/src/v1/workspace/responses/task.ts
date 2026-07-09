import type { Task } from "../entities/task.ts";
import type { Priority } from "../entities/priority.ts";
import type { Project } from "../entities/project.ts";
import type { Assignee } from "../entities/assignee.ts";

// GET /v1/tasks
export interface GetTasksResponse {
  tasks: Task[];
}

// GET /v1/tasks/form-options
export interface GetFormOptionsResponse {
  priorities: Priority[];
  projects: Project[];
  assignees: Assignee[];
}

// POST /v1/tasks
export interface CreateTaskResponse {
  task: Task;
}
