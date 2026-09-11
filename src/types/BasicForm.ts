export type BasicFormData = {
  name: string;
  cardNumber: string;
  month: string;
  year: string;
  cvv: string;
  sameAddress: boolean | null;
};

export const BASIC_FORM_ACTION = {
  UPDATE_NAME: "UPDATE_NAME",
  UPDATE_CARD_NUMBER: "UPDATE_CARD_NUMBER",
  UPDATE_MONTH: "UPDATE_MONTH",
  UPDATE_YEAR: "UPDATE_YEAR",
  UPDATE_ADDRESS_CHECK: "UPDATE_ADDRESS_CHECK", // optional
  UPDATE_CVV: "UPDATE_CVV",
  SET_CARD_NUMBER_ERROR: "SET_CARD_NUMBER_ERROR",
  SET_NAME_ERROR: "SET_NAME_ERROR",
  SET_CARD_EXPIRY_ERROR: "SET_CARD_EXPIRY_ERROR",
  SET_CVV_ERROR: "SET_CVV_ERROR",
  CLEAR_FORM: "RESET",
} as const;

export type BasicFormActionType =
  | { type: typeof BASIC_FORM_ACTION.UPDATE_NAME; payload: string }
  | { type: typeof BASIC_FORM_ACTION.UPDATE_MONTH; payload: string }
  | { type: typeof BASIC_FORM_ACTION.UPDATE_YEAR; payload: string }
  | { type: typeof BASIC_FORM_ACTION.UPDATE_CVV; payload: string }
  | { type: typeof BASIC_FORM_ACTION.UPDATE_CARD_NUMBER; payload: string }
  | {
      type: typeof BASIC_FORM_ACTION.UPDATE_ADDRESS_CHECK;
      payload: boolean;
    }
  | { type: typeof BASIC_FORM_ACTION.CLEAR_FORM }
  | { type: typeof BASIC_FORM_ACTION.SET_NAME_ERROR; payload: string | null }
  | {
      type: typeof BASIC_FORM_ACTION.SET_CARD_NUMBER_ERROR;
      payload: string | null;
    }
  | { type: typeof BASIC_FORM_ACTION.SET_CVV_ERROR; payload: string | null }
  | {
      type: typeof BASIC_FORM_ACTION.SET_CARD_EXPIRY_ERROR;
      payload: string | null;
    }
  | { type: typeof BASIC_FORM_ACTION.SET_NAME_ERROR; payload: string | null };

export type BasicFormState = BasicFormData & {
  nameError: string | null;
  cardNumberError: string | null;
  expiryError: string | null;
  cvvError: string | null;
};
