import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { generateWhatsAppMessage } from "../utils/whatsappQuote";
import { whatsappLink } from "../data/company";

const QuoteContext = createContext();

const STORAGE_KEY = "dhote-quote";

const emptyCustomer = {
  name: "",
  phone: "",
  eventDate: "",
  address: "",
  note: "",
};

function loadStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * One quote line per item *and* duration, so "20 chairs for 1 day" and
 * "50 chairs for 3 days" can both sit in the same quote.
 */
function lineIdFor({ id, durationType, duration }) {
  return `${id}-${durationType}-${duration}`;
}

export function QuoteProvider({ children }) {
  const [quoteItems, setQuoteItems] = useState(() => loadStored()?.items ?? []);
  const [customer, setCustomer] = useState(() => ({
    ...emptyCustomer,
    ...loadStored()?.customer,
  }));
  const [errors, setErrors] = useState({});

  // Keep the quote across refreshes — people build these over several minutes.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items: quoteItems, customer })
      );
    } catch {
      // Private mode or full storage: the quote simply won't survive a refresh.
    }
  }, [quoteItems, customer]);

  const addToQuote = (item) => {
    const lineId = lineIdFor(item);

    setQuoteItems((prev) => {
      const existing = prev.find((line) => line.lineId === lineId);
      if (!existing) return [...prev, { ...item, lineId }];

      // Same item for the same duration — add the quantities together.
      const quantity = existing.quantity + item.quantity;

      return prev.map((line) =>
        line.lineId === lineId
          ? {
              ...line,
              quantity,
              totalPrice: quantity * line.duration * line.pricePerUnit,
            }
          : line
      );
    });
  };

  const removeFromQuote = (lineId) =>
    setQuoteItems((prev) => prev.filter((line) => line.lineId !== lineId));

  const clearQuote = () => setQuoteItems([]);

  const totalPrice = useMemo(
    () => quoteItems.reduce((total, line) => total + line.totalPrice, 0),
    [quoteItems]
  );

  /** Returns true when the quote can be sent; otherwise fills `errors`. */
  const validate = () => {
    const found = {};

    if (quoteItems.length === 0) {
      found.items = "Add at least one rental item.";
    }

    if (!customer.name.trim()) {
      found.name = "Please enter your name.";
    }

    const digits = customer.phone.replace(/\D/g, "");
    if (!digits) {
      found.phone = "Please enter your phone number.";
    } else if (digits.length !== 10) {
      found.phone = "Enter a valid 10-digit phone number.";
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (!customer.eventDate) {
      found.eventDate = "Please select your event date.";
    } else if (customer.eventDate < todayStr) {
      found.eventDate = "Event date can't be in the past.";
    }

    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const clearError = (field) =>
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });

  /**
   * Validates, saves the submission on the backend, then opens WhatsApp.
   * Returns true on success so callers (the quote panel or the customer
   * details form — either can trigger a send) know whether to send.
   */
  const requestQuote = () => {
    if (!validate()) return false;

    const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
    fetch(`${apiUrl}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer, items: quoteItems, totalPrice }),
    }).catch(() => {
      // Offline or backend down — the WhatsApp message is still the source of truth.
    });

    const message = generateWhatsAppMessage(customer, quoteItems, totalPrice);
    window.open(whatsappLink(message), "_blank", "noopener");
    return true;
  };

  return (
    <QuoteContext.Provider
      value={{
        // Quote
        quoteItems,
        addToQuote,
        removeFromQuote,
        clearQuote,
        totalPrice,

        // Customer
        customer,
        setCustomer,

        // Validation
        errors,
        validate,
        clearError,
        requestQuote,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  return useContext(QuoteContext);
}
