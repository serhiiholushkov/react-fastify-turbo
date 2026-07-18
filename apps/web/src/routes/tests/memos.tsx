import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tests/memos')({ component: Memos })

function Memos() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Memos</h1>
      <p>
        Just a playground for experimentation with TanStack, Fastify, and Turbo
      </p>
    </div>
  )
}
