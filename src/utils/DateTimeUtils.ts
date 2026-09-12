import { DateTimeFormat } from "@/constants";
import { differenceInYears, getYear, isMatch, parse, subYears } from "date-fns";

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
