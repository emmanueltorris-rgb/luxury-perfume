from sqlalchemy import Column, Integer, Text, ForeignKey,DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base

class Wishlist(Base):
    __tablename__ = "wishlists"
    id = Column(Integer, primary_key=True, index=True)
    user_id =Column(Integer, ForeignKey("users.id"), nullable=False,unique=True, index=True)
    created_at =Column(DateTime, server_default=func.now())
    user = relationship("User", back_populates="wishlist")
    items =relationship("WishlistItem", back_populates="wishlist", cascade="all, delete-orphan")