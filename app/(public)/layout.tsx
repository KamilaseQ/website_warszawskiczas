import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Header, Footer, ScrollProgress, LoadingScreen, WhatsAppButton, PageTransition } from '@/components/layout'
import { alternateLanguages, canonicalPath, localeFromPathname } from '@/lib/i18n'

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers()
  const pathname = requestHeaders.get('x-wc-pathname') ?? '/'
  const locale = localeFromPathname(pathname)
  const canonical = canonicalPath(pathname, locale)

  return {
    alternates: {
      languages: alternateLanguages(canonical, 'pl'),
    },
  }
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[1000] focus:bg-foreground focus:px-4 focus:py-2 focus:text-background focus:outline focus:outline-2 focus:outline-accent-gold"
      >
        Przejdź do treści
      </a>
      <LoadingScreen />
      <ScrollProgress />
      <Header />
      <main id="main" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
