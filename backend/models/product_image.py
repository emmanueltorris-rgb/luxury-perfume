from sqlalchemy import Column, Integer,String,Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base

class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    image_url = Column(String, nullable=False)
    image_public_id = Column(String, nullable=True)
    is_main = Column(Boolean, default=False)
    display_order =Column(Integer, default=1)
    created_at = Column(DateTime, server_default=func.now())
    product = relationship("Product", back_populates="images")