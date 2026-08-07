from sqlalchemy import Column, Integer, String, Numeric, Boolean, Text, DateTime, Float
from backend.database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False, index=True)
    description = Column(Text)
    price = Column(Numeric(10,2), nullable=False)
    stock = Column(Integer, default=0)
    size_ml = Column(Integer)
    category = Column(String)
    preview_description = Column(Text)
    last = Column(String)
    scent_strength = Column(String)
    best_for = Column(String)
    low_stock_threshold = Column(Integer, default=5, nullable=False)
    is_active = Column(Boolean, default=True)
    discount_type = Column(String, default="none", nullable=False)
    discount_value = Column(Float, default=0, nullable=False)
    discount_active = Column(Boolean, default=False, nullable=False) 
    created_at = Column(DateTime, server_default=func.now(),nullable=False)
    order_items = relationship("OrderItem", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan",
                          order_by="ProductImage.display_order")
    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")