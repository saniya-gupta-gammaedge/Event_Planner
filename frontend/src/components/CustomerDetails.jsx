import { useQuote } from "../context/QuoteContext";

const fieldClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${
    hasError
      ? "border-red-400 focus:ring-red-400"
      : "border-neutral-300 focus:ring-maroon"
  }`;

export default function CustomerDetails() {
  const { customer, setCustomer, errors, clearError } = useQuote();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomer({ ...customer, [name]: value });
    clearError(name);
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
          <label className="block text-sm font-medium mb-1">Event Date</label>

          <input
            type="date"
            name="eventDate"
            value={customer.eventDate}
            onChange={handleChange}
            className={fieldClass(false)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Event Address</label>

          <textarea
            name="address"
            value={customer.address}
            onChange={handleChange}
            rows={2}
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
            placeholder="Any special requirements..."
            className={`${fieldClass(false)} resize-none`}
          />
        </div>
      </div>
    </div>
  );
}
