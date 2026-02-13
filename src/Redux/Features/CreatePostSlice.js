import { createSlice } from "@reduxjs/toolkit";

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL

export const CreatePostAction = createAsyncThunk(
    'create/CreatePost',
    async (payload, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error('No token found');

            let headers = {
                Authorization: `Bearer ${token}`,
            };

            let requestBody = payload;

            if (payload instanceof FormData) {
                headers["Content-Type"] = "multipart/form-data";
            } else {
                headers["Content-Type"] = "application/json";
            }

            const res = await axios.post(
                `${BASE_URL}/polls/add-poll`,
                requestBody,
                { headers }
            );

            return res.data;

        } catch (error) {
            console.log(error?.response?.data || error.message);
            return thunkAPI.rejectWithValue(
                error?.response?.data || error.message
            );
        }
    }
);



const CreatepostSlice = createSlice({
    name: 'createpost',
    initialState: {
        error: null,
        loading: false,
        postData:[]
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(CreatePostAction.pending, (state) => {
                state.loading = true;
            })
            .addCase(CreatePostAction.fulfilled, (state, action) => {
                state.loading = false;
                state.postData.unshift(action.payload);
            })
            .addCase(CreatePostAction.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
})

export default CreatepostSlice.reducer;