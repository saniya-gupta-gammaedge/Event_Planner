from fastapi import FastAPI

app = FastAPI(title="Celebrare Events API")


@app.get("/api/health")
def health():
    return {"status": "ok"}
