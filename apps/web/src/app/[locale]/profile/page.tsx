"use client";

import { useEffect, useState } from "react";
import Container from "@/components/container";
import Button from "@/components/button";
import { userApi } from "@/lib/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/lib/api/query-keys";
import Link from "@/components/link";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { locale } = useParams();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({
    queryKey: [...authKeys.me, 'profile'],
    queryFn: async () => {
      const res = await userApi.getMe();
      return res.data;
    },
  });

  const [form, setForm] = useState({ name: "", phoneNumber: "" });

  useEffect(() => {
    if (profile) {
      setForm({ name: profile.name, phoneNumber: profile.phoneNumber || "" });
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: () => userApi.updateMe(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });

  return (
    <main className="p-6">
      <Container>
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
          <h1 className="text-xl font-bold">My Profile</h1>
          {isLoading && <p>Loading...</p>}
          {profile && (
            <>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <form
                onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(); }}
                className="space-y-3"
              >
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Phone"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                />
                <Button type="submit" disabled={updateMutation.isPending}>Save</Button>
              </form>
              <Link href={`/${locale}/profile/orders`} className="text-blue-600 block">
                View My Orders
              </Link>
            </>
          )}
        </div>
      </Container>
    </main>
  );
}
