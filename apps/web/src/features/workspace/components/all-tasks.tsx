import { useState } from 'react'
import type { Task } from '@repo/api-rest'
import { Avatar, AvatarFallback, Badge, Separator, cn } from '@repo/ui'
import {
  AlertCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Minus,
} from 'lucide-react'

type Props = {
  tasks: Task[]
}

function groupByStatus(tasks: Task[]) {
  const groups = new Map<number, { status: Task['status']; tasks: Task[] }>()
  for (const task of tasks) {
    const key = task.status.id
    if (!groups.has(key)) {
      groups.set(key, { status: task.status, tasks: [] })
    }
    groups.get(key)!.tasks.push(task)
  }
  return Array.from(groups.values()).sort((a, b) => a.status.id - b.status.id)
}

function PriorityIcon({ slug }: { slug: string }) {
  const base = 'size-3.5 shrink-0'
  switch (slug) {
    case 'urgent':
      return <AlertCircle className={cn(base, 'text-red-500')} />
    case 'high':
      return <ArrowUp className={cn(base, 'text-orange-500')} />
    case 'medium':
      return <ArrowRight className={cn(base, 'text-yellow-500')} />
    case 'low':
      return <ArrowDown className={cn(base, 'text-blue-400')} />
    default:
      return <Minus className={cn(base, 'text-muted-foreground')} />
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function TaskRow({ task }: { task: Task }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 hover:bg-muted/40 transition-colors border-b border-border/50 last:border-0 group">
      <PriorityIcon slug={task.priority.slug} />
      <span className="text-xs text-muted-foreground font-mono w-18 shrink-0">
        {task.slug}
      </span>
      <span className="flex-1 text-sm truncate text-foreground">
        {task.title}
      </span>
      <Badge
        variant="outline"
        className="text-xs shrink-0 hidden md:inline-flex font-normal text-muted-foreground"
      >
        {task.project.name}
      </Badge>
      <span className="text-xs text-muted-foreground shrink-0 w-12 text-right hidden sm:block">
        {formatDate(task.createdAt)}
      </span>
      {task.assignee ? (
        <Avatar className="size-5 shrink-0 text-[10px]">
          <AvatarFallback>{getInitials(task.assignee.name)}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="size-5 shrink-0 rounded-full border border-dashed border-muted-foreground/30" />
      )}
    </div>
  )
}

function StatusGroup({
  status,
  tasks,
}: {
  status: Task['status']
  tasks: Task[]
}) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full px-4 py-2 hover:bg-muted/40 transition-colors text-sm font-medium"
      >
        {open ? (
          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
        )}
        <span
          className="size-2.5 rounded-full shrink-0"
          style={{ backgroundColor: status.color }}
        />
        <span>{status.name}</span>
        <span className="text-muted-foreground text-xs font-normal">
          {tasks.length}
        </span>
      </button>
      {open && (
        <div>
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}

export const AllTasks = ({ tasks }: Props) => {
  const groups = groupByStatus(tasks)

  if (tasks.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        No tasks found.
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden bg-card">
      {groups.map((group, i) => (
        <div key={group.status.id}>
          {i > 0 && <Separator />}
          <StatusGroup status={group.status} tasks={group.tasks} />
        </div>
      ))}
    </div>
  )
}
