from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import User, MonthlyIncome, Expense
from ..schemas import (
    IncomeCreate, ExpenseCreate, ExpenseOut, SummaryResponse,
)
from ..services.finance_service import get_monthly_summary

router = APIRouter(prefix="/api", tags=["expenses", "income"])


@router.post("/income", status_code=201)
def add_income(payload: IncomeCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    existing = (
        db.query(MonthlyIncome)
        .filter(
            MonthlyIncome.user_id == payload.user_id,
            MonthlyIncome.month == payload.month,
        )
        .first()
    )
    if existing:
        existing.income = payload.income
        db.commit()
        return {"id": existing.id, "month": payload.month, "income": payload.income}

    record = MonthlyIncome(
        user_id=payload.user_id, month=payload.month, income=payload.income
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return {"id": record.id, "month": record.month, "income": record.income}


@router.post("/expenses", response_model=ExpenseOut, status_code=201)
def add_expense(payload: ExpenseCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    record = Expense(
        user_id=payload.user_id,
        month=payload.month,
        category=payload.category,
        amount=payload.amount,
        note=payload.note,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/expenses/{user_id}/{month}", response_model=list[ExpenseOut])
def get_expenses(user_id: int, month: str, db: Session = Depends(get_db)):
    records = (
        db.query(Expense)
        .filter(Expense.user_id == user_id, Expense.month == month)
        .order_by(Expense.created_at.desc())
        .all()
    )
    return records


@router.delete("/expenses/{expense_id}", status_code=204)
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    record = db.query(Expense).filter(Expense.id == expense_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Expense not found")
    db.delete(record)
    db.commit()


@router.get("/summary/{user_id}/{month}", response_model=SummaryResponse)
def summary(user_id: int, month: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return get_monthly_summary(db, user_id, month)
