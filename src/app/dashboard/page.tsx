"use client"
import { useEffect, useState } from 'react'

interface Token {
  instagram_account_id: string
  status: string
}

export default function Dashboard() {
  const [token, setToken] = useState<Token | null>(null)
  const [sequences, setSequences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tokensRes, sequencesRes] = await Promise.all([
        fetch('/api/user/tokens'),
        fetch('/api/user/sequences')
      ])
      
      if (tokensRes.ok) {
        const tokenData = await tokensRes.json()
        setToken(tokenData)
      }
      if (sequencesRes.ok) {
        setSequences(await sequencesRes.json())
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center">
        <div className="text-xl animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
            DM Automation
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Auto-reply to Instagram DMs. Capture leads. Scale conversations.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connected Accounts */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold text-gray-900">Connected Accounts</h2>
            </div>
            
            {token ? (
              <div className="space-y-4">
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="font-semibold text-emerald-800">Active</span>
                  </div>
                  <p className="text-sm text-gray-700 break-all">
                    {token.instagram_account_id}
                  </p>
                </div>
                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
                  Refresh Token
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl mx-auto mb-8 flex items-center justify-center">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect Instagram</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Link your Instagram Business account to start auto-replies
                </p>
                <button className="w-full max-w-md bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl">
                  Connect Instagram →
                </button>
              </div>
            )}
          </div>

          {/* Smart Sequences */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/30">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Smart Sequences</h2>
              </div>
              <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                + New Sequence
              </button>
            </div>
            
            {sequences.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your first sequence</h3>
                <p className="text-gray-600 mb-12 max-w-sm mx-auto">
                  Pick a template or create your own. Auto-replies start immediately.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <button className="group p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:shadow-xl transition-all">
                    <div className="font-semibold mb-1">👋 "Hey!"</div>
                    <div className="text-sm opacity-90">Basic greeting</div>
                  </button>
                  <button className="group p-6 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:shadow-xl transition-all">
                    <div className="font-semibold mb-1">💰 "Price?"</div>
                    <div className="text-sm opacity-90">Sales replies</div>
                  </button>
                  <button className="group p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl hover:from-orange-600 hover:shadow-xl transition-all">
                    <div className="font-semibold mb-1">📈 "Leads"</div>
                    <div className="text-sm opacity-90">Lead capture</div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {sequences.map((seq: any) => (
                  <div key={seq.id} className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{seq.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {seq.triggers?.length || 0} triggers, {seq.replies?.length || 0} replies
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        seq.ab_test 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {seq.ab_test ? 'A/B Testing' : 'Live'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}