import type {
  Assignee,
  CreateTaskRequest,
  Priority,
  Project,
  Status,
  Task,
} from '@repo/api-rest'
import type {
  Assignee as RpcAssignee,
  Priority as RpcPriority,
  Project as RpcProject,
  Status as RpcStatus,
  Task as RpcTask,
} from '@repo/api-rpc'
import { taskRpcClient } from './rpc-client'
import { taskRestClient } from './rest-client'

// ── RPC → REST type converters ────────────────────────────────────────────────

function toAssignee(rpc: RpcAssignee): Assignee {
  return { id: rpc.id, slug: rpc.slug, name: rpc.name, email: rpc.email }
}

function toPriority(rpc: RpcPriority): Priority {
  return { id: rpc.id, slug: rpc.slug, name: rpc.name, order: rpc.order }
}

function toProject(rpc: RpcProject): Project {
  return {
    id: rpc.id,
    slug: rpc.slug,
    key: rpc.key,
    name: rpc.name,
    description: rpc.description,
  }
}

function toStatus(rpc: RpcStatus): Status {
  return { id: rpc.id, name: rpc.name, slug: rpc.slug, color: rpc.color }
}

function toTask(rpc: RpcTask): Task {
  return {
    id: rpc.id,
    slug: rpc.slug,
    title: rpc.title,
    description: rpc.description,
    createdAt: rpc.createdAt,
    project: toProject(rpc.project!),
    status: toStatus(rpc.status!),
    priority: toPriority(rpc.priority!),
    assignee: rpc.assignee ? toAssignee(rpc.assignee) : null,
  }
}

// ── RPC adapter (normalises output to REST types) ─────────────────────────────

const rpcTaskClientAdapter = {
  getTasks: async () => {
    const res = await taskRpcClient.getTasks({})
    return { tasks: res.tasks.map(toTask) }
  },

  getFormOptions: async () => {
    const res = await taskRpcClient.getFormOptions({})
    return {
      priorities: res.priorities.map(toPriority),
      projects: res.projects.map(toProject),
      assignees: res.assignees.map(toAssignee),
    }
  },

  createTask: async (req: CreateTaskRequest) => {
    const res = await taskRpcClient.createTask({
      title: req.title,
      description: req.description,
      projectId: req.projectId,
      priorityId: req.priorityId,
      assigneeId: req.assigneeId ?? undefined,
    })
    return { task: toTask(res.task!) }
  },
}

// ── Unified client ─────────────────────────────────────────────────────────────
// Set VITE_API_CLIENT=rest to use the REST client; defaults to RPC.

export const taskClient =
  import.meta.env.VITE_API_CLIENT === 'rest'
    ? taskRestClient
    : rpcTaskClientAdapter
