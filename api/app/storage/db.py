import sqlite3

from app.core.config import DB_PATH
from app.models.schemas import AnalysisResult, HistorySummary


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = _connect()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS analyses (
            id TEXT PRIMARY KEY,
            filename TEXT NOT NULL,
            created_at TEXT NOT NULL,
            overall_score INTEGER NOT NULL,
            rating TEXT NOT NULL,
            rating_tone TEXT NOT NULL,
            thumbnail_url TEXT NOT NULL,
            payload TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()


def save_analysis(result: AnalysisResult) -> None:
    conn = _connect()
    conn.execute(
        """
        INSERT INTO analyses
            (id, filename, created_at, overall_score, rating, rating_tone, thumbnail_url, payload)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            result.id,
            result.filename,
            result.created_at,
            result.overall_score,
            result.rating,
            result.rating_tone,
            result.thumbnail_url,
            result.model_dump_json(),
        ),
    )
    conn.commit()
    conn.close()


def list_history(limit: int = 100) -> list[HistorySummary]:
    conn = _connect()
    rows = conn.execute(
        """
        SELECT id, filename, created_at, overall_score, rating, rating_tone, thumbnail_url
        FROM analyses ORDER BY created_at DESC LIMIT ?
        """,
        (limit,),
    ).fetchall()
    conn.close()
    return [HistorySummary(**dict(row)) for row in rows]


def get_analysis(item_id: str) -> AnalysisResult | None:
    conn = _connect()
    row = conn.execute("SELECT payload FROM analyses WHERE id = ?", (item_id,)).fetchone()
    conn.close()
    if not row:
        return None
    return AnalysisResult.model_validate_json(row["payload"])


def delete_analysis(item_id: str) -> bool:
    conn = _connect()
    cursor = conn.execute("DELETE FROM analyses WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return cursor.rowcount > 0
