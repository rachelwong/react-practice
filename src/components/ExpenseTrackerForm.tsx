import { addExpense } from "@/context/expenseReducer";
import { useExpenseDispatch } from "@/context/expenseStore";
import useAddExpenseForm from "@/hooks/useAddExpenseForm";
import classNames from "classnames";
import { LayersPlus } from "lucide-react";
import type { ChangeEvent } from "react";
import DatePicker from "./DatePicker";
import SelectField from "./SelectField";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const ExpenseTrackerForm = ({ className }: { className?: string }) => {
  const {
    formData,
    categoryOptions,
    typeOptions,
    onChangeType,
    onChangeCategory,
    onChangeDescription,
    onChangeDate,
    onChangeAmount,
    onClearForm,
    errors,
    validateForm,
  } = useAddExpenseForm({});

  const { description, amount, type, date, category } = formData;

  const { dateError, amountError, categoryError, descriptionError } = errors;

  const dispatch = useExpenseDispatch();

  const onSubmitForm = () => {
    const validationResult = validateForm();
    // do not progress to submission if there are any errors
    if (Object.values(validationResult).some((x) => !!x)) {
      return;
    }
    dispatch(
      addExpense({
        id: "",
        description,
        amount,
        type,
        date,
        category,
        isEdit: false,
      }),
    );
    onClearForm();
  };

  return (
    <div
      className={classNames(
        "flex flex-col items-start justify-start gap-y-2",
        className,
      )}
    >
      <h2 className="font-extrabold text-lg text-left">Create an expense</h2>
      <div className="w-full h-auto border-1 border-neutral-500 p-2 flex flex-row items-end justify-between gap-x-4">
        <div className="flex flex-col items-start justify-start w-300 gap-y-1">
          <Input
            required
            placeholder="Expense description"
            value={description}
            aria-invalid={!!descriptionError || undefined}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChangeDescription(e.target.value);
            }}
          />
          {!!descriptionError && (
            <p className="text-xs text-red-500 text-left">{descriptionError}</p>
          )}
        </div>
        <SelectField
          placeholder="Select one"
          selectOptions={categoryOptions}
          value={category}
          onChange={(e) => {
            onChangeCategory(e);
          }}
          label={"Category"}
          isError={!!categoryError}
          errorMessage={categoryError || undefined}
        />
        <SelectField
          selectOptions={typeOptions}
          value={type}
          onChange={(e) => {
            if (!e) {
              return;
            }
            onChangeType(e);
          }}
          label={"Type"}
        />
        <DatePicker
          label="Date"
          value={date}
          onChange={onChangeDate}
          isError={!!dateError}
          errorMessage={dateError || undefined}
        />
        <div className="relative flex flex-col items-start justify-start w-300 gap-y-1">
          <Input
            placeholder="Amount"
            value={amount}
            aria-invalid={!!amountError || undefined}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChangeAmount(e.target.value);
            }}
          />
          {!!amountError && (
            <p className="text-red-500 text-xs text-left">{amountError}</p>
          )}
        </div>
        {/* Validate on submit click. onChange to clear all errors */}
        <Button
          variant="default"
          size="lg"
          onClick={() => {
            onSubmitForm();
          }}
        >
          <LayersPlus />
          <span>Create</span>
        </Button>
      </div>
    </div>
  );
};
export default ExpenseTrackerForm;
