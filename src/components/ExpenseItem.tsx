import { EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import { onUpdateExpense } from "@/context/expenseReducer";
import { useExpenseDispatch } from "@/context/expenseStore";
import useAddExpenseForm from "@/hooks/useAddExpenseForm";
import type { DisplayExpense } from "@/types/Expenses";
import { CurrencyFormatter } from "@/utils";
import { formatDate } from "@/utils/DateTimeUtils";
import classNames from "classnames";
import { BadgeX, Ban, Pencil, SaveCheck } from "lucide-react";
import DatePicker from "./DatePicker";
import SelectField from "./SelectField";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ExpenseItemProps {
  item: DisplayExpense;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const getBadgeStyle = (category: string): string => {
  switch (category.toLowerCase()) {
    case "food":
      return "bg-green-100 text-green-600";
    case "transport":
      return "bg-sky-100 text-sky-400 border-1 border-sky-700";
    case "shopping":
      return "bg-purple-100 text-purple-700 border-1 border-purple-700";
    case "bills":
      return "bg-pink-100 text-pink-700 border-1 border-pink-700";
    case "salary":
      return "bg-amber-100 text-amber-700 border-1 border-amber-700";
    case "other":
    default:
      return "bg-grey-100 text-grey-800 border-1 border-grey-800";
  }
};

const ExpenseItem = ({ item, index, onEdit, onDelete }: ExpenseItemProps) => {
  const {
    formData,
    errors,
    categoryOptions,
    typeOptions,
    onChangeType,
    onChangeCategory,
    onChangeDescription,
    onChangeDate,
    onChangeAmount,
    onClearForm,
    validateForm,
  } = useAddExpenseForm({ existingFormData: { ...item } });

  const dispatch = useExpenseDispatch();

  const { id, description, amount, type, date, category } = formData;

  const { dateError, amountError, categoryError, descriptionError } = errors;

  const onSubmitEdit = () => {
    const validationResult = validateForm();
    // do not progress to submission if there are any errors
    if (Object.values(validationResult).some((x) => !!x)) {
      return;
    }
    dispatch(
      onUpdateExpense({
        id,
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
        "w-full h-auto flex flex-row justify-between items-center gap-x-4 p-3",
        { "bg-neutral-100": index % 2 === 0 },
      )}
    >
      {!item.isEdit && (
        <div className="flex flex-row justify-start align-center w-2/3">
          <span className="w-1/4">{item.description}</span>
          {/* Date coming back as ISOstring requires reformatting */}
          <p className="w-1/4">{formatDate(new Date(item.date))}</p>
          <div className="w-1/4 block relative">
            <Badge
              className={`${!!item.category ? getBadgeStyle(item.category) : ""}`}
            >
              {item.category}
            </Badge>
          </div>
          <p
            className={classNames("w-1/4", {
              "text-green-500": item.type === EXPENSE_TYPE.CREDIT,
              "text-red-500": item.type === EXPENSE_TYPE.DEBIT,
            })}
          >
            {item.type === EXPENSE_TYPE.DEBIT ? "-" : ""}
            {CurrencyFormatter.format(Number(item.amount))}
          </p>
        </div>
      )}

      {item.isEdit && (
        <>
          <div className="flex flex-row justify-between items-end w-2/3 gap-x-4">
            <div className="flex flex-col items-start justify-start w-200 gap-y-1">
              <Input
                value={description}
                placeholder="Description"
                aria-invalid={!!descriptionError || undefined}
                onChange={(e) => {
                  onChangeDescription(e.target.value);
                }}
              />
              {!!descriptionError && (
                <p className="text-xs text-red-500 text-left">
                  {descriptionError}
                </p>
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
            <div className="relative flex flex-col items-start justify-start w-200 gap-y-1">
              <Input
                value={amount}
                placeholder="amount"
                aria-invalid={!!amountError || undefined}
                onChange={(e) => {
                  onChangeAmount(e.target.value);
                }}
              />
              {!!amountError && (
                <p className="text-red-500 text-xs text-left">{amountError}</p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="expense-actions flex flex-row flex-nowrap w-1/4 gap-x-3 justify-end items-end">
        {item.isEdit ? (
          <div className="flex flex-row flex-nowrap gap-x-3 w-full h-full items-end">
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                onEdit(item.id);
              }}
            >
              <Ban />
              <span>Cancel</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                onSubmitEdit();
              }}
            >
              <SaveCheck />
              Save
            </Button>
          </div>
        ) : (
          <div className="flex flex-row flex-nowrap gap-x-3 w-full h-full items-end">
            <Button
              size="lg"
              variant="outline"
              className="mx-4"
              disabled={item.isEdit} // don't edit again if already editing
              onClick={() => {
                onEdit(item.id);
              }}
            >
              <Pencil />
              <span>Edit</span>
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={() => onDelete(item.id)}
            >
              <BadgeX />
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseItem;
