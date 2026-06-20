"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setCartMeta } from "@/redux/features/cart/cartSlice";
import { useCreateGuestCart, useSyncCart } from "@/lib/api/hooks/use-cart";

export default function CartProvider() {
  const dispatch = useAppDispatch();
  const { data: guestCart } = useCreateGuestCart();

  useEffect(() => {
    if (guestCart) {
      dispatch(setCartMeta({ guestId: guestCart.guestId, cartId: guestCart.cartId }));
    }
  }, [guestCart, dispatch]);

  useSyncCart();

  return null;
}
