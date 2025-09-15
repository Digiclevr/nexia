"""
Nexia AI Core Service - Main Application
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.config import settings
from app.api.v1 import router as api_v1_router
from app.core.database import init_db
from app.core.redis_client import init_redis

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting Nexia AI Core Service...")
    await init_db()
    await init_redis()
    
    yield
    
    # Shutdown
    logger.info("Shutting down Nexia AI Core Service...")


# Create FastAPI app
app = FastAPI(
    title="Nexia AI Core",
    description="AI Engine for Nexia Assistant",
    version="0.1.0",
    lifespan=lifespan
)

# Configure CORS - très permissif pour le développement
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(api_v1_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Nexia AI Core",
        "version": "0.1.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "nexia-ai-core",
        "cors": "enabled"
    }
