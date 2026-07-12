import type {
  CreateTaskRequest,
  GetFormOptionsResponse,
  GetTasksResponse,
  Task,
} from '@repo/api-rest'

const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

export const taskRestClient = {
  getTasks: (): Promise<GetTasksResponse> => fetchJson('/v1/tasks'),

  getFormOptions: (): Promise<GetFormOptionsResponse> =>
    fetchJson('/v1/tasks/form-options'),

  createTask: (req: CreateTaskRequest): Promise<{ task: Task }> =>
    fetchJson('/v1/tasks', {
      method: 'POST',
      body: JSON.stringify(req),
    }),
}
