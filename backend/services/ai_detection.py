import os
from uuid import UUID
from fastapi import Depends
from database import get_async_db
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from dotenv import load_dotenv

load_dotenv()


async def analyze_inspection(
    inspection_id: UUID, asset_id: UUID, db: AsyncSession = Depends(get_async_db)
):
    # access all the files from the local storage
    dir = Path(f"{os.getenv('SAVE_DIR')}/{asset_id}/{inspection_id}")
    # iterate over the files and get the defect response from ai
    for file in dir.iterdir():
        if file.is_file():
            print(file)
    # deduplicate the payload

    # return the response
