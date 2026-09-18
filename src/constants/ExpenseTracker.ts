export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Salary",
  "Other",
] as const;

export const EXPENSE_TYPE = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
};

// AND logic (multi-select)
export const EXPENSE_TIME_FILTER = {
  ALL: "All time",
  TODAY: "Today",
  LAST_WEEK: "Last week",
  LAST_MONTH: "Last Month",
};
