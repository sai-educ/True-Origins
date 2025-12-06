from backend.services.ai_tool_detector import detect_ai_tool

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
    s_c2pa = 0
    if c2pa_data.get("has_c2pa"):
        data_str = str(c2pa_data.get("data", ""))
        if "generative" in data_str.lower() or "ai" in data_str.lower():
            s_c2pa = 100
        else:
            s_c2pa = 0
    else:
        s_c2pa = 50
        
    # 3. Metadata Score
    s_metadata = 0
    exif = metadata.get("data", {})
    if not exif:
        s_metadata = 70
    else:
        software = exif.get("Software", "").lower()
        if "photoshop" in software or "gimp" in software:
            s_metadata = 40
        if "adobe firefly" in software:
            s_metadata = 100
            
    # Final Calculation
    final_score = (s_filename * W_FILENAME) + (s_c2pa * W_C2PA) + (s_metadata * W_METADATA)
    
    confidence = "Low"
    if final_score > 80:
        confidence = "High"
    elif final_score > 40:
        confidence = "Medium"
    
    # Detect AI tool
    filename = filename_score.get("filename", "")
    ai_tool = detect_ai_tool(filename, metadata, c2pa_data)
        
    return {
        "synthetic_probability": round(final_score, 2),
        "confidence_level": confidence,
        "ai_tool": ai_tool,
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
