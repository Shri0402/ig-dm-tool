import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";

export async function GET() {
    // Insert test row
    const { error: insertError } = await supabase
     .from('test_ping')
     .insert({})

     if (insertError) {
        return NextResponse.json(
            { ok:false, error: insertError.message },
            {status: 500}
        )
     }

    // Count rows
    const { count: rowCount, error: countError } = await supabase
      .from('test_ping')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      return NextResponse.json(
        { ok: false, error: countError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true, rows: rowCount ?? 0 })
}
