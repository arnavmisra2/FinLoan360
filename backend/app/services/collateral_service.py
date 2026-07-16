from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from ..models import PropertyRate


LTV_DEFAULT = 0.70


def calculate_collateral(
    db: Session,
    state: str,
    district: str,
    area_sqft: float,
    property_type: str,
    requested_loan: float,
) -> Dict[str, Any]:
    rate_record = (
        db.query(PropertyRate)
        .filter(
            PropertyRate.state.ilike(state),
            PropertyRate.district.ilike(district),
            PropertyRate.property_type == property_type,
        )
        .order_by(PropertyRate.effective_date.desc())
        .first()
    )

    if rate_record is None:
        fallback_rates = {
            "residential": 3500,
            "commercial": 5500,
            "industrial": 4000,
            "agricultural": 1500,
        }
        rate_per_sqft = fallback_rates.get(property_type, 3000)
        source = "default_estimate"
    else:
        rate_per_sqft = rate_record.rate_per_sqft
        source = rate_record.source or "database"

    collateral_value = area_sqft * rate_per_sqft
    max_eligible_loan = collateral_value * LTV_DEFAULT
    ltv_ratio = (requested_loan / collateral_value) * 100 if collateral_value > 0 else 0

    if ltv_ratio <= 70:
        status = "approved"
    elif ltv_ratio <= 85:
        status = "conditional"
    else:
        status = "rejected"

    return {
        "rate_per_sqft": rate_per_sqft,
        "collateral_value": round(collateral_value, 2),
        "max_eligible_loan": round(max_eligible_loan, 2),
        "ltv_ratio": round(ltv_ratio, 2),
        "status": status,
        "source": source,
    }
