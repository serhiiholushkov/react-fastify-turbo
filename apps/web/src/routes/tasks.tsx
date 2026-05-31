import { AllTasks } from '#/features/tasks/components/all-tasks.tsx'
import { getTasks } from '#/features/tasks/server/tasksActions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tasks')({
  component: RouteComponent,
  loader: async () => {
    return getTasks()
  },
})

function RouteComponent() {
  const tasks = Route.useLoaderData() || []

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">All Tasks</h1>
      <AllTasks tasks={tasks} />
    </div>
  )
}
