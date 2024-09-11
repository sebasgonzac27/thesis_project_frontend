import { User } from '@/models'
import { initializeUser } from '@/utils'
import { create } from 'zustand'

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  updateUser: (user: User) => void
  deleteUser: () => void
}

const initialState = await initializeUser()

const useUserStore = create<UserStore>(set => ({
  user: initialState || null,
  setUser: user => set({ user }),
  updateUser: user => set(state => ({ ...state, user })),
  deleteUser: () => set({ user: null }),
}))

export default useUserStore
