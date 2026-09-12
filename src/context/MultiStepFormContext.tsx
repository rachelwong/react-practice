import { GENDER_OPTIONS } from "@/constants";
import {
  FORM_STEP_ID,
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
import {
  getNumPreviousYears,
  isOver18,
  isValidDateString,
} from "@/utils/DateTimeUtils";
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
  canProceed: boolean;
  canGoBack: boolean;
  yearValues: string[];
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

  const isCurrentStepDataValidToProceed = (): boolean => {
    if (state.step === FORM_STEP_ID.ACCOUNT) {
      return (
        !!state.formData.email &&
        !!state.formData.password &&
        !state.formData.emailError &&
        !state.formData.passwordError
      );
    }
    if (state.step === FORM_STEP_ID.PROFILE) {
      let dateOfBirthNotEmpty = Object.values(state.formData.dateOfBirth).every(
        (x) => !!x,
      );
      console.log(
        "dateOfBirthNotEmpty",
        dateOfBirthNotEmpty,
        Object.values(state.formData.dateOfBirth),
      );

      return (
        dateOfBirthNotEmpty &&
        !!state.formData.name &&
        !state.formData.dateOfBirthError &&
        !state.formData.nameError
      );
    }
    return true; // Review step
  };

  const totalSteps = MULTI_FORM_STEPS.length;
  const canProceed =
    MULTI_FORM_STEPS.indexOf(state.step) + 1 < totalSteps &&
    isCurrentStepDataValidToProceed();
  const canGoBack = !!MULTI_FORM_STEPS.indexOf(state.step);

  const validateEmail = (val: string) => {
    if (!validEmail.test(val)) {
      dispatch({
        type: MultiStepFormActionType.SET_EMAIL_ERROR,
        payload: "Invalid email. Please try again",
      });
    }
  };

  const validatePassword = (val: string) => {
    console.log("validate passworde", validPassword.test(val));
    if (!validPassword.test(val)) {
      dispatch({
        type: MultiStepFormActionType.SET_PASSWORD_ERROR,
        payload:
          "Valid password is more than 8 chars long, at least 1 capital, 1 number and 1 symbol.",
      });
      return;
    }
    dispatch({
      type: MultiStepFormActionType.SET_PASSWORD_ERROR,
      payload: null,
    });
    return;
  };

  const validateName = (val: string) => {
    if (!validName.test(val)) {
      dispatch({
        type: MultiStepFormActionType.SET_NAME_ERROR,
        payload: "Invalid name. Please try again",
      });
      return;
    }
  };

  const onChangeName = (val: string) => {
    dispatch({ type: MultiStepFormActionType.SET_NAME_ERROR, payload: null });
    dispatch({ type: MultiStepFormActionType.UPDATE_NAME, payload: val });
  };

  const onChangeEmail = (val: string) => {
    dispatch({ type: MultiStepFormActionType.SET_EMAIL_ERROR, payload: null });
    dispatch({ type: MultiStepFormActionType.UPDATE_EMAIL, payload: val });
  };

  const onChangePassword = (val: string) => {
    dispatch({ type: MultiStepFormActionType.UPDATE_PASSWORD, payload: val });
  };

  const onChangeGender = (val: string) => {
    dispatch({ type: MultiStepFormActionType.UPDATE_GENDER, payload: val });
  };

  const onFormSubmit = () => {};

  const genderOptions = convertForSelect(GENDER_OPTIONS);

  const validateDateOfBirth = () => {
    const dobStr = `${state.formData.dateOfBirth.day}/${state.formData.dateOfBirth.month}/${state.formData.dateOfBirth.year}`;
    console.log(
      "validate dob",
      dobStr,
      "is over 18",
      isOver18({ dateOfBirth: dobStr }),
      "is valid date",
      isValidDateString({ date: dobStr }),
    );
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
    let dayVal = day?.padStart(2, "0") || state.formData.dateOfBirth.day;
    let monthVal = month || state.formData.dateOfBirth.month;
    let yearVal = year || state.formData.dateOfBirth.year;

    dispatch({
      type: MultiStepFormActionType.UPDATE_DOB,
      payload: {
        day: dayVal,
        month: monthVal,
        year: yearVal,
      },
    });

    if (!!dayVal && !!monthVal && !!yearVal) {
      validateDateOfBirth();
    }
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

  const yearValues = getNumPreviousYears(30).map((x) => x.toString());

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
        canProceed,
        canGoBack,
        yearValues,
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
