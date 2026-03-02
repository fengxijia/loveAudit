from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict

_backend_dir = Path(__file__).parent.parent
_env_candidates = [_backend_dir / ".env", _backend_dir.parent / ".env", _backend_dir.parent.parent / ".env"]
_env_file = next((p for p in _env_candidates if p.exists()), _backend_dir / ".env")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(_env_file),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    api_title: str = "LoveAudit API"
    api_version: str = "1.0.0"
    api_prefix: str = "/api/v1"
    debug: bool = False
    cors_origins: List[str] = ["http://localhost:3147"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
