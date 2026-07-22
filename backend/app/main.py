from fastapi import FastAPI, HTTPException, status
from jose import JWTError

from app.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.config import settings
from app.models import LoginRequest, RefreshRequest, TokenResponse

app = FastAPI(
    title="JWT Authentication API",
    description="FastAPI application demonstrating JWT-based authentication.",
    version="1.0.0",
)


@app.get("/health", tags=["Health"])
def health_check():
    """Liveness probe."""
    return {"status": "ok"}


@app.post("/auth/login", response_model=TokenResponse, tags=["Auth"])
def login(request: LoginRequest):
    """
    Authenticate with **username** and **password**.

    Returns an access token (valid for 300 s) and a refresh token.
    """
    user = authenticate_user(request.username, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {"sub": user["username"]}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        expires_in=settings.ACCESS_TOKEN_EXPIRE_SECONDS,
    )


@app.post("/auth/refresh", response_model=TokenResponse, tags=["Auth"])
def refresh_token(request: RefreshRequest):
    """
    Exchange a valid **refresh token** for a new pair of tokens.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(request.refresh_token)
    except JWTError:
        raise credentials_exception

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type — a refresh token is required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    username: str = payload.get("sub")
    if not username:
        raise credentials_exception

    token_data = {"sub": username}
    return TokenResponse(
        access_token=create_access_token(token_data),
        refresh_token=create_refresh_token(token_data),
        expires_in=settings.ACCESS_TOKEN_EXPIRE_SECONDS,
    )
