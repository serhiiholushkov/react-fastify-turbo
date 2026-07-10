import fastify from "fastify";
import { cors as connectCors } from "@connectrpc/connect";
import fastifyCors from "@fastify/cors";
import dbPlugin from "./plugins/db.plugin.js";
import connectPlugin from "./plugins/connect.plugin.js";
import { registerCommonHooks } from "./hooks/common.hooks.js";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

export async function buildApp() {
  const server = fastify({ logger: false });

  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);

  registerCommonHooks(server);

  await server.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    methods: [...connectCors.allowedMethods],
    allowedHeaders: [...connectCors.allowedHeaders],
    exposedHeaders: [...connectCors.exposedHeaders],
    // Let browsers cache CORS information to reduce the number of
    // preflight requests. Modern Chrome caps the value at 2h.
    // maxAge: 2 * 60 * 60,
    // hook: "preHandler",
  });
  await server.register(dbPlugin);
  await server.register(connectPlugin);

  return server;
}
