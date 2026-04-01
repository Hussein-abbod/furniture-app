from fastapi import Request, HTTPException, status
import time
from typing import Dict, Tuple

# Simple in-memory rate limiter
# Format: { ip_address: (request_count, window_start_time) }
_rate_limits: Dict[str, Tuple[int, float]] = {}

def rate_limit_login(request: Request):
    """
    Limits login attempts to 5 per minute per IP address.
    """
    client_ip = request.client.host
    current_time = time.time()
    RATE_LIMIT_DURATION = 60  # seconds
    MAX_REQUESTS = 5

    if client_ip in _rate_limits:
        req_count, window_start = _rate_limits[client_ip]
        if current_time - window_start < RATE_LIMIT_DURATION:
            if req_count >= MAX_REQUESTS:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many login attempts. Please try again later."
                )
            _rate_limits[client_ip] = (req_count + 1, window_start)
        else:
            # Reset window
            _rate_limits[client_ip] = (1, current_time)
    else:
        _rate_limits[client_ip] = (1, current_time)

    return True
