// GET /v1/tasks - no request body

// POST /v1/tasks
export interface CreateTaskRequest {
  title: string;
  description: string;
  projectId: number;
  priorityId: number;
  assigneeId?: number | null;
}
