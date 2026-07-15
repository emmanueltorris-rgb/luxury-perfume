from sqlalchemy import Column, Integer, Text, ForeignKey,DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.database import Base

class Review(Base):
    __tablename__ = "reviews"

    __table_args__ = (UniqueConstraint("user_id", "product_id",
                                     name="unique_user_product_review"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id =Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    user = relationship("User", back_populates="reviews")
    product = relationship("Product", back_populates="reviews")