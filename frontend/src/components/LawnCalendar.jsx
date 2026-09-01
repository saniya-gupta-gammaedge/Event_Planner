import { getMonthGrid, todayISO, toISODate } from "../utils/date";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * A month-grid calendar for lawn availability. Read-only when `onDateClick`
 * is omitted; pass it to make free, current-month, non-past dates clickable
 * — already-booked/off dates never fire it, so a caller using this as a date
 * picker gets that protection for free. Highlight a single date via
 * `selectedDate`, a contiguous range via `selectedRange={{ start, end }}`,
 * or any independent set of dates via `selectedDates` (a Set of ISO strings).
 */
export default function LawnCalendar({
  year,
  month,
  bookedRanges,
  onPrevMonth,
  onNextMonth,
  onJumpToMonth,
  onDateClick,
  selectedDate,
  selectedRange,
  selectedDates,
}) {
  const today = todayISO();
  const days = getMonthGrid(year, month);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={onPrevMonth}
          aria-label="Previous month"
          className="rounded-lg px-3 py-1.5 text-maroon hover:bg-cream-dark transition"
        >
          ‹
        </button>

        {onJumpToMonth ? (
          <input
            type="month"
            value={`${year}-${String(month + 1).padStart(2, "0")}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-").map(Number);
              if (y && m) onJumpToMonth(y, m - 1);
            }}
            aria-label="Jump to month"
            className="font-display text-base sm:text-lg font-semibold text-maroon bg-transparent border-none text-center focus:outline-none focus:ring-2 focus:ring-gold rounded-lg cursor-pointer"
          />
        ) : (
          <h3 className="font-display text-lg font-semibold text-maroon">
            {MONTH_NAMES[month]} {year}
          </h3>
        )}

        <button
          type="button"
          onClick={onNextMonth}
          aria-label="Next month"
          className="rounded-lg px-3 py-1.5 text-maroon hover:bg-cream-dark transition"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-500 mb-1">
        {WEEKDAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date) => {
          const iso = toISODate(date);
          const inMonth = date.getMonth() === month;
          const isPast = iso < today;
          const covering = bookedRanges.find(
            (range) => iso >= range.start_date && iso <= range.end_date
          );
          const booked = Boolean(covering);
          const isOff = covering?.type === "off";
          // A picked range can span over an already-unavailable date in
          // between its start and end — that date keeps its own booked/off
          // color, not the "selected" ring, since it isn't really part of it.
          const inSelectedRange =
            selectedRange && !booked && iso >= selectedRange.start && iso <= selectedRange.end;
          const selected = selectedDate === iso || inSelectedRange || Boolean(selectedDates?.has(iso));
          // Any in-month, non-past day gets a hover tooltip — including booked
          // ones, so it must stay non-`disabled` (Firefox suppresses hover
          // events, and therefore `title`, on disabled buttons).
          const interactive = inMonth && !isPast;
          const selectable = interactive && !booked && Boolean(onDateClick);

          let cellClass = "text-neutral-300"; // outside this month
          if (inMonth && isPast) cellClass = "text-neutral-400 bg-neutral-50";
          else if (inMonth && booked) {
            cellClass = isOff
              ? "bg-neutral-500 text-white cursor-default"
              : "bg-maroon text-white cursor-default";
          } else if (inMonth) {
            cellClass = selectable
              ? "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer"
              : "border border-green-200 bg-green-50 text-green-700 cursor-default";
          }

          if (selected) cellClass += " ring-2 ring-gold";

          // The private note if there is one (admin), else a plain status —
          // "Not Available" for an owner-off day, "Booked" for a customer
          // booking, "Available" otherwise. Nothing for past/out-of-month days.
          // Shown via the themed `data-tooltip` styles in index.css;
          // `aria-label` carries the same text for screen readers.
          const tooltip = interactive
            ? covering?.note || (booked ? (isOff ? "Not Available" : "Booked") : "Available")
            : undefined;
          const tooltipClass = !booked && tooltip ? "tooltip-available" : isOff ? "tooltip-off" : "";

          return (
            <button
              key={iso}
              type="button"
              disabled={!interactive}
              onClick={() => selectable && onDateClick(iso)}
              data-tooltip={tooltip}
              aria-label={tooltip ? `${date.getDate()} — ${tooltip}` : undefined}
              className={`aspect-square rounded-lg text-sm flex items-center justify-center transition ${cellClass} ${tooltipClass}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 mt-4 text-xs text-neutral-600">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-green-50 border border-green-200" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-maroon" /> Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-neutral-500" /> Not Available
        </span>
      </div>
    </div>
  );
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
