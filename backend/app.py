from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from backend.config import get_settings
from backend.routes import payments

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="Luxury Perfume E-Commerce Platform with M-Pesa Integration",
    version="1.0.0",
    debug=settings.DEBUG
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payments.router)

@app.get("/")
async def root():
    return {
        "message": "Luxury Perfume E-Commerce API",
        "status": "operational",
        "mpesa_environment": settings.MPESA_ENV,
        "endpoints": {
            "stk_push": "/api/v1/payments/stk-push",
            "callback": "/api/v1/payments/callback",
            "status": "/api/v1/payments/status/{transaction_id}"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "backend-api",
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)
