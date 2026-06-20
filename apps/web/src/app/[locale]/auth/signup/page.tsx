"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/container";
import Button from "@/components/button";
import { useSignUp } from "@/lib/api/hooks/use-auth";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { locale } = useParams();
  const router = useRouter();
  const signUp = useSignUp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    signUp.mutate(
      { name, email, password },
      {
        onSuccess: () => router.push(`/${locale}`),
        onError: (err) => setError(err instanceof Error ? err.message : "Sign up failed"),
      },
    );
  };

  return (
    <main className="p-6">
      <Container>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 bg-white p-6 rounded shadow">
          <h1 className="text-xl font-bold">Sign Up</h1>
          <input className="w-full border p-2 rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full border p-2 rounded" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={signUp.isPending}>
            {signUp.isPending ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </Container>
    </main>
  );
}
