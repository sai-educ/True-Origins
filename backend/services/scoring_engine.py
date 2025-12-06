def calculate_score(metadata: dict, c2pa_data: dict, filename_score: dict) -> dict:
    """
    Calculates the final synthetic probability score.
    """
    
    # Weights
    W_METADATA = 0.3
    W_C2PA = 0.5
    W_FILENAME = 0.2
    
    # 1. Filename Score (0-100)
    s_filename = filename_score.get("score", 0)
    
    # 2. C2PA Score
    # If C2PA is present and valid, it's likely NOT synthetic (or properly attributed).
    # If it explicitly says "AI Generated", then it IS synthetic.
    # This logic needs to be refined based on actual C2PA fields.
    # For now:
    # - No C2PA = Neutral (50)? Or 0 if we assume most real photos don't have it yet? 
    #   Let's say 0 (assume real) unless we find evidence otherwise.
    # - C2PA present + signed by camera = 0 (Real)
    # - C2PA present + signed by AI tool = 100 (Synthetic)
    
    s_c2pa = 0
    if c2pa_data.get("has_c2pa"):
        # TODO: Parse actual C2PA assertions to check for "generative-ai"
        # For this MVP, we'll just flag it as 'interesting' but not automatically synthetic
        # unless we find specific keywords in the data.
        data_str = str(c2pa_data.get("data", ""))
        if "generative" in data_str.lower() or "ai" in data_str.lower():
            s_c2pa = 100
        else:
            s_c2pa = 0 # Assume authentic if C2PA exists but no AI tag
    else:
        s_c2pa = 50 # Unknown
        
    # 3. Metadata Score
    # Check for missing EXIF or weird software tags
    s_metadata = 0
    exif = metadata.get("data", {})
    if not exif:
        s_metadata = 70 # Suspicious if no metadata
    else:
        software = exif.get("Software", "").lower()
        if "photoshop" in software or "gimp" in software:
            s_metadata = 40 # Edited, not necessarily synthetic
        if "adobe firefly" in software:
            s_metadata = 100
            
    # Final Calculation
    # This is a simplified model.
    
    final_score = (s_filename * W_FILENAME) + (s_c2pa * W_C2PA) + (s_metadata * W_METADATA)
    
    confidence = "Low"
    if final_score > 80:
        confidence = "High"
    elif final_score > 40:
        confidence = "Medium"
        
    return {
        "synthetic_probability": round(final_score, 2),
        "confidence_level": confidence,
        "breakdown": {
            "filename_score": s_filename,
            "c2pa_score": s_c2pa,
            "metadata_score": s_metadata
        },
        "details": {
            "filename": filename_score,
            "c2pa": c2pa_data,
            "metadata": metadata
        }
    }
