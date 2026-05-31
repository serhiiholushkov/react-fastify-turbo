export interface Project {
  id: number;
  /** Lowercase version of key, e.g. "core" */
  slug: string;
  /** Short uppercase prefix used in task slugs, e.g. "CORE" */
  key: string;
  name: string;
  description: string;
}
