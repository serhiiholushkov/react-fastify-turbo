export interface Assignee {
  id: number;
  /** Lowercase name without spaces, e.g. "emmajones" */
  slug: string;
  name: string;
  email: string;
}

export interface Priority {
  id: number;
  /** Lowercase name without spaces, e.g. "no-priority" */
  slug: string;
  name: string;
  order: number;
}

export interface Status {
  id: number;
  name: string;
  /** Lowercase name without spaces, e.g. "in-progress" */
  slug: string;
  /** HTML hex colour, e.g. "#f97316" */
  color: string;
}

export interface Project {
  id: number;
  /** Lowercase version of key, e.g. "core" */
  slug: string;
  /** Short uppercase prefix used in task slugs, e.g. "CORE" */
  key: string;
  name: string;
  description: string;
}

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
