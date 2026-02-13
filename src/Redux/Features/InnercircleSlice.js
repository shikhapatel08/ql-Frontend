import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPolls } from "../API/pollsapi";
// import axios from 'axios'

const token = localStorage.getItem('token');
export const FetchInnercircleData = createAsyncThunk(
    'InnercircleSlice/FetchInnercircleData',
    async ({ page }, thunkAPI) => {
        try {
            return await fetchPolls({
                page,
                category: 'inner_circle',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
const InnercircleSlice = createSlice({
    name: 'innercircle',
    initialState: {
        error: null,
        loading: false,
        innerCircleData: [],
        page: 1,
        hasMore: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchInnercircleData.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchInnercircleData.fulfilled, (state, action) => {
                state.loading = false;
                state.innerCircleData.push(...action.payload);
                state.page += 1;

                if (action.payload.length === 0) {
                    state.hasMore = false;
                }
            })
            .addCase(FetchInnercircleData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default InnercircleSlice.reducer;