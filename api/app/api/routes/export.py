import csv
import io

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.storage.db import get_analysis

router = APIRouter()


@router.get("/history/{item_id}/export")
async def export_history_item(item_id: str, format: str = "json"):
    result = get_analysis(item_id)
    if not result:
        raise HTTPException(status_code=404, detail="Analysis not found.")

    if format == "json":
        content = result.model_dump_json(indent=2)
        return StreamingResponse(
            io.BytesIO(content.encode("utf-8")),
            media_type="application/json",
            headers={"Content-Disposition": f'attachment; filename="framescore-{item_id}.json"'},
        )

    if format == "csv":
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(["Parameter", "Score", "Label", "Detail"])
        for p in result.parameters:
            writer.writerow([p.name, p.score, p.label, p.detail])
        writer.writerow([])
        writer.writerow(["Overall Score", result.overall_score, result.rating, ""])
        return StreamingResponse(
            io.BytesIO(buffer.getvalue().encode("utf-8")),
            media_type="text/csv",
            headers={"Content-Disposition": f'attachment; filename="framescore-{item_id}.csv"'},
        )

    raise HTTPException(status_code=400, detail="format must be 'json' or 'csv'")
