import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  username: string
  image: string
  bio: string
  email: string
}

interface UserAuthState {
  user: UserState
  token: string | null
}

const initialState: UserAuthState = {
  user: {
    username: '',
    image: '',
    bio: '',
    email: ''
  },
  token: null
}

export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
    },
    logout: (state) => {
      state.user = {
        username: '',
        image: '',
        bio: '',
        email: ''
      }
      state.token = null
    }
  }
})

export const { setToken, setUser, logout } = userAuthSlice.actions

const userAuthReducer = userAuthSlice.reducer
export default userAuthReducer
