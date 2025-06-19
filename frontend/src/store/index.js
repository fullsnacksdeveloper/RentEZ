// src/store/index.js or src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import messageReducer from './slices/messageSlice'; // ✅ should be here

const store = configureStore({
  reducer: {
    auth: authReducer,
    message: messageReducer, // ✅ Add this if it's not already

    // other reducers...
  },
});

export default store;
