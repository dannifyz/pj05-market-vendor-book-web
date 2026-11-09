"use client";

import { useEffect, useState } from "react";
import { BookingInput, Spot } from "@/interface";
import { getSpots, getSpotBookedDates, todayUTC } from "@/libs/api";
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

  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);

  const minDate = todayUTC();

  useEffect(() => {
    getSpots()
      .then((res) => setSpots(res.data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    if (!form.spot) {
      setBookedDates([]);
      return;
    }
    setLoadingDates(true);
    getSpotBookedDates(form.spot)
      .then((res) => setBookedDates(res.data))
      .catch(() => setBookedDates([]))
      .finally(() => setLoadingDates(false));
  }, [form.spot]);

  const update = (key: keyof BookingInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.bookingDate < minDate) {
      setError("Booking date cannot be in the past");
      return;
    }
    if (bookedDates.includes(form.bookingDate)) {
      setError("This date is already booked for the selected spot.");
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

  const selectedSpot = spots.find((s) => s._id === form.spot);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 lg:col-span-3">
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

      <div className="card flex flex-col gap-3 lg:col-span-2 h-full">
        <h2 className="text-lg font-semibold text-amber-400">Booked Dates</h2>
              {selectedSpot ? (
                <p className="text-xs text-white/60">
                  Spot: <span className="text-white font-medium">{selectedSpot.spotNumber} </span>
                  ({selectedSpot.zone})
                </p>
              ) : (
                <p className="text-sm text-white/40 italic">Please select a vendor spot to view booked dates.</p>
              )}

              {loadingDates ? (
                <p className="text-sm text-white/50 animate-pulse">Loading booked dates . . .</p>
              ) : form.spot ? (
                bookedDates.length === 0 ? (
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                    No upcoming booking for this spot. All dates are available!
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto pr-1">
                    <span className="text-xs text-white/50">Already reserved on:</span>
                    <ul className="flex flex-col gap-1.5">
                      {bookedDates.map((date) => (
                        <li
                          key={date}
                          className="flex items-center justify-between rounded bg-white/5 px-2.5 py-1.5 font-mono text-xs border border-white/10"
                        >
                          <span>{date}</span>
                          <span className="text-[10px] text-red-300 bg-red-500/20 px-2 py-0.5 rounded">
                            Booked
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ) : null}
      </div>
    </div>
  );
}
