import { EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import { filteredTotalExpenses } from "@/context/expenseSelector";
import { useExpenseSelector } from "@/context/expenseStore";
import useUnitCostTracker, {
  BREAKEVEN_STATUS,
} from "@/hooks/useUnitCostTracker";
import { CurrencyFormatter } from "@/utils";
import { formatDate } from "@/utils/DateTimeUtils";
import { CircleCheck } from "lucide-react";
import type { ChangeEvent } from "react";
import DatePicker from "./DatePicker";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const UnitCostTracker = () => {
  const {
    status,
    startDate,
    numPerWeek,
    unitPrice,
    breakEvenDate,
    weeksElapsed,
    onNumberOfUnitsPerWeek,
    onUnitPrice,
    onStartDate,
    onSubmit,
    onReset,
  } = useUnitCostTracker();

  const total = useExpenseSelector(filteredTotalExpenses);

  const formattedStartDate = formatDate(startDate);
  return (
    <div className="w-full h-auto flex flex-row justify-between items-stretch gap-x-6">
      <div className="flex flex-col items-start justify-start align-start gap-y-4 w-1/2 h-full">
        <div>
          <h2 className="text-xl font-extrabold text-slate-700 my-0">
            Your starting investment is {CurrencyFormatter.format(total)}
          </h2>
          {!total && (
            <span className="text-xs">
              Note: You can add more investment by adding expense items above of
              type {EXPENSE_TYPE.CREDIT}
            </span>
          )}
        </div>
        <Input
          placeholder="Number of coffees"
          value={numPerWeek}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onNumberOfUnitsPerWeek(e.target.value);
          }}
        />
        <Input
          required
          placeholder="Avg Price of coffee in AUD$"
          value={unitPrice}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onUnitPrice(e.target.value);
          }}
        />
        <div className="w-full flex flex-row align-center justify-start">
          <DatePicker
            label={"Start date"}
            onChange={(date: Date) => onStartDate(date)}
            value={startDate}
          />
        </div>
        <div className="w-full flex flex-row align-center justify-start gap-x-4">
          <Button
            size="lg"
            disabled={!numPerWeek || !unitPrice || !total}
            className=""
            onClick={() => onSubmit()}
          >
            <CircleCheck />
            Calculate
          </Button>
          <Button
            size="lg"
            className=""
            variant="outline"
            onClick={() => onReset()}
          >
            Reset form
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start w-1/2 h-full">
        <div className="w-full h-full items-start justify-start flex flex-col gap-y-3">
          {status === BREAKEVEN_STATUS.NO_INVESTMENT && (
            <>
              <h3 className="text-xl font-extrabold text-slate-500 ">
                You need to start investing!
              </h3>
            </>
          )}
          {status === BREAKEVEN_STATUS.TODAY && breakEvenDate && (
            <>
              <h3 className="text-xl font-extrabold text-amber-500 ">
                You broken even today!
              </h3>
              <p className="text-amber-500">
                Your investment broke even on -{" "}
                <strong>{formatDate(breakEvenDate)}</strong>
              </p>
            </>
          )}
          {status === BREAKEVEN_STATUS.FUTURE && breakEvenDate && (
            <>
              <h3 className="text-xl font-extrabold text-red-500">
                You're on your way to recouping your investment!
              </h3>
              <p className="text-red-500">
                Your investment will break even on -{" "}
                <strong>{formatDate(breakEvenDate)}</strong>
              </p>
            </>
          )}
          {status === BREAKEVEN_STATUS.PAST && breakEvenDate && (
            <>
              <h3 className="text-xl font-extrabold text-green-500">
                All your at home coffees have already paid off your investment!
              </h3>
              <p className="text-green-500">
                Your investment broke even on -{" "}
                <strong>{formatDate(breakEvenDate)}</strong>
              </p>
            </>
          )}
          {status !== BREAKEVEN_STATUS.NO_INVESTMENT && weeksElapsed > 0 && (
            <>
              <p>
                Average price per coffee you made at home since{" "}
                <strong>{formattedStartDate}</strong> came to{" "}
                {CurrencyFormatter.format(
                  total /
                    (Number(numPerWeek) * Number(unitPrice) * weeksElapsed),
                )}{" "}
                which comes from total investment ${total} / ({numPerWeek}{" "}
                coffees per week x {CurrencyFormatter.format(Number(unitPrice))}{" "}
                per coffee x {weeksElapsed} weeks elapsed).
              </p>
              <p>
                The total cost if you had bought the coffee from a shop instead
                since <strong>{formattedStartDate}</strong> comes to{" "}
                <strong>
                  {Number(numPerWeek) * Number(unitPrice) * weeksElapsed}
                </strong>{" "}
                which comes from {numPerWeek} coffees x{" "}
                {CurrencyFormatter.format(Number(unitPrice))} per coffee x{" "}
                {weeksElapsed} number of weeks.
              </p>
            </>
          )}
          {status !== BREAKEVEN_STATUS.NO_INVESTMENT && weeksElapsed < 0 && (
            <p>
              Resubmit another start date that is in the past to
              recalculate.{" "}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitCostTracker;
