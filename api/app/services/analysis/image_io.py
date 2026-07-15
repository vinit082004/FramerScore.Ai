import uuid
from dataclasses import dataclass

import cv2
import numpy as np
from PIL import Image

from app.core.config import UPLOADS_DIR, THUMBNAIL_MAX_DIM


@dataclass
class LoadedImage:
    id: str
    bgr: np.ndarray
    width: int
    height: int
    original_path: str
    thumbnail_path: str


def decode_image(raw_bytes: bytes) -> np.ndarray:
    arr = np.frombuffer(raw_bytes, dtype=np.uint8)
    bgr = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    if bgr is None:
        raise ValueError("Could not decode image data")
    return bgr


def save_image(raw_bytes: bytes, extension: str) -> LoadedImage:
    image_id = uuid.uuid4().hex
    bgr = decode_image(raw_bytes)
    height, width = bgr.shape[:2]

    original_name = f"{image_id}{extension}"
    original_path = UPLOADS_DIR / original_name
    original_path.write_bytes(raw_bytes)

    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(rgb)
    pil_image.thumbnail((THUMBNAIL_MAX_DIM, THUMBNAIL_MAX_DIM))
    thumbnail_name = f"{image_id}_thumb.jpg"
    thumbnail_path = UPLOADS_DIR / thumbnail_name
    pil_image.convert("RGB").save(thumbnail_path, "JPEG", quality=85)

    return LoadedImage(
        id=image_id,
        bgr=bgr,
        width=width,
        height=height,
        original_path=f"/storage/uploads/{original_name}",
        thumbnail_path=f"/storage/uploads/{thumbnail_name}",
    )
