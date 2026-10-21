"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Role } from "@/interface";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", tel: "", role: "member" as Role, password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      router.push("/spots");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card mx-auto flex max-w-md flex-col gap-4">
      <h1 className="text-2xl font-semibold">Register</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <label className="label" htmlFor="name">Name</label>
        <input id="name" required className="input" value={form.name} onChange={update("name")} />
      </div>
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" required className="input" value={form.email} onChange={update("email")} />
      </div>
      <div>
        <label className="label" htmlFor="tel">Tel</label>
        <input id="tel" type="tel" required className="input" value={form.tel} onChange={update("tel")} />
      </div>
      <div>
        <label className="label" htmlFor="role">Role</label>
        <select id="role" className="input" value={form.role} onChange={update("role")}>
          <option value="member">member</option>
          <option value="admin">admin</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" type="password" required minLength={6} className="input" value={form.password} onChange={update("password")} />
      </div>
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? "Registering..." : "Register"}
      </button>
      <p className="text-sm text-white/60">
        Already have an account? <Link href="/login" className="text-amber-400">Login</Link>
      </p>
    </form>
  );
}
