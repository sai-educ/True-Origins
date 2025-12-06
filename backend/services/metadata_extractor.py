import subprocess
import json
from pathlib import Path

async def extract_metadata(filepath: Path) -> dict:
    """
    Extracts metadata from the file using ExifTool.
    """
    metadata = {
        "tool": "exiftool",
        "data": {},
        "error": None
    }
    
    try:
        # Run exiftool
        process = subprocess.Popen(
            ['exiftool', '-j', str(filepath)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            # Exiftool returns a list of dicts, we take the first one
            data = json.loads(stdout.decode('utf-8'))[0]
            metadata["data"] = data
        else:
            metadata["error"] = stderr.decode('utf-8')
            
    except FileNotFoundError:
        metadata["error"] = "ExifTool not found on system."
    except Exception as e:
        metadata["error"] = str(e)
        
    return metadata
