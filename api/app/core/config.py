from pathlib import Path

API_DIR = Path(__file__).resolve().parents[2]
STORAGE_DIR = API_DIR / "storage"
UPLOADS_DIR = STORAGE_DIR / "uploads"
DB_PATH = STORAGE_DIR / "framescore.db"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

MAX_UPLOAD_BYTES = 20 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/png", "image/jpeg", "image/webp"}

ALLOWED_ORIGINS = [
    "http://localhost:3020",
    "http://127.0.0.1:3020",
]

THUMBNAIL_MAX_DIM = 480
