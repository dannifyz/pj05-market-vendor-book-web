"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Spot } from "@/interface";
import { deleteSpot, getSpot } from "@/libs/api";
import { useAuth } from "@/providers/AuthProvider";

export default function SpotDetailPage() {
  const { sid } = useParams<{ sid: string }>();
  const { user, token } = useAuth();
  const router = useRouter();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSpot(sid)
      .then((res) => setSpot(res.data))
      .catch((err) => setError(err.message));
  }, [sid]);

  const handleDelete = async () => {
    if (!token || !spot || !confirm(`Delete spot ${spot.spotNumber}?`)) return;
    try {
      await deleteSpot(spot._id, token);
      router.push("/spots");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (error) return <p className="error">{error}</p>;
  if (!spot) return <p className="text-white/60">Loading...</p>;

  return (
    <section className="card mx-auto flex max-w-xl flex-col gap-3">
      <h1 className="text-3xl font-semibold text-amber-400">Spot {spot.spotNumber}</h1>
      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="text-white/60">Spot ID</dt>
        <dd className="font-mono break-all">{spot._id}</dd>
        <dt className="text-white/60">Zone</dt>
        <dd>{spot.zone}</dd>
        <dt className="text-white/60">Spot Size</dt>
        <dd>{spot.spotSize}</dd>
        <dt className="text-white/60">Location</dt>
        <dd>{spot.locationDescription}</dd>
        <dt className="text-white/60">Rental Fee</dt>
        <dd>{spot.rentalFee.toLocaleString()} THB</dd>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link href="/spots" className="btn-secondary">
          Back
        </Link>
        {user?.role === "member" && (
          <Link href={`/bookings/new?spot=${spot._id}`} className="btn-primary">
            Book this spot
          </Link>
        )}
        {!user && (
          <Link href="/login" className="btn-primary">
            Login to book
          </Link>
        )}
        {user?.role === "admin" && (
          <>
            <Link href={`/spots/${spot._id}/edit`} className="btn-secondary">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn-danger">
              Delete
            </button>
          </>
        )}
      </div>
    </section>
  );
}
