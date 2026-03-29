from pathlib import Path

from fastapi import APIRouter

router = APIRouter()

COUNTER_FILE = Path(__file__).parent.parent.parent.parent / "visit_count.txt"


def _read_count() -> int:
    try:
        return int(COUNTER_FILE.read_text().strip())
    except (FileNotFoundError, ValueError):
        return 0


def _write_count(n: int) -> None:
    COUNTER_FILE.write_text(str(n))


@router.post("/counter/visit")
async def record_visit():
    """Increment visit count and return the new total."""
    count = _read_count() + 1
    _write_count(count)
    return {"count": count}


@router.get("/counter/visit")
async def get_visit_count():
    """Return current visit count without incrementing."""
    return {"count": _read_count()}
