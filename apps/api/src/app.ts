import fastify from "fastify";
import cors from "@fastify/cors";
import dbPlugin from "./plugins/db.plugin.js";
import tasksPlugin from "./features/tasks/tasks.plugin.js";

export async function buildApp() {
  const server = fastify({ logger: true });

  await server.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  });
  await server.register(dbPlugin);
  await server.register(tasksPlugin);

  return server;
}
