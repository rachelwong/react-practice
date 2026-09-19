import type { EXPENSE_TYPE } from "@/constants/ExpenseTracker";

export interface ExpenseItem {
  id: string; // uuid
  description: string;
  amount: string; // cents in integers
  type: (typeof EXPENSE_TYPE)[keyof typeof EXPENSE_TYPE] | null;
  date: string; // ISO8601 string
  category: string | null; // null;
}

export const ExpenseAction = {
  UPDATE_DESCRIPTION: "UPDATE_DESCRIPTION",
  UPDATE_AMOUNT: "UPDATE_AMOUNT",
  UPDATE_TYPE: "UPDATE_TYPE",
  UPDATE_DATE: "UPDATE_DATE",
  UPDATE_CATEGORY: "UPDATE_CATEGORY",
  SET_FORM_ERRORS: "SET_FORM_ERRORS",
  CLEAR: "CLEAR",
} as const;

export type ExpenseFormActionType =
  | { type: typeof ExpenseAction.UPDATE_DESCRIPTION; payload: string }
  | { type: typeof ExpenseAction.UPDATE_AMOUNT; payload: string }
  | {
      type: typeof ExpenseAction.UPDATE_TYPE;
      payload: (typeof EXPENSE_TYPE)[keyof typeof EXPENSE_TYPE] | null;
    }
  | { type: typeof ExpenseAction.UPDATE_DATE; payload: Date }
  | { type: typeof ExpenseAction.UPDATE_CATEGORY; payload: string | null }
  | {
      type: typeof ExpenseAction.SET_FORM_ERRORS;
      payload: ExpenseFormErrorState;
    }
  | { type: typeof ExpenseAction.CLEAR };

export type ExpenseFormErrorState = {
  dateError: string | null;
  amountError: string | null;
  categoryError: string | null;
  descriptionError: string | null;
};

export type ExpenseFormState = {
  formData: DisplayExpense;
  errors: ExpenseFormErrorState;
};

// Data persistence type
export type Expense = ExpenseItem & { isEdit: boolean };

// Display-only type (used in selectors)
export type DisplayExpense = Omit<Expense, "date"> & { date: Date };
