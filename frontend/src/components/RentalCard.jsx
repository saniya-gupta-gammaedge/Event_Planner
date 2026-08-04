import { useEffect, useMemo, useState } from "react";
import { useQuote } from "../context/QuoteContext";

const MAX_QUANTITY = 500;
const MAX_DURATION = 30;

/** Keeps a number input inside sensible bounds, and survives an empty field. */
const clamp = (value, max) => Math.min(max, Math.max(1, Number(value) || 1));

export default function RentalCard({ item }) {
  const { addToQuote } = useQuote();

  const [quantity, setQuantity] = useState(1);
  const [durationType, setDurationType] = useState(
    item.pricing.hour ? "hour" : "day"
  );
  const [duration, setDuration] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const available = item.available !== false;

  const estimatedPrice = useMemo(() => {
    const rate = item.pricing[durationType] || 0;
    return quantity * duration * rate;
  }, [quantity, duration, durationType, item]);

  // Let the "Added" confirmation fade back to the normal button.
  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [justAdded]);

  const handleAddToQuote = () => {
    addToQuote({
      id: item.id,
      name: item.name,
      unit: item.unit,
      quantity,
      duration,
      durationType,
      pricePerUnit: item.pricing[durationType],
      totalPrice: estimatedPrice,
    });

    setJustAdded(true);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition p-4 sm:p-5">
      <h3 className="text-lg sm:text-xl font-semibold text-maroon">{item.name}</h3>

      {item.description && (
        <p className="mt-1 text-sm text-neutral-600">{item.description}</p>
      )}

      {/* Price Badges */}
      <div className="flex flex-wrap gap-2 mt-3 mb-5">
        {"hour" in item.pricing && (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
            ₹{item.pricing.hour} / Hour
          </span>
        )}

        {"day" in item.pricing && (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
            ₹{item.pricing.day} / Day
          </span>
        )}

        {!available && (
          <span className="px-3 py-1 rounded-full bg-neutral-200 text-neutral-600 text-sm font-medium">
            Currently unavailable
          </span>
        )}
      </div>

      {/* Quantity + Duration */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-neutral-700">
            Quantity{item.unit ? ` (${item.unit})` : ""}
          </label>

          <input
            type="number"
            min="1"
            max={MAX_QUANTITY}
            value={quantity}
            onChange={(e) => setQuantity(clamp(e.target.value, MAX_QUANTITY))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-neutral-700">Duration</label>

          <input
            type="number"
            min="1"
            max={MAX_DURATION}
            value={duration}
            onChange={(e) => setDuration(clamp(e.target.value, MAX_DURATION))}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </div>
      </div>

      {/* Rental Type */}
      <div className="mb-5">
        <label className="text-sm font-medium text-neutral-700">Rental Type</label>

        <select
          value={durationType}
          onChange={(e) => setDurationType(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
        >
          {"hour" in item.pricing && <option value="hour">Hours</option>}
          {"day" in item.pricing && <option value="day">Days</option>}
        </select>
      </div>

      {/* Estimated Price */}
      <div className="rounded-lg bg-neutral-100 p-4 mb-5">
        <p className="text-sm text-neutral-500">Estimated Price</p>

        <p className="text-2xl sm:text-3xl font-bold text-green-600">
          ₹{estimatedPrice.toLocaleString("en-IN")}
        </p>
      </div>

      <button
        onClick={handleAddToQuote}
        disabled={!available}
        className={`w-full rounded-lg py-2.5 font-medium text-white transition ${
          !available
            ? "bg-neutral-300 cursor-not-allowed"
            : justAdded
              ? "bg-green-600"
              : "bg-maroon hover:bg-maroon-dark"
        }`}
      >
        {justAdded ? "✓ Added to List" : "+ Add to List"}
      </button>
    </div>
  );
}
