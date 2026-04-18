import { create } from 'zustand'
import { isDemoMode } from '../lib/demoMode'

interface DemoState {
  isDemoSession: boolean
  activateDemoSession: () => void
}

export const useDemoStore = create<DemoState>((set) => ({
  isDemoSession: isDemoMode,
  activateDemoSession: () => set({ isDemoSession: true }),
}))
