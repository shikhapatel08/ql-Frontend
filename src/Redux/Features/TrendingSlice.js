import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPolls } from "../API/pollsapi";
// import axios from 'axios'

export const FetchTrendingData = createAsyncThunk(
    'trending/FetchTrendingData',
    async ({ page }, thunkAPI) => {
        try {
            return await fetchPolls({
                page,
                category: 'trending_v2',
                time_period: 14
            });
            // const res = await axios.post(`https://api-stage.queryloom.com/polls/get-polls?page=${page}&limit=10&category=trending_v2&last_poll_id=&poll_id=&webLimit=&time_period=45&only_polls=&for_reel=&search=`,
            //     {},
            //     {
            //         headers:{
            //             'Content-Type': 'application/json'
            //         }
            //     }
            // );
            // console.log(res.data);
            // return(res.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
const TrendingSlice = createSlice({
    name: 'trending',
    initialState: {
        error: null,
        loading: false,
        data: [],
        page: 1 ,
        hasMore: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchTrendingData.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchTrendingData.fulfilled, (state, action) => {
                state.loading = false;
                state.data.push(...action.payload);
                state.page += 1;

                if (action.payload.length === 0) {
                    state.hasMore = false;
                }
            })
            .addCase(FetchTrendingData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default TrendingSlice.reducer;