import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data } = await supabase
    .from('dm_sequences')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  return NextResponse.json(data || [])
}
