import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type {
  Assignee,
  Priority,
  Project,
  Status,
  Task,
  CreateTaskRequest,
} from '@repo/contracts'
import type {
  Assignee as RpcAssignee,
  Priority as RpcPriority,
  Project as RpcProject,
  Status as RpcStatus,
  Task as RpcTask,
} from '@repo/api-rpc'
import { taskRpcClient } from '#/lib/rpc-client'

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

export const tasksQueryOptions = queryOptions({
  queryKey: ['workspace', 'tasks'],
  queryFn: async () => {
    const res = await taskRpcClient.getTasks({})
    return res.tasks.map(toTask)
  },
})

export const formOptionsQueryOptions = queryOptions({
  queryKey: ['workspace', 'formOptions'],
  queryFn: async () => {
    const res = await taskRpcClient.getFormOptions({})
    return {
      priorities: res.priorities.map(toPriority),
      projects: res.projects.map(toProject),
      assignees: res.assignees.map(toAssignee),
    }
  },
})

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskRequest) =>
      taskRpcClient.createTask({
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        priorityId: data.priorityId,
        assigneeId: data.assigneeId ?? undefined,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['workspace'] })
    },
  })
}
