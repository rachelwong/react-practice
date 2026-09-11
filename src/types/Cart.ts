export type CartItem = {
  id: string; // 'keyboard-1'
  name: string; // 'keyboard'
  price: number; // 250
};

export const CART_ACTION = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAR_CART: "CLEAR",
} as const;

export type CartActionType = (typeof CART_ACTION)[keyof typeof CART_ACTION];
