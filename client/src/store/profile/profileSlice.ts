import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../hooks/api';
interface Story {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: Date;
  modifiedAt: Date;
  tagList: string[];
  favoritesCount: number;
  owner: Profile;
  favorited: boolean;
}

interface Profile {
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
  favoritedData: {
    stories: Story[];
    storiesCount: number;
    isLoading: boolean;
    error: string | null;
  };
  UserData: {
    stories: Story[];
    storiesCount: number;
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
  favoritedData: {
    stories: [],
    storiesCount: 0,
    isLoading: false,
    error: null,
  },
  UserData: {
    stories: [],
    storiesCount: 0,
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

// user favorited stories
export const userFavoritedStories = createAsyncThunk(
  'story/favorited',
  async (payload: any) => {
    const { username } = payload;
    const response = await api.get(`story/all?favorited=${username}`);
    return response.data;
  },
);

// current user created stories
export const userCreatedStories = createAsyncThunk(
  'story/created',
  async (payload: any) => {
    const { username } = payload;
    const response = await api.get(`story/all?owner=${username}`);
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

      // Get favorited stories
      .addCase(userFavoritedStories.pending, (state) => {
        state.favoritedData.isLoading = true;
      })
      .addCase(
        userFavoritedStories.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.favoritedData.isLoading = false;
          state.favoritedData.stories = action.payload.stories;
          state.favoritedData.storiesCount = action.payload.storiesCount;
        },
      )

      // Get all user created stories
      .addCase(userCreatedStories.pending, (state) => {
        state.UserData.isLoading = true;
      })
      .addCase(
        userCreatedStories.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.UserData.isLoading = false;
          state.UserData.stories = action.payload.stories;
          state.UserData.storiesCount = action.payload.storiesCount;
        },
      );
  },
});

const profileReducer = profileSlice.reducer;
export default profileReducer;
