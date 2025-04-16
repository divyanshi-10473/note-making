import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  chapterList: [],
};

// Fetch chapters for a specific subject
export const fetchChaptersBySubject = createAsyncThunk(
  "chapters/fetchChaptersBySubject",
  async (subjectId, { rejectWithValue }) => {
    try {
      console.log(subjectId, "subjectId batao phle")
      const response = await axios.get(`http://localhost:5000/api/chapters/get/${subjectId}`, {
        withCredentials: true,
      });
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch chapters");
    }
  }
);

// Create a new chapter
export const createChapter = createAsyncThunk(
  "chapters/createChapter",
  async ({ chapter_name, subjectId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/chapters/create",
        { chapter_name, subjectId },
        { withCredentials: true }
      );
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);


export const editChapter = createAsyncThunk(
  "chapters/editChapter",
  async ({ id, chapter_name, isCompleted }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/chapters/edit/${id}`,
        { chapter_name, isCompleted },
        { withCredentials: true }
      );
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);


export const deleteChapter = createAsyncThunk(
  "chapters/deleteChapter",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/chapters/delete/${id}`,
        { withCredentials: true }
      );
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const chapterSlice = createSlice({
  name: "chapters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchChaptersBySubject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChaptersBySubject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chapterList = action.payload.data;
      })
      .addCase(fetchChaptersBySubject.rejected, (state) => {
        state.isLoading = false;
        state.chapterList = [];
      })


  },
});

export default chapterSlice.reducer;
