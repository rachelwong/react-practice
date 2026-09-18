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
    errorMessage,
    onChangeType,
    onChangeCategory,
    onChangeDescription,
    onChangeDate,
    onChangeAmount,
    onClearForm,
  } = useAddExpenseForm();

  const { description, amount, type, date, category } = formData;

  const dispatch = useExpenseDispatch();

  const onSubmitForm = () => {
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
        <Input
          required
          placeholder="Expense description"
          value={description}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChangeDescription(e.target.value);
          }}
        />
        <SelectField
          selectOptions={categoryOptions}
          value={category}
          onChange={(e) => {
            onChangeCategory(e);
          }}
          label={"Category"}
        />
        <SelectField
          selectOptions={typeOptions}
          value={type}
          onChange={(e) => {
            onChangeType(e);
          }}
          label={"Type"}
        />
        <DatePicker label="Date" value={date} onChange={onChangeDate} />
        <Input
          placeholder="Amount"
          value={amount}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChangeAmount(e.target.value);
          }}
        />
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
      {!!errorMessage.length && (
        <ul>
          {errorMessage.map((error) => (
            <li className="text-sm text-red-500 my-1" key={error}>
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default ExpenseTrackerForm;
