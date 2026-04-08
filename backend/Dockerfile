FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files (this runs during build, uses SQLite fallback since no DATABASE_URL)
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run migrations at container startup (not build) then start server
CMD python manage.py migrate && gunicorn cms.wsgi --bind 0.0.0.0:8000
