import { useQuote } from "../context/QuoteContext";

const fieldClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:ring-red-400"
      : "border-neutral-300 focus:ring-maroon"
  }`;

const today = new Date().toISOString().slice(0, 10);

export default function CustomerDetails() {
  const { customer, setCustomer, errors, clearError, quoteItems, requestQuote } =
    useQuote();

  const handleChange = (e) => {
    const { name, value } = e.target;

    let nextValue = value;
    if (name === "phone") {
      // Phone is digits-only, capped at 10.
      nextValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "name") {
      // Name is letters and spaces only.
      nextValue = value.replace(/[^a-zA-Z ]/g, "");
    }

    setCustomer({ ...customer, [name]: nextValue });
    clearError(name);
  };

  // Drop stray leading/trailing spaces once the person leaves the field.
  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name !== "name" && name !== "address") return;

    const trimmed = value.trim();
    if (trimmed !== value) setCustomer({ ...customer, [name]: trimmed });
  };

  const handleSubmit = () => {
    if (requestQuote()) return;

    // Every other field lives right here already — only a missing item list
    // is up in the quote panel above, so that's the one case worth scrolling for.
    if (quoteItems.length === 0) {
      document
        .getElementById("quote-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      id="customer-details"
      className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm"
    >
      <h2 className="text-xl font-bold text-maroon mb-5">Customer Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>

          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            aria-invalid={Boolean(errors.name)}
            className={fieldClass(errors.name)}
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>

          <input
            type="tel"
            name="phone"
            inputMode="numeric"
            maxLength={10}
            value={customer.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            aria-invalid={Boolean(errors.phone)}
            className={fieldClass(errors.phone)}
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Event Date <span className="text-red-500">*</span>
          </label>

          <input
            type="date"
            name="eventDate"
            min={today}
            value={customer.eventDate}
            onChange={handleChange}
            aria-invalid={Boolean(errors.eventDate)}
            className={fieldClass(errors.eventDate)}
          />

          {errors.eventDate && (
            <p className="mt-1 text-sm text-red-600">{errors.eventDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Event Address</label>

          <textarea
            name="address"
            value={customer.address}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={2}
            maxLength={200}
            placeholder="Enter event address"
            className={`${fieldClass(false)} resize-none`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Additional Note</label>

          <textarea
            name="note"
            value={customer.note}
            onChange={handleChange}
            rows={2}
            maxLength={500}
            placeholder="Any special requirements..."
            className={`${fieldClass(false)} resize-none`}
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-green-600 text-white py-2.5 font-medium hover:bg-green-700 transition"
        >
          Send List on WhatsApp
        </button>
      </div>
    </div>
  );
}
