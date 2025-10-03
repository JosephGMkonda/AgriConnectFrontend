import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from '../service/api'


interface comment {
    id: number;
    post: number;
    author: string;
    author_name: string;
    content: string;
    parent: number| null;
    created_at: string;
    updated_at: string;

}

interface CommentSates{
    comments: Comment[];
    loading: boolean;
    error: string | null;

}

const initialState: CommentSates = {
    comments: [],
    loading: false,
    error: null

}

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/Comments/?post=${postId}`);
      console.log("Fetching comments: ", response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);



export const createComment = createAsyncThunk(
  'comments/createComment',
  async (
    { postId, content, parentId }: { postId: number; content: string; parentId?: number },
    { rejectWithValue }
  ) => {
    try {
      
      const payload: any = {
        post: postId,
        content,
      };

      
      if (parentId) {
        payload.parent = parentId;
      }

      const response = await api.post('/Comments/', payload);

      console.log('Created comment response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Create comment error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/Comments/${commentId}/`);
      return commentId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create comment
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
        const post = state.posts?.list?.find((p: any) => p.id === postId);

         if (post) {
        post.comments_count += 1; 
      }
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;