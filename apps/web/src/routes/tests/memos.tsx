import { Parent } from '#/features/tests/memos/parent'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tests/memos')({ component: Memos })

function Memos() {
  return (
    <div className="p-6 space-y-4">
      <Parent />
    </div>
  )
}
