"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi, CartApiItem } from "@/lib/api/client";
import { cartKeys } from "@/lib/api/query-keys";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCartMeta, setCartFromApi } from "@/redux/features/cart/cartSlice";

export function useCreateGuestCart() {
  return useQuery({
    queryKey: cartKeys.guest,
    queryFn: async () => {
      const res = await cartApi.createGuest();
      return {
        guestId: res.guestId,
        cartId: res.data.cartId,
        cart: res.data,
      };
    },
    staleTime: Infinity,
    retry: 1,
  });
}

export function useSyncCart() {
  const dispatch = useAppDispatch();
  const { guestId, cartId } = useAppSelector(selectCartMeta);

  return useQuery({
    queryKey: [...cartKeys.all, guestId, cartId],
    queryFn: async () => {
      const res = await cartApi.get(guestId);
      const items = (res.data.items || []) as CartApiItem[];
      dispatch(
        setCartFromApi({
          cartId: res.data.cartId,
          guestId,
          items,
        }),
      );
      return res.data;
    },
    enabled: !!guestId || !!cartId,
    staleTime: 30_000,
  });
}

export function useAddToCartApi() {
  const dispatch = useAppDispatch();
  const { guestId } = useAppSelector(selectCartMeta);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      productId: string;
      quantity: number;
      variantSku?: string;
      cartId: string;
    }) => {
      const res = await cartApi.addItem(
        {
          cartId: params.cartId,
          productId: params.productId,
          quantity: params.quantity,
          variantSku: params.variantSku,
        },
        guestId,
      );
      return res.data as { cartId: string; items: CartApiItem[] };
    },
    onSuccess: (data) => {
      dispatch(
        setCartFromApi({
          cartId: data.cartId,
          guestId,
          items: data.items,
        }),
      );
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

export function useMergeCart() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.merge(),
    onSuccess: (res) => {
      const data = res.data as { cartId: string; items: CartApiItem[] };
      dispatch(
        setCartFromApi({
          cartId: data.cartId,
          items: data.items as CartApiItem[],
        }),
      );
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
