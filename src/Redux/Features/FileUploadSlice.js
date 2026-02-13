import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('token');

export const UploadFile = createAsyncThunk(
    'fileupload/UploadFile',
    async(file,thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append("file",file);
            const res = await axios.post(`${BASE_URL}/file-upload`,formData,
                {
                    headers:{
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            console.log("AXIOS UPLOAD RES 👉", res.data);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const FileUploadSlice = createSlice({
    name : 'fileupload',
    initialState:{
        error:null,
        loading:false,
        fileUrl:null,
    },
    reducers:{},
    extraReducers:(builder) => {
        builder
        .addCase(UploadFile.pending,(state) => {
            state.loading = true;
        })
        .addCase(UploadFile.fulfilled,(state,action) => {
            state.loading = false;
            state.error = null;
            state.fileUrl = action.payload.file;
        })
        .addCase(UploadFile.rejected,(state,action) => {
            state.error = action.payload;
        })
    },
});

export default FileUploadSlice.reducer;