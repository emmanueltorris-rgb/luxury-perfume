from sqlalchemy import Column, Integer, Text, ForeignKey,DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from backend.database import Base

class WishlistItem(Base):
    __tablename__ ="wishlist_items"

    __table_args__ =(UniqueConstraint("wishlist_id", "product_id", name="unique_wishlist_product"),)
    id = Column(Integer, primary_key=True, index=True)
    wishlist_id =Column(Integer, ForeignKey("wishlists.id"), nullable=False, index=True)
    product_id =Column(Integer,ForeignKey("products.id"), nullable=False, index=True)
    wishlist = relationship("Wishlist", back_populates="items")
    product = relationship("Product")