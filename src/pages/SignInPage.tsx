import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { useAuth } from '../hooks/useAuth'
import { isDemoMode } from '../lib/demoMode'
import { useDemoStore } from '../store/demoStore'

const provider = new GoogleAuthProvider()

export function SignInPage() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const activateDemoSession = useDemoStore((s) => s.activateDemoSession)
  const [error, setError] = useState<string | null>(null)
  const [signing, setSigning] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate('/log', { replace: true })
  }, [user, loading, navigate])

  async function handleSignIn() {
    setSigning(true)
    setError(null)
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
      setSigning(false)
    }
  }

  function handleDemoSignIn() {
    activateDemoSession()
    navigate('/log', { replace: true })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-[430px] w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">🧠</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">MoodMap</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Track your mood, energy, and patterns. Understand what drives your best days.
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 rounded-lg px-4 py-2">{error}</p>
        )}

        {!isDemoMode && (
          <button
            onClick={handleSignIn}
            disabled={signing}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {signing ? 'Signing in…' : 'Continue with Google'}
          </button>
        )}

        {isDemoMode && (
          <div className="space-y-3">
            <button
              onClick={handleDemoSignIn}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-6 py-3 font-medium transition-colors"
            >
              Continue as Demo User
            </button>
            <p className="text-xs text-gray-400">Demo mode — data is not saved</p>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-6">
          Your data is private and only accessible to you.
        </p>
      </div>
    </div>
  )
}
