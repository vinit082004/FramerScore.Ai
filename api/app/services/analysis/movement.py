import cv2
import mediapipe as mp
import numpy as np

from app.models.schemas import ParameterResult

_mp_pose = mp.solutions.pose


def score_subject_movement(bgr: np.ndarray, is_motion_blur: bool) -> tuple[ParameterResult, bool]:
    """Returns (result, used_fallback) — used_fallback is True when no pose could be
    detected at all and a neutral "Standing" reading was assumed rather than measured."""
    if is_motion_blur:
        return (
            ParameterResult(
                id="movement",
                name="Subject Movement",
                score=25,
                label="Motion Blur",
                detail="Directional blur suggests the subject was moving quickly during capture.",
            ),
            False,
        )

    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
    with _mp_pose.Pose(static_image_mode=True, model_complexity=1, min_detection_confidence=0.5) as pose:
        result = pose.process(rgb)

    if not result.pose_landmarks:
        return (
            ParameterResult(
                id="movement",
                name="Subject Movement",
                score=100,
                label="Standing",
                detail="No full-body pose was detected, so a neutral standing posture is assumed.",
            ),
            True,
        )

    lm = result.pose_landmarks.landmark
    PL = _mp_pose.PoseLandmark

    def visible(idx: int) -> bool:
        return lm[idx].visibility > 0.5

    if not (visible(PL.LEFT_HIP) and visible(PL.RIGHT_HIP)):
        return (
            ParameterResult(
                id="movement",
                name="Subject Movement",
                score=100,
                label="Standing",
                detail="Only the upper body is visible, consistent with a standing portrait.",
            ),
            False,
        )

    left_ankle_visible = visible(PL.LEFT_ANKLE)
    right_ankle_visible = visible(PL.RIGHT_ANKLE)

    hip_width = abs(lm[PL.LEFT_HIP].x - lm[PL.RIGHT_HIP].x) + 1e-6
    shoulder_y = (lm[PL.LEFT_SHOULDER].y + lm[PL.RIGHT_SHOULDER].y) / 2
    hip_y = (lm[PL.LEFT_HIP].y + lm[PL.RIGHT_HIP].y) / 2
    torso_len = abs(hip_y - shoulder_y) + 1e-6

    if left_ankle_visible and right_ankle_visible:
        ankle_spread = abs(lm[PL.LEFT_ANKLE].x - lm[PL.RIGHT_ANKLE].x) / hip_width
        ankle_stride = abs(lm[PL.LEFT_ANKLE].y - lm[PL.RIGHT_ANKLE].y) / torso_len
        avg_ankle_y = (lm[PL.LEFT_ANKLE].y + lm[PL.RIGHT_ANKLE].y) / 2
        airborne = (avg_ankle_y - hip_y) < torso_len * 1.1

        if airborne and (ankle_spread > 1.4 or ankle_stride > 0.35):
            return (
                ParameterResult(
                    id="movement",
                    name="Subject Movement",
                    score=45,
                    label="Jumping",
                    detail="Leg positioning suggests the subject is airborne or mid-jump.",
                ),
                False,
            )
        if ankle_stride > 0.45 or ankle_spread > 2.2:
            return (
                ParameterResult(
                    id="movement",
                    name="Subject Movement",
                    score=50,
                    label="Running",
                    detail="A wide stride pattern suggests the subject is running.",
                ),
                False,
            )
        if ankle_spread > 1.3 or ankle_stride > 0.25:
            return (
                ParameterResult(
                    id="movement",
                    name="Subject Movement",
                    score=70,
                    label="Walking",
                    detail="Leg positioning suggests the subject is mid-stride.",
                ),
                False,
            )

    return (
        ParameterResult(
            id="movement",
            name="Subject Movement",
            score=100,
            label="Standing",
            detail="The subject's posture is upright and stationary.",
        ),
        False,
    )
