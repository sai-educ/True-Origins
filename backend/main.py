from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api import upload, analyze

app = FastAPI(
    title="TrueOrigins API",
    description="API for TrueOrigins synthetic media verification",
    version="0.1.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])

@app.get("/")
async def root():
    return {"message": "TrueOrigins API is running"}

# Mount static files for uploads
from fastapi.staticfiles import StaticFiles
import os

# Ensure directory exists
os.makedirs("temp_uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="temp_uploads"), name="uploads")
