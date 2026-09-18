import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import expenseReducer from "./expenseReducer";

export const expenseStore = configureStore({
  reducer: {
    expenses: expenseReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type ExpenseState = ReturnType<typeof expenseStore.getState>;

// inferred instead of writing out separate interfaces (i.e. useReducer)
// function to send actions to store (no need to write out individual action types)
export type ExpenseDispatch = typeof expenseStore.dispatch;

export const useExpenseDispatch = useDispatch.withTypes<ExpenseDispatch>();
export const useExpenseSelector = useSelector.withTypes<ExpenseState>();
