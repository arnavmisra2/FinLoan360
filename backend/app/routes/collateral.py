from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, CollateralAssessment, PropertyRate
from ..schemas import (
    CollateralAssessRequest, CollateralAssessResponse, PropertyRateOut,
)
from ..services.collateral_service import calculate_collateral

router = APIRouter(prefix="/api/collateral", tags=["collateral"])


@router.post("/assess", response_model=CollateralAssessResponse, status_code=201)
def assess_collateral(payload: CollateralAssessRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    result = calculate_collateral(
        db,
        state=payload.state,
        district=payload.district,
        area_sqft=payload.area_sqft,
        property_type=payload.property_type,
        requested_loan=payload.requested_loan,
    )

    record = CollateralAssessment(
        user_id=payload.user_id,
        state=payload.state,
        district=payload.district,
        area_sqft=payload.area_sqft,
        rate_per_sqft=result["rate_per_sqft"],
        collateral_value=result["collateral_value"],
        requested_loan=payload.requested_loan,
        max_eligible_loan=result["max_eligible_loan"],
        ltv_ratio=result["ltv_ratio"],
        status=result["status"],
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.get("/property-rates", response_model=list[PropertyRateOut])
def get_property_rates(
    state: str = None, district: str = None, db: Session = Depends(get_db)
):
    query = db.query(PropertyRate)
    if state:
        query = query.filter(PropertyRate.state.ilike(state))
    if district:
        query = query.filter(PropertyRate.district.ilike(district))
    return query.all()
