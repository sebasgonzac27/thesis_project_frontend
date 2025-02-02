import { UserWithProfile } from '@/models'
import { initializeUser } from '@/utils'
import { create } from 'zustand'

interface UserStore {
  user: UserWithProfile | null
  setUser: (user: UserWithProfile) => void
  updateUser: (user: UserWithProfile) => void
  deleteUser: () => void
  isSameUser: (id: number) => boolean
}

const initialState = await initializeUser()

const useUserStore = create<UserStore>(set => ({
  user: initialState || null,
  setUser: user => set({ user }),
  updateUser: user => set(state => ({ ...state, user })),
  deleteUser: () => set({ user: null }),
  isSameUser: id => id === initialState?.id,
}))

export default useUserStore
