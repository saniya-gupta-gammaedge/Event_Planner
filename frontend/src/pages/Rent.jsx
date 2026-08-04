import { useState } from "react";
import rentals from "../data/rentals.json";
import RentalCard from "../components/RentalCard";
import QuoteSummary from "../components/QuoteSummary";
import CustomerDetails from "../components/CustomerDetails";
import MobileQuoteBar from "../components/MobileQuoteBar";
import { whatsappLink, callLink } from "../data/company";

export default function Rent() {
  const [selectedCategory, setSelectedCategory] = useState(rentals[0]);

  const scrollToQuote = () =>
    document
      .getElementById("quote-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    /* pb-28 leaves room for the mobile quote bar pinned to the bottom. */
    <div className="max-w-7xl mx-auto px-4 py-8 pb-28 lg:pb-8">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-maroon mb-2 text-center">
        Rent Items
      </h1>

      <p className="text-neutral-600 mb-8 text-center">
        Select a category, calculate the estimated rental cost, and add items to
        your list.
      </p>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 mb-10">
        {rentals.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-lg border px-3 py-3 sm:px-4 sm:py-4 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center transition ${
              selectedCategory.id === category.id
                ? "bg-maroon text-white border-maroon"
                : "bg-white border-neutral-200 hover:border-gold"
            }`}
          >
            <span className="text-2xl">{category.icon}</span>
            <span className="text-sm sm:text-base font-medium">
              {category.title}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rental Items */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl sm:text-2xl font-semibold text-maroon mb-6">
            {selectedCategory.title}
          </h2>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {selectedCategory.items.map((item) => (
              <RentalCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Quote panel — sticky beside the items on desktop, stacked below on mobile */}
        <div
          id="quote-panel"
          className="lg:sticky lg:top-24 h-fit space-y-6 scroll-mt-24"
        >
          <QuoteSummary />

          <CustomerDetails />
        </div>
      </div>

      {/* Contact Section */}
      <div className="text-center mt-12">
        <p className="text-neutral-700 mb-4">
          Need multiple rental items? Contact us for the best price.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={whatsappLink(
              "Hello, I would like to get a quotation for rental items."
            )}
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

      <MobileQuoteBar onView={scrollToQuote} />
    </div>
  );
}
