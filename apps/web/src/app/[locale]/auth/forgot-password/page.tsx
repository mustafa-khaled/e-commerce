"use client";

import { useState } from "react";
import Container from "@/components/container";
import Button from "@/components/button";
import { authApi } from "@/lib/api/client";
import { useParams } from "next/navigation";
import Link from "@/components/link";

type Step = "email" | "code" | "password";

export default function ForgotPasswordPage() {
  const { locale } = useParams();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authApi.resetPassword(email);
      setMessage("Verification code sent to your email.");
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authApi.verifyCode(email, code);
      setStep("password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await authApi.changePassword(email, password);
      setMessage("Password changed successfully. You can sign in now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <Container>
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
          <h1 className="text-xl font-bold">Forgot Password</h1>
          {message && <p className="text-green-600 text-sm">{message}</p>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {step === "email" && (
            <form onSubmit={handleEmail} className="space-y-3">
              <input
                type="email"
                className="w-full border p-2 rounded"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>Send Code</Button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleCode} className="space-y-3">
              <input
                className="w-full border p-2 rounded"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading}>Verify Code</Button>
            </form>
          )}

          {step === "password" && !message.includes("successfully") && (
            <form onSubmit={handlePassword} className="space-y-3">
              <input
                type="password"
                className="w-full border p-2 rounded"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <Button type="submit" disabled={loading}>Change Password</Button>
            </form>
          )}

          <Link href={`/${locale}/auth/signin`} className="text-blue-600 text-sm">
            Back to Sign In
          </Link>
        </div>
      </Container>
    </main>
  );
}
