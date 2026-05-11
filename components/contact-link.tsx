'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps, MouseEvent, ReactNode } from 'react'
import { localeFromPathname, localizePath } from '@/lib/i18n'

export const CONTACT_SOURCE_KEY = 'wc_contact_source'
const STALE_AFTER_MS = 30 * 60 * 1000

interface StoredSource {
  source: string
  product?: string
  ts: number
}

interface ContactLinkProps extends Omit<ComponentProps<typeof Link>, 'href' | 'children' | 'onClick'> {
  source: string
  product?: string
  children: ReactNode
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
}

export function ContactLink({ source, product, children, onClick, ...rest }: ContactLinkProps) {
  const pathname = usePathname()
  const locale = localeFromPathname(pathname)

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    try {
      const payload: StoredSource = { source, ts: Date.now() }
      if (product) payload.product = product
      sessionStorage.setItem(CONTACT_SOURCE_KEY, JSON.stringify(payload))
    } catch {
      // private mode etc. — ignore, formularz dalej działa, tylko bez kontekstu
    }
    onClick?.(e)
  }

  return (
    <Link href={localizePath('/kontakt', locale)} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}

export function readContactSource(): { source?: string; product?: string } {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(CONTACT_SOURCE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as StoredSource
    if (!parsed?.ts || Date.now() - parsed.ts > STALE_AFTER_MS) return {}
    return { source: parsed.source, product: parsed.product }
  } catch {
    return {}
  }
}

export function clearContactSource(): void {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.removeItem(CONTACT_SOURCE_KEY)
  } catch {
    // ignore
  }
}
