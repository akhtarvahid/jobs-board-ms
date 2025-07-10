import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../hooks/api';

export interface UserState {
  username: string;
  image: string;
  bio: string;
  email: string;
  status: boolean;
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
    status: false,
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

// login user
export const handleLoginUser = createAsyncThunk(
  'user/login',
  async (payload: any) => {
    const { data } = payload;
    const response = await api.post(`/user/login`, data);
    return response.data;
  },
);

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
        status: false,
      };
      state.token = null;
      localStorage.removeItem('token');
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
      })

      // login user
      .addCase(handleLoginUser.pending, (state) => {
        state.user.status = true;
      })
      .addCase(
        handleLoginUser.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.user.status = false;
          state.user = action.payload.user;
          state.token = action.payload.user?.token?.access_token?.toString();
          localStorage.setItem(
            'token',
            action.payload.user?.token?.access_token,
          );
        },
      );
  },
});

export const { setToken, setUser, logout } = userAuthSlice.actions;

const userAuthReducer = userAuthSlice.reducer;
export default userAuthReducer;
