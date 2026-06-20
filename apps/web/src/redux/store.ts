"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer from "./features/cart/cartSlice";
import { Environments } from "@/constants/enums";

const rootReducer = combineReducers({
  cart: cartReducer,
});

const persistedReducer = persistReducer(
  { key: "cart", storage, whitelist: ["items", "cartId", "guestId"] },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV === Environments.DEV,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"] },
    }),
});

export const persistor = typeof window !== "undefined" ? persistStore(store) : null;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
