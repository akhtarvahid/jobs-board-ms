import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../hooks/api';

export interface UserState {
  username: string;
  image: string;
  bio: string;
  email: string;
}

interface UserAuthState {
  user: UserState;
  token: string | null;
  currentUser: {
    user: null | UserState;
    isLoading: boolean;
    error: string | null;
  };
}

const initialState: UserAuthState = {
  user: {
    username: '',
    image: '',
    bio: '',
    email: '',
  },
  token: null,
  currentUser: {
    user: null,
    isLoading: false,
    error: null,
  },
};
// get user data
export const getUser = createAsyncThunk('user/get-user', async () => {
  const response = await api.get(`user/current-user`);
  return response.data;
});
export const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = {
        username: '',
        image: '',
        bio: '',
        email: '',
      };
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get profile
      .addCase(getUser.pending, (state) => {
        state.currentUser.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.currentUser.isLoading = false;
        state.currentUser.user = action.payload.user;
      });
  },
});

export const { setToken, setUser, logout } = userAuthSlice.actions;

const userAuthReducer = userAuthSlice.reducer;
export default userAuthReducer;
