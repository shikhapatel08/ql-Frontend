import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPolls } from "../API/pollsapi";

export const FetchSearchingData = createAsyncThunk(
    'search/FetchSearchingData',
    async ({ search, page }, thunkAPI) => {
        try {
            return await fetchPolls({
                page,
                category: 'search',
                search
            });
            // const res = await axios.post(`https://api-stage.queryloom.com/polls/get-polls?search=&page=1&limit=10&category=search`);
            // return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const SearchingSlice = createSlice({
    name: 'search',
    initialState: {
        loading: false,
        error: null,
        SearchingData: '',
        result: [],
    },
    reducers: {
        Searching: (state, action) => {
            state.SearchingData = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchSearchingData.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchSearchingData.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
            })
            .addCase(FetchSearchingData.rejected, (state, action) => {
                state.error = action.payload;
            })
    }
});

export const { Searching } = SearchingSlice.actions;
export default SearchingSlice.reducer