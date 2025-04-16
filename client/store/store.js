import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice/index';
import subjectReducer from './subject-slice/index'; 
import chapterReducer from './chapter-slice/index'
const store = configureStore({
  reducer: {
    auth: authReducer,
    subjects: subjectReducer, 
    chapters: chapterReducer,
  },
});

export default store;
