import { UserRole } from '@/models'
import { create } from 'zustand'
import useUserStore from './user'

interface AppStore {
  role_selected: UserRole | null
  setRoleSelected: (role: UserRole) => void
}

export const useAppStore = create<AppStore>(set => ({
  role_selected: useUserStore.getState().user?.role_id || null,
  setRoleSelected: (role: UserRole) => {
    set({ role_selected: role })
  },
}))
