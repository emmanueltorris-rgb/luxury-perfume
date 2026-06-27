from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship

from backend.database import Base


class OrderItem(Base):

    __tablename__ = "order_items"


    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    order_id = Column(
        Integer,
        ForeignKey("orders.id")
    )


    product_id = Column(
        Integer,
        ForeignKey("products.id")
    )


    quantity = Column(
        Integer,
        default=1
    )


    price = Column(
        Float,
        nullable=False
    )


    # Connect to Order
    order = relationship(
        "Order",
        back_populates="items"
    )


    # Connect to Product
    product = relationship(
        "Product"
    )