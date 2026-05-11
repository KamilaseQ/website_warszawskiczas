export async function notifyWhatsApp(text: string): Promise<void> {
  const phone = process.env.CALLMEBOT_PHONE
  const apikey = process.env.CALLMEBOT_APIKEY

  if (!phone || !apikey) {
    console.warn('[whatsapp] CALLMEBOT_PHONE/APIKEY missing — skipping notification')
    return
  }

  const url =
    `https://api.callmebot.com/whatsapp.php` +
    `?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${encodeURIComponent(apikey)}`

  try {
    const res = await fetch(url, { method: 'GET' })
    if (!res.ok) {
      console.warn('[whatsapp] callmebot returned', res.status, await res.text().catch(() => ''))
    }
  } catch (err) {
    console.warn('[whatsapp] request failed', err)
  }
}
