import { EXPENSE_TIME_FILTER, EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import { createSelector } from "@reduxjs/toolkit";
import {
  endOfDay,
  isToday,
  isWithinInterval,
  startOfDay,
  subMonths,
  subWeeks,
} from "date-fns";
import type { Expense } from "./expenseReducer";
import type { ExpensesStoreState } from "./expenseStore";

const allExpenses = (state: ExpensesStoreState) => state.expenses.expenses;
const timeFilters = (state: ExpensesStoreState) => state.expenses.timeFilter;
const categoryFilter = (state: ExpensesStoreState) =>
  state.expenses.categoryFilter;

function isDateWithinTimeRange({
  date,
  timeRange,
}: {
  date: Date;
  timeRange: string;
}): boolean {
  const now = new Date();
  switch (timeRange) {
    case EXPENSE_TIME_FILTER.TODAY:
      return isToday(date);
    // today is included and is rolling 7 day/month not by calendar week/month
    case EXPENSE_TIME_FILTER.LAST_WEEK:
      return isWithinInterval(date, {
        start: startOfDay(subWeeks(now, 1)),
        end: endOfDay(now),
      });
    case EXPENSE_TIME_FILTER.LAST_MONTH:
      return isWithinInterval(date, {
        start: startOfDay(subMonths(now, 1)),
        end: endOfDay(now),
      });
    // return everything otherwise
    case EXPENSE_TIME_FILTER.ALL:
    default:
      return true;
  }
}

export const filteredExpenses = createSelector(
  [allExpenses, timeFilters, categoryFilter],
  (
    expenses: Expense[],
    timeFilters: string[],
    categoryFilter: string | null,
  ) => {
    return expenses.filter((expense) => {
      // no type specified, so return expense; otherwise return only the matching expense
      const matchCategory = !categoryFilter
        ? true
        : expense.category?.toLowerCase() === categoryFilter.toLowerCase();

      // no time range specified, so return expense; otherwise match any selected range
      const matchTimeRanges = !timeFilters.length
        ? true
        : timeFilters.some((timeRange) =>
            isDateWithinTimeRange({ date: expense.date, timeRange }),
          );

      return matchCategory && matchTimeRanges;
    });
  },
);

export const filteredTotalExpenses = createSelector(
  [filteredExpenses],
  (filteredExpenses: Expense[]) => {
    const totalCredit = filteredExpenses
      .filter((x) => x.type === EXPENSE_TYPE.CREDIT)
      .reduce((acc, cur) => {
        return (acc += Number(cur.amount));
      }, 0);

    const totalDebit = filteredExpenses
      .filter((x) => x.type === EXPENSE_TYPE.DEBIT)
      .reduce((acc, cur) => {
        return (acc += Number(cur.amount));
      }, 0);

    return totalCredit - totalDebit;
  },
);
