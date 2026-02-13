import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");


export const FetchRepostData = createAsyncThunk(
    'repost/FetchRepostData',
    async ({ parent_pid }, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_URL}/polls/repost`,
                {
                    type: 'repost',
                    parent_pid: String(parent_pid)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    }
                }
            );
            let repost = JSON.parse(localStorage.getItem('reposts')) || [];
            if (!repost.includes(parent_pid)) {
                repost.push(parent_pid);
                localStorage.setItem('reposts', JSON.stringify(repost));
            }
            return { parent_pid, response: res.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const UnoPost = createAsyncThunk(
    'repost/UnoPost',
    async ({ parent_pid }, thunkAPI) => {
        try {
            const res = await axios.put(`${BASE_URL}/polls/undo-repost/${parent_pid}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json"
                    }
                }
            );
            let repost = JSON.parse(localStorage.getItem('repostedPosts')) || [];
            repost = repost.filter(id => id !== parent_pid);
            localStorage.setItem('repostedPosts', JSON.stringify(repost));

            return { parent_pid, response: res.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const RespostSlice = createSlice({
    name: 'repost',
    initialState: {
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchRepostData.pending, (state) => {
                state.loading = true
            })
            .addCase(FetchRepostData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(FetchRepostData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

            .addCase(UnoPost.pending, (state) => {
                state.loading = true
            })
            .addCase(UnoPost.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(UnoPost.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
    },
});

export default RespostSlice.reducer;