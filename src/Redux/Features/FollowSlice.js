import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL

export const FetchFollowData = createAsyncThunk(
    'follow/FetchFollowData',
    async ({ poll_id}, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const state = thunkAPI.getState();
            const isFollowing  = state.follow.FollowedUser[poll_id];
            const type = isFollowing ? 'unfl' : 'fl';
            const res = await axios.post(`${BASE_URL}/user/manage-follow?user_id=${poll_id}&type=${type}`,
                {
                    user_id:poll_id,
                    type
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }

            );
            return { poll_id, response: res.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const FollowSlice = createSlice({
    name: 'follow',
    initialState: {
        loading: false,
        error: null,
        FollowedUser:localStorage.getItem('Following-user') ? JSON.parse(localStorage.getItem('Following-user')) : {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchFollowData.pending, (state) => {
                state.loading = true
            })
            .addCase(FetchFollowData.fulfilled, (state,action) => {
                state.loading = false;
                const userId = action.meta.arg.poll_id;
                state.FollowedUser[userId] = !state.FollowedUser[userId];
                localStorage.setItem('Following-user',JSON.stringify(state.FollowedUser));
            })
            .addCase(FetchFollowData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
    },
});

export default FollowSlice.reducer;