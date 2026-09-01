import { useEffect, useState } from "react";
import LawnCalendar from "../components/LawnCalendar";
import LawnRequestForm from "../components/LawnRequestForm";
import { API_URL } from "../utils/api";
import { toISODate } from "../utils/date";
import { company, whatsappLink, callLink } from "../data/company";

export default function Lawn() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [multiDay, setMultiDay] = useState(false);
  // { start, end } once complete; end is null while a multi-day pick is
  // still waiting for its second click. null altogether means nothing picked.
  const [selectedRange, setSelectedRange] = useState(null);

  useEffect(() => {
    const start = toISODate(new Date(year, month, 1));
    const end = toISODate(new Date(year, month + 1, 0));

    setLoading(true);
    setError(false);

    fetch(`${API_URL}/api/lawn/availability?start=${start}&end=${end}`)
      .then((res) => {
        if (!res.ok) throw new Error("request failed");
        return res.json();
      })
      .then(setBookedRanges)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [year, month]);

  const jumpToMonth = (nextYear, nextMonth) => {
    setYear(nextYear);
    setMonth(nextMonth);
    setSelectedRange(null);
  };

  const changeMonth = (delta) => {
    const next = new Date(year, month + delta, 1);
    jumpToMonth(next.getFullYear(), next.getMonth());
  };

  const handleDateClick = (iso) => {
    if (!multiDay) {
      setSelectedRange({ start: iso, end: iso });
      return;
    }

    setSelectedRange((prev) => {
      // No selection yet, or the last one was already complete — start fresh.
      if (!prev || prev.end !== null) return { start: iso, end: null };
      // Mid-pick: this click sets the end, unless it's earlier than the
      // start, in which case treat it as restarting from here instead.
      if (iso < prev.start) return { start: iso, end: null };
      return { start: prev.start, end: iso };
    });
  };

  const toggleMultiDay = () => {
    setMultiDay((v) => !v);
    setSelectedRange(null);
  };

  const isComplete = selectedRange && selectedRange.end !== null;
  const rangeLabel = isComplete
    ? selectedRange.start === selectedRange.end
      ? selectedRange.start
      : `${selectedRange.start} to ${selectedRange.end}`
    : null;

  const message = rangeLabel
    ? `Hello, I would like to check ${company.lawnName} lawn availability for ${rangeLabel} and book it.`
    : `Hello, I would like to check ${company.lawnName} lawn availability.`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-maroon mb-2 text-center">
        {company.lawnName} Lawn Availability
      </h1>

      <p className="text-neutral-600 mb-4 text-center">
        Check which dates are free, then reach out to confirm your booking.
      </p>

      <label className="flex items-center justify-center gap-2 text-sm text-neutral-600 mb-6">
        <input type="checkbox" checked={multiDay} onChange={toggleMultiDay} className="accent-maroon" />
        Booking more than one day
      </label>

      {error && (
        <p className="text-center text-sm text-red-600 mb-4">
          Couldn't load availability right now — please try again shortly, or
          contact us directly below.
        </p>
      )}

      <div className={loading ? "opacity-60 pointer-events-none transition" : "transition"}>
        <LawnCalendar
          year={year}
          month={month}
          bookedRanges={bookedRanges}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
          onJumpToMonth={jumpToMonth}
          onDateClick={handleDateClick}
          selectedRange={
            selectedRange
              ? { start: selectedRange.start, end: selectedRange.end ?? selectedRange.start }
              : undefined
          }
        />
      </div>

      {multiDay && selectedRange && !isComplete && (
        <p className="text-center text-sm text-neutral-500 mt-2">
          Start: <span className="font-medium text-maroon">{selectedRange.start}</span> — now click
          the end date.
        </p>
      )}

      {isComplete && (
        <div className="max-w-sm mx-auto mt-6">
          <LawnRequestForm
            key={rangeLabel}
            startDate={selectedRange.start}
            endDate={selectedRange.end}
          />
        </div>
      )}

      <div className="text-center mt-8">
        <p className="text-neutral-700 mb-4">
          {isComplete
            ? "Prefer to talk it through first? Reach out directly:"
            : "Pick a date above to request it, or reach out directly:"}
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-green-500 text-white px-6 py-3 font-medium hover:bg-green-600 transition"
          >
            Ask on WhatsApp
          </a>

          <a
            href={callLink()}
            className="rounded-lg bg-gold text-maroon-dark px-6 py-3 font-medium hover:bg-gold-light transition"
          >
            Call Now
          </a>
        </div>
      </div>
    </div>
  );
}
