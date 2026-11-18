import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4 text-center">
      <p className="text-6xl font-extrabold text-accent">404</p>
      <p className="text-text-secondary">This page doesn't exist.</p>
      <Link to="/">
        <Button variant="secondary">Back to home</Button>
      </Link>
    </div>
  )
}