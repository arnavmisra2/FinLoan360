from typing import Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..models import MonthlyIncome, Expense, SavingsPlan


def get_monthly_summary(db: Session, user_id: int, month: str) -> Dict[str, Any]:
    income_record = (
        db.query(MonthlyIncome)
        .filter(MonthlyIncome.user_id == user_id, MonthlyIncome.month == month)
        .first()
    )
    income = income_record.income if income_record else 0.0

    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == user_id, Expense.month == month)
        .all()
    )

    total_expenses = sum(e.amount for e in expenses)
    category_breakdown = {}
    for e in expenses:
        category_breakdown[e.category] = category_breakdown.get(e.category, 0) + e.amount

    disposable = income - total_expenses
    savings_rate = (disposable / income * 100) if income > 0 else 0

    return {
        "month": month,
        "income": income,
        "total_expenses": round(total_expenses, 2),
        "disposable_income": round(disposable, 2),
        "savings_rate": round(savings_rate, 2),
        "category_breakdown": {k: round(v, 2) for k, v in category_breakdown.items()},
    }


def generate_savings_recommendation(
    db: Session, user_id: int, month: str, risk_profile: str
) -> Dict[str, Any]:
    summary = get_monthly_summary(db, user_id, month)
    income = summary["income"]
    total_expenses = summary["total_expenses"]
    disposable = summary["disposable_income"]

    emergency_months = {"conservative": 9, "moderate": 6, "aggressive": 3}
    months_needed = emergency_months.get(risk_profile, 6)
    emergency_fund_target = total_expenses * months_needed

    if income <= 0:
        return {
            "month": month,
            "income": income,
            "total_expenses": total_expenses,
            "savings_rate": 0,
            "emergency_fund_target": round(emergency_fund_target, 2),
            "suggested_savings": 0,
            "suggested_investment": {},
            "risk_level": risk_profile,
            "disclaimer": "Educational estimate, not financial advice.",
        }

    target_savings_rate = {"conservative": 0.30, "moderate": 0.20, "aggressive": 0.15}
    rate = target_savings_rate.get(risk_profile, 0.20)
    suggested_savings = income * rate

    investment_splits = {
        "conservative": {
            "fixed_deposits": 0.40,
            "bonds": 0.30,
            "mutual_funds": 0.20,
            "equity": 0.10,
        },
        "moderate": {
            "fixed_deposits": 0.20,
            "bonds": 0.20,
            "mutual_funds": 0.35,
            "equity": 0.25,
        },
        "aggressive": {
            "fixed_deposits": 0.10,
            "bonds": 0.10,
            "mutual_funds": 0.30,
            "equity": 0.50,
        },
    }

    split = investment_splits.get(risk_profile, investment_splits["moderate"])
    investment_allocation = {k: round(suggested_savings * v, 2) for k, v in split.items()}

    savings_plan = SavingsPlan(
        user_id=user_id,
        month=month,
        savings_rate=round(rate * 100, 2),
        emergency_fund_target=round(emergency_fund_target, 2),
        recommendation_json={
            "suggested_savings": round(suggested_savings, 2),
            "investment_allocation": investment_allocation,
            "risk_profile": risk_profile,
        },
    )
    db.add(savings_plan)
    db.commit()
    db.refresh(savings_plan)

    return {
        "id": savings_plan.id,
        "month": month,
        "income": income,
        "total_expenses": total_expenses,
        "savings_rate": round(rate * 100, 2),
        "emergency_fund_target": round(emergency_fund_target, 2),
        "suggested_savings": round(suggested_savings, 2),
        "suggested_investment": investment_allocation,
        "risk_level": risk_profile,
        "disclaimer": "Educational estimate, not financial advice.",
        "created_at": savings_plan.created_at,
    }
