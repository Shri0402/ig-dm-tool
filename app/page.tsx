'use client'

import { useEffect, useState } from 'react'

type Step = 1 | 2 | 3
type AutomationType = 'comment_keyword' | 'story_reply' | 'welcome_dm'

export default function Home() {
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [step, setStep] = useState<Step>(1)
  const [automationType, setAutomationType] = useState<AutomationType | null>(null)
  const [keyword, setKeyword] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (url.searchParams.get('connected') === 'true') {
        setStatus('Instagram connected ✅')
        url.searchParams.delete('connected')
        window.history.replaceState({}, '', url.toString())
      }
    }
  }, [])

  const checkSupabase = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const res = await fetch('/api/ping')
      const data = await res.json()
      if (data.ok) {
        setStatus(`Supabase is working (rows: ${data.rows})`)
      } else {
        setStatus(`Supabase error: ${data.error ?? 'unknown'}`)
      }
    } catch (err) {
      setStatus('network error talking to /api/ping')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (step === 1 && !automationType) return
    if (step === 2 && automationType === 'comment_keyword' && !keyword.trim()) return
    if (step === 2 && !message.trim()) return
    setStep((prev) => (prev === 3 ? prev : ((prev + 1) as Step)))
  }

  const handleBack = () => {
    setStep((prev) => (prev === 1 ? prev : ((prev - 1) as Step)))
  }

  const handleSave = async () => {
  if (!automationType || !message.trim()) {
    return
  }
  try {
    const res = await fetch('/api/automations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: automationType,
        keyword: automationType === 'comment_keyword' ? keyword || null : null,
        message,
      }),
    })
    const data = await res.json()
    if (data.ok) {
      setStatus(
        `Automation saved to Supabase ✅ type=${automationType}, keyword=${
          keyword || 'n/a'
        }`
      )
    } else {
      setStatus(`Failed to save automation: ${data.error ?? 'unknown'}`)
    }
  } catch (err) {
    setStatus('Network error while saving automation')
  }
}


  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-8 px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">IG DM Tool – Dev Mode</h1>
        <p className="text-sm text-gray-400">
          Week 1: Database & Instagram connect wiring + Wizard skeleton
        </p>
      </div>

      {/* Top utility buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg justify-center">
        <button
          onClick={checkSupabase}
          className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-sm font-medium"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Supabase connection'}
        </button>

        <a
          href="/api/auth/instagram"
          className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-sm font-medium text-center"
        >
          Connect Instagram (dev)
        </a>
      </div>

      {/* 3-step wizard */}
      <div className="w-full max-w-lg border border-gray-800 rounded-xl p-4 bg-zinc-900/60">
        <div className="flex justify-between mb-4 text-xs text-gray-400">
          <span className={step === 1 ? 'text-white font-semibold' : ''}>1. Choose trigger</span>
          <span className={step === 2 ? 'text-white font-semibold' : ''}>2. Configure</span>
          <span className={step === 3 ? 'text-white font-semibold' : ''}>3. Review</span>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-300">What should start the automation?</p>
            <button
              onClick={() => setAutomationType('comment_keyword')}
              className={`px-3 py-2 rounded border text-left text-sm ${
                automationType === 'comment_keyword'
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              Comment keyword → send DM
            </button>
            <button
              onClick={() => setAutomationType('story_reply')}
              className={`px-3 py-2 rounded border text-left text-sm ${
                automationType === 'story_reply'
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              Story reply → send DM
            </button>
            <button
              onClick={() => setAutomationType('welcome_dm')}
              className={`px-3 py-2 rounded border text-left text-sm ${
                automationType === 'welcome_dm'
                  ? 'border-pink-500 bg-pink-500/10'
                  : 'border-gray-700 hover:border-gray-500'
              }`}
            >
              First DM → welcome message
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            {automationType === 'comment_keyword' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">Keyword to watch in comments</label>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. 'guide'"
                  className="px-3 py-2 rounded bg-black border border-gray-700 text-sm focus:outline-none focus:border-pink-500"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400">DM message to send</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hey {name}, here's your link..."
                rows={3}
                className="px-3 py-2 rounded bg-black border border-gray-700 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-sm text-gray-300 space-y-2">
            <p className="font-semibold text-white">Review automation</p>
            <p>Type: {automationType ?? 'not selected'}</p>
            {automationType === 'comment_keyword' && <p>Keyword: {keyword || 'none'}</p>}
            <p>Message:</p>
            <pre className="whitespace-pre-wrap text-xs bg-black/60 border border-gray-800 rounded p-2">
              {message || 'No message set'}
            </pre>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-3 py-2 rounded border border-gray-700 text-xs text-gray-300 disabled:opacity-40"
          >
            Back
          </button>
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 rounded bg-pink-500 hover:bg-pink-600 text-xs font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-xs font-medium"
            >
              Save automation (fake for now)
            </button>
          )}
        </div>
      </div>

      {status && (
        <p className="mt-2 text-sm text-gray-300">
          {status}
        </p>
      )}
    </main>
  )
}
