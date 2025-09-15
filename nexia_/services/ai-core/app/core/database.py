"""
Database initialization and management
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import logging

from app.config import settings

logger = logging.getLogger(__name__)

# Create async engine
engine = create_async_engine(
    settings.database_url.replace("postgresql://", "postgresql+asyncpg://"),
    echo=settings.debug,
    future=True
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Create base class for models
Base = declarative_base()


async def init_db():
    """Initialize database"""
    try:
        # Pour le développement local, on skip la connexion DB
        if "localhost" in settings.database_url or "platform-pool" in settings.database_url:
            logger.info("Skipping database connection for local development")
            return
            
        async with engine.begin() as conn:
            # Create tables if they don't exist
            # await conn.run_sync(Base.metadata.create_all)
            logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        # En dev, on continue sans DB
        if settings.environment == "development":
            logger.warning("Continuing without database in development mode")
        else:
            raise


async def get_db():
    """Get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
