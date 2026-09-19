import ExpenseFilter from "@/components/ExpenseFilter";
import ExpenseItem from "@/components/ExpenseItem";
import ExpenseTrackerForm from "@/components/ExpenseTrackerForm";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import UnitCostTracker from "@/components/UnitCostTracker";
import { EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import {
  clearAllExpenses,
  deleteExpense,
  onEditExpense,
} from "@/context/expenseReducer";
import { filteredExpenses } from "@/context/expenseSelector";
import { useExpenseDispatch, useExpenseSelector } from "@/context/expenseStore";
import { CurrencyFormatter } from "@/utils";
import classNames from "classnames";
import { Gift, Lightbulb, Trash } from "lucide-react";

const ExpenseTracker = () => {
  const dispatch = useExpenseDispatch();
  const expensesList = useExpenseSelector(filteredExpenses);
  const { categoryFilter, timeFilter } = useExpenseSelector(
    (state) => state.expenses,
  );

  const filtered: boolean = !!categoryFilter || !!timeFilter.length;

  const totalCredit = expensesList
    .filter((x) => x.type === EXPENSE_TYPE.CREDIT)
    .reduce((acc, cur) => {
      return (acc += Number(cur.amount));
    }, 0);

  const totalDebit = expensesList
    .filter((x) => x.type === EXPENSE_TYPE.DEBIT)
    .reduce((acc, cur) => {
      return (acc += Number(cur.amount));
    }, 0);

  const total = totalCredit - totalDebit;

  return (
    <Layout
      heading={
        <>
          <h3>Expense tracker</h3>
          <p>
            Original brief from{" "}
            <a
              href="https://www.reactgrind.com/problems/expense-tracker-react"
              target="_blank"
            >
              https://www.reactgrind.com/problems/expense-tracker-react
            </a>
          </p>
          <ul>
            <li>Debit = removing money</li>
            <li>Credit = adding money</li>
          </ul>
        </>
      }
    >
      <div className="flex relative flex-col w-full h-full gap-y-4">
        <ExpenseTrackerForm />
        <ExpenseFilter />
        {!expensesList.length && (
          <div className="w-full h-auto justify-start items-center p-3 bg-neutral-200">
            <span>
              No expenses{" "}
              {filtered
                ? `with filters: ${[...timeFilter, categoryFilter].join(", ")}: '' }`
                : ""}
            </span>
          </div>
        )}
        {!!expensesList.length && (
          <div className="flex flex-col justify-end items-start w-full h-auto gap-y-3">
            <ul className="flex flex-col justify-start items-start w-full h-auto p-2 border-1 border-neutral-900">
              {expensesList.map((expense, index) => (
                <li className="w-full h-auto" key={`${expense.id}`}>
                  <ExpenseItem
                    item={expense}
                    index={index}
                    onDelete={(id: string) => dispatch(deleteExpense(id))}
                    onEdit={(id: string) => dispatch(onEditExpense(id))}
                  />
                </li>
              ))}
            </ul>
            <div className="flex flex-row items-center justify-start gap-x-4">
              <p
                className={classNames("font-extrabold text-lg", {
                  "text-red-500": total < 0,
                  "text-green-500": total > 0,
                  "text-neutral-500": total === 0,
                })}
              >
                {filtered ? "Subtotal" : "Total"}:{" "}
                <span>{CurrencyFormatter.format(total)}</span>
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => dispatch(clearAllExpenses())}
              >
                <Trash />
                Clear all
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full h-auto relative gap-y-6 items-start justify-start my-4 bg-neutral-100 p-4">
        <div className="unit-cost__intro text-left flex flex-col gap-y-3">
          <h3 className="flex flex-row items-center justify-start gap-x-2 text-xl font-extrabold text-slate-700">
            <Gift />
            <span>
              Extension: When will my at-home coffee investment break even?
            </span>
          </h3>
          <p className="text-sm">
            Using the total from the expense tracker above, below section
            calculate <strong>when</strong> an at-home coffee brewing investment
            will break even using:
          </p>
          <ul className="list-disc block relative pl-8 text-sm">
            <li>total expenses amount (your investment)</li>
            <li>
              a provided start date (date when all expenses have been accounted
              for and you will never buy more coffee accessories)
            </li>
            <li>Today's date (end date)</li>
            <li>average market price for a medium coffee in Australia</li>
            <li>average number of coffees per calendar week</li>
          </ul>
          <button
            className="hover:cursor-pointer bg-amber-100 p-3 w-full h-full flex flex-row justify-start gap-x-4 align-start"
            onClick={() => {
              window.location.href = "/docs/unit-cost-break-even.md";
            }}
          >
            <Lightbulb />
            <span>
              Click here for a simple explanation of how the above is computed
            </span>
          </button>
        </div>
        <hr className="border-1 border-slate-300 w-full h-0" />
        <UnitCostTracker />
      </div>
    </Layout>
  );
};

export default ExpenseTracker;
