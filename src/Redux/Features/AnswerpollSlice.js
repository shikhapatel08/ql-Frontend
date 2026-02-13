import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export const AnswerPollAction = createAsyncThunk(
  "answerpoll/AnswerPollAction",
  async ({ poll_id, group_id, option_id }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BASE_URL}/polls/answer-poll`,
        { poll_id, group_id, option_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return res.data.data; // updated poll from backend
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const AnswerpollSlice = createSlice({
  name: "answerpoll",
  initialState: {
    polls: [], // all polls
    loading: false,
    error: null,
  },
  reducers: {
    setPolls: (state, action) => {
      state.polls = action.payload;
    },
    updatePoll: (state, action) => {
      const updatedPoll = action.payload;
      if (!updatedPoll || !updatedPoll.id) return;

      const index = state.polls.findIndex((p) => p?.id === updatedPoll.id);

      if (index !== -1) {
        state.polls[index] = updatedPoll;
      } else {
        state.polls.push(updatedPoll);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AnswerPollAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AnswerPollAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedPoll = action.payload;
        if (!updatedPoll || !updatedPoll.id) return;

        const index = state.polls.findIndex((p) => p?.id === updatedPoll.id);

        if (index !== -1) {
          state.polls[index] = updatedPoll;
        } else {
          state.polls.push(updatedPoll);
        }
      })
      .addCase(AnswerPollAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPolls, updatePoll } = AnswerpollSlice.actions;
export default AnswerpollSlice.reducer;
