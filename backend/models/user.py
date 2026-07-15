from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from backend.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String(225), unique=True, nullable=False)
    phone = Column(String(25), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default='customer')
    is_active = Column(Boolean, default=True)
    address = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    orders = relationship( "Order", back_populates="customer")
    cart = relationship("Cart",  back_populates="user", uselist=False, cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    wishlist = relationship("Wishlist", back_populates="user", uselist=False, cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")