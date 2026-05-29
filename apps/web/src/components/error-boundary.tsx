import { useState } from 'react'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '@repo/ui/components/button'

export function ErrorBoundary({ error, reset }: ErrorComponentProps) {
  const [showDetails, setShowDetails] = useState(import.meta.env.DEV)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-bold text-destructive">
          Something went wrong
        </h1>
        <p className="max-w-md text-muted-foreground">
          {error.message || 'An unexpected error occurred.'}
        </p>
      </div>

      {(error.stack || error.message) && (
        <div className="w-full max-w-xl text-left">
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="mb-2 text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            {showDetails ? 'Hide' : 'Show'} details
          </button>
          {showDetails && (
            <pre className="overflow-auto rounded-md border border-destructive/40 bg-destructive/5 p-4 text-left text-xs text-destructive">
              <code>{error.stack ?? error.message}</code>
            </pre>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload page
        </Button>
      </div>
    </div>
  )
}
