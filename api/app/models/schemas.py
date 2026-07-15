from typing import Literal, Optional
from pydantic import BaseModel

FeedbackType = Literal["positive", "warning"]
RatingTone = Literal["success", "brand", "warning", "danger"]


class ParameterResult(BaseModel):
    id: str
    name: str
    score: int
    label: str
    detail: str
    suggestion: str = ""


class FeedbackItem(BaseModel):
    type: FeedbackType
    message: str


class AnalysisResult(BaseModel):
    id: str
    filename: str
    created_at: str
    image_url: str
    thumbnail_url: str
    width: int
    height: int
    file_size_bytes: int = 0
    processing_time_seconds: float = 0.0
    overall_score: int
    rating: str
    rating_tone: RatingTone
    star_rating: float
    confidence: int
    parameters: list[ParameterResult]
    feedback: list[FeedbackItem]
    suggestion: str
    verdict_title: str
    verdict_summary: str
    verdict_reasons: list[str]
    rank: Optional[int] = None
    rank_label: Optional[str] = None


class HistorySummary(BaseModel):
    id: str
    filename: str
    created_at: str
    thumbnail_url: str
    overall_score: int
    rating: str
    rating_tone: RatingTone


class HistoryListResponse(BaseModel):
    items: list[HistorySummary]


class CompareResponse(BaseModel):
    items: list[AnalysisResult]
