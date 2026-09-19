import { EXPENSE_TYPE } from "@/constants/ExpenseTracker";
import useUnitCostTracker from "@/hooks/useUnitCostTracker";
import UnitCostResult from "@/UnitCostResult";
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
    filteredTotal: total,
    onNumberOfUnitsPerWeek,
    onUnitPrice,
    onStartDate,
    onSubmit,
    onReset,
  } = useUnitCostTracker();

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
              type {EXPENSE_TYPE.DEBIT}
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
        <UnitCostResult
          status={status}
          numPerWeek={numPerWeek}
          unitPrice={unitPrice}
          breakEvenDate={breakEvenDate}
          weeksElapsed={weeksElapsed}
          formattedStartDate={formattedStartDate}
        />
      </div>
    </div>
  );
};

export default UnitCostTracker;
