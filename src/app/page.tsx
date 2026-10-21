import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center">
      <h1 className="text-4xl font-bold text-amber-400">Night Market Vendor Spot Booking</h1>
      <p className="max-w-xl text-white/70">
        Browse vendor spots at the night market and book a selling space on the date you want.
        Members can book up to 3 spots per day.
      </p>
      <div className="flex gap-3">
        <Link href="/spots" className="btn-primary">
          View Vendor Spots
        </Link>
        <Link href="/bookings" className="btn-secondary">
          My Bookings
        </Link>
      </div>
    </section>
  );
}
