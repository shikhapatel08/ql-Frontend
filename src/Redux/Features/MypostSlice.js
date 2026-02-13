import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPolls } from "../API/pollsapi";

export const FetchMyPost = createAsyncThunk(
    'myPost/FetchMyPost',
    async ({ page }, thunkAPI) => {
        const token = localStorage.getItem('token');
        try {
            return await fetchPolls({
                page,
                category: 'posted',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const MypostSlice = createSlice({
    name: 'mypost',
    initialState: {
        myPost: [],
        page: 1,
        hasMore: true,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchMyPost.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchMyPost.fulfilled, (state, action) => {
                state.loading = false;
                state.myPost.push(...action.payload);
                state.page += 1;

                if (action.payload.length === 0) {
                    state.hasMore = false;
                }
            })
            .addCase(FetchMyPost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});


export default MypostSlice.reducer;