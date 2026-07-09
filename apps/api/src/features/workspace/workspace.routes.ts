import type { ConnectRouter } from "@connectrpc/connect";
import type { FastifyInstance } from "fastify";
import { TaskService } from "@repo/api-rpc";
import { createTaskServiceImpl } from "./task.service.js";

export function registerWorkspaceRoutes(
  router: ConnectRouter,
  fastify: FastifyInstance,
) {
  router.service(TaskService, createTaskServiceImpl(fastify.db));
}
