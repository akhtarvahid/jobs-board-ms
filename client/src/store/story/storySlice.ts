import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from '../../hooks/api';

interface Story {
  id: any;
  title: string;
  slug: string;
  description: string;
  body: string;
  tagList: string[];
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
    stories: [story],
    storiesCount: 0,
    storyComments: [],
  },
  feedStories: {
    status: 'idle',
    error: null,
    stories: [story],
    storiesCount: 0,
  },
  status: 'idle',
  error: null,
};

const API_URL = 'http://localhost:3000/story';

// Async Thunks for CRUD operations
export const fetchStoriesFeed = createAsyncThunk(
  'api/fetchItems/feed',
  async () => {
    const response = await api.get('/story/feed');
    return response.data;
  },
);
export const fetchAllStory = createAsyncThunk(
  'api/fetchItems/all',
  async () => {
    const response = await api.get('/story/all');
    return response.data;
  },
);

export const addStory = createAsyncThunk(
  'story/create',
  async (newStory: any) => {
    const response = await api.post(`/story/create`, newStory);
    return response.data;
  },
);

// update story by slug
export const updateStory = createAsyncThunk(
  'story/update',
  async (payload: any) => {
    const { slug, story } = payload;
    const response = await api.put(`${API_URL}/${slug}`, { story });
    return response.data;
  },
);

// delete a story by slug
export const deleteStory = createAsyncThunk(
  'api/deleteStory',
  async (slug: string) => {
    const response = await api.delete(`${API_URL}/${slug}`);
    response.data.slug = slug;
    return response.data;
  },
);

// Add comment to story
export const addComment = createAsyncThunk(
  'story/add-comment',
  async (payload: any) => {
    const { slug, comment } = payload;
    const response = await api.post(`story/${slug}/comment`, comment);
    return response.data;
  },
);

// get all comments of story
export const getComments = createAsyncThunk(
  'story/get-comments',
  async (payload: any) => {
    const { slug } = payload;
    const response = await api.get(`story/${slug}/comment`);
    return response.data;
  },
);

export const deleteComment = createAsyncThunk(
  'story/delete-comment',
  async (payload: any) => {
    const { slug, id } = payload;
    const response = await api.delete(`/story/${slug}/comment/${id}`);
    response.data.id = id;
    return response.data;
  },
);
export const updateComment = createAsyncThunk(
  'story/update-comment',
  async (payload: any) => {
    const { slug, id, comment } = payload;
    const response = await api.put(`/story/${slug}/comment/${id}`, comment);
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
      .addCase(fetchStoriesFeed.pending, (state) => {
        state.feedStories.status = 'loading';
      })
      .addCase(
        fetchStoriesFeed.fulfilled,
        (
          state,
          action: PayloadAction<{ stories: Story[]; storiesCount: number }>,
        ) => {
          state.feedStories.status = 'succeeded';
          state.feedStories.stories = action.payload.stories;
          state.feedStories.storiesCount = action.payload.storiesCount;
        },
      )
      .addCase(fetchStoriesFeed.rejected, (state, action) => {
        state.feedStories.status = 'failed';
        state.feedStories.error =
          action.error.message || 'Failed to fetch items';
      })

      .addCase(fetchAllStory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchAllStory.fulfilled,
        (
          state,
          action: PayloadAction<{ stories: Story[]; storiesCount: number }>,
        ) => {
          state.allStories.status = 'succeeded';
          state.allStories.stories = action.payload.stories;
          state.allStories.storiesCount = action.payload.storiesCount;
        },
      )
      .addCase(fetchAllStory.rejected, (state, action) => {
        state.allStories.status = 'failed';
        state.allStories.error =
          action.error.message || 'Failed to fetch items';
      })

      // Add Item
      .addCase(addStory.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(
        addStory.fulfilled,
        (state, action: PayloadAction<{ type: string; story: Story }>) => {
          state.allStories.status = 'succeeded';
          state.allStories.stories.push(action.payload.story);
          state.allStories.storiesCount += 1;
        },
      )

      // Update Item
      .addCase(updateStory.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(updateStory.fulfilled, (state, action: PayloadAction<any>) => {
        state.allStories.status = 'succeeded';
        const index = state.allStories.stories.findIndex(
          (item) => item.id === action.payload.story.id,
        );
        if (index !== -1) {
          state.allStories.stories[index] = action.payload.story;
        }
      })

      // Delete Item
      .addCase(deleteStory.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(deleteStory.fulfilled, (state, action: PayloadAction<any>) => {
        state.allStories.status = 'succeeded';
        state.allStories.stories = state.allStories.stories.filter(
          (item) => item.slug !== action.payload.slug,
        );
      })

      // Add comment
      .addCase(addComment.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<{ type: string; comment: Comment }>) => {
          state.allStories.status = 'succeeded';
          state.allStories.storyComments = [
            action.payload.comment,
            ...state.allStories.storyComments,
          ];
        },
      )
      // Get comments
      .addCase(getComments.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(getComments.fulfilled, (state, action: PayloadAction<any>) => {
        state.allStories.status = 'succeeded';
        state.allStories.storyComments = action.payload.comments;
      })

      // Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<any>) => {
        state.allStories.status = 'succeeded';
        state.allStories.storyComments = state.allStories.storyComments.filter(
          (item) => item.id !== action.payload.id,
        );
      })

      // update comment
      .addCase(updateComment.pending, (state) => {
        state.allStories.status = 'loading';
      })
      .addCase(updateComment.fulfilled, (state, action: PayloadAction<any>) => {
        state.allStories.status = 'succeeded';
        const index = state.allStories.storyComments.findIndex(
          (item) => item.id === action.payload.comment.id,
        );
        if (index !== -1) {
          state.allStories.storyComments[index] = action.payload.comment;
        }
      });
  },
});

const storyReducer = storySlice.reducer;
export default storyReducer;
