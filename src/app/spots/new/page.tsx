"use client";

import { useRouter } from "next/navigation";
import SpotForm from "@/components/SpotForm";
import { SpotInput } from "@/interface";
import { createSpot } from "@/libs/api";
import { useAuth } from "@/providers/AuthProvider";

export default function NewSpotPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p className="text-white/60">Loading...</p>;
  if (user?.role !== "admin" || !token) return <p className="error">Only admin can add vendor spots.</p>;

  const handleSubmit = async (input: SpotInput) => {
    const res = await createSpot(input, token);
    router.push(`/spots/${res.data._id}`);
  };

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Add Vendor Spot</h1>
      <SpotForm submitLabel="Create Spot" onSubmit={handleSubmit} />
    </section>
  );
}
