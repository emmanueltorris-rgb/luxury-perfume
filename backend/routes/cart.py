from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.database import SessionLocal
from backend.auth_utils import get_current_user
from backend.crud.cart import (
    add_to_cart,
    get_cart_items,
    update_cart_item_quantity,
    remove_from_cart,
    clear_cart
)

router =APIRouter( prefix="/api/v1/cart", tags=["Cart"])
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AddToCartRequest(BaseModel):
    product_id: int
    quantity: int = 1

@router.post("/add")
def add_product_to_cart(
    request: AddToCartRequest,
    db:Session =Depends(get_db),
    current_user =Depends(get_current_user)
):
    cart_item = add_to_cart(
        db=db,
        user_id=current_user.id,
        product_id =request.product_id,
        quantity=request.quantity
    )
    return{
        "message": "Product added to cart successfully",
        "cart_item_id":cart_item.id,
        "product_id":cart_item.product.id,
        "quantity":cart_item.quantity
    }

@router.get("/")
def get_my_cart(
    db:Session =Depends(get_db),
    current_user =Depends(get_current_user)
):
    items = get_cart_items(db, current_user.id)
    return{
        "count": len(items),
        "items":[
            {
                "cart_item_id":item.id,
                "product_id":item.product.id,
                "product_name":item.product.name,
                "price":float(item.product.price),
                "quantity":item.quantity,
                "subtotal":float(item.product.price)*item.quantity,
                "image":item.product.image_url
                if hasattr(item.product, "image_url")
                else None
            }
            for item in items
        ]
    }

class UpdateCartRequest(BaseModel):
    quantity: int

@router.put("/{cart_item_id}")
def update_cart(
    cart_item_id: int,
    request: UpdateCartRequest,
    db:Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    cart_item = update_cart_item_quantity(
        db,
        cart_item_id,
        request.quantity
    )
    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )
    return{
        "message":"Cart updated successfully",
        "quantity":cart_item.quantity
    } 

@router.delete("/{cart_item_id}")
def delete_cart_item(
    cart_item_id: int,
    db:Session =Depends(get_db),
    current_user =Depends(get_current_user)
):
    success = remove_from_cart(db, cart_item_id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )
    return{
        "message":"Item removed from cart"
    }

@router.delete("/")
def empty_cart(
    db:Session =Depends(get_db),
    current_user =Depends(get_current_user)

):
    clear_cart(db, current_user.id)
    return{
        "message":"Cart cleared successfully"
    }