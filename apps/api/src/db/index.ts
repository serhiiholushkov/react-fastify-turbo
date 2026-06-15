import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL ?? "";

// Create the postgres-js connection pool.
// max: 10 is a sensible default for a small service.
const queryClient = postgres(connectionString, { max: 10 });

export const db = drizzle(queryClient, {
  schema,
  logger: process.env.NODE_ENV !== "production",
});

export type Database = typeof db;
