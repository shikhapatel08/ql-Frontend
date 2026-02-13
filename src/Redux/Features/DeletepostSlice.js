import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem('token');
const BASE_URL = import.meta.env.VITE_API_URL;

export const DeletePost = createAsyncThunk(
    'deletepost/DeletePost',
    async ({ poll_id }, thunkAPI) => {
        const formData = new FormData();
        formData.append('del' , 1);
        try {
            const res = await axios.put(`${BASE_URL}/polls/edit/${poll_id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const DeletepostSlice = createSlice({
    name: 'deletepost',
    initialState: {
        loading: false,
        error: null,
        posts : [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DeletePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(DeletePost.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.posts = state.posts.filter(post => post.id !== action.payload.id);
            })
            .addCase(DeletePost.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default DeletepostSlice.reducer;