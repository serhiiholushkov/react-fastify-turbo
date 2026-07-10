import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createTaskSchema,
  getTasksResponseSchema,
  getFormOptionsResponseSchema,
  createTaskResponseSchema,
} from "@repo/api-rest";
import { createTaskService } from "./task.service.js";

export function registerTaskRestRoutes(fastify: FastifyInstance) {
  const f = fastify.withTypeProvider<ZodTypeProvider>();
  const svc = createTaskService(fastify.db);

  // GET /v1/tasks
  f.get(
    "/v1/tasks",
    {
      schema: {
        response: { 200: getTasksResponseSchema },
      },
    },
    async () => {
      return svc.getTasks();
    },
  );

  // GET /v1/tasks/form-options
  f.get(
    "/v1/tasks/form-options",
    {
      schema: {
        response: { 200: getFormOptionsResponseSchema },
      },
    },
    async () => {
      return svc.getFormOptions();
    },
  );

  // POST /v1/tasks
  f.post(
    "/v1/tasks",
    {
      schema: {
        body: createTaskSchema,
        response: { 201: createTaskResponseSchema },
      },
    },
    async (request, reply) => {
      const result = await svc.createTask(request.body);
      return reply.code(201).send(result);
    },
  );
}
