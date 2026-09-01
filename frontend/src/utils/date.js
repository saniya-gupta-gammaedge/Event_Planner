/** "YYYY-MM-DD" in local time — never toISOString(), which shifts across UTC midnight. */
export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const todayISO = () => toISODate(new Date());

/**
 * Full 6-week (42-day) grid for the given month, including the trailing/leading
 * days of the adjacent months so every row is a complete week.
 */
export function getMonthGrid(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    return date;
  });
}

export function isDateBooked(iso, bookedRanges) {
  return bookedRanges.some((range) => iso >= range.start_date && iso <= range.end_date);
}
