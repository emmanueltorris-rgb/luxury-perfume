from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from backend.database import get_db
from backend.models.product import Product
from backend.auth_utils import get_current_user


router = APIRouter(
    prefix="/api/v1/products",
    tags=["products"]
)


class ProductCreate(BaseModel):
    name: str
    brand: str
    description: Optional[str] = None
    price: float
    stock: int
    size_ml: Optional[int] = None
    category: Optional[str] = None
    image_url: Optional[str] = None



class ProductResponse(BaseModel):
    id: int
    name: str
    brand: str
    price: float
    stock: int

    class Config:
        from_attributes = True



# Public - anyone can view products
@router.get("/")
def get_products(
    db: Session = Depends(get_db)
):

    return db.query(Product).filter(
        Product.is_active == True
    ).all()



@router.get("/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()


    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product



# Admin only
@router.post("/")
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


    product = Product(
        **data.model_dump()
    )


    db.add(product)
    db.commit()
    db.refresh(product)


    return product



@router.put("/{product_id}")
def update_product(
    product_id: int,
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


    product = db.query(Product).filter(
        Product.id == product_id
    ).first()


    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


    for key, value in data.model_dump().items():
        setattr(product, key, value)


    db.commit()
    db.refresh(product)


    return product



@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


    product = db.query(Product).filter(
        Product.id == product_id
    ).first()


    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )


    product.is_active = False

    db.commit()


    return {
        "message": "Product deleted"
    }