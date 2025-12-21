import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.json(
      { ok: false, error: error ?? 'Missing code' },
      { status: 400 }
    )
  }

  const clientId = process.env.META_APP_ID!
  const clientSecret = process.env.META_APP_SECRET!
  const redirectUri = process.env.META_REDIRECT_URI!

  // 1) Exchange code -> short-lived access token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?` +
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code,
      }),
    { method: 'GET' }
  )

  const tokenJson = await tokenRes.json()

  if (!tokenRes.ok || !tokenJson.access_token) {
    return NextResponse.json(
      { ok: false, error: tokenJson.error?.message ?? 'Token exchange failed' },
      { status: 400 }
    )
  }

  const accessToken = tokenJson.access_token as string

  // 2) (Optional) get basic user info from Graph API
  const meRes = await fetch(
    `https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${encodeURIComponent(
      accessToken
    )}`
  )
  const meJson = await meRes.json()
  const fbUserId = meJson.id as string | undefined

  // 3) Store in instagram_accounts (single-user mode)
  const { error: insertError } = await supabase
    .from('instagram_accounts')
    .insert({
      fb_user_id: fbUserId ?? null,
      access_token: accessToken,
      label: 'Main account',
    })

  if (insertError) {
    return NextResponse.json(
      { ok: false, error: insertError.message },
      { status: 500 }
    )
  }

  // 4) Redirect back to home with success flag
  const redirectBack = new URL('http://localhost:3000')
  redirectBack.searchParams.set('connected', 'true')

  return NextResponse.redirect(redirectBack.toString())
}
