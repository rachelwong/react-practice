import { useCartSelector } from "./cartStore";

const numProductsSelected = useCartSelector(
  (state) =>
    state.availableProducts.filter((x) =>
      state.selectedProducts.some((y) => y.id.toString() === x.id.toString()),
    ).length,
);

export default numProductsSelected;
