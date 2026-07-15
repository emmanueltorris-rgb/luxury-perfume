from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from backend.database import Base
from sqlalchemy.orm import relationship

class Address(Base):
    __tablename__ = "addresses"

    id = Column(Integer,primary_key=True, index=True)
    user_id= Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    country = Column(String(100), nullable=False)
    city = Column(String(100), nullable=False)
    street = Column(String(255), nullable=False)
    building = Column(String(100))
    postal_code = Column(String(20))
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    user = relationship("User", back_populates="addresses")
    
