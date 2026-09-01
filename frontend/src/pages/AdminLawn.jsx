import { useEffect, useState } from "react";
import LawnCalendar from "../components/LawnCalendar";
import LawnRequestsPanel from "../components/LawnRequestsPanel";
import { API_URL } from "../utils/api";
import { adminFetch } from "../utils/adminApi";
import { isDateBooked, todayISO } from "../utils/date";

const TOKEN_KEY = "dhote-admin-token";

const inputClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-maroon";

const emptyForm = { start_date: "", end_date: "", note: "", type: "booking" };

function LoginForm({ onLoggedIn }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || "Incorrect password");
      }

      const { token } = await res.json();
      localStorage.setItem(TOKEN_KEY, token);
      onLoggedIn(token);
    } catch (err) {
      setError(err.message || "Incorrect password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-16 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      <h1 className="font-display text-xl font-bold text-maroon mb-4 text-center">
        Admin Login
      </h1>

      <label className="block text-sm font-medium mb-1">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={inputClass}
        autoFocus
      />

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full mt-4 rounded-lg bg-maroon text-white py-2.5 font-medium hover:bg-maroon-dark transition disabled:opacity-60"
      >
        {submitting ? "Checking…" : "Log In"}
      </button>
    </form>
  );
}

function formatRange(b) {
  return b.start_date === b.end_date ? b.start_date : `${b.start_date} → ${b.end_date}`;
}

/** Downloads the full booking list as a CSV file — for the owner's own records. */
function exportBookingsCsv(bookings) {
  const escape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const header = "start_date,end_date,type,note\n";
  const rows = bookings
    .map((b) => [b.start_date, b.end_date, b.type, b.note].map(escape).join(","))
    .join("\n");

  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `lawn-bookings-${todayISO()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function BookingManager({ token, onExpired }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [overlapWarning, setOverlapWarning] = useState(null); // overlapping bookings, awaiting confirmation
  const [showPast, setShowPast] = useState(false);

  const loadBookings = () => {
    setLoading(true);
    adminFetch("/api/lawn/bookings", token, onExpired)
      .then(setBookings)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(loadBookings, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOverlapWarning(null);
    setFormError("");
  };

  const submitBooking = async () => {
    try {
      if (editingId) {
        await adminFetch(`/api/lawn/bookings/${editingId}`, token, onExpired, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await adminFetch("/api/lawn/bookings", token, onExpired, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      resetForm();
      loadBookings();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.start_date || !form.end_date) {
      setFormError("Pick both a start and end date.");
      return;
    }
    if (form.start_date > form.end_date) {
      setFormError("Start date must be on or before the end date.");
      return;
    }

    // Same date range as another booking? Don't block it outright — the
    // admin may genuinely need to override — just make them confirm.
    const overlaps = bookings.filter(
      (b) => b.id !== editingId && form.start_date <= b.end_date && form.end_date >= b.start_date
    );

    if (overlaps.length > 0) {
      setOverlapWarning(overlaps);
      return;
    }

    submitBooking();
  };

  const startEdit = (booking) => {
    setEditingId(booking.id);
    setForm({
      start_date: booking.start_date,
      end_date: booking.end_date,
      note: booking.note,
      type: booking.type,
    });
    setOverlapWarning(null);
    setFormError("");
  };

  const handleDelete = async (booking) => {
    const confirmed = window.confirm(
      `Delete the booking for ${formatRange(booking)}${booking.note ? ` (${booking.note})` : ""}?`
    );
    if (!confirmed) return;

    try {
      await adminFetch(`/api/lawn/bookings/${booking.id}`, token, onExpired, { method: "DELETE" });
      if (editingId === booking.id) resetForm();
      loadBookings();
    } catch {
      // A session-expiry already redirects via onExpired; anything else, the list just stays as-is.
    }
  };

  const jumpToMonth = (nextYear, nextMonth) => {
    setYear(nextYear);
    setMonth(nextMonth);
  };

  const changeMonth = (delta) => {
    const next = new Date(year, month + delta, 1);
    jumpToMonth(next.getFullYear(), next.getMonth());
  };

  // Click-to-pick on the calendar itself — already-booked/off dates never
  // reach here at all (LawnCalendar keeps them non-clickable), so there's
  // nothing further to check: whatever gets clicked is free.
  const handleCalendarPick = (iso) => {
    setOverlapWarning(null);
    setFormError("");

    const startingFresh = !form.start_date || form.end_date;
    if (startingFresh || iso < form.start_date) {
      setForm({ ...form, start_date: iso, end_date: "" });
      return;
    }

    setForm({ ...form, end_date: iso });
  };

  const today = todayISO();
  const visibleBookings = showPast ? bookings : bookings.filter((b) => b.end_date >= today);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-maroon">Lawn Bookings</h1>

        <button
          onClick={() => {
            localStorage.removeItem(TOKEN_KEY);
            onExpired();
          }}
          className="text-sm text-red-600 hover:underline"
        >
          Log Out
        </button>
      </div>

      <div className="mb-8">
        <LawnRequestsPanel token={token} onExpired={onExpired} onAccepted={loadBookings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <LawnCalendar
            year={year}
            month={month}
            bookedRanges={bookings}
            onPrevMonth={() => changeMonth(-1)}
            onNextMonth={() => changeMonth(1)}
            onJumpToMonth={jumpToMonth}
            onDateClick={handleCalendarPick}
            selectedRange={
              form.start_date ? { start: form.start_date, end: form.end_date || form.start_date } : undefined
            }
          />

          <p className="text-xs text-neutral-500 mt-2">
            Click a free date to set the start, click again for the end. Booked and already-off
            dates can't be picked — this calendar is the only way to fill in the dates below.
          </p>
        </div>

        <div className="space-y-6">
          {/* Add / edit booking */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm space-y-3"
          >
            <h2 className="text-lg font-bold text-maroon">
              {editingId ? "Edit Booking" : "Block a Date Range"}
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => {
                    const start_date = e.target.value;
                    if (isDateBooked(start_date, bookings)) {
                      setFormError("That date is already unavailable — pick another.");
                      return; // leaves form.start_date as it was
                    }
                    // Dates before the new start date are no longer a valid end date.
                    const end_date =
                      form.end_date && form.end_date < start_date ? "" : form.end_date;
                    setForm({ ...form, start_date, end_date });
                    setOverlapWarning(null);
                    setFormError("");
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="date"
                  min={form.start_date || undefined}
                  value={form.end_date}
                  onChange={(e) => {
                    const end_date = e.target.value;
                    if (isDateBooked(end_date, bookings)) {
                      setFormError("That date is already unavailable — pick another.");
                      return;
                    }
                    setForm({ ...form, end_date });
                    setOverlapWarning(null);
                    setFormError("");
                  }}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "booking" })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    form.type === "booking"
                      ? "bg-maroon text-white border-maroon"
                      : "border-neutral-300 hover:border-maroon"
                  }`}
                >
                  Booking
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, type: "off" })}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    form.type === "off"
                      ? "bg-neutral-600 text-white border-neutral-600"
                      : "border-neutral-300 hover:border-neutral-500"
                  }`}
                >
                  Owner Off
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Note (private)</label>
              <input
                type="text"
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="e.g. Sharma wedding"
                className={inputClass}
              />
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}

            {overlapWarning && (
              <div className="rounded-lg border border-gold bg-gold/10 p-3 text-sm text-maroon-dark">
                <p className="font-medium mb-1">
                  This overlaps {overlapWarning.length === 1 ? "an existing booking" : "existing bookings"}:
                </p>
                <ul className="list-disc list-inside mb-2">
                  {overlapWarning.map((b) => (
                    <li key={b.id}>
                      {formatRange(b)}
                      {b.note ? ` — ${b.note}` : ""}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={submitBooking}
                    className="rounded-lg bg-maroon text-white px-3 py-1.5 text-sm font-medium hover:bg-maroon-dark transition"
                  >
                    Add Anyway
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverlapWarning(null)}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium hover:bg-neutral-50 transition"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-maroon text-white py-2.5 font-medium hover:bg-maroon-dark transition"
              >
                {editingId ? "Save Changes" : "Add Booking"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-neutral-300 px-4 py-2.5 font-medium hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Booking list */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-maroon">All Bookings</h2>

              <div className="flex items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setShowPast((v) => !v)}
                  className="text-maroon hover:underline"
                >
                  {showPast ? "Hide past" : "Show past"}
                </button>

                <button
                  type="button"
                  onClick={() => exportBookingsCsv(bookings)}
                  disabled={bookings.length === 0}
                  className="text-maroon hover:underline disabled:text-neutral-300 disabled:no-underline"
                >
                  Export CSV
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-neutral-500">Loading…</p>
            ) : visibleBookings.length === 0 ? (
              <p className="text-sm text-neutral-500">
                {showPast ? "No bookings yet." : "No upcoming bookings."}
              </p>
            ) : (
              <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {visibleBookings.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between gap-3 border-b border-neutral-200 pb-2"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-neutral-800 flex items-center gap-2">
                        {formatRange(b)}
                        {b.type === "off" && (
                          <span className="shrink-0 rounded-full bg-neutral-200 text-neutral-600 text-xs px-2 py-0.5">
                            Off
                          </span>
                        )}
                      </p>
                      {b.note && (
                        <p className="text-sm text-neutral-500 truncate">{b.note}</p>
                      )}
                    </div>

                    <div className="shrink-0 flex gap-3 text-xs">
                      <button
                        onClick={() => startEdit(b)}
                        className="text-maroon hover:text-maroon-dark"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(b)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLawn() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const handleExpired = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (!token) return <LoginForm onLoggedIn={setToken} />;

  return <BookingManager token={token} onExpired={handleExpired} />;
}
