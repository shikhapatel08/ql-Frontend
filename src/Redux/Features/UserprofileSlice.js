import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const FetchUserProfile = createAsyncThunk(
    'profile/FetchUserProfile',
    async ({ username, page = 1 }, thunkAPI) => {
        try {
            const token =   localStorage.getItem('token');
            const res = await axios.get(`${API_BASE_URL}/user/profile/${username}`, {
                params: { page, limit: 10, type: 'profile', forProfile: 1 },
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const UserPost = createAsyncThunk(
    'profile/UserPost',
    async ({ username, page = 1 }, thunkAPI) => {
        try {
            const res = await axios.get(
                `${API_BASE_URL}/user/profile/${username}?page=${page}&limit=10&type=polls&order=newest&search=`
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const UserprofileSlice = createSlice({
    name: 'profile',
    initialState: {
        currentUser: localStorage.getItem('userDetail') ? JSON.parse(localStorage.getItem('userDetail')) : null,
        viewedUserPosts: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(FetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                localStorage.setItem('userDetail',JSON.stringify(action.payload));
            })
            .addCase(FetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(UserPost.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UserPost.fulfilled, (state, action) => {
                state.loading = false;
                state.viewedUserPosts = action.payload;
            })
            .addCase(UserPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default UserprofileSlice.reducer;
