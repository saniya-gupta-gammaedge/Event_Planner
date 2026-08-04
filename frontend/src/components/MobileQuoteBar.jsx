import { useQuote } from "../context/QuoteContext";

/**
 * On phones the quote panel sits far below the rental cards, so adding an item
 * looks like nothing happened. This bar keeps the running total in view.
 */
export default function MobileQuoteBar({ onView }) {
  const { quoteItems, totalPrice } = useQuote();

  if (quoteItems.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-gold bg-white px-4 py-3 shadow-[0_-2px_12px_rgba(0,0,0,0.12)] lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-neutral-500">
            {quoteItems.length} item{quoteItems.length > 1 ? "s" : ""} in list
          </p>

          <p className="text-lg font-bold text-green-600">
            ₹{totalPrice.toLocaleString("en-IN")}
          </p>
        </div>

        <button
          type="button"
          onClick={onView}
          className="shrink-0 rounded-lg bg-maroon px-5 py-2.5 font-medium text-white hover:bg-maroon-dark transition"
        >
          View List
        </button>
      </div>
    </div>
  );
}
