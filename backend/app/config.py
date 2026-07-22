from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 300
    REFRESH_TOKEN_EXPIRE_SECONDS: int = 86400  # 24 hours

    class Config:
        env_file = ".env"


settings = Settings()
