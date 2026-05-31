import { Assignee } from "./assignee.ts";
import { Priority } from "./priority.ts";
import { Project } from "./project.ts";
import { Status } from "./status.ts";

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
