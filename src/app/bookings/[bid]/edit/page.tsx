"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import BookingForm from "@/components/BookingForm";
import { Booking, BookingInput } from "@/interface";
import { formatDate, getBooking, updateBooking } from "@/libs/api";
import { useAuth } from "@/providers/AuthProvider";

export default function EditBookingPage() {
  const { bid } = useParams<{ bid: string }>();
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    getBooking(bid, token)
      .then((res) => setBooking(res.data))
      .catch((err) => setError(err.message));
  }, [bid, token]);

  if (loading) return <p className="text-white/60">Loading...</p>;
  if (!user || !token) return <p className="error">Please login to edit bookings.</p>;
  if (error) return <p className="error">{error}</p>;
  if (!booking) return <p className="text-white/60">Loading...</p>;

  const handleSubmit = async (input: BookingInput) => {
    await updateBooking(bid, input, token);
    router.push("/bookings");
  };

  return (
    <section className="mx-auto flex max-w-xl flex-col gap-4">
      <h1 className="text-2xl font-semibold">Edit Booking</h1>
      {user.role === "admin" && booking.user && (
        <p className="text-sm text-white/60">
          Member: {booking.user.name} ({booking.user.email})
        </p>
      )}
      <BookingForm
        initial={{
          spot: booking.spot?._id ?? "",
          bookingDate: formatDate(booking.bookingDate),
          productType: booking.productType,
        }}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />
    </section>
  );
}
