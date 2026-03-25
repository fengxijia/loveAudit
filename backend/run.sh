#!/bin/bash
cd "$(dirname "$0")"
source /home/becool1/wd/doro/marriage/backend/.venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8147 --reload
