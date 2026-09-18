import type { EXPENSE_TYPE } from "@/constants/ExpenseTracker";

export interface ExpenseItem {
  id: string; // uuid
  description: string;
  amount: string; // cents in integers
  type: (typeof EXPENSE_TYPE)[keyof typeof EXPENSE_TYPE] | null;
  date: string; // dd-mm-yyyy no timezone
  category: string | null; // null;
}

export const ExpenseAction = {
  UPDATE_DESCRIPTION: "UPDATE_DESCRIPTION",
  UPDATE_AMOUNT: "UPDATE_AMOUNT",
  UPDATE_TYPE: "UPDATE_TYPE",
  UPDATE_DATE: "UPDATE_DATE",
  UPDATE_CATEGORY: "UPDATE_CATEGORY",
  SET_DATE_ERROR: "SET_DATE_ERROR",
  SET_AMOUNT_ERROR: "SET_AMOUNT_ERROR",
  SET_CATEGORY_ERROR: "SET_CATEGORY_ERROR",
  SET_TYPE_ERROR: "SET_TYPE_ERROR",
} as const;

export type ExpenseFormActionType =
  | { type: typeof ExpenseAction.UPDATE_DESCRIPTION; payload: string }
  | { type: typeof ExpenseAction.UPDATE_AMOUNT; payload: string }
  | {
      type: typeof ExpenseAction.UPDATE_TYPE;
      payload: (typeof EXPENSE_TYPE)[keyof typeof EXPENSE_TYPE] | null;
    }
  | { type: typeof ExpenseAction.UPDATE_DATE; payload: string }
  | { type: typeof ExpenseAction.UPDATE_CATEGORY; payload: string | null }
  | { type: typeof ExpenseAction.SET_DATE_ERROR; payload: string | null }
  | { type: typeof ExpenseAction.SET_AMOUNT_ERROR; payload: string | null };

type ExpenseFormErrorState = {
  dateError: string | null;
  amountError: string | null;
};

export type ExpenseFormState = {
  formData: ExpenseItem;
  errors: ExpenseFormErrorState;
};
