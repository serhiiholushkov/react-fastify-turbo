import {
  queryOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { CreateTaskRequest } from '@repo/api-rest'
import { taskClient } from '#/lib/task-client'

export const tasksQueryOptions = queryOptions({
  queryKey: ['workspace', 'tasks'],
  queryFn: async () => {
    const res = await taskClient.getTasks()
    return res.tasks
  },
})

export const formOptionsQueryOptions = queryOptions({
  queryKey: ['workspace', 'formOptions'],
  queryFn: () => taskClient.getFormOptions(),
})

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTaskRequest) => taskClient.createTask(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['workspace'] })
    },
  })
}
