import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Meta verification
    if (body['hub.challenge']) {
      return new Response(body['hub.challenge'])
    }
    
    const accountId = body.entry?.[0]?.id
    await supabase.from('webhook_logs').insert({
      payload: body,
      account_id: accountId
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
