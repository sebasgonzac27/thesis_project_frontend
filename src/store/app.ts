import { UserRole } from '@/models'
import { create } from 'zustand'

interface AppStore {
  role_selected: UserRole | null
  setRoleSelected: (role: UserRole) => void
}

export const useAppStore = create<AppStore>(set => ({
  role_selected: null,
  setRoleSelected: (role: UserRole) => {
    console.log('role_selected', role)
    console.log(typeof role)
    set({ role_selected: role })
    localStorage.setItem('role_selected', role.toString())
  },
}))
