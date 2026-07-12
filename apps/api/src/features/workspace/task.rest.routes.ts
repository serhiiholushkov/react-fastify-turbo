import { z } from "zod";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  createTaskSchema,
  getTasksResponseSchema,
  getFormOptionsResponseSchema,
  createTaskResponseSchema,
} from "@repo/api-rest";
import type { TaskDomainService } from "./task.service.js";

const errorSchema = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
});

export function registerTaskRestRoutes(
  fastify: FastifyInstance,
  svc: TaskDomainService,
) {
  const f = fastify.withTypeProvider<ZodTypeProvider>();

  // GET /v1/tasks
  f.get(
    "/v1/tasks",
    {
      schema: {
        tags: ["tasks"],
        summary: "List all tasks",
        response: {
          200: getTasksResponseSchema,
          500: errorSchema,
        },
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
        tags: ["tasks"],
        summary: "Get form options for task creation",
        response: {
          200: getFormOptionsResponseSchema,
          500: errorSchema,
        },
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
        tags: ["tasks"],
        summary: "Create a new task",
        body: createTaskSchema,
        response: {
          201: createTaskResponseSchema,
          400: errorSchema,
          404: errorSchema,
          500: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const result = await svc.createTask(request.body);
      return reply.code(201).send(result);
    },
  );
}
