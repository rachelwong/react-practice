import { EXPENSE_TIME_FILTER, EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import type { DisplayExpense, Expense } from "@/types/Expenses";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface ExpensesState {
  expenses: Expense[];
  timeFilter: string[];
  categoryFilter: string | null;
}

const initialState: ExpensesState = {
  expenses: [],
  timeFilter: [], // AND logic to allow for multiple time calculations
  categoryFilter: null,
};

export const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpense: {
      // helper to run code before action.payload is handled by a reducer
      // transform the payload before it is persisted in the store
      prepare: (payload: DisplayExpense) => ({
        payload: { ...payload, date: payload.date.toISOString() },
      }),
      reducer: (state, action: PayloadAction<Expense>) => {
        const uuid = uuidv4();
        return {
          ...state,
          expenses: [
            ...state.expenses,
            {
              ...action.payload,
              date: action.payload.date,
              id: uuid, // write actual id in
            },
          ],
        };
      },
    },
    clearTimeFilter: (state) => {
      return {
        ...state,
        timeFilter: [],
      };
    },
    setTimeFilters: (
      state,
      action: PayloadAction<
        (typeof EXPENSE_TIME_FILTER)[keyof typeof EXPENSE_TIME_FILTER][]
      >,
    ) => {
      return {
        ...state,
        timeFilter: [...action.payload],
      };
    },
    setCategoryFilter: (
      state,
      action: PayloadAction<
        (typeof EXPENSE_TYPE)[keyof typeof EXPENSE_TYPE] | null
      >,
    ) => {
      return {
        ...state,
        categoryFilter: action.payload,
      };
    },
    clearAllFilters: (state) => {
      return {
        ...state,
        timeFilter: [],
        categoryFilter: null,
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
            isEdit: !selectedExpense.isEdit,
          },
        ],
      };
    },
    onUpdateExpense: {
      prepare: (payload: DisplayExpense) => ({
        payload: { ...payload, date: payload.date.toISOString() },
      }),
      reducer: (state, action: PayloadAction<Expense>) => {
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
  },
});

export const {
  addExpense,
  deleteExpense,
  onEditExpense,
  onUpdateExpense,
  setCategoryFilter,
  clearTimeFilter,
  setTimeFilters,
  clearAllFilters,
} = expensesSlice.actions;

export const expenses = (state: ExpensesState) => state.expenses;

export default expensesSlice.reducer;
