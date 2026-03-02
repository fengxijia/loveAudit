# Marriage Assessment Backend

AI-powered marriage partner assessment platform backend using FastAPI.

## Setup

```bash
# Install dependencies
pip install -e ".[dev]"

# Run the server
uvicorn app.main:app --reload

# Run tests
pytest
```

## Environment Variables

Create a `.env` file:

```
GOOGLE_API_KEY=your_google_api_key
GEMINI_MODEL=gemini-2.0-flash
DEBUG=true
```
