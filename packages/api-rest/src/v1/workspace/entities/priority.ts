export interface Priority {
  id: number;
  /** Lowercase name without spaces, e.g. "no-priority" */
  slug: string;
  name: string;
  order: number;
}
