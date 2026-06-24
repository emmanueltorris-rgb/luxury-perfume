import json
import logging
from typing import Dict, Any, Optional
from datetime import datetime
from backend.models.transaction import Transaction, TransactionStatus, transaction_store

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

            checkout_request_id = parsed["checkout_request_id"]
            result_code = parsed["result_code"]
            result_desc = parsed["result_desc"]

            transaction = transaction_store.get_by_checkout_id(checkout_request_id)

            if not transaction:
                logger.warning(f"Callback received for unknown transaction: {checkout_request_id}")
                return {
                    "success": False,
                    "message": "Transaction not found",
                    "checkout_request_id": checkout_request_id
                }

            if result_code == 0:
                status = TransactionStatus.SUCCESS
                metadata = parsed["callback_metadata"]

                mpesa_receipt = cls.extract_metadata_item(metadata, "MpesaReceiptNumber")
                transaction_date = cls.extract_metadata_item(metadata, "TransactionDate")
                amount = cls.extract_metadata_item(metadata, "Amount")
                phone = cls.extract_metadata_item(metadata, "PhoneNumber")

                transaction_store.update(
                    transaction.id,
                    status=status,
                    mpesa_receipt_number=mpesa_receipt,
                    transaction_date=transaction_date,
                    result_code=result_code,
                    result_desc=result_desc,
                    callback_metadata={
                        "amount": amount,
                        "phone_number": phone,
                        "raw_metadata": metadata
                    }
                )

                logger.info(f"Payment SUCCESS: Receipt={mpesa_receipt}, Amount={amount}, TxID={transaction.id}")

                return {
                    "success": True,
                    "message": "Payment completed successfully",
                    "transaction_id": transaction.id,
                    "mpesa_receipt": mpesa_receipt,
                    "status": status.value
                }

            else:
                status_map = {
                    1032: TransactionStatus.CANCELLED,
                    1037: TransactionStatus.TIMEOUT,
                }
                status = status_map.get(result_code, TransactionStatus.FAILED)

                transaction_store.update(
                    transaction.id,
                    status=status,
                    result_code=result_code,
                    result_desc=result_desc,
                    callback_metadata={"raw_result": parsed}
                )

                logger.warning(f"Payment FAILED: Code={result_code}, Desc={result_desc}, TxID={transaction.id}")

                return {
                    "success": False,
                    "message": f"Payment failed: {result_desc}",
                    "transaction_id": transaction.id,
                    "status": status.value,
                    "result_code": result_code
                }

        except Exception as e:
            logger.error(f"Callback processing error: {e}")
            raise

callback_handler = CallbackHandler()
