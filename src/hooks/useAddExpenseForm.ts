import { DateTimeFormat } from "@/constants";
import { EXPENSE_CATEGORIES, EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import {
  ExpenseAction,
  type DisplayExpense,
  type ExpenseFormActionType,
  type ExpenseFormErrorState,
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
    case ExpenseAction.SET_FORM_ERRORS:
      return {
        ...state,
        errors: { ...state.errors, ...action.payload },
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
    categoryError: null,
    descriptionError: null,
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
      type: ExpenseAction.SET_FORM_ERRORS,
      payload: {
        ...state.errors,
        categoryError: null,
      },
    });
    dispatch({
      type: ExpenseAction.UPDATE_CATEGORY,
      payload: val,
    });
  };

  const onChangeDescription = (val: string) => {
    dispatch({
      type: ExpenseAction.SET_FORM_ERRORS,
      payload: {
        ...state.errors,
        descriptionError: null,
      },
    });
    dispatch({ type: ExpenseAction.UPDATE_DESCRIPTION, payload: val });
  };

  // Must not be in the future from today
  // must not be null/empty
  const onChangeDate = (val: Date) => {
    dispatch({
      type: ExpenseAction.SET_FORM_ERRORS,
      payload: {
        ...state.errors,
        dateError: null,
      },
    });

    dispatch({
      type: ExpenseAction.UPDATE_DATE,
      payload: val,
    });

    if (
      isFutureDate({
        date: val,
        format: DateTimeFormat.DMY,
      })
    ) {
      dispatch({
        type: ExpenseAction.SET_FORM_ERRORS,
        payload: {
          ...state.errors,
          dateError: "Date cannot be in the future",
        },
      });
    }
  };

  // must be valid number
  // must not be negative number
  const onChangeAmount = (val: string) => {
    dispatch({
      type: ExpenseAction.SET_FORM_ERRORS,
      payload: {
        ...state.errors,
        amountError: null,
      },
    });

    dispatch({ type: ExpenseAction.UPDATE_AMOUNT, payload: val });
  };

  const onClearForm = () => {
    dispatch({ type: ExpenseAction.CLEAR });
  };

  const { errors, formData } = state;

  const categoryOptions = convertForSelect(EXPENSE_CATEGORIES);
  const typeOptions = convertForSelect(Object.values(EXPENSE_TYPE));

  const validateForm = (): ExpenseFormErrorState => {
    let errorState: ExpenseFormErrorState = {
      dateError: null,
      categoryError: null,
      descriptionError: null,
      amountError: null,
    };

    // DATE: no invalid date scenario
    if (
      isFutureDate({ date: state.formData.date, format: DateTimeFormat.DMY })
    ) {
      errorState.dateError = "Expense Date cannot be in the future";
    }

    // CATEGORY: no category
    if (!state.formData.category) {
      errorState.categoryError = "Category is required";
    }

    // DESCRIPTION: no description
    if (!state.formData.description.trim()) {
      errorState.descriptionError = "Description is required";
    }

    // AMOUNT: not a number, negative number, 0 number, empty
    if (
      isNaN(Number(state.formData.amount.trim())) ||
      Number(state.formData.amount) <= 0 ||
      !state.formData.amount
    ) {
      errorState.amountError = "Invalid amount";
    }

    dispatch({
      type: ExpenseAction.SET_FORM_ERRORS,
      payload: {
        ...state.errors,
        ...errorState,
      },
    });
    return errorState;
  };

  return {
    formData,
    errors,
    categoryOptions,
    typeOptions,
    onClearForm,
    onChangeType,
    onChangeCategory,
    onChangeDescription,
    onChangeDate,
    onChangeAmount,
    validateForm,
  };
};

export default useAddExpenseForm;
