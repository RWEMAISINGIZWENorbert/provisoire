import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { Button } from '@/components/ui/Button'

export default function ErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} — ${error.statusText || error.data}`
    : 'Something went wrong.'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4 text-center">
      <p className="text-5xl">⚠️</p>
      <h1 className="text-xl font-bold text-text-primary">Something went wrong</h1>
      <p className="max-w-md text-sm text-text-secondary">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl border border-border bg-surface-raised px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-sunken"
        >
          Reload
        </button>
        <Link to="/">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </div>
    </div>
  )
}