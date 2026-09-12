import { GENDER_OPTIONS } from "@/constants";
import {
  MULTI_FORM_STEP_ACTION,
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
import { isOver18, isValidDateString } from "@/utils/DateTimeUtils";
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
  onChangeDateOfBirth: ({
    day,
    month,
    year,
  }: {
    day?: string;
    month?: string;
    year?: string;
  }) => void;
  validateDateOfBirth: () => void;
  genderOptions: SelectOptionType[];
  onChangeStep: (
    val: (typeof MULTI_FORM_STEP_ACTION)[keyof typeof MULTI_FORM_STEP_ACTION],
  ) => void;
};

const initialState = {
  step: MULTI_FORM_STEPS[0],
  formData: {
    email: "",
    name: "",
    password: "",
    dateOfBirth: {
      day: "",
      month: "",
      year: "",
    },
    gender: "",
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

  const validateDateOfBirth = () => {
    const dobStr = `${state.formData.dateOfBirth.day}/${state.formData.dateOfBirth.month}/${state.formData.dateOfBirth.year}`;

    // check if invalid date || empty date
    if (!isValidDateString({ date: dobStr })) {
      dispatch({
        type: MultiStepFormActionType.SET_DOB_ERROR,
        payload: "Invalid date of birth provided. Please try again.",
      });
      return;
    }
    // check if under 18
    else if (!isOver18({ dateOfBirth: dobStr })) {
      dispatch({
        type: MultiStepFormActionType.SET_DOB_ERROR,
        payload: "You must be over the age of 18 in order to sign up.",
      });
      return;
    }
    dispatch({
      type: MultiStepFormActionType.SET_DOB_ERROR,
      payload: null,
    });
    return;
  };

  const onChangeDateOfBirth = ({
    day,
    month,
    year,
  }: {
    day?: string;
    month?: string;
    year?: string;
  }): void => {
    dispatch({
      type: MultiStepFormActionType.SET_DOB_ERROR,
      payload: null,
    });
    dispatch({
      type: MultiStepFormActionType.UPDATE_DOB,
      payload: {
        day: day || state.formData.dateOfBirth.day,
        month: month || state.formData.dateOfBirth.month,
        year: year || state.formData.dateOfBirth.year,
      },
    });
    validateDateOfBirth();
  };

  const onChangeStep = (
    val: (typeof MULTI_FORM_STEP_ACTION)[keyof typeof MULTI_FORM_STEP_ACTION],
  ) => {
    let currentStep = state.step;
    let currentStepIndex = MULTI_FORM_STEPS.indexOf(currentStep);
    let totalStepCount = MULTI_FORM_STEPS.length;
    if (
      val === MULTI_FORM_STEP_ACTION.NEXT &&
      currentStepIndex + 1 <= totalStepCount
    ) {
      let nextStep = MULTI_FORM_STEPS[currentStepIndex + 1];
      dispatch({
        type: MultiStepFormActionType.UPDATE_STEP,
        payload: nextStep,
      });
    } else if (val === MULTI_FORM_STEP_ACTION.BACK && currentStepIndex > 0) {
      const prevStep = MULTI_FORM_STEPS[currentStepIndex - 1];
      dispatch({
        type: MultiStepFormActionType.UPDATE_STEP,
        payload: prevStep,
      });
    }
    return;
  };

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
        onChangeDateOfBirth,
        validateDateOfBirth,
        genderOptions,
        onChangeStep,
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
