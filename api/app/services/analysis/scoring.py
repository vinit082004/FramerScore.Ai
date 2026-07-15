import cv2
import numpy as np

from app.models.schemas import FeedbackItem, ParameterResult
from app.services.analysis.background import score_background
from app.services.analysis.exposure import analyze_lighting
from app.services.analysis.face import (
    detect_faces,
    score_face_orientation,
    score_face_visibility,
    score_subject_centering,
    score_subject_count,
)
from app.services.analysis.movement import score_subject_movement
from app.services.analysis.resolution import analyze_resolution
from app.services.analysis.sharpness import analyze_sharpness

_WEIGHTS = {
    "face_visibility": 0.20,
    "sharpness": 0.20,
    "face_orientation": 0.10,
    "subject_count": 0.10,
    "movement": 0.10,
    "centering": 0.10,
    "lighting": 0.10,
    "resolution": 0.05,
    "background": 0.05,
}

_POSITIVE_TEMPLATES = {
    "face_visibility": "Face is clearly visible.",
    "sharpness": "Image is sharp.",
    "face_orientation": "Subject is facing the camera.",
    "subject_count": "Single subject in frame.",
    "movement": "Subject is stable and stationary.",
    "centering": "Subject is well-centered.",
    "lighting": "Lighting is excellent.",
    "resolution": "Resolution is high quality.",
    "background": "Background is clean.",
}

_WARNING_TEMPLATES = {
    "face_visibility": "Face is partially hidden or hard to detect.",
    "sharpness": "Image shows noticeable blur.",
    "face_orientation": "Person is turned away from the camera.",
    "subject_count": "Multiple people detected.",
    "movement": "Subject motion may reduce clarity.",
    "centering": "Subject is off-center in the frame.",
    "lighting": "Lighting is not ideal.",
    "resolution": "Resolution is on the low side.",
    "background": "Background is distracting.",
}

_REASON_POSITIVE = {
    "face_visibility": "Excellent face visibility",
    "sharpness": "Sharp image",
    "face_orientation": "Front-facing subject",
    "subject_count": "Single subject",
    "movement": "Stable, stationary pose",
    "centering": "Well-centered framing",
    "lighting": "Professional lighting",
    "resolution": "High resolution source",
    "background": "Clean background",
}

_REASON_NEGATIVE = {
    "face_visibility": "Face visibility needs improvement",
    "sharpness": "Image lacks sharpness",
    "face_orientation": "Head rotation detected",
    "subject_count": "Multiple people detected",
    "movement": "Subject movement detected",
    "centering": "Subject is off-center",
    "lighting": "Lighting could be improved",
    "resolution": "Low resolution image",
    "background": "Distracting background",
}

_SUGGESTIONS = {
    "face_visibility": "Reposition so the face is fully visible and unobstructed.",
    "sharpness": "Retake the shot with a steady hand or faster shutter speed.",
    "face_orientation": "Move closer to camera and use a front-facing angle.",
    "subject_count": "Recrop or retake so only the primary subject is in frame.",
    "movement": "Capture the subject in a stationary pose for a cleaner result.",
    "centering": "Recenter the subject using the frame's midpoint as a guide.",
    "lighting": "Shoot in even, diffused light and avoid strong backlighting.",
    "resolution": "Use a higher-resolution source image if available.",
    "background": "Use a plain backdrop or a wider aperture to blur the background.",
}


def _rating_for_score(score: int) -> tuple[str, str]:
    if score >= 85:
        return "Perfect", "success"
    if score >= 70:
        return "Good", "brand"
    if score >= 50:
        return "Average", "warning"
    if score >= 30:
        return "Poor", "danger"
    return "Rejected", "danger"


def _compute_confidence(findings, movement_used_fallback: bool) -> int:
    """How certain the pipeline is about its own readings — distinct from the
    image-quality score itself. Starts at 100 and is reduced for each signal
    that had to fall back to an assumed default rather than a real detection."""
    confidence = 100
    if findings.primary is None:
        confidence -= 45
    elif findings.yaw_deg is None:
        confidence -= 15
    if movement_used_fallback:
        confidence -= 15
    return max(20, min(100, confidence))


def run_analysis(bgr: np.ndarray, width: int, height: int) -> dict:
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

    findings = detect_faces(bgr)
    sharpness_result, sharpness_meta = analyze_sharpness(gray)
    movement_result, movement_used_fallback = score_subject_movement(
        bgr, sharpness_meta["is_motion_blur"]
    )

    parameters: list[ParameterResult] = [
        score_face_visibility(findings, width, height),
        score_face_orientation(findings),
        sharpness_result,
        score_subject_count(findings),
        movement_result,
        score_subject_centering(findings, width, height),
        analyze_lighting(bgr),
        analyze_resolution(width, height),
        score_background(bgr, findings),
    ]

    confidence = _compute_confidence(findings, movement_used_fallback)

    for p in parameters:
        p.suggestion = "No action required." if p.score >= 80 else _SUGGESTIONS[p.id]

    weighted_sum = sum(p.score * _WEIGHTS[p.id] for p in parameters)
    overall_score = round(max(0, min(100, weighted_sum)))
    rating, tone = _rating_for_score(overall_score)
    star_rating = round((overall_score / 100) * 5 * 2) / 2

    feedback: list[FeedbackItem] = []
    for p in parameters:
        if p.score >= 80:
            feedback.append(FeedbackItem(type="positive", message=_POSITIVE_TEMPLATES[p.id]))
        elif p.score < 55:
            feedback.append(FeedbackItem(type="warning", message=_WARNING_TEMPLATES[p.id]))

    weakest = min(parameters, key=lambda p: p.score)
    suggestion = _SUGGESTIONS[weakest.id]

    overall_param = ParameterResult(
        id="overall_suitability",
        name="Overall Suitability",
        score=overall_score,
        label=rating,
        detail=f"Composite score across all 9 evaluation parameters places this image in the '{rating}' tier.",
        suggestion="No action required." if overall_score >= 80 else suggestion,
    )
    parameters.append(overall_param)

    suitability_sentences = {
        "Perfect": "This image is highly suitable for publishing.",
        "Good": "This image is suitable for most publishing and profile use cases.",
        "Average": "This image is usable but has room for improvement before publishing.",
        "Poor": "This image is not recommended for publishing without a retake.",
        "Rejected": "This image does not meet the minimum bar for publishing.",
    }

    sorted_params = sorted(parameters[:-1], key=lambda p: p.score, reverse=True)
    if rating in ("Perfect", "Good"):
        reasons = [_REASON_POSITIVE[p.id] for p in sorted_params[:4]]
        weakest_in_top = min(sorted_params[:4], key=lambda p: p.score)
        if weakest_in_top.score < 90:
            reasons.append(f"Minor {weakest_in_top.name.lower()} imperfection detected")
    else:
        reasons = [_REASON_NEGATIVE[p.id] for p in sorted_params[-4:][::-1]]

    verdict_summary = suitability_sentences[rating]

    return {
        "parameters": parameters,
        "overall_score": overall_score,
        "rating": rating,
        "rating_tone": tone,
        "star_rating": star_rating,
        "confidence": confidence,
        "feedback": feedback,
        "suggestion": suggestion,
        "verdict_title": "FrameScore AI Verdict",
        "verdict_summary": verdict_summary,
        "verdict_reasons": reasons,
    }
