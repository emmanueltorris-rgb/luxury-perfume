from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_id = Column(
        Integer,
        ForeignKey("orders.id"),
        nullable=False
    )

    phone_number = Column(
        String(20),
        nullable=False
    )

    amount = Column(
        Numeric(10, 2),
        nullable=False
    )

    merchant_request_id = Column(
        String(100),
        nullable=True
    )

    checkout_request_id = Column(
        String(100),
        unique=True,
        nullable=True
    )

    mpesa_receipt_number = Column(
        String(100),
        nullable=True
    )

    transaction_date = Column(
        String(20),
        nullable=True
    )


    result_code = Column(
        String(20),
        nullable=True
    )

    result_description = Column(
        String(255),
        nullable=True
    )

    status = Column(
        String(30),
        default="PENDING"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now()
    )

    order = relationship(
        "Order",
        back_populates="transactions"
    )