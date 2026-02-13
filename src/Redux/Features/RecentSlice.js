import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPolls } from "../API/pollsapi";
// import axios from "axios";

export const FetchRecentData = createAsyncThunk(
    'recent/FetchRecentData',
    async ({ page }, thunkAPI) => {
        try {
            return await fetchPolls({
                page,
                category: 'recent'
            });
            // const res = await axios.post(`https://api-stage.queryloom.com/polls/get-polls?page=${page}&limit=10&category=recent&last_poll_id=&poll_id=&webLimit=&time_period=&only_polls=&for_reel=&search=`);
            // return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const RecentSlice = createSlice({
    name: 'recent',
    initialState: {
        loading: false,
        error: null,
        recentData: [],
        hasMore: true,
        page: 1,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchRecentData.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchRecentData.fulfilled, (state, action) => {
                state.loading = false;
                state.recentData.push(...action.payload);
                state.page += 1;

                if (action.payload.length === 0) {
                    state.hasMore = false;
                }
            })
            .addCase(FetchRecentData.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default RecentSlice.reducer;