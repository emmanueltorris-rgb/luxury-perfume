import uuid
import json
import re
import logging
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Request, BackgroundTasks
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any

from backend.services.mpesa import mpesa_service
from backend.services.mock_mpesa import mock_mpesa_service
from backend.services.callback_handler import callback_handler
from backend.models.transaction import (
    Transaction, TransactionStatus, transaction_store
)
from backend.config import get_settings

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
    amount: float = Field(..., gt=0, description="Transaction amount in KES")
    product_id: Optional[str] = Field(None, description="Product identifier")

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
    transaction_id: str
    status: str
    mpesa_receipt_number: Optional[str] = None
    amount: float
    phone_number: str
    created_at: str
    updated_at: str

@router.post("/stk-push", response_model=STKPushResponse, status_code=status.HTTP_200_OK)
async def initiate_stk_push(request: STKPushRequest):
    try:
        payment_service = get_payment_service()
        
        transaction = Transaction(
            id=str(uuid.uuid4()),
            phone_number=request.phone_number,
            amount=request.amount,
            product_id=request.product_id,
            status=TransactionStatus.PENDING
        )
        transaction_store.create(transaction)

        result = payment_service.initiate_stk_push(
            phone_number=request.phone_number,
            amount=request.amount,
            account_reference=f"LP-{request.product_id}" if request.product_id else "LuxuryPerfume",
            transaction_desc=f"Luxury Perfume Purchase - {request.product_id or 'General'}"
        )

        response_code = result.get("ResponseCode", "1")
        success = response_code == "0"

        if success:
            transaction_store.update(
                transaction.id,
                merchant_request_id=result.get("MerchantRequestID"),
                checkout_request_id=result.get("CheckoutRequestID")
            )

            return STKPushResponse(
                success=True,
                message=result.get("CustomerMessage", "STK Push sent successfully"),
                transaction_id=transaction.id,
                checkout_request_id=result.get("CheckoutRequestID"),
                merchant_request_id=result.get("MerchantRequestID"),
                response_code=response_code,
                customer_message=result.get("CustomerMessage")
            )
        else:
            transaction_store.update(
                transaction.id,
                status=TransactionStatus.FAILED,
                result_desc=result.get("ResponseDescription", "Failed to send STK Push")
            )

            return STKPushResponse(
                success=False,
                message=result.get("ResponseDescription", "Failed to initiate payment"),
                transaction_id=transaction.id,
                response_code=response_code
            )

    except Exception as e:
        logger.error(f"STK Push endpoint error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment initiation failed: {str(e)}"
        )

@router.post("/callback", status_code=status.HTTP_200_OK)
async def mpesa_callback(request: Request, background_tasks: BackgroundTasks):
    try:
        payload = await request.json()
        logger.info(f"Received M-Pesa callback: {json.dumps(payload, indent=2)}")

        background_tasks.add_task(callback_handler.process_callback, payload)

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
async def get_transaction_status(transaction_id: str):
    transaction = transaction_store.get_by_id(transaction_id)

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )

    return TransactionStatusResponse(
        transaction_id=transaction.id,
        status=transaction.status.value,
        mpesa_receipt_number=transaction.mpesa_receipt_number,
        amount=transaction.amount,
        phone_number=transaction.phone_number,
        created_at=transaction.created_at.isoformat(),
        updated_at=transaction.updated_at.isoformat()
    )

@router.get("/transactions")
async def list_transactions():
    transactions = transaction_store.list_all()
    return {
        "count": len(transactions),
        "transactions": [
            {
                "id": tx.id,
                "status": tx.status.value,
                "amount": tx.amount,
                "phone": tx.phone_number,
                "receipt": tx.mpesa_receipt_number,
                "created": tx.created_at.isoformat()
            }
            for tx in transactions
        ]
    }
