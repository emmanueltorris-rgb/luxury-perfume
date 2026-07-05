import os
from functools import lru_cache
from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv


backend_dir = Path(__file__).resolve().parent
env_file = backend_dir / ".env"

load_dotenv(env_file)

class Settings(BaseSettings):
    MPESA_CONSUMER_KEY: str = Field(default="", env="MPESA_CONSUMER_KEY")
    MPESA_CONSUMER_SECRET: str = Field(default="", env="MPESA_CONSUMER_SECRET")
    MPESA_PASSKEY: str = Field(default="", env="MPESA_PASSKEY")
    MPESA_SHORTCODE: str = Field(default="174379", env="MPESA_SHORTCODE")
    MPESA_ENV: str = Field(default="sandbox", env="MPESA_ENV")
    MPESA_MOCK_MODE: bool = Field(default=False, env="MPESA_MOCK_MODE")
    MPESA_CALLBACK_URL: str
    DATABASE_URL: str = Field(..., env="DATABASE_URL")
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    CLOUDINARY_CLOUD_NAME: str = Field(...,env="CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY: str = Field(..., env="CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET: str = Field(...,env="CLOUDINARY_API_SECRET")


    @property
    def BASE_URL(self) -> str:
        return (
            "https://sandbox.safaricom.co.ke"
            if self.MPESA_ENV == "sandbox"
            else "https://api.safaricom.co.ke"
        )
    APP_NAME: str = "Luxury Perfume E-Commerce"
    DEBUG: bool = Field(
        default=False,
        env="DEBUG"
    )
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]

    class Config:
        env_file = str(env_file)
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    return Settings()