import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../hooks/api';
import { Profile } from '../profile/profileSlice';

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

interface Comment {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  owner: {};
  story: Story;
}

interface ApiState {
  allStories: {
    status: string;
    error: string | null;
    stories: Story[];
    storiesCount: number;
    storyComments: Comment[];
  };
  feedStories: {
    status: string;
    error: string | null;
    stories: Story[];
    storiesCount: number;
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
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
const story = {
  id: 1,
  title: 'Default story',
  slug: 'default-story-as2kfh',
  description: 'Create default story description',
  body: 'Believe it or not!',
  tagList: ['CSS', 'SASS'],
};
const initialState: ApiState = {
  allStories: {
    status: 'idle',
    error: null,
    stories: [story as unknown as Story],
    storiesCount: 0,
    storyComments: [],
  },
  feedStories: {
    status: 'idle',
    error: null,
    stories: [story as unknown as Story],
    storiesCount: 0,
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
  status: 'idle',
  error: null,
};

const API_URL = 'http://localhost:3000/story';

// Async Thunks for CRUD operations
export const handleFetchStoriesFeed = createAsyncThunk(
  'api/fetchItems/feed',
  async () => {
    const response = await api.get('/story/feed');
    return response.data;
  },
);
export const handleFetchAllStory = createAsyncThunk(
  'api/fetchItems/all',
  async () => {
    const response = await api.get('/story/all');
    return response.data;
  },
);

export const handleAddStory = createAsyncThunk(
  'story/create',
  async (newStory: any) => {
    const response = await api.post(`/story/create`, newStory);
    return response.data;
  },
);

// update story by slug
export const handleUpdateStory = createAsyncThunk(
  'story/update',
  async (payload: any) => {
    const { slug, story } = payload;
    const response = await api.put(`${API_URL}/${slug}`, { story });
    return response.data;
  },
);

// delete a story by slug
export const handleDeleteStory = createAsyncThunk(
  'api/deleteStory',
  async (slug: string) => {
    const response = await api.delete(`${API_URL}/${slug}`);
    response.data.slug = slug;
    return response.data;
  },
);

// Add comment to story
export const handleAddComment = createAsyncThunk(
  'story/add-comment',
  async (payload: any) => {
    const { slug, comment } = payload;
    const response = await api.post(`story/${slug}/comment`, comment);
    return response.data;
  },
);

// get all comments of story
export const handleGetComments = createAsyncThunk(
  'story/get-comments',
  async (payload: any) => {
    const { slug } = payload;
    const response = await api.get(`story/${slug}/comment`);
    return response.data;
  },
);

export const handleDeleteComment = createAsyncThunk(
  'story/delete-comment',
  async (payload: any) => {
    const { slug, id } = payload;
    const response = await api.delete(`/story/${slug}/comment/${id}`);
    response.data.id = id;
    return response.data;
  },
);
export const handleUpdateComment = createAsyncThunk(
  'story/update-comment',
  async (payload: any) => {
    const { slug, id, comment } = payload;
    const response = await api.put(`/story/${slug}/comment/${id}`, comment);
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

// Like story
export const handleLikeStory = createAsyncThunk(
  'story/like-story',
  async (payload: any) => {
    const { slug } = payload;
    const response = await api.post(`/story/${slug}/like`);
    return response.data;
  },
);

// Dislike story
export const handleDislikeStory = createAsyncThunk(
  'story/dislike-story',
  async (payload: any) => {
    const { slug } = payload;
    const response = await api.delete(`/story/${slug}/like`);
    return response.data;
  },
);

const storySlice = createSlice({
  name: 'api',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(handleFetchStoriesFeed.pending, (state) => {
        state.feedStories.status = 'loading';
      })
      .addCase(
        handleFetchStoriesFeed.fulfilled,
        (
          state,
          action: PayloadAction<{ stories: Story[]; storiesCount: number }>,
        ) => {
          state.feedStories.status = 'succeeded';
          state.feedStories.stories = action.payload.stories;
          state.feedStories.storiesCount = action.payload.storiesCount;
        },
      )
      .addCase(handleFetchStoriesFeed.rejected, (state, action) => {
        state.feedStories.status = 'failed';
        state.feedStories.error =
          action.error.message || 'Failed to fetch items';
      })

      .addCase(handleFetchAllStory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        handleFetchAllStory.fulfilled,
        (
          state,
          action: PayloadAction<{ stories: Story[]; storiesCount: number }>,
        ) => {
          state.allStories.status = 'succeeded';
          state.allStories.stories = action.payload.stories;
          state.allStories.storiesCount = action.payload.storiesCount;
        },
      )
      .addCase(handleFetchAllStory.rejected, (state, action) => {
        state.allStories.status = 'failed';
        state.allStories.error =
          action.error.message || 'Failed to fetch items';
      })

      // Add Item
      .addCase(handleAddStory.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(
        handleAddStory.fulfilled,
        (state, action: PayloadAction<{ type: string; story: Story }>) => {
          state.allStories.status = 'succeeded';
          state.allStories.stories.push(action.payload.story);
          state.allStories.storiesCount += 1;
        },
      )

      // Update Item
      .addCase(handleUpdateStory.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(
        handleUpdateStory.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allStories.status = 'succeeded';
          const index = state.allStories.stories.findIndex(
            (item) => item.id === action.payload.story.id,
          );
          if (index !== -1) {
            state.allStories.stories[index] = action.payload.story;
          }
        },
      )

      // Delete Item
      .addCase(handleDeleteStory.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(
        handleDeleteStory.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allStories.status = 'succeeded';
          state.allStories.stories = state.allStories.stories.filter(
            (item) => item.slug !== action.payload.slug,
          );
        },
      )

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
      )

      // Like Story
      .addCase(handleLikeStory.pending, (state) => {
        state.feedStories.status = 'loading';
      })
      .addCase(
        handleLikeStory.fulfilled,
        (state, action: PayloadAction<{ type: string; story: Story }>) => {
          state.feedStories.status = 'succeeded';

          const index = state.feedStories.stories.findIndex(
            (item) => item.id === action.payload.story.id,
          );
          if (index !== -1) {
            state.feedStories.stories[index] = action.payload.story;
          }
        },
      )

      // Dislike Story
      .addCase(handleDislikeStory.pending, (state) => {
        state.favoritedData.isLoading = true;
         state.feedStories.status = 'succeeded';
      })
      .addCase(
        handleDislikeStory.fulfilled,
        (state, action: PayloadAction<{ type: string; story: Story }>) => {
          state.favoritedData.isLoading = false;
           state.feedStories.status = 'loading';
          state.favoritedData.stories = state.favoritedData.stories.filter(
            (item) => item.id !== action.payload.story.id,
          );
          const index = state.feedStories.stories.findIndex(
            (item) => item.id === action.payload.story.id,
          );
          if (index !== -1) {
            state.feedStories.stories[index] = action.payload.story;
          }
        },
      )

      // Add comment
      .addCase(handleAddComment.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(
        handleAddComment.fulfilled,
        (state, action: PayloadAction<{ type: string; comment: Comment }>) => {
          state.allStories.status = 'succeeded';
          state.allStories.storyComments = [
            action.payload.comment,
            ...state.allStories.storyComments,
          ];
        },
      )
      // Get comments
      .addCase(handleGetComments.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(
        handleGetComments.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allStories.status = 'succeeded';
          state.allStories.storyComments = action.payload.comments;
        },
      )

      // Delete comment
      .addCase(handleDeleteComment.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(
        handleDeleteComment.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allStories.status = 'succeeded';
          state.allStories.storyComments =
            state.allStories.storyComments.filter(
              (item) => item.id !== action.payload.id,
            );
        },
      )

      // update comment
      .addCase(handleUpdateComment.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(
        handleUpdateComment.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.allStories.status = 'succeeded';
          const index = state.allStories.storyComments.findIndex(
            (item) => item.id === action.payload.comment.id,
          );
          if (index !== -1) {
            state.allStories.storyComments[index] = action.payload.comment;
          }
        },
      );
  },
});

const storyReducer = storySlice.reducer;
export default storyReducer;
