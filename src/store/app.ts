import { UserRole } from '@/models'
import { create } from 'zustand'

interface AppStore {
  role_selected: UserRole | null
}

export const useAppStore = create<AppStore>(set => ({
  role_selected: null,
  setRoleSelected: (role: UserRole) => set({ role_selected: role }),
}))
