from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import init_db
from routers import auth, lawn, quotes

app = FastAPI(title="Celebrare Events API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(quotes.router)
app.include_router(lawn.router)
app.include_router(auth.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
