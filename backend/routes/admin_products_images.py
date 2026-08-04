from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.auth_utils import get_current_admin
from backend.models.product import Product
from backend.models.product_image import ProductImage
from backend.models.user import User
from backend.cloudinary import upload_image, delete_image

router = APIRouter(
    prefix="/api/v1/admin/product-images",
    tags=["Admin Product Images"]
)
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

    for image in images:
        image_result = upload_image(image.file)

        product_image = ProductImage(
            product_id=product.id,
            image_url=image_result["url"],
            image_public_id=image_result["public_id"],
            is_main=False
        )

        db.add(product_image)

    db.commit()

    return {
        "message": f"{len(images)} image(s) uploaded successfully."
    }


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