import math
from dataclasses import dataclass
from typing import Optional

import cv2
import mediapipe as mp
import numpy as np

from app.models.schemas import ParameterResult

_mp_face_detection = mp.solutions.face_detection
_mp_face_mesh = mp.solutions.face_mesh

# Canonical 3D face model points (mm) used for solvePnP head-pose estimation.
_MODEL_POINTS = np.array(
    [
        (0.0, 0.0, 0.0),  # Nose tip
        (0.0, -330.0, -65.0),  # Chin
        (-225.0, 170.0, -135.0),  # Left eye outer corner
        (225.0, 170.0, -135.0),  # Right eye outer corner
        (-150.0, -150.0, -125.0),  # Left mouth corner
        (150.0, -150.0, -125.0),  # Right mouth corner
    ]
)
# Face Mesh landmark indices matching the model points above.
_LANDMARK_IDS = [1, 152, 33, 263, 61, 291]


@dataclass
class FaceBox:
    x: float
    y: float
    w: float
    h: float
    confidence: float

    @property
    def center(self) -> tuple[float, float]:
        return (self.x + self.w / 2, self.y + self.h / 2)

    @property
    def area(self) -> float:
        return self.w * self.h


@dataclass
class FaceFindings:
    faces: list[FaceBox]
    primary: Optional[FaceBox]
    yaw_deg: Optional[float]
    pitch_deg: Optional[float]


def detect_faces(bgr: np.ndarray) -> FaceFindings:
    height, width = bgr.shape[:2]
    rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)

    faces: list[FaceBox] = []
    with _mp_face_detection.FaceDetection(
        model_selection=1, min_detection_confidence=0.5
    ) as detector:
        result = detector.process(rgb)
        if result.detections:
            for detection in result.detections:
                box = detection.location_data.relative_bounding_box
                faces.append(
                    FaceBox(
                        x=box.xmin * width,
                        y=box.ymin * height,
                        w=box.width * width,
                        h=box.height * height,
                        confidence=detection.score[0] if detection.score else 0.5,
                    )
                )

    if not faces:
        return FaceFindings(faces=[], primary=None, yaw_deg=None, pitch_deg=None)

    primary = max(faces, key=lambda f: f.area * f.confidence)
    yaw, pitch = _estimate_head_pose(rgb, width, height)
    return FaceFindings(faces=faces, primary=primary, yaw_deg=yaw, pitch_deg=pitch)


def _estimate_head_pose(
    rgb: np.ndarray, width: int, height: int
) -> tuple[Optional[float], Optional[float]]:
    with _mp_face_mesh.FaceMesh(
        static_image_mode=True, max_num_faces=1, refine_landmarks=False, min_detection_confidence=0.5
    ) as mesh:
        result = mesh.process(rgb)
        if not result.multi_face_landmarks:
            return None, None

        landmarks = result.multi_face_landmarks[0].landmark
        image_points = np.array(
            [(landmarks[i].x * width, landmarks[i].y * height) for i in _LANDMARK_IDS],
            dtype=np.float64,
        )

        focal_length = width
        center = (width / 2, height / 2)
        camera_matrix = np.array(
            [[focal_length, 0, center[0]], [0, focal_length, center[1]], [0, 0, 1]],
            dtype=np.float64,
        )
        dist_coeffs = np.zeros((4, 1))

        success, rotation_vector, _ = cv2.solvePnP(
            _MODEL_POINTS, image_points, camera_matrix, dist_coeffs, flags=cv2.SOLVEPNP_ITERATIVE
        )
        if not success:
            return None, None

        rotation_matrix, _ = cv2.Rodrigues(rotation_vector)
        sy = math.sqrt(rotation_matrix[0, 0] ** 2 + rotation_matrix[1, 0] ** 2)
        pitch = math.degrees(math.atan2(-rotation_matrix[2, 0], sy))
        yaw = math.degrees(math.atan2(rotation_matrix[1, 0], rotation_matrix[0, 0]))
        return yaw, pitch


def score_face_visibility(findings: FaceFindings, width: int, height: int) -> ParameterResult:
    if not findings.primary:
        return ParameterResult(
            id="face_visibility",
            name="Face Visibility",
            score=20,
            label="Face Blocked",
            detail="No face could be detected in this image.",
        )

    face = findings.primary
    area_ratio = face.area / (width * height)
    size_score = min(1.0, area_ratio / 0.04)
    confidence_score = face.confidence

    composite = 0.5 * confidence_score + 0.5 * size_score
    score = round(composite * 100)

    if area_ratio < 0.01:
        label = "Face Too Small"
        detail = "The face occupies a very small portion of the frame."
        score = min(score, 45)
    elif composite >= 0.82:
        label = "Face Clearly Visible"
        detail = "The face is prominent, unobstructed and well-detected."
    elif composite >= 0.55:
        label = "Face Partially Hidden"
        detail = "The face is visible but detection confidence suggests partial occlusion."
    else:
        label = "Face Blocked"
        detail = "The face is difficult to detect, likely obstructed or angled away."

    return ParameterResult(
        id="face_visibility", name="Face Visibility", score=max(0, min(100, score)), label=label, detail=detail
    )


def score_face_orientation(findings: FaceFindings) -> ParameterResult:
    if findings.yaw_deg is None:
        if findings.primary:
            return ParameterResult(
                id="face_orientation",
                name="Face Orientation",
                score=50,
                label="Looking Away",
                detail="Facial landmarks were not clear enough to estimate head pose precisely.",
            )
        return ParameterResult(
            id="face_orientation",
            name="Face Orientation",
            score=30,
            label="Looking Away",
            detail="No face was available to estimate orientation.",
        )

    yaw = findings.yaw_deg
    abs_yaw = abs(yaw)
    score = max(0, round(100 - abs_yaw * 1.5))

    if abs_yaw <= 10:
        label = "Front Facing"
        detail = "The subject is looking directly at the camera."
    elif abs_yaw <= 30:
        label = "Slight Left" if yaw > 0 else "Slight Right"
        detail = "A mild head rotation is detected from the front-facing position."
    elif abs_yaw <= 55:
        label = "Side Profile"
        detail = "The face is turned close to a profile angle."
    else:
        label = "Looking Away"
        detail = "The subject's face is turned away from the camera."

    return ParameterResult(
        id="face_orientation", name="Face Orientation", score=score, label=label, detail=detail
    )


def score_subject_centering(findings: FaceFindings, width: int, height: int) -> ParameterResult:
    if not findings.primary:
        return ParameterResult(
            id="centering",
            name="Subject Centering",
            score=50,
            label="Slightly Off-Center",
            detail="No clear subject was found to evaluate framing.",
        )

    cx, cy = findings.primary.center
    offset_x = (cx - width / 2) / width
    offset_y = (cy - height / 2) / height
    offset = math.sqrt(offset_x**2 + offset_y**2)

    score = max(0, round(100 - offset * 400))

    if offset < 0.08:
        label = "Centered"
        detail = "The subject is well-balanced within the frame."
    elif offset < 0.18:
        label = "Slightly Off-Center"
        detail = "The subject is a little off from the frame's center."
    else:
        label = "Poor Framing"
        detail = "The subject sits far from the center, which may look unbalanced."

    return ParameterResult(id="centering", name="Subject Centering", score=score, label=label, detail=detail)


def score_subject_count(findings: FaceFindings) -> ParameterResult:
    count = len(findings.faces)

    if count == 0:
        return ParameterResult(
            id="subject_count",
            name="Subject Count",
            score=55,
            label="Single Person",
            detail="No face was detected, so a single subject is assumed by default.",
        )
    if count == 1:
        return ParameterResult(
            id="subject_count", name="Subject Count", score=100, label="Single Person", detail="Exactly one person was detected in the frame."
        )
    if count == 2:
        return ParameterResult(
            id="subject_count", name="Subject Count", score=60, label="Two People", detail="Two people were detected in the frame."
        )
    if count <= 5:
        return ParameterResult(
            id="subject_count",
            name="Subject Count",
            score=35,
            label="Multiple People",
            detail=f"{count} people were detected, which may distract from the primary subject.",
        )
    return ParameterResult(
        id="subject_count",
        name="Subject Count",
        score=15,
        label="Crowd",
        detail=f"{count} faces were detected, consistent with a crowd scene.",
    )
