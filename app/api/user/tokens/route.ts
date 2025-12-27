import { createClient } from "../../../utils/supabase/server"
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data, error } = await supabase
    .from('user_tokens')
    .select('instagram_account_id, status')
    .eq('user_id', user.id)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data || null)
}
