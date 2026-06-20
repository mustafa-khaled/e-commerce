import { CartItem } from "@/redux/features/cart/cartSlice";

export const getCartQuantity = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

export const getItemQuantity = (id: string, cart: CartItem[], variantSku?: string) => {
  const item = cart.find((i) => i.id === id && i.variantSku === variantSku);
  return item?.quantity || 0;
};

export const getSubTotal = (cart: CartItem[]) =>
  cart.reduce((sum, item) => sum + item.basePrice * (item.quantity || 1), 0);
