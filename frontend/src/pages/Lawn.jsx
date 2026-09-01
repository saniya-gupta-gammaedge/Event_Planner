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
  // Independent toggled dates — click to select, click again to deselect.
  // Not necessarily contiguous: deselecting one leaves the others as they were.
  const [selectedDates, setSelectedDates] = useState(() => new Set());

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

  const changeMonth = (delta) => {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
    // Selections deliberately persist across months — picking a date in
    // September and another in October is a valid "multiple dates" pick.
  };

  const toggleDate = (iso) => {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      if (next.has(iso)) next.delete(iso);
      else next.add(iso);
      return next;
    });
  };

  const removeDate = (iso) => {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      next.delete(iso);
      return next;
    });
  };

  const sortedDates = [...selectedDates].sort();
  const datesLabel = sortedDates.join(", ");

  const message = sortedDates.length
    ? `Hello, I would like to check ${company.lawnName} lawn availability for ${datesLabel} and book it.`
    : `Hello, I would like to check ${company.lawnName} lawn availability.`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-maroon mb-2 text-center">
        {company.lawnName} Lawn Availability
      </h1>

      <p className="text-neutral-600 mb-8 text-center">
        Click any free date to select it — click again to deselect. Pick as many dates as you need.
      </p>

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
          onJumpToMonth={(y, m) => {
            setYear(y);
            setMonth(m);
          }}
          onDateClick={toggleDate}
          selectedDates={selectedDates}
        />
      </div>

      {sortedDates.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {sortedDates.map((iso) => (
            <span
              key={iso}
              className="inline-flex items-center gap-1.5 rounded-full bg-maroon/10 text-maroon text-sm px-3 py-1"
            >
              {iso}
              <button
                type="button"
                onClick={() => removeDate(iso)}
                aria-label={`Remove ${iso}`}
                className="font-bold hover:text-maroon-dark"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {sortedDates.length > 0 && (
        <div className="max-w-sm mx-auto mt-6">
          <LawnRequestForm key={datesLabel} dates={sortedDates} />
        </div>
      )}

      <div className="text-center mt-8">
        <p className="text-neutral-700 mb-4">
          {sortedDates.length > 0
            ? "Prefer to talk it through first? Reach out directly:"
            : "Pick date(s) above to request them, or reach out directly:"}
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
