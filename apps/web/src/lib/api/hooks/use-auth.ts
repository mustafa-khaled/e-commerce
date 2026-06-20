"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, AuthUser } from "@/lib/api/client";
import { authKeys } from "@/lib/api/query-keys";
import { useMergeCart } from "@/lib/api/hooks/use-cart";

export function useAuth() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const res = await authApi.getMe();
      return res.data;
    },
    retry: false,
    staleTime: 30_000,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  const mergeCart = useMergeCart();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.signIn(email, password),
    onSuccess: async (res) => {
      queryClient.setQueryData<AuthUser>(authKeys.me, res.data);
      try {
        await mergeCart.mutateAsync();
      } catch {
        // guest cart may not exist
      }
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => authApi.signUp(name, email, password),
    onSuccess: (res) => {
      queryClient.setQueryData<AuthUser>(authKeys.me, res.data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me, null);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
}

export const ADMIN_ROLES = ['admin', 'support', 'marketing', 'inventory'];

export function isAdminRole(role?: string) {
  return role ? ADMIN_ROLES.includes(role) : false;
}
