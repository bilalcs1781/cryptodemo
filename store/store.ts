import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import walletReducer from "./reducers/walletSlice";
import userReducer from "./reducers/userSlice";

// Persist configuration for wallet
const walletPersistConfig = {
  key: "wallet",
  storage,
};

// Persist configuration for user
const userPersistConfig = {
  key: "user",
  storage,
};

// Create persisted reducers
const persistedWalletReducer = persistReducer(walletPersistConfig, walletReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    wallet: persistedWalletReducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
