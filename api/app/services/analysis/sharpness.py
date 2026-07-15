import math

import cv2
import numpy as np

from app.models.schemas import ParameterResult


def analyze_sharpness(gray: np.ndarray) -> tuple[ParameterResult, dict]:
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

    sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
    sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
    energy_x = float(np.sum(sobel_x**2))
    energy_y = float(np.sum(sobel_y**2))
    directional_ratio = max(energy_x, energy_y) / (min(energy_x, energy_y) + 1e-6)

    score = round(100 * (1 - math.exp(-laplacian_var / 220)))
    score = max(0, min(100, score))

    is_directional = directional_ratio > 2.2 and laplacian_var < 500

    if laplacian_var >= 350:
        label = "Sharp"
        detail = "Fine detail and edges are crisp throughout the frame."
    elif is_directional:
        label = "Motion Blur"
        detail = "Directional streaking suggests the subject or camera moved during capture."
    elif laplacian_var >= 130:
        label = "Minor Blur"
        detail = "Slight softness is present but detail is mostly preserved."
    else:
        label = "Out of Focus"
        detail = "Edges are soft across the frame, consistent with a missed focus point."

    result = ParameterResult(
        id="sharpness",
        name="Image Sharpness",
        score=score,
        label=label,
        detail=detail,
    )
    return result, {"laplacian_var": laplacian_var, "directional_ratio": directional_ratio, "is_motion_blur": is_directional}
