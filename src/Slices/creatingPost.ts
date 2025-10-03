import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../service/api";

interface Media {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  alt?: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  post_type: string;
  author: any;
  created_at: string;
  like_count: number;
  comment_count: number;
  view_count: number;
  tags?: string[];
  media?: Media[];
  is_liked?: boolean;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  nextPage: number;
  totalCount: number;
  creating?: boolean;
  currentPost?: Post | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  nextPage: 1,
  totalCount: 0,
  creating: false,
  currentPost: null,
};


const mapBackendPostToFrontend = (post: any): Post => ({
  id: post.id,
  title: post.title,
  content: post.content,
  post_type: post.post_type,
  author: post.author,
  created_at: post.created_at,
  like_count: post.like_count_calc,
  comment_count: post.comment_count_calc,
  view_count: post.view_count,
  tags: post.tags?.map((t: any) => t.name),
  media: post.media_files?.map((m: any) => ({
    type: m.media_type,
    url: m.file_url,
    thumbnail: m.thumbnail_url,
    alt: m.alt_text,
  })),
  is_liked: post.is_liked,
});

// Async thunk to create a post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (
    postData: {
      title: string;
      content: string;
      post_type: string;
      tags?: string[];
      mediaFiles?: File[];
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("content", postData.content);
      formData.append("post_type", postData.post_type);

      postData.tags?.forEach((tag) => formData.append("tags_ids", tag));
      postData.mediaFiles?.forEach((file) => formData.append("media_uploads", file));

      const response = await api.post("/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Form data posted", response)

      return mapBackendPostToFrontend(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Async thunk to fetch posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/posts/", { params: { page, limit, ordering: "-created_at" } });
      console.log("This is our post oh", response)
      const mappedPosts = response.data.results.map(mapBackendPostToFrontend);

      return {
        posts: mappedPosts,
        totalCount: response.data.count,
        page,
        hasMore: !!response.data.next,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);


export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (
    updateData: {
      postId: number;
      title: string;
      content: string;
      post_type: string;
      tags?: string[];
      mediaFiles?: File[];
      mediaToRemove?: number[];
      existingMedia?: Media[];
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("title", updateData.title);
      formData.append("content", updateData.content);
      formData.append("post_type", updateData.post_type);

      
      updateData.tags?.forEach((tag) => formData.append("tags_names", tag));
      
      
      updateData.mediaToRemove?.forEach((mediaId) => {
        formData.append("media_to_remove", mediaId.toString());
      });

      
      updateData.existingMedia?.forEach((media) => {
        formData.append("existing_media_urls", media.url);
      });
      
      
      updateData.mediaFiles?.forEach((file) => {
        formData.append("media_uploads", file);
      });

    
      
      const response = await api.patch(`/posts/${updateData.postId}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

  
      return mapBackendPostToFrontend(response.data);
    } catch (error: any) {
      console.error('Update post error details:', {
        message: error.message,
        response: error.response,
        request: error.request,
        config: error.config
      });
      
      
      const errorMessage = error.response?.data?.error 
        || error.response?.data?.detail 
        || error.message 
        || 'Failed to update post';
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to fetch a single post
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/posts/${id}/`);
      return mapBackendPostToFrontend(response.data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);


export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: number, { rejectWithValue }) => {
    try {
      console.log('Deleting post:', postId);
      await api.delete(`/posts/${postId}/`);
      return postId; 
    } catch (error: any) {
      console.error('Delete post error:', error);
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

// Slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE POST
      .addCase(createPost.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.creating = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })

      // FETCH POSTS
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        const existingPostsMap = new Map();
        state.posts.forEach((post) => existingPostsMap.set(post.id, post));

        action.payload.posts.forEach((newPost) => {
          if (existingPostsMap.has(newPost.id)) {
            const index = state.posts.findIndex((p) => p.id === newPost.id);
            if (index !== -1) state.posts[index] = newPost;
          } else {
            state.posts.push(newPost);
          }
        });

        state.hasMore = action.payload.hasMore;
        state.nextPage = action.payload.page + 1;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // FETCH POST BY ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  
.addCase(updatePost.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updatePost.fulfilled, (state, action) => {
  state.loading = false;

  const updatedPost = action.payload;
  const index = state.posts.findIndex(post => post.id === updatedPost.id);
  if (index !== -1) {
    state.posts[index] = updatedPost;
  }
})
.addCase(updatePost.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
})



.addCase(deletePost.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(deletePost.fulfilled, (state, action) => {
  state.loading = false;
  
  state.posts = state.posts.filter(post => post.id !== action.payload);
  console.log('Post deleted successfully');
})
.addCase(deletePost.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
})
  },
});

export const { clearError, addPost } = postSlice.actions;
export default postSlice.reducer;
