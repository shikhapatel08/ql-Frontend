import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");


export const FetchLikeData = createAsyncThunk(
    'like/FetchLikeData',
    async ({ poll_id, dislike = 0, deleteLike = 0 }, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_URL}/likes/poll?ts=f692b585-408d-4003-8542-a254b3007e63`,
                {
                    poll_id,
                    dislike,
                    delete: deleteLike
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
);


const LikeSlice = createSlice({
    name: 'like',
    initialState: {
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchLikeData.pending, (state) => {
                state.loading = true
            })
            .addCase(FetchLikeData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(FetchLikeData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })

    },
});

export default LikeSlice.reducer;