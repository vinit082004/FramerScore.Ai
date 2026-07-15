import time
from datetime import datetime, timezone

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import ALLOWED_CONTENT_TYPES, MAX_UPLOAD_BYTES
from app.models.schemas import AnalysisResult
from app.services.analysis.image_io import save_image
from app.services.analysis.scoring import run_analysis
from app.storage.db import save_analysis

router = APIRouter()

_EXT_BY_CONTENT_TYPE = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp"}


@router.post("/analyze", response_model=AnalysisResult)
async def analyze_image(file: UploadFile = File(...)) -> AnalysisResult:
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PNG, JPEG, or WEBP.")

    raw = await file.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File exceeds the 20MB size limit.")

    try:
        loaded = save_image(raw, _EXT_BY_CONTENT_TYPE[file.content_type])
    except ValueError:
        raise HTTPException(status_code=400, detail="Could not read this image file.")

    started_at = time.perf_counter()
    analysis = run_analysis(loaded.bgr, loaded.width, loaded.height)
    processing_time_seconds = round(time.perf_counter() - started_at, 2)

    result = AnalysisResult(
        id=loaded.id,
        filename=file.filename or "upload",
        created_at=datetime.now(timezone.utc).isoformat(),
        image_url=loaded.original_path,
        thumbnail_url=loaded.thumbnail_path,
        width=loaded.width,
        height=loaded.height,
        file_size_bytes=len(raw),
        processing_time_seconds=processing_time_seconds,
        **analysis,
    )
    save_analysis(result)
    return result
