import { NextResponse, type NextRequest } from 'next/server'
import { absoluteUrl, canonicalPath, isLocale, localeFromPathname } from '@/lib/i18n'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  const pathname = request.nextUrl.pathname
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  requestHeaders.set('x-wc-locale', isLocale(firstSegment) ? firstSegment : 'pl')
  requestHeaders.set('x-wc-pathname', pathname)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const currentLocale = localeFromPathname(pathname)
  const canonical = canonicalPath(pathname, currentLocale)
  response.headers.set(
    'Link',
    [
      `<${absoluteUrl(canonical, 'pl')}>; rel="alternate"; hreflang="pl"`,
      `<${absoluteUrl(canonical, 'en')}>; rel="alternate"; hreflang="en"`,
      `<${absoluteUrl(canonical, 'ua')}>; rel="alternate"; hreflang="uk-UA"`,
      `<${absoluteUrl(canonical, 'pl')}>; rel="alternate"; hreflang="x-default"`,
    ].join(', '),
  )

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|opengraph-image.jpg|twitter-image.jpg|sw.js).*)'],
}
