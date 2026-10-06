"use client";

import { useState } from "react";
import { Spot, SpotInput } from "@/interface";

interface Props {
  initial?: Spot;
  submitLabel: string;
  onSubmit: (input: SpotInput) => Promise<void>;
}

export default function SpotForm({ initial, submitLabel, onSubmit }: Props) {
  const [form, setForm] = useState({
    spotNumber: initial?.spotNumber ?? "",
    zone: initial?.zone ?? "",
    spotSize: initial?.spotSize ?? "",
    locationDescription: initial?.locationDescription ?? "",
    rentalFee: initial ? String(initial.rentalFee) : "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({ ...form, rentalFee: Number(form.rentalFee) });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
      {error && <p className="error">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="spotNumber">Spot Number</label>
          <input id="spotNumber" required className="input" value={form.spotNumber} onChange={update("spotNumber")} />
        </div>
        <div>
          <label className="label" htmlFor="zone">Zone</label>
          <input id="zone" required className="input" value={form.zone} onChange={update("zone")} />
        </div>
        <div>
          <label className="label" htmlFor="spotSize">Spot Size</label>
          <input id="spotSize" required placeholder="2 x 2 m" className="input" value={form.spotSize} onChange={update("spotSize")} />
        </div>
        <div>
          <label className="label" htmlFor="rentalFee">Rental Fee (THB)</label>
          <input id="rentalFee" type="number" min={0} step="any" required className="input" value={form.rentalFee} onChange={update("rentalFee")} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="locationDescription">Location Description</label>
        <textarea id="locationDescription" required rows={3} className="input" value={form.locationDescription} onChange={update("locationDescription")} />
      </div>
      <button type="submit" disabled={submitting} className="btn-primary self-start">
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
