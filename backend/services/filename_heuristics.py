import re

def analyze_filename(filename: str) -> dict:
    """
    Analyzes the filename for patterns common in AI generated media.
    """
    filename_lower = filename.lower()
    
    patterns = {
        "midjourney": r"midjourney",
        "stable_diffusion": r"stable-diffusion",
        "dalle": r"dalle|dall-e",
        "generic_ai": r"txt2img|img2img|grid",
    }
    
    matches = []
    score = 0
    
    for key, pattern in patterns.items():
        if re.search(pattern, filename_lower):
            matches.append(key)
            score += 25 # Arbitrary weight
            
    # Cap score at 100
    score = min(score, 100)
    
    return {
        "filename": filename,
        "matches": matches,
        "score": score,
        "is_suspicious": score > 0
    }
