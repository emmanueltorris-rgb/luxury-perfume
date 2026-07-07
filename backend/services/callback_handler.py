import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime
from sqlalchemy.orm import Session

from backend.database import SessionLocal
from backend.models.transaction import Transaction
from backend.models.order import Order
from backend.models.order_item import OrderItem
from backend.models.product import Product
from backend.crud.cart import delete_cart
from backend.crud.transaction import (
    get_by_checkout_request_id,
    update_transaction
)

logger = logging.getLogger(__name__)

class CallbackHandler:
    @staticmethod
    def parse_callback(payload: Dict[str, Any]) -> Dict[str, Any]:
        try:
            body = payload.get("Body", {})
            stk_callback = body.get("stkCallback", {})

            return {
                "merchant_request_id": stk_callback.get("MerchantRequestID"),
                "checkout_request_id": stk_callback.get("CheckoutRequestID"),
                "result_code": stk_callback.get("ResultCode"),
                "result_desc": stk_callback.get("ResultDesc"),
                "callback_metadata": stk_callback.get("CallbackMetadata", {})
            }
        except Exception as e:
            logger.error(f"Failed to parse callback payload: {e}")
            raise ValueError(f"Invalid callback payload structure: {str(e)}")

    @staticmethod
    def extract_metadata_item(metadata: Dict, name: str) -> Any:
        items = metadata.get("Item", [])
        for item in items:
            if item.get("Name") == name:
                return item.get("Value")
        return None

    @classmethod
    def process_callback(cls, payload: Dict[str, Any]) -> Dict[str, Any]:
        try:
            parsed = cls.parse_callback(payload)
            logger.ifo(f"Parsed callback:{parsed}")
            db:Session = SessionLocal()

            checkout_request_id = parsed["checkout_request_id"]
            result_code = parsed["result_code"]
            result_desc = parsed["result_desc"]

            transaction = get_by_checkout_request_id(
                db,
                checkout_request_id)

            if not transaction:
                logger.warning(f"Callback received for unknown transaction: {checkout_request_id}")
                return {
                    "success": False,
                    "message": "Transaction not found",
                    "checkout_request_id": checkout_request_id
                }

            if result_code == 0:
                status = "SUCCESS"
                metadata = parsed["callback_metadata"]

                mpesa_receipt = cls.extract_metadata_item(metadata, "MpesaReceiptNumber")
                transaction_date = cls.extract_metadata_item(metadata, "TransactionDate")
                amount = cls.extract_metadata_item(metadata, "Amount")
                phone = cls.extract_metadata_item(metadata, "PhoneNumber")

                update_transaction(
                    db,
                    transaction,
                    status=status,
                    mpesa_receipt_number=mpesa_receipt,
                    transaction_date=transaction_date,
                    result_code=str(result_code),
                    result_description=result_desc
                )
                order = db.query(Order).filter(
                    Order.id == transaction.order_id
                                ).first()

                if not order:
                    logger.warning(f"Order not found for transaction {transaction.id}")
                    return{
                        "success":False,
                        "message":"Order not found"
                    }
                order.status ="paid"
                items = db.query(OrderItem).filter(
                        OrderItem.order_id == order.id
                        ).all()

                for item in items:
                    product = db.query(Product).filter(
                        Product.id == item.product_id
                      ).first()

                    if product:
                        product.stock -= item.quantity
                delete_cart(db, order.customer_id)
                db.commit()

                logger.info(f"Payment SUCCESS: Receipt={mpesa_receipt}, Amount={amount}, TxID={transaction.id}")

                return {
                    "success": True,
                    "message": "Payment completed successfully",
                    "transaction_id": transaction.id,
                    "mpesa_receipt": mpesa_receipt,
                    "status": status
                }

            else:
                status_map = {
                        1032: "CANCELLED",
                        1037: "TIMEOUT",
                        }

                status = status_map.get(result_code, "FAILED")

            update_transaction(
                db,
                transaction,
                status=status,
                result_code=str(result_code),
                result_description=result_desc,
                     )

            order = db.query(Order).filter(
                Order.id == transaction.order_id
                    ).first()

            if order:
                order.status = "payment_failed"

            db.commit()

            logger.warning(
                f"Payment FAILED: Code={result_code}, Desc={result_desc}, TxID={transaction.id}"
                )

            return {
                "success": False,
                "message": f"Payment failed: {result_desc}",
                "transaction_id": transaction.id,
                "status": status,
                "result_code": result_code,
                    }
        except Exception as e:
            db.rollback()
            logger.error(f"Callback processing error:{e}")
            raise
        finally:
            db.close()
