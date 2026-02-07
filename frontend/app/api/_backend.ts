import { NextResponse } from 'next/server'

type ProxyOptions = {
  errorMessage: string
  includeCount?: boolean
}

const BACKEND_URL = (
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'http://127.0.0.1:8000'
).replace(/\/$/, '')

export async function proxyToBackend(
  request: Request,
  path: string,
  options: ProxyOptions,
) {
  try {
    const body = await request.json().catch(() => null)
    const rawUrl = typeof body?.url === 'string' ? body.url.trim() : ''
    const url = rawUrl ? rawUrl : undefined
    const transcript = typeof body?.transcript === 'string' ? body.transcript : body?.transcript
    const count = Number(body?.count)

    if (!url && !transcript) {
      return NextResponse.json({ detail: 'URL or transcript is required' }, { status: 400 })
    }

    const query = options.includeCount && Number.isFinite(count) ? `?count=${count}` : ''
    const res = await fetch(`${BACKEND_URL}${path}${query}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, transcript }),
      cache: 'no-store',
    })

    const data = await res.json().catch(() => null)
    if (!res.ok) {
      return NextResponse.json(data ?? { detail: options.errorMessage }, { status: res.status })
    }

    return NextResponse.json(data)
  } catch (err) {
    const detail = err instanceof Error ? err.message : `${options.errorMessage}. Please try again.`
    return NextResponse.json({ detail }, { status: 500 })
  }
}
