import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL

export const FetchSaveData = createAsyncThunk(
    'save/FetchSaveData',
    async ({ poll_id, unsave }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${BASE_URL}/polls/save-poll/${poll_id}`,
                {
                    poll_id,
                    unsave
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
)

const SaveSlice = createSlice({
    name: 'save',
    initialState: {
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchSaveData.pending, (state) => {
                state.loading = true
            })
            .addCase(FetchSaveData.fulfilled, (state) => {
                state.loading = false;

            })
            .addCase(FetchSaveData.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            })
    },
});

export default SaveSlice.reducer;