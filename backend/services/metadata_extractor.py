import subprocess
import json
import shutil
from pathlib import Path

async def extract_metadata(filepath: Path) -> dict:
    """
    Extracts comprehensive metadata from the file using ExifTool.
    Returns structured data with key attributes highlighted.
    """
    metadata = {
        "tool": "exiftool",
        "raw_data": {},
        "data": {},
        "key_attributes": {},
        "error": None
    }
    
    # Find exiftool path
    exiftool_path = shutil.which('exiftool')
    if not exiftool_path:
        # Try common locations on macOS
        for path in ['/opt/homebrew/bin/exiftool', '/usr/local/bin/exiftool', '/usr/bin/exiftool']:
            if Path(path).exists():
                exiftool_path = path
                break
    
    if not exiftool_path:
        metadata["error"] = "ExifTool not found. Please install via: brew install exiftool"
        return metadata
    
    try:
        # Run exiftool with JSON output
        process = subprocess.run(
            [exiftool_path, '-j', '-G', str(filepath)],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if process.returncode == 0 and process.stdout:
            raw_data = json.loads(process.stdout)[0]
            metadata["raw_data"] = raw_data
            
            # Extract key attributes for easy display
            key_attrs = {}
            
            # File Info
            key_attrs["File Name"] = raw_data.get("File:FileName", raw_data.get("FileName", "Unknown"))
            key_attrs["File Size"] = raw_data.get("File:FileSize", raw_data.get("FileSize", "Unknown"))
            key_attrs["File Type"] = raw_data.get("File:FileType", raw_data.get("FileType", "Unknown"))
            key_attrs["MIME Type"] = raw_data.get("File:MIMEType", raw_data.get("MIMEType", "Unknown"))
            
            # Image/Video Dimensions
            if "File:ImageWidth" in raw_data or "ImageWidth" in raw_data:
                width = raw_data.get("File:ImageWidth", raw_data.get("ImageWidth", ""))
                height = raw_data.get("File:ImageHeight", raw_data.get("ImageHeight", ""))
                if width and height:
                    key_attrs["Dimensions"] = f"{width} x {height}"
            
            # Dates
            for date_field in ["EXIF:DateTimeOriginal", "EXIF:CreateDate", "File:FileModifyDate", 
                               "DateTimeOriginal", "CreateDate", "FileModifyDate", "ModifyDate"]:
                if date_field in raw_data or date_field.split(":")[-1] in raw_data:
                    val = raw_data.get(date_field, raw_data.get(date_field.split(":")[-1]))
                    if val:
                        key_attrs["Date Created"] = val
                        break
            
            # Camera/Device Info
            make = raw_data.get("EXIF:Make", raw_data.get("Make", ""))
            model = raw_data.get("EXIF:Model", raw_data.get("Model", ""))
            if make or model:
                key_attrs["Camera/Device"] = f"{make} {model}".strip()
            
            # Software
            software = raw_data.get("EXIF:Software", raw_data.get("Software", 
                       raw_data.get("XMP:CreatorTool", raw_data.get("CreatorTool", ""))))
            if software:
                key_attrs["Software"] = software
            
            # Color Profile
            color_space = raw_data.get("EXIF:ColorSpace", raw_data.get("ColorSpace", 
                          raw_data.get("ICC-header:ProfileDescription", raw_data.get("ProfileDescription", ""))))
            if color_space:
                key_attrs["Color Profile"] = color_space
            
            # Bit Depth  
            bit_depth = raw_data.get("File:BitsPerSample", raw_data.get("BitsPerSample", ""))
            if bit_depth:
                key_attrs["Bit Depth"] = f"{bit_depth} bits"
            
            # GPS (if available)
            lat = raw_data.get("EXIF:GPSLatitude", raw_data.get("GPSLatitude", ""))
            lon = raw_data.get("EXIF:GPSLongitude", raw_data.get("GPSLongitude", ""))
            if lat and lon:
                key_attrs["GPS Location"] = f"{lat}, {lon}"
            
            # Author/Artist
            author = raw_data.get("EXIF:Artist", raw_data.get("Artist", 
                     raw_data.get("XMP:Creator", raw_data.get("Creator", ""))))
            if author:
                key_attrs["Author"] = author
            
            # Copyright
            copyright_info = raw_data.get("EXIF:Copyright", raw_data.get("Copyright", ""))
            if copyright_info:
                key_attrs["Copyright"] = copyright_info
            
            # AI-related fields
            ai_fields = {}
            for key, value in raw_data.items():
                key_lower = key.lower()
                if any(ai_term in key_lower for ai_term in ['ai', 'synthetic', 'generated', 'prompt', 'model']):
                    ai_fields[key] = value
            if ai_fields:
                key_attrs["AI-Related Fields"] = ai_fields
            
            metadata["key_attributes"] = key_attrs
            
            # Categorize metadata
            categorized = {
                "Image Metadata": {
                    "Name": raw_data.get("FileName"),
                    "File Size": raw_data.get("FileSize"),
                    "File Type": raw_data.get("FileType"),
                    "MIME Type": raw_data.get("MIMEType"),
                    "Image Size": raw_data.get("ImageSize"),
                    "Color Space": raw_data.get("ColorSpace"),
                    "Created": raw_data.get("CreateDate") or raw_data.get("DateTimeOriginal"),
                },
                "Camera Settings": {
                    "Make": raw_data.get("Make"),
                    "Model": raw_data.get("Model"),
                    "Lens": raw_data.get("LensID") or raw_data.get("LensModel"),
                    "Focal Length": raw_data.get("FocalLength"),
                    "Aperture": raw_data.get("FNumber"),
                    "Exposure": raw_data.get("ExposureTime"),
                    "ISO": raw_data.get("ISO"),
                    "Flash": raw_data.get("Flash"),
                },
                "Location": {
                    "Altitude": raw_data.get("GPSAltitude"),
                    "Latitude": raw_data.get("GPSLatitude"),
                    "Longitude": raw_data.get("GPSLongitude"),
                }
            }
            
            # Filter out None values
            for category in categorized:
                categorized[category] = {k: v for k, v in categorized[category].items() if v is not None}
            
            # Remove empty categories
            categorized = {k: v for k, v in categorized.items() if v}

            # Calculate metadata statistics
            metadata_json_str = json.dumps(raw_data)
            metadata_size_bytes = len(metadata_json_str.encode('utf-8'))
            
            # Get file size in bytes
            file_size_bytes = 0
            try:
                import os
                file_size_bytes = os.path.getsize(filepath)
            except:
                pass

            # Format File Size string: "1.41 MB (1474611 bytes)"
            file_size_display = raw_data.get("FileSize", "")
            if file_size_bytes > 0:
                # If ExifTool gave us a formatted string, append bytes. 
                # If it gave bytes, format it.
                # ExifTool -j usually gives formatted string if -n is NOT used.
                if str(file_size_bytes) not in str(file_size_display):
                     file_size_display = f"{file_size_display} ({file_size_bytes} bytes)"
            
            # Format Image Size string: "4000 x 6000 (24.0 megapixels)"
            image_size_display = raw_data.get("ImageSize", "")
            megapixels = raw_data.get("Megapixels", "")
            if image_size_display and megapixels:
                 image_size_display = f"{image_size_display} ({megapixels} megapixels)"

            metadata_pct = 0
            if file_size_bytes > 0:
                metadata_pct = (metadata_size_bytes / file_size_bytes) * 100

            metadata["statistics"] = {
                "metadata_size_bytes": metadata_size_bytes,
                "file_size_bytes": file_size_bytes,
                "percentage": round(metadata_pct, 2)
            }

            metadata["categorized"] = categorized
            # Update categorized with formatted values
            if "Image Metadata" in metadata["categorized"]:
                metadata["categorized"]["Image Metadata"]["File Size"] = file_size_display
                metadata["categorized"]["Image Metadata"]["Image Size"] = image_size_display

            metadata["full_metadata"] = raw_data # Store full flat metadata for the list view
            metadata["data"] = raw_data
            
        else:
            metadata["error"] = process.stderr or "Unknown error running ExifTool"
            
    except subprocess.TimeoutExpired:
        metadata["error"] = "ExifTool timed out"
    except json.JSONDecodeError as e:
        metadata["error"] = f"Failed to parse ExifTool output: {str(e)}"
    except Exception as e:
        metadata["error"] = str(e)
        
    return metadata
