# Use official lightweight Python image
FROM python:3.12-slim

# Prevent Python from writing pyc files and keep stdout unbuffered
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Working directory
WORKDIR /app

# Install system dependencies (needed for psycopg2 and other packages if applicable)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy source code
COPY . /app/

# Collect static files (needs dummy env vars for Django's settings check if strict)
RUN python manage.py collectstatic --noinput

# Run gunicorn securely binding to the port Google Cloud injects via $PORT
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 8 --timeout 0 config.wsgi:application
