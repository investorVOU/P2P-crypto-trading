import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;