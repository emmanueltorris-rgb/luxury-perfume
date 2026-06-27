from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from backend.database import get_db
from backend.models.order import Order
from backend.auth_utils import get_current_user
from backend.models.user import User


router = APIRouter(
    prefix="/api/v1/orders",
    tags=["orders"]
)


class OrderCreate(BaseModel):
    product_ids: List[int]
    total: float


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
        total=data.total,
        status="pending"
    )

    db.add(order)
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

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    orders = db.query(Order).filter(
        Order.customer_id == user.id
    ).all()

    return orders


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


# Update order status (Admin only)
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
    db.refresh(order)

    return {
        "message": f"Order status updated to {status}"
    }