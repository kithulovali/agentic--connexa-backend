"""Reverse-geocode browser-provided coordinates for checkout delivery addresses.

Uses OpenStreetMap Nominatim. Requests are cached and serialized to respect the
public service's usage policy. The returned address is a suggestion and must
be confirmed by the customer.
"""
import asyncio
import time
from typing import Any

import httpx
from fastapi import APIRouter, HTTPException, Query, Request, status

from services.request_limits import enforce_rate_limit

router = APIRouter(prefix="/geolocation", tags=["Geolocation"])

_NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"
_USER_AGENT = (
    "UrbanSceneryVenturesCheckout/1.0 "
    "(https://agentic-connexa-backend.onrender.com)"
)
_CACHE_TTL_SECONDS = 900
_cache: dict[tuple[float, float], tuple[float, dict[str, Any]]] = {}
_request_lock = asyncio.Lock()
_last_upstream_request = 0.0


@router.get("/reverse")
async def reverse_geocode(
    request: Request,
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    """Return a human-readable address for the supplied device coordinates."""
    enforce_rate_limit(request, "reverse-geocode", limit=5, window_seconds=60)

    # Five decimal places is approximately metre-level precision and avoids
    # storing unnecessarily precise device coordinates in the cache key.
    cache_key = (round(latitude, 5), round(longitude, 5))
    now = time.monotonic()
    cached = _cache.get(cache_key)
    if cached and now - cached[0] < _CACHE_TTL_SECONDS:
        return cached[1]

    global _last_upstream_request
    async with _request_lock:
        # Check again after acquiring the lock in case another request filled it.
        now = time.monotonic()
        cached = _cache.get(cache_key)
        if cached and now - cached[0] < _CACHE_TTL_SECONDS:
            return cached[1]

        wait_seconds = 1.05 - (now - _last_upstream_request)
        if wait_seconds > 0:
            await asyncio.sleep(wait_seconds)

        try:
            async with httpx.AsyncClient(
                timeout=httpx.Timeout(8.0),
                headers={"User-Agent": _USER_AGENT, "Accept-Language": "en"},
            ) as client:
                response = await client.get(
                    _NOMINATIM_URL,
                    params={
                        "format": "jsonv2",
                        "lat": latitude,
                        "lon": longitude,
                        "zoom": 18,
                        "addressdetails": 1,
                    },
                )
                _last_upstream_request = time.monotonic()
                response.raise_for_status()
                result = response.json()
        except (httpx.HTTPError, ValueError) as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="The address service is temporarily unavailable. Enter your address manually.",
            ) from exc

    display_name = result.get("display_name")
    if not isinstance(display_name, str) or not display_name.strip():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No address could be resolved for these coordinates.",
        )

    address = result.get("address") or {}
    payload = {
        "display_name": display_name,
        "address": address,
        "latitude": latitude,
        "longitude": longitude,
        "provider": "OpenStreetMap",
        "attribution": "© OpenStreetMap contributors",
    }
    _cache[cache_key] = (time.monotonic(), payload)

    # Keep the in-process cache bounded.
    if len(_cache) > 1000:
        expired_before = time.monotonic() - _CACHE_TTL_SECONDS
        for key, (created_at, _) in list(_cache.items()):
            if created_at < expired_before:
                _cache.pop(key, None)

    return payload
