// Postbuild: po udanym `next build` na Hostingerze odsyłamy do CMS-a status
// publikacji (Success). runId bierzemy z pliku-znacznika commitowanego przez CMS
// (from-cms/published-snapshot.json). Bez sekretów (lokalnie / w CI) skrypt
// po cichu się pomija i NIGDY nie wywraca builda.
import { readFile } from 'node:fs/promises'

async function main() {
  const apiUrl = process.env.CMS_API_URL
  const secret = process.env.CMS_CALLBACK_SECRET
  if (!apiUrl || !secret) {
    console.log('[publish-callback] Brak CMS_API_URL / CMS_CALLBACK_SECRET — pomijam (build nie-publikacyjny).')
    return
  }

  let marker
  try {
    const raw = await readFile(new URL('../from-cms/published-snapshot.json', import.meta.url), 'utf8')
    marker = JSON.parse(raw)
  } catch {
    console.log('[publish-callback] Brak markera published-snapshot.json — pomijam.')
    return
  }

  if (!marker || !marker.runId) {
    console.log('[publish-callback] Marker bez runId — pomijam.')
    return
  }

  try {
    const res = await fetch(`${apiUrl.replace(/\/$/, '')}/api/v1/publish/callback`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-cms-callback-secret': secret },
      body: JSON.stringify({ runId: marker.runId, status: 'success' }),
    })
    console.log(`[publish-callback] runId=${marker.runId} -> CMS odpowiedział ${res.status}`)
  } catch (error) {
    console.log('[publish-callback] Nie udało się powiadomić CMS-a:', String(error))
  }
}

// Nigdy nie failujemy builda przez callback.
main().catch((error) => {
  console.log('[publish-callback] Wyjątek (ignorowany):', String(error))
})
