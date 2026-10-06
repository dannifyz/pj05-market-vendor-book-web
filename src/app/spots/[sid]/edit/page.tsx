"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SpotForm from "@/components/SpotForm";
import { Spot, SpotInput } from "@/interface";
import { getSpot, updateSpot } from "@/libs/api";
import { useAuth } from "@/providers/AuthProvider";

export default function EditSpotPage() {
  const { sid } = useParams<{ sid: string }>();
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getSpot(sid)
      .then((res) => setSpot(res.data))
      .catch((err) => setError(err.message));
  }, [sid]);

  if (loading) return <p className="text-white/60">Loading...</p>;
  if (user?.role !== "admin" || !token) return <p className="error">Only admin can edit vendor spots.</p>;
  if (error) return <p className="error">{error}</p>;
  if (!spot) return <p className="text-white/60">Loading...</p>;

  const handleSubmit = async (input: SpotInput) => {
    await updateSpot(sid, input, token);
    router.push(`/spots/${sid}`);
  };

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Edit Spot {spot.spotNumber}</h1>
      <SpotForm initial={spot} submitLabel="Save Changes" onSubmit={handleSubmit} />
    </section>
  );
}
