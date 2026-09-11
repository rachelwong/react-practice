import {
  BASIC_FORM_ACTION,
  type BasicFormActionType,
  type BasicFormState,
} from "@/types/BasicForm";
import { validCardNumber, validCVV, validName } from "@/utils";
import { isBefore, isValid, parse, startOfMonth } from "date-fns";
import { useReducer } from "react";

const initialState = {
  name: "",
  cardNumber: "",
  month: "",
  year: "",
  cvv: "",
  nameError: null,
  cardNumberError: null,
  expiryError: null,
  cvvError: null,
  sameAddress: null,
};

const formReducer = (
  state: BasicFormState,
  action: BasicFormActionType,
): BasicFormState => {
  switch (action.type) {
    case BASIC_FORM_ACTION.UPDATE_ADDRESS_CHECK:
      return {
        ...state,
        sameAddress: action.payload,
      };
    case BASIC_FORM_ACTION.UPDATE_MONTH:
      return {
        ...state,
        month: action.payload,
      };
    case BASIC_FORM_ACTION.UPDATE_CARD_NUMBER:
      return {
        ...state,
        cardNumber: action.payload,
      };
    case BASIC_FORM_ACTION.UPDATE_YEAR:
      return {
        ...state,
        year: action.payload,
      };

    case BASIC_FORM_ACTION.UPDATE_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case BASIC_FORM_ACTION.UPDATE_CVV:
      return {
        ...state,
        cvv: action.payload,
      };
    case BASIC_FORM_ACTION.SET_NAME_ERROR:
      return {
        ...state,
        nameError: action.payload,
      };
    case BASIC_FORM_ACTION.SET_CARD_NUMBER_ERROR:
      return {
        ...state,
        cardNumberError: action.payload,
      };
    case BASIC_FORM_ACTION.SET_CVV_ERROR:
      return {
        ...state,
        cvvError: action.payload,
      };
    case BASIC_FORM_ACTION.SET_CARD_EXPIRY_ERROR:
      return {
        ...state,
        expiryError: action.payload,
      };
    case BASIC_FORM_ACTION.CLEAR_FORM:
      return initialState;
    default:
      return state;
  }
};

const useBasicForm = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const clearForm = () => {
    dispatch({ type: BASIC_FORM_ACTION.CLEAR_FORM });
  };

  const hasEmptyFields: boolean =
    !state.name ||
    !state.cardNumber ||
    !state.month ||
    !state.year ||
    !state.cvv;

  const hasError: boolean =
    !!state.nameError ||
    !!state.cardNumberError ||
    !!state.cvvError ||
    !!state.expiryError;

  const disableSubmit = hasError || hasEmptyFields;

  const isFormError = hasError;

  const validateName = (value: string) => {
    if (!value.length) {
      dispatch({
        type: BASIC_FORM_ACTION.SET_NAME_ERROR,
        payload: "You must enter the card holder name",
      });
      return;
    }
    // only alphabets, apostrophes, hyphens
    else if (!validName.test(value)) {
      dispatch({
        type: BASIC_FORM_ACTION.SET_NAME_ERROR,
        payload:
          "Only alphabets, apostrophes and hyphens allowed for valid names.",
      });
      return;
    }
    dispatch({
      type: BASIC_FORM_ACTION.SET_NAME_ERROR,
      payload: null,
    });
    return;
  };

  const onChangeName = (value: string) => {
    dispatch({
      type: BASIC_FORM_ACTION.UPDATE_NAME,
      payload: value,
    });
    validateName(value.trim());
  };

  const validateCardNumber = (value: string) => {
    if (!value.length) {
      dispatch({
        type: BASIC_FORM_ACTION.SET_CARD_NUMBER_ERROR,
        payload: "You must enter the card number",
      });
      return;
    } else if (!validCardNumber.test(value)) {
      dispatch({
        type: BASIC_FORM_ACTION.SET_CARD_NUMBER_ERROR,
        payload: "Only 16 digits are allowed for valid card numbers.",
      });
      return;
    }
    dispatch({
      type: BASIC_FORM_ACTION.SET_CARD_NUMBER_ERROR,
      payload: null,
    });
    return;
  };

  const onChangeCVVnumber = (value: string) => {
    dispatch({
      type: BASIC_FORM_ACTION.UPDATE_CVV,
      payload: value,
    });
  };

  const validateCVVnumber = (value: string) => {
    if (!value.length) {
      dispatch({
        type: BASIC_FORM_ACTION.SET_CVV_ERROR,
        payload: "You must enter a CVV number",
      });
      return;
    } else if (!validCVV.test(value)) {
      dispatch({
        type: BASIC_FORM_ACTION.SET_CVV_ERROR,
        payload: "Only 3 digits are allowed for valid CVV.",
      });
      return;
    }
    dispatch({
      type: BASIC_FORM_ACTION.SET_CVV_ERROR,
      payload: null,
    });
    return;
  };

  const onChangeCardNumber = (value: string) => {
    dispatch({
      type: BASIC_FORM_ACTION.UPDATE_CARD_NUMBER,
      payload: value,
    });
  };

  const onChangeSameAddress = (value: boolean) => {
    dispatch({
      type: BASIC_FORM_ACTION.UPDATE_ADDRESS_CHECK,
      payload: value,
    });
  };

  const validateDate = (
    year: string = state.year,
    month: string = state.month,
  ): void => {
    if (!year?.length || !month?.length) {
      dispatch({
        type: BASIC_FORM_ACTION.SET_CARD_EXPIRY_ERROR,
        payload: null,
      });
      return;
    }

    const dateString = `${month}/${year}`;
    const parsedDate = parse(dateString, "MM/yyyy", new Date());

    if (!isValid(parsedDate)) {
      dispatch({
        type: BASIC_FORM_ACTION.SET_CARD_EXPIRY_ERROR,
        payload: "Select a valid month and year date for your card",
      });
      return;
    } else if (isBefore(parsedDate, startOfMonth(new Date()))) {
      dispatch({
        type: BASIC_FORM_ACTION.SET_CARD_EXPIRY_ERROR,
        payload: "Card must not be expired.",
      });
      return;
    }
    dispatch({
      type: BASIC_FORM_ACTION.SET_CARD_EXPIRY_ERROR,
      payload: null,
    });
    return;
  };

  const onChangeYear = (value: string) => {
    dispatch({
      type: BASIC_FORM_ACTION.UPDATE_YEAR,
      payload: value,
    });
    validateDate(value, state.month);
  };

  const onChangeMonth = (value: string) => {
    dispatch({
      type: BASIC_FORM_ACTION.UPDATE_MONTH,
      payload: value,
    });
    validateDate(state.year, value);
  };

  return {
    state,
    clearForm,
    validateName,
    onChangeName,
    validateCardNumber,
    onChangeCardNumber,
    onChangeSameAddress,
    validateCVVnumber,
    onChangeCVVnumber,
    onChangeYear,
    onChangeMonth,
    validateDate,
    disableSubmit,
    isFormError,
  };
};

export default useBasicForm;
