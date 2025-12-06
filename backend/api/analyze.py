from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pathlib import Path
from backend.services import metadata_extractor, c2pa_verifier, filename_heuristics, scoring_engine

router = APIRouter()

class AnalyzeRequest(BaseModel):
    filepath: str

class FilenameRequest(BaseModel):
    filename: str

# Step 1: Filename Heuristics (can be done with just the filename)
@router.post("/analyze/filename")
async def analyze_filename_endpoint(request: FilenameRequest):
    """Step 1: Analyze filename for AI patterns"""
    try:
        result = filename_heuristics.analyze_filename(request.filename)
        return {"step": "filename_heuristics", "status": "complete", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Step 2: Metadata Extraction
@router.post("/analyze/metadata")
async def analyze_metadata_endpoint(request: AnalyzeRequest):
    """Step 2: Extract and analyze file metadata"""
    filepath = Path(request.filepath)
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        result = await metadata_extractor.extract_metadata(filepath)
        return {"step": "metadata_extraction", "status": "complete", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Step 3: C2PA Verification
@router.post("/analyze/c2pa")
async def analyze_c2pa_endpoint(request: AnalyzeRequest):
    """Step 3: Verify C2PA Content Credentials"""
    filepath = Path(request.filepath)
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        result = await c2pa_verifier.verify_c2pa(filepath)
        return {"step": "c2pa_verification", "status": "complete", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Step 4: Final Scoring
@router.post("/analyze/score")
async def analyze_score_endpoint(request: AnalyzeRequest):
    """Step 4: Calculate final synthetic probability score"""
    filepath = Path(request.filepath)
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        # Get all data
        metadata = await metadata_extractor.extract_metadata(filepath)
        c2pa_data = await c2pa_verifier.verify_c2pa(filepath)
        filename_score = filename_heuristics.analyze_filename(filepath.name)
        
        # Calculate score
        result = scoring_engine.calculate_score(metadata, c2pa_data, filename_score)
        return {"step": "final_score", "status": "complete", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Full analysis (kept for backward compatibility)
@router.post("/analyze")
async def analyze_media(request: AnalyzeRequest):
    filepath = Path(request.filepath)
    if not filepath.exists():
        raise HTTPException(status_code=404, detail="File not found")

    try:
        metadata = await metadata_extractor.extract_metadata(filepath)
        c2pa_data = await c2pa_verifier.verify_c2pa(filepath)
        filename_score = filename_heuristics.analyze_filename(filepath.name)
        final_report = scoring_engine.calculate_score(metadata, c2pa_data, filename_score)
        
        return final_report
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
