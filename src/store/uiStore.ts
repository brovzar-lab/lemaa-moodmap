import { create } from 'zustand'

interface UIState {
  isSaving: boolean
  setSaving: (v: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSaving: false,
  setSaving: (v) => set({ isSaving: v }),
}))
