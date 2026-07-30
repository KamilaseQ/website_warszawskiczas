'use client'

import { useEffect, useRef } from 'react'

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame: number | null = null
    const update = () => {
      if (frame !== null) return
      frame = window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0
        if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
        frame = null
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px]"
    >
      <div
        ref={barRef}
        className="h-full origin-left scale-x-0 bg-accent-gold shadow-[0_0_8px_rgba(201,169,98,0.6)] will-change-transform"
      />
    </div>
  )
}
