"""
Application configuration
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # Database
    database_url: str = "postgresql://nexia:password@platform-pool:5432/nexia"
    
    # Redis
    redis_url: str = "redis://platform-pool:6379/0"
    
    # AI Providers
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    gemini_api_key: Optional[str] = None
    perplexity_api_key: Optional[str] = None
    
    # Server
    host: str = "0.0.0.0"
    port: int = 6000
    
    # Nexia Configuration
    nexia_default_mode: str = "focus_guardian"
    nexia_session_timeout: int = 3600
    
    # Environment
    environment: str = "development"
    debug: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
