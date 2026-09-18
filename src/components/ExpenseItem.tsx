import type { Expense } from "@/context/expenseReducer";
import { CurrencyFormatter } from "@/utils";
import { formatDate } from "@/utils/DateTimeUtils";
import classNames from "classnames";
import { BadgeX, Pencil } from "lucide-react";
import { Button } from "./ui/button";

interface ExpenseItemProps {
  item: Expense;
  index: number;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

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
          <span className="w-1/2">{item.description}</span>
          <p className="w-1/4">{formatDate(item.date)}</p>
          <p className="w-1/4">
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
