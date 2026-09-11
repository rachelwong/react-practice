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
