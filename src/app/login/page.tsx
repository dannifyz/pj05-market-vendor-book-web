"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/spots");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" type="password" required className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? "Logging in..." : "Login"}
      </button>
      <p className="text-sm text-white/60">
        No account? <Link href="/register" className="text-amber-400">Register</Link>
      </p>
    </form>
  );
}
