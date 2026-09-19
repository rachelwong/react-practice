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
    clearAllExpenses: () => {
      return initialState;
    },
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
      return {
        ...state,
        expenses: state.expenses.map((expense) => {
          if (expense.id === action.payload) {
            return {
              ...expense,
              isEdit: !expense.isEdit,
            };
          }
          return expense;
        }),
      };
    },
    onUpdateExpense: {
      prepare: (payload: DisplayExpense) => ({
        payload: { ...payload, date: payload.date.toISOString() },
      }),
      reducer: (state, action: PayloadAction<Expense>) => {
        return {
          ...state,
          // need to mutate on top of the array so that it keeps
          // rest of the array in place
          // destructuring and spreading will result in always
          // updating the last item of the array
          expenses: state.expenses.map((expense) => {
            if (expense.id === action.payload.id) {
              return {
                ...action.payload,
                isEdit: false,
              };
            }
            return expense;
          }),
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
  clearAllExpenses,
} = expensesSlice.actions;

export const expenses = (state: ExpensesState) => state.expenses;

export default expensesSlice.reducer;
