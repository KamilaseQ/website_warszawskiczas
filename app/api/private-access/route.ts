import { NextResponse } from 'next/server'

const FALLBACK_CODE = 'mokotowska2026'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Nieprawidłowe żądanie.' }, { status: 400 })
  }

  const code = typeof (body as { code?: unknown })?.code === 'string'
    ? (body as { code: string }).code
    : ''

  const expected = (process.env.PRIVATE_COLLECTION_CODE ?? FALLBACK_CODE).trim()
  const provided = code.trim()

  if (!provided) {
    return NextResponse.json({ ok: false, error: 'Wpisz kod dostępu.' }, { status: 400 })
  }

  if (provided.toLowerCase() !== expected.toLowerCase()) {
    return NextResponse.json({ ok: false, error: 'Nieprawidłowy kod.' }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
