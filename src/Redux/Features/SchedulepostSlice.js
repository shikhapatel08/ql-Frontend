import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPolls } from "../API/pollsapi";

export const FetchSchedulePost = createAsyncThunk(
    'schedulepost/FetchSchedulePost',
    async ({ page }, thunkAPI) => {
        const token = localStorage.getItem('token');
        try {
            return await fetchPolls({
                page,
                category: 'scheduled',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const SchedulepostSlice = createSlice({
    name: 'schedulepost',
    initialState: {
        schedulePost: [],
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchSchedulePost.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchSchedulePost.fulfilled, (state, action) => {
                state.loading = false;
                state.schedulePost = action.payload;
            })
            .addCase(FetchSchedulePost.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});


export default SchedulepostSlice.reducer;