"""
AI Tool Detection Service
Detects which AI tool likely generated the media based on filename patterns,
metadata signatures, and C2PA assertions.
"""

# Known AI tool patterns and metadata signatures
AI_TOOLS = {
    "midjourney": {
        "name": "Midjourney",
        "patterns": [r"midjourney", r"mj_", r"_mj"],
        "software_signatures": ["midjourney"],
        "logo": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
        "color": "#7C3AED"
    },
    "dalle": {
        "name": "DALL-E",
        "patterns": [r"dall-?e", r"dalle", r"openai"],
        "software_signatures": ["dall-e", "openai"],
        "logo": "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
        "color": "#10A37F"
    },
    "stable_diffusion": {
        "name": "Stable Diffusion",
        "patterns": [r"stable.?diffusion", r"sd_", r"_sd", r"stability", r"txt2img", r"img2img"],
        "software_signatures": ["stable diffusion", "stability.ai", "automatic1111", "comfyui"],
        "logo": "https://upload.wikimedia.org/wikipedia/commons/1/18/Stability-AI-Logo.png",
        "color": "#9333EA"
    },
    "adobe_firefly": {
        "name": "Adobe Firefly",
        "patterns": [r"firefly", r"adobe.?firefly"],
        "software_signatures": ["adobe firefly", "firefly"],
        "logo": "https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Firefly_logo.svg",
        "color": "#FF4500"
    },
    "runway": {
        "name": "Runway",
        "patterns": [r"runway", r"gen-?2", r"gen2"],
        "software_signatures": ["runway", "gen-2"],
        "logo": "https://avatars.githubusercontent.com/u/17966782",
        "color": "#000000"
    },
    "leonardo": {
        "name": "Leonardo.AI",
        "patterns": [r"leonardo", r"leonardo.?ai"],
        "software_signatures": ["leonardo"],
        "logo": "https://avatars.githubusercontent.com/u/111434792",
        "color": "#6366F1"
    },
    "flux": {
        "name": "FLUX",
        "patterns": [r"flux", r"black.?forest"],
        "software_signatures": ["flux", "black forest labs"],
        "logo": "https://avatars.githubusercontent.com/u/139376803",
        "color": "#1E40AF"
    }
}

import re

def detect_ai_tool(filename: str, metadata: dict, c2pa_data: dict) -> dict:
    """
    Detects which AI tool likely generated the media.
    
    Returns:
        dict with keys: detected, tool_id, name, logo, color, confidence, reason
    """
    filename_lower = filename.lower()
    
    # Check filename patterns
    for tool_id, tool_info in AI_TOOLS.items():
        for pattern in tool_info["patterns"]:
            if re.search(pattern, filename_lower):
                return {
                    "detected": True,
                    "tool_id": tool_id,
                    "name": tool_info["name"],
                    "logo": tool_info["logo"],
                    "color": tool_info["color"],
                    "confidence": "high",
                    "reason": f"Filename matches {tool_info['name']} pattern"
                }
    
    # Check metadata software signatures
    if metadata and metadata.get("data"):
        software = str(metadata.get("data", {}).get("Software", "")).lower()
        creator_tool = str(metadata.get("data", {}).get("CreatorTool", "")).lower()
        combined = software + " " + creator_tool
        
        for tool_id, tool_info in AI_TOOLS.items():
            for sig in tool_info["software_signatures"]:
                if sig.lower() in combined:
                    return {
                        "detected": True,
                        "tool_id": tool_id,
                        "name": tool_info["name"],
                        "logo": tool_info["logo"],
                        "color": tool_info["color"],
                        "confidence": "high",
                        "reason": f"Metadata software field contains {tool_info['name']} signature"
                    }
    
    # Check C2PA data for AI tool assertions
    if c2pa_data and c2pa_data.get("has_c2pa") and c2pa_data.get("data"):
        c2pa_str = str(c2pa_data.get("data", "")).lower()
        
        # Check for generative AI assertions
        if "generative" in c2pa_str or "ai generated" in c2pa_str:
            # Try to identify which tool
            for tool_id, tool_info in AI_TOOLS.items():
                for sig in tool_info["software_signatures"]:
                    if sig.lower() in c2pa_str:
                        return {
                            "detected": True,
                            "tool_id": tool_id,
                            "name": tool_info["name"],
                            "logo": tool_info["logo"],
                            "color": tool_info["color"],
                            "confidence": "high",
                            "reason": f"C2PA manifest indicates {tool_info['name']}"
                        }
            
            # Generic AI detection
            return {
                "detected": True,
                "tool_id": "unknown_ai",
                "name": "AI Generated",
                "logo": None,
                "color": "#EF4444",
                "confidence": "medium",
                "reason": "C2PA manifest indicates AI generation but specific tool unknown"
            }
    
    # No AI tool detected
    return {
        "detected": False,
        "tool_id": None,
        "name": None,
        "logo": None,
        "color": None,
        "confidence": None,
        "reason": "No AI generation indicators found"
    }
