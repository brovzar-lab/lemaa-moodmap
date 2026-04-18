import { create } from 'zustand'

interface DemoState {
  isDemoSession: boolean
  activateDemoSession: () => void
}

export const useDemoStore = create<DemoState>((set) => ({
  isDemoSession: false,
  activateDemoSession: () => set({ isDemoSession: true }),
}))
