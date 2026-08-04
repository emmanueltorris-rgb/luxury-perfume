from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.database import get_db
from backend.auth_utils import get_current_admin
from backend.models.user import User
from backend.models.product import Product
from backend.models.order import Order
from backend.models.transaction import Transaction
from backend.models.user import User
router = APIRouter(
    prefix="/api/v1/admin/dashboard",
    tags=["Admin Dashboard"]
)

@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin),
):
    total_revenue = (
        db.query(func.sum(Transaction.amount))
        .filter(Order.status.in_(["paid","processing", "shipped","delivered"]))
        .scalar() or 0
    )

    total_products = (
    db.query(Product)
    .filter(Product.is_active == True)
    .count())

    total_orders = db.query(Order).count()

    low_stock_products = (
    db.query(Product)
    .filter(
        Product.is_active == True,
        Product.stock <= Product.low_stock_threshold
    )
    .count()
    )

    total_customers = (
        db.query(User).filter(User.role == "customer")
        .count()
    )

    return {
    "total_products": total_products,
    "total_orders": total_orders,
    "total_revenue":float(total_revenue),
    "low_stock_products": low_stock_products,
    "total_customers":total_customers
}