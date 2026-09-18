import { EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import type { Expense } from "@/context/expenseReducer";
import { CurrencyFormatter } from "@/utils";
import { formatDate } from "@/utils/DateTimeUtils";
import classNames from "classnames";
import { BadgeX, Pencil } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ExpenseItemProps {
  item: Expense;
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
          <p className="w-1/4">{formatDate(item.date)}</p>
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
            {CurrencyFormatter.format(Number(item.amount))}
          </p>
        </div>
      )}

      <div className="expense-actions flex flex-row flex-nowrap gap-x-3 w-1/4 justify-end">
        <Button
          size="lg"
          variant="outline"
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
    </div>
  );
};

export default ExpenseItem;
