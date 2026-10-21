"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function TopMenu() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="border-b border-white/10 bg-black/40">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="font-semibold text-amber-400">
          Night Market
        </Link>
        <Link href="/spots" className="text-sm hover:text-amber-300">
          Vendor Spots
        </Link>
        {user && (
          <Link href="/bookings" className="text-sm hover:text-amber-300">
            {user.role === "admin" ? "All Bookings" : "My Bookings"}
          </Link>
        )}
        <div className="ml-auto flex items-center gap-3 text-sm">
          {loading ? null : user ? (
            <>
              <span className="text-white/70">
                {user.name} <span className="rounded bg-white/10 px-2 py-0.5 text-xs">{user.role}</span>
              </span>
              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
