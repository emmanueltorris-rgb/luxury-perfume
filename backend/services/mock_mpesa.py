import base64
import uuid
from datetime import datetime
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

class MockMpesaService:
    """Mock M-Pesa service for local development and testing"""
    
    def __init__(self):
        self.base_url = "https://sandbox.safaricom.co.ke (mock)"
        self.consumer_key = "mock_consumer_key"
        self.consumer_secret = "mock_consumer_secret"
        self.passkey = "mock_passkey"
        self.shortcode = "174379"
        self._access_token: Optional[str] = None
        self.transactions: Dict[str, Dict[str, Any]] = {}

    def _get_auth_string(self) -> str:
        credentials = f"{self.consumer_key}:{self.consumer_secret}"
        return base64.b64encode(credentials.encode()).decode()

    def get_access_token(self) -> str:
        """Mock OAuth token generation"""
        if not self._access_token:
            self._access_token = f"mock_access_token_{uuid.uuid4().hex[:16]}"
            logger.info(f"🔐 Mock OAuth token generated: {self._access_token}")
        return self._access_token

    def _generate_password(self, timestamp: str) -> str:
        data_to_encode = f"{self.shortcode}{self.passkey}{timestamp}"
        return base64.b64encode(data_to_encode.encode()).decode()

    def _generate_timestamp(self) -> str:
        return datetime.now().strftime("%Y%m%d%H%M%S")

    def initiate_stk_push(
        self,
        phone_number: str,
        amount: float,
        account_reference: str = "LuxuryPerfume",
        transaction_desc: str = "Luxury Perfume Purchase"
    ) -> Dict[str, Any]:
        """
        Mock STK Push initiation
        Returns a simulated M-Pesa response
        """
        if not self._access_token:
            self.get_access_token()

        timestamp = self._generate_timestamp()
        password = self._generate_password(timestamp)
        
        # Generate mock request/response IDs
        merchant_request_id = f"MR_{uuid.uuid4().hex[:12].upper()}"
        checkout_request_id = f"WS_{uuid.uuid4().hex[:16].upper()}"
        
        # Store transaction details
        transaction_key = f"{phone_number}_{timestamp}"
        self.transactions[transaction_key] = {
            "merchant_request_id": merchant_request_id,
            "checkout_request_id": checkout_request_id,
            "phone_number": phone_number,
            "amount": amount,
            "account_reference": account_reference,
            "transaction_desc": transaction_desc,
            "timestamp": timestamp,
            "status": "pending"
        }
        
        # Log the mock STK push
        logger.info(f"📱 Mock STK Push initiated:")
        logger.info(f"   Phone: {phone_number}")
        logger.info(f"   Amount: KES {amount}")
        logger.info(f"   Merchant Request ID: {merchant_request_id}")
        logger.info(f"   Checkout Request ID: {checkout_request_id}")
        
        # Simulate M-Pesa successful response
        response = {
            "ResponseCode": "0",
            "ResponseDescription": "Success. Request accepted for processing",
            "MerchantRequestID": merchant_request_id,
            "CheckoutRequestID": checkout_request_id,
            "CustomerMessage": f"Please enter your M-Pesa PIN to complete payment of KES {amount}"
        }
        
        return response

    def query_stk_push_status(
        self,
        merchant_request_id: str,
        checkout_request_id: str
    ) -> Dict[str, Any]:
        """
        Mock STK Push status query
        Simulates checking if user completed the payment prompt
        """
        if not self._access_token:
            self.get_access_token()

        # In mock mode, randomly return success or pending
        import random
        success = random.choice([True, False])
        
        if success:
            response = {
                "ResponseCode": "0",
                "ResponseDescription": "The service request has been processed successfully.",
                "MerchantRequestID": merchant_request_id,
                "CheckoutRequestID": checkout_request_id,
                "ResultCode": "0",
                "ResultDesc": "The service request has been processed successfully.",
                "Amount": 1000,
                "MpesaReceiptNumber": f"MKZ{uuid.uuid4().hex[:12].upper()}",
                "TransactionDate": datetime.now().strftime("%Y%m%d%H%M%S"),
                "PhoneNumber": 254708319101
            }
            logger.info(f"✅ Mock STK Push completed successfully")
        else:
            response = {
                "ResponseCode": "0",
                "ResponseDescription": "The service request has been processed successfully.",
                "MerchantRequestID": merchant_request_id,
                "CheckoutRequestID": checkout_request_id,
                "ResultCode": "1032",
                "ResultDesc": "Request cancelled by user"
            }
            logger.info(f"❌ Mock STK Push cancelled by user")
        
        return response

    def validate_callback(self, callback_data: Dict[str, Any]) -> bool:
        """
        Mock callback validation
        In real implementation, this would verify the callback signature
        """
        # For mock, just check if required fields exist
        required_fields = ["Body"]
        return all(field in callback_data for field in required_fields)

    def process_callback(self, callback_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Mock callback processing
        Simulates parsing and storing M-Pesa callback response
        """
        try:
            body = callback_data.get("Body", {})
            stk_callback = body.get("stkCallback", {})
            
            merchant_request_id = stk_callback.get("MerchantRequestID")
            checkout_request_id = stk_callback.get("CheckoutRequestID")
            result_code = stk_callback.get("ResultCode")
            result_desc = stk_callback.get("ResultDesc", "")
            
            logger.info(f"📞 Mock Callback received:")
            logger.info(f"   Merchant Request ID: {merchant_request_id}")
            logger.info(f"   Checkout Request ID: {checkout_request_id}")
            logger.info(f"   Result Code: {result_code}")
            logger.info(f"   Result Desc: {result_desc}")
            
            # Parse callback metadata if available
            callback_metadata = stk_callback.get("CallbackMetadata", {})
            item_list = callback_metadata.get("Item", [])
            
            result = {
                "success": result_code == "0",
                "merchant_request_id": merchant_request_id,
                "checkout_request_id": checkout_request_id,
                "result_code": result_code,
                "result_desc": result_desc,
                "mpesa_receipt": None,
                "amount": None,
                "phone_number": None
            }
            
            # Extract details from item list
            for item in item_list:
                name = item.get("Name", "")
                value = item.get("Value", "")
                
                if name == "MpesaReceiptNumber":
                    result["mpesa_receipt"] = value
                elif name == "Amount":
                    result["amount"] = float(value)
                elif name == "PhoneNumber":
                    result["phone_number"] = value
            
            return result
            
        except Exception as e:
            logger.error(f"❌ Error processing mock callback: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }


# Singleton instance
mock_mpesa_service = MockMpesaService()
