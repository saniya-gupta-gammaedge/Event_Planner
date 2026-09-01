from datetime import datetime, timezone
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from db import get_db
from security import require_admin

router = APIRouter(prefix="/api/lawn", tags=["lawn"])

# "booking" — a customer function. "off" — the owner has blocked the date
# (leave, rest, maintenance, ...). Same table; `type` changes the wording
# shown, the color on the admin calendar, and one hard rule: a date already
# committed to a customer booking can't be taken off.
BookingType = Literal["booking", "off"]


class LawnBookingIn(BaseModel):
    start_date: str  # "YYYY-MM-DD"
    end_date: str
    note: str = ""
    type: BookingType = "booking"


class LawnBookingUpdate(BaseModel):
    start_date: str | None = None
    end_date: str | None = None
    note: str | None = None
    type: BookingType | None = None


class LawnRequestIn(BaseModel):
    start_date: str
    end_date: str
    name: str
    phone: str
    note: str = ""


def _overlapping_bookings(conn, start_date, end_date, exclude_id=None):
    """Existing type='booking' rows overlapping [start_date, end_date]."""
    query = """
        SELECT * FROM lawn_bookings
        WHERE type = 'booking' AND start_date <= ? AND end_date >= ?
    """
    params = [end_date, start_date]

    if exclude_id is not None:
        query += " AND id != ?"
        params.append(exclude_id)

    return conn.execute(query, params).fetchall()


def _overlapping_any(conn, start_date, end_date):
    """Existing lawn_bookings rows of *either* type overlapping [start_date, end_date] —
    a request can't land on a date that's already booked or already off."""
    return conn.execute(
        "SELECT * FROM lawn_bookings WHERE start_date <= ? AND end_date >= ?",
        (end_date, start_date),
    ).fetchall()


@router.get("/availability")
def lawn_availability(start: str = Query(...), end: str = Query(...)):
    """Public — which dates in [start, end] are unavailable, and why (booking/off).
    No customer details — `type` is just a category, `note` never leaves the admin API."""
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT start_date, end_date, type FROM lawn_bookings
            WHERE start_date <= ? AND end_date >= ?
            ORDER BY start_date
            """,
            (end, start),
        ).fetchall()

    return [dict(row) for row in rows]


@router.get("/bookings")
def list_lawn_bookings(_admin: None = Depends(require_admin)):
    """Admin — full booking list, including the private note."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM lawn_bookings ORDER BY start_date"
        ).fetchall()

    return [dict(row) for row in rows]


@router.post("/bookings")
def create_lawn_booking(booking: LawnBookingIn, _admin: None = Depends(require_admin)):
    if booking.start_date > booking.end_date:
        raise HTTPException(status_code=400, detail="Start date must be on or before end date.")

    with get_db() as conn:
        if booking.type == "off" and _overlapping_bookings(conn, booking.start_date, booking.end_date):
            raise HTTPException(
                status_code=409,
                detail="Can't mark this range off — it overlaps an existing customer booking.",
            )

        cursor = conn.execute(
            """
            INSERT INTO lawn_bookings (start_date, end_date, note, type, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                booking.start_date,
                booking.end_date,
                booking.note,
                booking.type,
                datetime.now(timezone.utc).isoformat(),
            ),
        )

    return {"id": cursor.lastrowid, "status": "saved"}


@router.patch("/bookings/{booking_id}")
def update_lawn_booking(
    booking_id: int, update: LawnBookingUpdate, _admin: None = Depends(require_admin)
):
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM lawn_bookings WHERE id = ?", (booking_id,)
        ).fetchone()

        if row is None:
            raise HTTPException(status_code=404, detail="Booking not found.")

        start_date = update.start_date if update.start_date is not None else row["start_date"]
        end_date = update.end_date if update.end_date is not None else row["end_date"]
        note = update.note if update.note is not None else row["note"]
        booking_type = update.type if update.type is not None else row["type"]

        if start_date > end_date:
            raise HTTPException(status_code=400, detail="Start date must be on or before end date.")

        if booking_type == "off" and _overlapping_bookings(conn, start_date, end_date, exclude_id=booking_id):
            raise HTTPException(
                status_code=409,
                detail="Can't mark this range off — it overlaps an existing customer booking.",
            )

        conn.execute(
            "UPDATE lawn_bookings SET start_date = ?, end_date = ?, note = ?, type = ? WHERE id = ?",
            (start_date, end_date, note, booking_type, booking_id),
        )

    return {"status": "updated"}


@router.delete("/bookings/{booking_id}")
def delete_lawn_booking(booking_id: int, _admin: None = Depends(require_admin)):
    with get_db() as conn:
        cursor = conn.execute("DELETE FROM lawn_bookings WHERE id = ?", (booking_id,))

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Booking not found.")

    return {"status": "deleted"}


@router.post("/requests")
def create_lawn_request(request: LawnRequestIn):
    """Public — a customer requests a date. This does NOT block it; it just
    lands in the admin's queue as 'pending' until they accept it (once the
    advance payment is sorted out, over WhatsApp/call — not on this site)."""
    if request.start_date > request.end_date:
        raise HTTPException(status_code=400, detail="Start date must be on or before end date.")

    with get_db() as conn:
        if _overlapping_any(conn, request.start_date, request.end_date):
            raise HTTPException(status_code=409, detail="That date is no longer available.")

        cursor = conn.execute(
            """
            INSERT INTO lawn_requests (start_date, end_date, name, phone, note, status, created_at)
            VALUES (?, ?, ?, ?, ?, 'pending', ?)
            """,
            (
                request.start_date,
                request.end_date,
                request.name,
                request.phone,
                request.note,
                datetime.now(timezone.utc).isoformat(),
            ),
        )

    return {"id": cursor.lastrowid, "status": "submitted"}


@router.get("/requests")
def list_lawn_requests(_admin: None = Depends(require_admin)):
    """Admin — every request, any status."""
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM lawn_requests ORDER BY created_at DESC"
        ).fetchall()

    return [dict(row) for row in rows]


@router.post("/requests/{request_id}/accept")
def accept_lawn_request(request_id: int, _admin: None = Depends(require_admin)):
    """Admin — call once the advance payment is received. Turns the request
    into a real booking (blocking the date) and marks it accepted."""
    with get_db() as conn:
        req = conn.execute(
            "SELECT * FROM lawn_requests WHERE id = ?", (request_id,)
        ).fetchone()

        if req is None:
            raise HTTPException(status_code=404, detail="Request not found.")

        if req["status"] != "pending":
            raise HTTPException(status_code=400, detail="This request has already been handled.")

        if _overlapping_any(conn, req["start_date"], req["end_date"]):
            raise HTTPException(
                status_code=409,
                detail="Those dates aren't available anymore — another booking got there first.",
            )

        note = f"{req['name']} ({req['phone']})"
        if req["note"]:
            note += f" — {req['note']}"

        conn.execute(
            """
            INSERT INTO lawn_bookings (start_date, end_date, note, type, created_at)
            VALUES (?, ?, ?, 'booking', ?)
            """,
            (req["start_date"], req["end_date"], note, datetime.now(timezone.utc).isoformat()),
        )

        conn.execute("UPDATE lawn_requests SET status = 'accepted' WHERE id = ?", (request_id,))

    return {"status": "accepted"}


@router.post("/requests/{request_id}/reject")
def reject_lawn_request(request_id: int, _admin: None = Depends(require_admin)):
    with get_db() as conn:
        cursor = conn.execute(
            "UPDATE lawn_requests SET status = 'rejected' WHERE id = ? AND status = 'pending'",
            (request_id,),
        )

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Pending request not found.")

    return {"status": "rejected"}
