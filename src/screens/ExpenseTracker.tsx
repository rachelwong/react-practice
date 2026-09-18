import ExpenseFilter from "@/components/ExpenseFilter";
import ExpenseItem from "@/components/ExpenseItem";
import ExpenseTrackerForm from "@/components/ExpenseTrackerForm";
import Layout from "@/components/Layout";
import { deleteExpense } from "@/context/expenseReducer";
import { useExpenseDispatch, useExpenseSelector } from "@/context/expenseStore";

const ExpenseTracker = () => {
  const { expenses } = useExpenseSelector((state) => state.expenses);
  const dispatch = useExpenseDispatch();

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
        {!expenses.length && (
          <div className="w-full h-auto justify-start items-center p-3 bg-neutral-200">
            <span>No expenses</span>
          </div>
        )}
        {!!expenses.length && (
          <ul className="flex flex-col justify-start items-start w-full h-auto p-2 border-1 border-neutral-900 gap-y-3">
            {expenses.map((expense, index) => (
              <li className="w-full h-auto" key={`${expense.id}`}>
                <ExpenseItem
                  item={expense}
                  index={index}
                  onDelete={(id: string) => dispatch(deleteExpense(id))}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default ExpenseTracker;
