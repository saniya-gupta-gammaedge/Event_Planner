import { useQuote } from "../context/QuoteContext";

export default function QuoteSummary() {
  const {
    quoteItems,
    removeFromQuote,
    clearQuote,
    totalPrice,
    errors,
    requestQuote,
  } = useQuote();

  const handleRequestQuote = () => {
    if (!requestQuote()) {
      // The name/phone fields sit below this panel — bring them into view.
      document
        .getElementById("customer-details")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-maroon">Your List</h2>

        <span className="rounded-full bg-maroon text-white text-xs px-2 py-1">
          {quoteItems.length}
        </span>
      </div>

      {quoteItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-neutral-500">No items added yet.</p>

          {errors.items && (
            <p className="mt-2 text-sm text-red-600">{errors.items}</p>
          )}
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {quoteItems.map((item) => (
              <div key={item.lineId} className="border-b border-neutral-200 pb-3">
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-neutral-800 break-words">
                      {item.name}
                    </h3>

                    <p className="text-sm text-neutral-500">
                      {item.quantity} {item.unit}
                      {item.quantity > 1 ? "s" : ""} × {item.duration}{" "}
                      {item.durationType}
                      {item.duration > 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-bold text-green-600">
                      ₹{item.totalPrice.toLocaleString("en-IN")}
                    </p>

                    <button
                      onClick={() => removeFromQuote(item.lineId)}
                      className="text-xs text-red-500 hover:text-red-700 mt-1"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-neutral-700">Grand Total</span>

              <span className="text-2xl font-bold text-green-600">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="mb-4 text-xs text-neutral-500">
              This is an estimate. Delivery, setup and any deposit are confirmed
              when we send your final quotation.
            </p>

            <button
              onClick={handleRequestQuote}
              className="w-full rounded-lg bg-green-600 text-white py-2.5 font-medium hover:bg-green-700 transition"
            >
              Send List on WhatsApp
            </button>

            <button
              onClick={clearQuote}
              className="w-full mt-2 text-sm text-red-600 hover:underline"
            >
              Clear All
            </button>
          </div>
        </>
      )}
    </div>
  );
}
