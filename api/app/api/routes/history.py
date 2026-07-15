from fastapi import APIRouter, HTTPException, Query

from app.models.schemas import AnalysisResult, HistoryListResponse
from app.storage.db import delete_analysis, get_analysis, list_history

router = APIRouter()


@router.get("/history", response_model=HistoryListResponse)
async def get_history(limit: int = Query(default=100, ge=1, le=500)) -> HistoryListResponse:
    return HistoryListResponse(items=list_history(limit))


@router.get("/history/{item_id}", response_model=AnalysisResult)
async def get_history_item(item_id: str) -> AnalysisResult:
    result = get_analysis(item_id)
    if not result:
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return result


@router.delete("/history/{item_id}")
async def delete_history_item(item_id: str) -> dict:
    if not delete_analysis(item_id):
        raise HTTPException(status_code=404, detail="Analysis not found.")
    return {"ok": True}
