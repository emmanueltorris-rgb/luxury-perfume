from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base
from sqlalchemy.sql import func


class Order(Base):
    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    total = Column(
        Numeric(10,2),
        nullable=False
    )

    status = Column(
        String(50),
        default="pending"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    customer = relationship( "User", back_populates="orders")

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete"
    )