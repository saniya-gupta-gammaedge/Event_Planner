from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from db import get_db

router = APIRouter(prefix="/api/quotes", tags=["quotes"])


class QuoteItemIn(BaseModel):
    name: str
    quantity: int
    unit: str
    duration: int
    durationType: str
    totalPrice: float


class CustomerIn(BaseModel):
    name: str
    phone: str
    eventDate: str = ""
    address: str = ""
    note: str = ""


class QuoteRequest(BaseModel):
    customer: CustomerIn
    items: list[QuoteItemIn]
    totalPrice: float


@router.post("")
def create_quote(quote: QuoteRequest):
    if not quote.items:
        raise HTTPException(status_code=400, detail="Quote must include at least one item.")

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO quotes (name, phone, event_date, address, note, items, total_price, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                quote.customer.name,
                quote.customer.phone,
                quote.customer.eventDate,
                quote.customer.address,
                quote.customer.note,
                quote.model_dump_json(include={"items"}),
                quote.totalPrice,
                datetime.now(timezone.utc).isoformat(),
            ),
        )

    return {"id": cursor.lastrowid, "status": "saved"}


@router.get("")
def list_quotes():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM quotes ORDER BY created_at DESC"
        ).fetchall()

    return [dict(row) for row in rows]
