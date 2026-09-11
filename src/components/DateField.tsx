import { twoDigitMonths } from "@/constants";
import { convertForSelect } from "@/utils";
import { Field, FieldLabel } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface DateFieldProps {
  // day?: string;
  month?: string;
  year?: string;
  onDayChange?: () => void;
  onMonthChange?: (value: string) => void;
  onYearChange?: (value: string) => void;
  label?: string;
  yearValues?: string[];
  error?: string | null; // TODO
}

const DateField = ({
  // day, // TODO
  month,
  year,
  // onDayChange, // TODO
  onMonthChange,
  onYearChange,
  yearValues,
  label,
  error,
}: DateFieldProps) => {
  const monthsValues = convertForSelect(twoDigitMonths);
  const yearsValues = yearValues?.length ? convertForSelect(yearValues) : [];

  return (
    <div className="date-field">
      <FieldLabel>{label && "Date"}</FieldLabel>
      <div className="grid grid-cols-3 gap-4">
        {onMonthChange && (
          <Field>
            <FieldLabel htmlFor="checkout-exp-month-ts6">Month</FieldLabel>
            <Select
              items={monthsValues}
              value={month}
              onValueChange={(value: string | null) => {
                if (value) {
                  onMonthChange(value);
                }
              }}
            >
              <SelectTrigger id="checkout-exp-month-ts6">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {monthsValues.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
        {!!yearValues?.length && onYearChange && (
          <Field>
            <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Year</FieldLabel>
            <Select
              items={yearsValues}
              value={year}
              onValueChange={(value: string | null) => {
                if (value) {
                  onYearChange(value);
                }
              }}
            >
              <SelectTrigger id="checkout-7j9-exp-year-f59">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {yearsValues.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        )}
      </div>
      {!!error && (
        <p className="mt-2 text-xs text-red-900 text-left">{error}</p>
      )}
    </div>
  );
};

export default DateField;
