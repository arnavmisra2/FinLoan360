from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class LoanPredictRequest(BaseModel):
    user_id: int
    age: int = Field(..., ge=18, le=100)
    income: float = Field(..., gt=0)
    employment_length: int = Field(..., ge=0, le=50)
    home_ownership: str = Field(..., pattern=r"^(RENT|OWN|MORTGAGE|OTHER)$")
    loan_amount: float = Field(..., gt=0)
    loan_intent: str = Field(
        ..., pattern=r"^(PERSONAL|EDUCATION|MEDICAL|VENTURE|HOMEIMPROVEMENT|DEBTCONSOLIDATION)$"
    )
    credit_history_length: int = Field(..., ge=0, le=50)
    previous_default: int = Field(..., ge=0, le=1)
    interest_rate: Optional[float] = Field(None, ge=0, le=30)


class LoanPredictResponse(BaseModel):
    id: int
    approval_probability: float
    default_probability: float
    risk_label: str
    risk_factors: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LoanHistoryItem(BaseModel):
    id: int
    inputs_json: Any
    approval_probability: float
    default_probability: float
    risk_label: str
    risk_factors_json: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True


class CollateralAssessRequest(BaseModel):
    user_id: int
    state: str = Field(..., min_length=1)
    district: str = Field(..., min_length=1)
    area_sqft: float = Field(..., gt=0)
    property_type: str = Field(..., pattern=r"^(residential|commercial|industrial|agricultural)$")
    requested_loan: float = Field(..., gt=0)


class CollateralAssessResponse(BaseModel):
    id: int
    state: str
    district: str
    area_sqft: float
    rate_per_sqft: float
    collateral_value: float
    requested_loan: float
    max_eligible_loan: float
    ltv_ratio: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class PropertyRateOut(BaseModel):
    id: int
    state: str
    district: str
    property_type: str
    rate_per_sqft: float
    source: Optional[str] = None
    effective_date: Optional[datetime] = None

    class Config:
        from_attributes = True


class IncomeCreate(BaseModel):
    user_id: int
    month: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    income: float = Field(..., gt=0)


class ExpenseCreate(BaseModel):
    user_id: int
    month: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    category: str = Field(
        ...,
        pattern=r"^(Rent|Food|Transport|EMI|Utilities|Healthcare|Education|Entertainment|Shopping|Investment|Other)$",
    )
    amount: float = Field(..., gt=0)
    note: Optional[str] = None


class ExpenseOut(BaseModel):
    id: int
    user_id: int
    month: str
    category: str
    amount: float
    note: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class SummaryResponse(BaseModel):
    month: str
    income: float
    total_expenses: float
    disposable_income: float
    savings_rate: float
    category_breakdown: dict


class SavingsRecommendRequest(BaseModel):
    user_id: int
    month: str = Field(..., pattern=r"^\d{4}-\d{2}$")
    risk_profile: str = Field(..., pattern=r"^(conservative|moderate|aggressive)$")


class SavingsRecommendResponse(BaseModel):
    id: int
    month: str
    income: float
    total_expenses: float
    savings_rate: float
    emergency_fund_target: float
    suggested_savings: float
    suggested_investment: dict
    risk_level: str
    disclaimer: str
    created_at: datetime

    class Config:
        from_attributes = True


class CreditScoreAnalyzeRequest(BaseModel):
    user_id: int
    delayed_payments: int = Field(..., ge=0)
    outstanding_debt: float = Field(..., ge=0)
    credit_utilization: float = Field(..., ge=0, le=1)
    emi: float = Field(..., ge=0)
    credit_history_age: int = Field(..., ge=0, le=600, description="Months")
    monthly_balance: float
    num_loans: int = Field(..., ge=0)
    num_credit_cards: int = Field(..., ge=0)
    annual_income: float = Field(..., gt=0)
    monthly_salary: float = Field(..., gt=0)
    bank_accounts: int = Field(..., ge=0)
    amount_invested_monthly: float = Field(..., ge=0)


class CreditScoreAnalyzeResponse(BaseModel):
    id: int
    predicted_score_class: str
    suggestions: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True


class HealthResponse(BaseModel):
    status: str
    database: str
    models: dict
