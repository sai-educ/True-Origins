from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
from pathlib import Path

router = APIRouter()

UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Create a temporary file path
        file_path = UPLOAD_DIR / file.filename
        
        # Save the uploaded file
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return {
            "filename": file.filename,
            "filepath": str(file_path),
            "content_type": file.content_type,
            "message": "File uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
