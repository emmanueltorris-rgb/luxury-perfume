from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

from backend.database import get_db
from backend.models.admin import Admin
from backend.models.user import User
from backend.config import get_settings


settings = get_settings()

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["auth"]
)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def create_token(data: dict):

    token_data = data.copy()

    expire = datetime.utcnow() + timedelta(hours=24)

    token_data.update({
        "exp": expire
    })

    return jwt.encode(
        token_data,
        settings.SECRET_KEY,
        algorithm="HS256"
    )


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str



@router.post("/admin/login")
def admin_login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    admin = db.query(Admin).filter(
        Admin.email == request.email
    ).first()


    if not admin or not verify_password(
        request.password,
        admin.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )


    token = create_token({
        "sub": admin.email,
        "role": "admin"
    })


    return {
        "access_token": token,
        "token_type": "bearer"
    }



@router.post("/register")
def register_user(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == request.email
    ).first()


    existing_admin = db.query(Admin).filter(
        Admin.email == request.email
    ).first()


    if existing_user or existing_admin:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    user = User(
        name=request.name,
        email=request.email,
        phone=request.phone,
        hashed_password=hash_password(request.password)
    )


    db.add(user)
    db.commit()
    db.refresh(user)


    return {
        "message": "Account created successfully"
    }



@router.post("/login")
def user_login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == request.email
    ).first()


    if not user or not verify_password(
        request.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )


    token = create_token({
        "sub": user.email,
        "role": "user"
    })


    return {
        "access_token": token,
        "token_type": "bearer"
    }