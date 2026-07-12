import type { ConnectRouter } from "@connectrpc/connect";
import type { FastifyInstance } from "fastify";
import { TaskService } from "@repo/api-rpc";
import { createTaskService, createTaskServiceImpl } from "./task.service.js";
import { registerTaskRestRoutes } from "./task.rest.routes.js";

export function registerWorkspaceRoutes(
  router: ConnectRouter,
  fastify: FastifyInstance,
) {
  const svc = createTaskService(fastify.db);
  router.service(TaskService, createTaskServiceImpl(svc));
  registerTaskRestRoutes(fastify, svc);
}
