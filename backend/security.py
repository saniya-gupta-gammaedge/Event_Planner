
import hashlib
import hmac
import os
import time
from collections import defaultdict

from fastapi import Header, HTTPException

# Set a real ADMIN_PASSWORD in the environment before deploying — this
# fallback is only so local development works out of the box.
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Anil9425")
TOKEN_TTL_SECONDS = 12 * 60 * 60  # admin stays logged in for 12 hours


def _sign(payload: str) -> str:
    return hmac.new(ADMIN_PASSWORD.encode(), payload.encode(), hashlib.sha256).hexdigest()


def create_token() -> str:
    """expiry.signature — no session store needed, the signature is the proof."""
    expiry = int(time.time()) + TOKEN_TTL_SECONDS
    return f"{expiry}.{_sign(str(expiry))}"


def verify_token(token: str) -> bool:
    try:
        expiry_str, signature = token.split(".", 1)
    except ValueError:
        return False

    if not hmac.compare_digest(_sign(expiry_str), signature):
        return False

    return int(expiry_str) > time.time()


def require_admin(authorization: str | None = Header(default=None)):
    """FastAPI dependency — attach with `Depends(require_admin)` on any admin route."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    if not verify_token(authorization.removeprefix("Bearer ")):
        raise HTTPException(status_code=401, detail="Session expired, please log in again")


# In-memory login-attempt tracking (per process — resets on restart, which is
# fine for a single-admin site this size). Keyed by client IP.
MAX_LOGIN_ATTEMPTS = 5
LOGIN_LOCKOUT_SECONDS = 15 * 60
_failed_logins: dict[str, list[float]] = defaultdict(list)


def recent_failures(ip: str) -> list[float]:
    cutoff = time.time() - LOGIN_LOCKOUT_SECONDS
    attempts = [t for t in _failed_logins[ip] if t > cutoff]
    _failed_logins[ip] = attempts
    return attempts


def record_failure(ip: str) -> None:
    _failed_logins[ip].append(time.time())


def clear_failures(ip: str) -> None:
    _failed_logins.pop(ip, None)
