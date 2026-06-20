"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi, productApi, CreateProductBody, CreateCampaignBody, UpdateCampaignBody } from "@/lib/api/client";
import { adminKeys } from "@/lib/api/query-keys";

export function useAdminOverview() {
  return useQuery({
    queryKey: adminKeys.overview,
    queryFn: async () => {
      const res = await adminApi.getOverview();
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: adminKeys.orders,
    queryFn: async () => {
      const res = await adminApi.getOrders();
      return res.data || [];
    },
    staleTime: 30_000,
  });
}

export function useAdminCampaigns() {
  return useQuery({
    queryKey: adminKeys.campaigns,
    queryFn: async () => {
      const res = await adminApi.getCampaigns();
      return res.data || [];
    },
    staleTime: 30_000,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCampaignBody) => adminApi.createCampaign(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.campaigns }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCampaignBody }) =>
      adminApi.updateCampaign(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.campaigns }),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCampaign(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.campaigns }),
  });
}

export function useSendCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.sendCampaign(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.campaigns }),
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: adminKeys.products,
    queryFn: async () => {
      const res = await productApi.list();
      return res.data || [];
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateProductBody) => productApi.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.products }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CreateProductBody> }) =>
      productApi.update(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.products }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.products }),
  });
}

export function useAdminLowStock() {
  return useQuery({
    queryKey: adminKeys.inventory,
    queryFn: async () => {
      const res = await adminApi.getLowStock();
      return res.data || [];
    },
  });
}

export function useAdjustInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminApi.adjustInventory,
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.inventory }),
  });
}

export function useAdminSales(groupBy: 'day' | 'product' = 'day') {
  return useQuery({
    queryKey: [...adminKeys.reports, groupBy],
    queryFn: async () => {
      const res = await adminApi.getSales(groupBy);
      return res.data || [];
    },
  });
}

export function useAdminReturns() {
  return useQuery({
    queryKey: adminKeys.returns,
    queryFn: async () => {
      const res = await adminApi.getReturns();
      return res.data || [];
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.orders }),
  });
}

export function useUpdateReturnStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminApi.updateReturnStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: adminKeys.returns }),
  });
}
