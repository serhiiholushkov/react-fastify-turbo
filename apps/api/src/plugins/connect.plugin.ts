import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";
import { createValidateInterceptor } from "@connectrpc/validate";
import { registerWorkspaceRoutes } from "../features/workspace/workspace.routes.js";

const connectPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyConnectPlugin, {
    interceptors: [createValidateInterceptor()],
    routes(router) {
      registerWorkspaceRoutes(router, fastify);
      // Register additional service routes here as the app grows:
      // registerOtherRoutes(router, fastify);
    },
  });
};

export default fp(connectPlugin, {
  name: "connect-plugin",
  dependencies: ["db-plugin"],
  fastify: "5.x",
});
