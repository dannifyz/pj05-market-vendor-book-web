"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { BookingInput } from "@/interface";
import { createBooking } from "@/libs/api";
import { useAuth } from "@/providers/AuthProvider";

function NewBooking() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const spot = useSearchParams().get("spot") ?? "";

  if (loading) return <p className="text-white/60">Loading...</p>;
  if (user?.role !== "member" || !token) return <p className="error">Only logged-in members can create bookings.</p>;

  const handleSubmit = async (input: BookingInput) => {
    await createBooking(input, token);
    router.push("/bookings");
  };

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">New Booking</h1>
      <BookingForm initial={{ spot }} submitLabel="Book Spot" onSubmit={handleSubmit} />
    </section>
  );
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={<p className="text-white/60">Loading...</p>}>
      <NewBooking />
    </Suspense>
  );
}
