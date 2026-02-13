import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const FetchUser = createAsyncThunk(
    'signin/FetchUser',
    async (userData, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_URL}/user/login`,userData);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
const SignInSlice = createSlice({
    name: 'signin',
    initialState: {
        error: null,
        loading: false,
        User: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
        token: localStorage.getItem('token') || null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.User = action.payload;
                state.token = action.payload.token;

                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(FetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default SignInSlice.reducer;