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
};

const useUnitCostTracker = () => {
  const filteredTotal = useExpenseSelector(filteredTotalExpenses);
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
    const numWeeksToBreakEven =
      Number(filteredTotal) / (Number(numPerWeek) * Number(unitPrice));

    const breakEvenDate = addMilliseconds(
      startDate,
      numWeeksToBreakEven * msPerWeek,
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
      return null;
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

  const weeksElapsed = Math.ceil(differenceInDays(new Date(), startDate) / 7);

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
