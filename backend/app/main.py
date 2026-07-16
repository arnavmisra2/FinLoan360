import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .database import engine, Base
from .routes import loan, collateral, expenses, savings, credit_score, health

load_dotenv()

app = FastAPI(
    title="FinLoan360",
    description="Financial Risk Analysis Platform",
    version="1.0.0",
)

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000")
origins = [o.strip().rstrip("/") for o in CORS_ORIGINS.split(",") if o.strip()]
origins.append("https://fin-loan360.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(loan.router)
app.include_router(collateral.router)
app.include_router(expenses.router)
app.include_router(savings.router)
app.include_router(credit_score.router)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
