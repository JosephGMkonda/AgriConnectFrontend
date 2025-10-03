import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {api} from "../service/api";
import type { Profile } from "../types";


interface ProfileState {
    profile: any;
    loading: boolean;
    updating: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    profile: null,
    loading: false,
    updating: false,
    error: null,
};

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/userprofile/profile/');
            console.log( "response from profile",response)
            
            return response.data.profile;
            
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: Partial<Profile> | FormData, { rejectWithValue }) => {
    try {
      let response;

      if (profileData instanceof FormData) {
        response = await api.put('/userprofile/profile/update/', profileData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });


      } else {
        response = await api.put('/userprofile/profile/update/', profileData);
      }

      return response.data;
      
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to update profile');
    }
  }
);


const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile: (state) => {
            state.profile = null;
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {     
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateProfile.pending, (state) => {
                state.updating = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updating = false;
                state.profile = action.payload;
            })  
            .addCase(updateProfile.rejected, (state, action) => {
                state.updating = false;
                state.error = action.payload as string;
            })
    },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;