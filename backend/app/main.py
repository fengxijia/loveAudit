from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import assessment, analysis
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment.router, prefix=settings.api_prefix, tags=["assessment"])
app.include_router(analysis.router, prefix=settings.api_prefix, tags=["analysis"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": settings.api_version}
