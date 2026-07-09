import type { Assignee } from "./assignee.ts";
import type { Priority } from "./priority.ts";
import type { Project } from "./project.ts";
import type { Status } from "./status.ts";

export interface Task {
  id: number;
  /** Human-friendly identifier combining project key and task id, e.g. "CORE-1" */
  slug: string;
  project: Project;
  status: Status;
  priority: Priority;
  assignee: Assignee | null;
  title: string;
  description: string;
  createdAt: string;
}
