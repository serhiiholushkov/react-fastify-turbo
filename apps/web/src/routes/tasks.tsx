import { AllTasks } from '#/features/tasks/components/all-tasks.tsx'
import { CreateTaskModal } from '#/features/tasks/components/create-task-modal.tsx'
import { getFormOptions, getTasks } from '#/features/tasks/server/tasksActions'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/tasks')({
  validateSearch: (search: Record<string, unknown>) => ({
    createTask:
      search['createTask'] === true || search['createTask'] === 'true',
  }),
  component: RouteComponent,
  loader: async () => {
    const [tasks, formOptions] = await Promise.all([
      getTasks(),
      getFormOptions(),
    ])
    return { tasks, formOptions }
  },
})

function RouteComponent() {
  const { tasks, formOptions } = Route.useLoaderData()
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
