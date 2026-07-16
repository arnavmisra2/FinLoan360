from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User
from ..schemas import SavingsRecommendRequest, SavingsRecommendResponse
from ..services.finance_service import generate_savings_recommendation

router = APIRouter(prefix="/api/savings", tags=["savings"])


@router.post("/recommend", response_model=SavingsRecommendResponse)
def recommend_savings(payload: SavingsRecommendRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = generate_savings_recommendation(
        db, user_id=payload.user_id, month=payload.month, risk_profile=payload.risk_profile
    )
    return result
