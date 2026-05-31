import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">
        Just a playground for experimentation with TanStack, Fastify, and Turbo
      </h1>
    </div>
  )
}
