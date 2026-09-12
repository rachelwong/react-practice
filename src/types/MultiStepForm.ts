import type { GENDER } from "@/constants";

export const FORM_STEP_ID = {
  ACCOUNT: "ACCOUNT",
  PROFILE: "PROFILE",
  REVIEW: "REVIEW",
} as const;

export const MULTI_FORM_STEPS = [
  FORM_STEP_ID.ACCOUNT,
  FORM_STEP_ID.PROFILE,
  FORM_STEP_ID.REVIEW,
];

export type MultiStepFormData = {
  email: string; // account
  password: string; // account
  name: string; // profile
  dateOfBirth: string;
  gender?: (typeof GENDER)[keyof typeof GENDER];
};

export type MultiStepFormError = {
  emailError: string | null; // basic email validation
  passwordError: string | null; // must be over 8 characters with numbers, at least 1 capital and 1 symbol
  nameError: string | null; // alphabets, spaces, apostrophes only
  dateOfBirthError: string | null; // must be over 18 as of today
};

export type MultiStepFormState = {
  step: (typeof FORM_STEP_ID)[keyof typeof FORM_STEP_ID];
  formData: MultiStepFormData & MultiStepFormError;
};

export const MultiStepFormActionType = {
  UPDATE_EMAIL: "UPDATE_EMAIL",
  UPDATE_PASSWORD: "UPDATE_PASSWORD",
  UPDATE_NAME: "UPDATE_NAME",
  UPDATE_DOB: "UPDATE_DOB",
  UPDATE_GENDER: "UPDATE_GENDER",
  SET_EMAIL_ERROR: "SET_EMAIL_ERROR",
  SET_PASSWORD_ERROR: "SET_PASSWORD_ERROR",
  SET_NAME_ERROR: "SET_NAME_ERROR",
  SET_DOB_ERROR: "SET_DOB_ERROR",
} as const;

export type MultiStepFormAction =
  | {
      type: typeof MultiStepFormActionType.UPDATE_EMAIL;
      payload: string;
    }
  | {
      type: typeof MultiStepFormActionType.UPDATE_PASSWORD;
      payload: string;
    }
  | {
      type: typeof MultiStepFormActionType.UPDATE_NAME;
      payload: string;
    }
  | {
      type: typeof MultiStepFormActionType.UPDATE_DOB;
      payload: string;
    }
  | {
      type: typeof MultiStepFormActionType.UPDATE_GENDER;
      payload: string;
    }
  | {
      type: typeof MultiStepFormActionType.SET_EMAIL_ERROR;
      payload: string | null;
    }
  | {
      type: typeof MultiStepFormActionType.SET_PASSWORD_ERROR;
      payload: string | null;
    }
  | {
      type: typeof MultiStepFormActionType.SET_NAME_ERROR;
      payload: string | null;
    }
  | {
      type: typeof MultiStepFormActionType.SET_DOB_ERROR;
      payload: string | null;
    };
