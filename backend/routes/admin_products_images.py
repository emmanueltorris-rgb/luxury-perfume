from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.auth_utils import get_current_admin
from backend.models.product import Product
from backend.models.product_image import ProductImage
from backend.models.user import User
from backend.cloudinary import upload_image, delete_image
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/v1/admin/product-images",
    tags=["Admin Product Images"]
)

class ImageOrderUpdate(BaseModel):
    display_order:int

@router.post("/{product_id}")
def add_product_images(
    product_id: int,
    images: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    existing_images = (
        db.query(ProductImage)
        .filter(ProductImage.product_id == product.id)
        .count()
    )

    last_image = (
        db.query(ProductImage)
        .filter(ProductImage.product_id == product.id)
        .order_by(ProductImage.display_order.desc())
        .first()
    )

    next_display_order = (
        last_image.display_order + 1
        if last_image
        else 1
    )
    for image in images:
        image_result = upload_image(image.file)

        product_image = ProductImage(
            product_id=product.id,
            image_url=image_result["url"],
            image_public_id=image_result["public_id"],
            is_main=(existing_images == 0),
            display_order=next_display_order
        )

        db.add(product_image)

        existing_images += 1
        next_display_order += 1
    db.commit()
    return {
        "message": f"{len(images)} image(s) uploaded successfully."
    }

@router.get("/{product_id}")
def get_product_images(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    images = (
        db.query(ProductImage)
        .filter(ProductImage.product_id == product_id)
        .order_by(ProductImage.display_order)
        .all()
    )

    return images

@router.patch("/{image_id}/main")
def set_main_image(
    image_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    image = (
        db.query(ProductImage)
        .filter(ProductImage.id == image_id)
        .first()
    )
    if not image:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )
    db.query(ProductImage).filter(
        ProductImage.product_id == image.product_id
    ).update(
        {"is_main": False}
    )

    image.is_main = True

    db.commit()
    db.refresh(image)

    return {
        "message": "Main image updated successfully.",
        "image_id": image.id
    }

@router.patch("/{image_id}/order")
def update_image_order(
    image_id: int,
    data: ImageOrderUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    if data.display_order < 1:
        raise HTTPException(
            status_code=400,
            detail="Display order must be at least 1"
        )

    image = (
        db.query(ProductImage)
        .filter(ProductImage.id == image_id)
        .first()
    )

    if not image:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )

    product_id = image.product_id
    old_order = image.display_order
    new_order = data.display_order

    if old_order == new_order:
        return {
            "message": "Image order unchanged.",
            "image_id": image.id,
            "display_order": image.display_order
        }

    images = (
        db.query(ProductImage)
        .filter(ProductImage.product_id == product_id)
        .order_by(ProductImage.display_order)
        .all()
    )

    max_order = len(images)

    if new_order > max_order:
        new_order = max_order

    if new_order < old_order:
        for other_image in images:
            if (
                other_image.id != image.id
                and old_order >= other_image.display_order >= new_order
            ):
                other_image.display_order += 1

    else:
        for other_image in images:
            if (
                other_image.id != image.id
                and old_order <= other_image.display_order <= new_order
            ):
                other_image.display_order -= 1

    image.display_order = new_order

    db.commit()
    db.refresh(image)

    return {
        "message": "Image order updated successfully.",
        "image_id": image.id,
        "display_order": image.display_order
    }

@router.delete("/{image_id}")
def delete_product_image(
    image_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    image = (
        db.query(ProductImage)
        .filter(ProductImage.id == image_id)
        .first()
    )

    if not image:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )

    # Prevent deleting the main image if it's the only image
    total_images = (
        db.query(ProductImage)
        .filter(ProductImage.product_id == image.product_id)
        .count()
    )

    if image.is_main and total_images == 1:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete the only image for this product."
        )

    # Delete from Cloudinary
    if image.image_public_id:
        delete_image(image.image_public_id)

    was_main = image.is_main
    product_id = image.product_id

    db.delete(image)
    db.commit()

    # If the deleted image was the main one, choose another as the new main image
    if was_main:
        new_main = (
            db.query(ProductImage)
            .filter(ProductImage.product_id == product_id)
            .order_by(ProductImage.display_order)
            .first()
        )

        if new_main:
            new_main.is_main = True
            db.commit()

    return {
        "message": "Image deleted successfully."
    }