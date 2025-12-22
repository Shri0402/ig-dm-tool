import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.META_APP_ID!
  const redirectUri = 'http://localhost:3000/api/auth/instagram/callback'

  const authUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')

  return NextResponse.redirect(authUrl.toString())
}
