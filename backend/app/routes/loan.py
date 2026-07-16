from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, LoanPrediction
from ..schemas import (
    UserCreate, UserOut, LoanPredictRequest, LoanPredictResponse, LoanHistoryItem,
)
from ..services.ml_service import predict_loan_risk

router = APIRouter(prefix="/api", tags=["users", "loan"])


@router.post("/users", response_model=UserOut, status_code=201)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        return existing
    user = User(name=payload.name, email=payload.email)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/loan/predict", response_model=LoanPredictResponse, status_code=201)
def loan_predict(payload: LoanPredictRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    inputs = payload.model_dump()
    inputs.pop("user_id")

    result = predict_loan_risk(inputs)

    record = LoanPrediction(
        user_id=payload.user_id,
        inputs_json=inputs,
        approval_probability=result["approval_probability"],
        default_probability=result["default_probability"],
        risk_label=result["risk_label"],
        risk_factors_json=result["risk_factors"],
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return LoanPredictResponse(
        id=record.id,
        approval_probability=record.approval_probability,
        default_probability=record.default_probability,
        risk_label=record.risk_label,
        risk_factors=record.risk_factors_json,
        created_at=record.created_at,
    )


@router.get("/loan/history/{user_id}", response_model=list[LoanHistoryItem])
def loan_history(user_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(LoanPrediction)
        .filter(LoanPrediction.user_id == user_id)
        .order_by(LoanPrediction.created_at.desc())
        .all()
    )
    return records
