import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tradeReducer from './slices/tradeSlice';
import walletReducer from './slices/walletSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    trade: tradeReducer,
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loginSuccess'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user.timestamp'],
      },
    }),
});
