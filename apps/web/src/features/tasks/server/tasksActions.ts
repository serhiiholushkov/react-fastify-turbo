import { createServerFn } from '@tanstack/react-start'
import * as fs from 'node:fs'
import type { CreateTaskRequest } from '@repo/contracts'
import type { Assignee, Priority, Project, Task } from '@repo/contracts'
import type { TasksData } from '../types'

const TASKS_FILE_PATH = 'src/data/tasks.json'
const PRIORITIES_FILE_PATH = 'src/data/priorities.json'
const PROJECTS_FILE_PATH = 'src/data/projects.json'
const ASSIGNEES_FILE_PATH = 'src/data/assignees.json'
const DEFAULT_STATUS = {
  id: 1,
  name: 'Backlog',
  slug: 'backlog',
  color: '#94a3b8',
}

export const getTasks = createServerFn({
  method: 'GET',
}).handler(async () => {
  const tasksData = await fs.promises.readFile(TASKS_FILE_PATH, 'utf-8')
  return JSON.parse(tasksData) as TasksData
})

export const getFormOptions = createServerFn({
  method: 'GET',
}).handler(async () => {
  const [prioritiesRaw, projectsRaw, assigneesRaw] = await Promise.all([
    fs.promises.readFile(PRIORITIES_FILE_PATH, 'utf-8'),
    fs.promises.readFile(PROJECTS_FILE_PATH, 'utf-8'),
    fs.promises.readFile(ASSIGNEES_FILE_PATH, 'utf-8'),
  ])
  return {
    priorities: JSON.parse(prioritiesRaw) as Priority[],
    projects: JSON.parse(projectsRaw) as Project[],
    assignees: JSON.parse(assigneesRaw) as Assignee[],
  }
})

export const createTask = createServerFn({
  method: 'POST',
})
  .inputValidator((data: unknown): CreateTaskRequest => {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid task data: expected an object')
    }

    const { title, description, projectId, priorityId, assigneeId } =
      data as Record<string, unknown>

    if (typeof title !== 'string' || title.trim().length === 0) {
      throw new Error('Invalid task data: title must be a non-empty string')
    }

    if (typeof description !== 'string') {
      throw new Error('Invalid task data: description must be a string')
    }

    if (typeof projectId !== 'number') {
      throw new Error('Invalid task data: projectId must be a number')
    }

    if (typeof priorityId !== 'number') {
      throw new Error('Invalid task data: priorityId must be a number')
    }

    if (
      assigneeId !== undefined &&
      assigneeId !== null &&
      typeof assigneeId !== 'number'
    ) {
      throw new Error('Invalid task data: assigneeId must be a number or null')
    }

    return {
      title: title.trim(),
      description: description.trim(),
      projectId,
      priorityId,
      assigneeId: assigneeId as number | null | undefined,
    }
  })
  .handler(async ({ data }) => {
    const [tasksRaw, prioritiesRaw, projectsRaw, assigneesRaw] =
      await Promise.all([
        fs.promises.readFile(TASKS_FILE_PATH, 'utf-8'),
        fs.promises.readFile(PRIORITIES_FILE_PATH, 'utf-8'),
        fs.promises.readFile(PROJECTS_FILE_PATH, 'utf-8'),
        fs.promises.readFile(ASSIGNEES_FILE_PATH, 'utf-8'),
      ])

    const tasks = JSON.parse(tasksRaw) as Task[]
    const priorities = JSON.parse(prioritiesRaw) as Priority[]
    const projects = JSON.parse(projectsRaw) as Project[]
    const assignees = JSON.parse(assigneesRaw) as Assignee[]

    const project = projects.find((p) => p.id === data.projectId)
    if (!project) {
      throw new Error(`Project with id ${data.projectId} not found`)
    }

    const priority = priorities.find((p) => p.id === data.priorityId)
    if (!priority) {
      throw new Error(`Priority with id ${data.priorityId} not found`)
    }

    const assignee =
      data.assigneeId != null
        ? (assignees.find((a) => a.id === data.assigneeId) ?? null)
        : null

    const nextId =
      tasks.length > 0 ? Math.max(...tasks.map((t) => t.id)) + 1 : 1
    const slug = `${project.key}-${nextId}`

    const newTask: Task = {
      id: nextId,
      slug,
      project,
      status: DEFAULT_STATUS,
      priority,
      assignee,
      title: data.title,
      description: data.description,
      createdAt: new Date().toISOString(),
    }

    await fs.promises.writeFile(
      TASKS_FILE_PATH,
      JSON.stringify([...tasks, newTask], null, 2),
      'utf-8',
    )

    return newTask
  })
