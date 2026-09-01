import hmac

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from security import (
    ADMIN_PASSWORD,
    MAX_LOGIN_ATTEMPTS,
    clear_failures,
    create_token,
    record_failure,
    recent_failures,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginIn(BaseModel):
    password: str


@router.post("/login")
def login(credentials: LoginIn, request: Request):
    ip = request.client.host if request.client else "unknown"

    # The correct password always works, even mid-lockout — the lockout only
    # throttles *wrong* guesses (brute-forcing), it never locks out the owner.
    if hmac.compare_digest(credentials.password, ADMIN_PASSWORD):
        clear_failures(ip)
        return {"token": create_token()}

    if len(recent_failures(ip)) >= MAX_LOGIN_ATTEMPTS:
        raise HTTPException(
            status_code=429,
            detail="Too many failed attempts. Try again in a few minutes.",
        )

    record_failure(ip)
    raise HTTPException(status_code=401, detail="Incorrect password")
