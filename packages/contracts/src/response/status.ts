export interface Status {
  id: number;
  name: string;
  /** Lowercase name without spaces, e.g. "in-progress" */
  slug: string;
  /** HTML hex colour, e.g. "#f97316" */
  color: string;
}
