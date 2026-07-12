import { randomUUID } from "node:crypto";
import type { ServiceImpl } from "@connectrpc/connect";
import { ConnectError, Code } from "@connectrpc/connect";
import { eq } from "drizzle-orm";
import { TaskService } from "@repo/api-rpc";
import type { Database } from "../../db/index.js";
import {
  tasks,
  projects,
  statuses,
  priorities,
  assignees,
} from "../../db/schema.js";
import { notFound, internalServerError } from "../../shared/errors.js";

export type TaskDomainService = ReturnType<typeof createTaskService>;

// ── Domain service ────────────────────────────────────────────────────────────

export function createTaskService(db: Database) {
  return {
    async getTasks() {
      const rows = await db.query.tasks.findMany({
        with: { project: true, status: true, priority: true, assignee: true },
      });

      return {
        tasks: rows.map((row) => ({
          id: row.id,
          slug: row.slug,
          title: row.title,
          description: row.description,
          createdAt: row.createdAt.toISOString(),
          project: row.project,
          status: row.status,
          priority: row.priority,
          assignee: row.assignee ?? null,
        })),
      };
    },

    async getFormOptions() {
      const [allPriorities, allProjects, allAssignees] = await Promise.all([
        db.select().from(priorities).orderBy(priorities.order),
        db.select().from(projects),
        db.select().from(assignees),
      ]);

      return {
        priorities: allPriorities,
        projects: allProjects,
        assignees: allAssignees,
      };
    },

    async createTask(input: {
      title: string;
      description: string;
      projectId: number;
      priorityId: number;
      assigneeId?: number | null;
    }) {
      const { title, description, projectId, priorityId, assigneeId } = input;

      const task = await db.transaction(async (tx) => {
        const [project, defaultStatus] = await Promise.all([
          tx.query.projects.findFirst({ where: eq(projects.id, projectId) }),
          tx.query.statuses.findFirst({ where: eq(statuses.slug, "backlog") }),
        ]);

        if (!project) {
          throw notFound(`Project with id ${projectId} not found`);
        }

        if (!defaultStatus) {
          throw internalServerError("Default status not found");
        }

        const result = await tx
          .insert(tasks)
          .values({
            title,
            description,
            projectId,
            priorityId,
            statusId: defaultStatus.id,
            assigneeId: assigneeId ?? null,
            slug: randomUUID(),
          })
          .returning({ id: tasks.id });

        const createdId = result[0]?.id;
        if (!createdId) {
          throw internalServerError("Failed to create task");
        }

        const slug = `${project.key}-${createdId}`;
        await tx.update(tasks).set({ slug }).where(eq(tasks.id, createdId));

        const full = await tx.query.tasks.findFirst({
          where: eq(tasks.id, createdId),
          with: { project: true, status: true, priority: true, assignee: true },
        });

        return full!;
      });

      return {
        task: {
          id: task.id,
          slug: task.slug,
          title: task.title,
          description: task.description,
          createdAt: task.createdAt.toISOString(),
          project: task.project,
          status: task.status,
          priority: task.priority,
          assignee: task.assignee ?? null,
        },
      };
    },
  };
}

// ── RPC service implementation ────────────────────────────────────────────────

function toConnectError(err: unknown): ConnectError {
  if (err instanceof ConnectError) return err;
  if (err instanceof Error && "statusCode" in err) {
    const { statusCode } = err as { statusCode: number };
    if (statusCode === 404) return new ConnectError(err.message, Code.NotFound);
    if (statusCode === 500) return new ConnectError(err.message, Code.Internal);
  }
  return new ConnectError("Internal server error", Code.Internal);
}

export function createTaskServiceImpl(
  svc: TaskDomainService,
): ServiceImpl<typeof TaskService> {
  return {
    async getTasks() {
      try {
        const result = await svc.getTasks();
        return {
          tasks: result.tasks.map((t) => ({
            ...t,
            assignee: t.assignee ?? undefined,
          })),
        };
      } catch (err) {
        throw toConnectError(err);
      }
    },

    async getFormOptions() {
      try {
        return await svc.getFormOptions();
      } catch (err) {
        throw toConnectError(err);
      }
    },

    async createTask(req) {
      try {
        const result = await svc.createTask({
          title: req.title,
          description: req.description,
          projectId: req.projectId,
          priorityId: req.priorityId,
          assigneeId: req.assigneeId,
        });
        return {
          task: {
            ...result.task,
            assignee: result.task.assignee ?? undefined,
          },
        };
      } catch (err) {
        throw toConnectError(err);
      }
    },
  };
}
