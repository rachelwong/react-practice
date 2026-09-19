import { filteredTotalExpenses } from "@/context/expenseSelector";
import { useExpenseSelector } from "@/context/expenseStore";
import {
  addMilliseconds,
  differenceInDays,
  isFuture,
  isPast,
  isToday,
} from "date-fns";
import { useState } from "react";

const msPerWeek = 1000 * 60 * 60 * 24 * 7; // milliseconds per week

// see /docs/unit-cost-break-even.md for a simple explanation on how this works

export const BREAKEVEN_STATUS = {
  TODAY: "TODAY",
  PAST: "PAST",
  FUTURE: "FUTURE",
  NO_INVESTMENT: "NO_INVESTMENT",
};

const useUnitCostTracker = () => {
  // filteredTotalExpenses is (totalCredit - totalDebit); investment spend is tracked
  // as DEBIT, so flip the sign to get a positive investment amount
  const rawFilteredTotal = useExpenseSelector(filteredTotalExpenses);
  const filteredTotal = rawFilteredTotal === 0 ? 0 : -rawFilteredTotal;
  const [numPerWeek, setNumPerWeek] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());

  // result
  const [breakEvenDate, setBreakEvenDate] = useState<Date | null>(null);

  const onNumberOfUnitsPerWeek = (e: string) => {
    if (isNaN(Number(e))) {
      return;
    }
    if (!Number.isInteger(Number(e))) {
      return;
    }
    setNumPerWeek(e);
  };

  const onUnitPrice = (e: string) => {
    if (isNaN(Number(e))) {
      return;
    }
    if (!Number.isInteger(Number(e))) {
      return;
    }
    setUnitPrice(e);
  };

  const onStartDate = (e: Date) => {
    setStartDate(e);
  };

  const onChangeInvestTotal = (e: string) => {
    if (isNaN(Number(e))) {
      return;
    }
  };
  const onSubmit = () => {
    if (
      filteredTotal === 0 ||
      Number(numPerWeek) === 0 ||
      Number(unitPrice) === 0
    ) {
      setBreakEvenDate(null);
      return;
    }

    const numWeeksToBreakEven =
      Number(filteredTotal) / (Number(numPerWeek) * Number(unitPrice));

    // Rounding up to 2 decimal places
    // integer number of weeks overstates the real length
    // i.e. you can have 1/2 or 1/3 of a week
    const roundedUpNumWeeksToBreakEven =
      Math.ceil(numWeeksToBreakEven * 100) / 100;

    const breakEvenDate = addMilliseconds(
      startDate,
      roundedUpNumWeeksToBreakEven * msPerWeek,
    );
    setBreakEvenDate(breakEvenDate);
  };

  const onReset = () => {
    setBreakEvenDate(null);
    setStartDate(new Date());
    setUnitPrice("");
    setNumPerWeek("");
  };

  const getBreakEventStatus = () => {
    if (!breakEvenDate) {
      return BREAKEVEN_STATUS.NO_INVESTMENT;
    }
    if (isToday(breakEvenDate)) {
      return BREAKEVEN_STATUS.TODAY;
    }
    if (isPast(breakEvenDate)) {
      return BREAKEVEN_STATUS.PAST;
    }
    if (isFuture(breakEvenDate)) {
      return BREAKEVEN_STATUS.FUTURE;
    }
  };

  // counts number of weeks from startDate to today
  // Math.max clamps down any possiblity for negative week calculation
  // (i.e someone choosing a future date as the start date)
  const weeksElapsed = Math.max(
    0,
    Math.ceil(differenceInDays(new Date(), startDate) / 7),
  );

  return {
    filteredTotal,
    numPerWeek,
    unitPrice,
    startDate,
    breakEvenDate,
    weeksElapsed,
    status: getBreakEventStatus(),
    onChangeInvestTotal,
    onNumberOfUnitsPerWeek,
    onUnitPrice,
    onStartDate,
    onSubmit,
    onReset,
  };
};

export default useUnitCostTracker;
