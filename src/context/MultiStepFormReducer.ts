import {
  MultiStepFormActionType,
  type MultiStepFormAction,
  type MultiStepFormState,
} from "@/types/MultiStepForm";

function multiStepFormReducer(
  state: MultiStepFormState,
  action: MultiStepFormAction,
): MultiStepFormState {
  switch (action.type) {
    case MultiStepFormActionType.UPDATE_EMAIL:
      return {
        ...state,
        formData: {
          ...state.formData,
          email: action.payload,
        },
      };
    case MultiStepFormActionType.UPDATE_PASSWORD:
      return {
        ...state,
        formData: {
          ...state.formData,
          password: action.payload,
        },
      };
    case MultiStepFormActionType.UPDATE_NAME:
      return {
        ...state,
        formData: {
          ...state.formData,
          name: action.payload,
        },
      };
    case MultiStepFormActionType.UPDATE_DOB:
      return {
        ...state,
        formData: {
          ...state.formData,
          dateOfBirth: {
            day: action.payload.day,
            month: action.payload.month,
            year: action.payload.year,
          },
        },
      };
    case MultiStepFormActionType.UPDATE_GENDER:
      return {
        ...state,
        formData: {
          ...state.formData,
          gender: action.payload,
        },
      };
    case MultiStepFormActionType.SET_EMAIL_ERROR:
      return {
        ...state,
        formData: {
          ...state.formData,
          emailError: action.payload,
        },
      };
    case MultiStepFormActionType.SET_PASSWORD_ERROR:
      return {
        ...state,
        formData: {
          ...state.formData,
          passwordError: action.payload,
        },
      };
    case MultiStepFormActionType.SET_NAME_ERROR:
      return {
        ...state,
        formData: {
          ...state.formData,
          nameError: action.payload,
        },
      };
    case MultiStepFormActionType.SET_DOB_ERROR:
      return {
        ...state,
        formData: {
          ...state.formData,
          dateOfBirthError: action.payload,
        },
      };
    default:
      return state;
  }
}

export default multiStepFormReducer;
