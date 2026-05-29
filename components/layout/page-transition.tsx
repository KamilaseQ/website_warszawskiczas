'use client'

interface PageTransitionProps {
  children: React.ReactNode
}

// First-load performance is more important than animated route curtains here.
// Keep this boundary so callers do not need to know that transitions are disabled.
export function PageTransition({ children }: PageTransitionProps) {
  return <>{children}</>
}
