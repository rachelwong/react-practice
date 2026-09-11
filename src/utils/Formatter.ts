import { intervalToDuration } from "date-fns";

export const CurrencyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
});

// small utils to convert any array into label/value objects for dropdown
export const convertForSelect = (values: string[] | number[]) => {
  return values.map((x: string | number) => {
    return {
      label: x.toString(),
      value: x.toString(),
    };
  });
};

export const integerToMinuteSeconds = (value: number) => {
  const { minutes = 0, seconds: secs = 0 } = intervalToDuration({
    start: 0,
    end: value * 1000,
  });
  return [minutes, secs].map((unit) => String(unit).padStart(2, "0")).join(":");
};
