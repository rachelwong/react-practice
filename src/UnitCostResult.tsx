import { filteredTotalExpenses } from "./context/expenseSelector";
import { useExpenseSelector } from "./context/expenseStore";
import { BREAKEVEN_STATUS } from "./hooks/useUnitCostTracker";
import { CurrencyFormatter } from "./utils";
import { formatDate } from "./utils/DateTimeUtils";

interface UnitCostResultProps {
  status?: string;
  numPerWeek: string;
  unitPrice: string;
  breakEvenDate: Date | null;
  weeksElapsed: number;
  formattedStartDate: string;
}

const UnitCostResult = ({
  status,
  numPerWeek,
  unitPrice,
  breakEvenDate,
  weeksElapsed,
  formattedStartDate,
}: UnitCostResultProps) => {
  const total = useExpenseSelector(filteredTotalExpenses);

  // can't use useUnitCostTracker custom hook again as the state is initialised with the hook
  // so creating it again here gives a separate state and values

  const getBreakEventContent = (): { heading: string; byline: string } => {
    switch (status) {
      case BREAKEVEN_STATUS.TODAY:
        return {
          heading: "You broken even today!",
          byline: "Your investment broke even on -",
        };
      case BREAKEVEN_STATUS.PAST:
        return {
          heading:
            "All your at home coffees have already paid off your investment!",
          byline: "Your investment broke even on -",
        };
      case BREAKEVEN_STATUS.FUTURE:
        return {
          heading: "You're on your way to recouping your investment!",
          byline: "Your investment will break even on -",
        };
      case BREAKEVEN_STATUS.NO_INVESTMENT:
        return {
          heading: "You need to start investing!",
          byline: "",
        };
      default:
        return {
          heading: "",
          byline: "",
        };
    }
  };

  return (
    <div className="w-full h-full items-start justify-start flex flex-col gap-y-3">
      {breakEvenDate && getBreakEventContent().heading && (
        <>
          <h3 className="text-xl font-extrabold text-amber-500 ">
            {getBreakEventContent().heading}
          </h3>
          <p className="text-amber-500">
            {getBreakEventContent().byline}{" "}
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
              total / (Number(numPerWeek) * Number(unitPrice) * weeksElapsed),
            )}{" "}
            which comes from total investment ${total} / ({numPerWeek} coffees
            per week x {CurrencyFormatter.format(Number(unitPrice))} per coffee
            x {weeksElapsed} weeks elapsed).
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
        <p>Resubmit another start date that is in the past to recalculate. </p>
      )}
    </div>
  );
};

export default UnitCostResult;
