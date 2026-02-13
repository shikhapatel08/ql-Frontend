import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { CommentData, CommentLike, CommentEdit, CommentDelete } from "./CommentSlice";

const BASE_URL = import.meta.env.VITE_API_URL;

export const RecommentData = createAsyncThunk(
    "recomment/RecommentData",
    async ({ poll_id, parent_comment_id, page }, thunkAPI) => {
        try {
            const res = await axios.get(`${BASE_URL}/comment/fetch?poll_id=${poll_id}&parent_comment_id=${parent_comment_id}&page=${page}&limit=5&action=comments`);
            return res.data.comments || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const RecommentSlice = createSlice({
    name: "recomment",
    initialState: {
        loading: false,
        error: null,
        comments: []
    },
    reducers: {
        addTempReply: (state, action) => {
            state.comments.unshift(action.payload);
        },
        clearRecomments: (state) => {
            state.comments = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(RecommentData.pending, (state) => {
                state.loading = true;
            })
            .addCase(RecommentData.fulfilled, (state, action) => {
                state.loading = false;

                const incoming = action.payload || [];

                // Replace temp replies with real ones using tempId
                const updated = [...incoming];

                state.comments.forEach(temp => {
                    if (temp.tempId) {
                        const matched = incoming.find(r => r.tempId === temp.tempId);
                        if (!matched) {
                            updated.push(temp);
                        }
                    }
                });

                // Remove duplicates by real id
                const map = new Map();
                updated.forEach(c => {
                    map.set(c.id || c.tempId, c);
                });

                state.comments = Array.from(map.values());
            })


            .addCase(RecommentData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(CommentData.fulfilled, (state, action) => {
                const { parent_comment_id, tempId } = action.payload;
                if (!parent_comment_id) return;

                const index = state.comments.findIndex(r => r.tempId === tempId);

                if (index !== -1) state.comments[index] = action.payload;
                else state.comments.unshift(action.payload);
            })


            .addCase(CommentLike.fulfilled, (state, action) => {
                state.loading = false;
                const { comment_id, dislike, del } = action.meta.arg;
                const reply = state.comments.find(r => r.id === comment_id);
                if (!reply) return;

                if (del === 1) {
                    reply.is_liked = false;
                    reply.is_disliked = false;
                } else {
                    reply.is_liked = dislike === 0;
                    reply.is_disliked = dislike === 1;
                }
            })

            .addCase(CommentEdit.fulfilled, (state, action) => {
                state.loading = false;
                const { comment_id, text } = action.payload;
                const reply = state.comments.find(r => r.id === comment_id);
                if (reply) reply.text = text;
            })

            .addCase(CommentDelete.fulfilled, (state, action) => {
                state.loading = false;
                const { comment_id } = action.payload;
                state.comments = state.comments.filter(r => r.id !== comment_id);
            });
    }
});

export const { addTempReply, clearRecomments } = RecommentSlice.actions;
export default RecommentSlice.reducer;
