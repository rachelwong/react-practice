import {
  addMonths,
  addYears,
  eachMonthOfInterval,
  format,
  getYear,
  startOfYear,
  subYears,
} from "date-fns";

const currentYearStart = startOfYear(new Date()); // Jan 1st of current year
const currentYearEndMonth = addMonths(currentYearStart, 11); // Dec 1st of current year

const monthsArray = eachMonthOfInterval({
  start: currentYearStart, // January 1st
  end: currentYearEndMonth, // December 1st
});

export const twoDigitMonths = monthsArray.map((date) => format(date, "MM"));

const currentDate = new Date(); // Current year is 2026

const previousThreeYears = [1, 2, 3].map((amount) =>
  getYear(subYears(currentDate, amount)),
);

// 2. Get the next 3 years: [2027, 2028, 2029]
const nextThreeYears = [1, 2, 3].map((amount) =>
  getYear(addYears(currentDate, amount)),
);

// get the previous and next three years from this year
export const threeYearRange = [
  ...previousThreeYears,
  currentYearStart.getFullYear(),
  ...nextThreeYears,
].sort((a, b) => a - b);
