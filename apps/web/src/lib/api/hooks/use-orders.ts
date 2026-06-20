"use client";

import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/lib/api/client";
import { orderKeys } from "@/lib/api/query-keys";

export function useOrders() {
  return useQuery({
    queryKey: orderKeys.list,
    queryFn: async () => {
      const res = await orderApi.list();
      return res.data || [];
    },
    staleTime: 30_000,
  });
}

export function useTrackOrder(orderNumber: string, email: string, enabled = false) {
  return useQuery({
    queryKey: orderKeys.track(orderNumber, email),
    queryFn: async () => {
      const res = await orderApi.track(orderNumber, email);
      return res.data;
    },
    enabled: enabled && !!orderNumber && !!email,
    retry: false,
  });
}
