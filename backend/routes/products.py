from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from backend.database import get_db
from backend.models.product import Product
from backend.auth_utils import get_current_user, admin_required
import os
from pathlib import Path
from shutil import copyfileobj

UPLOAD_DIR = Path(__file__).resolve().parents[2] / 'static' / 'uploads'
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


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
@router.post("/", dependencies=[Depends(admin_required)])
def create_product(
    name: str = Form(...),
    brand: str = Form(...),
    price: float = Form(...),
    stock: int = Form(0),
    description: Optional[str] = Form(None),
    size_ml: Optional[int] = Form(None),
    category: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):

    image_url = None
    if image:
        from datetime import datetime
        import re
        stem = Path(image.filename).stem
        safe_stem = re.sub(r'[^a-zA-Z0-9_-]', '_', stem)[:50]
        filename = f"{safe_stem}_{int(datetime.utcnow().timestamp())}_{image.filename}"
        target = UPLOAD_DIR / filename
        with target.open('wb') as f:
            copyfileobj(image.file, f)
        image_url = f"/static/uploads/{filename}"

    product = Product(
        name=name,
        brand=brand,
        description=description,
        price=price,
        stock=stock,
        size_ml=size_ml,
        category=category,
        image_url=image_url
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product



@router.put("/{product_id}", dependencies=[Depends(admin_required)])
def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    brand: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    stock: Optional[int] = Form(None),
    description: Optional[str] = Form(None),
    size_ml: Optional[int] = Form(None),
    category: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):

    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if name is not None:
        product.name = name
    if brand is not None:
        product.brand = brand
    if price is not None:
        product.price = price
    if stock is not None:
        product.stock = stock
    if description is not None:
        product.description = description
    if size_ml is not None:
        product.size_ml = size_ml
    if category is not None:
        product.category = category

    if image:
        from datetime import datetime
        import re
        stem = Path(image.filename).stem
        safe_stem = re.sub(r'[^a-zA-Z0-9_-]', '_', stem)[:50]
        filename = f"{safe_stem}_{int(datetime.utcnow().timestamp())}_{image.filename}"
        target = UPLOAD_DIR / filename
        with target.open('wb') as f:
            copyfileobj(image.file, f)
        product.image_url = f"/static/uploads/{filename}"

    db.commit()
    db.refresh(product)

    return product



@router.delete("/{product_id}", dependencies=[Depends(admin_required)])
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):

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