#!/usr/bin/env python3
"""Test script to simulate M-Pesa callback locally."""

import requests
import json

def simulate_success_callback(checkout_request_id: str, base_url: str = "http://localhost:8000"):
    payload = {
        "Body": {
            "stkCallback": {
                "MerchantRequestID": "test-merchant-123",
                "CheckoutRequestID": checkout_request_id,
                "ResultCode": 0,
                "ResultDesc": "The service request is processed successfully.",
                "CallbackMetadata": {
                    "Item": [
                        {"Name": "Amount", "Value": 1500.00},
                        {"Name": "MpesaReceiptNumber", "Value": "LGR13H3J0D"},
                        {"Name": "TransactionDate", "Value": "20240101120000"},
                        {"Name": "PhoneNumber", "Value": "254712345678"}
                    ]
                }
            }
        }
    }

    response = requests.post(
        f"{base_url}/api/v1/payments/callback",
        json=payload,
        headers={"Content-Type": "application/json"}
    )

    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

def simulate_failure_callback(checkout_request_id: str, result_code: int = 1):
    payload = {
        "Body": {
            "stkCallback": {
                "MerchantRequestID": "test-merchant-123",
                "CheckoutRequestID": checkout_request_id,
                "ResultCode": result_code,
                "ResultDesc": "The service request has failed."
            }
        }
    }

    response = requests.post(
        "http://localhost:8000/api/v1/payments/callback",
        json=payload
    )

    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    pass
