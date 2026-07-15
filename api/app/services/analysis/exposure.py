import cv2
import numpy as np

from app.models.schemas import ParameterResult


def analyze_lighting(bgr: np.ndarray) -> ParameterResult:
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    mean = float(gray.mean())
    std = float(gray.std())

    hist = cv2.calcHist([gray], [0], None, [256], [0, 256]).flatten()
    total = float(gray.size)
    clipped_dark = float(hist[:8].sum()) / total
    clipped_bright = float(hist[248:].sum()) / total

    if clipped_bright > 0.15 or mean > 210:
        label = "Overexposed"
        detail = "Highlights are blown out, losing detail in bright areas."
        score = max(0, round(100 - (clipped_bright * 260) - max(0, mean - 200)))
    elif mean < 65 or clipped_dark > 0.25:
        label = "Dark"
        detail = "The image is underexposed, making the subject hard to see clearly."
        score = max(0, round(mean * 1.1 - clipped_dark * 60))
    elif 95 <= mean <= 185 and clipped_dark < 0.08 and clipped_bright < 0.05 and std > 35:
        label = "Excellent"
        detail = "Balanced exposure with strong contrast and no clipping."
        score = round(min(100, 88 + (std - 35) * 0.2))
    else:
        label = "Good"
        detail = "Lighting is usable with minor exposure imbalance."
        score = round(max(55, 82 - abs(mean - 140) * 0.25))

    score = max(0, min(100, score))

    return ParameterResult(
        id="lighting",
        name="Lighting",
        score=score,
        label=label,
        detail=detail,
    )
