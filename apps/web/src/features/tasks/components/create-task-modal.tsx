import { useState } from 'react'
import type { Assignee, Priority, Project } from '@repo/contracts'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@repo/ui'
import { useCreateTaskMutation } from '../queries'

type FormOptions = {
  priorities: Priority[]
  projects: Project[]
  assignees: Assignee[]
}

type Props = {
  open: boolean
  onClose: () => void
  formOptions: FormOptions
}

type FormValues = {
  title: string
  description: string
  projectId: string
  priorityId: string
  assigneeId: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

const INITIAL_VALUES: FormValues = {
  title: '',
  description: '',
  projectId: '',
  priorityId: '',
  assigneeId: '',
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.title.trim()) {
    errors.title = 'Title is required'
  }
  if (!values.projectId) {
    errors.projectId = 'Project is required'
  }
  if (!values.priorityId) {
    errors.priorityId = 'Priority is required'
  }
  if (!values.assigneeId) {
    errors.assigneeId = 'Assignee is required'
  }
  return errors
}

export function CreateTaskModal({ open, onClose, formOptions }: Props) {
  const createTask = useCreateTaskMutation()
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES)
  const [errors, setErrors] = useState<FormErrors>({})

  const submitting = createTask.isPending

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose()
    }
  }

  const handleClose = () => {
    setValues(INITIAL_VALUES)
    setErrors({})
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    try {
      await createTask.mutateAsync({
        title: values.title.trim(),
        description: values.description.trim(),
        projectId: Number(values.projectId),
        priorityId: Number(values.priorityId),
        assigneeId: Number(values.assigneeId),
      })
      handleClose()
    } catch (err) {
      console.error('Failed to create task', err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              placeholder="Task title"
              value={values.title}
              onChange={(e) =>
                setValues((v) => ({ ...v, title: e.target.value }))
              }
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Optional description"
              value={values.description}
              onChange={(e) =>
                setValues((v) => ({ ...v, description: e.target.value }))
              }
              rows={3}
            />
          </div>

          {/* Project */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-project">Project</Label>
            <Select
              value={values.projectId}
              onValueChange={(val) =>
                setValues((v) => ({ ...v, projectId: val }))
              }
            >
              <SelectTrigger
                id="task-project"
                aria-invalid={!!errors.projectId}
              >
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.projects.map((project) => (
                  <SelectItem key={project.id} value={String(project.id)}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.projectId && (
              <p className="text-xs text-destructive">{errors.projectId}</p>
            )}
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-priority">Priority</Label>
            <Select
              value={values.priorityId}
              onValueChange={(val) =>
                setValues((v) => ({ ...v, priorityId: val }))
              }
            >
              <SelectTrigger
                id="task-priority"
                aria-invalid={!!errors.priorityId}
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.priorities.map((priority) => (
                  <SelectItem key={priority.id} value={String(priority.id)}>
                    {priority.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priorityId && (
              <p className="text-xs text-destructive">{errors.priorityId}</p>
            )}
          </div>

          {/* Assignee */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task-assignee">Assignee</Label>
            <Select
              value={values.assigneeId}
              onValueChange={(val) =>
                setValues((v) => ({ ...v, assigneeId: val }))
              }
            >
              <SelectTrigger
                id="task-assignee"
                aria-invalid={!!errors.assigneeId}
              >
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {formOptions.assignees.map((assignee) => (
                  <SelectItem key={assignee.id} value={String(assignee.id)}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assigneeId && (
              <p className="text-xs text-destructive">{errors.assigneeId}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
