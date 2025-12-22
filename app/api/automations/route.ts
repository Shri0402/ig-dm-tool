import { NextResponse } from 'next/server'
import { supabase } from '../../lib/supabaseClient'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body || !body.type || !body.message) {
    return NextResponse.json(
      { ok: false, error: 'Missing type or message' },
      { status: 400 }
    )
  }

  const { type, keyword = null, message } = body as {
    type: string
    keyword?: string | null
    message: string
  }

  const { error } = await supabase.from('automations').insert({
    type,
    keyword,
    message,
  })

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
