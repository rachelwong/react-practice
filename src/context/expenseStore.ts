import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import expenseReducer from "./expenseReducer";

const customLocalStorage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) =>
    Promise.resolve(localStorage.setItem(key, value)),
  removeItem: (key: string) => Promise.resolve(localStorage.removeItem(key)),
};

const persistConfig = {
  key: "expenses",
  storage: customLocalStorage,
};

const persistedExpenseReducer = persistReducer(persistConfig, expenseReducer);

export const expenseStore = configureStore({
  reducer: {
    expenses: persistedExpenseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type ExpensesStoreState = ReturnType<typeof expenseStore.getState>;

// inferred instead of writing out separate interfaces (i.e. useReducer)
// function to send actions to store (no need to write out individual action types)
export type ExpenseDispatch = typeof expenseStore.dispatch;

export const useExpenseDispatch = useDispatch.withTypes<ExpenseDispatch>();
export const useExpenseSelector = useSelector.withTypes<ExpensesStoreState>();

export const expensePersistor = persistStore(expenseStore);
