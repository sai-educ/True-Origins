import re

def analyze_filename(filename: str) -> dict:
    """
    Analyzes the filename for patterns common to AI generation tools.
    Returns a dictionary with the score and details.
    """
    filename_lower = filename.lower()
    score = 0
    indicators = []
    
    # --- Known AI Patterns ---
    
    # Midjourney
    # Pattern: [username]_[prompt]_[job-id-36-chars].png
    # Job ID is 36 chars (UUID-like)
    if re.search(r'[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}', filename_lower):
        score += 80
        indicators.append("Contains UUID pattern common in Midjourney filenames")
    
    if "midjourney" in filename_lower or "mj_" in filename_lower:
        score += 90
        indicators.append("Explicit 'midjourney' naming detected")
        
    # DALL-E
    # Often starts with date or has specific structure
    if "dalle" in filename_lower or "dall-e" in filename_lower:
        score += 90
        indicators.append("Explicit 'dall-e' naming detected")
        
    # Stable Diffusion
    if "stable-diffusion" in filename_lower or "stablediffusion" in filename_lower:
        score += 90
        indicators.append("Explicit 'stable diffusion' naming detected")
    if re.search(r'^\d{5,}-', filename_lower): # e.g. 00001-seed...
        score += 60
        indicators.append("Starts with numeric sequence common in Stable Diffusion outputs")
        
    # Generic AI terms
    ai_terms = ["ai-generated", "synthetic", "prompt", "txt2img", "img2img"]
    for term in ai_terms:
        if term in filename_lower:
            score += 70
            indicators.append(f"Contains generic AI term: '{term}'")
            
    # --- Human/Camera Patterns (Negative Score) ---
    
    # Standard Camera Formats (DSC, IMG, PXL, etc.)
    if re.search(r'^(dsc|img|pxl|mvi)_\d{4}', filename_lower):
        score -= 40
        indicators.append("Matches standard camera naming convention (DSC/IMG/PXL)")
        
    if re.search(r'^\d{8}_\d{6}', filename_lower): # YYYYMMDD_HHMMSS
        score -= 30
        indicators.append("Matches standard timestamp naming convention")
        
    if "screenshot" in filename_lower:
        score -= 20
        indicators.append("Identified as a screenshot")

    # Clamp score
    final_score = max(0, min(100, score))
    
    return {
        "filename": filename,
        "score": final_score,
        "indicators": indicators,
        "is_suspicious": final_score > 50
    }
