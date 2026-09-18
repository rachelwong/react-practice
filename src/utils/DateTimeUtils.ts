import { DateTimeFormat } from "@/constants";
import {
  differenceInYears,
  format,
  getYear,
  isAfter,
  isMatch,
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

// checks the string is a real calendar date in dd/MM/yyyy (rejects 31/02/2020, 29/02/2023, etc.)
export const isValidDateString = ({
  date,
  dateFormat = DateTimeFormat.DMY,
}: {
  date: string;
  dateFormat?: string;
}): boolean => isMatch(date, dateFormat);

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
