from fastapi import UploadFile
from pathlib import Path
from PIL import Image
import shutil
import io


def validate_file(file: UploadFile):
    ALLOWED_EXT = ["jpeg", "jpg", "png"]
    MIN_WIDTH = 400
    MIN_HEIGHT = 300

    ext = Path(file.filename).suffix.lower().lstrip(".")
    # validate if valid extension
    if ext not in ALLOWED_EXT:
        return (False, "invalid file type")

    try:
        file_byte = file.file.read()
        # validate if correct dimensions
        with Image.open(io.BytesIO(file_byte)) as img:
            w, h = img.size

            if w < MIN_WIDTH or h < MIN_HEIGHT:
                return (False, "invalid file dimensions")
    except Exception:
        return (False, "file is corrupted")
    finally:
        # Crucial: Reset the stream pointer back to the start so shutil can read it later
        file.file.seek(0)
    # if all clear return result
    return (True, None)


def validate_and_store(file: UploadFile, main: Path):
    main.mkdir(parents=True, exist_ok=True)
    local_path = main / file.filename
    status, reason = validate_file(file)
    if status:
        # validate the file
        with open(local_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        file.file.seek(0)
    return (status, reason)
