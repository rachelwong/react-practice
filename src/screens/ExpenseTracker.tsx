import ExpenseFilter from "@/components/ExpenseFilter";
import ExpenseItem from "@/components/ExpenseItem";
import ExpenseTrackerForm from "@/components/ExpenseTrackerForm";
import Layout from "@/components/Layout";
import UnitCostTracker from "@/components/UnitCostTracker";
import { EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import { deleteExpense, onEditExpense } from "@/context/expenseReducer";
import { filteredExpenses } from "@/context/expenseSelector";
import { useExpenseDispatch, useExpenseSelector } from "@/context/expenseStore";
import { CurrencyFormatter } from "@/utils";
import classNames from "classnames";
import { Gift } from "lucide-react";

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
            will break even using
          </p>
          <ul className="list-disc block relative pl-8 text-sm">
            <li>total expenses amount</li>
            <li>
              a provided start date (date when all expenses have been accounted
              for)
            </li>
            <li>Today's date (end date)</li>
            <li>average market price for a medium coffee in Australia</li>
            <li>average number of coffees per calendar week</li>
          </ul>
          <p className="text-sm">
            NOTE: average number of coffees per calendar week will be normalised
            (rounded-up) for half weeks (i.e. average 5 coffees per week
            starting mid-week will normalise to the cost of 3 coffees for that
            week).
          </p>
          <strong className="text-sm">
            Also assumes that the user will not purchase any coffees externally.
          </strong>
        </div>
        <UnitCostTracker />
      </div>
    </Layout>
  );
};

export default ExpenseTracker;
