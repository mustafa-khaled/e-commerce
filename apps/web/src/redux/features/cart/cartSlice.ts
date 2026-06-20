import { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  id: string;
  slug?: string;
  name: string;
  image: string;
  basePrice: number;
  quantity?: number;
  variantSku?: string;
};

export type CartState = {
  items: CartItem[];
  cartId?: string;
  guestId?: string;
};

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartMeta: (state, action: PayloadAction<{ cartId?: string; guestId?: string }>) => {
      if (action.payload.cartId) state.cartId = action.payload.cartId;
      if (action.payload.guestId) state.guestId = action.payload.guestId;
    },
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id && item.variantSku === action.payload.variantSku,
      );
      if (existing) {
        existing.quantity = (existing.quantity || 0) + 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ id: string; type: "increase" | "decrease"; variantSku?: string }>,
    ) => {
      const item = state.items.find(
        (i) => i.id === action.payload.id && i.variantSku === action.payload.variantSku,
      );
      if (item) {
        if (action.payload.type === "increase") {
          item.quantity = (item.quantity || 1) + 1;
        } else if (action.payload.type === "decrease" && (item.quantity || 1) > 1) {
          item.quantity! -= 1;
        } else {
          state.items = state.items.filter(
            (i) => !(i.id === item.id && i.variantSku === item.variantSku),
          );
        }
      }
    },
    removeItemFromCart: (
      state,
      action: PayloadAction<{ id: string; variantSku?: string }>,
    ) => {
      state.items = state.items.filter(
        (item) => !(item.id === action.payload.id && item.variantSku === action.payload.variantSku),
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
    setCartFromApi: (
      state,
      action: PayloadAction<{
        cartId: string;
        guestId?: string;
        items: {
          productId: string;
          title: string;
          image?: string;
          quantity: number;
          unitPrice: number;
          variantSku?: string;
        }[];
      }>,
    ) => {
      state.cartId = action.payload.cartId;
      if (action.payload.guestId) state.guestId = action.payload.guestId;
      state.items = action.payload.items.map((item) => ({
        id: item.productId,
        name: item.title,
        image: item.image || '',
        basePrice: item.unitPrice,
        quantity: item.quantity,
        variantSku: item.variantSku,
      }));
    },
  },
});

export const { addCartItem, updateItemQuantity, removeItemFromCart, clearCart, setCartMeta, setCartFromApi } =
  cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartMeta = (state: RootState) => ({
  cartId: state.cart.cartId,
  guestId: state.cart.guestId,
});
