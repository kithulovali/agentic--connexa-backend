import os
from typing import Any

import cloudinary
import cloudinary.uploader
from cloudinary.exceptions import Error as CloudinaryError


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024


def _configure_cloudinary() -> None:
    cloudinary_url = os.getenv("CLOUDINARY_URL", "").strip()
    if not cloudinary_url:
        raise RuntimeError(
            "Cloudinary is not configured. Set CLOUDINARY_URL using the value "
            "provided in Cloudinary Console > Settings > API Keys."
        )
    if not cloudinary_url.startswith("cloudinary://"):
        raise RuntimeError(
            "CLOUDINARY_URL must use the format cloudinary://<api_key>:<api_secret>@<cloud_name>."
        )

    # The Cloudinary Python SDK reads CLOUDINARY_URL automatically.
    # Keep secure delivery enabled for generated asset URLs.
    cloudinary.config(secure=True)


def upload_image(file_obj: Any, filename: str) -> dict:
    _configure_cloudinary()
    try:
        result = cloudinary.uploader.upload(
            file_obj,
            folder="urban-scenery/products",
            resource_type="image",
            use_filename=True,
            unique_filename=True,
            filename_override=filename,
            overwrite=False,
        )
    except CloudinaryError as exc:
        raise RuntimeError(f"Cloudinary upload failed: {exc}") from exc

    return {
        "url": result.get("secure_url"),
        "public_id": result.get("public_id"),
        "format": result.get("format"),
        "width": result.get("width"),
        "height": result.get("height"),
        "bytes": result.get("bytes"),
    }
