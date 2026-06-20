"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/container";
import Button from "@/components/button";
import { useSignIn } from "@/lib/api/hooks/use-auth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { locale } = useParams();
  const router = useRouter();
  const signIn = useSignIn();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    signIn.mutate(
      { email, password },
      {
        onSuccess: () => router.push(`/${locale}/profile/orders`),
        onError: (err) => setError(err instanceof Error ? err.message : "Sign in failed"),
      },
    );
  };

  return (
    <main className="p-6">
      <Container>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 bg-white p-6 rounded shadow">
          <h1 className="text-xl font-bold">Sign In</h1>
          <input className="w-full border p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={signIn.isPending}>
            {signIn.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Container>
    </main>
  );
}
