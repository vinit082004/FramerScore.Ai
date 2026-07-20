import os
from pathlib import Path

API_DIR = Path(__file__).resolve().parents[2]

# On a host with no persistent local disk between deploys/restarts (e.g. most
# PaaS free tiers), set STORAGE_DIR to a mounted persistent volume path via
# env var. Defaults to a local "storage" folder next to the app for local dev.
STORAGE_DIR = Path(os.environ.get("STORAGE_DIR", str(API_DIR / "storage")))
UPLOADS_DIR = STORAGE_DIR / "uploads"
DB_PATH = STORAGE_DIR / "framescore.db"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

MAX_UPLOAD_BYTES = 20 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg", "image/webp"}

_DEFAULT_ORIGINS = [
    "http://localhost:3020",
    "http://127.0.0.1:3020",
]
# Comma-separated list of extra allowed origins (e.g. your deployed frontend
# URL), on top of the localhost defaults above.
_EXTRA_ORIGINS = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "").split(",")
    if origin.strip()
]
ALLOWED_ORIGINS = _DEFAULT_ORIGINS + _EXTRA_ORIGINS

THUMBNAIL_MAX_DIM = 480
