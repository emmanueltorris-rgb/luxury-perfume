from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from backend.database import SessionLocal
from backend.auth_utils import get_current_user
from backend.services.mpesa import mpesa_service
from backend.models.order import Order
from backend.models.order_item import OrderItem
from backend.models.transaction import Transaction
from backend.crud.transaction import (
    create_transaction,
    update_transaction
)
from backend.crud.cart import (
    get_cart,
    clear_cart
)


router = APIRouter(
    prefix="/api/v1/checkout",
    tags=["Checkout"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class CheckoutRequest(BaseModel):
    phone_number: str

@router.post("/")
def checkout(
    request: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    cart = get_cart(db, current_user.id)

    if not cart or not cart.items:
        raise HTTPException(
            status_code=400,
            detail="Your cart is empty."
        )

    total = sum(
        item.product.price * item.quantity
        for item in cart.items
    )

    order = Order(
        customer_id=current_user.id,
        total=total,
        status="pending"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item in cart.items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price=item.product.price
        )

        db.add(order_item)

    db.commit()

    transaction = Transaction(
        order_id=order.id,
        phone_number=request.phone_number,
        amount=order.total,
        status="PENDING"
    )

    create_transaction(db, transaction)

    result = mpesa_service.initiate_stk_push(
        phone_number=request.phone_number,
        amount=float(order.total),
        account_reference=f"ORDER-{order.id}",
        transaction_desc=f"Payment for Order {order.id}"
    )
    update_transaction(
    db,
    transaction,
    merchant_request_id=result.get("MerchantRequestID"),
    checkout_request_id=result.get("CheckoutRequestID")
    )
    return {
    "message": "STK Push sent successfully",
    "order_id": order.id,
    "transaction_id": transaction.id,
    "checkout_request_id": result.get("CheckoutRequestID"),
    "merchant_request_id": result.get("MerchantRequestID"),
    "customer_message": result.get(
        "CustomerMessage",
        "Check your phone and enter your M-Pesa PIN."
    )}