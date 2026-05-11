'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const STORAGE_KEY = 'wc_session_path'
const MAX_ENTRIES = 8

export function SessionTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!pathname || pathname.startsWith('/kontakt')) return

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      const arr: string[] = raw ? JSON.parse(raw) : []
      const qs = searchParams?.toString()
      const entry = qs ? `${pathname}?${qs}` : pathname
      if (arr[arr.length - 1] === entry) return
      arr.push(entry)
      while (arr.length > MAX_ENTRIES) arr.shift()
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
    } catch {
      // ignore (private mode etc.)
    }
  }, [pathname, searchParams])

  return null
}

export function readSessionPath(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}
