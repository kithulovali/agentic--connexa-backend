from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from core.security import get_current_admin
from services.cloudinary_service import (
    ALLOWED_IMAGE_TYPES,
    MAX_IMAGE_SIZE_BYTES,
    upload_image,
)

router = APIRouter(prefix="/uploads", tags=["Media Uploads"])


@router.post("/image", status_code=status.HTTP_201_CREATED, dependencies=[Depends(get_current_admin)])
def upload_product_image(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported image type. Upload a JPEG, PNG, WEBP, or GIF image.",
        )

    contents = file.file.read(MAX_IMAGE_SIZE_BYTES + 1)
    if not contents:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The uploaded file is empty.")
    if len(contents) > MAX_IMAGE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image exceeds the 8 MB upload limit.",
        )

    file.file.seek(0)
    try:
        uploaded = upload_image(file.file, file.filename or "product-image")
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    finally:
        file.file.close()

    if not uploaded.get("url") or not uploaded.get("public_id"):
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Cloudinary did not return a valid image URL.",
        )

    return uploaded
