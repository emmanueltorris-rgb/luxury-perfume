from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base
from sqlalchemy.sql import func


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column( Integer, ForeignKey("users.id"),nullable=False, index=True)
    total = Column(Numeric(10,2), nullable=False)
    status = Column(String(50), default="pending_payment",nullable=False)
    created_at = Column( DateTime, server_default=func.now())
    user = relationship( "User", back_populates="orders")
    items = relationship( "OrderItem", back_populates="order", cascade="all, delete-orphan")
    transactions = relationship(  "Transaction", back_populates="order", cascade="all, delete-orphan")
    address_id = Column(Integer, ForeignKey("addresses.id"), nullable=False)
    address = relationship("Address", back_populates="orders")