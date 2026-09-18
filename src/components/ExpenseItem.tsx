import classNames from "classnames";
import { BadgeX, Pencil } from "lucide-react";
import { Button } from "./ui/button";

const ExpenseItem = () => {
  return (
    <div
      className={classNames(
        "bg-neutral-100 w-full h-auto flex flex-row justify-between items-center gap-x-4 p-3",
        {},
      )}
    >
      <div className="flex flex-row justify-start align-center w-2/3">
        <span className="w-1/2">Description </span>
        <p className="w-1/4">02/03/2026</p>
        <p className="w-1/4">$1000</p>
      </div>
      <div className="expense-actions flex flex-row flex-nowrap gap-x-3 w-1/4 justify-end">
        <Button size="lg" variant="outline" onClick={() => {}}>
          <Pencil />
          <span>Edit</span>
        </Button>
        <Button size="lg" variant="destructive" onClick={() => {}}>
          <BadgeX />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
};

export default ExpenseItem;
