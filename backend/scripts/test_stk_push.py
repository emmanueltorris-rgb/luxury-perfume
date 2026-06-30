#!/usr/bin/env python3
"""Test script to initiate M-Pesa STK Push."""

import requests
import json
import time
import sys

BASE_URL = "http://localhost:8000"

def initiate_stk_push(phone_number: str, amount: float, product_id: str = None):
    """Initiate an STK Push request"""
    payload = {
        "phone_number": phone_number,
        "amount": amount,
        "product_id": product_id
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/payments/stk-push",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"❌ Error initiating STK Push: {e}")
        return None

def simulate_success_callback(checkout_request_id: str, amount: float = 1500):
    """Simulate M-Pesa success callback"""
    payload = {
        "Body": {
            "stkCallback": {
                "MerchantRequestID": "test-merchant-123",
                "CheckoutRequestID": checkout_request_id,
                "ResultCode": 0,
                "ResultDesc": "The service request is processed successfully.",
                "CallbackMetadata": {
                    "Item": [
                        {"Name": "Amount", "Value": amount},
                        {"Name": "MpesaReceiptNumber", "Value": "LGR13H3J0D"},
                        {"Name": "TransactionDate", "Value": "20240101120000"},
                        {"Name": "PhoneNumber", "Value": "254712345678"}
                    ]
                }
            }
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/v1/payments/callback",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        return response.json()
    except requests.RequestException as e:
        print(f"❌ Error sending callback: {e}")
        return None

def get_transaction_status(transaction_id: str):
    """Check transaction status"""
    try:
        response = requests.get(
            f"{BASE_URL}/api/v1/payments/status/{transaction_id}",
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"❌ Error getting transaction status: {e}")
        return None

def main():
    # Example: Initiate STK Push
    phone = "254712345678"  # Change to your test phone number
    amount = 1500  # KES
    product_id = "perfume-001"
    
    print("=" * 60)
    print("🚀 M-Pesa STK Push Test Script")
    print("=" * 60)
    
    # Step 1: Initiate STK Push
    print(f"\n📱 Step 1: Initiating STK Push for {phone}")
    print(f"   Amount: KES {amount}")
    print(f"   Product: {product_id}")
    
    result = initiate_stk_push(phone, amount, product_id)
    
    if not result:
        print("❌ Failed to initiate STK Push")
        sys.exit(1)
    
    print(f"\n✅ STK Push Response:")
    print(json.dumps(result, indent=2))
    
    if not result.get("success"):
        print("\n❌ STK Push failed - stopping test")
        sys.exit(1)
    
    transaction_id = result.get("transaction_id")
    checkout_request_id = result.get("checkout_request_id")
    
    print(f"\n✅ Transaction ID: {transaction_id}")
    print(f"✅ Checkout Request ID: {checkout_request_id}")
    
    # Step 2: Check initial status
    print(f"\n📊 Step 2: Checking initial transaction status...")
    status_result = get_transaction_status(transaction_id)
    if status_result:
        print(f"   Status: {status_result.get('status')}")
    
    # Step 3: Simulate successful payment (optional)
    if len(sys.argv) > 1 and sys.argv[1] == "--simulate":
        print(f"\n⏳ Waiting 2 seconds before simulating callback...")
        time.sleep(2)
        
        print(f"\n💬 Step 3: Simulating M-Pesa callback (success)...")
        callback_result = simulate_success_callback(checkout_request_id, amount)
        print(f"✅ Callback Response:")
        print(json.dumps(callback_result, indent=2))
        
        # Check status again
        print(f"\n📊 Step 4: Checking updated transaction status...")
        time.sleep(1)
        status_result = get_transaction_status(transaction_id)
        if status_result:
            print(f"   Status: {status_result.get('status')}")
            print(f"   Receipt: {status_result.get('mpesa_receipt_number')}")
    else:
        print("\n💡 Tip: Run with --simulate flag to simulate M-Pesa callback")
        print("   Example: python scripts/test_stk_push.py --simulate")
    
    print("\n" + "=" * 60)
    print("✅ Test completed!")
    print("=" * 60)

if __name__ == "__main__":
    main()
