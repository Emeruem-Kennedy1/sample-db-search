import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const searchArtists = createAsyncThunk(
  "artists/search",
  async ({ query, page = 1, limit = 10 }) => {
    const response = await axios.get(
      `/api/search?query=${query}&page=${page}&limit=${limit}`
    );
    return response.data;
  }
);

const artistSlice = createSlice({
  name: "artists",
  initialState: {
    artists: [],
    pagination: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchArtists.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchArtists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.artists = action.payload.artists;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchArtists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default artistSlice.reducer;
