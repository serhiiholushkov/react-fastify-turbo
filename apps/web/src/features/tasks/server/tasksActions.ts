import { createServerFn } from '@tanstack/react-start'
import * as fs from 'node:fs'
import type { TasksData } from '../types'
const TASKS_FILE_PATH = 'src/data/tasks.json'

export const getTasks = createServerFn({
  method: 'GET',
}).handler(async () => {
  const tasksData = await fs.promises.readFile(TASKS_FILE_PATH, 'utf-8')
  return JSON.parse(tasksData) as TasksData
})
