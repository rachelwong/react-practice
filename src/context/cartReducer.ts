import getProducts from "@/services/getProducts";
import type { Product } from "@/services/types/ProductResponse";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  qty: number;
}

export interface CartState {
  status: "idle" | "loading" | "succeeded" | "rejected";
  error: string | null;
  availableProducts: Product[];
  selectedProducts: CartItem[];
  drawerStatus: boolean;
}

const initialCartState: CartState = {
  status: "idle",
  error: null,
  availableProducts: [],
  selectedProducts: [],
  drawerStatus: false,
};

export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const products = await getProducts({});
  return products;
});

export const cartSlice = createSlice({
  name: "cart",
  initialState: initialCartState,
  reducers: {
    removeItemEntirely: (state, action: PayloadAction<string>) => {
      const existing = state.selectedProducts.some(
        (x) => x.id === action.payload,
      );

      if (!existing) {
        return state;
      }
      return {
        ...state,
        selectedProducts: [
          ...state.selectedProducts.filter((x) => x.id !== action.payload),
        ],
      };
    },
    toggleDrawer: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload === undefined) {
        return {
          ...state,
          drawerStatus: !state.drawerStatus,
        };
      }
      return {
        ...state,
        drawerStatus: action.payload,
      };
    },
    updateQty: (state, action: PayloadAction<{ id: string; qty: number }>) => {
      const existing = state.selectedProducts.some(
        (x) => x.id === action.payload.id,
      );
      if (!existing) {
        return state;
      }

      if (action.payload.qty === 0) {
        return {
          ...state,
          selectedProducts: [
            ...state.selectedProducts.filter((x) => x.id !== action.payload.id),
          ],
        };
      }

      return {
        ...state,
        selectedProducts: [
          ...state.selectedProducts.map((x) => {
            if (x.id === action.payload.id) {
              return { ...x, qty: Number(action.payload.qty) };
            }
            return x;
          }),
        ],
      };
    },
    addToCart: (state, action: PayloadAction<string>) => {
      const existing = state.selectedProducts.some(
        (x) => x.id === action.payload,
      );
      if (!existing) {
        return {
          ...state,
          selectedProducts: [
            ...state.selectedProducts,
            {
              id: action.payload,
              qty: 1,
            },
          ],
        };
      }
      return {
        ...state,
        selectedProducts: [
          ...state.selectedProducts.map((item) => {
            if (item.id === action.payload) {
              return {
                ...item,
                qty: item.qty + 1,
              };
            }
            return item;
          }),
        ],
      };
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        selectedProducts: state.selectedProducts
          .map((item) => {
            if (item.id === action.payload) {
              return {
                ...item,
                qty: item.qty - 1,
              };
            }
            return item;
          })
          .filter((x) => x.qty !== 0),
      };
    },
    resetCartSelection: (state) => {
      return {
        ...state,
        selectedProducts: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        return {
          ...state,
          status: "loading",
        };
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[] | undefined>) => {
          console.log("addcase", action);
          if (!action.payload) {
            return; // TODO check
          }
          return {
            ...state,
            status: "succeeded",
            availableProducts: action.payload,
          };
        },
      )
      .addCase(fetchProducts.rejected, (state) => {
        return {
          ...state,
          status: "rejected",
          error: "Unable to fetch products",
        };
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  resetCartSelection,
  updateQty,
  removeItemEntirely,
  toggleDrawer,
} = cartSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default cartSlice.reducer;
