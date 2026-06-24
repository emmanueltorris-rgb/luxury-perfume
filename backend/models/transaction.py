from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum

class TransactionStatus(str, Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"
    TIMEOUT = "TIMEOUT"

class Transaction(BaseModel):
    id: str = Field(..., description="Internal UUID for the transaction")
    merchant_request_id: Optional[str] = None
    checkout_request_id: Optional[str] = None
    phone_number: str
    amount: float
    product_id: Optional[str] = None
    status: TransactionStatus = TransactionStatus.PENDING
    mpesa_receipt_number: Optional[str] = None
    transaction_date: Optional[str] = None
    result_code: Optional[int] = None
    result_desc: Optional[str] = None
    callback_metadata: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

_transaction_store: Dict[str, Transaction] = {}

class TransactionStore:
    @staticmethod
    def create(transaction: Transaction) -> Transaction:
        _transaction_store[transaction.id] = transaction
        return transaction

    @staticmethod
    def get_by_id(transaction_id: str) -> Optional[Transaction]:
        return _transaction_store.get(transaction_id)

    @staticmethod
    def get_by_checkout_id(checkout_request_id: str) -> Optional[Transaction]:
        for tx in _transaction_store.values():
            if tx.checkout_request_id == checkout_request_id:
                return tx
        return None

    @staticmethod
    def update(transaction_id: str, **kwargs) -> Optional[Transaction]:
        tx = _transaction_store.get(transaction_id)
        if not tx:
            return None
        for key, value in kwargs.items():
            if hasattr(tx, key):
                setattr(tx, key, value)
        tx.updated_at = datetime.utcnow()
        return tx

    @staticmethod
    def list_all() -> list:
        return list(_transaction_store.values())

transaction_store = TransactionStore()
