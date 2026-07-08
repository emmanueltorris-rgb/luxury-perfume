from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.auth_utils import get_current_user
from backend.database import get_db
from backend.models.order import Order
from backend.models.order_item import OrderItem
from backend.models.product import Product


router = APIRouter( prefix="/api/v1/orders", tags=["orders"])

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


@router.post("/")
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    existing_order = (
        db.query(Order)
        .filter(
            Order.customer_id == current_user.id,
            Order.status == "pending"
        )
        .first()
    )

    if existing_order:
        order = existing_order
        db.query(OrderItem).filter(
            OrderItem.order_id == order.id
        ).delete()
        total = 0

    try:
        if existing_order:
            order = existing_order
            db.query(OrderItem).filter(
            OrderItem.order_id == order.id
            ).delete()
        else:
            order = Order(
                customer_id=current_user.id,
                total=0,
                status="pending"
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
        .filter(Order.customer_id == current_user.id)
        .order_by(Order.id.desc())
        .all()
    )

    return orders

VALID_ORDER_STATUSES = {
    "pending",
    "paid",
    "payment_failed",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
}

@router.get("/pending")
def get_pending_order(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    order = (
        db.query(Order)
        .filter(
            Order.customer_id == current_user.id,
            Order.status == "pending"
        )
        .first()
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


@router.get("/")
def all_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return (
        db.query(Order)
        .order_by(Order.id.desc())
        .all()
    )

@router.put("/{order_id}/status")
def update_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    status = status.lower()

    if status not in VALID_ORDER_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Allowed values: {', '.join(sorted(VALID_ORDER_STATUSES))}"
        )

    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = status

    db.commit()
    db.refresh(order)

    return {
        "message": "Order status updated successfully",
        "order_id": order.id,
        "status": order.status
    }

