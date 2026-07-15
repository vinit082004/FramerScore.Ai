import cv2
import numpy as np

from app.models.schemas import ParameterResult
from app.services.analysis.face import FaceFindings


def score_background(bgr: np.ndarray, findings: FaceFindings) -> ParameterResult:
    height, width = bgr.shape[:2]
    mask = np.ones((height, width), dtype=bool)

    if findings.primary:
        face = findings.primary
        pad_x = face.w * 0.9
        pad_y_top = face.h * 1.6
        pad_y_bottom = face.h * 3.2
        x0 = max(0, int(face.x - pad_x))
        x1 = min(width, int(face.x + face.w + pad_x))
        y0 = max(0, int(face.y - pad_y_top))
        y1 = min(height, int(face.y + face.h + pad_y_bottom))
        mask[y0:y1, x0:x1] = False
    else:
        cx0, cx1 = int(width * 0.3), int(width * 0.7)
        cy0, cy1 = int(height * 0.2), int(height * 0.8)
        mask[cy0:cy1, cx0:cx1] = False

    if not mask.any():
        return ParameterResult(
            id="background",
            name="Background Distraction",
            score=70,
            label="Slightly Busy",
            detail="The subject fills most of the frame, leaving little background to assess.",
        )

    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 80, 160)
    edge_density = float(edges[mask].mean()) / 255.0

    bg_pixels = bgr[mask]
    color_std = float(bg_pixels.reshape(-1, 3).std(axis=0).mean())

    score = round(max(0, 100 - edge_density * 500 - color_std * 0.9))

    if edge_density < 0.05 and color_std < 30:
        label = "Clean"
        detail = "The background is simple and doesn't compete with the subject."
    elif edge_density < 0.12 and color_std < 55:
        label = "Slightly Busy"
        detail = "The background has some texture but isn't overly distracting."
    else:
        label = "Highly Distracting"
        detail = "Strong background detail and color variation pull attention from the subject."

    return ParameterResult(
        id="background", name="Background Distraction", score=max(0, min(100, score)), label=label, detail=detail
    )
