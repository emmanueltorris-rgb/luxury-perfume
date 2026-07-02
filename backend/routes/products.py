from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from backend.database import get_db
from backend.models.product import Product
from backend.auth_utils import admin_required
from backend.cloudinary import upload_image

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


@router.post(
    "/",
    response_model=ProductResponse,
    dependencies=[Depends(admin_required)]
)
def create_product(
    name: str = Form(...),
    brand: str = Form(...),
    price: float = Form(...),
    stock: int = Form(0),
    description: Optional[str] = Form(None),
    size_ml: Optional[int] = Form(None),
    category: Optional[str] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    image_result = upload_image(image.file)

    product = Product(
        name=name,
        brand=brand,
        description=description,
        price=price,
        stock=stock,
        size_ml=size_ml,
        category=category,
        image_url=image_result["url"],
        image_public_id=image_result["public_id"]
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product

from backend.cloudinary import delete_image


@router.put(
    "/{product_id}",
    response_model=ProductResponse,
    dependencies=[Depends(admin_required)]
)
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
        Product.id == product_id,
        Product.is_active == True
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

        if product.image_public_id:
            delete_image(product.image_public_id)

        image_result = upload_image(image.file)

        product.image_url = image_result["url"]
        product.image_public_id = image_result["public_id"]

    db.commit()
    db.refresh(product)

    return product


@router.delete(
    "/{product_id}",
    dependencies=[Depends(admin_required)]
)
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

    if product.image_public_id:
        delete_image(product.image_public_id)

    product.is_active = False

    db.commit()

    return {
        "message": "Product deleted successfully"
    }