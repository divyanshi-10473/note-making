import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  subjectsList: [],
};


export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/subjects/get", {
        withCredentials: true,
      });
      return response?.data; 
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue("Failed to fetch subjects");
      }
    }
  }
)
  


  export const createSubject = createAsyncThunk(
    "subjects/createSubject",
    async (subject_name, { rejectWithValue }) => {
      try {
        const response = await axios.post(`http://localhost:5000/api/subjects/create`, subject_name, {
          withCredentials: true,
        });
        return response?.data;
      } catch (err) {
        if (err.response && err.response.data) {
          return rejectWithValue(err.response.data.message);
        } else {
          return rejectWithValue("Something went wrong");
        }
      }
    }
  );

  
 
  export const editSubject = createAsyncThunk(
    "subjects/editSubject",
    async ({ id, subject_name }, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/subjects/edit/${id}`,
          { subject_name },
          { withCredentials: true }
        );
        return response?.data;
      } catch (err) {
        if (err.response && err.response.data) {
          return rejectWithValue(err.response.data.message);
        } else {
          return rejectWithValue("Something went wrong");
        }
      }
    }
  );

  export const deleteSubject = createAsyncThunk(
    "subjects/deleteSubject",
    async (id, { rejectWithValue }) => {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/subjects/delete/${id}`,
          { withCredentials: true }
        );
        return response?.data;
      } catch (err) {
        if (err.response && err.response.data) {
          return rejectWithValue(err.response.data.message);
        } else {
          return rejectWithValue("Something went wrong");
        }
      }
    }
  );
  


 
//   export const deleteSubject = createAsyncThunk(
//     "subjects/deleteSubject",
//     async ({ id, token }) => {
//       const result = await axios.delete(`http://localhost:5000/api/subjects/delete/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return result?.data; 
//     }
//   );

const subjectSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {},
  extraReducers: (builder)=>{
    builder.addCase(fetchSubjects.pending,(state)=>{
        state.isLoading = true;

    }).addCase(fetchSubjects.fulfilled,(state,action)=>{
        console.log(action.payload.data);
        state.isLoading = false;
        state.subjectsList = action.payload.data;
    }).addCase(fetchSubjects.rejected,(state,action)=>{
        console.log(action.payload.data);
        state.isLoading = false;
        state.subjectsList = [];
    })
}
  
});

export default subjectSlice.reducer;
