import { useSuspenseQuery } from '@tanstack/react-query'
import { AllTasks } from '#/features/workspace/components/all-tasks.tsx'
import { CreateTaskModal } from '#/features/workspace/components/create-task-modal.tsx'
import {
  tasksQueryOptions,
  formOptionsQueryOptions,
} from '#/features/workspace/queries'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/tasks')({
  validateSearch: (search: Record<string, unknown>) => ({
    createTask:
      search['createTask'] === true || search['createTask'] === 'true',
  }),
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(tasksQueryOptions),
      queryClient.ensureQueryData(formOptionsQueryOptions),
    ])
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { data: tasks } = useSuspenseQuery(tasksQueryOptions)
  const { data: formOptions } = useSuspenseQuery(formOptionsQueryOptions)
  const { createTask } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const handleClose = () => {
    void navigate({ search: { createTask: false }, replace: true })
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">All Tasks</h1>
      <AllTasks tasks={tasks ?? []} />
      <CreateTaskModal
        open={createTask === true}
        onClose={handleClose}
        formOptions={formOptions}
      />
    </div>
  )
}
