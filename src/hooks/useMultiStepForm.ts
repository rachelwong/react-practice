import { DateTimeFormat, GENDER_OPTIONS } from "@/constants";
import { alphabetOnly, validEmail, validPassword } from "@/utils";
import { isOver18, isValidDateString } from "@/utils/DateTimeUtils";
import { useEffect, useReducer } from "react";

export interface MultiStepFormContextType {
  currIndex: number;
  totalNumberOfSteps: number;
  profile: {
    name: {
      value: string;
      error: string | null;
    };
    dateOfBirth: {
      value: string;
      error: string | null;
    };
    gender: {
      value: string;
      options: string[];
    };
  };
  account: {
    email: {
      value: string;
      error: string | null;
    };
    password: {
      value: string;
      error: string | null;
    };
  };
}

const genderOptions = Object.values(GENDER_OPTIONS);

const initialState: MultiStepFormContextType = {
  currIndex: 0,
  totalNumberOfSteps: 0,
  profile: {
    name: {
      value: "",
      error: null,
    },
    dateOfBirth: {
      value: "",
      error: null,
    },
    gender: {
      value: "",
      options: genderOptions,
    },
  },
  account: {
    email: {
      value: "",
      error: null,
    },
    password: {
      value: "",
      error: null,
    },
  },
};

export type MultiStepActionType =
  | { type: "ON_CHANGE_NAME"; payload: string }
  | { type: "ON_BLUR_NAME" }
  | { type: "ON_CHANGE_EMAIL"; payload: string }
  | { type: "ON_BLUR_EMAIL" }
  | { type: "ON_CHANGE_PASSWORD"; payload: string }
  | { type: "ON_BLUR_PASSWORD" }
  | { type: "ON_CHANGE_DOB"; payload: string }
  | { type: "ON_BLUR_DOB" }
  | { type: "ON_CHANGE_GENDER"; payload: string }
  | { type: "SET_TOTAL_STEPS"; payload: number }
  | { type: "SET_DOB_ERROR"; payload: string | null }
  | { type: "SET_NAME_ERROR"; payload: string | null }
  | { type: "SET_EMAIL_ERROR"; payload: string | null }
  | { type: "SET_PASSWORD_ERROR"; payload: string | null }
  | { type: "RESET_FORM" }
  | { type: "INCREMENT_STEP" }
  | { type: "DECREMENT_STEP" };

function reducer(state: MultiStepFormContextType, action: MultiStepActionType) {
  switch (action.type) {
    case "ON_CHANGE_NAME":
      return {
        ...state,
        profile: {
          ...state.profile,
          name: {
            ...state.profile.name,
            value: action.payload,
          },
        },
      };
    case "ON_BLUR_NAME":
      return state;
    case "ON_CHANGE_EMAIL":
      return {
        ...state,
        account: {
          ...state.account,
          email: {
            ...state.account.email,
            value: action.payload,
          },
        },
      };
    case "ON_BLUR_EMAIL":
      return state;
    case "ON_CHANGE_PASSWORD":
      return {
        ...state,
        account: {
          ...state.account,
          password: {
            ...state.account.password,
            value: action.payload,
          },
        },
      };
    case "ON_BLUR_PASSWORD":
      return state;
    case "ON_CHANGE_DOB":
      return {
        ...state,
        profile: {
          ...state.profile,
          dateOfBirth: {
            ...state.profile.dateOfBirth,
            value: action.payload,
          },
        },
      };
    case "ON_CHANGE_GENDER":
      return {
        ...state,
        profile: {
          ...state.profile,
          gender: {
            ...state.profile.gender,
            value: action.payload,
          },
        },
      };
    case "SET_TOTAL_STEPS":
      return {
        ...state,
        totalNumberOfSteps: action.payload,
      };
    case "SET_DOB_ERROR":
      return {
        ...state,
        profile: {
          ...state.profile,
          dateOfBirth: {
            ...state.profile.dateOfBirth,
            error: action.payload,
          },
        },
      };
    case "SET_NAME_ERROR":
      return {
        ...state,
        profile: {
          ...state.profile,
          name: {
            ...state.profile.name,
            error: action.payload,
          },
        },
      };
    case "SET_EMAIL_ERROR":
      return {
        ...state,
        account: {
          ...state.account,
          email: {
            ...state.account.email,
            error: action.payload,
          },
        },
      };
    case "SET_PASSWORD_ERROR":
      return {
        ...state,
        account: {
          ...state.account,
          password: {
            ...state.account.password,
            error: action.payload,
          },
        },
      };
    case "INCREMENT_STEP":
      return {
        ...state,
        currIndex:
          state.currIndex + 1 === state.totalNumberOfSteps
            ? state.currIndex
            : state.currIndex + 1,
      };
    case "DECREMENT_STEP":
      return {
        ...state,
        currIndex:
          state.currIndex === 0 ? state.currIndex : state.currIndex - 1,
      };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

const useMultiStepForm = (numberOfSteps: number = 2) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const reset = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const validateName = () => {
    if (!state.profile.name.value.trim().length) {
      dispatch({ type: "SET_NAME_ERROR", payload: "Name is required" });
    } else if (!alphabetOnly.test(state.profile.name.value)) {
      dispatch({ type: "SET_NAME_ERROR", payload: "No numbers allowed" });
    } else {
      dispatch({
        type: "SET_NAME_ERROR",
        payload: null,
      });
    }
  };

  const validateDOB = (val: string) => {
    if (
      !isValidDateString({
        date: val ?? state.profile.dateOfBirth.value,
        dateFormat: DateTimeFormat.DMY,
      })
    ) {
      dispatch({ type: "SET_DOB_ERROR", payload: "Invalid date" });
    } else if (
      !isOver18({
        dateOfBirth: val ?? state.profile.dateOfBirth.value,
        dateFormat: DateTimeFormat.DMY,
      })
    ) {
      dispatch({
        type: "SET_DOB_ERROR",
        payload: "You must be over 18 years old",
      });
    } else {
      dispatch({
        type: "SET_DOB_ERROR",
        payload: null,
      });
    }
  };

  const validatePassword = () => {
    if (!state.account.password.value.trim().length) {
      dispatch({
        type: "SET_PASSWORD_ERROR",
        payload: "Password required",
      });
    } else if (!validPassword.test(state.account.password.value)) {
      dispatch({
        type: "SET_PASSWORD_ERROR",
        payload:
          "Valid password is over 8 characters long with at least 1 number, 1 capital and 1 symbol and no spaces.",
      });
    } else {
      dispatch({
        type: "SET_PASSWORD_ERROR",
        payload: null,
      });
    }
  };

  const validateEmail = () => {
    if (!state.account.email.value.trim().length) {
      dispatch({
        type: "SET_EMAIL_ERROR",
        payload: "Email required",
      });
    } else if (!validEmail.test(state.account.email.value)) {
      dispatch({
        type: "SET_EMAIL_ERROR",
        payload: "Invalid email",
      });
    } else {
      dispatch({
        type: "SET_EMAIL_ERROR",
        payload: null,
      });
    }
  };

  const onChangeName = (val: string) => {
    dispatch({
      type: "SET_NAME_ERROR",
      payload: null,
    });
    dispatch({ type: "ON_CHANGE_NAME", payload: val.trim() });
  };

  const onChangeDOB = (val: string) => {
    dispatch({
      type: "SET_DOB_ERROR",
      payload: null,
    });

    dispatch({ type: "ON_CHANGE_DOB", payload: val.trim() });
  };

  const onChangePassword = (val: string) => {
    dispatch({ type: "ON_CHANGE_PASSWORD", payload: val.trim() });
  };

  const onChangeEmail = (val: string) => {
    dispatch({ type: "ON_CHANGE_EMAIL", payload: val.trim() });
  };

  const onChangeGender = (val: string) => {
    dispatch({ type: "ON_CHANGE_GENDER", payload: val.trim() });
  };

  const incrementStep = () => {
    dispatch({ type: "INCREMENT_STEP" });
  };

  const decrementStep = () => {
    dispatch({ type: "DECREMENT_STEP" });
  };

  const { gender, ...requiredProfileFields } = state.profile;

  const isRequiredProfileStepEmpty = Object.values(requiredProfileFields)
    .map((x) => x.value)
    .some((x) => !x);

  const isProfileStepValid =
    !isRequiredProfileStepEmpty &&
    !Object.values(requiredProfileFields)
      .map((profileItem) => profileItem.error)
      .some((x) => !!x);

  const isAccountStepEmpty = Object.values(state.account)
    .map((x) => x.value)
    .some((x) => !x);

  const isAccountStepValid =
    !isAccountStepEmpty &&
    !Object.values(state.account)
      .map((accountItem) => accountItem.error)
      .some((x) => !!x);

  useEffect(() => {
    dispatch({ type: "SET_TOTAL_STEPS", payload: numberOfSteps });
  }, [numberOfSteps]);

  return {
    state,
    validateName,
    validateDOB,
    validatePassword,
    validateEmail,
    onChangeName,
    onChangeDOB,
    onChangePassword,
    onChangeEmail,
    onChangeGender,
    incrementStep,
    decrementStep,
    reset,
    isRequiredProfileStepEmpty,
    isProfileStepValid,
    isAccountStepEmpty,
    isAccountStepValid,
  };
};

export default useMultiStepForm;
