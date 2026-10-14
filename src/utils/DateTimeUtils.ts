import { DateTimeFormat } from "@/constants";
import {
  differenceInYears,
  format,
  getYear,
  intervalToDuration,
  isAfter,
  isValid,
  parse,
  startOfDay,
  startOfToday,
  subYears,
} from "date-fns";

// formats a Date using the browser's local timezone, dd/MM/yyyy by default
export const formatDate = (
  date: Date,
  dateFormat: string = DateTimeFormat.DMY,
): string => format(date, dateFormat);

// checks the string is a valid date based on date format provided
export const isValidDateString = ({
  date,
  dateFormat = DateTimeFormat.DMY,
}: {
  date: string;
  dateFormat?: string;
}): boolean => {
  const parsedDate = parse(date, dateFormat, new Date());
  if (!isValid(parsedDate)) return false;
  // date-fns is lenient: "12/08/19" parses as year 0019 with "yyyy".
  // Formatting it back and comparing rejects anything that isn't an exact match.
  return format(parsedDate, dateFormat) === date;
};

// Date of birth is over 18 as of today or a provdied date
export const isOver18 = ({
  dateOfBirth,
  dateFormat = DateTimeFormat.DMY,
  asOfDate,
}: {
  dateOfBirth: string;
  dateFormat?: string;
  asOfDate?: Date | string;
}): boolean => {
  if (!!asOfDate && typeof asOfDate === "string") {
    asOfDate = parse(asOfDate, dateFormat, new Date());
  }
  const providedDate = parse(dateOfBirth, dateFormat, new Date());
  return differenceInYears(asOfDate || new Date(), providedDate) >= 18;
};

// x number of years *including* this year
export const getNumPreviousYears = (howManyYearsAgo: number): number[] => {
  const currentDate = new Date();
  return Array.from(Array(howManyYearsAgo).keys()).map((amount) =>
    getYear(subYears(currentDate, amount)),
  );
};

// is the date provide in the future
export const isFutureDate = ({
  date,
  format = DateTimeFormat.DMY,
}: {
  date: string | Date;
  // keyof typeof DateTimeFormat -> "DMY"
  // no as const here
  format?: (typeof DateTimeFormat)[keyof typeof DateTimeFormat];
}) => {
  if (typeof date !== "string") {
    return isAfter(startOfDay(date), startOfDay(new Date()));
  }
  const parsedDate = parse(date, format, new Date());
  return isAfter(parsedDate, startOfToday());
};

// format integer number of milliseconds to mm:ss clock format
export const formatMsDuration = (ms: number) => {
  const duration = intervalToDuration({ start: 0, end: ms });

  // Use padStart to ensure seconds are always two digits (e.g., "05" instead of "5")
  const minutes = duration.minutes || 0;
  const seconds = String(duration.seconds || 0).padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export const padLeadingZero = (v: string) => (v ? v.padStart(2, "0") : v);
