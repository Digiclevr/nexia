"""
Redis client initialization
"""
import redis.asyncio as redis
import logging
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)

redis_client: Optional[redis.Redis] = None


async def init_redis():
    """Initialize Redis connection"""
    global redis_client
    try:
        # Pour le développement local, on skip Redis
        if "platform-pool" in settings.redis_url:
            logger.info("Skipping Redis connection for local development")
            return
            
        redis_client = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True
        )
        await redis_client.ping()
        logger.info("Redis connection established")
    except Exception as e:
        logger.error(f"Redis connection failed: {e}")
        redis_client = None


async def get_redis() -> Optional[redis.Redis]:
    """Get Redis client"""
    return redis_client
