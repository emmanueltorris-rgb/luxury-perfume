from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from backend.database import get_db
from backend.models.order import Order
from backend.models.order_item import OrderItem
from backend.models.product import Product
from backend.auth_utils import get_current_user
from backend.models.user import User


router = APIRouter(
    prefix="/api/v1/orders",
    tags=["orders"]
)


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]



# Create order - User must be logged in
@router.post("/")
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user["email"]
    ).first()


    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    order = Order(
        customer_id=user.id,
        total=0,
        status="pending"
    )


    db.add(order)
    db.commit()
    db.refresh(order)


    total = 0


    for item in data.items:

        product = db.query(Product).filter(
            Product.id == item.product_id
        ).first()


        if not product:
            raise HTTPException(
                status_code=404,
                detail="Product not found"
            )


        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )


        total += product.price * item.quantity


        db.add(order_item)


    order.total = total


    db.commit()
    db.refresh(order)


    return order



# View logged-in user's orders
@router.get("/my-orders")
def my_orders(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    user = db.query(User).filter(
        User.email == current_user["email"]
    ).first()


    return db.query(Order).filter(
        Order.customer_id == user.id
    ).all()



# Admin - view all orders
@router.get("/")
def all_orders(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


    return db.query(Order).all()



# Update order status
@router.put("/{order_id}/status")
def update_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )


    order = db.query(Order).filter(
        Order.id == order_id
    ).first()


    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )


    order.status = status

    db.commit()


    return {
        "message": f"Order status updated to {status}"
    }