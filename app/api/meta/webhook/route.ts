// app/api/meta/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'your_verify_token_here'

async function sendInstagramReply(recipientId: string, senderId: string, message: string) {
  console.log('🔍 TESTING ENDPOINT STRUCTURE...')
  
  // PASTE YOUR REAL TOKEN HERE (from "Generate token" button)
  const TEST_TOKEN = 'IGAAiXG7VZCa1xBZAGJwRjd4NWowajZAIOVNQVzdNWWNWR2xPeWNmTGxkeVNNUUE1dWthTng5TTllMVVtSGllbEN5TV9qMXpERVZAmQS1PRWF3M1B1U1ctVnNicHdicGcwY0FITUxZAQU02TGhlTnYxdzdlQldHRUF4SzZAXSlZAPRXBrWQZDZD' 
  
  try {
    // Test 1: Does /me work with your token?
    const meUrl = `https://graph.facebook.com/v21.0/me?access_token=${TEST_TOKEN}`
    console.log('📡 Testing /me endpoint:', meUrl)
    
    const meResponse = await fetch(meUrl)
    const meData = await meResponse.json()
    console.log('✅ /me RESULT:', JSON.stringify(meData, null, 2))
    
    // Test 2: Show what messages endpoint would be
    const messagesUrl = `https://graph.facebook.com/v21.0/${recipientId}/messages?access_token=${TEST_TOKEN}`
    console.log('📡 Messages endpoint would be:', messagesUrl)
    console.log('recipientId format:', recipientId)
    
    return { test: 'done', meData }
  } catch (e: any) {
    console.log('❌ /me FAILED:', e.message)
    return { test: 'error', error: e.message }
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified!')
    return new Response(challenge || '', { status: 200 })
  }
  
  return new Response('Forbidden', { status: 403 })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('📨 POST WEBHOOK HIT!')
    console.log('=== RAW WEBHOOK ===', JSON.stringify(body, null, 2))
    
    // Verify it's an Instagram webhook
    if (body.object !== 'instagram') {
      console.log('ℹ️ Not an Instagram webhook, ignoring')
      return NextResponse.json({ status: 'OK' }, { status: 200 })
    }
    
    // Parse the nested Instagram webhook structure
    const entry = body.entry?.[0]
    if (!entry) {
      console.log('⚠️ No entry in webhook payload')
      return NextResponse.json({ status: 'OK' }, { status: 200 })
    }
    
    // NEW PARSING - handles BOTH test AND real payloads
    let senderId: string | undefined
    let recipientId: string | undefined
    let messageText: string | undefined

    // Try REAL payload structure first (messaging)
    if (entry.messaging?.[0]) {
      senderId = entry.messaging[0].sender?.id
      recipientId = entry.messaging[0].recipient?.id
      messageText = entry.messaging[0].message?.text
      console.log('✅ Using REAL messaging structure')
    } 
    // Fallback to TEST payload structure (changes)
    else if (entry.changes?.[0]?.value) {
      senderId = entry.changes[0].value.sender?.id
      recipientId = entry.changes[0].value.recipient?.id
      messageText = entry.changes[0].value.message?.text
      console.log('✅ Using TEST changes structure')
    }

    console.log('senderId:', senderId)
    console.log('recipientId:', recipientId)
    console.log('messageText:', messageText)
    
    // Send auto-reply if we have all required fields
    if (senderId && recipientId && messageText) {
      console.log('🚀 Sending auto-reply...')
      const replyResult = await sendInstagramReply(recipientId, senderId, `Echo: ${messageText.slice(0, 50)}...`)
      console.log('📤 Reply result:', replyResult)
    } else {
      console.log('⚠️ Missing senderId, recipientId, or messageText, skipping auto-reply')
    }
    
    // ALWAYS RETURN RESPONSE
    return NextResponse.json({ status: 'OK' }, { status: 200 })
    
  } catch (error: any) {
    console.error('💥 Webhook error:', error)
    return NextResponse.json({ 
      status: 'ERROR', 
      error: error.message || String(error) 
    }, { status: 200 })
  }
}
