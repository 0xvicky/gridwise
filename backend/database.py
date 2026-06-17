import os
from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from dotenv import load_dotenv

load_dotenv()
ASYNC_DB_URL = os.getenv("ASYNC_DB_URL")

if not ASYNC_DB_URL:
    raise ValueError("ASYNC_DB_URL env var is not set")

# creates async engine for connecting to the database using the URL from the environment variable and async because we are using asyncpg as the driver. The echo=True option enables logging of SQL statements, and pool_pre_ping=True ensures that connections are checked for liveness before being used from the pool.
async_engine = create_async_engine(ASYNC_DB_URL, echo=True, pool_pre_ping=True)

async_session_maker = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


# 4. Define the Base class for your database models
class Base(DeclarativeBase):
    pass


async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
            yield session
