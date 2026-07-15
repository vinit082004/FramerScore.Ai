from app.models.schemas import ParameterResult


def analyze_resolution(width: int, height: int) -> ParameterResult:
    megapixels = (width * height) / 1_000_000

    if megapixels >= 3:
        label = "Excellent"
        detail = f"{width}×{height} provides ample detail for print and large displays."
        score = round(min(100, 85 + min(15, (megapixels - 3) * 1.5)))
    elif megapixels >= 1:
        label = "Medium"
        detail = f"{width}×{height} is acceptable for web and profile use."
        score = round(55 + (megapixels - 1) * 15)
    else:
        label = "Low"
        detail = f"{width}×{height} may appear soft when resized or cropped."
        score = round(max(5, megapixels * 50))

    return ParameterResult(
        id="resolution",
        name="Image Resolution",
        score=max(0, min(100, score)),
        label=label,
        detail=detail,
    )
