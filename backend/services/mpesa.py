import base64
import requests
from datetime import datetime
from typing import Optional, Dict, Any
from backend.config import get_settings

settings = get_settings()

class MpesaService:
    def __init__(self):
        self.base_url = settings.BASE_URL
        self.consumer_key = settings.MPESA_CONSUMER_KEY
        self.consumer_secret = settings.MPESA_CONSUMER_SECRET
        self.passkey = settings.MPESA_PASSKEY
        self.shortcode = settings.MPESA_SHORTCODE
        self._access_token: Optional[str] = None

    def _get_auth_string(self) -> str:
        credentials = f"{self.consumer_key}:{self.consumer_secret}"
        return base64.b64encode(credentials.encode()).decode()

    def get_access_token(self) -> str:
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        headers = {
            "Authorization": f"Basic {self._get_auth_string()}",
            "Content-Type": "application/json"
        }
        try:
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            data = response.json()
            self._access_token = data.get("access_token")
            return self._access_token
        except requests.RequestException as e:
            raise Exception(f"Failed to generate M-Pesa access token: {str(e)}")

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
        if not self._access_token:
            self.get_access_token()

        timestamp = self._generate_timestamp()
        password = self._generate_password(timestamp)
        callback_url = "https://tableware-princess-baffling.ngrok-free.dev/api/v1/payments/callback"

        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(amount),
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": callback_url,
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }

        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        headers = {
            "Authorization": f"Bearer {self._access_token}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise Exception(f"STK Push initiation failed: {str(e)}")

    def query_stk_status(self, checkout_request_id: str) -> Dict[str, Any]:
        if not self._access_token:
            self.get_access_token()

        timestamp = self._generate_timestamp()
        password = self._generate_password(timestamp)

        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "CheckoutRequestID": checkout_request_id
        }

        url = f"{self.base_url}/mpesa/stkpushquery/v1/query"
        headers = {
            "Authorization": f"Bearer {self._access_token}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise Exception(f"STK Push query failed: {str(e)}")

mpesa_service = MpesaService()
