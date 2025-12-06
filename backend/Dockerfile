# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies
# We need:
# - exiftool (for metadata extraction)
# - ffmpeg (for media processing)
# - poppler-utils (for pdfinfo)
# - curl (for downloading c2patool)
# - tar (for extracting c2patool)
RUN apt-get update && apt-get install -y \
    exiftool \
    ffmpeg \
    poppler-utils \
    curl \
    tar \
    && rm -rf /var/lib/apt/lists/*

# Install c2patool
# We'll download the latest release from GitHub (or a specific version to be safe)
# Using a fixed version is better for reproducibility.
ENV C2PA_VERSION=0.9.0
RUN curl -L "https://github.com/contentauth/c2patool/releases/download/v${C2PA_VERSION}/c2patool_v${C2PA_VERSION}-x86_64-unknown-linux-musl.tar.gz" -o c2patool.tar.gz \
    && tar -xzf c2patool.tar.gz \
    && mv c2patool_v${C2PA_VERSION}-x86_64-unknown-linux-musl/c2patool /usr/local/bin/ \
    && rm -rf c2patool.tar.gz c2patool_v${C2PA_VERSION}-x86_64-unknown-linux-musl

# Set work directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project code
COPY . .

# Expose the port
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
