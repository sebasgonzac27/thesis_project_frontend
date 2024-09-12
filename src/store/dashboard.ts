import { create } from 'zustand'

interface DashboardStore {
  isOpen: boolean
  toggleOpen: () => void
}

export const useDashboardStore = create<DashboardStore>(set => ({
  isOpen: false,
  toggleOpen: () => set(state => ({ isOpen: !state.isOpen })),
}))
