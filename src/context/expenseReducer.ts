import type { ExpenseItem } from "@/types/Expenses";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export type Expense = ExpenseItem & { isEdit: boolean };

export interface ExpensesState {
  expenses: Expense[];
  timeFilter: string | null;
  typeFilter: string | null;
}

const initialState: ExpensesState = {
  expenses: [],
  timeFilter: null,
  typeFilter: null,
};

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      const uuid = uuidv4();
      return {
        ...state,
        expenses: [
          ...state.expenses,
          {
            ...action.payload,
            id: uuid, // write actual id in
          },
        ],
      };
    },
    deleteExpense: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        expenses: state.expenses.filter((x) => x.id !== action.payload),
      };
    },
    onEditExpense: (state, action: PayloadAction<string>) => {
      const selectedExpense = state.expenses.find(
        (x) => x.id === action.payload,
      );

      const others = state.expenses.filter((x) => x.id !== action.payload);

      if (!selectedExpense) {
        return state;
      }
      return {
        ...state,
        expenses: [
          ...others,
          {
            ...selectedExpense,
            isEdit: true,
          },
        ],
      };
    },
    onUpdateExpense: (state, action: PayloadAction<Expense>) => {
      if (!action.payload.isEdit) {
        return state;
      }
      const selectedExpense = state.expenses.find(
        (x) => x.id === action.payload.id,
      );

      const others = state.expenses.filter((x) => x.id !== action.payload.id);

      if (!selectedExpense) {
        return state;
      }
      return {
        ...state,
        expenses: [
          ...others,
          {
            ...action.payload,
            isEdit: false,
          },
        ],
      };
    },
  },
});

export const { addExpense, deleteExpense, onEditExpense, onUpdateExpense } =
  expensesSlice.actions;

export const expenses = (state: ExpensesState) => state.expenses;

export default expensesSlice.reducer;
