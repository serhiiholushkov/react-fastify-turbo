import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import { TaskService } from "@repo/api-rpc";
import { createTaskServiceImpl } from "./tasks.service.js";

const tasksPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyConnectPlugin, {
    routes(router) {
      router.service(TaskService, createTaskServiceImpl(fastify.db));
    },
  });
};

export default fp(tasksPlugin, {
  name: "tasks-plugin",
  dependencies: ["db-plugin"],
  fastify: "5.x",
});
