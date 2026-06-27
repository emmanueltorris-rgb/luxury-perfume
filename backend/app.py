from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from backend.config import get_settings
from backend.routes import payments, auth, products, orders
from backend.database import Base, engine, SessionLocal
from backend.models import product, order, customer, admin, user
from backend.models.user import User
from fastapi.staticfiles import StaticFiles
from pathlib import Path



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

@app.on_event("startup")
async def startup():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        admin_email = "torrisemanuel@gmail.com"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            admin_user = User(
                name="Torris Emanuel",
                email=admin_email,
                hashed_password=auth.hash_password("admin123"),
                role="admin",
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
    finally:
        db.close()

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(payments.router)

# Serve uploaded images
static_path = Path(__file__).resolve().parents[1] / 'static'
static_path.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

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