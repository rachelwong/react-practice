// state
// loading boolean
// error string | null
// products Product[]
// cart: { products: string [], total: number }

// actions
// add item to cart (incls quantity)
// remove item in cart (incls quantity)

import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import cartReducer from "./cartReducer";

export const cartStore = configureStore({
  reducer: cartReducer,
});

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store itself
export type CartState = ReturnType<typeof cartStore.getState>;
export type CartDispatch = typeof cartStore.dispatch;
export type CartStore = typeof cartStore;

// a dispatch and selector scoped specifically to the cart
export const useCartDispatch = useDispatch.withTypes<CartDispatch>();
export const useCartSelector = useSelector.withTypes<CartState>();
