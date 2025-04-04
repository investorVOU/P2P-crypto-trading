import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import tradesReducer from './features/trades/tradesSlice';
import walletReducer from './features/wallet/walletSlice';
import uiReducer from './features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trades: tradesReducer,
    wallet: walletReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
