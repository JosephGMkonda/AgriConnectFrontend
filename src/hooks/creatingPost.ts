import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {api} from '../service/api'



interface Post {
    id: number;
    author: any;
    title: string;
    content: string;
    post_type: string;
    image_url?: string;
    video_url?: string;
    tags: string[];
    view_count: number;
    like_count: number;
    share_count: number;
    created_at: string;
    updated_at: string;

}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  nextPage: number;
  totalCount: number;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  nextPage: 1,
  totalCount: 0,
};


//creating post .................

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (postData: {
        title: string;
        content: string;
        post_type: string;
        tags?: string[];
        mediaFiles?: File[];

    }, {rejectWithValue}) => {

        try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      formData.append('post_type', postData.post_type);
      if (postData.tags) {
        postData.tags.forEach(tag => {
          formData.append('tags_ids', tag);
        });
      }

      if (postData.mediaFiles) {
        postData.mediaFiles.forEach(file => {
          formData.append('media_uploads', file);
        });
      }
      


            const response = await api.post('/posts/', postData,{
                headers:{
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data


        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message)
            
        }
    }
)

// fetching all post
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/posts/', {
        params: { page, limit, ordering: '-created_at' }
      });
      console.log(response)
      return {
        posts: response.data.results,
        totalCount: response.data.count,
        page,
        hasMore: !!response.data.next
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);


// updating post
export const updatePost = createAsyncThunk(
    'posts/updatePost',
    async (
        { id, updatedData }: { id: number, updatedData: Partial<Post> },
        { rejectWithValue }: { rejectWithValue: (value: any) => any }
    ) => {
        try {
            const response = await api.put(`/posts/${id}/`, updatedData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message);
        }
    }
)

export const deletePost = createAsyncThunk(
    'posts/deletePost',
    async(id: number, {rejectWithValue}) => {
        try {
            await api.delete(`/posts/${id}/`);
            return id
        } catch (error: any) {

            return rejectWithValue(error.response?.data?.error || error.message)
            
        }
    }
)

export const fetchPostById = createAsyncThunk(
    'posts/fetchPostById',
    async(id:number, {rejectWithValue}) => {
        try {
            const response = await api.get(`/posts/${id}`);
        return response.data
            
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message)
            
        }
        
    }
)



const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        addPost: (state, action) => {
            state.posts.unshift(action.payload)
        }
    },

    extraReducers: (builder) => {
        builder

        //creating a post
        .addCase(createPost.pending, (state) => {
        state.creating = true;
        state.error = null;
      })

      .addCase(createPost.fulfilled, (state, action) => {
        state.creating = false;
        state.posts.unshift(action.payload);
      })

       .addCase(createPost.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload as string;
      })
     // fetching a post
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

 .addCase(fetchPosts.fulfilled, (state, action) => {
  state.loading = false;
  

  const existingPostsMap = new Map();
  state.posts.forEach(post => existingPostsMap.set(post.id, post));
  
  
  action.payload.posts.forEach(newPost => {
    if (existingPostsMap.has(newPost.id)) {
      
      const index = state.posts.findIndex(p => p.id === newPost.id);
      if (index !== -1) {
        state.posts[index] = newPost; 
      }
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

      //fetching a post by id
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

      //updating a post
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.posts[index] = action.payload;
        if (state.currentPost?.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })

      //Deleting a post 
          .addCase(deletePost.fulfilled, (state: PostsState, action: PayloadAction<number>) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
        if (state.currentPost?.id === action.payload) {
          state.currentPost = null;
        }
      })

    }

});
export default postSlice.reducer