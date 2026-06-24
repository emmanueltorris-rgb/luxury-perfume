# L'Essence Parfumerie — Luxury E-Commerce with M-Pesa

A full-stack luxury perfume e-commerce platform featuring:

- **Frontend**: React 18 + Vite + Tailwind CSS with Glassmorphism/Liquid Glass design
- **Backend**: FastAPI with M-Pesa Daraja API integration
- **Payments**: Safaricom M-Pesa STK Push (Express) with OAuth2 authentication
- **Design**: Deep emerald, amber, and gold luxury aesthetic with serif typography

## Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment variables in .env
cp .env.example .env
# Edit .env with your Safaricom Daraja credentials

python app.py
# API runs at http://localhost:8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

## Features
- Luxury glassmorphic UI with animated ambient backgrounds
- M-Pesa STK Push payment flow with real-time status polling
- Product catalog with category filtering and cart management
- Responsive design for all screen sizes
- Async callback handling with transaction state management

## Architecture
- `/api/v1/payments/stk-push` — Initiate payment
- `/api/v1/payments/callback` — Safaricom webhook
- `/api/v1/payments/status/{id}` — Poll transaction status

## M-Pesa Configuration

1. Register at [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Create an app and obtain:
   - Consumer Key
   - Consumer Secret
   - Lipa Na M-Pesa Online Passkey
3. Set your callback URL (must be HTTPS and publicly accessible)
   - For local testing, use [ngrok](https://ngrok.com): `ngrok http 8000`
   - Update CALLBACK_URL in backend/.env

## Environment Variables

### Backend (.env)
```
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_passkey
MPESA_SHORTCODE=174379
MPESA_ENV=sandbox
DEBUG=true
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api/v1
```

## License
Proprietary — L'Essence Parfumerie
# luxury-perfume
