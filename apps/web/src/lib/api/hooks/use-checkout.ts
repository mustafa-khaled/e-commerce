"use client";

import { useMutation } from "@tanstack/react-query";
import { checkoutApi, orderApi, paymentApi, shippingApi } from "@/lib/api/client";

export function useShippingMethods() {
  return useMutation({
    mutationFn: ({
      country,
      subtotal,
      city,
    }: {
      country: string;
      subtotal: number;
      city?: string;
    }) => shippingApi.getMethods(country, subtotal, city),
  });
}

export function useCheckoutPreview() {
  return useMutation({
    mutationFn: (body: unknown) => checkoutApi.preview(body),
  });
}

export function usePlaceOrder() {
  return useMutation({
    mutationFn: ({
      body,
      guestId,
      idempotencyKey,
    }: {
      body: unknown;
      guestId?: string;
      idempotencyKey?: string;
    }) => orderApi.create(body, guestId, idempotencyKey),
  });
}

export function useKashierSession() {
  return useMutation({
    mutationFn: ({ orderId, redirectUrl }: { orderId: string; redirectUrl: string }) =>
      paymentApi.createKashierSession(orderId, redirectUrl),
  });
}
