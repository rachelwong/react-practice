import { CART_ACTION, type CartItem } from "@/types/Cart";
import { CurrencyFormatter } from "@/utils";
import { useReducer } from "react";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: typeof CART_ACTION.ADD_ITEM; payload: CartItem }
  | { type: typeof CART_ACTION.REMOVE_ITEM; payload: string } // string id
  | { type: typeof CART_ACTION.REMOVE_ALL_ID; payload: string } // string id
  | { type: typeof CART_ACTION.CLEAR_CART };

const initialState: CartState = { items: [] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case CART_ACTION.ADD_ITEM:
      return {
        items: [...state.items, action.payload],
      };
    case CART_ACTION.REMOVE_ITEM:
      // find first cart item with matching id
      const index = state.items.findIndex((item) => item.id === action.payload);
      return { items: state.items.splice(index, 1) };
    case CART_ACTION.REMOVE_ALL_ID:
      return {
        items: state.items.filter((x) => x.id !== action.payload),
      };
    case CART_ACTION.CLEAR_CART:
    default:
      return { items: [] };
  }
}

const useCart = (): {
  cartItems: CartItem[];
  invoiceTotal: string;
  addItemToCart: (item: CartItem) => void;
  clearCart: () => void;
  removeItemFromCart: (id: string) => void;
  removeAllId: (id: string) => void;
} => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const invoiceAmount = state.items.reduce((acc, cur) => {
    return acc + cur.price;
  }, 0);

  const formattedInvoiceAmount = CurrencyFormatter.format(invoiceAmount);

  const addItemToCart = (item: CartItem): void => {
    dispatch({ type: CART_ACTION.ADD_ITEM, payload: item });
  };

  const clearCart = (): void => {
    dispatch({ type: CART_ACTION.CLEAR_CART });
  };

  const removeItemFromCart = (id: string): void => {
    const index = state.items.findIndex((item) => item.id === id);
    if (index === -1) {
      // TODO can add error state
      return;
    }
    dispatch({ type: CART_ACTION.REMOVE_ITEM, payload: id });
  };

  // Remove all cart items with matching id
  const removeAllId = (id: string): void => {
    const index = state.items.findIndex((item) => item.id === id);

    // Unlikely case scenario, potentially can remove
    if (index === -1) {
      return;
    }
    dispatch({ type: CART_ACTION.REMOVE_ALL_ID, payload: id });
  };

  return {
    cartItems: state.items,
    invoiceTotal: formattedInvoiceAmount,
    addItemToCart,
    removeItemFromCart,
    removeAllId,
    clearCart,
  };
};

export default useCart;
