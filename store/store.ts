import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./reducers/walletSlice";
import userReducer from "./reducers/userSlice";

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
