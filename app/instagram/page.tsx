'use client'
import { useEffect, useState } from 'react'

export default function InstagramConnect() {
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const connectInstagram = () => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID!,
      redirect_uri: `${origin}/api/auth/callback`,  // ✅ Use state, not window
      scope: 'pages_messaging,pages_show_list',
      response_type: 'code'
    })
    window.location.href = `https://www.facebook.com/v20.0/dialog/oauth?${params}`
  }
  
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Connect Instagram Account</h1>
      <p className="mb-4">
        Webhook ready: <code className="bg-gray-100 p-1 rounded">{origin || 'localhost:3000'}/api/webhook</code>
      </p>
      <button 
        onClick={connectInstagram}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Connect Instagram
      </button>
    </div>
  )
}
