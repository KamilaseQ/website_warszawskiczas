const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 3
const MAX_KEYS = 5000

const hits = new Map<string, number[]>()

export function checkRateLimit(ip: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now()
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)

  if (arr.length >= MAX_HITS) {
    const oldest = arr[0]
    const retryAfterSec = Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000))
    hits.set(ip, arr)
    return { ok: false, retryAfterSec }
  }

  arr.push(now)
  hits.set(ip, arr)

  if (hits.size > MAX_KEYS) {
    const firstKey = hits.keys().next().value
    if (firstKey) hits.delete(firstKey)
  }

  return { ok: true, retryAfterSec: 0 }
}
