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

interface PostsState{
    posts: Post[];
    loading: boolean;
    creating: boolean;
    error: string | null;
    currentPost: Post | null;

}
const initialState: PostsState= {
    posts: [],
    loading: false,
    creating: false,
    error: null,
    currentPost: null
};


//creating post .................

export const createPost = createAsyncThunk(
    'posts/createPost',
    async (postData: {
        title: string;
        content: string;
        post_type: string;
        tags?: string[];
        image_url?: string;
        video_url?: string;

    }, {rejectWithValue}) => {

        try {
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
    async (_,{rejectWithValue}) => {
        try {
            const response = await api.get('/posts');
            return response.data

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message)
            
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
        state.posts = action.payload;
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