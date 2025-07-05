import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../hooks/api';
export interface Profile {
  bio: string;
  following: boolean;
  id: number;
  image: string;
  username: string;
}

interface ApiState {
  profileData: {
    profile: Profile | null;
    isLoading: boolean;
    error: string | null;
  };
}

const initialState: ApiState = {
  profileData: {
    profile: null,
    isLoading: false,
    error: null,
  },
};

// get user profile data
export const getProfile = createAsyncThunk(
  'profile/get-profile',
  async (payload: any) => {
    const { username } = payload;
    const response = await api.get(`/profile/${username}`);
    return response.data;
  },
);

// Follow profile
export const folloProfile = createAsyncThunk(
  'profile/follow-profile',
  async (payload: any) => {
    const { username } = payload;
    const response = await api.post(`/profile/${username}/follow`);
    return response.data;
  },
);

// Unfollow profile
export const unfolloProfile = createAsyncThunk(
  'profile/unfollow-profile',
  async (payload: any) => {
    const { username } = payload;
    const response = await api.delete(`/profile/${username}/unfollow`);
    return response.data;
  },
);
const profileSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get profile
      .addCase(getProfile.pending, (state) => {
        state.profileData.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.profileData.isLoading = false;
        state.profileData.profile = action.payload.profile;
      })

      // Follow
      .addCase(folloProfile.pending, (state) => {
        state.profileData.isLoading = true;
      })
      .addCase(folloProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.profileData.isLoading = false;
        state.profileData.profile = action.payload.profile;
      })

      // Unfollow
      .addCase(unfolloProfile.pending, (state) => {
        state.profileData.isLoading = true;
      })
      .addCase(
        unfolloProfile.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.profileData.isLoading = false;
          state.profileData.profile = action.payload.profile;
        },
      );
  },
});

const profileReducer = profileSlice.reducer;
export default profileReducer;
