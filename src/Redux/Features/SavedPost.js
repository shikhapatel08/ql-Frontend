import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPolls } from "../API/pollsapi";

export const FetchSavedpost = createAsyncThunk(
    'savedPost/FetchSavedpost',
    async ({ page }, thunkAPI) => {
        const token = localStorage.getItem('token');
        try {
            return await fetchPolls({
                page,
                category: 'saved',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const SavedPostSlice = createSlice({
    name: 'savedPost',
    initialState: {
        post: [],
        loading: false,
    },
    reducers: {
        togglePost: (state, action) => {
            const postId = action.payload;
            const index = state.post.findIndex(p => p.id === postId);
            if (index === -1) {
                state.post.push({ id: postId }); // Or fetch full post object
            } else {
                state.post.splice(index, 1); // remove saved
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchSavedpost.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchSavedpost.fulfilled, (state, action) => {
                state.loading = false;
                state.post = action.payload;
            })
            .addCase(FetchSavedpost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { togglePost } = SavedPostSlice.actions;

export default SavedPostSlice.reducer;