import { useEffect, useState } from "react";
import { adminFetch } from "../utils/adminApi";

function formatRange(r) {
  return r.start_date === r.end_date ? r.start_date : `${r.start_date} → ${r.end_date}`;
}

const STATUS_STYLE = {
  pending: "bg-gold/20 text-maroon-dark",
  accepted: "bg-green-100 text-green-700",
  rejected: "bg-neutral-200 text-neutral-600",
};

/**
 * Customer-submitted date requests, awaiting the owner's decision. Accepting
 * one turns it into a real booking (via the backend) — call `onAccepted` so
 * the parent's booking list/calendar refreshes too.
 */
export default function LawnRequestsPanel({ token, onExpired, onAccepted }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHandled, setShowHandled] = useState(false);
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    adminFetch("/api/lawn/requests", token, onExpired)
      .then(setRequests)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (id, action) => {
    setActionError("");
    setBusyId(id);
    try {
      await adminFetch(`/api/lawn/requests/${id}/${action}`, token, onExpired, { method: "POST" });
      load();
      if (action === "accept") onAccepted?.();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const visible = showHandled ? requests : requests.filter((r) => r.status === "pending");
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <h2 className="text-lg font-bold text-maroon flex items-center gap-2">
          Booking Requests
          {pendingCount > 0 && (
            <span className="rounded-full bg-maroon text-white text-xs px-2 py-0.5">
              {pendingCount}
            </span>
          )}
        </h2>

        <button
          type="button"
          onClick={() => setShowHandled((v) => !v)}
          className="text-sm text-maroon hover:underline"
        >
          {showHandled ? "Hide handled" : "Show handled"}
        </button>
      </div>

      {actionError && <p className="text-sm text-red-600 mb-2">{actionError}</p>}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-neutral-500">
          {showHandled ? "No requests yet." : "No pending requests."}
        </p>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {visible.map((r) => (
            <li key={r.id} className="border-b border-neutral-200 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-neutral-800">{formatRange(r)}</p>
                  <p className="text-sm text-neutral-600">
                    {r.name} — {r.phone}
                  </p>
                  {r.note && <p className="text-sm text-neutral-500 truncate">{r.note}</p>}
                </div>

                <span
                  className={`shrink-0 rounded-full text-xs px-2 py-0.5 capitalize ${STATUS_STYLE[r.status]}`}
                >
                  {r.status}
                </span>
              </div>

              {r.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => act(r.id, "accept")}
                    disabled={busyId === r.id}
                    className="rounded-lg bg-green-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-green-700 transition disabled:opacity-60"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => act(r.id, "reject")}
                    disabled={busyId === r.id}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-50 transition disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
