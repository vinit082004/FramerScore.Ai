from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import analyze, compare, export, history
from app.core.config import ALLOWED_ORIGINS, STORAGE_DIR
from app.storage.db import init_db


def create_app() -> FastAPI:
    app = FastAPI(title="FrameScore AI API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    init_db()

    app.mount("/storage", StaticFiles(directory=STORAGE_DIR), name="storage")

    app.include_router(analyze.router, prefix="/api")
    app.include_router(history.router, prefix="/api")
    app.include_router(compare.router, prefix="/api")
    app.include_router(export.router, prefix="/api")

    @app.get("/api/health")
    async def health() -> dict:
        return {"status": "ok"}

    return app


app = create_app()
