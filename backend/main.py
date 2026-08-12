import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Celebrare Events API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = Path(__file__).parent / "quotes.db"


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS quotes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                event_date TEXT,
                address TEXT,
                note TEXT,
                items TEXT NOT NULL,
                total_price REAL NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )


init_db()


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


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/quotes")
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


@app.get("/api/quotes")
def list_quotes():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM quotes ORDER BY created_at DESC"
        ).fetchall()

    return [dict(row) for row in rows]
