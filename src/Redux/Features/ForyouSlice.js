import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPolls } from "../API/pollsapi";
// import axios from 'axios'

export const FetchForyouData = createAsyncThunk(
    'trending/FetchForyouData',
    async ({ page, token }, thunkAPI) => {
        try {
            return await fetchPolls({
                page,
                category: 'for_you_v2',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
const ForyouSlice = createSlice({
    name: 'foryou',
    initialState: {
        error: null,
        loading: false,
        ForyouData: [],
        page: 1,
        hasMore: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchForyouData.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchForyouData.fulfilled, (state, action) => {
                state.loading = false;
                state.ForyouData.push(...action.payload);
                state.page += 1;

                if (action.payload.length === 0) {
                    state.hasMore = false;
                }
            })
            .addCase(FetchForyouData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default ForyouSlice.reducer;