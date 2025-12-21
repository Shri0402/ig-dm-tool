// src/app/api/ping/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { error } from "console";

export async function GET() {
    // 1 insert one new row
    const { error: insertError } = await supabase
     .from('test_ping')
     .insert({}) //empty object is fine since only id column auto increments

     if (insertError) {
        return NextResponse.json(
            { ok:false, error: insertError.message },
            {status: 500}
           )
     }
     const {data, error: selectError} = await supabase
     .from('test_ping')
    .select('*', { count: 'exact', head: true })

  if (selectError) {
    return NextResponse.json(
      { ok: false, error: selectError.message },
      { status: 500 }
    )
  }

  // Supabase puts the count on the `count` property, not in `data` when head: true
  const { count } = await supabase
    .from('test_ping')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({ ok: true, rows: count ?? 0 })
}