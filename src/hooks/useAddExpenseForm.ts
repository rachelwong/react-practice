import { DateTimeFormat } from "@/constants";
import { EXPENSE_CATEGORIES, EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import {
  ExpenseAction,
  type DisplayExpense,
  type ExpenseFormActionType,
  type ExpenseFormState,
} from "@/types/Expenses";
import { convertForSelect } from "@/utils";
import { isFutureDate } from "@/utils/DateTimeUtils";
import { useReducer } from "react";

function reducer(
  state: ExpenseFormState,
  action: ExpenseFormActionType,
): ExpenseFormState {
  switch (action.type) {
    case ExpenseAction.UPDATE_DESCRIPTION:
      return {
        ...state,
        formData: { ...state.formData, description: action.payload },
      };
    case ExpenseAction.UPDATE_AMOUNT:
      return {
        ...state,
        formData: { ...state.formData, amount: action.payload },
      };
    case ExpenseAction.UPDATE_TYPE:
      return {
        ...state,
        formData: { ...state.formData, type: action.payload },
      };
    case ExpenseAction.UPDATE_DATE:
      return {
        ...state,
        formData: { ...state.formData, date: action.payload },
      };
    case ExpenseAction.UPDATE_CATEGORY:
      return {
        ...state,
        formData: { ...state.formData, category: action.payload },
      };
    case ExpenseAction.SET_DATE_ERROR:
      return {
        ...state,
        errors: { ...state.errors, dateError: action.payload },
      };
    case ExpenseAction.SET_AMOUNT_ERROR:
      return {
        ...state,
        errors: { ...state.errors, amountError: action.payload },
      };
    case ExpenseAction.CLEAR:
      return initialState;
    default:
      return initialState;
  }
}

const initialState = {
  formData: {
    id: "", // uuid
    description: "",
    amount: "",
    type: EXPENSE_TYPE.CREDIT,
    date: new Date(),
    category: "",
    isEdit: false,
  },
  errors: {
    dateError: null,
    amountError: null,
  },
};

const useAddExpenseForm = ({
  existingFormData,
}: {
  existingFormData?: DisplayExpense;
}) => {
  const startingData = {
    ...initialState,
    ...(existingFormData && { formData: existingFormData }),
  };

  const [state, dispatch] = useReducer(reducer, startingData);

  const onChangeType = (
    val: (typeof EXPENSE_TYPE)[keyof typeof EXPENSE_TYPE] | null,
  ) => {
    dispatch({
      type: ExpenseAction.UPDATE_TYPE,
      payload: val,
    });
  };

  const onChangeCategory = (val: string | null) => {
    dispatch({
      type: ExpenseAction.UPDATE_CATEGORY,
      payload: val,
    });
  };

  const onChangeDescription = (val: string) => {
    dispatch({ type: ExpenseAction.UPDATE_DESCRIPTION, payload: val });
  };

  // Must not be in the future from today
  // must not be null/empty
  const onChangeDate = (val: Date) => {
    dispatch({
      type: ExpenseAction.SET_DATE_ERROR,
      payload: null,
    });

    if (isFutureDate({ date: val, format: DateTimeFormat.DMY })) {
      dispatch({
        type: ExpenseAction.SET_AMOUNT_ERROR,
        payload: "Expense date cannot be in the future.",
      });
    }
    dispatch({
      type: ExpenseAction.UPDATE_DATE,
      payload: val,
    });
  };

  // must be valid number
  // must not be negative number
  const onChangeAmount = (val: string) => {
    dispatch({
      type: ExpenseAction.SET_AMOUNT_ERROR,
      payload: null,
    });

    if (isNaN(Number(val))) {
      dispatch({
        type: ExpenseAction.SET_AMOUNT_ERROR,
        payload: "Must be valid monetary amount",
      });
    }
    if (Number(val) < 0) {
      dispatch({
        type: ExpenseAction.SET_AMOUNT_ERROR,
        payload: "Cannot be negative amount",
      });
    }
    dispatch({ type: ExpenseAction.UPDATE_AMOUNT, payload: val });
  };

  const onClearForm = () => {
    dispatch({ type: ExpenseAction.CLEAR });
  };

  const { errors, formData } = state;
  const categoryEmpty = !state.formData.category
    ? "Category is required"
    : null;
  const typeEmpty = !state.formData.type ? "Type is required" : null;

  const errorMessage = [
    ...Object.values(errors),
    typeEmpty,
    categoryEmpty,
  ].filter((x): x is string => !!x);

  const isError = !!errorMessage.length;

  const isAnyEmpty = Object.values(formData).some((x) => !x);

  const categoryOptions = convertForSelect(EXPENSE_CATEGORIES);
  const typeOptions = convertForSelect(Object.values(EXPENSE_TYPE));

  return {
    formData,
    errorMessage,
    isError,
    isAnyEmpty,
    categoryOptions,
    typeOptions,
    onClearForm,
    onChangeType,
    onChangeCategory,
    onChangeDescription,
    onChangeDate,
    onChangeAmount,
  };
};

export default useAddExpenseForm;
