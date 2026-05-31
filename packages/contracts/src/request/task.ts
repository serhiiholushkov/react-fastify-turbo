export interface CreateTaskRequest {
  title: string;
  description: string;
  projectId: number;
  priorityId: number;
  assigneeId?: number | null;
}
