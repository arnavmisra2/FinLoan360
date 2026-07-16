from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, CreditScoreAssessment
from ..schemas import CreditScoreAnalyzeRequest, CreditScoreAnalyzeResponse
from ..services.ml_service import predict_credit_score

router = APIRouter(prefix="/api/credit-score", tags=["credit-score"])


@router.post("/analyze", response_model=CreditScoreAnalyzeResponse, status_code=201)
def analyze_credit_score(
    payload: CreditScoreAnalyzeRequest, db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    inputs = payload.model_dump()
    inputs.pop("user_id")

    result = predict_credit_score(inputs)

    record = CreditScoreAssessment(
        user_id=payload.user_id,
        inputs_json=inputs,
        predicted_score_class=result["predicted_score_class"],
        suggestions_json=result["suggestions"],
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return CreditScoreAnalyzeResponse(
        id=record.id,
        predicted_score_class=record.predicted_score_class,
        suggestions=record.suggestions_json,
        created_at=record.created_at,
    )


@router.get("/history/{user_id}")
def credit_score_history(user_id: int, db: Session = Depends(get_db)):
    records = (
        db.query(CreditScoreAssessment)
        .filter(CreditScoreAssessment.user_id == user_id)
        .order_by(CreditScoreAssessment.created_at.desc())
        .all()
    )
    return [
        {
            "id": r.id,
            "predicted_score_class": r.predicted_score_class,
            "suggestions": r.suggestions_json,
            "created_at": r.created_at,
        }
        for r in records
    ]
