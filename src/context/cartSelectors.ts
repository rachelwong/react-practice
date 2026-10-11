import { createSelector } from "@reduxjs/toolkit";
import type { CartState } from "./cartStore";

// not useCartSelector because rule of hooks
// createSelector wants function props
// const selectedProducts = useCartSelector((state) => state.selectedProducts);
// const availableProducts = useCartSelector((state) => state.availableProducts);

const selectedProducts = (state: CartState) => state.selectedProducts;
const availableProducts = (state: CartState) => state.availableProducts;

// creates memoized selector functions that only recalculate the output if the inputs change
export const cartProducts = createSelector(
  [selectedProducts, availableProducts],
  (productIds, allProducts) => {
    return allProducts.filter((x) =>
      productIds.some((y) => y.id.toString() === x.id.toString()),
    );
  },
);

export const invoiceTotal = createSelector(
  [selectedProducts, availableProducts],
  (productIds, allProducts) => {
    return allProducts.reduce((acc, cur) => {
      const existing = productIds.find((x) => x.id === cur.id.toString());
      if (existing) {
        acc += cur.price * existing.qty;
      }
      return acc;
    }, 0);
  },
);
