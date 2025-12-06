import subprocess
import json
from pathlib import Path

async def verify_c2pa(filepath: Path) -> dict:
    """
    Verifies C2PA data using c2patool.
    """
    result = {
        "has_c2pa": False,
        "data": None,
        "error": None
    }
    
    try:
        # Run c2patool
        # Assuming c2patool is in the PATH. If not, we might need to point to it.
        process = subprocess.Popen(
            ['c2patool', str(filepath)],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()
        
        output = stdout.decode('utf-8')
        
        if process.returncode == 0:
            # Parse the output. c2patool output can be complex.
            # For now, we'll just store the raw output or try to parse if it's JSON-like
            # Often c2patool returns a JSON structure.
            try:
                data = json.loads(output)
                result["has_c2pa"] = True
                result["data"] = data
            except json.JSONDecodeError:
                # If not JSON, just save the text
                result["data"] = output
                # Check if it says "No claim found" or similar
                if "No claim found" not in output:
                     result["has_c2pa"] = True # Tentative
        else:
            err_msg = stderr.decode('utf-8')
            if "No claim found" in err_msg or "No claim found" in output:
                 result["has_c2pa"] = False
            else:
                 result["error"] = err_msg

    except FileNotFoundError:
        result["error"] = "c2patool not found on system."
    except Exception as e:
        result["error"] = str(e)
        
    return result
