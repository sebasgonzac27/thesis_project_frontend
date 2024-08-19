import { createSlice } from '@reduxjs/toolkit'
import { initializeUser } from '@/utils'

export const userSlice = createSlice({
  name: 'user',
  initialState: (await initializeUser()) || null,
  reducers: {
    createUser: (_state, action) => {
      return action.payload
    },
    updateUser: (state, action) => {
      return { ...state, ...action.payload }
    },
    resetUser: () => {
      return null
    },
  },
})

export const { createUser, updateUser, resetUser } = userSlice.actions

export default userSlice.reducer
