import { configureStore } from '@reduxjs/toolkit'
import { User } from '../models'
import { userSlice } from './states/user'

export interface AppStore {
  user: User | null
}

export default configureStore<AppStore>({
  reducer: {
    user: userSlice.reducer,
  },
})
