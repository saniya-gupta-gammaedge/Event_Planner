import { useState } from "react";
import { API_URL } from "../utils/api";

const fieldClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
    hasError ? "border-red-400 focus:ring-red-400" : "border-neutral-300 focus:ring-maroon"
  }`;

/**
 * Lets a customer formally request the date(s) they picked on the calendar
 * — a single day when startDate === endDate, or a multi-day range. This
 * does NOT block the date — it lands in the admin's queue as pending. The
 * owner accepts it once the advance payment is sorted out separately (over
 * WhatsApp/call), which is what actually books the date.
 */
export default function LawnRequestForm({ startDate, endDate, onRequested }) {
  const rangeLabel = startDate === endDate ? startDate : `${startDate} to ${endDate}`;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const found = {};
    if (!name.trim()) found.name = "Please enter your name.";
    const digits = phone.replace(/\D/g, "");
    if (!digits) found.phone = "Please enter your phone number.";
    else if (digits.length !== 10) found.phone = "Enter a valid 10-digit phone number.";
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/lawn/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_date: startDate,
          end_date: endDate,
          name: name.trim(),
          phone: digits,
          note: note.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Couldn't submit your request. Please try again.");
      }

      setSubmitted(true);
      onRequested?.();
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-800">
        <p className="font-medium">Request sent for {rangeLabel}!</p>
        <p className="text-sm mt-1">
          We'll confirm your booking once we receive the advance payment — message us on WhatsApp
          below to arrange it.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-neutral-200 bg-white p-4 text-left space-y-3"
    >
      <p className="text-sm font-medium text-neutral-700">
        Request <span className="text-maroon font-semibold">{rangeLabel}</span>
      </p>

      <div>
        <label className="block text-sm font-medium mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z ]/g, ""))}
          placeholder="Enter your full name"
          aria-invalid={Boolean(errors.name)}
          className={fieldClass(errors.name)}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          placeholder="Enter your phone number"
          aria-invalid={Boolean(errors.phone)}
          className={fieldClass(errors.phone)}
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          maxLength={300}
          placeholder="Anything we should know..."
          className={`${fieldClass(false)} resize-none`}
        />
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-maroon text-white py-2.5 font-medium hover:bg-maroon-dark transition disabled:opacity-60"
      >
        {submitting ? "Sending…" : startDate === endDate ? "Request This Date" : "Request These Dates"}
      </button>
    </form>
  );
}
