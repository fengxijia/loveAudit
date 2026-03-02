from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict

# Find .env in backend dir or parent dir
_backend_dir = Path(__file__).parent.parent
_env_file = _backend_dir / ".env" if (_backend_dir / ".env").exists() else _backend_dir.parent / ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=str(_env_file),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # API settings
    api_title: str = "Marriage Assessment API"
    api_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    debug: bool = False

    # CORS settings
    cors_origins: List[str] = []

    # Rate limiting
    rate_limit_requests: int = 100
    rate_limit_period: int = 60  # seconds


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
