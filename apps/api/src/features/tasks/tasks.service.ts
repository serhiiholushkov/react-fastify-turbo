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

export function createTaskServiceImpl(
  db: Database,
): ServiceImpl<typeof TaskService> {
  return {
    async getTasks() {
      const rows = await db.query.tasks.findMany({
        with: {
          project: true,
          status: true,
          priority: true,
          assignee: true,
        },
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
          assignee: row.assignee ?? undefined,
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

    async createTask(req) {
      const { title, description, projectId, priorityId, assigneeId } = req;

      const task = await db.transaction(async (tx) => {
        const [project, defaultStatus] = await Promise.all([
          tx.query.projects.findFirst({ where: eq(projects.id, projectId) }),
          tx.query.statuses.findFirst({ where: eq(statuses.slug, "backlog") }),
        ]);

        if (!project) {
          throw new ConnectError(
            `Project with id ${projectId} not found`,
            Code.NotFound,
          );
        }

        if (!defaultStatus) {
          throw new ConnectError("Default status not found", Code.Internal);
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
            slug: "pending",
          })
          .returning({ id: tasks.id });

        const createdId = result[0]?.id;
        if (!createdId) {
          throw new ConnectError("Failed to create task", Code.Internal);
        }

        const slug = `${project.key}-${createdId}`;
        await tx.update(tasks).set({ slug }).where(eq(tasks.id, createdId));

        const full = await tx.query.tasks.findFirst({
          where: eq(tasks.id, createdId),
          with: {
            project: true,
            status: true,
            priority: true,
            assignee: true,
          },
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
          assignee: task.assignee ?? undefined,
        },
      };
    },
  };
}
