FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

COPY backend/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

COPY alembic.ini ./
COPY alembic ./alembic
COPY backend ./backend

EXPOSE 8000

CMD ["sh", "-c", "alembic upgrade head && exec gunicorn backend.app:app --workers ${WEB_CONCURRENCY:-2} --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT:-10000} --access-logfile - --error-logfile - --timeout 120"]