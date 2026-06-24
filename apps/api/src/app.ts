import fastify from "fastify";
import dbPlugin from "./plugins/db.plugin.js";
import tasksPlugin from "./features/tasks/tasks.plugin.js";

export async function buildApp() {
  const server = fastify();

  await server.register(dbPlugin);
  await server.register(tasksPlugin);

  return server;
}
