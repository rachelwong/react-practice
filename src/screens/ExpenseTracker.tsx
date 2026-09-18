import ExpenseFilter from "@/components/ExpenseFilter";
import ExpenseItem from "@/components/ExpenseItem";
import ExpenseTrackerForm from "@/components/ExpenseTrackerForm";
import Layout from "@/components/Layout";
import { EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import { deleteExpense, onEditExpense } from "@/context/expenseReducer";
import { useExpenseDispatch, useExpenseSelector } from "@/context/expenseStore";
import { CurrencyFormatter } from "@/utils";
import classNames from "classnames";

const ExpenseTracker = () => {
  const { expenses } = useExpenseSelector((state) => state.expenses);
  const dispatch = useExpenseDispatch();

  const totalCredit = expenses
    .filter((x) => x.type === EXPENSE_TYPE.CREDIT)
    .reduce((acc, cur) => {
      return (acc += Number(cur.amount));
    }, 0);

  const totalDebit = expenses
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
        <ExpenseFilter onFilterType={() => {}} onFilterTime={() => {}} />
        {!expenses.length && (
          <div className="w-full h-auto justify-start items-center p-3 bg-neutral-200">
            <span>No expenses</span>
          </div>
        )}
        {!!expenses.length && (
          <div className="flex flex-col justify-end items-start w-full h-auto gap-y-3">
            <ul className="flex flex-col justify-start items-start w-full h-auto p-2 border-1 border-neutral-900 gap-y-3">
              {expenses.map((expense, index) => (
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
                "text-red-500": total <= 0,
                "text-green-500": total > 0,
              })}
            >
              Total: <span>{CurrencyFormatter.format(total)}</span>
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExpenseTracker;
