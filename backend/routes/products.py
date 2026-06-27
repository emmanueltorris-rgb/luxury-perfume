from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from backend.database import get_db
from backend.models.product import Product
from backend.auth_utils import get_current_user
from backend.cloudinary import upload_image


router = APIRouter(
    prefix="/api/v1/products",
    tags=["products"]
)


# Full product update
class ProductUpdate(BaseModel):
    name: str
    brand: str
    description: Optional[str] = None
    price: float
    stock: int
    size_ml: Optional[int] = None
    category: Optional[str] = None
    image_url: Optional[str] = None


# Partial product update
class ProductPatch(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    stock: Optional[int] = None
    size_ml: Optional[int] = None
    category: Optional[str] = None


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

# PUBLIC - Get all products
@router.get("/")
def get_products(
    db: Session = Depends(get_db)
):
    return db.query(Product).filter(
        Product.is_active == True
    ).all()

# PUBLIC - Get single product
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
# ADMIN ONLY - Create product
@router.post("/")
def create_product(
    name: str = Form(...),
    brand: str = Form(...),
    description: Optional[str] = Form(None),
    price: float = Form(...),
    stock: int = Form(...),
    size_ml: Optional[int] = Form(None),
    category: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)

):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    image_url = upload_image(
        image.file
    )

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

# ADMIN ONLY - Full update
@router.put("/{product_id}")
def update_product(
    product_id: int,
    data: ProductUpdate,
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
        setattr(
            product,
            key,
            value
        )
    db.commit()
    db.refresh(product)
    return product

# ADMIN ONLY - Partial update
@router.patch("/{product_id}")
def patch_product(
    product_id: int,
    data: ProductPatch,
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
    updates = data.model_dump(
        exclude_unset=True
    )
    for key, value in updates.items():
        setattr(
            product,
            key,
            value
        )

    db.commit()
    db.refresh(product)

    return product

# ADMIN ONLY - Soft delete
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