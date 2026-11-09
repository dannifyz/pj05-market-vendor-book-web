"use client";

import { useEffect, useState } from "react";
import { BookingInput, Spot } from "@/interface";
import { getSpots, todayUTC } from "@/libs/api";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";

interface Props {
  initial?: Partial<BookingInput>;
  submitLabel: string;
  onSubmit: (input: BookingInput) => Promise<void>;
}

export default function BookingForm({ initial, submitLabel, onSubmit }: Props) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [form, setForm] = useState<BookingInput>({
    spot: initial?.spot ?? "",
    bookingDate: initial?.bookingDate ?? "",
    productType: initial?.productType ?? "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const minDate = todayUTC();

  useEffect(() => {
    getSpots()
      .then((res) => setSpots(res.data))
      .catch((err) => setError(err.message));
  }, []);

  const update = (key: keyof BookingInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.bookingDate < minDate) {
      setError("Booking date cannot be in the past");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ ...form, productType: form.productType.trim() });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
      {error && <p className="error">{error}</p>}
      <div>
        <label className="label" htmlFor="spot">Vendor Spot</label>
        <select id="spot" required className="input" value={form.spot} onChange={update("spot")}>
          <option value="" disabled>Select a spot</option>
          {spots.map((s) => (
            <option key={s._id} value={s._id}>
              {s.spotNumber} · {s.zone} · {s.spotSize} · {s.rentalFee} THB
            </option>
          ))}
        </select>
        {form.spot && <p className="mt-1 font-mono text-xs text-white/50">Spot ID: {form.spot}</p>}
      </div>
      <div>
        <label className="label" htmlFor="bookingDate">Booking Date</label>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={form.bookingDate ? dayjs(form.bookingDate):null}
            onChange={(newValue:Dayjs | null) => {
              setForm({
                ...form,
                bookingDate: newValue && newValue.isValid() ? newValue.format("YYYY-MM-DD") : "",
              });
            }}
            minDate={dayjs(minDate)}
            className="custom-datepicker w-full"
            slotProps={{
              textField: {
                required: true,
              }
            }}
          />
        </LocalizationProvider>
      </div>
      <div>
        <label className="label" htmlFor="productType">Product Type</label>
        <input id="productType" required placeholder="Food and drinks" className="input" value={form.productType} onChange={update("productType")} />
      </div>
      <p className="text-xs text-white/50">
        A spot can be booked by only one vendor per day. Each member can book up to 3 spots per day.
      </p>
      <button type="submit" disabled={submitting} className="btn-primary self-start">
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
