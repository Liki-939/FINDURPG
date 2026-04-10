# Use official lightweight Python image
FROM python:3.12-slim

# Env settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set workdir
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project files
COPY . .

# ❌ REMOVE collectstatic from build (important)

# Run app (correct format for Cloud Run)
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "config.wsgi:application"]