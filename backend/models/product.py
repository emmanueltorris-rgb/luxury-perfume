from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from backend.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    brand = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    size_ml = Column(Integer)
    category = Column(String)
    image_url = Column(String)
    is_active = Column(Boolean, default=True)