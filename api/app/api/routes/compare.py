import time
from datetime import datetime, timezone

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.config import ALLOWED_CONTENT_TYPES, MAX_UPLOAD_BYTES
from app.models.schemas import AnalysisResult, CompareResponse
from app.services.analysis.image_io import save_image
from app.services.analysis.scoring import run_analysis
from app.storage.db import save_analysis

router = APIRouter()

_EXT_BY_CONTENT_TYPE = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp"}


@router.post("/compare", response_model=CompareResponse)
async def compare_images(files: list[UploadFile] = File(...)) -> CompareResponse:
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="Upload at least two images to compare.")
    if len(files) > 6:
        raise HTTPException(status_code=400, detail="You can compare up to 6 images at a time.")

    results: list[AnalysisResult] = []
    for file in files:
        if file.content_type not in ALLOWED_CONTENT_TYPES:
            raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.filename}")

        raw = await file.read()
        if len(raw) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=400, detail=f"{file.filename} exceeds the 20MB size limit.")

        try:
            loaded = save_image(raw, _EXT_BY_CONTENT_TYPE[file.content_type])
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Could not read {file.filename}.")

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
        results.append(result)

    ranked = sorted(results, key=lambda r: r.overall_score, reverse=True)
    for idx, item in enumerate(ranked):
        item.rank = idx + 1
        if idx == 0:
            item.rank_label = "Best Image"
        elif idx == len(ranked) - 1 and len(ranked) > 1:
            item.rank_label = "Worst Image"
        elif idx == 1:
            item.rank_label = "Second Best"

    return CompareResponse(items=ranked)
