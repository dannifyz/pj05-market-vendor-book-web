"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Spot } from "@/interface";
import { deleteSpot, getSpots } from "@/libs/api";
import { useAuth } from "@/providers/AuthProvider";

export default function SpotsPage() {
  const { user, token } = useAuth();
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    getSpots()
      .then((res) => setSpots(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const zones = useMemo(() => [...new Set(spots.map((s) => s.zone))].sort(), [spots]);

  const visibleSpots = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const filtered = spots.filter(
      (s) =>
        (!zone || s.zone === zone) &&
        (!keyword ||
          [s.spotNumber, s.zone, s.spotSize, s.locationDescription].some((v) => v.toLowerCase().includes(keyword)))
    );
    if (sort === "asc") return [...filtered].sort((a, b) => a.rentalFee - b.rentalFee);
    if (sort === "desc") return [...filtered].sort((a, b) => b.rentalFee - a.rentalFee);
    return filtered;
  }, [spots, search, zone, sort]);

  const handleDelete = async (spot: Spot) => {
    if (!token || !confirm(`Delete spot ${spot.spotNumber}?`)) return;
    try {
      await deleteSpot(spot._id, token);
      setSpots(spots.filter((s) => s._id !== spot._id));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vendor Spots</h1>
        {user?.role === "admin" && (
          <Link href="/spots/new" className="btn-primary">
            Add Spot
          </Link>
        )}
      </div>
      {error && <p className="error">{error}</p>}
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <input
          aria-label="Search spots"
          placeholder="Search spot number, zone, size, location..."
          className="input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select aria-label="Filter by zone" className="input" value={zone} onChange={(e) => setZone(e.target.value)}>
          <option value="">All zones</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
        <select aria-label="Sort by rental fee" className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Default order</option>
          <option value="asc">Rental fee: low to high</option>
          <option value="desc">Rental fee: high to low</option>
        </select>
      </div>
      {loading ? (
        <p className="text-white/60">Loading...</p>
      ) : spots.length === 0 ? (
        <p className="text-white/60">No vendor spots available.</p>
      ) : visibleSpots.length === 0 ? (
        <p className="text-white/60">No spots match your search.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleSpots.map((spot) => (
            <div key={spot._id} className="card flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <h2 className="text-xl font-semibold text-amber-400">{spot.spotNumber}</h2>
                <span className="text-sm text-white/60">{spot.zone}</span>
              </div>
              <p className="text-sm">Size: {spot.spotSize}</p>
              <p className="text-sm text-white/70">{spot.locationDescription}</p>
              <p className="font-medium">{spot.rentalFee.toLocaleString()} THB</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href={`/spots/${spot._id}`} className="btn-secondary">
                  View
                </Link>
                {user?.role === "member" && (
                  <Link href={`/bookings/new?spot=${spot._id}`} className="btn-primary">
                    Book
                  </Link>
                )}
                {user?.role === "admin" && (
                  <>
                    <Link href={`/spots/${spot._id}/edit`} className="btn-secondary">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(spot)} className="btn-danger">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
