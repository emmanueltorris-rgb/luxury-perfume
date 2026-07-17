from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from backend.models.user import User
from backend.database import get_db
from backend.models.product import Product
from backend.auth_utils import get_current_admin
from backend.cloudinary import upload_image
from backend.cloudinary import delete_image
router = APIRouter(
    prefix="/api/v1/products",
    tags=["products"]
)


class ProductResponse(BaseModel):
    id: int
    name: str
    brand: str
    description: Optional[str]
    price: float
    stock: int
    size_ml: Optional[int]
    category: Optional[str]
    image_url: Optional[str]

    class Config:
        from_attributes = True


@router.get("/", response_model=List[ProductResponse])
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(Product).filter(
        Product.is_active == True
    ).all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product



