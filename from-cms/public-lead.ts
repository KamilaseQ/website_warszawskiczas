/**
 * Konfiguracja bezpieczna dla bundla przeglądarki. Ten moduł celowo nie importuje
 * serwerowego `mode.ts`, który waliduje CMS_MODE i zawiera sekretną konfigurację.
 */
const DEFAULT_PUBLIC_LEAD_URL = 'https://api.camalio.pl/api/v1/leads'

export const PUBLIC_LEAD_URL: string | undefined = readPublicLeadUrl()

function readPublicLeadUrl(): string | undefined {
  const configured = process.env.NEXT_PUBLIC_CMS_LEAD_URL?.trim()
  if (configured) return normalizePublicLeadUrl(configured)

  return process.env.NODE_ENV === 'production' ? DEFAULT_PUBLIC_LEAD_URL : undefined
}

function normalizePublicLeadUrl(value: string): string {
  try {
    const url = new URL(value)
    if (
      url.hostname.toLowerCase() === 'api.camalio.pl' &&
      url.pathname.toLowerCase() === '/api/v1/leads'
    ) {
      url.protocol = 'https:'
      url.hostname = 'api.camalio.pl'
      url.pathname = '/api/v1/leads'
      return url.toString()
    }
  } catch {
    // Niestandardowy URL zweryfikuje fetch i istniejąca obsługa błędu formularza.
  }

  return value
}
