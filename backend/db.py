import sqlite3
from contextlib import contextmanager
from pathlib import Path

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

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS lawn_bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                note TEXT NOT NULL DEFAULT '',
                type TEXT NOT NULL DEFAULT 'booking',
                created_at TEXT NOT NULL
            )
            """
        )

        # Migrate a lawn_bookings table created before `type` existed.
        columns = {row["name"] for row in conn.execute("PRAGMA table_info(lawn_bookings)")}
        if "type" not in columns:
            conn.execute(
                "ALTER TABLE lawn_bookings ADD COLUMN type TEXT NOT NULL DEFAULT 'booking'"
            )

        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS lawn_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                note TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL
            )
            """
        )
