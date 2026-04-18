import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { isDemoMode } from '../lib/demoMode'
import { useDemoStore } from '../store/demoStore'

interface AuthState {
  user: User | null
  loading: boolean
}

const DEMO_USER = {
  uid: 'demo-user',
  displayName: 'Demo User',
  email: 'demo@moodmap.app',
  photoURL: null,
} as unknown as User

export function useAuth(): AuthState {
  const isDemoSession = useDemoStore((s) => s.isDemoSession)
  const [state, setState] = useState<AuthState>({ user: null, loading: !isDemoMode })

  useEffect(() => {
    if (isDemoMode) {
      setState({ user: isDemoSession ? DEMO_USER : null, loading: false })
      return
    }
    return onAuthStateChanged(auth, (user) => {
      setState({ user, loading: false })
    })
  }, [isDemoSession])

  if (isDemoMode) {
    return { user: isDemoSession ? DEMO_USER : null, loading: false }
  }
  return state
}
