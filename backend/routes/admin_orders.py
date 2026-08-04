from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.auth_utils import get_current_admin
from backend.models.order import Order

router = APIRouter(
    prefix="/api/v1/admin/orders",
    tags=["admin-orders"]
)

VALID_ORDER_STATUSES = {
    "pending",
    "paid",
    "payment_failed",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
}

@router.get("/")
def all_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_admin)
):
    

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
    current_user=Depends(get_current_admin)
):
    
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

