import { daysOfMonth, twoDigitMonths } from "@/constants";
import { convertForSelect } from "@/utils";
import SelectField from "./SelectField";
import { FieldLabel } from "./ui/field";

interface DateFieldProps {
  day?: string;
  month?: string;
  year?: string;
  onDayChange?: (value: string) => void;
  onMonthChange?: (value: string) => void;
  onYearChange?: (value: string) => void;
  label?: string;
  yearValues?: string[];
  error?: string | null; // TODO
}

const DateField = ({
  day, // TODO
  month,
  year,
  onDayChange, // TODO
  onMonthChange,
  onYearChange,
  yearValues,
  label,
  error,
}: DateFieldProps) => {
  const monthsValues = convertForSelect(twoDigitMonths);
  const yearsValues = yearValues?.length ? convertForSelect(yearValues) : [];
  const dayValues = convertForSelect(daysOfMonth);

  return (
    <div className="date-field">
      <FieldLabel>{label && "Date"}</FieldLabel>
      <div className="grid grid-cols-3 gap-4">
        {onDayChange && day && (
          <SelectField
            label="Day"
            onChange={onDayChange}
            selectOptions={dayValues}
            value={day}
          />
        )}
        {onMonthChange && month && (
          <SelectField
            label="Month"
            onChange={onMonthChange}
            selectOptions={monthsValues}
            value={month}
          />
        )}
        {!!yearValues?.length && onYearChange && year && (
          <SelectField
            label="Year"
            onChange={onYearChange}
            selectOptions={yearsValues}
            value={year}
          />
        )}
      </div>
      {!!error && (
        <p className="mt-2 text-xs text-red-900 text-left">{error}</p>
      )}
    </div>
  );
};

export default DateField;
