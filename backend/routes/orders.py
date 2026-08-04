from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.auth_utils import get_current_user
from backend.database import get_db
from backend.models.order import Order
from backend.models.order_item import OrderItem
from backend.models.product import Product
from backend.models.address import Address


router = APIRouter( prefix="/api/v1/orders", tags=["orders"])

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    address_id:int


@router.post("/")
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    address = (
        db.query(Address)
        .filter(
            Address.id == data.address_id,
            Address.user_id == current_user.id
        ).first()
            )

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Delivery address not found"
        )

    existing_order = (
        db.query(Order)
        .filter(
            Order.user_id == current_user.id,
            Order.status == "pending_payment"
        )
        .first()
    )

    try:
        if existing_order:
            order = existing_order
            order.address_id=data.address_id
            db.query(OrderItem).filter(
            OrderItem.order_id == order.id
            ).delete()
        else:
            order = Order(
                user_id=current_user.id,
                total=0,
                status="pending_payment",
                address_id=data.address_id
            )
            db.add(order)
            db.flush()
        total = 0
        
        for item in data.items:

            if item.quantity <= 0:
                raise HTTPException(
                    status_code=400,
                    detail="Quantity must be greater than zero"
                )

            product = (
                db.query(Product)
                .filter(
                    Product.id == item.product_id,
                    Product.is_active == True
                )
                .first()
            )

            if not product:
                raise HTTPException(
                    status_code=404,
                    detail=f"Product {item.product_id} not found"
                )

            if product.stock < item.quantity:
                raise HTTPException(
                    status_code=400,
                    detail=f"Only {product.stock} item(s) left for {product.name}"
                )

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.price
            )

            db.add(order_item)

            total += product.price * item.quantity

        order.total = total

        db.commit()
        db.refresh(order)

        return {
            "message": "Order created successfully",
            "order_id": order.id,
            "total": float(order.total),
            "status": order.status
        }

    except:
        db.rollback()
        raise



@router.get("/my-orders")
def my_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.id.desc())
        .all()
    )

    return orders

VALID_ORDER_STATUSES = {
    "pending_payment",
    "paid",
    "payment_failed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "expired"
}

@router.get("/pending")
def get_pending_order(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    order = (
        db.query(Order)
        .filter(
            Order.user_id == current_user.id,
            Order.status == "pending_payment"
        ).first()
    )

    if not order:
        return {
            "exists": False
        }

    return {
        "exists": True,
        "order_id": order.id,
        "total": float(order.total),
        "status": order.status
    }


