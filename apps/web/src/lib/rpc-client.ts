import { createClient } from '@connectrpc/connect'
import { createConnectTransport } from '@connectrpc/connect-web'
import { TaskService } from '@repo/api-rpc'

const transport = createConnectTransport({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
})

export const tasksRpcClient = createClient(TaskService, transport)
