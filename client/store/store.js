import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice/index';
import subjectReducer from './subject-slice/index'; // Import the subject slice

const store = configureStore({
  reducer: {
    auth: authReducer,
    subjects: subjectReducer, // Add the subjects reducer
  },
});

export default store;
