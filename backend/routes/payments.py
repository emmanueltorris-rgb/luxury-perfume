from sqlalchemy.orm import  Session
import json
import re
import logging
from fastapi import APIRouter, HTTPException, status, Request, BackgroundTasks,Depends
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any
from backend.auth_utils import get_current_user, admin_required
from backend.services.mpesa import mpesa_service
from backend.services.mock_mpesa import mock_mpesa_service
from backend.services.callback_handler import CallbackHandler
from backend.database import SessionLocal
from backend.config import get_settings
from backend.models.transaction import Transaction
from backend.models.order import Order
from backend.crud.transaction import (create_transaction, get_transaction, get_transactions, update_transaction)



logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/payments", tags=["payments"])

def get_payment_service():
    """Get the appropriate payment service based on settings"""
    settings = get_settings()
    if settings.MPESA_MOCK_MODE:
        logger.info("🎭 Using MOCK M-Pesa Service")
        return mock_mpesa_service
    else:
        logger.info("🔗 Using REAL M-Pesa Service")
        return mpesa_service

class STKPushRequest(BaseModel):
    phone_number: str = Field(..., description="M-Pesa registered phone in format 2547XXXXXXXX")
    order_id: int = Field(..., description="Order ID")
    @validator("phone_number")
    def validate_phone(cls, v):
        cleaned = re.sub(r'[\s-]', '', v)
        if not re.match(r'^2547\d{8}$', cleaned):
            raise ValueError("Invalid phone number. Must be in format 2547XXXXXXXX (12 digits)")
        return cleaned

class STKPushResponse(BaseModel):
    success: bool
    message: str
    transaction_id: Optional[str] = None
    checkout_request_id: Optional[str] = None
    merchant_request_id: Optional[str] = None
    response_code: Optional[str] = None
    customer_message: Optional[str] = None

class CallbackPayload(BaseModel):
    Body: Dict[str, Any]

class TransactionStatusResponse(BaseModel):
    order_id: int
    transaction_id: str
    status: str
    mpesa_receipt_number: Optional[str] = None
    amount: float
    phone_number: str
    created_at: str
    updated_at: str

@router.post("/stk-push", response_model=STKPushResponse, status_code=status.HTTP_200_OK)
async def initiate_stk_push(request: STKPushRequest, current_user=Depends(get_current_user)):
    try:
        db:Session = SessionLocal()
        payment_service = get_payment_service()
        order = db.query(Order).filter(
            Order.id == request.order_id
            ).first()

        if not order:
            raise HTTPException(
            status_code=404,
            detail="Order not found"
        )
        if order.customer_id != current_user.id:
            raise HTTPException(
                status_code=403,
                details="You cannot pay for another user's order"
            )
        if order.status == "paid":
            raise HTTPException(
            status_code=400,
            detail="Order has already been paid"
            )
        
        
        transaction = Transaction(
            order_id=request.order_id,
            phone_number=request.phone_number,
            amount=order.total,
            status="PENDING"
        )
        create_transaction(db, transaction)

        result = payment_service.initiate_stk_push(
            phone_number=request.phone_number,
            amount=float(order.total),
            account_reference=f"ORDER-{order.id}",
            transaction_desc=f"Payment for Order  {order.id}"
        )
        logger.info(f"STK Push Result: {result}")
        response_code = result.get("ResponseCode", "1")
        success = response_code == "0"

        if success:
            update_transaction(
                db,
                transaction,
                merchant_request_id=result.get("MerchantRequestID"),
                checkout_request_id=result.get("CheckoutRequestID")
            )

            return STKPushResponse(
                success=True,
                message=result.get("CustomerMessage", "STK Push sent successfully"),
                transaction_id=str(transaction.id),
                checkout_request_id=result.get("CheckoutRequestID"),
                merchant_request_id=result.get("MerchantRequestID"),
                response_code=response_code,
                customer_message=result.get("CustomerMessage")
            )
        else:
            update_transaction(
                db,
                transaction,
                status="FAILED",
                result_description=result.get("ResponseDescription", "Failed to send STK Push")
            )

            return STKPushResponse(
                success=False,
                message=result.get("ResponseDescription", "Failed to initiate payment"),
                transaction_id=str(transaction.id),
                response_code=response_code
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"STK Push endpoint error: {e}")
        if "order" in locals():
            order.status = "payment_failed"
            db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment initiation failed: {str(e)}"
        )
    finally:
        db.close()

@router.post("/callback", status_code=status.HTTP_200_OK)
async def mpesa_callback(request: Request, background_tasks: BackgroundTasks):
    try:
        payload = await request.json()
        logger.info(f"Received M-Pesa callback: {json.dumps(payload, indent=2)}")

        background_tasks.add_task(CallbackHandler.process_callback, payload)

        return {
            "ResultCode": 0,
            "ResultDesc": "Callback received successfully"
        }

    except Exception as e:
        logger.error(f"Callback processing error: {e}")
        return {
            "ResultCode": 0,
            "ResultDesc": "Callback received"
        }

@router.get("/status/{transaction_id}", response_model=TransactionStatusResponse)
async def get_transaction_status(transaction_id: int, current_user=Depends(get_current_user)):
    db:Session = SessionLocal()
    try:
        transaction = get_transaction(db, transaction_id)

        if not transaction:
            raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

        return TransactionStatusResponse(
            order_id=transaction.order_id,
            transaction_id=str(transaction.id),
            status=transaction.status,
            mpesa_receipt_number=transaction.mpesa_receipt_number,
            amount=float(transaction.amount),
            phone_number=transaction.phone_number,
            created_at=transaction.created_at.isoformat(),
            updated_at=transaction.updated_at.isoformat()
         )
    finally:
        db.close()
@router.get("/transactions", dependencies=[Depends(admin_required)] )
async def list_transactions():
    db:Session = SessionLocal()
    try:
        transactions = get_transactions(db)
        return {
            "count": len(transactions),
            "transactions": [
                {
                    "id": tx.id,
                    "status": tx.status,
                    "amount": float(tx.amount),
                    "phone": tx.phone_number,
                    "receipt": tx.mpesa_receipt_number,
                    "created": tx.created_at.isoformat()
                }
                for tx in transactions
                        ]
                    }
    finally:
        db.close()