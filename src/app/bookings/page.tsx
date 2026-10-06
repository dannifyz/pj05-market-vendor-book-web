"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Booking } from "@/interface";
import { deleteBooking, formatDate, getBookings } from "@/libs/api";
import { useAuth } from "@/providers/AuthProvider";

export default function BookingsPage() {
  const { user, token, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getBookings(token)
      .then((res) => setBookings(res.data))
      .catch((err) => setError(err.message));
  }, [token]);

  if (loading) return <p className="text-white/60">Loading...</p>;
  if (!user || !token) {
    return (
      <p className="text-white/70">
        Please <Link href="/login" className="text-amber-400">login</Link> to view bookings.
      </p>
    );
  }

  const handleDelete = async (booking: Booking) => {
    if (!confirm("Delete this booking?")) return;
    try {
      await deleteBooking(booking._id, token);
      setBookings((bookings ?? []).filter((b) => b._id !== booking._id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const isAdmin = user.role === "admin";

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{isAdmin ? "All Bookings" : "My Bookings"}</h1>
        {!isAdmin && (
          <Link href="/bookings/new" className="btn-primary">
            New Booking
          </Link>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      {bookings === null ? (
        <p className="text-white/60">Loading...</p>
      ) : bookings.length === 0 ? (
        <p className="text-white/60">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-white/60">
              <tr>
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Spot</th>
                <th className="py-2 pr-4">Zone</th>
                <th className="py-2 pr-4">Product Type</th>
                {isAdmin && <th className="py-2 pr-4">Member</th>}
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-white/5">
                  <td className="py-3 pr-4 font-mono">{formatDate(b.bookingDate)}</td>
                  <td className="py-3 pr-4">
                    {b.spot ? b.spot.spotNumber : "-"}
                    {b.spot && b.spot.isActive === false && <span className="ml-2 text-xs text-red-300">(removed)</span>}
                  </td>
                  <td className="py-3 pr-4">{b.spot?.zone ?? "-"}</td>
                  <td className="py-3 pr-4">{b.productType}</td>
                  {isAdmin && (
                    <td className="py-3 pr-4">
                      {b.user ? (
                        <>
                          {b.user.name}
                          <span className="block text-xs text-white/50">{b.user.email}</span>
                        </>
                      ) : "-"}
                    </td>
                  )}
                  <td className="py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/bookings/${b._id}/edit`} className="btn-secondary">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(b)} className="btn-danger">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
