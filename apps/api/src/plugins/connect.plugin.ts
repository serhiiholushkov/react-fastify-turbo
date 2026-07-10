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

// The following is an example of a custom validation interceptor
// import type { Interceptor } from "@connectrpc/connect";
// import { ConnectError, Code } from "@connectrpc/connect";
// import { CreateTaskRequest } from "@repo/api-rpc";

// export const customValidationInterceptor: Interceptor = (next) => (req) => {
//   if (!req.stream && req.method.name === "CreateTask") {
//     const msg = req.message as CreateTaskRequest;
//     if (msg.title.trim().length === 0) {
//       throw new ConnectError("Title cannot be blank", Code.InvalidArgument);
//     }
//   }
//   return next(req);
// };
//
// Then use it
// interceptors: [createValidateInterceptor(), customValidationInterceptor],
