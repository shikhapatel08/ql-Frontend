import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("token");
const BASE_URL = import.meta.env.VITE_API_URL;


export const CommentAction = createAsyncThunk(
    "comment/CommentAction",
    async ({ poll_id, page = 1 }, thunkAPI) => {
        try {
            const res = await axios.get(
                `${BASE_URL}/comment/fetch?poll_id=${poll_id}&parent_comment_id=&page=${page}&limit=10&action=comments&order=`,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const CommentData = createAsyncThunk(
    "comment/CommentData",
    async ({ poll_id, text, parent_comment_id, tempId, user_id }, thunkAPI) => {
        try {
            const formData = new FormData();
            formData.append("poll_id", poll_id);
            formData.append("text", text);
            formData.append("user_id", user_id);
            formData.append("attch_in_html", 0);
            formData.append("is_longcomment", 0);

            if (parent_comment_id) {
                formData.append("parent_comment_id", parent_comment_id);
            }


            const res = await axios.post(`${BASE_URL}/comment/add-comment`, formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });
            const apiComment = res.data.data;  // ← res.data.data!

            return {
                id: apiComment.id,                           // 21549 ✅
                text: apiComment.text,                       // "test" ✅
                User: apiComment.User,                       // Perfect! ✅
                parent_comment_id: apiComment.parent_comment_id,
                user_id: apiComment.user_id,
                tempId,  // Keep temporarily
                is_liked: false,
                is_disliked: false,
                replyCount: 0,
                created_at: apiComment.createdAt
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const CommentLike = createAsyncThunk(
    'comment/CommentLike',
    async ({ poll_id, dislike = 0, del = 0, comment_id }, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_URL}/likes/comment`, { poll_id, dislike, del, comment_id }, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const CommentEdit = createAsyncThunk(
    'comment/CommentEdit',
    async ({ text, comment_id }, thunkAPI) => {
        try {
            const res = await axios.put(`${BASE_URL}/comment/edit/${comment_id}`, { text }, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });
            return { comment_id, text, data: res.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const CommentDelete = createAsyncThunk(
    'comment/CommentDelete',
    async ({ comment_id }, thunkAPI) => {
        try {
            const res = await axios.delete(`${BASE_URL}/comment/remove-from-reel/${comment_id}`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });
            return { comment_id, data: res.data };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



const CommentSlice = createSlice({
    name: "comment",
    initialState: {
        FetchingLoading: false,
        loading: false,
        error: null,
        comments: { comments: [] },
    },
    reducers: {
        addTempComment: (state, action) => {
            state.comments.comments.unshift(action.payload);
        },
        incrementReplyCount: (state, action) => {
            const { commentId } = action.payload;
            const comment = state.comments.comments.find(c => (c.id || c.tempId) === commentId);
            if (comment) comment.replyCount = (comment.replyCount || 0) + 1;
        },
        deleteCommentTree: (state, action) => {
            const { commentId } = action.payload;

            state.comments.comments = state.comments.comments.filter(
                c => (c.id || c.tempId) !== commentId
            );
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(CommentAction.pending, (state) => {
                state.FetchingLoading = true;
            })
            .addCase(CommentAction.fulfilled, (state, action) => {
                state.FetchingLoading = false;

                const newComments = action.payload.comments || [];
                const existingTemps = state.comments.comments.filter(c => c.tempId);

                state.comments.comments = [
                    ...existingTemps,
                    ...newComments.filter(c => !existingTemps.some(t => t.tempId === c.id))
                ];

                const reactions = JSON.parse(localStorage.getItem("commentReactions") || "{}");
                state.comments.comments.forEach(comment => {
                    if (reactions[comment.id] === "like") {
                        comment.is_liked = true;
                        comment.is_disliked = false;
                    }
                    if (reactions[comment.id] === "dislike") {
                        comment.is_disliked = true;
                        comment.is_liked = false;
                    }
                });
            })
            .addCase(CommentAction.rejected, (state, action) => {
                state.FetchingLoading = false;
                state.error = action.payload;
            })

            .addCase(CommentData.pending, (state) => {
                state.loading = true;
            })
            .addCase(CommentData.fulfilled, (state, action) => {
                state.loading = false;

                const newComment = action.payload;
                const { tempId } = action.meta.arg;

                // ✅ JO reply hoy → aa slice ma mukvu j nai
                if (newComment.parent_comment_id) return;

                const index = state.comments.comments.findIndex(c => c.tempId === tempId);

                if (index !== -1) {
                    delete newComment.tempId;
                    state.comments.comments[index] = newComment;
                } else {
                    state.comments.comments.unshift(newComment);
                }
            })

            .addCase(CommentData.rejected, (state, action) => {
                state.loading = false; state.error = action.payload;
            })

            .addCase(CommentLike.pending, (state) => {
                state.loading = true;
            })
            .addCase(CommentLike.fulfilled, (state, action) => {
                state.loading = false;

                const { comment_id, dislike, del } = action.meta.arg;
                const comment = state.comments.comments.find(c => c.id === comment_id);
                if (!comment) return;

                let reactions = JSON.parse(localStorage.getItem("commentReactions") || "{}");

                if (del === 1) {
                    comment.is_liked = false; comment.is_disliked = false;
                    delete reactions[comment_id];
                } else {
                    if (dislike === 0) {
                        comment.is_liked = true; comment.is_disliked = false; reactions[comment_id] = "like";
                    }
                    if (dislike === 1) {
                        comment.is_disliked = true; comment.is_liked = false; reactions[comment_id] = "dislike";
                    }
                }

                localStorage.setItem("commentReactions", JSON.stringify(reactions));
            })
            .addCase(CommentLike.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            .addCase(CommentEdit.pending, (state) => {
                state.loading = true;
            })
            .addCase(CommentEdit.fulfilled, (state, action) => {
                state.loading = false;
                const { comment_id, text } = action.payload;
                const comment = state.comments.comments.find(c => c.id === comment_id);
                if (comment) comment.text = text;
            })
            .addCase(CommentEdit.rejected, (state, action) => {
                state.loading = false; state.error = action.payload;
            })

            .addCase(CommentDelete.pending, (state) => {
                state.loading = true;
            })
            .addCase(CommentDelete.fulfilled, (state, action) => {
                state.loading = false;
                const { comment_id } = action.payload;
                state.comments.comments = state.comments.comments.filter(c => c.id !== comment_id);
            })
            .addCase(CommentDelete.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export const { addTempComment, incrementReplyCount, deleteCommentTree } = CommentSlice.actions;
export default CommentSlice.reducer;
