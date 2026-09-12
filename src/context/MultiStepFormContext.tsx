import { GENDER_OPTIONS } from "@/constants";
import {
  MULTI_FORM_STEPS,
  MultiStepFormActionType,
  type MultiStepFormState,
} from "@/types/MultiStepForm";
import type { SelectOptionType } from "@/types/Select";
import {
  convertForSelect,
  validEmail,
  validName,
  validPassword,
} from "@/utils";
import { createContext, useContext, useReducer, type ReactNode } from "react";
import multiStepFormReducer from "./MultiStepFormReducer";

export type MultiStepFormContextValue = {
  state: MultiStepFormState;
  onChangePassword: (val: string) => void;
  onChangeEmail: (val: string) => void;
  onChangeName: (val: string) => void;
  onFormSubmit: () => void;
  validatePassword: (val: string) => void;
  validateEmail: (val: string) => void;
  validateName: (val: string) => void;
  onChangeGender: (val: string) => void;
  genderOptions: SelectOptionType[];
};

const initialState = {
  step: MULTI_FORM_STEPS[0],
  formData: {
    email: "",
    name: "",
    password: "",
    dateOfBirth: "",
    gender: undefined,
    emailError: null,
    passwordError: null,
    nameError: null,
    dateOfBirthError: null,
  },
};

const MultiStepFormContext = createContext<MultiStepFormContextValue>(
  {} as MultiStepFormContextValue,
);

export function MultiStepFormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(multiStepFormReducer, initialState);

  const validateEmail = (val: string) => {
    if (!validEmail.test(val)) {
      dispatch({
        type: MultiStepFormActionType.SET_EMAIL_ERROR,
        payload: "Invalid email. Please try again",
      });
    }
  };

  const validatePassword = (val: string) => {
    if (!validPassword.test(val)) {
      dispatch({
        type: MultiStepFormActionType.SET_PASSWORD_ERROR,
        payload: "Invalid password. Please try again",
      });
    }
  };

  const validateName = (val: string) => {
    if (!validName.test(val)) {
      dispatch({
        type: MultiStepFormActionType.SET_NAME_ERROR,
        payload: "Invalid name. Please try again",
      });
    }
  };

  const onChangeName = (val: string) => {
    dispatch({ type: MultiStepFormActionType.SET_NAME_ERROR, payload: null });
    dispatch({ type: MultiStepFormActionType.UPDATE_NAME, payload: val });
    validateName(val);
  };

  const onChangeEmail = (val: string) => {
    dispatch({ type: MultiStepFormActionType.SET_EMAIL_ERROR, payload: null });
    dispatch({ type: MultiStepFormActionType.UPDATE_EMAIL, payload: val });
    validateEmail(val);
  };

  const onChangePassword = (val: string) => {
    dispatch({
      type: MultiStepFormActionType.SET_PASSWORD_ERROR,
      payload: null,
    });
    dispatch({ type: MultiStepFormActionType.UPDATE_PASSWORD, payload: val });
    validatePassword(val);
  };

  const onChangeGender = (val: string) => {
    dispatch({ type: MultiStepFormActionType.UPDATE_GENDER, payload: val });
  };

  const onFormSubmit = () => {};

  const genderOptions = convertForSelect(GENDER_OPTIONS);
  return (
    <MultiStepFormContext.Provider
      value={{
        state,
        onChangeEmail,
        onChangePassword,
        onFormSubmit,
        validatePassword,
        validateEmail,
        validateName,
        onChangeGender,
        onChangeName,
        genderOptions,
      }}
    >
      {children}
    </MultiStepFormContext.Provider>
  );
}

export const useMultiStepForm = () => {
  const context = useContext(MultiStepFormContext);
  if (context === undefined) {
    throw new Error(
      "useMultiStepForm must be used within a MultiStepFormProvider",
    );
  }
  return context;
};
