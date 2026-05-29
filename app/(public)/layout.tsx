import { Header, Footer, ScrollProgress, WhatsAppButton, PageTransition } from '@/components/layout'

// Layout-level metadata dla `alternates` była ustawiana z `x-wc-pathname` w
// nagłówku middleware. Po przejściu na static export każda strona w drzewie
// dostarcza własne `alternates` przez `localizedAlternates(...)` (patrz
// `lib/i18n.ts`), więc layout-level fallback jest zbędny.

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
